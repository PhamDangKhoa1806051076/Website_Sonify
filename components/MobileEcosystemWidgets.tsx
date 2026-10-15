'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { usePlayer } from '@/context/PlayerContext';

const MobileEcosystemWidgets: React.FC = () => {
  const router = useRouter();
  const { likedSongs } = usePlayer();

  const widgets = [
    {
      id: 'liked',
      title: 'Liked Songs',
      subtitle: `${likedSongs.length || 0} bài hát`,
      icon: 'fa-heart',
      route: '/liked',
      accentColor: '#ec4899',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(236, 72, 153, 0.22) 100%)',
      borderGlow: 'rgba(236, 72, 153, 0.35)',
      iconBg: 'linear-gradient(135deg, #a855f7, #ec4899)',
    },
    {
      id: 'podcasts',
      title: 'Podcasts',
      subtitle: 'Kênh & Show hot',
      icon: 'fa-microphone',
      route: '/podcast',
      accentColor: '#f97316',
      gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.22) 0%, rgba(239, 68, 68, 0.22) 100%)',
      borderGlow: 'rgba(249, 115, 22, 0.35)',
      iconBg: 'linear-gradient(135deg, #f97316, #ef4444)',
    },
    {
      id: 'audiobooks',
      title: 'Audiobooks',
      subtitle: 'Kho sách nói',
      icon: 'fa-book-open',
      route: '/audiobooks',
      accentColor: '#10b981',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(6, 182, 212, 0.22) 100%)',
      borderGlow: 'rgba(16, 185, 129, 0.35)',
      iconBg: 'linear-gradient(135deg, #10b981, #06b6d4)',
    },
    {
      id: 'charts',
      title: 'Top Charts',
      subtitle: 'Top 50 xu hướng',
      icon: 'fa-chart-simple',
      route: '/charts',
      accentColor: '#f59e0b',
      gradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.22) 0%, rgba(245, 158, 11, 0.22) 100%)',
      borderGlow: 'rgba(245, 158, 11, 0.35)',
      iconBg: 'linear-gradient(135deg, #eab308, #f59e0b)',
    },
  ];

  return (
    <div className="mobile-ecosystem-section">
      <div className="mobile-ecosystem-header">
        <span className="mobile-ecosystem-title">
          <i className="fa-solid fa-shapes" style={{ color: '#8b5cf6', marginRight: '6px' }} />
          Hệ sinh thái Sonify
        </span>
      </div>

      <div className="mobile-ecosystem-grid">
        {widgets.map((w) => (
          <motion.div
            key={w.id}
            className="mobile-widget-card"
            style={{
              background: w.gradient,
              borderColor: w.borderGlow,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            onClick={() => router.push(w.route)}
          >
            <div className="mobile-widget-top">
              <div
                className="mobile-widget-icon"
                style={{ background: w.iconBg }}
              >
                <i className={`fa-solid ${w.icon}`} />
              </div>
            </div>

            <div className="mobile-widget-body">
              <h4 className="mobile-widget-title">{w.title}</h4>
              <p className="mobile-widget-subtitle">{w.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MobileEcosystemWidgets;
