'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import { useAuth } from './AuthContext';
import { Song } from '@/data/constants';

interface PlayerContextType {
    currentSong: Song | null;
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    volume: number;
    isShuffle: boolean;
    isRepeat: boolean;
    playSong: (song: Song) => void;
    togglePlay: () => void;
    nextSong: () => void;
    prevSong: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    likedSongs: (number | string)[];
    toggleLike: (songId: number | string) => void;
    playlists: { id: string, name: string, songIds: (number | string)[] }[];
    createPlaylist: (name: string) => void;
    deletePlaylist: (id: string) => void;
    addToPlaylist: (playlistId: string, songId: number | string) => void;
    removeFromPlaylist: (playlistId: string, songId: number | string) => void;
    createAndAddToPlaylist: (name: string, songId: number | string) => void;
    queue: Song[];
    allSongs: Song[];
    addToNextUp: (song: Song) => void;
    refreshSongs: () => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
    const [allSongs, setAllSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolumeState] = useState(0.5);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const [likedSongs, setLikedSongs] = useState<(number | string)[]>([]);
    const [playlists, setPlaylists] = useState<{ id: string, name: string, songIds: (number | string)[] }[]>([]);
    const [queue, setQueue] = useState<Song[]>([]);
    const [youtubeUrl, setYoutubeUrl] = useState<string | null>(null);
    
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const playerRef = useRef<unknown>(null);

    const { user, isAuthenticated } = useAuth();
    
    // Reusable fetch function
    const refreshSongs = useCallback(async () => {
        try {
            const response = await fetch('/api/songs');
            const data = await response.json();
            if (data.success) {
                setAllSongs(data.data);
                if (data.data.length > 0 && !currentSong) {
                    setCurrentSong(data.data[0]);
                }
            }
        } catch (error) {
            console.error('Failed to fetch songs:', error);
        }
    }, [currentSong]);

    // Initial fetch of songs & local storage fallback
    useEffect(() => {
        refreshSongs();

        // If not authenticated, load from local storage
        if (!isAuthenticated) {
            const savedLikes = localStorage.getItem('sonify_likes');
            if (savedLikes) setLikedSongs(JSON.parse(savedLikes));
            
            const savedPlaylists = localStorage.getItem('sonify_playlists');
            if (savedPlaylists) {
                const parsed = JSON.parse(savedPlaylists);
                setPlaylists(parsed.filter((p: { id: string }) => p.id !== 'p-1' && p.id !== 'p-2'));
            }
        }

        const savedVol = localStorage.getItem('sonify_volume');
        if (savedVol) {
            const v = parseFloat(savedVol);
            if (!isNaN(v) && v >= 0 && v <= 1) setVolumeState(v);
        }
    }, [isAuthenticated, currentSong]);

    // Sync from Cloud when user logs in
    useEffect(() => {
        if (isAuthenticated && user) {
            // Priority to server-side data
            if (user.likedSongs) setLikedSongs(user.likedSongs);
            if (user.playlists) setPlaylists(user.playlists);
        }
    }, [isAuthenticated, user]);

    // Sync TO Cloud when data changes
    useEffect(() => {
        const syncToCloud = async () => {
            if (isAuthenticated && user) {
                try {
                    await fetch('/api/users', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            username: user.username,
                            likedSongs,
                            playlists
                        })
                    });
                } catch (err) {
                    console.error('Cloud sync error:', err);
                }
            }
        };
        
        // Debounce sync slightly to avoid spamming
        const timer = setTimeout(syncToCloud, 2000);
        return () => clearTimeout(timer);
    }, [likedSongs, playlists, isAuthenticated, user]);


    const playSong = useCallback(async (song: Song) => {
        try {
            // 1. Stop everything current immediately
            if (!song.src) {
                alert('Không tìm thấy link nhạc!');
                return;
            }
            console.log('--- SONG PLAY REQUEST ---', { title: song.title, src: song.src, isOnline: song.isOnline });
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
            setYoutubeUrl(null);
            
            // 2. Set new song
            setCurrentSong(song);

            // CASE 1: Online Song (Need YouTube ID)
            if (song.isOnline) {
                console.log('Detected as ONLINE song. Fetching YouTube ID...');
                try {
                    const res = await fetch(`/api/youtube?q=${encodeURIComponent(song.title + ' ' + song.artist)}`);
                    const data = await res.json();
                    if (data.success) {
                        setYoutubeUrl(`https://www.youtube.com/watch?v=${data.videoId}`);
                        // Playback will be handled by ReactPlayer via isPlaying
                    } else {
                        // Fallback to preview
                        if (audioRef.current) {
                            audioRef.current.src = song.src;
                            await audioRef.current.play();
                        }
                    }
                } catch (err) {
                    console.error('YouTube fetch error:', err);
                } finally {
                    setIsPlaying(true);
                }
            } 
            // CASE 2: Local Song (or manually added YouTube link)
            else {
                const isYoutube = song.src.includes('youtube.com') || song.src.includes('youtu.be');
                
                if (isYoutube) {
                    setYoutubeUrl(song.src);
                    setIsPlaying(true);
                } else if (audioRef.current) {
                    audioRef.current.src = song.src;
                    audioRef.current.load();
                    await audioRef.current.play();
                    setIsPlaying(true);
                }
            }
            
            const recent = JSON.parse(localStorage.getItem('sonify_recent') || '[]');
            const updated = [song.id, ...recent.filter((id: string | number) => id !== song.id)].slice(0, 20);
            localStorage.setItem('sonify_recent', JSON.stringify(updated));
            window.dispatchEvent(new Event('sonify_recent_updated'));
        } catch (error) {
            console.warn("Playback interrupted", error);
        }
    }, [currentSong?.id]);

    const togglePlay = async () => {
        try {
            if (isPlaying) {
                if (audioRef.current) audioRef.current.pause();
                setIsPlaying(false);
            } else {
                if (audioRef.current) await audioRef.current.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.warn("Toggle playback intercepted", error);
        }
    };

    const nextSong = useCallback(() => {
        if (!currentSong) return;
        
        if (queue.length > 0) {
            const nextFromQueue = queue[0];
            setQueue(prev => prev.slice(1));
            playSong(nextFromQueue);
            return;
        }

        let nextIdx;
        const currentSongsList = allSongs; 
        const currentIdx = currentSongsList.findIndex(s => s.id === currentSong.id);
        
        if (isShuffle) {
            nextIdx = Math.floor(Math.random() * currentSongsList.length);
        } else {
            nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % currentSongsList.length;
        }
        if (currentSongsList[nextIdx]) {
            playSong(currentSongsList[nextIdx]);
        }
    }, [currentSong, queue, allSongs, isShuffle, playSong]);

    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
        }
        audioRef.current.volume = volume;

        const audio = audioRef.current;

        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };
        const updateDuration = () => {
            setDuration(audio.duration);
        };
        const onEnded = () => {
            if (isRepeat) {
                audio.currentTime = 0;
                audio.play();
            } else {
                nextSong();
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', onEnded);
        };
    }, [isRepeat, isShuffle, currentSong, nextSong, volume]);

    const prevSong = () => {
        if (!currentSong || allSongs.length === 0) return;
        const currentIdx = allSongs.findIndex(s => s.id === currentSong.id);
        const prevIdx = currentIdx === -1 ? 0 : (currentIdx - 1 + allSongs.length) % allSongs.length;
        playSong(allSongs[prevIdx]);
    };

    const seek = (time: number) => {
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    const setVolume = (v: number) => {
        if (audioRef.current) audioRef.current.volume = v;
        setVolumeState(v);
        localStorage.setItem('sonify_volume', v.toString());
    };

    const toggleShuffle = () => setIsShuffle(!isShuffle);
    const toggleRepeat = () => setIsRepeat(!isRepeat);

    const toggleLike = (songId: number | string) => {
        setLikedSongs((prev) => {
            const isLiked = prev.includes(songId);
            const newLikes = isLiked ? prev.filter((id) => id !== songId) : [...prev, songId];
            localStorage.setItem('sonify_likes', JSON.stringify(newLikes));
            window.dispatchEvent(new Event('sonify_likes_updated'));
            return newLikes;
        });
    };

    const createPlaylist = (name: string) => {
        const newPlaylist = { id: `p-${Date.now()}`, name, songIds: [] };
        const updated = [...playlists, newPlaylist];
        setPlaylists(updated);
        localStorage.setItem('sonify_playlists', JSON.stringify(updated));
    };

    const createAndAddToPlaylist = (name: string, songId: number | string) => {
        const newPlaylist = { id: `p-${Date.now()}`, name, songIds: [songId] };
        const updated = [...playlists, newPlaylist];
        setPlaylists(updated);
        localStorage.setItem('sonify_playlists', JSON.stringify(updated));
    };

    const deletePlaylist = (id: string) => {
        const updated = playlists.filter(p => p.id !== id);
        setPlaylists(updated);
        localStorage.setItem('sonify_playlists', JSON.stringify(updated));
    };

    const addToPlaylist = (playlistId: string, songId: number | string) => {
        const updated = playlists.map(p => {
            if (p.id === playlistId && !p.songIds.includes(songId)) {
                return { ...p, songIds: [...p.songIds, songId] };
            }
            return p;
        });
        setPlaylists(updated);
        localStorage.setItem('sonify_playlists', JSON.stringify(updated));
    };

    const removeFromPlaylist = (playlistId: string, songId: number | string) => {
        const updated = playlists.map(p => {
            if (p.id === playlistId) {
                return { ...p, songIds: p.songIds.filter(id => id !== songId) };
            }
            return p;
        });
        setPlaylists(updated);
        localStorage.setItem('sonify_playlists', JSON.stringify(updated));
    };

    const addToNextUp = (song: Song) => {
        setQueue(prev => [song, ...prev]);
    };

    return (
        <PlayerContext.Provider value={{
            currentSong, isPlaying, duration, currentTime, volume, isShuffle, isRepeat,
            playSong, togglePlay, nextSong, prevSong, seek, setVolume, toggleShuffle, toggleRepeat,
            likedSongs, toggleLike,
            playlists, createPlaylist, deletePlaylist, addToPlaylist, removeFromPlaylist, createAndAddToPlaylist,
            queue, allSongs, addToNextUp, refreshSongs
        }}>
            {children}
            {/* Hidden ReactPlayer for YouTube Audio */}
            {youtubeUrl && (
                <div style={{ 
                    position: 'fixed', 
                    top: '-1000px', 
                    left: '-1000px', 
                    width: '1px', 
                    height: '1px', 
                    overflow: 'hidden', 
                    opacity: 0,
                    pointerEvents: 'none',
                    zIndex: -1
                }}>
                    {/* @ts-expect-error - dynamic import typing conflict */}
                    <ReactPlayer
                        ref={playerRef as never}
                        url={youtubeUrl}
                        playing={isPlaying}
                        volume={volume}
                        onBuffer={() => console.log('YouTube Buffering...')}
                        onReady={() => console.log('YouTube Player Ready')}
                        onStart={() => console.log('YouTube Playback Started')}
                        onProgress={(state: { playedSeconds: number }) => setCurrentTime(state.playedSeconds)}
                        onDuration={(d: number) => setDuration(d)}
                        onEnded={nextSong}
                        onError={(e: unknown) => {
                            console.error('ReactPlayer Error:', e);
                            alert('Lỗi khi phát video YouTube. Có thể do video bị giới hạn hoặc không hỗ trợ nhúng.');
                        }}
                        config={{
                            youtube: {
                                playerVars: { autoplay: 1, controls: 0, origin: typeof window !== 'undefined' ? window.location.origin : '' }
                            }
                        }}
                    />
                </div>
            )}
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
}
