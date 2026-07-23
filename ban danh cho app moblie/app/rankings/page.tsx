'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePlayer } from '@/context/PlayerContext';
import { getTrendingSongs, getVietnamTopSongs, getChineseTopSongs, getGlobalTopSongs } from '@/services/musicService';
import { Song } from '@/data/constants';

export default function MobileRankingsPage() {
  const { playSong, currentSong, isPlaying, likedSongs, toggleLike } = usePlayer();

  const [activeTab, setActiveTab] = useState<'trending' | 'vn' | 'usuk' | 'cn'>('trending');
  const [trending, setTrending] = useState<Song[]>([]);
  const [vietnam, setVietnam] = useState<Song[]>([]);
  const [usuk, setUsuk] = useState<Song[]>([]);
  const [chinese, setChinese] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getTrendingSongs(),
      getVietnamTopSongs(),
      getGlobalTopSongs(),
      getChineseTopSongs(),
    ])
      .then(([tr, vn, us, cn]) => {
        setTrending(tr);
        setVietnam(vn);
        setUsuk(us);
        setChinese(cn);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getCurrentList = () => {
    switch (activeTab) {
      case 'vn':
        return vietnam;
      case 'usuk':
        return usuk;
      case 'cn':
        return chinese;
      default:
        return trending;
    }
  };

  const currentList = getCurrentList();

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 shadow-lg shadow-amber-500/20 mb-1">
          <i className="fa-solid fa-trophy text-white text-xl"></i>
        </div>
        <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-indigo-300">
          Bảng Xếp Hạng Âm Nhạc
        </h1>
        <p className="text-xs text-zinc-400">Cập nhật xu hướng và những bài hát được nghe nhiều nhất</p>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl">
        <button
          onClick={() => setActiveTab('trending')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'trending' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Trending
        </button>
        <button
          onClick={() => setActiveTab('vn')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'vn' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Việt Nam
        </button>
        <button
          onClick={() => setActiveTab('usuk')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'usuk' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          US-UK
        </button>
        <button
          onClick={() => setActiveTab('cn')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cn' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Nhạc Hoa
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center items-center py-12 text-indigo-400 text-sm gap-2">
          <i className="fa-solid fa-spinner fa-spin"></i> Đang tải bảng xếp hạng...
        </div>
      ) : (
        <div className="space-y-2">
          {currentList.map((song, idx) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = likedSongs.includes(song.id);
            const rank = idx + 1;

            return (
              <div
                key={song.id}
                onClick={() => playSong(song)}
                className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank number */}
                  <div
                    className={`w-7 text-center font-black text-sm shrink-0 ${
                      rank === 1
                        ? 'text-amber-400 text-base'
                        : rank === 2
                        ? 'text-slate-300 text-base'
                        : rank === 3
                        ? 'text-amber-600 text-base'
                        : 'text-zinc-500'
                    }`}
                  >
                    #{rank}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <Image src={song.cover} alt={song.title} fill className="object-cover" sizes="44px" />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <i className={`fa-solid ${isPlaying ? 'fa-volume-high text-indigo-400 fa-pulse' : 'fa-play text-white'} text-xs`}></i>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0">
                    <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-indigo-400' : 'text-white'}`}>
                      {song.title}
                    </h4>
                    <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleLike(song.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10"
                  >
                    <i className={`fa-heart text-xs ${isLiked ? 'fa-solid text-pink-500' : 'fa-regular text-zinc-400'}`}></i>
                  </button>
                  <button
                    onClick={() => playSong(song)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isCurrent ? 'bg-indigo-600 text-white' : 'bg-white/10 text-zinc-300'
                    }`}
                  >
                    <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-xs`}></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
