import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'sound' or 'img'

        const publicDir = path.join(process.cwd(), 'public');
        const targetDir = type === 'img' ? path.join(publicDir, 'img') : path.join(publicDir, 'sound');

        if (!fs.existsSync(targetDir)) {
            return NextResponse.json({ success: false, error: 'Directory not found' }, { status: 404 });
        }

        const files = fs.readdirSync(targetDir);

        // Filter for specific extensions
        const filteredFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            if (type === 'img') {
                return ['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext);
            } else {
                return ['.mp3', '.wav', '.m4a', '.ogg'].includes(ext);
            }
        });

        return NextResponse.json({
            success: true,
            files: filteredFiles
        });

    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
