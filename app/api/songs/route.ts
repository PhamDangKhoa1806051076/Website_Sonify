import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Song from '@/models/Song';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        const songs = await Song.find({});
        // Map _id to id so frontend doesn't break
        const formattedSongs = songs.map(s => ({
            id: s.customId,
            title: s.title,
            artist: s.artist,
            cover: s.cover,
            src: s.src,
            isOnline: s.isOnline,
            _id: s._id // keep raw id if needed
        }));
        return NextResponse.json({ success: true, data: formattedSongs });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        
        // Auto generate customId if missing
        if (!body.customId) {
            body.customId = Date.now().toString();
        }

        const song = await Song.create(body);
        return NextResponse.json({ success: true, data: song });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 400 });
    }
}
