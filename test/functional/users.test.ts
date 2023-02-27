import { User } from '@src/code/model/user';

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
      expect(response.body).toEqual(expect.objectContaining(newUser));
    });
  });
});
