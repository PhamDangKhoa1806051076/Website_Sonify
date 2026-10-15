'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MobileNavProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
}

const MobileNav: React.FC<MobileNavProps> = ({ onTabChange, activeTab }) => {
  const navItems = [
    {
      id: 'home',
      icon: 'fa-house',
      label: 'Home',
      isActive: activeTab === 'home',
      onClickTab: 'home',
    },
    {
      id: 'search',
      icon: 'fa-magnifying-glass',
      label: 'Search',
      isActive: ['explore', 'search'].includes(activeTab),
      onClickTab: 'explore',
    },
    {
      id: 'library',
      icon: 'fa-lines-leaning',
      label: 'Library',
      isActive: ['liked', 'recent', 'podcast', 'audiobooks', 'charts'].includes(activeTab) || activeTab.startsWith('playlist-'),
      onClickTab: 'liked',
    },
    {
      id: 'system',
      icon: 'fa-sliders',
      label: 'System',
      isActive: ['profile', 'system'].includes(activeTab) || activeTab.startsWith('admin'),
      onClickTab: 'profile',
    },
  ];

  return (
    <nav className="mobile-floating-dock" aria-label="Mobile Navigation">
      <div className="mobile-dock-inner">
        {navItems.map((item) => {
          const active = item.isActive;
          return (
            <motion.button
              key={item.id}
              type="button"
              className={`mobile-dock-btn ${active ? 'active' : ''}`}
              onClick={() => onTabChange(item.onClickTab)}
              whileTap={{ scale: 0.90 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              {active && (
                <motion.div
                  className="mobile-dock-active-pill"
                  layoutId="mobile-dock-active-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}
              <span className="mobile-dock-btn-content">
                <i className={`fa-solid ${item.icon} mobile-dock-icon`} />
                <span className="mobile-dock-label">{item.label}</span>
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
