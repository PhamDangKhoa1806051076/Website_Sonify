'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Song } from '@/data/constants';

interface HomeBannerProps {
  currentBanner: number;
  trendingSongs: Song[];
}

const HomeBanner: React.FC<HomeBannerProps> = ({ currentBanner, trendingSongs }) => {
  const banners = [
    { 
      img: '/img/banner-nature.png', 
      text: "Gói ghém Bình yên", 
      color: '#e0f2fe', 
      bg: 'rgba(0,30,60,0.6)', 
      align: 'flex-start', 
      textAlign: 'left' as const
    },
    { 
      img: '/img/banner-house.png', 
      text: "Story hôm nay up bài gì?", 
      color: '#ffedd5', 
      bg: 'rgba(80,30,10,0.55)', 
      align: 'flex-end', 
      textAlign: 'right' as const
    },
    { 
      img: '/img/banner-boat.png', 
      text: "Bảng Xếp Hạng\nHot Trong Tuần", 
      color: '#fdf2f2', 
      bg: 'rgba(10,30,60,0.6)', 
      align: 'center', 
      textAlign: 'center' as const,
      featured: trendingSongs.length > 0 ? trendingSongs.slice(0, 3) : null
    },
    { 
      img: '/img/banner-sunset.png', 
      text: "Những Bài Hát\nNghe Nhiều Nhất", 
      color: '#f0f9ff', 
      bg: 'rgba(40,20,10,0.6)', 
      align: 'flex-start', 
      textAlign: 'left' as const,
      featured: trendingSongs.length > 3 ? trendingSongs.slice(3, 6) : null
    }
  ];

  return (
    <section className="hero-banner-wrapper">
      <AnimatePresence mode="wait">
        {banners.map((banner, idx) => (
          idx === currentBanner && (
            <motion.div
              key={idx}
              className="hero-banner-slide active"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: 'absolute', inset: 0 }}
            >
              <Image 
                src={banner.img} 
                alt="" 
                fill 
                priority={idx === 0}
                sizes="(max-width: 768px) 100vw, 80vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="hero-banner-overlay" />
              <div className="hero-banner-content" style={{
                justifyContent: banner.featured ? 'space-between' : (banner.align as string),
              }}>
                <motion.div
                  className="hero-banner-text"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  style={{ 
                    background: banner.bg, 
                    maxWidth: banner.featured ? '45%' : '85%',
                    textAlign: banner.textAlign,
                  }}
                >
                  <h1 style={{ 
                    whiteSpace: banner.featured ? 'pre-line' : 'nowrap', 
                    color: banner.color,
                  }}>
                    {banner.text}
                  </h1>
                </motion.div>

                {banner.featured && (
                  <motion.div
                    className="hero-banner-featured"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {banner.featured.map((song, songIdx) => (
                      <div key={song.id} className="hero-banner-featured-item">
                        <span className="hero-banner-rank" style={{ color: banner.color }}>{songIdx + 1}</span>
                        <Image 
                          src={song.cover} 
                          alt={song.title}
                          width={42} 
                          height={42} 
                          style={{ borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} 
                        />
                        <div style={{ overflow: 'hidden' }}>
                          <div className="hero-banner-song-title">{song.title}</div>
                          <div className="hero-banner-song-artist">{song.artist}</div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
    </section>
  );
};

export default HomeBanner;
