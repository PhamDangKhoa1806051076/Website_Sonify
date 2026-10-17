'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Song } from '@/data/constants';
import { usePlayer } from '@/context/PlayerContext';

interface MobilePlaylistViewProps {
  title?: string;
  subtitle?: string;
  songs: Song[];
  initialCount?: number;
  showExpandButton?: boolean;
}

const MobilePlaylistView: React.FC<MobilePlaylistViewProps> = ({
  title = 'Bài hát dành cho bạn',
  subtitle,
  songs,
  initialCount = 6,
  showExpandButton = true,
}) => {
  const { currentSong, isPlaying, playSong, addToNextUp, likedSongs, toggleLike } = usePlayer();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSongForMenu, setSelectedSongForMenu] = useState<Song | null>(null);

  // Compute displayed songs based on expansion state
  const displayedSongs = useMemo(() => {
    if (!showExpandButton || isExpanded || songs.length <= initialCount) {
      return songs;
    }
    return songs.slice(0, initialCount);
  }, [songs, isExpanded, showExpandButton, initialCount]);

  // Dynamic subtitle if not provided
  const resolvedSubtitle = useMemo(() => {
    if (subtitle) return subtitle;
    return `${songs.length} bài hát • Tuyển chọn hôm nay`;
  }, [subtitle, songs.length]);

  // Shuffle play handler
  const handleShuffle = useCallback(() => {
    if (!songs || songs.length === 0) return;
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    playSong(shuffled[0]);
  }, [songs, playSong]);

  return (
    <div className="mobile-playlist-container">
      {/* Header */}
      <div className="mobile-playlist-header">
        <div className="mobile-playlist-header-left">
          <h2 className="mobile-playlist-title">{title}</h2>
          <p className="mobile-playlist-subtitle">{resolvedSubtitle}</p>
        </div>
        <button
          type="button"
          className="mobile-playlist-shuffle-btn"
          onClick={handleShuffle}
          title="Phát ngẫu nhiên"
        >
          <i className="fa-solid fa-shuffle" />
          <span>Ngẫu nhiên</span>
        </button>
      </div>

      {/* Song List */}
      <div className="mobile-playlist-list">
        {displayedSongs.map((song) => {
          const isCurrent = currentSong?.id === song.id;
          const isCurrentPlaying = isCurrent && isPlaying;

          return (
            <motion.div
              key={song.id}
              className={`mobile-playlist-row ${isCurrent ? 'active' : ''}`}
              onClick={() => playSong(song)}
              whileTap={{ scale: 0.98 }}
              layout
            >
              {/* Cover Art */}
              <div className="mobile-playlist-cover-wrap">
                <Image
                  src={song.cover}
                  alt={song.title}
                  width={48}
                  height={48}
                  className="mobile-playlist-cover-img"
                />
              </div>

              {/* Title & Artist */}
              <div className="mobile-playlist-info">
                <h4 className="mobile-playlist-song-title">
                  {song.title}
                  {song.badge && (
                    <span className="mobile-playlist-badge">{song.badge}</span>
                  )}
                </h4>
                <p className="mobile-playlist-artist">{song.artist}</p>
              </div>

              {/* Right Side: Duration & Visualizer / More button */}
              <div className="mobile-playlist-right" onClick={(e) => e.stopPropagation()}>
                <span className="mobile-playlist-duration">
                  {song.duration || '3:45'}
                </span>

                {isCurrentPlaying ? (
                  /* Animated Sound Wave Equalizer */
                  <div className="mobile-playlist-equalizer" title="Đang phát">
                    <span className="eq-bar eq-bar-1" />
                    <span className="eq-bar eq-bar-2" />
                    <span className="eq-bar eq-bar-3" />
                    <span className="eq-bar eq-bar-4" />
                  </div>
                ) : (
                  /* Three Dots More Actions */
                  <button
                    type="button"
                    className="mobile-playlist-more-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSongForMenu(song);
                    }}
                    title="Tùy chọn khác"
                  >
                    <i className="fa-solid fa-ellipsis" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Expand / Collapse Button */}
      {showExpandButton && songs.length > initialCount && (
        <button
          type="button"
          className="mobile-playlist-expand-btn"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <span>{isExpanded ? 'Thu gọn bài hát' : 'Khám phá thêm bài hát'}</span>
          <i
            className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}
          />
        </button>
      )}

      {/* Action Sheet Modal for Song Options */}
      <AnimatePresence>
        {selectedSongForMenu && (
          <div
            className="mobile-playlist-sheet-backdrop"
            onClick={() => setSelectedSongForMenu(null)}
          >
            <motion.div
              className="mobile-playlist-sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sheet Drag Pill */}
              <div className="sheet-drag-pill" />

              {/* Selected Song Preview */}
              <div className="sheet-song-preview">
                <Image
                  src={selectedSongForMenu.cover}
                  alt={selectedSongForMenu.title}
                  width={46}
                  height={46}
                  style={{ borderRadius: 10, objectFit: 'cover' }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedSongForMenu.title}
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {selectedSongForMenu.artist}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="sheet-actions-list">
                <button
                  type="button"
                  className="sheet-action-item"
                  onClick={() => {
                    playSong(selectedSongForMenu);
                    setSelectedSongForMenu(null);
                  }}
                >
                  <i className="fa-solid fa-play" />
                  <span>Phát ngay</span>
                </button>

                <button
                  type="button"
                  className="sheet-action-item"
                  onClick={() => {
                    addToNextUp(selectedSongForMenu);
                    setSelectedSongForMenu(null);
                  }}
                >
                  <i className="fa-solid fa-square-plus" />
                  <span>Phát tiếp theo</span>
                </button>

                <button
                  type="button"
                  className="sheet-action-item"
                  onClick={() => {
                    toggleLike(selectedSongForMenu.id);
                    setSelectedSongForMenu(null);
                  }}
                >
                  <i
                    className={`fa-solid fa-heart ${likedSongs.includes(selectedSongForMenu.id) ? 'liked' : ''}`}
                    style={{ color: likedSongs.includes(selectedSongForMenu.id) ? '#f43f5e' : undefined }}
                  />
                  <span>
                    {likedSongs.includes(selectedSongForMenu.id) ? 'Bỏ yêu thích' : 'Yêu thích'}
                  </span>
                </button>
              </div>

              {/* Close Button */}
              <button
                type="button"
                className="sheet-cancel-btn"
                onClick={() => setSelectedSongForMenu(null)}
              >
                Đóng
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(MobilePlaylistView);
