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
      id: 'library',
      icon: 'fa-layer-group',
      label: 'Library',
      isActive: ['liked', 'recent', 'podcast', 'audiobooks'].includes(activeTab) || activeTab.startsWith('playlist-'),
      onClickTab: 'liked',
    },
    {
      id: 'search',
      icon: 'fa-magnifying-glass',
      label: 'Search',
      isActive: ['explore', 'search', 'charts'].includes(activeTab),
      onClickTab: 'explore',
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
            <button
              key={item.id}
              type="button"
              className={`mobile-dock-btn ${active ? 'active' : ''}`}
              onClick={() => onTabChange(item.onClickTab)}
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
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
