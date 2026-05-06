import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { username, password, deviceId } = body;

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 401 });
        }

        // We try both hashed and plain text (for initial migration check)
        // In a real app we would only use compare
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.password as string);
        } catch (error) {
            console.log('Bcrypt error, falling back to plain text check');
        }

        if (!isMatch) {
            isMatch = password === user.password;
        }

        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
        }

        // Handle multi-session / device tracking
        let finalDeviceId = deviceId;
        
        if (!user.sessions) user.sessions = [];
        
        let session = user.sessions.find(s => s.deviceId === deviceId);
        
        if (!session) {
            // New device/session
            finalDeviceId = Math.random().toString(36).substring(2, 15);
            const deviceCount = user.sessions.length + 1;
            user.sessions.push({
                deviceId: finalDeviceId,
                lastActive: new Date(),
                label: `Thiết bị ${deviceCount}`
            });
        } else {
            // Existing device
            session.lastActive = new Date();
        }

        await user.save();

        return NextResponse.json({
            success: true,
            user: {
                username: user.username,
                name: user.name,
                role: user.role,
                deviceId: finalDeviceId // Send back to client to store
            }
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
