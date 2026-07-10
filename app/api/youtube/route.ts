import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query) {
        return NextResponse.json({ success: false, error: 'Query is required' }, { status: 400 });
    }

    try {
        // We use a public search result page and parse the first video ID
        // This is a common workaround when no API key is available
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
        const response = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await response.text();
        
        // Regex to find videoId in the YouTube results page
        // Look for "videoId":"..."
        const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/;
        const match = html.match(regex);

        if (match && match[1]) {
            return NextResponse.json({ success: true, videoId: match[1] });
        }

        return NextResponse.json({ success: false, error: 'No video found' }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
