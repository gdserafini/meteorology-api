import { GeoPosition } from '@src/code/model/beach';
import { Rating } from '@src/code/service/rating.service';

describe('Rating service unit tests', () => {
  const defaultBeach = {
    lat: -33.792726,
    lng: 151.289824,
    name: 'Manly',
    position: GeoPosition.E,
    user: 'some-user',
  };
  const defaultRatint = new Rating(defaultBeach);
  describe('Calculate rating for a given point', () => {
    //TODO
  });
  describe('Get rating based on wind and wave position', () => {
    it('Should get rating 1 for a beach with onshore winds', () => {
      const rating = defaultRatint.getRatingWindPosition(
        GeoPosition.E,
        GeoPosition.E
      );
      expect(rating).toBe(1);
    });

    it('Should get rating 1 for a beach with onshore winds', () => {
      const rating = defaultRatint.getRatingWindPosition(
        GeoPosition.E,
        GeoPosition.N
      );
      expect(rating).toBe(3);
    });

    it('Should get rating 1 for a beach with onshore winds', () => {
      const rating = defaultRatint.getRatingWindPosition(
        GeoPosition.E,
        GeoPosition.W
      );
      expect(rating).toBe(5);
    });
  });
});
