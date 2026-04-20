'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { songs } from '@/data/constants';

interface QueuePanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const QueuePanel: React.FC<QueuePanelProps> = ({ isOpen, onClose }) => {
    const { currentSong, playSong, queue } = usePlayer();

    if (!isOpen) return null;

    // The order of next songs: 
    // 1. Manually added queue
    // 2. Regular songs in order
    const currentIndex = currentSong ? songs.findIndex(s => s.id === currentSong.id) : 0;
    const regularUpcoming = [
        ...songs.slice(currentIndex + 1),
        ...songs.slice(0, currentIndex)
    ];

    return (
        <div className="queue-panel" style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '320px',
            height: 'calc(100vh - var(--player-height))',
            background: 'var(--bg-sidebar)',
            borderLeft: '1px solid var(--glass-border)',
            padding: '20px',
            zIndex: 1100,
            overflowY: 'auto',
            animation: 'slideIn 0.3s ease',
            boxShadow: 'var(--theme-shadow, -10px 0 40px rgba(0, 0, 0, 0.3))'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Hàng chờ</h3>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            {/* Current Song Section */}
            <div style={{ marginBottom: '25px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Đang phát</p>
                {currentSong && (
                    <div className="active-queue-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--primary-color)', borderRadius: '12px', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)' }}>
                        <img src={currentSong.cover} alt="" style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ minWidth: 0 }}>
                            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.artist}</p>
                        </div>
                        <div className="visualizer-mini" style={{ marginLeft: 'auto', display: 'flex', gap: '3px', alignItems: 'flex-end', height: '15px' }}>
                            <div className="bar" style={{ width: '3px', background: 'white', animation: 'bounce 0.8s infinite alternate' }}></div>
                            <div className="bar" style={{ width: '3px', background: 'white', animation: 'bounce 0.5s infinite alternate' }}></div>
                            <div className="bar" style={{ width: '3px', background: 'white', animation: 'bounce 1s infinite alternate' }}></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Dynamic Queue Section (Items added via "Add to Next up") */}
            {queue.length > 0 && (
                <div style={{ marginBottom: '25px' }}>
                    <p style={{ color: 'var(--cyan-accent)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontWeight: 600 }}>Phát tiếp theo</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {queue.map((song, idx) => (
                            <div 
                                key={`manual-queue-${song.id}-${idx}`}
                                onClick={() => playSong(song)}
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', cursor: 'pointer', borderRadius: '10px', transition: 'all 0.2s', border: '1px solid rgba(0, 229, 255, 0.2)' }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0, 229, 255, 0.05)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <img src={song.cover} alt="" style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                                <div style={{ minWidth: 0 }}>
                                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</p>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Remaining Song List Section */}
            <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Tiếp theo trong danh sách</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {regularUpcoming.map(song => (
                        <div 
                            key={`queue-${song.id}`}
                            onClick={() => playSong(song)}
                            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', cursor: 'pointer', borderRadius: '10px', transition: 'all 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <img src={song.cover} alt="" style={{ width: '38px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                            <div style={{ minWidth: 0 }}>
                                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</p>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes bounce {
                    0% { height: 3px; }
                    100% { height: 100%; }
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
            `}} />
        </div>
    );
};

export default QueuePanel;
