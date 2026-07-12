import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// Max sessions per user — prevents unbounded array growth
const MAX_SESSIONS = 5;

export async function POST(request: Request) {
    // Rate limit: 10 login attempts per IP per 15 minutes
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, 'login', { limit: 10, windowMs: 15 * 60 * 1000 });
    if (!allowed) {
        return NextResponse.json(
            { success: false, message: 'Quá nhiều lần thử. Vui lòng thử lại sau 15 phút.' },
            { status: 429 }
        );
    }

    try {
        await dbConnect();
        const body = await request.json();
        const { username, password, deviceId } = body;

        // Basic input validation
        if (!username || !password) {
            return NextResponse.json({ success: false, message: 'Vui lòng nhập đầy đủ thông tin' }, { status: 400 });
        }

        if (typeof username !== 'string' || username.length > 64) {
            return NextResponse.json({ success: false, message: 'Tên đăng nhập không hợp lệ' }, { status: 400 });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' }, { status: 401 });
        }

        if (!user.password) {
            return NextResponse.json({ success: false, message: 'Tài khoản này không hỗ trợ đăng nhập bằng mật khẩu' }, { status: 401 });
        }

        // Secure bcrypt-only comparison — no plain-text fallback
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' }, { status: 401 });
        }

        // Session management — reuse existing device or create new one
        if (!user.sessions) user.sessions = [];

        const existingSession = user.sessions.find(
            (s: { deviceId: string }) => s.deviceId === deviceId
        );

        let finalDeviceId = deviceId;

        if (existingSession) {
            // Update lastActive without loading all sessions
            await User.updateOne(
                { username, 'sessions.deviceId': deviceId },
                { $set: { 'sessions.$.lastActive': new Date() } }
            );
        } else {
            finalDeviceId = Math.random().toString(36).substring(2, 15);
            const newSession = {
                deviceId: finalDeviceId,
                lastActive: new Date(),
                label: `Thiết bị ${user.sessions.length + 1}`
            };

            // Keep only the last MAX_SESSIONS — evict oldest
            const sessions = [...user.sessions, newSession]
                .sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())
                .slice(0, MAX_SESSIONS);

            await User.updateOne({ username }, { $set: { sessions } });
        }

        return NextResponse.json({
            success: true,
            user: {
                username: user.username,
                name: user.name,
                role: user.role,
                deviceId: finalDeviceId,
                avatarUrl: user.avatarUrl
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau'
        }, { status: 500 });
    }
}
