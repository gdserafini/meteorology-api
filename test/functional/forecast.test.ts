import { Beach, GeoPosition } from '@src/code/model/beach';
import nock from 'nock';
import stormglass_weather_3_hour from '@test/fixtures/stormglass_weather_3_hour.json';
import api_forecast_response_1_beach from '@test/fixtures/api_forecast_response_1_beach.json';
import { User } from '@src/code/model/user';
import AuthService from '@src/code/service/auth';
import supertest from 'supertest';
import { SetupServer } from '@src/server';

describe('Beach forecast functional tests', () => {
  const defaultUser = {
    name: 'name',
    email: 'email@email.com',
    password: 'password',
  };
  let token: string;
  let server: SetupServer;
  beforeEach(async () => {
    server = new SetupServer();
    await server.init();
    global.testRequest = supertest(server.getApp());
    await Beach.deleteMany({});
    await User.deleteMany({});
    const user = await new User(defaultUser).save();
    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: GeoPosition.E,
      user: user.id,
    };
    await new Beach(defaultBeach).save();
    token = AuthService.generateToken(user.toJSON());
  });
  afterEach(async () => await server.close());

  it('Should return a forecast with just a few times', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
        params: /(.*)/,
        source: 'noaa',
        end: /(.*)/,
      })
      .reply(200, stormglass_weather_3_hour);

    const { body, status } = await global.testRequest
      .get('/v1/forecast')
      .set({ 'x-access-token': token });
    expect(status).toBe(200);
    expect(body).toEqual(api_forecast_response_1_beach);
  });

  it('Should return 500 if something goes wrong', async () => {
    nock('https://api.stormglass.io:443', {
      encodedQueryParams: true,
      reqheaders: {
        Authorization: (): boolean => true,
      },
    })
      .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
      .get('/v2/weather/point')
      .query({
        lat: '-33.792726',
        lng: '151.289824',
      })
      .replyWithError('Something went wrong');

    const { status } = await global.testRequest
      .get('/v1/forecast')
      .set({ 'x-access-token': token });
    expect(status).toBe(500);
  });
});
