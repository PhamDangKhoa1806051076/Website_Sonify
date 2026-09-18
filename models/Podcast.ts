import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPodcast extends Document {
    customId: string;
    title: string;
    host: string;
    description?: string;
    cover: string;
    src: string;
    category?: string;
    duration?: number;
    episodeNumber?: number;
    showName?: string;
    isOnline?: boolean;
    createdAt: Date;
}

const PodcastSchema: Schema = new Schema({
    customId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    host: { type: String, required: true },
    description: { type: String, default: '' },
    cover: { type: String, required: true },
    src: { type: String, required: true },
    category: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    episodeNumber: { type: Number, default: 0 },
    showName: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Indexes for common queries
PodcastSchema.index({ category: 1 });
PodcastSchema.index({ showName: 1 });
PodcastSchema.index({ title: 'text', host: 'text', showName: 'text' });

const Podcast: Model<IPodcast> = mongoose.models.Podcast || mongoose.model<IPodcast>('Podcast', PodcastSchema);

export default Podcast;
