import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global {
    var mongoose: {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null;
    } | undefined;
}

if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
}

const cached = global.mongoose as {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
};

async function dbConnect() {
    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            // Connection pool — tuned for Vercel serverless (many short-lived instances)
            maxPoolSize: 10,        // Max concurrent connections per instance
            minPoolSize: 1,         // Keep at least 1 warm connection
            maxIdleTimeMS: 30000,   // Close idle connections after 30s
            serverSelectionTimeoutMS: 10000, // Fail fast if Atlas unreachable
            connectTimeoutMS: 15000,
            socketTimeoutMS: 45000,
            // Heartbeat to detect stale connections
            heartbeatFrequencyMS: 10000,
            // Retries on transient errors
            retryWrites: true,
            retryReads: true,
            bufferCommands: true,
        };

        cached.promise = mongoose
            .connect(MONGODB_URI as string, opts)
            .then((m) => {
                console.log('MongoDB connected');
                return m;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
