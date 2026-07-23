'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SongGrid from '@/components/SongGrid';
import { useLanguage } from '@/context/LanguageContext';
import { usePlayer } from '@/context/PlayerContext';
import { Song } from '@/data/constants';

export default function RecentPage() {
  const { t } = useLanguage();
  const { allSongs } = usePlayer();
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);

  useEffect(() => {
    const updateRecent = () => {
      const saved = localStorage.getItem('sonify_recent');
      if (saved && allSongs.length > 0) {
        const recentIds = JSON.parse(saved);
        const filtered = recentIds
          .map((id: string | number) => allSongs.find((s) => s.id === id))
          .filter(Boolean) as Song[];
        setRecentSongs(filtered);
      }
    };

    updateRecent();
    window.addEventListener('sonify_recent_updated', updateRecent);
    return () => window.removeEventListener('sonify_recent_updated', updateRecent);
  }, [allSongs]);

  return (
    <motion.div
      key="recent-page"
      className="scroll-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <section className="song-list-container">
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <h2>{t('nav-recent')}</h2>
          <span>{recentSongs.length} {t('song-count')}</span>
        </div>

        <SongGrid songs={recentSongs} />
      </section>
    </motion.div>
  );
}
