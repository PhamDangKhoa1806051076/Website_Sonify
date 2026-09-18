import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAudioBook extends Document {
    customId: string;
    title: string;
    author: string;
    narrator?: string;
    description?: string;
    cover: string;
    src: string;
    category?: string;
    duration?: number;
    chaptersCount?: number;
    isOnline?: boolean;
    createdAt: Date;
}

const AudioBookSchema: Schema = new Schema({
    customId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    narrator: { type: String, default: '' },
    description: { type: String, default: '' },
    cover: { type: String, required: true },
    src: { type: String, required: true },
    category: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    chaptersCount: { type: Number, default: 1 },
    isOnline: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

// Indexes for search and query performance
AudioBookSchema.index({ category: 1 });
AudioBookSchema.index({ author: 1 });
AudioBookSchema.index({ title: 'text', author: 'text', narrator: 'text' });

const AudioBook: Model<IAudioBook> = mongoose.models.AudioBook || mongoose.model<IAudioBook>('AudioBook', AudioBookSchema);

export default AudioBook;
