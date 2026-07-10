import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// Called every ~60s by logged-in clients to signal they're still online
export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, deviceId } = await request.json();

        if (!username || !deviceId) {
            return NextResponse.json({ success: false }, { status: 400 });
        }

        const user = await User.findOne({ username });
        if (!user) return NextResponse.json({ success: false }, { status: 404 });

        const session = user.sessions?.find((s: { deviceId: string }) => s.deviceId === deviceId);
        if (session) {
            session.lastActive = new Date();
            await user.save();
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
