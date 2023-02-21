import {StormGlass} from '@src/code/client/stormGlass';
import axios from 'axios';
import stormglass_weather_3_hour from '@test/fixtures/stormglass_weather_3_hour.json';
import stormglass_normalized_3_hour from '@test/fixtures/stormglass_normalized_3_hour.json';

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

});