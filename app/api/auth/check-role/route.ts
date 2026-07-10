import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username } = await request.json();

        if (!username) {
            return NextResponse.json({ success: false, message: 'Vui lòng nhập tên đăng nhập' }, { status: 400 });
        }

        const user = await User.findOne({ username }).select('role');
        if (!user) {
            return NextResponse.json({ success: false, message: 'Không tìm thấy tên đăng nhập này' }, { status: 404 });
        }

        return NextResponse.json({ success: true, role: user.role });
    } catch (error) {
        console.error('Check role error:', error);
        return NextResponse.json({ success: false, message: 'Lỗi hệ thống' }, { status: 500 });
    }
}
