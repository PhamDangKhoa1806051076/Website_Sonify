'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '@/context/PlayerContext';
import { useLanguage } from '@/context/LanguageContext';
import { searchOnlineSongs, getTrendingSongs } from '@/services/musicService';
import { Song } from '@/data/constants';

export default function MobileHomePage() {
  const { t } = useLanguage();
  const { allSongs, currentSong, isPlaying, playSong, likedSongs, toggleLike } = usePlayer();

  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineSongs, setOnlineSongs] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Fetch categories & trending songs
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCategories(d.data);
      })
      .catch(() => {});

    getTrendingSongs()
      .then((songs) => setTrendingSongs(songs))
      .catch(() => {});
  }, []);

  // Rotate banner
  useEffect(() => {
    if (trendingSongs.length === 0) return;
    const interval = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % Math.min(trendingSongs.length, 5));
    }, 4000);
    return () => clearInterval(interval);
  }, [trendingSongs.length]);

  // Online music search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setOnlineSongs([]);
      setIsSearching(false);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchOnlineSongs(searchQuery);
      setOnlineSongs(results);
      setIsSearching(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter local songs
  const filteredLocalSongs = useMemo(() => {
    let list = allSongs;
    if (selectedCategory) {
      list = list.filter((s) => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allSongs, selectedCategory, searchQuery]);

  const activeBannerSong = trendingSongs[bannerIndex] || allSongs[0];

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 text-sm"></i>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm bài hát, ca sĩ, lời nhạc..."
          className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      {/* Featured Banner Carousel */}
      {!searchQuery && activeBannerSong && (
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 p-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-lg border border-white/10 shrink-0">
              <Image
                src={activeBannerSong.cover}
                alt={activeBannerSong.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Hot Banner #{bannerIndex + 1}
              </span>
              <h3 className="text-base font-bold text-white truncate mt-1">{activeBannerSong.title}</h3>
              <p className="text-xs text-zinc-300 truncate">{activeBannerSong.artist}</p>
              <button
                onClick={() => playSong(activeBannerSong)}
                className="mt-2 px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow flex items-center gap-1.5 transition-all"
              >
                <i className="fa-solid fa-play text-[10px]"></i> Phát ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Horizontal Scroll Chips */}
      {!searchQuery && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Thể loại âm nhạc</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === ''
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10'
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Online Search Results */}
      {searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <i className="fa-solid fa-globe text-indigo-400"></i> Kết quả trực tuyến
            </h2>
            {isSearching && (
              <span className="text-xs text-indigo-400 flex items-center gap-1">
                <i className="fa-solid fa-spinner fa-spin"></i> Đang tìm...
              </span>
            )}
          </div>
          {onlineSongs.length > 0 ? (
            <div className="space-y-2">
              {onlineSongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => playSong(song)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={song.cover} alt={song.title} className="w-11 h-11 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
                      <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center">
                    <i className="fa-solid fa-play text-xs"></i>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !isSearching && <p className="text-xs text-zinc-500 text-center py-4">Không tìm thấy bài hát trực tuyến phù hợp.</p>
          )}
        </div>
      )}

      {/* Main Songs List (Local) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <i className="fa-solid fa-compact-disc text-pink-400"></i>
            {searchQuery ? 'Bài hát nội bộ' : 'Danh sách bài hát'}
            <span className="text-xs text-zinc-500 font-normal">({filteredLocalSongs.length})</span>
          </h2>
          <Link href="/ban%20danh%20cho%20app%20moblie/app/rankings" className="text-xs text-indigo-400 hover:underline">
            Xem BXH →
          </Link>
        </div>

        <div className="space-y-2">
          {filteredLocalSongs.map((song) => {
            const isCurrent = currentSong?.id === song.id;
            const isLiked = likedSongs.includes(song.id);

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
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <Image src={song.cover} alt={song.title} fill className="object-cover" sizes="44px" />
                    {isCurrent && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <i className={`fa-solid ${isPlaying ? 'fa-volume-high text-indigo-400 fa-pulse' : 'fa-play text-white'} text-xs`}></i>
                      </div>
                    )}
                  </div>
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
      </div>
    </div>
  );
}
