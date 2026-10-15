'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { usePlayer } from '@/context/PlayerContext';

const FullScreenPlayer: React.FC = () => {
    const {
        currentSong, isPlaying, duration, currentTime, volume, isShuffle, isRepeat,
        togglePlay, nextSong, prevSong, seek, setVolume, toggleShuffle, toggleRepeat,
        likedSongs, toggleLike, playlists, addToPlaylist, createAndAddToPlaylist,
        isQueueOpen, setIsQueueOpen, playbackRate, setPlaybackRate
    } = usePlayer();

    const [isOpen, setIsOpen] = useState(false);
    const [showPlaylistPanel, setShowPlaylistPanel] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [isSeeking, setIsSeeking] = useState(false);
    const [seekValue, setSeekValue] = useState(0);
    const constraintsRef = useRef<HTMLDivElement>(null);

    // Drag to dismiss
    const y = useMotionValue(0);
    const opacity = useTransform(y, [0, 300], [1, 0.3]);
    const scale = useTransform(y, [0, 300], [1, 0.85]);

    const formatTime = useCallback((time: number) => {
        if (!time || isNaN(time)) return '00:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const progress = duration ? (currentTime / duration) * 100 : 0;
    const isLiked = currentSong ? likedSongs.includes(currentSong.id) : false;

    // Listen for custom open event from mini-player tap
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-fullscreen-player', handleOpen);
        return () => window.removeEventListener('open-fullscreen-player', handleOpen);
    }, []);

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.y > 120 || info.velocity.y > 500) {
            setIsOpen(false);
        }
    };

    const handleSeekStart = () => {
        setIsSeeking(true);
        setSeekValue(progress);
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSeekValue(parseFloat(e.target.value));
    };

    const handleSeekEnd = () => {
        seek((seekValue / 100) * duration);
        setIsSeeking(false);
    };

    if (!currentSong) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fullscreen-player-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setIsOpen(false)}
                >
                    {/* Blurred background from album art */}
                    <div className="fsp-bg-blur" style={{ backgroundImage: `url(${currentSong.cover})` }} />

                    <motion.div
                        ref={constraintsRef}
                        className="fullscreen-player-content"
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        style={{ y, opacity, scale }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={0.4}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drag Handle */}
                        <div className="fsp-drag-handle">
                            <div className="fsp-handle-bar" />
                        </div>

                        {/* Album Art */}
                        <motion.div
                            className="fsp-album-art"
                            animate={{ 
                                rotate: isPlaying ? 360 : 0,
                            }}
                            transition={{
                                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                            }}
                        >
                            <div className="fsp-album-glow" style={{ backgroundImage: `url(${currentSong.cover})` }} />
                            <Image
                                src={currentSong.cover}
                                alt={currentSong.title}
                                width={280}
                                height={280}
                                style={{ objectFit: 'cover', borderRadius: '16px' }}
                                priority
                            />
                            {!isPlaying && (
                                <div className="fsp-album-pause-overlay">
                                    <i className="fa-solid fa-pause" />
                                </div>
                            )}
                        </motion.div>

                        {/* Song Info */}
                        <div className="fsp-song-info">
                            <div className="fsp-song-info-left">
                                <h2 className="fsp-title">{currentSong.title}</h2>
                                <p className="fsp-artist">{currentSong.artist}</p>
                                {currentSong.isPodcast && (
                                    <span className="fsp-badge fsp-badge-podcast">
                                        <i className="fa-solid fa-microphone" /> Podcast
                                    </span>
                                )}
                                {currentSong.isAudioBook && (
                                    <span className="fsp-badge fsp-badge-audiobook">
                                        <i className="fa-solid fa-book-open" /> Sách nói
                                    </span>
                                )}
                            </div>
                            <button
                                className={`fsp-like-btn ${isLiked ? 'active' : ''}`}
                                onClick={() => toggleLike(currentSong.id)}
                            >
                                <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart`} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="fsp-progress">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.1"
                                value={isSeeking ? seekValue : progress}
                                onMouseDown={handleSeekStart}
                                onTouchStart={handleSeekStart}
                                onChange={handleSeekChange}
                                onMouseUp={handleSeekEnd}
                                onTouchEnd={handleSeekEnd}
                                className="fsp-progress-input"
                            />
                            <div
                                className="fsp-progress-filled"
                                style={{ width: `${isSeeking ? seekValue : progress}%` }}
                            />
                            <div className="fsp-time-labels">
                                <span>{formatTime(isSeeking ? (seekValue / 100) * duration : currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
                        </div>

                        {/* Main Controls */}
                        <div className="fsp-controls">
                            {(currentSong.isPodcast || currentSong.isAudioBook) ? (
                                <>
                                    <button
                                        className="fsp-ctrl-btn fsp-ctrl-speed"
                                        onClick={() => {
                                            const rates = [1, 1.25, 1.5, 2, 0.75];
                                            const currIdx = rates.indexOf(playbackRate);
                                            const nextIdx = (currIdx === -1 ? 0 : currIdx + 1) % rates.length;
                                            setPlaybackRate(rates[nextIdx]);
                                        }}
                                        style={{ color: playbackRate !== 1 ? '#10b981' : undefined }}
                                    >
                                        {playbackRate}x
                                    </button>
                                    <button className="fsp-ctrl-btn" onClick={() => seek(Math.max(0, currentTime - 15))}>
                                        <i className="fa-solid fa-rotate-left" />
                                        <span className="fsp-skip-label">15</span>
                                    </button>
                                </>
                            ) : (
                                <button
                                    className={`fsp-ctrl-btn ${isShuffle ? 'fsp-ctrl-active' : ''}`}
                                    onClick={toggleShuffle}
                                >
                                    <i className="fa-solid fa-shuffle" />
                                </button>
                            )}

                            <button className="fsp-ctrl-btn fsp-ctrl-prev" onClick={prevSong}>
                                <i className="fa-solid fa-backward-step" />
                            </button>

                            <button className="fsp-ctrl-main-play" onClick={togglePlay}>
                                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                            </button>

                            <button className="fsp-ctrl-btn fsp-ctrl-next" onClick={nextSong}>
                                <i className="fa-solid fa-forward-step" />
                            </button>

                            {(currentSong.isPodcast || currentSong.isAudioBook) ? (
                                <button className="fsp-ctrl-btn" onClick={() => seek(Math.min(duration, currentTime + 15))}>
                                    <i className="fa-solid fa-rotate-right" />
                                    <span className="fsp-skip-label">15</span>
                                </button>
                            ) : (
                                <button
                                    className={`fsp-ctrl-btn ${isRepeat ? 'fsp-ctrl-active' : ''}`}
                                    onClick={toggleRepeat}
                                >
                                    <i className="fa-solid fa-repeat" />
                                </button>
                            )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="fsp-bottom-actions">
                            <button
                                className={`fsp-action-btn ${isQueueOpen ? 'fsp-action-active' : ''}`}
                                onClick={() => setIsQueueOpen(!isQueueOpen)}
                                title="Danh sách hàng chờ"
                            >
                                <i className="fa-solid fa-bars-staggered" />
                            </button>

                            <div className="fsp-volume-row">
                                <i className={`fa-solid ${volume === 0 ? 'fa-volume-xmark' : volume < 0.5 ? 'fa-volume-low' : 'fa-volume-high'}`} />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={Math.round(volume * 100)}
                                    onChange={e => setVolume(parseFloat(e.target.value) / 100)}
                                    className="fsp-volume-slider"
                                />
                            </div>

                            <button
                                className="fsp-action-btn"
                                onClick={() => setShowPlaylistPanel(!showPlaylistPanel)}
                                title="Thêm vào playlist"
                            >
                                <i className="fa-solid fa-plus" />
                            </button>
                        </div>

                        {/* Playlist Panel */}
                        <AnimatePresence>
                            {showPlaylistPanel && (
                                <motion.div
                                    className="fsp-playlist-panel"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <h4>Thêm vào playlist</h4>
                                    <div className="fsp-create-playlist">
                                        <input
                                            type="text"
                                            placeholder="Tạo playlist mới..."
                                            value={newPlaylistName}
                                            onChange={(e) => setNewPlaylistName(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && newPlaylistName.trim() && currentSong) {
                                                    createAndAddToPlaylist(newPlaylistName.trim(), currentSong.id);
                                                    setNewPlaylistName('');
                                                    setShowPlaylistPanel(false);
                                                }
                                            }}
                                        />
                                        <button onClick={() => {
                                            if (newPlaylistName.trim() && currentSong) {
                                                createAndAddToPlaylist(newPlaylistName.trim(), currentSong.id);
                                                setNewPlaylistName('');
                                                setShowPlaylistPanel(false);
                                            }
                                        }}>
                                            <i className="fa-solid fa-plus" />
                                        </button>
                                    </div>
                                    {playlists.map(p => (
                                        <button
                                            key={p.id}
                                            className="fsp-playlist-item"
                                            onClick={() => {
                                                addToPlaylist(p.id, currentSong.id);
                                                setShowPlaylistPanel(false);
                                            }}
                                        >
                                            <i className="fa-solid fa-list-ul" />
                                            <span>{p.name}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FullScreenPlayer;
