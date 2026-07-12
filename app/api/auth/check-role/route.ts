import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { rateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
    // Rate limit: 10 attempts per IP per 10 minutes
    const ip = getClientIp(request);
    const { allowed } = rateLimit(ip, 'check-role', { limit: 10, windowMs: 10 * 60 * 1000 });
    if (!allowed) {
        return NextResponse.json(
            { success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.' },
            { status: 429 }
        );
    }

    try {
        await dbConnect();
        const body = await request.json();
        const { username } = body;

        if (!username || typeof username !== 'string') {
            return NextResponse.json({ success: false, message: 'Vui lòng nhập tên đăng nhập' }, { status: 400 });
        }

        // Use lean() + select() — minimal read, no full document load
        const user = await User.findOne({ username }).select('role').lean();
        if (!user) {
            return NextResponse.json({ success: false, message: 'Không tìm thấy tên đăng nhập này' }, { status: 404 });
        }

        return NextResponse.json({ success: true, role: user.role });
    } catch (error) {
        console.error('Check role error:', error);
        return NextResponse.json({ success: false, message: 'Lỗi hệ thống' }, { status: 500 });
    }
}
