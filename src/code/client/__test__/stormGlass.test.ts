import {StormGlass} from '@src/code/client/stormGlass';
//import axios from 'axios';
import stormglass_weather_3_hour from '@test/fixtures/stormglass_weather_3_hour.json';
import stormglass_normalized_3_hour from '@test/fixtures/stormglass_normalized_3_hour.json';
import * as HttpUtil from '@src/util/request';

jest.mock('@src/util/request');

describe('StormGlass client', () => {
    //const mockRequest = axios as jest.Mocked<typeof axios>;
    const mockRequest = new HttpUtil.Request() as jest.Mocked<
        HttpUtil.Request>;
    const mockRequestClass = HttpUtil.Request as jest.Mocked<
        typeof HttpUtil.Request>;

    it('should return the normalized forecast from the StormGlass service', async () => {

        mockRequest.get.mockResolvedValue(
            {data: stormglass_weather_3_hour} as HttpUtil.Response);

        const stormGlass = new StormGlass(mockRequest);
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

        mockRequest.get.mockResolvedValue({
            data: incompleteResponse} as HttpUtil.Response);

        const stormGlass = new StormGlass(mockRequest);
        const response = await stormGlass.fetchPoints(
            -33.792726, 151.289824);

        expect(response).toEqual([]);
    });

    it('should get a generic error from service when the request fail before.', async () => {

        mockRequest.get.mockRejectedValue({
            message: 'Network error.'});

        const stormGlass = new StormGlass(mockRequest);

        await expect(stormGlass.fetchPoints(
            -33.792726, 151.289824)).rejects.toThrow(
                'Unexpected error: Network error.'
            );
    });

    it('should get StormGlassError when the api-server responds with error.', async () => {

        mockRequestClass.isRequestError.mockReturnValue(true);
        
        mockRequest.get.mockRejectedValue({
            response: {
                status: 429,
                data: {errors: ['Rate limit reached']}
            }
        });

        const stormGlass = new StormGlass(mockRequest);

        await expect(stormGlass.fetchPoints(
            -33.792726, 151.289824)).rejects.toThrow(
                'Unexpected error returned: Error: {"errors":["Rate limit reached"]} Code: 429.'
            );
    });

});