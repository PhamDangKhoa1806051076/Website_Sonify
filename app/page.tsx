'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { searchOnlineSongs } from '@/services/musicService';

import { Song } from '@/data/constants';

export default function Home() {
  const { t } = useLanguage();
  const { likedSongs, playlists, allSongs } = usePlayer();
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [displaySongs, setDisplaySongs] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineSongs, setOnlineSongs] = useState<Song[]>([]);
  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isExploreLoading, setIsExploreLoading] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  // Handle Trending Songs for banners and Explore tab
  useEffect(() => {
    if (trendingSongs.length === 0) {
      const fetchTrending = async () => {
        setIsExploreLoading(true);
        try {
          const { getTrendingSongs } = await import('@/services/musicService');
          const results = await getTrendingSongs();
          setTrendingSongs(results);
        } catch (error) {
          console.error("Failed to fetch trending songs:", error);
        } finally {
          setIsExploreLoading(false);
        }
      };
      fetchTrending();
    }
  }, [trendingSongs.length]);

  // Load recently played from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sonify_recent');
    if (saved && allSongs.length > 0) {
      const recentIds = JSON.parse(saved);
      const filtered = recentIds.map((id: string | number) => allSongs.find(s => s.id === id)).filter(Boolean) as Song[];
      setRecentSongs(filtered);
    }
  }, [activeTab, allSongs]);

  // Update displayed songs based on active tab
  useEffect(() => {
    // Immediate clear to prevent "sticky" data during transitions
    if (!activeTab || allSongs.length === 0) return;
    
    if (activeTab === 'home' || activeTab === 'library') {
      setDisplaySongs(allSongs);
    } else if (activeTab === 'explore') {
      setDisplaySongs(trendingSongs);
    } else if (activeTab === 'recent') {
      setDisplaySongs(recentSongs);
    } else if (activeTab === 'liked') {
      const filtered = likedSongs.map((id: string | number) => allSongs.find(s => s.id === id)).filter(Boolean) as Song[];
      setDisplaySongs(filtered);
    } else if (activeTab.startsWith('playlist-')) {
      const playlistId = activeTab.replace('playlist-', '');
      const playlist = playlists.find(p => p.id === playlistId);
      if (playlist) {
        const filtered = playlist.songIds.map(id => allSongs.find(s => s.id === id)).filter(Boolean) as Song[];
        setDisplaySongs(filtered);
      }
    }
  }, [activeTab, recentSongs, likedSongs, trendingSongs, playlists, allSongs]);

  const isAdminTab = activeTab.startsWith('admin-');

  // Filter local songs
  const localSearchResults = searchQuery.trim() 
    ? displaySongs.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.artist.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : displaySongs;

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

        {activeTab === 'home' && !searchQuery.trim() && (() => {
          const banners = [
            { 
              img: '/img/banner_nature.png', 
              text: "Gói ghém Bình yên", 
              color: '#e0f2fe', 
              bg: 'rgba(0,30,60,0.5)', 
              align: 'flex-start', 
              textAlign: 'left' 
            },
            { 
              img: '/img/banner_house.png', 
              text: "Story hôm nay up bài gì?", 
              color: '#ffedd5', 
              bg: 'rgba(80,30,10,0.4)', 
              align: 'flex-end', 
              textAlign: 'right' 
            },
            { 
              img: '/img/banner_boat.png', 
              text: "Bảng Xếp Hạng\nHot Trong Tuần", 
              color: '#fdf2f2', 
              bg: 'rgba(10,30,60,0.5)', 
              align: 'center', 
              textAlign: 'center',
              featured: trendingSongs.length > 0 ? trendingSongs.slice(0, 3) : null
            },
            { 
              img: '/img/banner_sunset.png', 
              text: "Những Bài Hát\nNghe Nhiều Nhất", 
              color: '#f0f9ff', 
              bg: 'rgba(40,20,10,0.5)', 
              align: 'flex-start', 
              textAlign: 'left',
              featured: trendingSongs.length > 3 ? trendingSongs.slice(3, 6) : null
            }
          ];
          const banner = (banners as any)[currentBanner] || banners[0];
          
          return (
            <section 
              className="hero-section hero-banner" 
              style={{ 
                backgroundImage: `url(${banner.img})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                transition: 'background-image 0.5s ease-in-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: (banner as any).featured ? 'space-between' : banner.align as any,
                textAlign: banner.textAlign as any,
                height: '240px',
                minHeight: '240px',
                position: 'relative',
                padding: '2rem 3rem',
                gap: '2rem'
              }}
            >
              <div className="hero-content" style={{ 
                background: banner.bg, 
                padding: '1.2rem 2rem', 
                borderRadius: '16px',
                backdropFilter: 'blur(8px)',
                maxWidth: (banner as any).featured ? '45%' : '85%',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}>
                <h1 style={{ 
                    whiteSpace: (banner as any).featured ? 'pre-line' : 'nowrap', 
                    fontSize: '1.8rem', 
                    color: banner.color,
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    marginBottom: '4px',
                    lineHeight: '1.2'
                }}>
                  {banner.text}
                </h1>
              </div>

              {(banner as any).featured && (
                <div className="banner-featured-list" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '16px',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  minWidth: '260px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}>
                  {(banner as any).featured ? (banner as any).featured.map((song: any, idx: number) => (
                    <div key={song.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      transition: 'transform 0.2s',
                      cursor: 'pointer'
                    }}>
                      <span style={{ color: banner.color, fontWeight: 'bold', fontSize: '0.9rem', width: '20px' }}>{idx + 1}</span>
                      <img src={song.cover} alt="" style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                        <div style={{ color: 'white', fontSize: '0.9rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>{song.artist}</div>
                      </div>
                    </div>
                  )) : (
                    // Loading skeleton
                    [1,2,3].map(i => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', opacity: 0.5 }}>
                         <div style={{ width: '20px', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                         <div style={{ width: '42px', height: '42px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                         <div style={{ flex: 1 }}>
                            <div style={{ height: '14px', width: '100px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '6px' }} />
                            <div style={{ height: '10px', width: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
                         </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </section>
          );
        })()}

        {isAdminTab ? (
          <AdminPanel view={activeTab.split('-')[1] as 'music' | 'users' | 'stats'} />
        ) : activeTab === 'profile' ? (
          <Profile />
        ) : (
          <div className="scroll-container">
            {/* Local Section */}
            <section className="song-list-container">
              <div className="section-header">
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
              <SongGrid songs={localSearchResults} />
            </section>

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
          </div>
        )}
      </main>

      <PlayerBar />

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
