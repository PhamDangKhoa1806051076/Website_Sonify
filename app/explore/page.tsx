'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SongGrid from '@/components/SongGrid';
import { useLanguage } from '@/context/LanguageContext';
import { getTrendingSongs } from '@/services/musicService';
import { Song } from '@/data/constants';

export default function ExplorePage() {
  const { t } = useLanguage();
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTrendingSongs()
      .then((songs) => setTrendingSongs(songs))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <motion.div
      key="explore-page"
      className="scroll-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <section className="song-list-container">
        <div className="section-header" style={{ marginBottom: '1rem' }}>
          <h2>{t('nav-explore')}</h2>
          {isLoading ? (
            <span className="searching-spinner">
              <i className="fa-solid fa-spinner fa-spin"></i> {t('searching')}
            </span>
          ) : (
            <span>{trendingSongs.length} {t('song-count')}</span>
          )}
        </div>

        <SongGrid songs={trendingSongs} />
      </section>
    </motion.div>
  );
}
