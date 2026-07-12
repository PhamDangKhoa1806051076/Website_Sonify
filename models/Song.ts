import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISong extends Document {
    customId: string; // The ID you previously had in constants.ts like "1", "2"
    title: string;
    artist: string;
    cover: string;
    src: string;
    isOnline?: boolean;
    category?: string;
    createdAt: Date;
}

const SongSchema: Schema = new Schema({
    customId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    artist: { type: String, required: true },
    cover: { type: String, required: true },
    src: { type: String, required: true },
    isOnline: { type: Boolean, default: false },
    category: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

// Index for category filtering queries
SongSchema.index({ category: 1 });
SongSchema.index({ title: 'text', artist: 'text' }); // Text search

const Song: Model<ISong> = mongoose.models.Song || mongoose.model<ISong>('Song', SongSchema);

export default Song;
