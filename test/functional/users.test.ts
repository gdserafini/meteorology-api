import { User } from '@src/code/model/user';
import AuthService from '@src/code/service/auth';

describe('Users functional tests', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('When creating a new user', () => {
    it('should successfully create a new user', async () => {
      const newUser = {
        name: 'name',
        email: 'email@email.com',
        password: 'password',
      };

      const response = await global.testRequest.post('/v1/users').send(newUser);
      expect(response.status).toBe(201);
      await expect(
        AuthService.comparePassword(newUser.password, response.body.password)
      ).resolves.toBeTruthy();
      expect(response.body).toEqual(
        expect.objectContaining({
          ...newUser,
          ...{ password: expect.any(String) },
        })
      );
    });

    it('should return 422 when there a validation error', async () => {
      const newUser = {
        email: 'email@email.com',
        password: 'password',
      };

      const response = await global.testRequest.post('/v1/users').send(newUser);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        code: 422,
        error: 'User validation failed: name: Path `name` is required.',
      });
    });

    it('should return 409 when the email already exists', async () => {
      const newUser = {
        name: 'name',
        email: 'email@email.com',
        password: 'password',
      };

      await global.testRequest.post('/v1/users').send(newUser);
      const response = await global.testRequest.post('/v1/users').send(newUser);
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        code: 409,
        error:
          'User validation failed: email: already exists in the data base.',
      });
    });
  });
});
