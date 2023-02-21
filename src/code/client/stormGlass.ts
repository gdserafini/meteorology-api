import { AxiosStatic } from "axios";

export class StormGlass{
    readonly stormGlassApiParams = 'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed';
    readonly stormGlassApiSource = 'noaa';
    
    constructor(protected request: AxiosStatic){}

    public async fetchPoints(lat: number, lng: number): Promise<{}>{
        return this.request.get(`https://api.stormglass.io/v2/weather/point?params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}&lat=${lat}&lng=${lng}`,
        {headers: {
            'Authorization': '74c90b50-b1f2-11ed-92e6-0242ac130002-74c90c18-b1f2-11ed-92e6-0242ac130002'
        }});
    }
}