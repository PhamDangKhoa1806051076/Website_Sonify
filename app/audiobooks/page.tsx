'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import AudioBookCard from '@/components/AudioBookCard';
import { useLanguage } from '@/context/LanguageContext';
import { Song } from '@/data/constants';

interface AudioBookItem {
    id: string;
    title: string;
    author: string;
    narrator?: string;
    description?: string;
    cover: string;
    src: string;
    category?: string;
    duration?: number;
    chaptersCount?: number;
    isOnline?: boolean;
    createdAt?: string;
}

const containerVariants: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.08
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.96 },
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

// Convert audiobook item into Song interface format for the unified player
function audioBookToSong(b: AudioBookItem): Song {
    return {
        id: b.id,
        title: b.title,
        artist: b.author,
        cover: b.cover,
        src: b.src,
        isOnline: b.isOnline,
        category: b.category,
        isAudioBook: true,
        audioBookMeta: {
            author: b.author,
            narrator: b.narrator,
            chaptersCount: b.chaptersCount,
            description: b.description,
            duration: b.duration
        }
    };
}

export default function AudioBooksPage() {
    const { t } = useLanguage();
    const [audiobooks, setAudiobooks] = useState<AudioBookItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedAuthor, setSelectedAuthor] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await fetch('/api/audiobooks');
                const data = await res.json();
                if (data.success) {
                    setAudiobooks(data.data);
                }
            } catch (err) {
                console.error('Error fetching audiobooks:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBooks();
    }, []);

    // Extract unique categories and authors
    const categories = useMemo(() => {
        const catSet = new Set<string>();
        audiobooks.forEach(b => {
            if (b.category) catSet.add(b.category);
        });
        return Array.from(catSet).sort();
    }, [audiobooks]);

    const authors = useMemo(() => {
        const authSet = new Set<string>();
        audiobooks.forEach(b => {
            if (b.author) authSet.add(b.author);
        });
        return Array.from(authSet).sort();
    }, [audiobooks]);

    // Filter books
    const filteredBooks = useMemo(() => {
        let list = audiobooks;
        if (selectedCategory) {
            list = list.filter(b => b.category === selectedCategory);
        }
        if (selectedAuthor) {
            list = list.filter(b => b.author === selectedAuthor);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(b =>
                b.title.toLowerCase().includes(q) ||
                b.author.toLowerCase().includes(q) ||
                (b.narrator && b.narrator.toLowerCase().includes(q))
            );
        }
        return list;
    }, [audiobooks, selectedCategory, selectedAuthor, searchQuery]);

    const bookSongs = useMemo(() => filteredBooks.map(audioBookToSong), [filteredBooks]);

    const clearFilters = useCallback(() => {
        setSelectedCategory('');
        setSelectedAuthor('');
        setSearchQuery('');
    }, []);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="audiobooks-page"
                className="scroll-container"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Hero Header */}
                <section className="audiobook-page-header">
                    <div className="audiobook-hero">
                        <div className="audiobook-hero-icon">
                            <i className="fa-solid fa-book-open"></i>
                        </div>
                        <div className="audiobook-hero-text">
                            <h1>{t('audiobook-title')}</h1>
                            <p>
                                {isLoading
                                    ? '...'
                                    : `${audiobooks.length} ${t('audiobook-count')} • Đọc bằng đôi tai, mở rộng tri thức mỗi ngày`}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Filters & Search Row */}
                <section className="audiobook-filters-section" style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        {/* Search in audiobooks */}
                        <div style={{ minWidth: '220px', flex: '1', maxWidth: '380px', position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="Tìm theo tên sách, tác giả hoặc giọng đọc..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '10px 16px 10px 38px',
                                    borderRadius: '50px',
                                    color: 'var(--text-main)',
                                    fontSize: '0.85rem',
                                    outline: 'none'
                                }}
                            />
                            <i className="fa-solid fa-magnifying-glass" style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)',
                                fontSize: '0.85rem'
                            }}></i>
                        </div>

                        {/* Author dropdown */}
                        {authors.length > 0 && (
                            <select
                                value={selectedAuthor}
                                onChange={(e) => setSelectedAuthor(e.target.value)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '10px 18px',
                                    borderRadius: '50px',
                                    color: 'var(--text-main)',
                                    fontSize: '0.85rem',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="" style={{ background: 'var(--bg-main)' }}>Tất cả tác giả</option>
                                {authors.map(a => (
                                    <option key={a} value={a} style={{ background: 'var(--bg-main)' }}>{a}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Category chips */}
                    {categories.length > 0 && (
                        <div
                            className="category-chips"
                            style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '1rem',
                                overflowX: 'auto',
                                paddingBottom: '6px',
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        >
                            <button
                                onClick={clearFilters}
                                className={`category-chip ${!selectedCategory && !selectedAuthor && !searchQuery ? 'active' : ''}`}
                                style={{
                                    background: !selectedCategory && !selectedAuthor && !searchQuery ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'rgba(255,255,255,0.06)',
                                    color: !selectedCategory && !selectedAuthor && !searchQuery ? 'white' : 'var(--text-muted)',
                                    border: '1px solid var(--glass-border)',
                                    padding: '8px 22px',
                                    borderRadius: '50px',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    transition: 'var(--transition)',
                                    boxShadow: !selectedCategory && !selectedAuthor && !searchQuery ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none'
                                }}
                            >
                                {t('audiobook-all-categories')}
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                                    className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                                    style={{
                                        background: selectedCategory === cat ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'rgba(255,255,255,0.06)',
                                        color: selectedCategory === cat ? 'white' : 'var(--text-muted)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '8px 22px',
                                        borderRadius: '50px',
                                        fontSize: '0.82rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        whiteSpace: 'nowrap',
                                        transition: 'var(--transition)',
                                        boxShadow: selectedCategory === cat ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none'
                                    }}
                                >
                                    <i className="fa-solid fa-bookmark" style={{ marginRight: '6px', fontSize: '0.75rem' }}></i>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}
                </section>

                {/* AudioBooks List */}
                <section className="audiobook-list-container">
                    <div className="section-header" style={{ marginBottom: '1.2rem' }}>
                        <h2>{t('audiobook-title')}</h2>
                        {isLoading ? (
                            <span className="searching-spinner">
                                <i className="fa-solid fa-spinner fa-spin"></i> {t('searching')}
                            </span>
                        ) : (
                            <span>{filteredBooks.length} {t('audiobook-count')}</span>
                        )}
                    </div>

                    {!isLoading && bookSongs.length === 0 ? (
                        <div className="audiobook-empty-state">
                            <div className="audiobook-empty-icon">
                                <i className="fa-solid fa-book"></i>
                            </div>
                            <h3>{t('audiobook-no-books')}</h3>
                            <p>Các cuốn sách nói kinh điển sẽ được ban quản trị cập nhật sớm nhất.</p>
                        </div>
                    ) : (
                        <motion.div
                            className="audiobook-grid"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            key={bookSongs.map(s => s.id).join(',')}
                        >
                            {bookSongs.map(book => (
                                <motion.div key={book.id} variants={itemVariants}>
                                    <AudioBookCard book={book} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </section>
            </motion.div>
        </AnimatePresence>
    );
}
