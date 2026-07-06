import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Song from '@/models/Song';
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

        // Try updating by customId first
        let result = await Song.findOneAndUpdate({ customId: id }, body, { new: true });
        
        if (!result) {
            // Fallback to updating by MongoDB _id
            result = await Song.findByIdAndUpdate(id, body, { new: true });
        }

        if (!result) {
            return NextResponse.json({ success: false, error: 'Không tìm thấy bài hát để cập nhật' }, { status: 404 });
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
        const result = await Song.findOneAndDelete({ customId: id });
        
        if (!result) {
            // Fallback to deleting by MongoDB _id
            await Song.findByIdAndDelete(id);
        }

        return NextResponse.json({ success: true, message: 'Đã xóa bài hát thành công' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
