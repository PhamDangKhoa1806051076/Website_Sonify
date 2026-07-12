import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

// Validate username: only alphanumeric + underscore, 3-32 chars
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,32}$/;

export async function POST(request: Request) {
    // Rate limit: 5 registrations per IP per hour
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, 'register', { limit: 5, windowMs: 60 * 60 * 1000 });
    if (!allowed) {
        return NextResponse.json(
            { success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' },
            { status: 429 }
        );
    }

    try {
        await dbConnect();
        const body = await request.json();
        const { username, password, name, phoneNumber } = body;

        // Input validation
        if (!username || !password || !name) {
            return NextResponse.json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc' }, { status: 400 });
        }

        if (!USERNAME_REGEX.test(username)) {
            return NextResponse.json({
                success: false,
                message: 'Tên đăng nhập chỉ được chứa chữ cái, số, dấu gạch dưới (3-32 ký tự)'
            }, { status: 400 });
        }

        if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
            return NextResponse.json({
                success: false,
                message: 'Mật khẩu phải từ 6 đến 128 ký tự'
            }, { status: 400 });
        }

        if (typeof name !== 'string' || name.trim().length < 2 || name.length > 64) {
            return NextResponse.json({ success: false, message: 'Tên không hợp lệ' }, { status: 400 });
        }

        const existingUser = await User.findOne({ username }).select('_id').lean();
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Tên đăng nhập đã tồn tại' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username.toLowerCase(),
            password: hashedPassword,
            name: name.trim(),
            phoneNumber: phoneNumber?.trim() || '',
            role: 'user',
            likedSongs: [],
            playlists: [],
            sessions: []
        });

        return NextResponse.json({
            success: true,
            user: {
                username: newUser.username,
                name: newUser.name,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({
            success: false,
            message: 'Lỗi hệ thống, vui lòng thử lại sau'
        }, { status: 500 });
    }
}
