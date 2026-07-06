import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
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
        const { name, slug, description } = body;

        if (!name || !slug) {
            return NextResponse.json({ success: false, error: 'Tên và đường dẫn (slug) là bắt buộc' }, { status: 400 });
        }

        // Verify that the new slug or name is not taken by another category
        const duplicate = await Category.findOne({
            _id: { $ne: id },
            $or: [{ name }, { slug }]
        });

        if (duplicate) {
            return NextResponse.json({ success: false, error: 'Tên thể loại hoặc slug đã được sử dụng bởi danh mục khác' }, { status: 409 });
        }

        const updated = await Category.findByIdAndUpdate(
            id,
            { name, slug, description },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ success: false, error: 'Không tìm thấy thể loại cần cập nhật' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
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

        const deleted = await Category.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ success: false, error: 'Không tìm thấy thể loại cần xóa' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Thể loại đã được xóa thành công' });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
