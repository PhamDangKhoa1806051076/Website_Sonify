'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PlayerBar from '@/components/PlayerBar';
import SongGrid from '@/components/SongGrid';
import AuthModal from '@/components/AuthModal';
import AdminPanel from '@/components/AdminPanel';
import Profile from '@/components/Profile';
import FeedbackModal from '@/components/FeedbackModal';
import { useLanguage } from '@/context/LanguageContext';
import { usePlayer } from '@/context/PlayerContext';
import { searchOnlineSongs, getGlobalTopSongs, getVietnamTopSongs, getTrendingSongs, getChineseTopSongs } from '@/services/musicService';
import ChartSection from '@/components/ChartSection';
import HomeBanner from '@/components/HomeBanner';
import ScrollToTop from '@/components/ScrollToTop';

import { Song } from '@/data/constants';

export default function Home() {
  const { t } = useLanguage();
  const { likedSongs, playlists, allSongs } = usePlayer();

  // Read tab from hash synchronously on first render to avoid flash
  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });

  const [categories, setCategories] = useState<{ _id: string; name: string; slug: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  // Update URL hash silently (no scroll jump) when tab changes
  const setActiveTab = (tab: string) => {
    // history.replaceState avoids the browser's scroll-to-top behaviour
    history.replaceState(null, '', `#${tab}`);
    setActiveTabState(tab);
    setSelectedCategory(''); // Reset category filters on tab switch
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineSongs, setOnlineSongs] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [vietnamSongs, setVietnamSongs] = useState<Song[]>([]);
  const [chineseSongs, setChineseSongs] = useState<Song[]>([]);
  const [usUkSongs, setUsUkSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isExploreLoading, setIsExploreLoading] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => {
        if (d.success) setCategories(d.data);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Custom debounce function to avoid adding more deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOnline = useCallback(
    (() => {
        let timeoutId: NodeJS.Timeout;
        return (query: string) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(async () => {
                if (!query.trim()) {
                    setOnlineSongs([]);
                    setIsSearching(false);
                    return;
                }
                setIsSearching(true);
                const results = await searchOnlineSongs(query);
                setOnlineSongs(results);
                setIsSearching(false);
            }, 800);
        };
    })(),
    []
  );

  useEffect(() => {
    if (searchQuery.trim()) {
        fetchOnline(searchQuery);
    } else {
        setOnlineSongs([]);
        setIsSearching(false);
    }
  }, [searchQuery, fetchOnline]);

  // Handle Trending and Charts Songs
  useEffect(() => {
    const fetchCharts = async () => {
      setIsExploreLoading(true);
      try {
        const [trending, vn, cn, usuk] = await Promise.all([
          getTrendingSongs(),
          getVietnamTopSongs(),
          getChineseTopSongs(),
          getGlobalTopSongs()
        ]);
        setTrendingSongs(trending);
        setVietnamSongs(vn);
        setChineseSongs(cn);
        setUsUkSongs(usuk);
      } catch (error) {
        console.error("Failed to fetch charts:", error);
      } finally {
        setIsExploreLoading(false);
      }
    };
    
    if (trendingSongs.length === 0) {
      fetchCharts();
    }
  }, [trendingSongs.length]);

  // Load recently played from localStorage
  useEffect(() => {
    const updateRecent = () => {
      const saved = localStorage.getItem('sonify_recent');
      if (saved && allSongs.length > 0) {
        const recentIds = JSON.parse(saved);
        const filtered = recentIds.map((id: string | number) => allSongs.find(s => s.id === id)).filter(Boolean) as Song[];
        setRecentSongs(filtered);
      }
    };

    updateRecent();
    window.addEventListener('sonify_recent_updated', updateRecent);
    return () => window.removeEventListener('sonify_recent_updated', updateRecent);
  }, [allSongs]);

  // Compute displayed songs based on active tab using useMemo for performance
  const displaySongs = React.useMemo(() => {
    if (allSongs.length === 0) return [];
    
    let baseList: Song[] = [];
    if (activeTab === 'home' || activeTab === 'library') {
      baseList = allSongs;
    } else if (activeTab === 'explore') {
      baseList = trendingSongs;
    } else if (activeTab === 'recent') {
      baseList = recentSongs;
    } else if (activeTab === 'liked') {
      baseList = likedSongs.map((id: string | number) => allSongs.find(s => s.id === id)).filter(Boolean) as Song[];
    } else if (activeTab.startsWith('playlist-')) {
      const playlistId = activeTab.replace('playlist-', '');
      const playlist = playlists.find(p => p.id === playlistId);
      if (playlist) {
        baseList = playlist.songIds.map(id => allSongs.find(s => s.id === id)).filter(Boolean) as Song[];
      }
    }

    if (selectedCategory && (activeTab === 'home' || activeTab === 'library')) {
      return baseList.filter(s => s.category === selectedCategory);
    }
    return baseList;
  }, [activeTab, recentSongs, likedSongs, trendingSongs, playlists, allSongs, selectedCategory]);

  const isAdminTab = activeTab.startsWith('admin-');

  // Filter local songs using useMemo
  const localSearchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return displaySongs;
    const query = searchQuery.toLowerCase();
    return displaySongs.filter(s => 
      s.title.toLowerCase().includes(query) || 
      s.artist.toLowerCase().includes(query)
    );
  }, [searchQuery, displaySongs]);

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <main className="content">
        <Header 
          setActiveTab={setActiveTab} 
          onLoginClick={() => setIsAuthModalOpen(true)}
          onFeedbackClick={() => setIsFeedbackModalOpen(true)}
          onSearch={(query) => setSearchQuery(query)}
        />

        {activeTab === 'home' && !searchQuery.trim() && (
          <HomeBanner 
            currentBanner={currentBanner} 
            trendingSongs={trendingSongs} 
          />
        )}

        {isAdminTab ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <AdminPanel view={activeTab.split('-')[1] as 'music' | 'users' | 'stats' | 'categories'} />
          </motion.div>
        ) : activeTab === 'profile' ? (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Profile />
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="scroll-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
            {/* Local Section */}
            {activeTab !== 'charts' && (
              <section className="song-list-container">
                <div className="section-header" style={{ marginBottom: '1rem' }}>
                  <h2>
                    {searchQuery.trim() ? t('search-local') : (
                      activeTab === 'home' ? t('song-list-title') : 
                      activeTab === 'recent' ? t('nav-recent') : 
                      activeTab === 'explore' ? t('nav-explore') : 
                      activeTab === 'liked' ? t('nav-liked') : t('song-list-title')
                    )}
                  </h2>
                  {activeTab === 'explore' && isExploreLoading ? (
                      <span className="searching-spinner"><i className="fa-solid fa-spinner fa-spin"></i> {t('searching')}</span>
                  ) : (
                      <span>{localSearchResults.length} {t('song-count')}</span>
                  )}
                </div>

                {/* Category Chips Filters */}
                {(activeTab === 'home' || activeTab === 'library') && !searchQuery.trim() && categories.length > 0 && (
                  <div className="category-chips" style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '1.8rem',
                    overflowX: 'auto',
                    paddingBottom: '8px',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}>
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`category-chip ${selectedCategory === '' ? 'active' : ''}`}
                      style={{
                        background: selectedCategory === '' ? 'var(--primary-color)' : 'rgba(255,255,255,0.04)',
                        color: 'white',
                        border: '1px solid var(--glass-border)',
                        padding: '8px 22px',
                        borderRadius: '50px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'var(--transition)',
                        boxShadow: selectedCategory === '' ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none'
                      }}
                    >
                      Tất cả
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug)}
                        className={`category-chip ${selectedCategory === cat.slug ? 'active' : ''}`}
                        style={{
                          background: selectedCategory === cat.slug ? 'var(--primary-color)' : 'rgba(255,255,255,0.04)',
                          color: 'white',
                          border: '1px solid var(--glass-border)',
                          padding: '8px 22px',
                          borderRadius: '50px',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'var(--transition)',
                          boxShadow: selectedCategory === cat.slug ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none'
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}

                <SongGrid songs={localSearchResults} />
              </section>
            )}

            {/* Charts Sections - Shows ONLY on specific Charts tab */}
            {activeTab === 'charts' && !searchQuery.trim() && (
              <section className="charts-container-wrapper" style={{ marginTop: '1.5rem' }}>
                <div className="section-header">
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '1.8rem', fontWeight: '900', letterSpacing: '-0.5px' }}>{t('nav-charts')}</h2>
                </div>
                <div className="charts-horizontal-scroll" style={{
                  display: 'flex',
                  gap: '24px',
                  overflowX: 'auto',
                  paddingBottom: '30px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(255,255,255,0.2) transparent'
                }}>
                  <ChartSection 
                    title={t('charts-trending')} 
                    songs={trendingSongs} 
                    titleColor="#ff4d4d" 
                    bgColor="rgba(60, 20, 20, 0.4)"
                  />
                  <ChartSection 
                    title={t('charts-vietnam')} 
                    songs={vietnamSongs} 
                    titleColor="#facc15" 
                    bgColor="rgba(40, 40, 10, 0.4)"
                  />
                  <ChartSection 
                    title={t('charts-chinese')} 
                    songs={chineseSongs} 
                    titleColor="#a855f7" 
                    bgColor="rgba(30, 20, 50, 0.4)"
                  />
                  <ChartSection 
                    title={t('charts-usuk')} 
                    songs={usUkSongs} 
                    titleColor="#3b82f6" 
                    bgColor="rgba(10, 30, 60, 0.4)"
                  />
                </div>
              </section>
            )}

            {/* Online Section */}
            {searchQuery.trim() && (
              <section className="song-list-container online-section" style={{ marginTop: '2rem' }}>
                <div className="section-header">
                  <h2>{t('search-online')}</h2>
                  {isSearching && <span className="searching-spinner"><i className="fa-solid fa-spinner fa-spin"></i> {t('searching')}</span>}
                  {!isSearching && <span>{onlineSongs.length} {t('song-count')}</span>}
                </div>
                <SongGrid songs={onlineSongs} />
              </section>
            )}
          </motion.div>
          </AnimatePresence>
        )}
      </main>

      <PlayerBar />

      <ScrollToTop />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />

      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
    </div>
  );
}
