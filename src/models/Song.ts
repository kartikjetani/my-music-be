import mongoose, { Document, Schema } from "mongoose";

export interface ISong extends Document {
    _id: string;
    name: string;
    artists: string[];
    duration: number;
    url: string;
    image: string;
}

const songSchema = new Schema<ISong>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    artists: { type: [String], required: true },
    duration: { type: Number, required: true },
    url: { type: String, required: true },
    image: { type: String, required: false },
});

export default mongoose.model<ISong>("Song", songSchema);