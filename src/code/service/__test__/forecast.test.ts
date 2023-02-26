import { StormGlass } from "@src/code/client/stormGlass";
import stormglass_normalized_3_hour from '@test/fixtures/stormglass_normalized_3_hour.json';
import { Forecast, ForecastProcessingInternalError } from "@src/code/service/forecast";
import { Beach, GeoPosition } from "@src/code/model/beach";

jest.mock('@src/code/client/stormGlass');

describe('Forecast service', () => {

  const mockedStormGlassService = new StormGlass() as 
    jest.Mocked<StormGlass>;

    it('Should return the forecast for a list of beaches', async()=>{

      mockedStormGlassService
        .fetchPoints
        .mockResolvedValue(
          stormglass_normalized_3_hour);

      const beaches: Beach[] = [
        {
          lat: -33.792726,
          lng: 151.289824,
          name: 'Manly',
          position: GeoPosition.E 
        }
      ]

      const expectedResponse = [
        {
          time: "2023-02-21T00:00:00+00:00",
          forecast: [{
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
          }]
        },
        {
          time: "2023-02-21T01:00:00+00:00",
          forecast: [{
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
          }]
        },
        {
          time: "2023-02-21T02:00:00+00:00",
          forecast: [{
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
          }]
        }
      ];

      const forecast = new Forecast(mockedStormGlassService);
      const beachesWithRating = await forecast.
        processForecastForBeaches(beaches);
        
      expect(beachesWithRating).toEqual(expectedResponse);    
    });

    it('Should return an empty list when the beaches array is empty', async()=>{
      const forecast = new Forecast();
      const response = await forecast.processForecastForBeaches([]);
      expect(response).toEqual([]);
    })

    it('should throw internal processing error during the rating', async()=>{
      const beaches: Beach[] = [
        {
          lat: -33.792726,
          lng: 151.289824,
          name: 'Manly',
          position: GeoPosition.E
        }
      ];

      mockedStormGlassService
        .fetchPoints
        .mockRejectedValue('Error fecthing data');

      const forecast = new Forecast(mockedStormGlassService);
      await expect(forecast.processForecastForBeaches(beaches))
        .rejects.toThrow(ForecastProcessingInternalError);
    })
});