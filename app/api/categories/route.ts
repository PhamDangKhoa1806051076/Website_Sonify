import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import User from '@/models/User';

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
        await dbConnect();
        let categories = await Category.find({}).sort({ name: 1 });

        // Auto-seed default categories if database is empty
        if (categories.length === 0) {
            console.log('--- SEEDING DEFAULT CATEGORIES ---');
            const defaultCategories = [
                { name: 'V-Pop', slug: 'v-pop', description: 'Nhạc trẻ Việt Nam sôi động và cảm xúc' },
                { name: 'US-UK', slug: 'us-uk', description: 'Nhạc Âu Mỹ thịnh hành chất lượng cao' },
                { name: 'C-Pop', slug: 'c-pop', description: 'Nhạc Hoa ngữ trữ tình và lôi cuốn' },
                { name: 'Lofi Chill', slug: 'lofi-chill', description: 'Giai điệu lofi nhẹ nhàng thư giãn học tập' }
            ];

            for (const cat of defaultCategories) {
                await Category.create(cat);
            }
            categories = await Category.find({}).sort({ name: 1 });
        }

        return NextResponse.json({ success: true, data: categories });
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
        const { name, slug, description } = body;

        if (!name || !slug) {
            return NextResponse.json({ success: false, error: 'Tên và đường dẫn (slug) là bắt buộc' }, { status: 400 });
        }

        const existing = await Category.findOne({ $or: [{ name }, { slug }] });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Tên thể loại hoặc slug đã tồn tại' }, { status: 409 });
        }

        const category = await Category.create({ name, slug, description });
        return NextResponse.json({ success: true, data: category });
    } catch (error) {
        return NextResponse.json({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        }, { status: 400 });
    }
}
