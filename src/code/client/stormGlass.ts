import { InternalError } from '@src/util/errors/internal-error';
import { AxiosError } from 'axios';
import config, { IConfig } from 'config';
import * as HttpUtil from '@src/util/request';
import { TimeUtil } from '@src/util/time';

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  readonly time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForestResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  readonly time: string;
  readonly waveHeight: number;
  readonly waveDirection: number;
  readonly swellDirection: number;
  readonly swellHeight: number;
  readonly swellPeriod: number;
  readonly windDirection: number;
  readonly windSpeed: number;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error returned';
    super(`${internalMessage}: ${message}`);
  }
}

const stormGlassResourceConfig: IConfig = config.get(
  'App.resources.StormGlass'
);

export class StormGlass {
  readonly stormGlassApiParams =
    'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed';
  readonly stormGlassApiSource = 'noaa';

  constructor(protected request = new HttpUtil.Request()) {}

  private isValidPoint(point: Partial<StormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassApiSource] &&
      point.swellHeight?.[this.stormGlassApiSource] &&
      point.swellPeriod?.[this.stormGlassApiSource] &&
      point.waveDirection?.[this.stormGlassApiSource] &&
      point.waveHeight?.[this.stormGlassApiSource] &&
      point.windDirection?.[this.stormGlassApiSource] &&
      point.windSpeed?.[this.stormGlassApiSource]
    );
  }

  private normalizeResponse(points: StormGlassForestResponse): ForecastPoint[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.stormGlassApiSource],
      swellHeight: point.swellHeight[this.stormGlassApiSource],
      swellPeriod: point.swellPeriod[this.stormGlassApiSource],
      time: point.time,
      waveDirection: point.waveDirection[this.stormGlassApiSource],
      waveHeight: point.waveHeight[this.stormGlassApiSource],
      windDirection: point.windDirection[this.stormGlassApiSource],
      windSpeed: point.windSpeed[this.stormGlassApiSource],
    }));
  }

  public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const endTimeStamp = TimeUtil.getUnixTimeForAFutureDay(1);
    try {
      const response = await this.request.get<StormGlassForestResponse>(
        `${stormGlassResourceConfig.get('apiUrl')}/weather/point?params=${
          this.stormGlassApiParams
        }&source=${
          this.stormGlassApiSource
        }&lat=${lat}&lng=${lng}&end=${endTimeStamp}`,
        {
          headers: {
            Authorization: stormGlassResourceConfig.get('apiToken'),
          },
        }
      );

      return this.normalizeResponse(response['data']);
    } catch (error: unknown) {
      if (HttpUtil.Request.isRequestError(error as AxiosError)) {
        throw new StormGlassError(
          `Error: ${JSON.stringify(
            (error as AxiosError).response?.data
          )} Code: ${(error as AxiosError).response?.status}.`
        );
      }

      throw new ClientRequestError((error as Error).message);
    }
  }
}
