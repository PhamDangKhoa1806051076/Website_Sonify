import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type'); // 'sound' or 'img'

        const dataPath = path.join(process.cwd(), 'data', 'file-list.json');
        
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json({ success: false, error: 'File list not generated. Please run build again.' }, { status: 404 });
        }

        const fileListData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const files = type === 'img' ? fileListData.img : fileListData.sound;

        return NextResponse.json({ 
            success: true, 
            files: files 
        });

    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 500 });
    }
}
