import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, password, name, phoneNumber } = await request.json();

        if (!username || !password || !name) {
            return NextResponse.json({ success: false, message: 'Vui lòng điền đủ thông tin bắt buộc' }, { status: 400 });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ success: false, message: 'Tên đăng nhập đã tồn tại' }, { status: 409 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            password: hashedPassword,
            name,
            phoneNumber: phoneNumber || '',
            role: 'user', // Default role
            likedSongs: [],
            playlists: []
        });

        await newUser.save();

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
            message: 'Lỗi hệ thống lưu dữ liệu' 
        }, { status: 500 });
    }
}
