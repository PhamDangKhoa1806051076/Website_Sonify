import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { initialUsers } from '@/data/constants';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { username, password, deviceId } = body;

        // AUTO-SETUP: Ensure default accounts exist and passwords are correct
        for (const u of initialUsers) {
            const userDoc = await User.findOne({ username: u.username });
            if (!userDoc) {
                console.log(`--- AUTO-SEEDING USER: ${u.username} ---`);
                await User.create({
                    ...u,
                    likedSongs: [],
                    sessions: []
                });
            } else {
                // RECOVERY: Force reset default passwords if they exist but are wrong
                if (userDoc.password !== u.password) {
                    console.log(`--- RECOVERING USER PASSWORD: ${u.username} ---`);
                    userDoc.password = u.password;
                    await userDoc.save();
                }
            }
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 401 });
        }

        // We try both hashed and plain text (for initial migration check)
        // In a real app we would only use compare
        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.password as string);
        } catch {
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
        
        const session = user.sessions.find(s => s.deviceId === deviceId);
        
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
        const errMsg = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ 
            success: false, 
            message: `Lỗi Hệ Thống: ${errMsg}` 
        }, { status: 500 });
    }
}
