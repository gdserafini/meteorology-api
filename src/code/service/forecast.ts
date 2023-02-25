import { ForecastPoint, StormGlass } from "@src/code/client/stormGlass";

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

export interface BeachForcast extends Omit<Beach, 'user'>, ForecastPoint{

}

export class Forecast{
    constructor(protected stormGlass = new StormGlass()){}

    public async processForecastForBeaches(
        beaches: Beach[]): Promise<BeachForcast[]>{
        
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

            return pointsWithCorrectSources;
    }
}