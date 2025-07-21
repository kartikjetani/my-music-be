import mongoose, { Document, Schema } from "mongoose";

export interface IPlaylist extends Document {
    name: string;
    description: string;
    songs: string[];
    userIds: string[];
    images: string[];
}

const playlistSchema = new Schema<IPlaylist>({
    name: { type: String, required: true },
    description: { type: String, required: false },
    songs: { type: [String], required: false },
    userIds: { type: [String], required: false, default: [] },
    images: { type: [String], required: false, default: [] },
});

export default mongoose.model<IPlaylist>("Playlist", playlistSchema);
