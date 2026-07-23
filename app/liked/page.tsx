'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import SongGrid from '@/components/SongGrid';
import { useLanguage } from '@/context/LanguageContext';
import { usePlayer } from '@/context/PlayerContext';
import { Song } from '@/data/constants';

export default function LikedPage() {
  const { t } = useLanguage();
  const { likedSongs, allSongs } = usePlayer();

  const likedSongObjects = useMemo(() => {
    return likedSongs
      .map((id) => allSongs.find((s) => s.id === id))
      .filter(Boolean) as Song[];
  }, [likedSongs, allSongs]);

  return (
    <motion.div
      key="liked-page"
      className="scroll-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <section className="song-list-container">
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <h2>{t('nav-liked')}</h2>
          <span>{likedSongObjects.length} {t('song-count')}</span>
        </div>

        <SongGrid songs={likedSongObjects} />
      </section>
    </motion.div>
  );
}
