import mongoose, { Document} from "mongoose";

export enum BeachPosition{
    S = 'S', E = 'E', W = 'W', N = 'N'
}

export interface Beach{
    name: string,
    position: BeachPosition,
    lat: number,
    lng: number,
    _id?: string 
}

const schema = new mongoose.Schema(
{
    lat: {type: Number, require: true},
    lng: {type: Number, require: true},
    name: {type: String, require: true},
    position: {type: String, require: true}
},
{
    toJSON: {
        transform: (_, ret): void => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
});

interface BeachModel extends Omit<Beach, '_id'>, Document{}
export const Beach = mongoose.model<BeachModel>('Beach', schema);