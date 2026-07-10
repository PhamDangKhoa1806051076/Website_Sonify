'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { Song } from '@/data/constants';
import { usePlayer } from '@/context/PlayerContext';

interface SongCardProps {
    song: Song;
}

const SongCard: React.FC<SongCardProps> = ({ song }) => {
    const { playSong, currentSong, isPlaying } = usePlayer();

    const isCurrent = currentSong?.id === song.id;
    const handleClick = useCallback(() => playSong(song), [playSong, song]);

    return (
        <div className={`song-card ${isCurrent ? 'active' : ''}`} onClick={handleClick}>
            <div className="song-card-inner">
                <div className="img-wrap" style={{ position: 'relative' }}>
                    <Image 
                        src={song.cover} 
                        alt={song.title} 
                        fill 
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className={`play-overlay ${isCurrent && isPlaying ? 'playing' : ''}`}>
                        <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </div>
                    {song.isOnline && (
                        <div className="online-badge">
                            <i className="fa-solid fa-cloud"></i>
                            <span>Online</span>
                        </div>
                    )}
                </div>
                <h4>{song.title}</h4>
                <p>{song.artist}</p>
            </div>
        </div>
    );
};

export default React.memo(SongCard);
