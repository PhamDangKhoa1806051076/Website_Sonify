'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePlayer } from '@/context/PlayerContext';
import SonifyMobileFullPlayer from './SonifyMobileFullPlayer';

export const SonifyMobileMiniPlayer: React.FC = () => {
  const { currentSong, isPlaying, togglePlay, nextSong } = usePlayer();
  const [isFullPlayerOpen, setIsFullPlayerOpen] = useState(false);

  if (!currentSong) return null;

  return (
    <>
      <div
        onClick={() => setIsFullPlayerOpen(true)}
        className="mobile-mini-player fixed bottom-16 left-3 right-3 z-30 bg-zinc-900/95 border border-indigo-500/30 rounded-2xl p-2 flex items-center justify-between shadow-2xl backdrop-blur-xl cursor-pointer active:scale-[0.99] transition-all"
      >
        {/* Track Thumbnail + Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10">
            <Image
              src={currentSong.cover}
              alt={currentSong.title}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-white truncate leading-tight">{currentSong.title}</h4>
            <p className="text-xs text-indigo-300 truncate font-medium">{currentSong.artist}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 hover:scale-105 active:scale-95 transition-all"
          >
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play ml-0.5'}`}></i>
          </button>

          <button
            onClick={nextSong}
            className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-forward-step text-sm"></i>
          </button>
        </div>
      </div>

      <SonifyMobileFullPlayer
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
      />
    </>
  );
};

export default SonifyMobileMiniPlayer;
