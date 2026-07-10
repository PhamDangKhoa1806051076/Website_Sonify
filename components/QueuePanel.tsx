'use client';

import React, { useMemo } from 'react';
import Image from 'next/image';
import { usePlayer } from '@/context/PlayerContext';

interface QueuePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const QueuePanel: React.FC<QueuePanelProps> = ({ isOpen, onClose }) => {
    const { currentSong, playSong, queue, shuffleQueue, isShuffle, shuffleAll, playbackList, allSongs } = usePlayer();

    const currentSongsList = useMemo(
        () => playbackList.length > 0 ? playbackList : allSongs,
        [playbackList, allSongs]
    );

    const currentIndex = useMemo(
        () => currentSong ? currentSongsList.findIndex(s => s.id === currentSong.id) : 0,
        [currentSong, currentSongsList]
    );

    const regularUpcoming = useMemo(() => [
        ...currentSongsList.slice(currentIndex + 1),
        ...currentSongsList.slice(0, currentIndex)
    ], [currentSongsList, currentIndex]);

    if (!isOpen) return null;

    const labelStyle: React.CSSProperties = {
        color: 'var(--text-muted)',
        fontSize: '0.6875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 600,
        marginBottom: '10px',
        paddingLeft: '4px'
    };

    const songRowStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '8px 10px',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
    };

    return (
        <div style={{
            gridArea: 'queue',
            position: 'relative',
            width: '300px',
            height: '100%',
            background: 'var(--bg-sidebar)',
            borderLeft: '1px solid var(--glass-border)',
            zIndex: 100,
            overflowY: 'auto',
            animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '-12px 0 40px rgba(0,0,0,0.35), -1px 0 0 rgba(255,255,255,0.04)',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 20px 16px',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(to bottom, rgba(99,102,241,0.05) 0%, transparent 100%)',
                flexShrink: 0
            }}>
                <div>
                    <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>Hàng chờ</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0', fontWeight: 500 }}>
                        {queue.length + regularUpcoming.length} bài tiếp theo
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={shuffleAll}
                        title="Xáo trộn"
                        style={{
                            background: isShuffle ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                            border: `1px solid ${isShuffle ? 'rgba(99,102,241,0.4)' : 'var(--glass-border)'}`,
                            color: isShuffle ? 'var(--primary-light)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease',
                            display: 'flex', alignItems: 'center', gap: '5px'
                        }}
                    >
                        <i className="fa-solid fa-shuffle"></i>
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            width: '32px', height: '32px',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'scale(1) rotate(0)'; }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            {/* Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Now Playing */}
                {currentSong && (
                    <div>
                        <p style={labelStyle}>Đang phát</p>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px',
                            background: 'linear-gradient(135deg, var(--primary-color) 0%, #7c3aed 100%)',
                            borderRadius: '16px',
                            boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%)',
                                pointerEvents: 'none'
                            }} />
                            <Image src={currentSong.cover} alt="" width={44} height={44}
                                style={{ borderRadius: '10px', objectFit: 'cover', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
                            <div style={{ minWidth: 0, flex: 1 }}>
                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{currentSong.title}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{currentSong.artist}</p>
                            </div>
                            {/* Visualizer bars */}
                            <div style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '16px', flexShrink: 0 }}>
                                {[0.8, 0.5, 1].map((h, i) => (
                                    <div key={i} style={{
                                        width: '3px', background: 'rgba(255,255,255,0.85)',
                                        borderRadius: '2px',
                                        animation: `queueBar ${0.6 + i * 0.2}s ease-in-out infinite alternate`,
                                        height: `${h * 100}%`
                                    }} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Manual Queue */}
                {queue.length > 0 && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <p style={{ ...labelStyle, marginBottom: 0, color: 'var(--cyan-accent)' }}>Phát tiếp theo</p>
                            <button
                                onClick={shuffleQueue}
                                style={{
                                    background: 'rgba(0,229,255,0.08)',
                                    border: '1px solid rgba(0,229,255,0.2)',
                                    color: 'var(--cyan-accent)',
                                    borderRadius: '6px',
                                    padding: '3px 9px',
                                    fontSize: '0.7rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    letterSpacing: '0.02em'
                                }}
                            >
                                <i className="fa-solid fa-shuffle" style={{ marginRight: '4px' }}></i>Xáo
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {queue.map((song, idx) => (
                                <div
                                    key={`q-${song.id}-${idx}`}
                                    onClick={() => playSong(song)}
                                    style={{ ...songRowStyle, border: '1px solid rgba(0,229,255,0.12)' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,229,255,0.06)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <Image src={song.cover} alt="" width={38} height={38}
                                        style={{ borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{song.title}</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{song.artist}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Up Next */}
                <div>
                    <p style={labelStyle}>Tiếp trong danh sách</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        {regularUpcoming.map(song => (
                            <div
                                key={`up-${song.id}`}
                                onClick={() => playSong(song)}
                                style={songRowStyle}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                                <Image src={song.cover} alt="" width={36} height={36}
                                    style={{ borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: '0.8375rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.01em' }}>{song.title}</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{song.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes queueBar {
                    0% { height: 20%; }
                    100% { height: 100%; }
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}} />
        </div>
    );
};

export default QueuePanel;
