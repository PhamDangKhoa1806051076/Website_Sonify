import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('--- HEALTH CHECK START ---');
        const start = Date.now();
        
        await dbConnect();
        
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        const duration = Date.now() - start;

        return NextResponse.json({
            status: 'ok',
            database: dbStatus,
            duration: `${duration}ms`,
            environment: process.env.NODE_ENV,
            hasMongoUri: !!process.env.MONGODB_URI,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('--- HEALTH CHECK FAILED ---', error);
        return NextResponse.json({
            status: 'error',
            message: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
