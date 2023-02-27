import { Beach } from '@src/code/model/beach';

describe('Beaches functional tests', () => {
  beforeAll(async () => Beach.deleteMany({}));

  describe('Create beaches', () => {
    it('Should create a beach with success', async () => {
      const newBeach = {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest
        .post('/v1/beaches')
        .send(newBeach);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newBeach));
    });

    it('Should return 500 when there is a validation error', async () => {
      const newBeach = {
        lat: 'invalid lat - string',
        lng: 151.289824,
        name: 'Manly',
        position: 'E',
      };

      const response = await global.testRequest
        .post('/v1/beaches')
        .send(newBeach);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid lat - string" (type string) at path "lat"',
      });
    });
  });
});
