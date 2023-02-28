import { Beach } from '@src/code/model/beach';
import { User } from '@src/code/model/user';
import AuthService from '@src/code/service/auth';

describe('Beaches functional tests', () => {
  const defaultUser = {
    name: 'name',
    email: 'email@email.com',
    password: 'password',
  };
  let token: string;
  beforeEach(async () => {
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    token = AuthService.generateToken(user.toJSON());
  });
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
        .set({ 'x-access-token': token })
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
        .set({ 'x-access-token': token })
        .send(newBeach);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error:
          'Beach validation failed: lat: Cast to Number failed for value "invalid lat - string" (type string) at path "lat"',
      });
    });
  });
});
