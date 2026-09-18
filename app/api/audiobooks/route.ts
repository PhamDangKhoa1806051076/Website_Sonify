import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AudioBook from '@/models/AudioBook';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const author = searchParams.get('author');
        const search = searchParams.get('q');

        // Build filter
        const filter: Record<string, unknown> = {};
        if (category) filter.category = category;
        if (author) filter.author = author;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { narrator: { $regex: search, $options: 'i' } }
            ];
        }

        const audiobooks = await AudioBook.find(filter).sort({ createdAt: -1 });

        const formattedBooks = audiobooks.map(b => ({
            id: b.customId,
            title: b.title,
            author: b.author,
            narrator: b.narrator || '',
            description: b.description || '',
            cover: b.cover,
            src: b.src,
            category: b.category || '',
            duration: b.duration || 0,
            chaptersCount: b.chaptersCount || 1,
            isOnline: b.isOnline,
            createdAt: b.createdAt,
            _id: b._id
        }));

        return NextResponse.json({ success: true, data: formattedBooks });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        if (!(await verifyAdmin(request))) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Quyền truy cập bị từ chối' }, { status: 403 });
        }

        await dbConnect();
        const body = await request.json();

        // Validation
        if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Tên sách không được để trống' }, { status: 400 });
        }
        if (!body.author || typeof body.author !== 'string' || body.author.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Tên tác giả không được để trống' }, { status: 400 });
        }
        if (!body.src || typeof body.src !== 'string' || body.src.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Đường dẫn file âm thanh sách không được để trống' }, { status: 400 });
        }
        if (!body.cover || typeof body.cover !== 'string' || body.cover.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Ảnh bìa sách không được để trống' }, { status: 400 });
        }

        if (body.description && body.description.length > 5000) {
            return NextResponse.json({ success: false, error: 'Mô tả quá dài (tối đa 5000 ký tự)' }, { status: 400 });
        }

        if (!body.customId) {
            body.customId = `book-${Date.now()}`;
        }

        // Sanitize string inputs
        body.title = body.title.trim();
        body.author = body.author.trim();
        body.src = body.src.trim();
        body.cover = body.cover.trim();
        if (body.narrator) body.narrator = body.narrator.trim();
        if (body.description) body.description = body.description.trim();

        const audiobook = await AudioBook.create(body);
        return NextResponse.json({ success: true, data: audiobook });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 400 });
    }
}
