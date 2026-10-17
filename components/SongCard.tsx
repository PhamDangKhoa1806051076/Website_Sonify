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

    const mobileCleanTitle = song.title.replace(/\s*\(BCN\)\s*/i, '');
    const mobileBadge = song.badge || (song.title.includes('(BCN)') ? '2 bản' : undefined);

    return (
        <div className={`song-card ${isCurrent ? 'active' : ''}`} onClick={handleClick}>
            <div className="song-card-inner">
                <div className="img-wrap" style={{ position: 'relative', width: '100%', paddingBottom: '100%', overflow: 'hidden' }}>
                    <div className="song-card-placeholder mobile-only">
                        <i className="fa-solid fa-music"></i>
                    </div>
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
                    {song.duration && (
                        <div className="song-card-duration mobile-only">
                            {song.duration}
                        </div>
                    )}
                    {song.isOnline && (
                        <div className="online-badge">
                            <i className="fa-solid fa-cloud"></i>
                            <span>Online</span>
                        </div>
                    )}
                </div>
                <h4 title={song.title}>
                    <span className="song-title-text desktop-only">{song.title}</span>
                    <span className="song-title-text mobile-only">{mobileCleanTitle}</span>
                    {mobileBadge && (
                        <span className="song-badge-tag mobile-only">{mobileBadge}</span>
                    )}
                </h4>
                <p>{song.artist}</p>
            </div>
        </div>
    );
};

export default React.memo(SongCard);
