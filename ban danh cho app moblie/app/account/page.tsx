'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';

export default function MobileAccountPage() {
  const { user, logout } = useAuth();
  const { likedSongs, playlists, allSongs, playSong, currentSong, isPlaying } = usePlayer();

  const [activeTab, setActiveTab] = useState<'liked' | 'playlists'>('liked');

  const likedSongObjects = allSongs.filter((s) => likedSongs.includes(s.id));

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-indigo-900/40 via-zinc-900/80 to-purple-900/40 p-5 shadow-xl">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/50 shrink-0 bg-indigo-600/30 flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-indigo-200">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white truncate">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold">
                  {user.role === 'admin' ? 'ADMIN' : 'VIP MEMBER'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 truncate mt-0.5">{user.email}</p>
              <button
                onClick={logout}
                className="mt-2 text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
              >
                <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-3">
            <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 text-xl">
              <i className="fa-solid fa-user-lock"></i>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Bạn chưa đăng nhập</h3>
              <p className="text-xs text-zinc-400 mt-1">Đăng nhập để đồng bộ bài hát yêu thích và playlist cá nhân</p>
            </div>
            <div className="flex justify-center gap-3">
              <Link
                href="/ban%20danh%20cho%20app%20moblie/app/login"
                className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow transition-all"
              >
                Đăng nhập
              </Link>
              <Link
                href="/ban%20danh%20cho%20app%20moblie/app/register"
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-white transition-all"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl">
          <button
            onClick={() => setActiveTab('liked')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'liked' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Đã thích ({likedSongObjects.length})
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'playlists' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Playlist ({playlists.length})
          </button>
        </div>

        {/* Tab content: Liked Songs */}
        {activeTab === 'liked' && (
          <div className="space-y-2">
            {likedSongObjects.length > 0 ? (
              likedSongObjects.map((song) => {
                const isCurrent = currentSong?.id === song.id;

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
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white truncate">{song.title}</h4>
                        <p className="text-xs text-zinc-400 truncate">{song.artist}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => playSong(song)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCurrent ? 'bg-indigo-600 text-white' : 'bg-white/10 text-zinc-300'
                      }`}
                    >
                      <i className={`fa-solid ${isCurrent && isPlaying ? 'fa-pause' : 'fa-play ml-0.5'} text-xs`}></i>
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-zinc-500 text-center py-6">Bạn chưa có bài hát yêu thích nào.</p>
            )}
          </div>
        )}

        {/* Tab content: Playlists */}
        {activeTab === 'playlists' && (
          <div className="space-y-2">
            {playlists.length > 0 ? (
              playlists.map((pl) => (
                <div
                  key={pl.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow">
                      <i className="fa-solid fa-list-ul"></i>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{pl.name}</h4>
                      <p className="text-xs text-zinc-400">{pl.songIds.length} bài hát</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-500 text-center py-6">Chưa có playlist nào được tạo.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
