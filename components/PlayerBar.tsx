'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/context/PlayerContext';

const PlayerBar: React.FC = () => {
    const {
        currentSong, isPlaying, duration, currentTime, volume, isShuffle, isRepeat,
        togglePlay, nextSong, prevSong, seek, setVolume, toggleShuffle, toggleRepeat,
        likedSongs, toggleLike, playlists, addToPlaylist, createAndAddToPlaylist,
        addToNextUp, isQueueOpen, setIsQueueOpen
    } = usePlayer();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownView, setDropdownView] = useState<'main' | 'playlists'>('main');
    const [newPlaylistName, setNewPlaylistName] = useState('');

    const formatTime = useCallback((time: number) => {
        if (!time || isNaN(time)) return '00:00';
        const mins = Math.floor(time / 60);
        const secs = Math.floor(time % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    const progress = useMemo(() => duration ? (currentTime / duration) * 100 : 0, [currentTime, duration]);
    const isLiked = useMemo(() => currentSong ? likedSongs.includes(currentSong.id) : false, [likedSongs, currentSong]);

    if (!currentSong) return null;

    return (
        <AnimatePresence>
            <motion.footer
                className="player-bar"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
            {/* LEFT — Track Info */}
            <div className="current-track">
                <div className="track-img">
                    <Image 
                        src={currentSong.cover} 
                        alt={currentSong.title} 
                        width={56} 
                        height={56} 
                        style={{ objectFit: 'cover', borderRadius: '8px' }}
                    />
                </div>
                <div className="track-info">
                    <h4>{currentSong.title}</h4>
                    <p>{currentSong.artist}</p>
                </div>
                <div className="track-actions">
                    <button
                        className={`btn-icon like-btn ${isLiked ? 'active' : ''}`}
                        onClick={() => toggleLike(currentSong.id)}
                        title={isLiked ? 'Bỏ thích' : 'Thêm vào yêu thích'}
                    >
                        <i className={`${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart`}
                            style={{ color: isLiked ? '#f43f5e' : '' }}
                        ></i>
                    </button>
                    <div className="playlist-add-container">
                        <button
                            className={`btn-icon secondary ${isDropdownOpen ? 'active' : ''}`}
                            onClick={() => {
                                setIsDropdownOpen(!isDropdownOpen);
                                setDropdownView('main');
                            }}
                            title="Thêm"
                        >
                            <i className="fa-solid fa-plus"></i>
                        </button>
                        {isDropdownOpen && (
                            <div className="action-dropdown">
                                {dropdownView === 'main' ? (
                                    <div className="main-dropdown-view">
                                        <div className="dropdown-item" onClick={() => {
                                            if (currentSong) addToNextUp(currentSong);
                                            setIsDropdownOpen(false);
                                        }}>
                                            <i className="fa-solid fa-square-plus"></i>
                                            <span>Add to Next up</span>
                                        </div>
                                        <div className="dropdown-item" onClick={() => setDropdownView('playlists')}>
                                            <i className="fa-solid fa-list-check"></i>
                                            <span>Add to Playlist</span>
                                            <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', fontSize: '0.7rem' }}></i>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="playlists-dropdown-view">
                                        <div className="dropdown-back" onClick={() => setDropdownView('main')}>
                                            <i className="fa-solid fa-chevron-left"></i>
                                            <span>Back</span>
                                        </div>
                                        <h4>Add to Album</h4>
                                        <div className="create-playlist-inline" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none', marginBottom: '10px' }}>
                                            <input 
                                                type="text" 
                                                placeholder="New album..." 
                                                value={newPlaylistName}
                                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && newPlaylistName.trim()) {
                                                        createAndAddToPlaylist(newPlaylistName.trim(), currentSong.id);
                                                        setNewPlaylistName('');
                                                        setIsDropdownOpen(false);
                                                    }
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                autoFocus
                                            />
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (newPlaylistName.trim()) {
                                                        createAndAddToPlaylist(newPlaylistName.trim(), currentSong.id);
                                                        setNewPlaylistName('');
                                                        setIsDropdownOpen(false);
                                                    }
                                                }}
                                            >
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                        
                                        {playlists.length > 0 && (
                                            <ul>
                                                {playlists.map(p => (
                                                    <li key={p.id} onClick={() => {
                                                        addToPlaylist(p.id, currentSong.id);
                                                        setIsDropdownOpen(false);
                                                    }}>
                                                        <i className="fa-solid fa-list-ul"></i>
                                                        {p.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CENTER — Controls */}
            <div className="player-controls">
                <div className="playback-buttons">
                    <button
                        className={`btn-icon secondary ${isShuffle ? 'active' : ''}`}
                        onClick={toggleShuffle}
                        title="Shuffle"
                    >
                        <i className="fa-solid fa-shuffle"></i>
                    </button>
                    <button className="btn-icon primary" onClick={prevSong} title="Previous">
                        <i className="fa-solid fa-backward-step"></i>
                    </button>
                    <button className="btn-icon main-play" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                        <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                    </button>
                    <button className="btn-icon primary" onClick={nextSong} title="Next">
                        <i className="fa-solid fa-forward-step"></i>
                    </button>
                    <button
                        className={`btn-icon secondary ${isRepeat ? 'active' : ''}`}
                        onClick={toggleRepeat}
                        title="Repeat"
                    >
                        <i className="fa-solid fa-repeat"></i>
                    </button>
                </div>

                <div className="playback-progress">
                    <span>{formatTime(currentTime)}</span>
                    <div className="progress-bar-container">
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress || 0}
                            onChange={e => seek((parseFloat(e.target.value) / 100) * duration)}
                            id="progress-bar"
                        />
                        <div className="progress-filled" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* RIGHT — Volume & Queue */}
            <div className="extra-controls">
                <button
                    className={`btn-icon secondary ${isQueueOpen ? 'active' : ''}`}
                    onClick={() => setIsQueueOpen(o => !o)}
                    title="Queue"
                >
                    <i className="fa-solid fa-list"></i>
                </button>

                <div className="volume-control">
                    <i className={`fa-solid ${volume === 0 ? 'fa-volume-xmark' : volume < 0.5 ? 'fa-volume-low' : 'fa-volume-high'}`}></i>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={Math.round(volume * 100)}
                        onChange={e => setVolume(parseFloat(e.target.value) / 100)}
                        id="volume-bar"
                    />
                </div>
            </div>

            </motion.footer>
        </AnimatePresence>
    );
};

export default PlayerBar;
