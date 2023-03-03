import { ForecastPoint } from '../client/stormGlass';
import { Beach, GeoPosition } from '@src/code/model/beach';

const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: Beach) {}

  public getRatingWindPosition(
    wavePosition: string,
    windPosition: string
  ): number {
    if (wavePosition === windPosition) return 1;
    if (this.isOffShore(wavePosition, windPosition)) return 5;
    return 3;
  }

  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) return 2;
    if (period >= 10 && period < 14) return 4;
    if (period >= 14) return 5;
    return 1;
  }

  public getRatingForSwellSize(height: number): number {
    if (
      height >= waveHeights.ankleToKnee.min &&
      height < waveHeights.ankleToKnee.max
    )
      return 2;

    if (
      height >= waveHeights.waistHigh.min &&
      height < waveHeights.waistHigh.max
    )
      return 3;

    if (height >= waveHeights.headHigh.min) return 5;
    return 1;
  }

  public getPositionFromLocation(position: number): string {
    if ((position >= 0 && position < 45) || (position > 315 && position <= 360))
      return GeoPosition.N;
    if (position >= 45 && position < 135) return GeoPosition.E;
    if (position >= 135 && position < 225) return GeoPosition.S;
    return GeoPosition.W;
  }

  public getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);
    const windWaveRating = this.getRatingWindPosition(
      swellDirection,
      windDirection
    );
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
    return Math.round(
      (windWaveRating + swellHeightRating + swellPeriodRating) / 3
    );
  }

  private isOffShore(wavePosition: string, windPosition: string): boolean {
    return (
      (wavePosition === GeoPosition.N &&
        windPosition === GeoPosition.S &&
        this.beach.position === GeoPosition.N) ||
      (wavePosition === GeoPosition.S &&
        windPosition === GeoPosition.N &&
        this.beach.position === GeoPosition.S) ||
      (wavePosition === GeoPosition.E &&
        windPosition === GeoPosition.W &&
        this.beach.position === GeoPosition.E) ||
      (wavePosition === GeoPosition.W &&
        windPosition === GeoPosition.E &&
        this.beach.position === GeoPosition.W)
    );
  }
}
