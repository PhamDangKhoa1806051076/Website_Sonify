import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Song from '@/models/Song';
import { initialUsers, songs } from '@/data/constants';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        await dbConnect();

        // 1. Setup default accounts with hashed passwords
        for (const u of initialUsers) {
            const exists = await User.findOne({ username: u.username }).select('_id').lean();
            if (!exists) {
                const hashed = await bcrypt.hash(u.password, 10);
                await User.create({
                    username: u.username,
                    password: hashed,
                    name: u.name,
                    role: u.role,
                    likedSongs: [],
                    sessions: []
                });
            }
        }

        // 2. Migrate songs — bulk insert only missing ones
        const existingCount = await Song.countDocuments();
        let songMsg = `${existingCount} songs already in DB.`;

        if (existingCount === 0) {
            const songsToInsert = songs.map(s => {
                const title = s.title.toLowerCase();
                let category = 'v-pop';
                if (title.includes('daylight') || title.includes('miss you') || title.includes('i just might') || title.includes('da key') || title.includes('back to friends')) {
                    category = 'us-uk';
                } else if (title.includes('lemmeholla') || title.includes('hello em') || title.includes('chạy theo em') || title.includes('tương tư') || title.includes('tửu sầu')) {
                    category = 'lofi-chill';
                }
                return { customId: s.id.toString(), title: s.title, artist: s.artist, cover: s.cover, src: s.src, category };
            });
            await Song.insertMany(songsToInsert, { ordered: false });
            songMsg = `Migrated ${songsToInsert.length} songs.`;
        }

        return NextResponse.json({
            success: true,
            message: 'Setup completed.',
            songs: songMsg
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
