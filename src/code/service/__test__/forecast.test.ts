import { StormGlass } from "@src/code/client/stormGlass";
import stormglass_normalized_3_hour from '@test/fixtures/stormglass_normalized_3_hour.json';
import { Beach, BeachPosition, Forecast } from "@src/code/service/forecast";

jest.mock('@src/code/client/stormGlass');

describe('Forecast service', () => {

    it('Should return the forecast for a list of beaches', async()=>{

      StormGlass.prototype.fetchPoints = jest
        .fn()
        .mockResolvedValue(
          stormglass_normalized_3_hour);

      const beaches: Beach[] = [
        {
          lat: -33.792726,
          lng: 151.289824,
          name: 'Manly',
          position: BeachPosition.E,
          user: 'some-id'
        }
      ]

      const expectedResponse = [
        {
          lat: -33.792726,
          lng: 151.289824,
          name: 'Manly',
          position: 'E',
          rating: 1,
          "swellDirection": 200.88,
          "swellHeight": 0.3,
          "swellPeriod": 6.6,
          "time": "2023-02-21T00:00:00+00:00",
          "waveDirection": 199.95,
          "waveHeight": 0.46,
          "windDirection": 356.65,
          "windSpeed": 3.03
        },
        {
          lat: -33.792726,
          lng: 151.289824,
          name: 'Manly',
          position: 'E',
          rating: 1,
          "swellDirection": 198.8,
          "swellHeight": 0.24,
          "swellPeriod": 7.05,
          "time": "2023-02-21T01:00:00+00:00",
          "waveDirection": 195.09,
          "waveHeight": 0.39,
          "windDirection": 6.13,
          "windSpeed": 2.68
        },
        {
          lat: -33.792726,
          lng: 151.289824,
          name: 'Manly',
          position: 'E',
          rating: 1,
          "swellDirection": 196.71,
          "swellHeight": 0.17,
          "swellPeriod": 7.49,
          "time": "2023-02-21T02:00:00+00:00",
          "waveDirection": 190.23,
          "waveHeight": 0.33,
          "windDirection": 15.62,
          "windSpeed": 2.33
        }
      ];

      const forecast = new Forecast(new StormGlass());
      const beachesWithRating = await forecast.
        processForecastForBeaches(beaches);
        
      expect(beachesWithRating).toEqual(expectedResponse);    
    });
});