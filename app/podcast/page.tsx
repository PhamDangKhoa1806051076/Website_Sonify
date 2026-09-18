'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import PodcastCard from '@/components/PodcastCard';
import { useLanguage } from '@/context/LanguageContext';
import { Song } from '@/data/constants';

interface PodcastItem {
    id: string;
    title: string;
    host: string;
    description: string;
    cover: string;
    src: string;
    category: string;
    duration: number;
    episodeNumber: number;
    showName: string;
    isOnline: boolean;
    createdAt: string;
}

const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.08
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

// Convert podcast data from API into Song format for the player
function podcastToSong(p: PodcastItem): Song {
    return {
        id: p.id,
        title: p.title,
        artist: p.host,
        cover: p.cover,
        src: p.src,
        isOnline: p.isOnline,
        category: p.category,
        isPodcast: true,
        podcastMeta: {
            host: p.host,
            showName: p.showName,
            episodeNumber: p.episodeNumber,
            description: p.description,
            duration: p.duration
        }
    };
}

export default function PodcastPage() {
    const { t } = useLanguage();
    const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedShow, setSelectedShow] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        const fetchPodcasts = async () => {
            try {
                const res = await fetch('/api/podcasts');
                const data = await res.json();
                if (data.success) {
                    setPodcasts(data.data);
                }
            } catch (err) {
                console.error('Error fetching podcasts:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPodcasts();
    }, []);

    // Extract unique show names and categories for filters
    const shows = useMemo(() => {
        const showSet = new Set<string>();
        podcasts.forEach(p => {
            if (p.showName) showSet.add(p.showName);
        });
        return Array.from(showSet).sort();
    }, [podcasts]);

    const categories = useMemo(() => {
        const catSet = new Set<string>();
        podcasts.forEach(p => {
            if (p.category) catSet.add(p.category);
        });
        return Array.from(catSet).sort();
    }, [podcasts]);

    // Filter podcasts by show and/or category
    const filteredPodcasts = useMemo(() => {
        let list = podcasts;
        if (selectedShow) {
            list = list.filter(p => p.showName === selectedShow);
        }
        if (selectedCategory) {
            list = list.filter(p => p.category === selectedCategory);
        }
        return list;
    }, [podcasts, selectedShow, selectedCategory]);

    // Convert to Song format for player
    const podcastSongs = useMemo(() => filteredPodcasts.map(podcastToSong), [filteredPodcasts]);

    const clearFilters = useCallback(() => {
        setSelectedShow('');
        setSelectedCategory('');
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="podcast-page"
                className="scroll-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Page Header */}
                <section className="podcast-page-header">
                    <div className="podcast-hero">
                        <div className="podcast-hero-icon">
                            <i className="fa-solid fa-podcast"></i>
                        </div>
                        <div className="podcast-hero-text">
                            <h1>{t('podcast-title')}</h1>
                            <p>
                                {isLoading
                                    ? '...'
                                    : `${podcasts.length} ${t('podcast-count')}`
                                }
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters */}
                {(shows.length > 0 || categories.length > 0) && (
                    <section className="podcast-filters">
                        {/* Show filter */}
                        {shows.length > 0 && (
                            <div className="podcast-filter-group">
                                <div
                                    className="category-chips"
                                    style={{
                                        display: 'flex',
                                        gap: '10px',
                                        overflowX: 'auto',
                                        paddingBottom: '8px',
                                        scrollbarWidth: 'none',
                                        msOverflowStyle: 'none',
                                    }}
                                >
                                    <button
                                        onClick={clearFilters}
                                        className={`category-chip ${!selectedShow && !selectedCategory ? 'active' : ''}`}
                                        style={{
                                            background: !selectedShow && !selectedCategory ? 'var(--primary-color)' : 'rgba(255,255,255,0.06)',
                                            color: !selectedShow && !selectedCategory ? 'white' : 'var(--text-muted)',
                                            border: '1px solid var(--glass-border)',
                                            padding: '8px 22px',
                                            borderRadius: '50px',
                                            fontSize: '0.82rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            whiteSpace: 'nowrap',
                                            transition: 'var(--transition)',
                                            boxShadow: !selectedShow && !selectedCategory ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                                        }}
                                    >
                                        {t('podcast-all-shows')}
                                    </button>
                                    {shows.map(show => (
                                        <button
                                            key={show}
                                            onClick={() => { setSelectedShow(show); setSelectedCategory(''); }}
                                            className={`category-chip ${selectedShow === show ? 'active' : ''}`}
                                            style={{
                                                background: selectedShow === show ? 'var(--primary-color)' : 'rgba(255,255,255,0.06)',
                                                color: selectedShow === show ? 'white' : 'var(--text-muted)',
                                                border: '1px solid var(--glass-border)',
                                                padding: '8px 22px',
                                                borderRadius: '50px',
                                                fontSize: '0.82rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                transition: 'var(--transition)',
                                                boxShadow: selectedShow === show ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                                            }}
                                        >
                                            <i className="fa-solid fa-podcast" style={{ marginRight: '6px' }}></i>
                                            {show}
                                        </button>
                                    ))}
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => { setSelectedCategory(cat); setSelectedShow(''); }}
                                            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                                            style={{
                                                background: selectedCategory === cat ? 'var(--primary-color)' : 'rgba(255,255,255,0.06)',
                                                color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                                                border: '1px solid var(--glass-border)',
                                                padding: '8px 22px',
                                                borderRadius: '50px',
                                                fontSize: '0.82rem',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                transition: 'var(--transition)',
                                                boxShadow: selectedCategory === cat ? '0 4px 15px rgba(99, 102, 241, 0.4)' : 'none',
                                            }}
                                        >
                                            <i className="fa-solid fa-tag" style={{ marginRight: '6px' }}></i>
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* Podcast List */}
                <section className="podcast-list-container">
                    <div className="section-header" style={{ marginBottom: '1rem' }}>
                        <h2>{t('podcast-title')}</h2>
                        {isLoading ? (
                            <span className="searching-spinner">
                                <i className="fa-solid fa-spinner fa-spin"></i> {t('searching')}
                            </span>
                        ) : (
                            <span>{filteredPodcasts.length} {t('podcast-count')}</span>
                        )}
                    </div>

                    {!isLoading && podcastSongs.length === 0 ? (
                        <div className="podcast-empty-state">
                            <div className="podcast-empty-icon">
                                <i className="fa-solid fa-microphone-slash"></i>
                            </div>
                            <h3>{t('podcast-no-episodes')}</h3>
                            <p>Các tập podcast sẽ được thêm bởi quản trị viên.</p>
                        </div>
                    ) : (
                        <motion.div
                            className="podcast-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            key={podcastSongs.map(s => s.id).join(',')}
                        >
                            {podcastSongs.map(podcast => (
                                <motion.div key={podcast.id} variants={itemVariants}>
                                    <PodcastCard podcast={podcast} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </section>
            </motion.div>
        </AnimatePresence>
    );
}
