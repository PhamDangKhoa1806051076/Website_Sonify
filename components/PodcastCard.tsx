'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { Song } from '@/data/constants';
import { usePlayer } from '@/context/PlayerContext';
import { useLanguage } from '@/context/LanguageContext';

interface PodcastCardProps {
    podcast: Song;
}

const formatDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m} min`;
};

const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
    const { playSong, currentSong, isPlaying } = usePlayer();
    const { t } = useLanguage();

    const isCurrent = currentSong?.id === podcast.id;
    const handleClick = useCallback(() => playSong(podcast), [playSong, podcast]);
    const meta = podcast.podcastMeta;

    return (
        <div
            className={`podcast-card ${isCurrent ? 'active' : ''}`}
            onClick={handleClick}
        >
            <div className="podcast-card-cover">
                <Image
                    src={podcast.cover}
                    alt={podcast.title}
                    fill
                    sizes="(max-width: 768px) 80px, 100px"
                    style={{ objectFit: 'cover' }}
                />
                <div className={`podcast-play-overlay ${isCurrent && isPlaying ? 'playing' : ''}`}>
                    <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                </div>
            </div>

            <div className="podcast-card-info">
                <div className="podcast-card-header">
                    {meta?.episodeNumber && meta.episodeNumber > 0 && (
                        <span className="podcast-episode-badge">
                            {t('podcast-episode')} {meta.episodeNumber}
                        </span>
                    )}
                    <h4 className="podcast-card-title">{podcast.title}</h4>
                </div>

                <div className="podcast-card-meta">
                    <span className="podcast-card-host">
                        <i className="fa-solid fa-microphone-lines"></i>
                        {podcast.artist}
                    </span>
                    {meta?.showName && (
                        <span className="podcast-card-show">
                            <i className="fa-solid fa-podcast"></i>
                            {meta.showName}
                        </span>
                    )}
                </div>

                {meta?.description && (
                    <p className="podcast-card-desc">{meta.description}</p>
                )}

                <div className="podcast-card-footer">
                    {meta?.duration && meta.duration > 0 && (
                        <span className="podcast-card-duration">
                            <i className="fa-regular fa-clock"></i>
                            {formatDuration(meta.duration)}
                        </span>
                    )}
                    <span className="podcast-badge">
                        <i className="fa-solid fa-podcast"></i>
                        Podcast
                    </span>
                </div>
            </div>
        </div>
    );
};

export default React.memo(PodcastCard);
