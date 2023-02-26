import { Beach, GeoPosition } from "@src/code/model/beach";
import nock from 'nock';
import stormglass_weather_3_hour from '@test/fixtures/stormglass_weather_3_hour.json';
import api_forecast_response_1_beach from '@test/fixtures/api_forecast_response_1_beach.json';

describe('Beach forecast functional tests', () => {

  beforeEach(async () => {
    await Beach.deleteMany({});

    const defaultBeach = {
      lat: -33.792726,
      lng: 151.289824,
      name: 'Manly',
      position: GeoPosition.E,
    }

    const beach = new Beach(defaultBeach);
    await beach.save();
  })

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
      })
      .reply(200, stormglass_weather_3_hour);

    const { body, status } = await global.testRequest.get('/v1/forecast');
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
        lng: '151.289824'
      })
      .replyWithError('Something went wrong');

    const {status } = await global.testRequest.get('/v1/forecast');
    expect(status).toBe(500);
  });
});
