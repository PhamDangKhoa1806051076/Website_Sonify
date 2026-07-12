import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Called every ~60s by logged-in clients — must be as cheap as possible
export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { username, deviceId } = body;

        if (!username || !deviceId || typeof username !== 'string') {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        // Targeted $set on the specific session — no full document load/save
        const result = await User.updateOne(
            { username, 'sessions.deviceId': deviceId },
            { $set: { 'sessions.$.lastActive': new Date() } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ success: false }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
