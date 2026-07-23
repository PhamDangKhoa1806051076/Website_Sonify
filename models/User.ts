import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password?: string; // Hashed password
    name: string;
    phoneNumber?: string;
    role: 'admin' | 'user';
    likedSongs: string[];
    playlists: { id: string, name: string, songIds: string[] }[];
    createdAt: Date;
    sessions: { deviceId: string; lastActive: Date; label: string }[];
    githubId?: string;
    avatarUrl?: string;
}

const UserSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    phoneNumber: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    likedSongs: [{ type: String }],
    playlists: [{
        id: String,
        name: String,
        songIds: [String]
    }],
    createdAt: { type: Date, default: Date.now },
    sessions: [{
        deviceId: String,
        lastActive: { type: Date, default: Date.now },
        label: String
    }],
    githubId: { type: String, sparse: true },
    avatarUrl: { type: String }
});

// Indexes for performance
UserSchema.index({ 'sessions.deviceId': 1 });             // Heartbeat + login lookups
UserSchema.index({ 'sessions.lastActive': 1 });           // Online status queries

// Since Next.js API routes are stateless, we avoid compiling the model multiple times
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
