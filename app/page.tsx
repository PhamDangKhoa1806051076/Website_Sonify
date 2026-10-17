'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import SongGrid from '@/components/SongGrid';
import MobilePlaylistView from '@/components/MobilePlaylistView';
import HomeBanner from '@/components/HomeBanner';
import MobileGreeting from '@/components/MobileGreeting';
import { useLanguage } from '@/context/LanguageContext';
import { usePlayer } from '@/context/PlayerContext';
import { useSearch } from '@/components/AppShell';
import { searchOnlineSongs, getTrendingSongs } from '@/services/musicService';
import { Song } from '@/data/constants';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const { allSongs } = usePlayer();
  const { searchQuery } = useSearch();

  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [onlineSongs, setOnlineSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [quickMixFilter, setQuickMixFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'default' | 'title-asc' | 'title-desc' | 'artist-asc' | 'duration-desc'>('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'songs' | 'podcast' | 'audiobooks'>('songs');

  // Close sort menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.sort-menu-container')) {
        setIsSortOpen(false);
      }
    };
    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSortOpen]);

  // Listen to Quick Mix mood filter from MobileGreeting
  useEffect(() => {
    const handleFilter = (e: Event) => {
      const customEvent = e as CustomEvent<string | null>;
      setQuickMixFilter(customEvent.detail || null);
    };
    window.addEventListener('quick-mix-filter', handleFilter);
    return () => window.removeEventListener('quick-mix-filter', handleFilter);
  }, []);

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
    if (quickMixFilter) {
      const qf = quickMixFilter.toLowerCase();
      const filtered = list.filter((s) => {
        const text = `${s.title} ${s.artist} ${s.category || ''}`.toLowerCase();
        if (qf === 'chill') return /chill|mưa|ballad|thương|yêu|phố|đẹp|cũ|nam|linh|nguyên/i.test(text);
        if (qf === 'energy') return /remix|rap|right|ray|thanh niên|phù hộ|con|sôi/i.test(text);
        if (qf === 'focus') return /piano|lofi|instrumental|không lời|cố đô|lá cờ|định|rum/i.test(text);
        if (qf === 'sleep') return /mưa|êm|đêm|ngủ|phép màu|ổn|an|hùng/i.test(text);
        if (qf === 'workout') return /remix|right|ray|pin|sáng ngời|việt nam|v\.a|domic/i.test(text);
        if (qf === 'vibe') return /amee|domic|phúc|hate|hoàng|yêu|quinn/i.test(text);
        return true;
      });
      if (filtered.length > 0) {
        list = filtered;
      }
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'title-asc') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    }
    if (sortBy === 'title-desc') {
      return [...list].sort((a, b) => b.title.localeCompare(a.title, 'vi'));
    }
    if (sortBy === 'artist-asc') {
      return [...list].sort((a, b) => a.artist.localeCompare(b.artist, 'vi'));
    }
    if (sortBy === 'duration-desc') {
      return [...list].sort((a, b) => (b.duration || '0:00').localeCompare(a.duration || '0:00'));
    }
    return list;
  }, [allSongs, selectedCategory, quickMixFilter, searchQuery, sortBy]);

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
          <>
            <div className="mobile-only-hero">
              <MobileGreeting />
            </div>
            <div className="desktop-only-hero">
              <HomeBanner currentBanner={currentBanner} trendingSongs={trendingSongs} />
            </div>
          </>
        )}

        {/* ============================================================
            DESKTOP SONG LIST (Original Website UI - 100% Untouched)
           ============================================================ */}
        <section className="song-list-container desktop-only">
          <div className="section-header" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2>
                {searchQuery.trim() ? t('search-local') : t('song-list-title')}
              </h2>
              {quickMixFilter && (
                <span
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setQuickMixFilter(null);
                    window.dispatchEvent(new CustomEvent('quick-mix-filter', { detail: null }));
                  }}
                  title="Bỏ lọc tâm trạng"
                >
                  <i className="fa-solid fa-sparkles" /> Mood: {quickMixFilter.toUpperCase()}
                  <i className="fa-solid fa-xmark" style={{ fontSize: '0.7rem' }} />
                </span>
              )}
            </div>
            <span>{displaySongs.length} {t('song-count')}</span>
          </div>

          {/* Original Desktop Category Chips */}
          {!searchQuery.trim() && (
            <div
              className="category-chips"
              style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '1.6rem',
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
              <button
                onClick={() => router.push('/charts')}
                className="category-chip"
                style={{
                  background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15), rgba(245, 158, 11, 0.15))',
                  color: '#fbbf24',
                  border: '1px solid rgba(234, 179, 8, 0.3)',
                  padding: '8px 18px',
                  borderRadius: '50px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="fa-solid fa-chart-simple"></i>
                Bảng xếp hạng
              </button>
              <button
                onClick={() => router.push('/podcast')}
                className="category-chip"
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(168, 85, 247, 0.15))',
                  color: '#f472b6',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  padding: '8px 18px',
                  borderRadius: '50px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="fa-solid fa-microphone"></i>
                Podcast
              </button>
              <button
                onClick={() => router.push('/audiobooks')}
                className="category-chip"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '8px 18px',
                  borderRadius: '50px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="fa-solid fa-book-open"></i>
                Sách nói
              </button>
              <button
                onClick={() => router.push('/liked')}
                className="category-chip"
                style={{
                  background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15), rgba(236, 72, 153, 0.15))',
                  color: '#fb7185',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  padding: '8px 18px',
                  borderRadius: '50px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <i className="fa-solid fa-heart"></i>
                Yêu thích
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

        {/* ============================================================
            MOBILE SONG LIST (Reference UI Mockup Layout - Mobile Only)
           ============================================================ */}
        <div className="mobile-only">
          <section className="song-list-container mobile-song-section">
            {quickMixFilter && (
              <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <span
                  className="mobile-mood-badge"
                  onClick={() => {
                    setQuickMixFilter(null);
                    window.dispatchEvent(new CustomEvent('quick-mix-filter', { detail: null }));
                  }}
                  title="Bỏ lọc tâm trạng"
                >
                  <i className="fa-solid fa-sparkles" /> Tâm trạng: {quickMixFilter.toUpperCase()}
                  <i className="fa-solid fa-xmark" style={{ fontSize: '0.7rem' }} />
                </span>
              </div>
            )}

            {!searchQuery.trim() && (
              <div className="mobile-filter-bar">
                <div className="mobile-segmented-group">
                  <button
                    type="button"
                    className={`segmented-tab ${activeTab === 'songs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('songs')}
                  >
                    Bài hát
                  </button>
                  <button
                    type="button"
                    className={`segmented-tab ${activeTab === 'podcast' ? 'active' : ''}`}
                    onClick={() => router.push('/podcast')}
                  >
                    Podcast
                  </button>
                  <button
                    type="button"
                    className={`segmented-tab ${activeTab === 'audiobooks' ? 'active' : ''}`}
                    onClick={() => router.push('/audiobooks')}
                  >
                    Sách
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => router.push('/charts')}
                  className="mobile-action-pill"
                >
                  <i className="fa-solid fa-chart-simple" style={{ fontSize: '0.85rem' }} />
                  <span>Bảng xếp hạng</span>
                </button>

                <div className="sort-menu-container" style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setIsSortOpen((prev) => !prev)}
                    className={`mobile-action-pill ${sortBy !== 'default' ? 'active' : ''}`}
                  >
                    <i className="fa-solid fa-arrow-down-wide-short" style={{ fontSize: '0.85rem' }} />
                    <span>Sắp xếp {sortBy !== 'default' && '•'}</span>
                  </button>

                  {isSortOpen && (
                    <div className="sort-dropdown-menu">
                      <div className="sort-dropdown-title">Sắp xếp theo</div>
                      <button
                        type="button"
                        className={`sort-option ${sortBy === 'default' ? 'active' : ''}`}
                        onClick={() => { setSortBy('default'); setIsSortOpen(false); }}
                      >
                        <span>Mặc định</span>
                        {sortBy === 'default' && <i className="fa-solid fa-check" />}
                      </button>
                      <button
                        type="button"
                        className={`sort-option ${sortBy === 'title-asc' ? 'active' : ''}`}
                        onClick={() => { setSortBy('title-asc'); setIsSortOpen(false); }}
                      >
                        <span>Tên bài hát (A → Z)</span>
                        {sortBy === 'title-asc' && <i className="fa-solid fa-check" />}
                      </button>
                      <button
                        type="button"
                        className={`sort-option ${sortBy === 'title-desc' ? 'active' : ''}`}
                        onClick={() => { setSortBy('title-desc'); setIsSortOpen(false); }}
                      >
                        <span>Tên bài hát (Z → A)</span>
                        {sortBy === 'title-desc' && <i className="fa-solid fa-check" />}
                      </button>
                      <button
                        type="button"
                        className={`sort-option ${sortBy === 'artist-asc' ? 'active' : ''}`}
                        onClick={() => { setSortBy('artist-asc'); setIsSortOpen(false); }}
                      >
                        <span>Ca sĩ (A → Z)</span>
                        {sortBy === 'artist-asc' && <i className="fa-solid fa-check" />}
                      </button>
                      <button
                        type="button"
                        className={`sort-option ${sortBy === 'duration-desc' ? 'active' : ''}`}
                        onClick={() => { setSortBy('duration-desc'); setIsSortOpen(false); }}
                      >
                        <span>Thời lượng dài nhất</span>
                        {sortBy === 'duration-desc' && <i className="fa-solid fa-check" />}
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCategory('')}
                  className={`mobile-action-pill ${selectedCategory === '' ? 'active' : ''}`}
                >
                  <span>Tất cả</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                    className={`mobile-action-pill ${selectedCategory === cat.slug ? 'active' : ''}`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            )}

            <MobilePlaylistView
              title={searchQuery.trim() ? t('search-local') : 'Bài hát dành cho bạn'}
              subtitle={`${displaySongs.length} bài hát • Tuyển chọn hôm nay`}
              songs={displaySongs}
              initialCount={6}
              showExpandButton={displaySongs.length > 6}
            />
          </section>
        </div>

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
