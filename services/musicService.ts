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
    try {
        // iTunes RSS Hot Songs (VN)
        const response = await fetch('https://itunes.apple.com/vn/rss/topsongs/limit=50/json');
        const data = await response.json();
        return parseRSSFeed(data);
    } catch (error) {
        console.error('Error fetching trending songs:', error);
        return [];
    }
}

export async function getChineseTopSongs(): Promise<Song[]> {
    try {
        // Fetch more to account for filtering (International hits are common in HK store)
        const response = await fetch('https://itunes.apple.com/hk/rss/topsongs/limit=150/json');
        const data = await response.json();
        const allSongs = parseRSSFeed(data);
        
        // Filter for Chinese hits (using Hanzi character check)
        const chineseRegex = /[\u4e00-\u9fa5]/;
        return allSongs
            .filter(song => chineseRegex.test(song.title) || chineseRegex.test(song.artist))
            .slice(0, 50);
    } catch (error) {
        console.error('Error fetching Chinese top songs:', error);
        return [];
    }
}

export async function getVietnamTopSongs(): Promise<Song[]> {
    try {
        // Fetch more to account for filtering (International hits are common in VN store)
        const response = await fetch('https://itunes.apple.com/vn/rss/topsongs/limit=200/json');
        const data = await response.json();
        const allSongs = parseRSSFeed(data);
        
        // Filter for Vietnamese hits (using Vietnamese diacritics check)
        const vnRegex = /[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/;
        return allSongs
            .filter(song => vnRegex.test(song.title) || vnRegex.test(song.artist))
            .slice(0, 50);
    } catch (error) {
        console.error('Error fetching VN top songs:', error);
        return [];
    }
}

export async function getYoutubeTrendingSongs(): Promise<Song[]> {
    try {
        // Proxy using Top Music Videos VN
        const response = await fetch('https://itunes.apple.com/vn/rss/topmusicvideos/limit=50/json');
        const data = await response.json();
        return parseRSSFeed(data);
    } catch (error) {
        console.error('Error fetching Youtube trending songs:', error);
        return [];
    }
}

export async function getGlobalTopSongs(): Promise<Song[]> {
    try {
        // iTunes RSS Top Songs (Global/US)
        const response = await fetch('https://itunes.apple.com/us/rss/topsongs/limit=50/json');
        const data = await response.json();
        return parseRSSFeed(data);
    } catch (error) {
        console.error('Error fetching global top songs:', error);
        return [];
    }
}

interface RSSEntry {
    id: { attributes: { 'im:id': string } };
    'im:name': { label: string };
    'im:artist': { label: string };
    'im:image': { label: string }[];
    link: { attributes?: { href: string } }[];
}

function parseRSSFeed(data: { feed?: { entry?: RSSEntry[] } }): Song[] {
    if (!data.feed || !data.feed.entry) return [];

    return data.feed.entry.map((entry) => {
        const trackId = entry.id.attributes['im:id'];
        return {
            id: `chart-${trackId}-${Math.random().toString(36).substr(2, 5)}`, // ensure unique ids
            title: entry['im:name'].label,
            artist: entry['im:artist'].label,
            cover: entry['im:image'][2].label.replace(/\/\d+x\d+/, '/600x600'),
            src: entry.link[1]?.attributes?.href || entry.link[0]?.attributes?.href || '', 
            isOnline: true,
            youtubeSearch: `${entry['im:name'].label} ${entry['im:artist'].label} lyrics`
        };
    });
}
