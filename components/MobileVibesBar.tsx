'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface VibeOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  glowColor: string;
}

const VIBES: VibeOption[] = [
  { id: 'all', label: 'Tất cả Vibes', icon: 'fa-sparkles', color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.35)' },
  { id: 'coffee', label: 'Coffee & Chill', icon: 'fa-mug-hot', color: '#10b981', glowColor: 'rgba(16, 185, 129, 0.4)' },
  { id: 'focus', label: 'Deep Focus', icon: 'fa-brain', color: '#3b82f6', glowColor: 'rgba(59, 130, 246, 0.4)' },
  { id: 'night', label: 'Night Relax', icon: 'fa-moon', color: '#a855f7', glowColor: 'rgba(168, 85, 247, 0.4)' },
  { id: 'workout', label: 'Energy Workout', icon: 'fa-bolt', color: '#f59e0b', glowColor: 'rgba(245, 158, 11, 0.4)' },
  { id: 'healing', label: 'Healing Soul', icon: 'fa-spa', color: '#ec4899', glowColor: 'rgba(236, 72, 153, 0.4)' },
];

interface MobileVibesBarProps {
  onSelectVibe?: (vibeId: string) => void;
}

const MobileVibesBar: React.FC<MobileVibesBarProps> = ({ onSelectVibe }) => {
  const [activeVibe, setActiveVibe] = useState('all');

  const handleSelect = (id: string) => {
    setActiveVibe(id);
    if (onSelectVibe) onSelectVibe(id);
  };

  return (
    <div className="mobile-vibes-section">
      <div className="mobile-vibes-header">
        <span className="mobile-vibes-title">
          <i className="fa-solid fa-waveform-lines" style={{ color: '#10b981', marginRight: '6px' }} />
          Vibes & Scenes
        </span>
      </div>
      <div className="mobile-vibes-scroll">
        {VIBES.map((vibe) => {
          const isActive = activeVibe === vibe.id;
          return (
            <motion.button
              key={vibe.id}
              type="button"
              className={`mobile-vibe-pill ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? vibe.color : 'rgba(255, 255, 255, 0.08)',
                boxShadow: isActive ? `0 0 16px ${vibe.glowColor}` : 'none',
              }}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleSelect(vibe.id)}
            >
              <i
                className={`fa-solid ${vibe.icon} mobile-vibe-icon`}
                style={{ color: isActive ? vibe.color : 'var(--text-muted)' }}
              />
              <span
                className="mobile-vibe-text"
                style={{ color: isActive ? 'var(--text-main)' : 'var(--text-muted)' }}
              >
                {vibe.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileVibesBar;
