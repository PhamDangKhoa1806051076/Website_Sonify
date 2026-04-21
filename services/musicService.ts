import { Song } from '@/data/constants';

export async function searchOnlineSongs(query: string): Promise<Song[]> {
    if (!query.trim()) return [];

    try {
        // We use the iTunes Search API to get high-quality metadata
        const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=30`);
        const data = await response.json();

        return data.results.map((item: { 
            trackId: number; 
            trackName: string; 
            artistName: string; 
            artworkUrl100: string; 
            previewUrl: string; 
        }) => ({
            id: `online-${item.trackId}`,
            title: item.trackName,
            artist: item.artistName,
            cover: item.artworkUrl100.replace('100x100', '600x600'), // Get higher res cover
            src: item.previewUrl, // Default to preview
            isOnline: true,
            youtubeSearch: `${item.trackName} ${item.artistName} lyrics`
        }));
    } catch (error) {
        console.error('Error searching online songs:', error);
        return [];
    }
}

export async function getTrendingSongs(): Promise<Song[]> {
    return fetchItunesChart('us', 50); // Using US as a proxy for trending/global
}

export async function getGlobalTopSongs(): Promise<Song[]> {
    return fetchItunesChart('us', 50); // iTunes US for Global approximation
}

export async function getVietnamTopSongs(): Promise<Song[]> {
    return fetchItunesChart('vn', 50); // iTunes VN for Vietnam Top
}

export async function getMostListenedSongs(): Promise<Song[]> {
    // We can use UK or another popular region, or just standard pop hits as a proxy
    return fetchItunesChart('gb', 50);
}

async function fetchItunesChart(country: string, limit: number): Promise<Song[]> {
    try {
        const response = await fetch(`https://itunes.apple.com/${country}/rss/topsongs/limit=${limit}/json`);
        const data = await response.json();

        if (!data.feed || !data.feed.entry) return [];

        return data.feed.entry.map((entry: { 
            id: { attributes: { 'im:id': string } };
            'im:name': { label: string };
            'im:artist': { label: string };
            'im:image': { label: string }[];
            link: { attributes: { href: string } }[];
        }) => {
            const trackId = entry.id.attributes['im:id'];
            return {
                id: `chart-${country}-${trackId}`,
                title: entry['im:name'].label,
                artist: entry['im:artist'].label,
                // Replace 170x170 with 600x600 for high quality
                cover: entry['im:image'][2]?.label.replace(/\/\d+x\d+/, '/600x600') || '',
                src: entry.link[1]?.attributes?.href || '', // Preview URL
                isOnline: true,
                youtubeSearch: `${entry['im:name'].label} ${entry['im:artist'].label} lyrics`
            };
        });
    } catch (error) {
        console.error(`Error fetching ${country} chart songs:`, error);
        return [];
    }
}
