import _ from 'lodash';
import { ForecastPoint, StormGlass } from '@src/code/client/stormGlass';
import { InternalError } from '@src/util/errors/internal-error';
import { Beach } from '@src/code/model/beach';
import logger from '@src/util/logger';
import { Rating } from '@src/code/service/rating.service';

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
  constructor(
    protected stormGlass = new StormGlass(),
    protected RatingService: typeof Rating = Rating
  ) {}

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

  private enricheData(
    points: ForecastPoint[],
    beach: Beach,
    rating: Rating
  ): BeachForcast[] {
    return points.map((e) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(e),
      },
      ...e,
    }));
  }

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    try {
      const pointsWithCorrectSources: BeachForcast[] = [];
      logger.info(`Preparing the forecast for ${beaches.length} beaches`);
      for (const b of beaches) {
        const rating = new this.RatingService(b);
        const points = await this.stormGlass.fetchPoints(b.lat, b.lng);
        const enriched = this.enricheData(points, b, rating);
        pointsWithCorrectSources.push(...enriched);
      }
      const timeForecast = this.mapForecast(pointsWithCorrectSources);
      return timeForecast.map((t) => ({
        time: t.time,
        forecast: _.orderBy(t.forecast, ['rating'], ['desc']),
      }));
    } catch (error) {
      logger.error(error);
      throw new ForecastProcessingInternalError((error as Error).message);
    }
  }
}
