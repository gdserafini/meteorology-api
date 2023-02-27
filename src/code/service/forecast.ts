import { ForecastPoint, StormGlass } from '@src/code/client/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';
import { Beach } from '@src/code/model/beach';

export interface TimeForecast {
  time: string;
  forecast: BeachForcast[];
}

export interface BeachForcast extends Omit<Beach, 'user'>, ForecastPoint {}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  private mapForecast(forecast: BeachForcast[]): TimeForecast[] {
    const byTime: TimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = byTime.find((f) => {
        f.time === point.time;
      });

      if (timePoint) timePoint.forecast.push(point);
      else
        byTime.push({
          time: point.time,
          forecast: [point],
        });
    }

    return byTime;
  }

  private enricheData(points: ForecastPoint[], beach: Beach): BeachForcast[] {
    return points.map((e) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...e,
    }));
  }

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForcast[] = [];

      for (const b of beaches) {
        const points = await this.stormGlass.fetchPoints(b.lat, b.lng);

        const enriched = this.enricheData(points, b);

        pointsWithCorrectSources.push(...enriched);
      }

      return this.mapForecast(pointsWithCorrectSources);
    } catch (error) {
      throw new ForecastProcessingInternalError((error as Error).message);
    }
  }
}
