import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Song from '@/models/Song';
import User from '@/models/User';
import { songs as defaultSongs } from '@/data/constants';

export const dynamic = 'force-dynamic';

async function verifyAdmin(request: Request): Promise<boolean> {
    try {
        const username = request.headers.get('x-username');
        if (!username) return false;
        await dbConnect();
        const user = await User.findOne({ username });
        return user?.role === 'admin';
    } catch (e) {
        console.error('Error verifying admin:', e);
        return false;
    }
}

export async function GET() {
    try {
        // Attempt to connect and fetch from DB
        try {
            await dbConnect();
            let songs = await Song.find({});

            // AUTO-SETUP: Update empty categories for existing songs in database
            const emptyCatSongs = songs.filter(s => !s.category);
            if (emptyCatSongs.length > 0) {
                console.log(`--- AUTO-UPDATING CATEGORIES FOR ${emptyCatSongs.length} SONGS ---`);
                for (const s of songs) {
                    if (!s.category) {
                        let defaultCategory = 'v-pop'; // Default to V-Pop
                        const title = s.title.toLowerCase();
                        if (title.includes('daylight') || title.includes('miss you') || title.includes('i just might') || title.includes('da key') || title.includes('back to friends')) {
                            defaultCategory = 'us-uk';
                        } else if (title.includes('lemmeholla') || title.includes('hello em') || title.includes('chạy theo em') || title.includes('dalat mango') || title.includes('tương tư') || title.includes('tửu sầu') || title.includes('người bất an')) {
                            defaultCategory = 'lofi-chill';
                        }
                        s.category = defaultCategory;
                        await Song.updateOne({ _id: s._id }, { category: defaultCategory });
                    }
                }
                songs = await Song.find({}); // Refetch updated list
            }

            // AUTO-SETUP: Sync missing default songs if count doesn't match
            if (songs.length < defaultSongs.length) {
                console.log(`--- SYNCING MISSING SONGS (${songs.length} -> ${defaultSongs.length}) ---`);
                for (const s of defaultSongs) {
                    const songId = s.id.toString();
                    const exists = await Song.exists({ customId: songId });
                    if (!exists) {
                        try {
                            // Seed default categories matching default songs
                            let defaultCategory = '';
                            if (s.title.includes('Còn Gì Đẹp Hơn') || s.title.includes('4 Mùa Thương Em') || s.title.includes('Anh Thanh Niên') || s.title.includes('Em Ổn Không')) {
                                defaultCategory = 'v-pop';
                            } else if (s.title.includes('Daylight') || s.title.includes('Miss You') || s.title.includes('I Just Might')) {
                                defaultCategory = 'us-uk';
                            } else if (s.title.includes('Tokyo Cypher') || s.title.includes('Ex\'s Hate Me')) {
                                defaultCategory = 'v-pop';
                            }

                            await Song.create({
                                customId: songId,
                                title: s.title,
                                artist: s.artist,
                                cover: s.cover,
                                src: s.src,
                                category: defaultCategory
                            });
                        } catch (e) {
                            console.error(`Failed to seed song ${songId}:`, e);
                        }
                    }
                }
                songs = await Song.find({}); // Refresh
            }

            if (songs.length > 0) {
                const formattedSongs = songs.map(s => ({
                    id: s.customId,
                    title: s.title,
                    artist: s.artist,
                    cover: s.cover,
                    src: s.src,
                    isOnline: s.isOnline,
                    category: s.category || '',
                    _id: s._id
                }));
                return NextResponse.json({ success: true, data: formattedSongs, source: 'database' });
            }
        } catch (dbError) {
            console.error('Database connection failed, using fallback:', dbError);
        }

        // FALLBACK: If DB fails or is empty, return constants
        console.log('--- USING STATIC FALLBACK DATA ---');
        return NextResponse.json({ 
            success: true, 
            data: defaultSongs.map(s => ({ ...s, category: '' })), 
            source: 'static-fallback',
            dbError: 'Database unavailable, showing default songs.'
        });

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
        
        if (!body.customId) {
            body.customId = Date.now().toString();
        }

        const song = await Song.create(body);
        return NextResponse.json({ success: true, data: song });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 400 });
    }
}
