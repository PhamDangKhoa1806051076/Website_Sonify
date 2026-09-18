import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AudioBook from '@/models/AudioBook';
import { verifyAdmin } from '@/lib/auth';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await verifyAdmin(request))) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Quyền truy cập bị từ chối' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        // Validation
        if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
            return NextResponse.json({ success: false, error: 'Tên sách không hợp lệ' }, { status: 400 });
        }
        if (body.description && body.description.length > 5000) {
            return NextResponse.json({ success: false, error: 'Mô tả quá dài (tối đa 5000 ký tự)' }, { status: 400 });
        }

        // Sanitize string inputs
        if (body.title) body.title = body.title.trim();
        if (body.author) body.author = body.author.trim();
        if (body.src) body.src = body.src.trim();
        if (body.cover) body.cover = body.cover.trim();
        if (body.narrator) body.narrator = body.narrator.trim();
        if (body.description) body.description = body.description.trim();

        // Update by customId or _id
        let result = await AudioBook.findOneAndUpdate({ customId: id }, body, { new: true });
        if (!result) {
            result = await AudioBook.findByIdAndUpdate(id, body, { new: true });
        }

        if (!result) {
            return NextResponse.json({ success: false, error: 'Không tìm thấy sách nói để cập nhật' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: result });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await verifyAdmin(request))) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Quyền truy cập bị từ chối' }, { status: 403 });
        }

        await dbConnect();
        const { id } = await params;

        const result = await AudioBook.findOneAndDelete({ customId: id });
        if (!result) {
            await AudioBook.findByIdAndDelete(id);
        }

        return NextResponse.json({ success: true, message: 'Đã xóa sách nói thành công' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
