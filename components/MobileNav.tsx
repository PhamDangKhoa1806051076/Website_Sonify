'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface MobileNavProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ onTabChange, activeTab }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const navItems = [
    { id: 'home', icon: 'fa-house', label: 'Trang chủ' },
    { id: 'recent', icon: 'fa-clock-rotate-left', label: 'Gần đây' },
    { id: 'charts', icon: 'fa-chart-simple', label: 'BXH' },
    { id: 'podcast', icon: 'fa-microphone', label: 'Podcast' },
    { id: 'audiobooks', icon: 'fa-book-open', label: 'Sách nói' },
    { id: 'liked', icon: 'fa-heart', label: 'Yêu thích' },
  ];

  // Only show 5 items for non-logged in users
  const visibleItems = user
    ? navItems
    : navItems.filter(i => !['recent', 'liked'].includes(i.id));

  // Limit to 5 items max
  const displayItems = visibleItems.slice(0, 5);

  return (
    <nav className="mobile-bottom-nav">
      {displayItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <motion.button
            key={item.id}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {isActive && (
              <motion.div
                className="mobile-nav-indicator"
                layoutId="mobile-nav-indicator"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <i className={`fa-solid ${item.icon} mobile-nav-icon`} />
            <span className="mobile-nav-label">{item.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
