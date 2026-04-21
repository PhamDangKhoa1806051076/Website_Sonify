'use client';

import React from 'react';
import { Song } from '@/data/constants';
import { useLanguage } from '@/context/LanguageContext';
import { usePlayer } from '@/context/PlayerContext';

interface ChartSectionProps {
  title: string;
  songs: Song[];
  titleColor?: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, songs, titleColor = 'white' }) => {
  const { t } = useLanguage();
  const { playSong } = usePlayer();

  if (songs.length === 0) return null;

  return (
    <section className="chart-section" style={{ marginTop: '2.5rem' }}>
      <div className="section-header">
        <h2 style={{ color: titleColor, fontSize: '1.5rem', marginBottom: '1.2rem' }}>{title}</h2>
      </div>
      <div className="chart-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {songs.slice(0, 6).map((song, idx) => (
          <div 
            key={song.id} 
            className="chart-item" 
            onClick={() => playSong(song, songs)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div className="chart-rank" style={{
              fontSize: '1.4rem',
              fontWeight: '900',
              opacity: 0.8,
              minWidth: '28px',
              textAlign: 'center',
              color: titleColor
            }}>
              {idx + 1}
            </div>
            <img 
              src={song.cover} 
              alt={song.title} 
              style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} 
            />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ 
                color: 'white', 
                fontWeight: '600', 
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis',
                fontSize: '0.95rem'
              }}>
                {song.title}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{song.artist}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChartSection;
