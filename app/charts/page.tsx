'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChartSection from '@/components/ChartSection';
import { useLanguage } from '@/context/LanguageContext';
import {
  getTrendingSongs,
  getVietnamTopSongs,
  getChineseTopSongs,
  getGlobalTopSongs,
} from '@/services/musicService';
import { Song } from '@/data/constants';

export default function ChartsPage() {
  const { t } = useLanguage();

  const [trendingSongs, setTrendingSongs] = useState<Song[]>([]);
  const [vietnamSongs, setVietnamSongs] = useState<Song[]>([]);
  const [chineseSongs, setChineseSongs] = useState<Song[]>([]);
  const [usUkSongs, setUsUkSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharts = async () => {
      setIsLoading(true);
      try {
        const [trending, vn, cn, usuk] = await Promise.all([
          getTrendingSongs(),
          getVietnamTopSongs(),
          getChineseTopSongs(),
          getGlobalTopSongs(),
        ]);
        setTrendingSongs(trending);
        setVietnamSongs(vn);
        setChineseSongs(cn);
        setUsUkSongs(usuk);
      } catch (error) {
        console.error('Failed to fetch charts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharts();
  }, []);

  return (
    <motion.div
      key="charts-page"
      className="scroll-container"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <section className="charts-container-wrapper" style={{ marginTop: '1.5rem' }}>
        <div className="section-header">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.8rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
            {t('nav-charts')}
          </h2>
          {isLoading && (
            <span className="searching-spinner" style={{ marginBottom: '1.8rem' }}>
              <i className="fa-solid fa-spinner fa-spin"></i> {t('searching')}
            </span>
          )}
        </div>

        <div
          className="charts-horizontal-scroll"
          style={{
            display: 'flex',
            gap: '24px',
            overflowX: 'auto',
            paddingBottom: '30px',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(255,255,255,0.2) transparent',
          }}
        >
          <ChartSection title={t('charts-trending')} songs={trendingSongs} bgColor="rgba(60, 20, 20, 0.4)" />
          <ChartSection title={t('charts-vietnam')} songs={vietnamSongs} bgColor="rgba(40, 40, 10, 0.4)" />
          <ChartSection title={t('charts-chinese')} songs={chineseSongs} bgColor="rgba(30, 20, 50, 0.4)" />
          <ChartSection title={t('charts-usuk')} songs={usUkSongs} bgColor="rgba(10, 30, 60, 0.4)" />
        </div>
      </section>
    </motion.div>
  );
}
