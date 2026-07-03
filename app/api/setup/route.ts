import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Song from '@/models/Song';
import { initialUsers, songs } from '@/data/constants';

export async function GET() {
    try {
        await dbConnect();

        // 1. Setup Admin Account
        const adminFound = await User.findOne({ username: 'admin' });
        let adminMsg = 'Admin account already exists.';
        
        if (!adminFound) {
            // Note: In production you MUST hash this password with bcryptjs
            // Quick mock for migration (Will be improved in Auth route)
            const adminMock = initialUsers.find(u => u.role === 'admin');
            if (adminMock) {
                await User.create({
                    username: adminMock.username,
                    password: adminMock.password, // Plain text for now to match old behavior
                    name: adminMock.name,
                    role: 'admin',
                    likedSongs: []
                });
                adminMsg = 'Admin account generated successfully!';
            }
        }

        // 2. Setup Default User Account
        const userFound = await User.findOne({ username: 'user' });
        if (!userFound) {
            const userMock = initialUsers.find(u => u.role === 'user');
            if (userMock) {
                await User.create({
                    username: userMock.username,
                    password: userMock.password, 
                    name: userMock.name,
                    role: 'user',
                    likedSongs: []
                });
            }
        }

        // 3. Migrate Songs from constants.ts to MongoDB
        let songMsg = 'Songs already migrated.';
        const existingSongs = await Song.countDocuments();
        if (existingSongs === 0) {
            const songsToInsert = songs.map(s => {
                let defaultCategory = 'v-pop';
                const title = s.title.toLowerCase();
                if (title.includes('daylight') || title.includes('miss you') || title.includes('i just might') || title.includes('da key') || title.includes('back to friends')) {
                    defaultCategory = 'us-uk';
                } else if (title.includes('lemmeholla') || title.includes('hello em') || title.includes('chạy theo em') || title.includes('dalat mango') || title.includes('tương tư') || title.includes('tửu sầu') || title.includes('người bất an')) {
                    defaultCategory = 'lofi-chill';
                }
                return {
                    customId: s.id.toString(),
                    title: s.title,
                    artist: s.artist,
                    cover: s.cover,
                    src: s.src,
                    category: defaultCategory
                };
            });
            await Song.insertMany(songsToInsert);
            songMsg = `Migrated ${songsToInsert.length} songs to database!`;
        }

        return NextResponse.json({ 
            success: true, 
            admin: adminMsg,
            songs: songMsg,
            message: 'Setup completed successfully!'
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
