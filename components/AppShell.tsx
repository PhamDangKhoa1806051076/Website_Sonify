'use client';

import React, { useState, createContext, useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import PlayerBar from '@/components/PlayerBar';
import QueuePanel from '@/components/QueuePanel';
import AuthModal from '@/components/AuthModal';
import FeedbackModal from '@/components/FeedbackModal';
import ScrollToTop from '@/components/ScrollToTop';
import { usePlayer } from '@/context/PlayerContext';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
});

export const useSearch = () => useContext(SearchContext);

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isQueueOpen, setIsQueueOpen } = usePlayer();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Map route pathname to activeTab string for Sidebar styling
  const getActiveTabFromPathname = (path: string): string => {
    if (path === '/') return 'home';
    if (path.startsWith('/charts')) return 'charts';
    if (path.startsWith('/explore')) return 'explore';
    if (path.startsWith('/recent')) return 'recent';
    if (path.startsWith('/liked')) return 'liked';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/playlists/')) {
      return `playlist-${path.replace('/playlists/', '')}`;
    }
    if (path.startsWith('/admin')) {
      if (path.includes('categories')) return 'admin-categories';
      if (path.includes('users')) return 'admin-users';
      return 'admin-music';
    }
    return 'home';
  };

  const activeTab = getActiveTabFromPathname(pathname || '/');

  // Handle Tab navigation
  const handleTabChange = (tab: string) => {
    if (tab === 'home') router.push('/');
    else if (tab === 'charts') router.push('/charts');
    else if (tab === 'explore') router.push('/explore');
    else if (tab === 'recent') router.push('/recent');
    else if (tab === 'liked') router.push('/liked');
    else if (tab === 'profile') router.push('/profile');
    else if (tab.startsWith('playlist-')) {
      const pId = tab.replace('playlist-', '');
      router.push(`/playlists/${pId}`);
    } else if (tab === 'admin-music') router.push('/admin?view=music');
    else if (tab === 'admin-categories') router.push('/admin?view=categories');
    else if (tab === 'admin-users') router.push('/admin?view=users');
    else if (tab === 'admin-stats') router.push('/admin?view=stats');
    else router.push('/');
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isQueueOpen ? 'queue-open' : ''}`}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="content">
          <Header
            setActiveTab={handleTabChange}
            onLoginClick={() => setIsAuthModalOpen(true)}
            onFeedbackClick={() => setIsFeedbackModalOpen(true)}
            onSearch={(query) => setSearchQuery(query)}
          />

          {children}
        </main>

        {isQueueOpen && (
          <QueuePanel isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
        )}

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
    </SearchContext.Provider>
  );
}
