'use client';

import React from 'react';
import { Song } from '@/data/constants';
import { usePlayer } from '@/context/PlayerContext';

interface ChartListViewProps {
    songs: Song[];
}

const ChartListView: React.FC<ChartListViewProps> = ({ songs }) => {
    const { currentSong, isPlaying, playSong, pauseSong, toggleLike, likedSongs } = usePlayer();

    // Format play count mockly to display nicely like "47.764.590"
    const generateMockPlayCount = (id: string, index: number) => {
        // Simple deterministic mock based on index, with variations
        const base = 50000000 - (index * 1234567);
        return base.toLocaleString('vi-VN');
    };

    // Calculate a mock duration if none exists
    const mockDuration = (index: number) => {
        const mins = 2 + (index % 3);
        const secs = 15 + (index % 40);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="chart-list-container" style={{
            width: '100%',
            color: '#b3b3b3',
            fontSize: '0.9rem'
        }}>
            {/* Header */}
            <div className="chart-list-header" style={{
                display: 'grid',
                gridTemplateColumns: '40px 4fr 3fr 3fr 50px',
                padding: '10px 16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '16px',
                alignItems: 'center',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontSize: '0.8rem'
            }}>
                <div style={{ textAlign: 'center' }}>#</div>
                <div>Tiêu đề</div>
                <div style={{ paddingLeft: '1rem' }}>Lượt phát</div>
                <div>Album</div>
                <div style={{ textAlign: 'center' }}><i className="fa-regular fa-clock"></i></div>
            </div>

            {/* List */}
            <div className="chart-list-body">
                {songs.map((song, idx) => {
                    const isCurrent = currentSong?.id === song.id;
                    const isLiked = likedSongs.includes(song.id);

                    return (
                        <div key={song.id} className={`chart-list-item ${isCurrent ? 'active' : ''}`} style={{
                            display: 'grid',
                            gridTemplateColumns: '40px 4fr 3fr 3fr 50px',
                            padding: '10px 16px',
                            borderRadius: '5px',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                        }}
                        onClick={() => playSong(song)}
                        >
                            <div className="chart-item-index" style={{ textAlign: 'center', position: 'relative' }}>
                                {isCurrent && isPlaying ? (
                                    <i className="fa-solid fa-chart-simple text-primary animated-bars"></i>
                                ) : (
                                    <span style={{ color: isCurrent ? 'var(--primary-color)' : 'inherit' }}>{idx + 1}</span>
                                )}
                            </div>
                            
                            <div className="chart-item-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img src={song.cover} alt={song.title} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                                    <span style={{ 
                                        color: isCurrent ? 'var(--primary-color)' : '#fff', 
                                        fontWeight: '500', 
                                        fontSize: '1rem',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {song.title}
                                    </span>
                                    <span style={{ 
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {song.artist}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="chart-item-plays" style={{ paddingLeft: '1rem' }}>
                                {generateMockPlayCount(song.id, idx)}
                            </div>
                            
                            <div className="chart-item-album">
                                {/* Use artist name as album approximation if album is missing */}
                                {song.title} - Single
                            </div>

                            <div className="chart-item-actions" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLike(song.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: isLiked ? 'var(--primary-color)' : 'inherit',
                                    }}
                                >
                                    <i className={isLiked ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                                </button>
                                <span>{mockDuration(idx)}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {songs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                    Không có dữ liệu bảng xếp hạng.
                </div>
            )}
        </div>
    );
};

export default ChartListView;
