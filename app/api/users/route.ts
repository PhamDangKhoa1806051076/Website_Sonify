import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function verifyAdmin(request: Request): Promise<boolean> {
    try {
        const username = request.headers.get('x-username');
        if (!username) return false;
        await dbConnect();
        const user = await User.findOne({ username });
        return user?.role === 'admin';
    } catch {
        return false;
    }
}

export async function GET(request: Request) {
    try {
        if (!(await verifyAdmin(request))) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Quyền truy cập bị từ chối' }, { status: 403 });
        }

        await dbConnect();
        const users = await User.find({}, '-password'); // Don't return passwords
        return NextResponse.json({ success: true, data: users });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function PATCH(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { username, likedSongs, playlists, role } = body;

        if (!username) {
            return NextResponse.json({ success: false, error: 'Username is required' }, { status: 400 });
        }

        const requester = request.headers.get('x-username');
        if (!requester) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Thiếu người dùng yêu cầu' }, { status: 401 });
        }

        // Check if requester is an admin
        const requesterUser = await User.findOne({ username: requester });
        const isRequesterAdmin = requesterUser?.role === 'admin';

        // Authorized if updating own account, or if requester is admin
        if (requester !== username && !isRequesterAdmin) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Không có quyền cập nhật tài khoản này' }, { status: 403 });
        }

        const updateData: {
            likedSongs?: string[];
            playlists?: { id: string; name: string; songIds: string[] }[];
            role?: 'admin' | 'user';
        } = {};

        // Normal users can only update their own playlists/likedSongs
        if (requester === username) {
            if (likedSongs !== undefined) updateData.likedSongs = likedSongs;
            if (playlists !== undefined) updateData.playlists = playlists;
        }

        // Admins can update roles of other users (with safety checks)
        if (isRequesterAdmin && role !== undefined) {
            if (username === 'admin' && role !== 'admin') {
                return NextResponse.json({ success: false, error: 'Không thể hạ quyền của tài khoản admin mặc định' }, { status: 400 });
            }
            if (username === requester && role !== 'admin') {
                return NextResponse.json({ success: false, error: 'Bạn không thể tự hạ quyền quản trị viên của chính mình' }, { status: 400 });
            }
            updateData.role = role;
        }

        const user = await User.findOneAndUpdate(
            { username },
            updateData,
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ success: false, error: 'Không tìm thấy người dùng' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function DELETE(request: Request) {
    try {
        if (!(await verifyAdmin(request))) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Quyền truy cập bị từ chối' }, { status: 403 });
        }

        await dbConnect();
        const url = new URL(request.url);
        const username = url.searchParams.get('username');
        
        if (!username) {
            return NextResponse.json({ success: false, error: 'Thiếu tên đăng nhập' }, { status: 400 });
        }

        const userToDelete = await User.findOne({ username });
        if (!userToDelete) {
            return NextResponse.json({ success: false, error: 'Không tìm thấy người dùng' }, { status: 404 });
        }

        if (userToDelete.role === 'admin') {
            return NextResponse.json({ success: false, error: 'Không thể xóa tài khoản Quản trị viên' }, { status: 403 });
        }

        await User.deleteOne({ username });
        return NextResponse.json({ success: true, message: 'Đã xóa tài khoản' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Lỗi hệ thống' }, { status: 500 });
    }
}
