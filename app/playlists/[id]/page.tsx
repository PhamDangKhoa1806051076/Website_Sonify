'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import SongGrid from '@/components/SongGrid';
import { usePlayer } from '@/context/PlayerContext';
import { Song } from '@/data/constants';

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = params?.id as string;

  const { playlists, allSongs } = usePlayer();

  const currentPlaylist = useMemo(() => {
    return playlists.find((p) => p.id === playlistId);
  }, [playlists, playlistId]);

  const playlistSongs = useMemo(() => {
    if (!currentPlaylist) return [];
    return currentPlaylist.songIds
      .map((id) => allSongs.find((s) => s.id === id))
      .filter(Boolean) as Song[];
  }, [currentPlaylist, allSongs]);

  return (
    <motion.div
      key={`playlist-${playlistId}`}
      className="scroll-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <section className="song-list-container">
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <h2>{currentPlaylist ? currentPlaylist.name : 'Album / Playlist'}</h2>
          <span>{playlistSongs.length} bài hát</span>
        </div>

        {currentPlaylist ? (
          <SongGrid songs={playlistSongs} />
        ) : (
          <p className="text-zinc-500 text-sm py-8 text-center">Không tìm thấy album / playlist này.</p>
        )}
      </section>
    </motion.div>
  );
}
