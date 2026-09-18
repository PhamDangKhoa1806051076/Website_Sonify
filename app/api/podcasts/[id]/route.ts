import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Podcast from '@/models/Podcast';
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

        // Input validation for update
        if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
            return NextResponse.json({ success: false, error: 'Tiêu đề podcast không hợp lệ' }, { status: 400 });
        }
        if (body.description && body.description.length > 5000) {
            return NextResponse.json({ success: false, error: 'Mô tả quá dài (tối đa 5000 ký tự)' }, { status: 400 });
        }

        // Sanitize string inputs
        if (body.title) body.title = body.title.trim();
        if (body.host) body.host = body.host.trim();
        if (body.src) body.src = body.src.trim();
        if (body.cover) body.cover = body.cover.trim();
        if (body.showName) body.showName = body.showName.trim();
        if (body.description) body.description = body.description.trim();

        // Try updating by customId first
        let result = await Podcast.findOneAndUpdate({ customId: id }, body, { new: true });

        if (!result) {
            // Fallback to updating by MongoDB _id
            result = await Podcast.findByIdAndUpdate(id, body, { new: true });
        }

        if (!result) {
            return NextResponse.json({ success: false, error: 'Không tìm thấy podcast để cập nhật' }, { status: 404 });
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

        // Try deleting by customId first
        const result = await Podcast.findOneAndDelete({ customId: id });

        if (!result) {
            // Fallback to deleting by MongoDB _id
            await Podcast.findByIdAndDelete(id);
        }

        return NextResponse.json({ success: true, message: 'Đã xóa podcast thành công' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
