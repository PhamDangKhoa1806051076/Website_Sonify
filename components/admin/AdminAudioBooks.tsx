'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import FilePickerModal from './FilePickerModal';
import { useAuth } from '@/context/AuthContext';

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
    _id?: string;
}

interface AdminAudioBooksProps {
    localSounds: string[];
    localImages: string[];
}

const DEFAULT_BOOK_CATEGORIES = [
    'Phát triển bản thân',
    'Kinh doanh & Đầu tư',
    'Kỹ năng sống',
    'Tâm lý & Trí tuệ',
    'Văn học & Tiểu thuyết',
    'Khoa học & Triết học',
    'Lịch sử & Văn hóa'
];

const AdminAudioBooks: React.FC<AdminAudioBooksProps> = ({
    localSounds: initialSounds,
    localImages: initialImages
}) => {
    const { user } = useAuth();
    const [books, setBooks] = useState<AudioBookItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    const [isAdding, setIsAdding] = useState(false);
    const [editingBookId, setEditingBookId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [useExternalSource, setUseExternalSource] = useState(false);

    const [bookForm, setBookForm] = useState({
        title: '',
        author: '',
        narrator: '',
        category: 'Phát triển bản thân',
        chaptersCount: 1,
        description: '',
        cover: '/img/',
        src: '/sound/',
        duration: 0
    });

    const [localSounds, setLocalSounds] = useState<string[]>(initialSounds);
    const [localImages, setLocalImages] = useState<string[]>(initialImages);

    // Picker state
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerType, setPickerType] = useState<'sound' | 'img'>('sound');
    const [pickerSearch, setPickerSearch] = useState('');

    const fetchBooks = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/audiobooks');
            const data = await res.json();
            if (data.success) {
                setBooks(data.data);
            }
        } catch (err) {
            console.error('Lỗi khi tải sách nói:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    const handleOpenPicker = (type: 'sound' | 'img') => {
        setPickerType(type);
        setPickerOpen(true);
        fetch(`/api/files?type=${type}&t=${Date.now()}`)
            .then(r => r.json())
            .then(d => {
                if (d.success) {
                    if (type === 'img') setLocalImages(d.files);
                    else setLocalSounds(d.files);
                }
            })
            .catch(() => {});
    };

    const handleStartEdit = (item: AudioBookItem) => {
        setEditingBookId(item.id);
        setBookForm({
            title: item.title,
            author: item.author,
            narrator: item.narrator || '',
            category: item.category || 'Phát triển bản thân',
            chaptersCount: item.chaptersCount || 1,
            description: item.description || '',
            cover: item.cover,
            src: item.src,
            duration: item.duration || 0
        });
        setUseExternalSource(!!item.isOnline);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingBookId(null);
        setBookForm({
            title: '',
            author: '',
            narrator: '',
            category: 'Phát triển bản thân',
            chaptersCount: 1,
            description: '',
            cover: '/img/',
            src: '/sound/',
            duration: 0
        });
    };

    const handleSaveBook = async () => {
        if (!bookForm.title.trim() || !bookForm.author.trim() || !bookForm.src.trim() || !bookForm.cover.trim()) {
            alert('Vui lòng điền đầy đủ Tên sách, Tác giả, File âm thanh và Ảnh bìa sách.');
            return;
        }

        setIsSubmitting(true);
        try {
            const isEdit = editingBookId !== null;
            const url = isEdit ? `/api/audiobooks/${editingBookId}` : '/api/audiobooks';
            const method = isEdit ? 'PUT' : 'POST';

            const payload = {
                ...bookForm,
                isOnline: useExternalSource
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-username': user?.username || ''
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (data.success) {
                alert(isEdit ? 'Cập nhật Sách nói thành công!' : 'Thêm Sách nói mới thành công!');
                handleCancel();
                await fetchBooks();
            } else {
                alert(data.error || 'Đã xảy ra lỗi khi lưu sách nói.');
            }
        } catch (error) {
            console.error('Lỗi khi lưu sách nói:', error);
            alert('Lỗi kết nối máy chủ.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteBook = async (item: AudioBookItem) => {
        if (confirm(`Bạn có chắc muốn xóa cuốn sách "${item.title}"?`)) {
            try {
                const res = await fetch(`/api/audiobooks/${item.id}`, {
                    method: 'DELETE',
                    headers: {
                        'x-username': user?.username || ''
                    }
                });
                const data = await res.json();
                if (data.success) {
                    alert('Đã xóa sách nói thành công!');
                    await fetchBooks();
                } else {
                    alert(data.error || 'Xóa thất bại.');
                }
            } catch (err) {
                console.error('Lỗi khi xóa sách nói:', err);
                alert('Lỗi khi xóa sách nói.');
            }
        }
    };

    // Filtered books
    const filteredBooks = books.filter(b => {
        const matchesSearch = !searchQuery || 
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (b.narrator && b.narrator.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = !filterCategory || b.category === filterCategory;

        return matchesSearch && matchesCategory;
    });

    const uniqueAuthorsCount = new Set(books.map(b => b.author).filter(Boolean)).size;

    return (
        <div className="admin-main-content" style={{ marginTop: '2rem' }}>
            {/* Stats Banner */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '1.2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.2))',
                        color: '#f59e0b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem'
                    }}>
                        <i className="fa-solid fa-book-open"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tổng số sách nói</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{books.length}</div>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    padding: '1.2rem',
                    borderRadius: '16px',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.2), rgba(217, 119, 6, 0.2))',
                        color: '#ea580c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.3rem'
                    }}>
                        <i className="fa-solid fa-feather-pointed"></i>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Số tác giả</div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{uniqueAuthorsCount}</div>
                    </div>
                </div>
            </div>

            {/* Header Toolbar */}
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3>Quản lý Sách nói & Audio</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                        Thêm, sửa, xóa các tựa sách nói và kho tài liệu âm thanh
                    </p>
                </div>
                <button 
                    style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 24px',
                        borderRadius: '50px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }} 
                    onClick={() => {
                        if (isAdding) handleCancel();
                        else setIsAdding(true);
                    }}
                >
                    <i className={`fa-solid ${isAdding ? 'fa-xmark' : 'fa-plus'}`}></i> {isAdding ? 'Hủy bỏ' : 'Thêm Sách nói mới'}
                </button>
            </div>

            {/* Add / Edit Form */}
            {isAdding && (
                <div className="add-song-form" style={{
                    background: 'rgba(255,255,255,0.03)',
                    padding: '2rem',
                    borderRadius: '20px',
                    marginBottom: '2rem',
                    marginTop: '1.5rem',
                    border: '1px solid var(--glass-border)',
                    backdropFilter: 'blur(12px)'
                }}>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.15rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className={`fa-solid ${editingBookId ? 'fa-pen-to-square' : 'fa-book-bookmark'}`}></i>
                        {editingBookId ? 'Chỉnh sửa thông tin Sách nói' : 'Thêm Sách nói mới'}
                    </h4>

                    {/* Source Selector */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px', width: 'fit-content' }}>
                        <button 
                            type="button"
                            onClick={() => {
                                setUseExternalSource(false);
                                setBookForm(prev => ({
                                    ...prev,
                                    src: prev.src.startsWith('http') ? '/sound/' : prev.src,
                                    cover: prev.cover.startsWith('http') ? '/img/' : prev.cover
                                }));
                            }}
                            style={{
                                background: !useExternalSource ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'transparent',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}
                        >
                            <i className="fa-solid fa-folder-open" style={{ marginRight: '6px' }}></i> File trong thư mục
                        </button>
                        <button 
                            type="button"
                            onClick={() => {
                                setUseExternalSource(true);
                                setBookForm(prev => ({
                                    ...prev,
                                    src: prev.src.startsWith('/sound/') ? '' : prev.src,
                                    cover: prev.cover.startsWith('/img/') ? '' : prev.cover
                                }));
                            }}
                            style={{
                                background: useExternalSource ? 'linear-gradient(135deg, #f59e0b, #ea580c)' : 'transparent',
                                color: 'white',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}
                        >
                            <i className="fa-solid fa-globe" style={{ marginRight: '6px' }}></i> Link trực tuyến / Online
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
                        {/* Title */}
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Tên cuốn sách <span style={{ color: '#f59e0b' }}>*</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Đắc Nhân Tâm, Nhà Giả Kim, Dám Nghĩ Lớn, v.v." 
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} 
                                value={bookForm.title} 
                                onChange={e => setBookForm({ ...bookForm, title: e.target.value })} 
                            />
                        </div>

                        {/* Author */}
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Tác giả cuốn sách <span style={{ color: '#f59e0b' }}>*</span>
                            </label>
                            <input 
                                type="text" 
                                placeholder="Dale Carnegie, Paulo Coelho, v.v." 
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} 
                                value={bookForm.author} 
                                onChange={e => setBookForm({ ...bookForm, author: e.target.value })} 
                            />
                        </div>

                        {/* Narrator */}
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Người đọc / Diễn đọc
                            </label>
                            <input 
                                type="text" 
                                placeholder="Minh Quân, Kim Tuyến, v.v." 
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} 
                                value={bookForm.narrator} 
                                onChange={e => setBookForm({ ...bookForm, narrator: e.target.value })} 
                            />
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thể loại sách</label>
                            <select 
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                                value={bookForm.category}
                                onChange={e => setBookForm({ ...bookForm, category: e.target.value })}
                            >
                                {DEFAULT_BOOK_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat} style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Chapters Count */}
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Số chương</label>
                            <input 
                                type="number" 
                                min={1}
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} 
                                value={bookForm.chaptersCount} 
                                onChange={e => setBookForm({ ...bookForm, chaptersCount: parseInt(e.target.value) || 1 })} 
                            />
                        </div>

                        {/* Cover URL */}
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Ảnh bìa sách (Tỉ lệ đứng 3:4 khuyến nghị) <span style={{ color: '#f59e0b' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    readOnly={!useExternalSource}
                                    placeholder={useExternalSource ? "https://example.com/book-cover.jpg" : "Chọn ảnh từ thư mục..."} 
                                    style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', opacity: !useExternalSource ? 0.85 : 1, outline: 'none' }} 
                                    value={bookForm.cover} 
                                    onChange={e => useExternalSource && setBookForm({ ...bookForm, cover: e.target.value })} 
                                />
                                {!useExternalSource && (
                                    <button 
                                        type="button"
                                        onClick={() => handleOpenPicker('img')}
                                        style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        <i className="fa-solid fa-image"></i> Chọn ảnh
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Audio Source */}
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                File âm thanh (Audio URL / Path) <span style={{ color: '#f59e0b' }}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    readOnly={!useExternalSource}
                                    placeholder={useExternalSource ? "https://example.com/audiobook.mp3" : "Chọn file âm thanh từ thư mục..."} 
                                    style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', opacity: !useExternalSource ? 0.85 : 1, outline: 'none' }} 
                                    value={bookForm.src} 
                                    onChange={e => useExternalSource && setBookForm({ ...bookForm, src: e.target.value })} 
                                />
                                {!useExternalSource && (
                                    <button 
                                        type="button"
                                        onClick={() => handleOpenPicker('sound')}
                                        style={{ background: '#ea580c', color: 'white', border: 'none', padding: '0 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        <i className="fa-solid fa-book-open"></i> Chọn file
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tóm tắt nội dung sách</label>
                            <textarea 
                                rows={3}
                                placeholder="Giới thiệu đôi nét về cuốn sách, bài học cốt lõi và nội dung chính..."
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none', resize: 'vertical' }}
                                value={bookForm.description}
                                onChange={e => setBookForm({ ...bookForm, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '12px' }}>
                        <button 
                            type="button"
                            onClick={handleSaveBook} 
                            disabled={isSubmitting} 
                            style={{ 
                                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', 
                                color: 'white', 
                                border: 'none', 
                                padding: '12px 32px', 
                                borderRadius: '10px', 
                                fontWeight: 700, 
                                cursor: 'pointer', 
                                opacity: isSubmitting ? 0.7 : 1,
                                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)'
                            }}
                        >
                            {isSubmitting ? 'ĐANG LƯU...' : editingBookId ? 'CẬP NHẬT SÁCH NÓI' : 'LƯU SÁCH NÓI'}
                        </button>
                        <button 
                            type="button"
                            onClick={handleCancel} 
                            style={{ 
                                background: 'rgba(255,255,255,0.05)', 
                                color: 'white', 
                                border: '1px solid var(--glass-border)', 
                                padding: '12px 30px', 
                                borderRadius: '10px', 
                                fontWeight: 600, 
                                cursor: 'pointer' 
                            }}
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </div>
            )}

            {/* Filter & Search Toolbar */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                margin: '1.5rem 0',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                    <input 
                        type="text" 
                        placeholder="Tìm theo tên sách, tác giả hoặc người đọc..." 
                        style={{
                            width: '100%',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--glass-border)',
                            padding: '10px 16px',
                            paddingLeft: '38px',
                            borderRadius: '12px',
                            color: 'var(--text-main)',
                            outline: 'none'
                        }}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
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

                <select 
                    style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--glass-border)',
                        padding: '10px 16px',
                        borderRadius: '12px',
                        color: 'var(--text-main)',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                >
                    <option value="" style={{ background: 'var(--bg-main)' }}>Tất cả thể loại sách</option>
                    {DEFAULT_BOOK_CATEGORIES.map(cat => (
                        <option key={cat} value={cat} style={{ background: 'var(--bg-main)' }}>{cat}</option>
                    ))}
                </select>
            </div>

            {/* Books Table */}
            <div className="admin-table-container">
                {isLoading ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Đang tải danh sách sách nói...
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <i className="fa-solid fa-book" style={{ fontSize: '2rem', marginBottom: '1rem', display: 'block', opacity: 0.5 }}></i>
                        Chưa có sách nói nào{searchQuery || filterCategory ? ' phù hợp với bộ lọc' : ''}.
                    </div>
                ) : (
                    <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <tr>
                                <th style={{ padding: '14px 12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', width: '60px' }}>Bìa</th>
                                <th style={{ padding: '14px 12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Tên sách</th>
                                <th style={{ padding: '14px 12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Tác giả & Giọng đọc</th>
                                <th style={{ padding: '14px 12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Thể loại</th>
                                <th style={{ padding: '14px 12px', textAlign: 'center', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Nguồn</th>
                                <th style={{ padding: '14px 12px', textAlign: 'right', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map(item => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }} className="admin-table-row">
                                    <td style={{ padding: '14px 12px' }}>
                                        <div style={{ width: '38px', height: '50px', position: 'relative', borderRadius: '6px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                                            <Image 
                                                src={item.cover} 
                                                alt="" 
                                                fill 
                                                unoptimized
                                                style={{ objectFit: 'cover' }} 
                                            />
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.title}</div>
                                        {item.chaptersCount && item.chaptersCount > 1 ? (
                                            <span style={{
                                                display: 'inline-block',
                                                fontSize: '0.7rem',
                                                fontWeight: 600,
                                                padding: '2px 8px',
                                                borderRadius: '12px',
                                                background: 'rgba(245, 158, 11, 0.15)',
                                                color: '#fbbf24',
                                                marginTop: '4px'
                                            }}>
                                                {item.chaptersCount} chương
                                            </span>
                                        ) : null}
                                    </td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.author}</div>
                                        {item.narrator && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <i className="fa-solid fa-microphone-lines" style={{ fontSize: '0.7rem', color: '#ea580c' }}></i> Giọng: {item.narrator}
                                            </div>
                                        )}
                                    </td>
                                    <td style={{ padding: '14px 12px' }}>
                                        <span style={{
                                            fontSize: '0.8rem',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            background: 'rgba(255,255,255,0.06)',
                                            color: 'var(--text-main)',
                                            fontWeight: 500
                                        }}>
                                            {item.category || '—'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 12px', textAlign: 'center' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '3px 8px',
                                            borderRadius: '12px',
                                            background: item.isOnline ? 'rgba(59, 130, 246, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                                            color: item.isOnline ? '#60a5fa' : '#4ade80',
                                            fontWeight: 600
                                        }}>
                                            {item.isOnline ? 'Online' : 'Local'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button 
                                                onClick={() => handleStartEdit(item)}
                                                style={{ 
                                                    background: 'rgba(245, 158, 11, 0.1)', 
                                                    color: '#f59e0b', 
                                                    border: 'none', 
                                                    padding: '8px 14px', 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer', 
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s' 
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.1)'; e.currentTarget.style.color = '#f59e0b'; }}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i> Sửa
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteBook(item)}
                                                style={{ 
                                                    background: 'rgba(239,68,68,0.1)', 
                                                    color: '#ef4444', 
                                                    border: 'none', 
                                                    padding: '8px 14px', 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer', 
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s' 
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                            >
                                                <i className="fa-solid fa-trash"></i> Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* File Picker Modal */}
            <FilePickerModal 
                isOpen={pickerOpen}
                onClose={() => setPickerOpen(false)}
                type={pickerType}
                localSounds={localSounds}
                localImages={localImages}
                search={pickerSearch}
                onSearchChange={setPickerSearch}
                onSelect={(file) => {
                    if (pickerType === 'img') {
                        setBookForm({ ...bookForm, cover: `/img/${file}` });
                    } else {
                        const cleanTitle = file.replace(/\.(mp3|wav|m4a)$/i, '').replace(/_/g, ' ');
                        setBookForm({
                            ...bookForm,
                            src: `/sound/${file}`,
                            title: bookForm.title || cleanTitle
                        });
                    }
                    setPickerOpen(false);
                    setPickerSearch('');
                }}
            />
        </div>
    );
};

export default AdminAudioBooks;
