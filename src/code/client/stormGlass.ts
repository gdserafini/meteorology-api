import { AxiosStatic } from "axios";

export interface StormGlassPointSource{
    [key: string]: number;
}

export interface StormGlassPoint{
    readonly time: string;
    readonly waveHeight: StormGlassPointSource;
    readonly waveDirection: StormGlassPointSource;
    readonly swellDirection: StormGlassPointSource;
    readonly swellHeight: StormGlassPointSource;
    readonly swellPeriod: StormGlassPointSource;
    readonly windDirection: StormGlassPointSource;
    readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForestResponse{
    hours: StormGlassPoint[]
}

export interface ForecastPoint{
    readonly time: string;
    readonly waveHeight: number;
    readonly waveDirection: number;
    readonly swellDirection: number;
    readonly swellHeight: number;
    readonly swellPeriod: number;
    readonly windDirection: number;
    readonly windSpeed: number;
}

export class StormGlass{
    readonly stormGlassApiParams = 'swellDirection%2CswellHeight%2CswellPeriod%2CwaveDirection%2CwaveHeight%2CwindDirection%2CwindSpeed';
    readonly stormGlassApiSource = 'noaa';
    
    constructor(protected request: AxiosStatic){}

    private isValidPoint(point: Partial<StormGlassPoint>): boolean{
        return !!(
            point.time &&
            point.swellDirection?.[this.stormGlassApiSource] &&
            point.swellHeight?.[this.stormGlassApiSource] &&
            point.swellPeriod?.[this.stormGlassApiSource] &&
            point.waveDirection?.[this.stormGlassApiSource] &&
            point.waveHeight?.[this.stormGlassApiSource] &&
            point.windDirection?.[this.stormGlassApiSource] &&
            point.windSpeed?.[this.stormGlassApiSource]
          );
    }

    private normalizeResponse(
        points: StormGlassForestResponse): ForecastPoint[] {

            return points.hours
                .filter(this.isValidPoint.bind(this))
                .map((point) => ({
                    swellDirection: point.swellDirection[this.stormGlassApiSource],
                    swellHeight: point.swellHeight[this.stormGlassApiSource],
                    swellPeriod: point.swellPeriod[this.stormGlassApiSource],
                    time: point.time,
                    waveDirection: point.waveDirection[this.stormGlassApiSource],
                    waveHeight: point.waveHeight[this.stormGlassApiSource],
                    windDirection: point.windDirection[this.stormGlassApiSource],
                    windSpeed: point.windSpeed[this.stormGlassApiSource],
                }));

    }

    public async fetchPoints(lat: number, lng: number): 
        Promise<ForecastPoint[]>{
            
        const response = await this.request.get<StormGlassForestResponse>(
            `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassApiParams}&source=${this.stormGlassApiSource}&lat=${lat}&lng=${lng}`,
        {headers: {
            'Authorization': '74c90b50-b1f2-11ed-92e6-0242ac130002-74c90c18-b1f2-11ed-92e6-0242ac130002'
        }});

        return this.normalizeResponse(response['data']);
    }
}