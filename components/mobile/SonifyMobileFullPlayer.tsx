'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayer } from '@/context/PlayerContext';

interface SonifyMobileFullPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SonifyMobileFullPlayer: React.FC<SonifyMobileFullPlayerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    volume,
    isShuffle,
    isRepeat,
    togglePlay,
    nextSong,
    prevSong,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    likedSongs,
    toggleLike,
    queue,
    playSong,
  } = usePlayer();

  const [activeTab, setActiveTab] = useState<'player' | 'lyrics' | 'queue'>('player');

  if (!isOpen || !currentSong) return null;

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '00:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  const isLiked = likedSongs.includes(currentSong.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-50 bg-gradient-to-b from-indigo-950 via-zinc-950 to-black text-white flex flex-col p-6 overflow-hidden"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <i className="fa-solid fa-chevron-down text-lg"></i>
          </button>
          
          <div className="flex items-center gap-2 bg-white/10 p-1 rounded-full text-xs font-semibold">
            <button
              onClick={() => setActiveTab('player')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'player' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400'
              }`}
            >
              Phát nhạc
            </button>
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'lyrics' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400'
              }`}
            >
              Lời bài hát
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-3 py-1 rounded-full transition-all ${
                activeTab === 'queue' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400'
              }`}
            >
              Hàng chờ
            </button>
          </div>

          <button
            onClick={() => toggleLike(currentSong.id)}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center transition-all"
          >
            <i className={`fa-heart text-lg ${isLiked ? 'fa-solid text-pink-500' : 'fa-regular text-white'}`}></i>
          </button>
        </div>

        {/* Tab 1: Main Player */}
        {activeTab === 'player' && (
          <div className="flex-1 flex flex-col items-center justify-around py-4">
            {/* Artwork */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden border-4 border-indigo-500/30 shadow-2xl shadow-indigo-500/20 my-4">
              <Image
                src={currentSong.cover}
                alt={currentSong.title}
                fill
                className={`object-cover transition-transform duration-1000 ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
                sizes="(max-width: 640px) 256px, 288px"
              />
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-zinc-950 border-2 border-white/20"></div>
            </div>

            {/* Song Meta */}
            <div className="text-center px-4 space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold truncate max-w-xs">{currentSong.title}</h2>
              <p className="text-sm text-indigo-300 font-medium truncate max-w-xs">{currentSong.artist}</p>
            </div>

            {/* Progress Slider */}
            <div className="w-full max-w-md space-y-2 px-2">
              <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress || 0}
                  onChange={(e) => seek((parseFloat(e.target.value) / 100) * (duration || 1))}
                  className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                />
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-zinc-400 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={toggleShuffle}
                className={`p-2 text-lg ${isShuffle ? 'text-indigo-400' : 'text-zinc-500'}`}
              >
                <i className="fa-solid fa-shuffle"></i>
              </button>

              <button
                onClick={prevSong}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl hover:bg-white/20 active:scale-95 transition-all"
              >
                <i className="fa-solid fa-backward-step"></i>
              </button>

              <button
                onClick={togglePlay}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-2xl text-white shadow-lg shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all"
              >
                <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-1'}`}></i>
              </button>

              <button
                onClick={nextSong}
                className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-xl hover:bg-white/20 active:scale-95 transition-all"
              >
                <i className="fa-solid fa-forward-step"></i>
              </button>

              <button
                onClick={toggleRepeat}
                className={`p-2 text-lg ${isRepeat ? 'text-indigo-400' : 'text-zinc-500'}`}
              >
                <i className="fa-solid fa-repeat"></i>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Lyrics */}
        {activeTab === 'lyrics' && (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center text-center">
            <h3 className="text-lg font-bold text-indigo-400 mb-4">{currentSong.title} - {currentSong.artist}</h3>
            <div className="text-zinc-300 leading-relaxed whitespace-pre-line text-sm max-w-md">
              {currentSong.lyrics || 'Chưa có lời bài hát cho bài hát này.'}
            </div>
          </div>
        )}

        {/* Tab 3: Queue */}
        {activeTab === 'queue' && (
          <div className="flex-1 overflow-y-auto p-2">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Hàng chờ phát ({queue.length})</h3>
            <div className="space-y-2">
              {queue.map((song, idx) => {
                const isCurrent = song.id === currentSong?.id;
                return (
                  <div
                    key={`${song.id}-${idx}`}
                    onClick={() => playSong(song)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300 font-bold'
                        : 'bg-white/5 border-white/5 text-zinc-300'
                    }`}
                  >
                    <img src={song.cover} alt={song.title} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{song.title}</p>
                      <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                    </div>
                    {isCurrent && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500 text-white font-medium">Đang phát</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SonifyMobileFullPlayer;
