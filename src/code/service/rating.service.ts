import { Beach, GeoPosition } from '../model/beach';

export class Rating {
  constructor(private beach: Beach) {}

  public getRatingWindPosition(
    wavePosition: GeoPosition,
    windPosition: GeoPosition
  ): number {
    if (wavePosition === windPosition) return 1;
    if (this.isOffShore(wavePosition, windPosition)) return 5;
    return 3;
  }

  public isOffShore(
    wavePosition: GeoPosition,
    windPosition: GeoPosition
  ): boolean {
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
