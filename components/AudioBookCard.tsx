'use client';

import React, { useCallback } from 'react';
import Image from 'next/image';
import { Song } from '@/data/constants';
import { usePlayer } from '@/context/PlayerContext';
import { useLanguage } from '@/context/LanguageContext';

interface AudioBookCardProps {
    book: Song;
}

const formatDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m} phút`;
};

const AudioBookCard: React.FC<AudioBookCardProps> = ({ book }) => {
    const { playSong, currentSong, isPlaying } = usePlayer();
    const { t } = useLanguage();

    const isCurrent = currentSong?.id === book.id;
    const handleClick = useCallback(() => playSong(book), [playSong, book]);
    const meta = book.audioBookMeta;

    return (
        <div
            className={`audiobook-card ${isCurrent ? 'active' : ''}`}
            onClick={handleClick}
        >
            <div className="audiobook-card-cover-wrapper">
                <div className="audiobook-card-cover">
                    <Image
                        src={book.cover}
                        alt={book.title}
                        fill
                        sizes="(max-width: 768px) 140px, 180px"
                        style={{ objectFit: 'cover' }}
                    />
                    <div className={`audiobook-play-overlay ${isCurrent && isPlaying ? 'playing' : ''}`}>
                        <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </div>
                </div>
                {meta?.chaptersCount && meta.chaptersCount > 1 ? (
                    <span className="audiobook-chapter-badge">
                        {meta.chaptersCount} {t('audiobook-chapters')}
                    </span>
                ) : null}
            </div>

            <div className="audiobook-card-info">
                <h4 className="audiobook-card-title" title={book.title}>
                    {book.title}
                </h4>

                <div className="audiobook-card-author">
                    <i className="fa-solid fa-feather-pointed"></i>
                    <span>{meta?.author || book.artist}</span>
                </div>

                {meta?.narrator && (
                    <div className="audiobook-card-narrator">
                        <i className="fa-solid fa-microphone-lines"></i>
                        <span>{t('audiobook-narrator')}: {meta.narrator}</span>
                    </div>
                )}

                {meta?.description && (
                    <p className="audiobook-card-desc">{meta.description}</p>
                )}

                <div className="audiobook-card-footer">
                    {meta?.duration && meta.duration > 0 ? (
                        <span className="audiobook-duration">
                            <i className="fa-regular fa-clock"></i>
                            {formatDuration(meta.duration)}
                        </span>
                    ) : null}
                    {book.category && (
                        <span className="audiobook-category-tag">
                            {book.category}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(AudioBookCard);
