'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Song } from '@/data/constants';
import FilePickerModal from './FilePickerModal';

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
    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [useExternalSource, setUseExternalSource] = useState(false);
    const [newSong, setNewSong] = useState<Partial<Song>>({
        title: '', artist: '', cover: '/img/', src: '/sound/'
    });

    const [localSounds, setLocalSounds] = useState<string[]>(initialSounds);
    const [localImages, setLocalImages] = useState<string[]>(initialImages);

    // Picker state
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerType, setPickerType] = useState<'sound' | 'img'>('sound');
    const [pickerSearch, setPickerSearch] = useState('');

    const handleSaveSong = async () => {
        if (!newSong.title || !newSong.artist || !newSong.src) return;
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/songs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newSong, isOnline: useExternalSource })
            });
            const data = await response.json();
            if (data.success) {
                alert('Bài hát đã được lưu vào cơ sở dữ liệu!');
                setIsAdding(false);
                setNewSong({ title: '', artist: '', cover: '/img/', src: '/sound/' });
                await refreshSongs();
            }
        } catch (error) {
            console.error('Error saving song:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSong = async (song: Song) => {
        if (confirm(`Bạn có chắc muốn xóa bài "${song.title}"?`)) {
            try {
                const res = await fetch(`/api/songs/${song.id}`, { method: 'DELETE' });
                const data = await res.json();
                if (data.success) {
                    alert('Đã xóa bài hát!');
                    await refreshSongs();
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

    return (
        <div className="admin-main-content" style={{ marginTop: '2rem' }}>
            <div className="section-header">
                <h3>Quản lý kho nhạc</h3>
                <button 
                    className="btn-play-all" 
                    style={{ background: 'white', color: 'var(--primary-color)', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: 700, cursor: 'pointer' }} 
                    onClick={() => setIsAdding(!isAdding)}
                >
                    <i className={`fa-solid ${isAdding ? 'fa-xmark' : 'fa-plus'}`}></i> {isAdding ? 'Hủy bỏ' : 'Thêm bài hát mới'}
                </button>
            </div>

            {isAdding && (
                <div className="add-song-form" style={{ background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--primary-light)' }}>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group"><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Tiêu đề</label><input type="text" placeholder="Thanh Xuân" style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={newSong.title} onChange={e => setNewSong({...newSong, title: e.target.value})} /></div>
                        <div className="form-group"><label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Nghệ sĩ</label><input type="text" placeholder="Da LAB" style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={newSong.artist} onChange={e => setNewSong({...newSong, artist: e.target.value})} /></div>
                        
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>Cover URL (Ảnh bìa)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    readOnly={!useExternalSource}
                                    placeholder={useExternalSource ? "https://..." : "Chọn từ thư mục..."} 
                                    style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white', opacity: !useExternalSource ? 0.8 : 1 }} 
                                    value={newSong.cover} 
                                    onChange={e => useExternalSource && setNewSong({...newSong, cover: e.target.value})} 
                                />
                                {!useExternalSource && (
                                    <button 
                                        onClick={() => handleOpenPicker('img')}
                                        style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        <i className="fa-solid fa-magnifying-glass"></i> Chọn
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem' }}>File URL (Link nhạc)</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input 
                                    type="text" 
                                    readOnly={!useExternalSource}
                                    placeholder={useExternalSource ? "YouTube Link..." : "Chọn từ thư mục..."} 
                                    style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white', opacity: !useExternalSource ? 0.8 : 1 }} 
                                    value={newSong.src} 
                                    onChange={e => useExternalSource && setNewSong({...newSong, src: e.target.value})} 
                                />
                                {!useExternalSource && (
                                    <button 
                                        onClick={() => handleOpenPicker('sound')}
                                        style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        <i className="fa-solid fa-music"></i> Chọn
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleSaveSong} disabled={isSubmitting} style={{ marginTop: '1.5rem', background: 'var(--primary-color)', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
                        {isSubmitting ? 'ĐANG LƯU...' : 'LƯU VÀO CƠ SỞ DỮ LIỆU'}
                    </button>
                </div>
            )}

            <div className="admin-table-container">
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <tr>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Mã</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Cover</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Tiêu đề</th>
                            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Nghệ sĩ</th>
                            <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allSongs.map(song => (
                            <tr key={song.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '14px' }}>#{song.id}</td>
                                <td style={{ padding: '14px' }}>
                                    <Image 
                                        src={song.cover} 
                                        alt="" 
                                        width={40} 
                                        height={40} 
                                        style={{ borderRadius: '8px', objectFit: 'cover' }} 
                                    />
                                </td>
                                <td style={{ padding: '14px', fontWeight: 600 }}>{song.title}</td>
                                <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{song.artist}</td>
                                <td style={{ padding: '14px', textAlign: 'right' }}>
                                    <button 
                                        onClick={() => handleDeleteSong(song)}
                                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
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
