'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Song } from '@/data/constants';
import FilePickerModal from './FilePickerModal';
import { useAuth } from '@/context/AuthContext';

interface AdminMusicProps {
    allSongs: Song[];
    refreshSongs: () => Promise<void>;
    localSounds: string[];
    localImages: string[];
}

const AdminMusic: React.FC<AdminMusicProps> = ({ 
    allSongs, 
    refreshSongs, 
    localSounds: initialSounds, 
    localImages: initialImages
}) => {
    const { user } = useAuth();
    const [isAdding, setIsAdding] = useState(false);
    const [editingSongId, setEditingSongId] = useState<string | number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [useExternalSource, setUseExternalSource] = useState(false);
    const [newSong, setNewSong] = useState<Partial<Song>>({
        title: '', artist: '', cover: '/img/', src: '/sound/', category: ''
    });

    const [localSounds, setLocalSounds] = useState<string[]>(initialSounds);
    const [localImages, setLocalImages] = useState<string[]>(initialImages);
    const [categories, setCategories] = useState<{ _id: string, name: string, slug: string }[]>([]);

    // Picker state
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerType, setPickerType] = useState<'sound' | 'img'>('sound');
    const [pickerSearch, setPickerSearch] = useState('');

    // Fetch categories on mount
    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                if (data.success) {
                    setCategories(data.data);
                }
            } catch (err) {
                console.error('Lỗi khi tải thể loại:', err);
            }
        };
        fetchCats();
    }, []);

    const handleSaveSong = async () => {
        if (!newSong.title || !newSong.artist || !newSong.src) {
            alert('Vui lòng điền đầy đủ Tiêu đề, Nghệ sĩ và Đường dẫn nhạc.');
            return;
        }
        setIsSubmitting(true);
        try {
            const isEdit = editingSongId !== null;
            const url = isEdit ? `/api/songs/${editingSongId}` : '/api/songs';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 
                    'Content-Type': 'application/json',
                    'x-username': user?.username || ''
                },
                body: JSON.stringify({ ...newSong, isOnline: useExternalSource })
            });
            const data = await response.json();
            if (data.success) {
                alert(isEdit ? 'Cập nhật bài hát thành công!' : 'Bài hát đã được lưu vào cơ sở dữ liệu!');
                handleCancel();
                await refreshSongs();
            } else {
                alert(data.error || 'Đã xảy ra lỗi khi lưu bài hát.');
            }
        } catch (error) {
            console.error('Error saving song:', error);
            alert('Lỗi kết nối máy chủ.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSong = async (song: Song) => {
        if (confirm(`Bạn có chắc muốn xóa bài "${song.title}"?`)) {
            try {
                const res = await fetch(`/api/songs/${song.id}`, { 
                    method: 'DELETE',
                    headers: {
                        'x-username': user?.username || ''
                    }
                });
                const data = await res.json();
                if (data.success) {
                    alert('Đã xóa bài hát!');
                    await refreshSongs();
                } else {
                    alert(data.error || 'Xóa thất bại.');
                }
            } catch (err) {
                console.error('Lỗi khi xóa nhạc:', err);
            }
        }
    };

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
            });
    };

    const handleStartEdit = (song: Song) => {
        setEditingSongId(song.id);
        setNewSong({
            title: song.title,
            artist: song.artist,
            cover: song.cover,
            src: song.src,
            category: song.category || ''
        });
        setUseExternalSource(!!song.isOnline);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingSongId(null);
        setNewSong({ title: '', artist: '', cover: '/img/', src: '/sound/', category: '' });
    };

    return (
        <div className="admin-main-content" style={{ marginTop: '2rem' }}>
            <div className="section-header">
                <h3>Quản lý kho nhạc</h3>
                <button 
                    style={{
                        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 24px',
                        borderRadius: '50px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
                    }} 
                    onClick={() => {
                        if (isAdding) handleCancel();
                        else setIsAdding(true);
                    }}
                >
                    <i className={`fa-solid ${isAdding ? 'fa-xmark' : 'fa-plus'}`}></i> {isAdding ? 'Hủy bỏ' : 'Thêm bài hát mới'}
                </button>
            </div>

            {isAdding && (
                <div className="add-song-form" style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--glass-border)', backdropFilter: 'blur(10px)' }}>
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--primary-light)' }}>
                        {editingSongId ? 'Sửa thông tin bài hát' : 'Thêm bài hát mới'}
                    </h4>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px', width: 'fit-content' }}>
                        <button 
                            onClick={() => {
                                setUseExternalSource(false);
                                setNewSong(prev => ({
                                    ...prev,
                                    src: prev.src?.startsWith('http') ? '/sound/' : prev.src,
                                    cover: prev.cover?.startsWith('http') ? '/img/' : prev.cover
                                }));
                            }}
                            style={{ background: !useExternalSource ? 'var(--primary-color)' : 'transparent', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            <i className="fa-solid fa-folder-open" style={{marginRight: '6px'}}></i> File trong máy
                        </button>
                        <button 
                            onClick={() => {
                                setUseExternalSource(true);
                                setNewSong(prev => ({
                                    ...prev,
                                    src: prev.src?.startsWith('/sound/') ? '' : prev.src,
                                    cover: prev.cover?.startsWith('/img/') ? '' : prev.cover
                                }));
                            }}
                            style={{ background: useExternalSource ? 'var(--primary-color)' : 'transparent', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                        >
                            <i className="fa-brands fa-youtube" style={{marginRight: '6px'}}></i> Link ngoài (YT/URL)
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                        <div className="form-group"><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tiêu đề</label><input type="text" placeholder="Thanh Xuân" style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} /></div>
                        <div className="form-group"><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nghệ sĩ</label><input type="text" placeholder="Da LAB" style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }} value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} /></div>
                        
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Thể loại</label>
                            <select 
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                                value={newSong.category}
                                onChange={e => setNewSong({...newSong, category: e.target.value})}
                            >
                                <option value="">-- Chọn thể loại --</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat.slug} style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cover URL (Ảnh bìa)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    readOnly={!useExternalSource}
                                    placeholder={useExternalSource ? "https://..." : "Chọn từ thư mục..."} 
                                    style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', opacity: !useExternalSource ? 0.8 : 1, outline: 'none' }} 
                                    value={newSong.cover} 
                                    onChange={e => useExternalSource && setNewSong({...newSong, cover: e.target.value})} 
                                />
                                {!useExternalSource && (
                                    <button 
                                        onClick={() => handleOpenPicker('img')}
                                        style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        <i className="fa-solid fa-magnifying-glass"></i> Chọn
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>File URL (Link nhạc)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    readOnly={!useExternalSource}
                                    placeholder={useExternalSource ? "YouTube Link..." : "Chọn từ thư mục..."} 
                                    style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', opacity: !useExternalSource ? 0.8 : 1, outline: 'none' }} 
                                    value={newSong.src} 
                                    onChange={e => useExternalSource && setNewSong({...newSong, src: e.target.value})} 
                                />
                                {!useExternalSource && (
                                    <button 
                                        onClick={() => handleOpenPicker('sound')}
                                        style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        <i className="fa-solid fa-music"></i> Chọn
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '12px' }}>
                        <button onClick={handleSaveSong} disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                            {isSubmitting ? 'ĐANG LƯU...' : editingSongId ? 'CẬP NHẬT BÀI HÁT' : 'LƯU VÀO CƠ SỞ DỮ LIỆU'}
                        </button>
                        <button onClick={handleCancel} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--glass-border)', padding: '12px 30px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
                            Hủy bỏ
                        </button>
                    </div>
                </div>
            )}

            <div className="admin-table-container">
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <tr>
                            <th style={{ padding: '14px 12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Mã</th>
                            <th style={{ padding: '14px 12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Cover</th>
                            <th style={{ padding: '14px 12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Tiêu đề</th>
                            <th style={{ padding: '14px 12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Nghệ sĩ</th>
                            <th style={{ padding: '14px 12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Thể loại</th>
                            <th style={{ padding: '14px 12px', textAlign: 'right', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSongs.map(song => (
                            <tr key={song.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }} className="admin-table-row">
                                <td style={{ padding: '14px 12px' }}>#{song.id}</td>
                                <td style={{ padding: '14px 12px' }}>
                                    <Image 
                                        src={song.cover} 
                                        alt="" 
                                        width={40} 
                                        height={40} 
                                        style={{ borderRadius: '8px', objectFit: 'cover' }} 
                                    />
                                </td>
                                <td style={{ padding: '14px 12px', fontWeight: 600 }}>{song.title}</td>
                                <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{song.artist}</td>
                                <td style={{ padding: '14px 12px', color: 'var(--primary-light)', fontWeight: 600 }}>
                                    {categories.find(c => c.slug === song.category)?.name || song.category || '—'}
                                </td>
                                <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => handleStartEdit(song)}
                                            style={{ 
                                                background: 'rgba(99,102,241,0.1)', 
                                                color: 'var(--primary-light)', 
                                                border: 'none', 
                                                padding: '8px 12px', 
                                                borderRadius: '8px', 
                                                cursor: 'pointer', 
                                                fontSize: '0.8rem',
                                                fontWeight: 600,
                                                transition: 'all 0.2s' 
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = 'var(--primary-light)'; }}
                                        >
                                            <i className="fa-solid fa-pen-to-square"></i> Sửa
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteSong(song)}
                                            style={{ 
                                                background: 'rgba(239,68,68,0.1)', 
                                                color: '#ef4444', 
                                                border: 'none', 
                                                padding: '8px 12px', 
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
            </div>

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
                        setNewSong({...newSong, cover: `/img/${file}`});
                    } else {
                        const cleanTitle = file.replace(/\.(mp3|wav|m4a)$/i, '').replace(/_/g, ' ');
                        setNewSong({...newSong, src: `/sound/${file}`, title: newSong.title || cleanTitle});
                    }
                    setPickerOpen(false);
                    setPickerSearch('');
                }}
            />
        </div>
    );
};

export default AdminMusic;
