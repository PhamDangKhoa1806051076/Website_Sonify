import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Podcast from '@/models/Podcast';
import { verifyAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const showName = searchParams.get('show');
        const search = searchParams.get('q');

        // Build filter
        const filter: Record<string, unknown> = {};
        if (category) filter.category = category;
        if (showName) filter.showName = showName;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { host: { $regex: search, $options: 'i' } },
                { showName: { $regex: search, $options: 'i' } }
            ];
        }

        const podcasts = await Podcast.find(filter).sort({ createdAt: -1 });

        const formattedPodcasts = podcasts.map(p => ({
            id: p.customId,
            title: p.title,
            host: p.host,
            description: p.description,
            cover: p.cover,
            src: p.src,
            category: p.category || '',
            duration: p.duration || 0,
            episodeNumber: p.episodeNumber || 0,
            showName: p.showName || '',
            isOnline: p.isOnline,
            createdAt: p.createdAt,
            _id: p._id
        }));

        return NextResponse.json({ success: true, data: formattedPodcasts });
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

        // Input validation
        if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Tiêu đề podcast không được để trống' }, { status: 400 });
        }
        if (!body.host || typeof body.host !== 'string' || body.host.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Tên host không được để trống' }, { status: 400 });
        }
        if (!body.src || typeof body.src !== 'string' || body.src.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Đường dẫn audio không được để trống' }, { status: 400 });
        }
        if (!body.cover || typeof body.cover !== 'string' || body.cover.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Ảnh bìa không được để trống' }, { status: 400 });
        }

        // Reject oversized payloads (description max 5000 chars)
        if (body.description && body.description.length > 5000) {
            return NextResponse.json({ success: false, error: 'Mô tả quá dài (tối đa 5000 ký tự)' }, { status: 400 });
        }

        if (!body.customId) {
            body.customId = `pod-${Date.now()}`;
        }

        // Sanitize string inputs
        body.title = body.title.trim();
        body.host = body.host.trim();
        body.src = body.src.trim();
        body.cover = body.cover.trim();
        if (body.showName) body.showName = body.showName.trim();
        if (body.description) body.description = body.description.trim();

        const podcast = await Podcast.create(body);
        return NextResponse.json({ success: true, data: podcast });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 400 });
    }
}
