import mongoose from 'mongoose';

export enum GeoPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N',
}

export interface Beach {
  name: string;
  position: GeoPosition;
  lat: number;
  lng: number;
}

export interface ExistingBeach extends Beach {
  id: string;
}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Beach = mongoose.model<Beach>('Beach', schema);
