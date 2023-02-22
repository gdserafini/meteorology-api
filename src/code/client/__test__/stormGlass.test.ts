import {StormGlass} from '@src/code/client/stormGlass';
import axios from 'axios';
import stormglass_weather_3_hour from '@test/fixtures/stormglass_weather_3_hour.json';
import stormglass_normalized_3_hour from '@test/fixtures/stormglass_normalized_3_hour.json';

jest.mock('axios');

describe('StormGlass client', () => {
    const mockAxios = axios as jest.Mocked<typeof axios>;

    it('should return the normalized forecast from the StormGlass service', async () => {

        mockAxios.get.mockResolvedValue(
            {data: stormglass_weather_3_hour});

        const stormGlass = new StormGlass(mockAxios);
        //lat, lon
        const response = await stormGlass.fetchPoints(-58.7984, 17.8081);

        expect(response).toEqual(stormglass_normalized_3_hour);
    });

    it('should exclude incomplete data points', async () => {

        const incompleteResponse = {
            hours: [{
                windDirection: {
                    noaa: 300
                },
                time: '2020-04-26t00:00:00+00:00'
            }]
        };

        mockAxios.get.mockResolvedValue({
            data: incompleteResponse});

        const stormGlass = new StormGlass(mockAxios);
        const response = await stormGlass.fetchPoints(
            -33.792726, 151.289824);

        expect(response).toEqual([]);
    });

    it('should get a generic error from service when the request fail before.', async () => {

        mockAxios.get.mockRejectedValue({
            message: 'Network error.'});

        const stormGlass = new StormGlass(mockAxios);

        await expect(stormGlass.fetchPoints(
            -33.792726, 151.289824)).rejects.toThrow(
                'Unexpected error: Network error.'
            );
    });

    it('should get StormGlassError when the api-server responds with error.', async () => {

        mockAxios.get.mockRejectedValue({
            response: {
                status: 429,
                data: {errors: ['Rate limit reached']}
            }
        });

        const stormGlass = new StormGlass(mockAxios);

        await expect(stormGlass.fetchPoints(
            -33.792726, 151.289824)).rejects.toThrow(
                'Unexpected error returned: Error: {"errors":["Rate limit reached"]} Code: 429.'
            );
    });

});