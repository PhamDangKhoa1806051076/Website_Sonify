'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SongGrid from '@/components/SongGrid';
import HomeBanner from '@/components/HomeBanner';
import { useLanguage } from '@/context/LanguageContext';
import { usePlayer } from '@/context/PlayerContext';
import { useSearch } from '@/components/AppShell';
import { searchOnlineSongs, getTrendingSongs } from '@/services/musicService';
import { Song } from '@/data/constants';

export default function Home() {
  const { t } = useLanguage();
  const { allSongs } = usePlayer();
  const { searchQuery } = useSearch();

  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [onlineSongs, setOnlineSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setCategories(d.data);
      })
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

  // Fetch trending songs for banner
  useEffect(() => {
    getTrendingSongs()
      .then((songs) => setTrendingSongs(songs))
      .catch((err) => console.error(err));
  }, []);

  // Banner rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Debounced online search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setOnlineSongs([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchOnlineSongs(searchQuery);
      setOnlineSongs(results);
      setIsSearching(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Compute displayed local songs
  const displaySongs = useMemo(() => {
    let list = allSongs;
    if (selectedCategory) {
      list = list.filter((s) => s.category === selectedCategory);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    );
  }, [allSongs, selectedCategory, searchQuery]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home-page"
        className="scroll-container"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        {!searchQuery.trim() && (
          <HomeBanner currentBanner={currentBanner} trendingSongs={trendingSongs} />
        )}

        <section className="song-list-container">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <h2>
              {searchQuery.trim() ? t('search-local') : t('song-list-title')}
            </h2>
            <span>{displaySongs.length} {t('song-count')}</span>
          </div>

          {/* Category Chips Filters */}
          {!searchQuery.trim() && categories.length > 0 && (
            <div
              className="category-chips"
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '1.8rem',
                overflowX: 'auto',
                paddingBottom: '8px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <button
                onClick={() => setSelectedCategory('')}
                className={`category-chip ${selectedCategory === '' ? 'active' : ''}`}
                style={{
                  background: selectedCategory === '' ? 'var(--primary-color)' : 'rgba(255,255,255,0.06)',
                  color: selectedCategory === '' ? 'white' : 'var(--text-muted)',
                  border: '1px solid var(--glass-border)',
                  padding: '8px 22px',
                  borderRadius: '50px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                  boxShadow: selectedCategory === '' ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                }}
              >
                Tất cả
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`category-chip ${selectedCategory === cat.slug ? 'active' : ''}`}
                  style={{
                    background: selectedCategory === cat.slug ? 'var(--primary-color)' : 'rgba(255,255,255,0.06)',
                    color: selectedCategory === cat.slug ? 'white' : 'var(--text-muted)',
                    border: '1px solid var(--glass-border)',
                    padding: '8px 22px',
                    borderRadius: '50px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'var(--transition)',
                    boxShadow: selectedCategory === cat.slug ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          <SongGrid songs={displaySongs} />
        </section>

        {/* Online Search Results */}
        {searchQuery.trim() && (
          <section className="song-list-container online-section" style={{ marginTop: '2rem' }}>
            <div className="section-header">
              <h2>{t('search-online')}</h2>
              {isSearching && (
                <span className="searching-spinner">
                  <i className="fa-solid fa-spinner fa-spin"></i> {t('searching')}
                </span>
              )}
              {!isSearching && (
                <span>{onlineSongs.length} {t('song-count')}</span>
              )}
            </div>
            <SongGrid songs={onlineSongs} />
          </section>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
