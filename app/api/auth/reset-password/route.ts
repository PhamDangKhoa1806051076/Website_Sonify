import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, authKey, newPassword } = await request.json();

        if (!username || !authKey || !newPassword) {
            return NextResponse.json({ success: false, message: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ success: false, message: 'Không tìm thấy tên đăng nhập này' }, { status: 404 });
        }

        // Kiểm tra quyền và logic xác thực dựa vào loại tài khoản
        if (user.role === 'admin') {
            if (authKey !== '123') {
                return NextResponse.json({ success: false, message: 'Mật khẩu tạm xác thực không đúng' }, { status: 401 });
            }
        } else {
            // Là người dùng thông thường
            if (!user.phoneNumber) {
                return NextResponse.json({ success: false, message: 'Tài khoản chưa cập nhật số điện thoại' }, { status: 400 });
            }
            if (user.phoneNumber !== authKey) {
                return NextResponse.json({ success: false, message: 'Số điện thoại xác thực không đúng' }, { status: 401 });
            }
        }

        // Cập nhật mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Đổi mật khẩu thành công!'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ 
            success: false, 
            message: 'Lỗi hệ thống, vui lòng thử lại sau.' 
        }, { status: 500 });
    }
}
