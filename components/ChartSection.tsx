'use client';

import React from 'react';
import { Song } from '@/data/constants';
import { useLanguage } from '@/context/LanguageContext';
import { usePlayer } from '@/context/PlayerContext';

interface ChartSectionProps {
  title: string;
  songs: Song[];
  titleColor?: string;
  bgColor?: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({ title, songs, titleColor = '#ffffff', bgColor = 'rgba(255, 255, 255, 0.05)' }) => {
  const { t } = useLanguage();
  const { playSong } = usePlayer();

  if (songs.length === 0) return null;

  const handlePlayAll = () => {
    if (songs.length > 0) {
      playSong(songs[0]);
      // Note: In a more advanced version, we would replace the entire queue with this chart
    }
  };

  return (
    <div className="chart-column" style={{
      minWidth: '320px',
      flex: '1',
      background: bgColor,
      borderRadius: '20px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      maxHeight: '600px',
      overflow: 'hidden'
    }}>
      <div className="chart-column-header" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', flex: 1, minWidth: 0 }}>
          <h3 style={{ 
            color: 'white', 
            fontSize: '1.1rem', 
            fontWeight: '700',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </h3>
          <i className="fa-solid fa-chevron-right" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}></i>
        </div>
        
        <button 
          onClick={handlePlayAll}
          title={t('btn-play-all') || 'Phát'}
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
        >
          <i className="fa-solid fa-play" style={{ 
            background: 'var(--accent-gradient)', 
            width: '26px', 
            height: '26px', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: '0.8rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}></i>
        </button>
      </div>

      <div className="chart-list-scrollable" style={{
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        paddingRight: '4px'
      }}>
        {songs.map((song, idx) => (
          <div 
            key={song.id} 
            className="chart-list-item" 
            onClick={() => playSong(song)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '10px',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'var(--transition)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              fontSize: '1rem',
              fontWeight: '800',
              color: idx < 3 ? titleColor : 'rgba(255, 255, 255, 0.4)',
              minWidth: '24px',
              textAlign: 'center'
            }}>
              {idx + 1}
            </div>
            
            <img 
              src={song.cover} 
              alt={song.title} 
              style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }} 
            />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
              <div style={{ 
                color: 'white', 
                fontWeight: '600', 
                fontSize: '0.9rem',
                whiteSpace: 'nowrap', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis' 
              }}>
                {song.title}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ 
                  fontSize: '0.65rem', 
                  color: 'rgba(255,255,255,0.6)', 
                  padding: '1px 4px', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase'
                }}>
                  Lossless
                </span>
                <span style={{ 
                  color: 'rgba(255,255,255,0.5)', 
                  fontSize: '0.8rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {song.artist}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChartSection;
