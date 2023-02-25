import { ForecastPoint, StormGlass } from "@src/code/client/stormGlass";
import { InternalError } from "@src/util/errors/internal-error";

export enum BeachPosition{
    S = 'S', E = 'E', W = 'W', N = 'N'
}

export interface Beach{
    name: string,
    position: BeachPosition,
    lat: number,
    lng: number,
    user: string
}

export interface TimeForecast{
    time: string,
    forecast: BeachForcast[]
}

export interface BeachForcast extends Omit<Beach, 'user'>, ForecastPoint{}

export class ForecastProcessingInternalError extends InternalError{
    constructor(message: string){
        super(`Unexpected error during the forecast processing: ${message}`)
    }
}

export class Forecast{
    constructor(protected stormGlass = new StormGlass()){}

    private mapForecast(
        forecast: BeachForcast[]): TimeForecast[]{

            const byTime: TimeForecast[] = [];

            for(const point of forecast){
                const timePoint = byTime.find((f) => {
                    f.time === point.time});

                if(timePoint) timePoint.forecast.push(point);
                else byTime.push({
                    time: point.time,
                    forecast: [point]
                })
            }

            return byTime;
    }

    public async processForecastForBeaches(
        beaches: Beach[]): Promise<TimeForecast[]>{
        
            try{
            const pointsWithCorrectSources: BeachForcast[] = [];

            for(const b of beaches){
                const points = await this.stormGlass.fetchPoints(
                    b.lat, b.lng);

                const enriched = points.map((e) => ({
                    ...{
                        lat: b.lat,
                        lng: b.lng,
                        name: b.name,
                        position: b.position,
                        rating: 1
                    },
                    ...e
                }));

                pointsWithCorrectSources.push(...enriched);
            }

            return this.mapForecast(
                pointsWithCorrectSources);
            }
            catch(error){
                throw new ForecastProcessingInternalError(
                    (error as Error).message);
            }
    }
}