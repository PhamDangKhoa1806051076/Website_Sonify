import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

// MONGODB_URI is validated inside dbConnect to allow building/importing without error.


/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
    var mongoose: {
        conn: typeof import('mongoose') | null;
        promise: Promise<typeof import('mongoose')> | null;
    } | undefined;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (!MONGODB_URI) {
        throw new Error(
            'Please define the MONGODB_URI environment variable inside .env.local'
        );
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // TRUE to prevent "findOne before connection" errors
            connectTimeoutMS: 20000,
            socketTimeoutMS: 45000,
        };

        cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
            console.log('--- MONGODB CONNECTED OFFICIALLY ---');
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('--- MONGODB CONNECTION ERROR ---', e);
        throw e;
    }

    return cached.conn;
}

export default dbConnect;
