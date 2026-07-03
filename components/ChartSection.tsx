'use client';

import React from 'react';
import Image from 'next/image';
import { Song } from '@/data/constants';
import { usePlayer } from '@/context/PlayerContext';

interface ChartSectionProps {
  title: string;
  songs: Song[];
  titleColor?: string;
  bgColor?: string;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  title, songs,
  titleColor = '#ffffff',
  bgColor = 'rgba(255,255,255,0.04)'
}) => {
  const { playSong, currentSong, isPlaying } = usePlayer();
  if (songs.length === 0) return null;

  const rankColors = ['#f59e0b', '#94a3b8', '#b45309'];

  return (
    <div style={{
      minWidth: '300px', flex: '1',
      background: bgColor,
      borderRadius: '24px',
      border: '1px solid var(--glass-border)',
      backdropFilter: 'blur(20px)',
      maxHeight: '560px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 'var(--card-shadow)',
      position: 'relative'
    }}>
      {/* Inner top highlight */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 100%)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <h3 style={{
            color: 'white', fontSize: '1rem', fontWeight: 800, margin: 0,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            letterSpacing: '-0.025em'
          }}>{title}</h3>
          <i className="fa-solid fa-chevron-right" style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', flexShrink: 0 }}></i>
        </div>
        <button
          onClick={() => songs.length > 0 && playSong(songs[0])}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50%',
            width: '34px', height: '34px',
            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
            flexShrink: 0,
            fontSize: '0.8rem'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <i className="fa-solid fa-play" style={{ marginLeft: '1px' }}></i>
        </button>
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1, padding: '8px 10px' }}>
        {songs.map((song, idx) => {
          const isCurrent = currentSong?.id === song.id;
          return (
            <div
              key={song.id}
              onClick={() => playSong(song)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '9px 10px',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                background: isCurrent ? 'rgba(99,102,241,0.12)' : 'transparent',
                border: isCurrent ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
                marginBottom: '2px'
              }}
              onMouseEnter={e => { if (!isCurrent) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!isCurrent) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Rank */}
              <div style={{
                fontSize: idx < 3 ? '1rem' : '0.875rem',
                fontWeight: 800,
                color: idx < 3 ? rankColors[idx] : 'rgba(255,255,255,0.3)',
                minWidth: '22px', textAlign: 'center',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {isCurrent && isPlaying ? (
                  <i className="fa-solid fa-volume-high" style={{ color: 'var(--primary-light)', fontSize: '0.8rem' }}></i>
                ) : idx + 1}
              </div>

              {/* Cover */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Image src={song.cover} alt={song.title} width={44} height={44}
                  style={{ borderRadius: '10px', objectFit: 'cover', display: 'block' }} />
              </div>

              {/* Info */}
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{
                  color: isCurrent ? 'var(--primary-light)' : 'rgba(255,255,255,0.92)',
                  fontWeight: 600, fontSize: '0.875rem',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  letterSpacing: '-0.01em'
                }}>{song.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{
                    fontSize: '0.6rem', color: 'rgba(255,255,255,0.45)',
                    padding: '1px 5px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '4px', fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0
                  }}>Lossless</span>
                  <span style={{
                    color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 500,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                  }}>{song.artist}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChartSection;
