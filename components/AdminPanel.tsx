'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import { Song } from '@/data/constants';

interface AdminPanelProps {
    view: 'manage' | 'users' | 'stats' | 'music';
}

interface Feedback {
    id: string | number;
    _id?: string;
    email: string;
    message: string;
    timestamp: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ view }) => {
    const { user } = useAuth();
    const { allSongs, refreshSongs } = usePlayer();
    const [isAdding, setIsAdding] = useState(false);
    const [newSong, setNewSong] = useState<Partial<Song>>({
        title: '', artist: '', cover: '/img/', src: '/sound/'
    });
    const [users, setUsers] = useState<{ username: string; name: string; role: string; createdAt?: string }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localSounds, setLocalSounds] = useState<string[]>([]);
    const [localImages, setLocalImages] = useState<string[]>([]);
    const [useExternalSource, setUseExternalSource] = useState(false);
    const [pickerOpen, setPickerOpen] = useState(false);
    const [pickerType, setPickerType] = useState<'sound' | 'img'>('sound');
    const [pickerSearch, setPickerSearch] = useState('');
    
    // Feedback state
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch feedbacks
                const fRes = await fetch('/api/feedback');
                const fData = await fRes.json();
                if (fData.success) setFeedbacks(fData.data);

                // Fetch local files
                const sRes = await fetch('/api/files?type=sound');
                const sData = await sRes.json();
                if (sData.success) setLocalSounds(sData.files);

                const iRes = await fetch('/api/files?type=img');
                const iData = await iRes.json();
                if (iData.success) setLocalImages(iData.files);

                // Fetch users
                if (view === 'users') {
                    const uRes = await fetch('/api/users');
                    const uData = await uRes.json();
                    if (uData.success) setUsers(uData.data);
                }
            } catch (err) {
                console.error('Error fetching admin data:', err);
            }
        };
        fetchData();
    }, [view]);

    if (user?.role !== 'admin') return <div className="content">Access Denied</div>;

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

    const clearFeedback = async () => {
        if (confirm('Bạn có chắc muốn xóa tất cả phản hồi?')) {
            try {
                await fetch('/api/feedback', { method: 'DELETE' });
                setFeedbacks([]);
            } catch (err) {
                console.error('Error clearing feedback:', err);
            }
        }
    };

    const isDashboard = view === 'manage' || view === 'stats' || view === 'music';

    return (
        <section id="admin-panel" className="admin-section">
            <div className="section-header">
                <h2>{view === 'users' ? 'Quản lý người dùng' : 'Bảng điều khiển Admin'}</h2>
            </div>
            
            <div className="admin-tools" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {isDashboard && (
                    <>
                        {/* TOP STATS */}
                        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                            <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Tổng bài hát</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary-light)' }}>{allSongs.length}</p>
                            </div>
                            <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                    Phiếu góp ý {feedbacks.length > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem' }}>NEW</span>}
                                </h3>
                                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{feedbacks.length}</p>
                            </div>
                            <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                                <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Trạng thái</h3>
                                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#22c55e' }}>ONLINE</p>
                            </div>
                        </div>

                        {/* PREMIUM FEEDBACK LIST (MATCHING USER IMAGE) */}
                        <div className="admin-feedback-section">
                           <div className="section-header" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
                                    <i className="fa-solid fa-envelope-open-text" style={{ marginRight: '10px', color: 'var(--primary-light)' }}></i>
                                    Danh sách phiếu phản hồi
                                </h3>
                                {feedbacks.length > 0 && (
                                    <button onClick={clearFeedback} className="btn-clear-all" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                                        Xóa tất cả phiếu
                                    </button>
                                )}
                           </div>

                           {feedbacks.length === 0 ? (
                               <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '20px', border: '1px dashed var(--glass-border)' }}>
                                   <i className="fa-solid fa-inbox" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem', display: 'block' }}></i>
                                   <p style={{ color: 'var(--text-muted)' }}>Chưa có ý kiến đóng góp nào được ghi nhận.</p>
                               </div>
                           ) : (
                               <div className="feedback-grid-premium" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                                   {feedbacks.map((f, idx) => (
                                       <div key={f.id} className="feedback-ticket" style={{ background: 'white', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', color: '#333' }}>
                                           {/* Header Ticket */}
                                           <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: '24px', textAlign: 'center', color: 'white', position: 'relative' }}>
                                               <button 
                                                   onClick={async (e) => {
                                                       e.stopPropagation();
                                                       if (confirm('Xóa phiếu phản hồi này?')) {
                                                           try {
                                                               const res = await fetch(`/api/feedback/${f._id || f.id}`, { method: 'DELETE' });
                                                               if ((await res.json()).success) {
                                                                   setFeedbacks(prev => prev.filter(item => (item._id || item.id) !== (f._id || f.id)));
                                                               }
                                                           } catch (err) { console.error(err); }
                                                       }
                                                   }}
                                                   style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '24px', height: '24px' }}
                                               >
                                                   <i className="fa-solid fa-xmark"></i>
                                               </button>
                                               <h4 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                                   <i className="fa-regular fa-comment-dots" style={{ marginRight: '10px' }}></i>
                                                   PHẢN HỒI GỬI ĐẾN BAN QUẢN TRỊ
                                               </h4>
                                               <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>(V/v: Thư viện Giai Điệu - Melody Library)</p>
                                           </div>

                                           {/* Body Ticket */}
                                           <div style={{ padding: '24px' }}>
                                               <p style={{ marginBottom: '1rem', fontWeight: 600 }}>Xin chào <span style={{ color: '#6366f1' }}>Admin</span>,</p>
                                               <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                                                   Dưới đây là nội dung ý kiến đóng góp chân thành của người dùng, được ghi nhận vào hệ thống:
                                               </p>

                                               <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', borderLeft: '4px solid #6366f1' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px dashed #e2e8f0' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>📋</span>
                                                        <span style={{ fontSize: '0.95rem', fontWeight: 700 }}>Mã phiếu góp ý: <span style={{ color: '#6366f1' }}>#00{feedbacks.length - idx}</span></span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px dashed #e2e8f0' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>📅</span>
                                                        <span style={{ fontSize: '0.95rem' }}>Ngày gửi: <strong>{new Date(f.timestamp).toLocaleDateString('vi-VN')}</strong></span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px dashed #e2e8f0' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>👤</span>
                                                        <span style={{ fontSize: '0.95rem' }}>Người gửi: <strong>{f.email}</strong></span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                                                        <span style={{ fontSize: '1.2rem' }}>⏰</span>
                                                        <div style={{ fontSize: '0.95rem' }}>
                                                            <strong>Nội dung:</strong> <span style={{ color: '#334155', fontWeight: 500 }}>{f.message}</span>
                                                        </div>
                                                    </div>
                                               </div>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           )}
                        </div>

                        {/* MUSIC MANAGEMENT SECTION */}
                        <div className="admin-main-content" style={{ marginTop: '2rem' }}>
                            <div className="section-header">
                                <h3>Quản lý kho nhạc</h3>
                                <button className="btn-play-all" style={{ background: 'white', color: 'var(--primary-color)', border: 'none', padding: '10px 24px', borderRadius: '50px', fontWeight: 700, cursor: 'pointer' }} onClick={() => setIsAdding(!isAdding)}>
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
                                                        onClick={() => { 
                                                            setPickerType('img'); setPickerOpen(true); 
                                                            fetch(`/api/files?type=img&t=${Date.now()}`).then(r => r.json()).then(d => { if(d.success) setLocalImages(d.files); });
                                                        }}
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
                                                        onClick={() => { 
                                                            setPickerType('sound'); setPickerOpen(true); 
                                                            fetch(`/api/files?type=sound&t=${Date.now()}`).then(r => r.json()).then(d => { if(d.success) setLocalSounds(d.files); });
                                                        }}
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
                                                <td style={{ padding: '14px' }}><img src={song.cover} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} /></td>
                                                <td style={{ padding: '14px', fontWeight: 600 }}>{song.title}</td>
                                                <td style={{ padding: '14px', color: 'var(--text-muted)' }}>{song.artist}</td>
                                                <td style={{ padding: '14px', textAlign: 'right' }}>
                                                    <button 
                                                        onClick={async () => {
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
                                                        }}
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
                        </div>
                    </>
                )}

                {/* USERS VIEW */}
                {view === 'users' && (
                     <div className="admin-table-container">
                        <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Tài khoản</th>
                                    <th style={{ padding: '12px', textAlign: 'left' }}>Tên hiển thị</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Ngày tạo</th>
                                    <th style={{ padding: '12px', textAlign: 'center' }}>Phân quyền</th>
                                    <th style={{ padding: '12px', textAlign: 'right' }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '12px', fontWeight: 600 }}>{u.username}</td>
                                        <td style={{ padding: '12px' }}>{u.name}</td>
                                        <td style={{ padding: '12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'center' }}>
                                            <span style={{ background: u.role==='admin' ? '#f59e0b' : 'var(--primary-color)', padding: '4px 10px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white', display: 'inline-block', minWidth: '70px', textAlign: 'center' }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px', textAlign: 'right' }}>
                                            {u.role !== 'admin' && (
                                                <button 
                                                    onClick={async () => {
                                                        if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${u.username}" vĩnh viễn không?`)) {
                                                            try {
                                                                const res = await fetch(`/api/users?username=${u.username}`, { method: 'DELETE' });
                                                                const data = await res.json();
                                                                if (data.success) {
                                                                    setUsers(prev => prev.filter(user => user.username !== u.username));
                                                                } else {
                                                                    alert(data.error || 'Xóa thất bại');
                                                                }
                                                            } catch(err) {
                                                                alert('Lỗi hệ thống khi xóa');
                                                            }
                                                        }
                                                    }}
                                                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                                                >
                                                    <i className="fa-solid fa-trash"></i> Xóa
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {/* FILE PICKER MODAL */}
            {pickerOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                    <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '700px', maxHeight: '80vh', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                        {/* Header */}
                        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                                <i className={`fa-solid ${pickerType === 'img' ? 'fa-image' : 'fa-music'}`} style={{ marginRight: '12px', color: 'var(--primary-light)' }}></i>
                                Chọn {pickerType === 'img' ? 'Ảnh bìa' : 'Bài hát'} từ thư mục
                            </h3>
                            <button onClick={() => setPickerOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Search */}
                        <div style={{ padding: '15px 20px' }}>
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm file..." 
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white' }}
                                value={pickerSearch}
                                onChange={e => setPickerSearch(e.target.value)}
                            />
                        </div>

                        {/* List */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: pickerType === 'img' ? 'repeat(auto-fill, minmax(130px, 1fr))' : '1fr', gap: '12px' }}>
                                {(pickerType === 'img' ? localImages : localSounds)
                                    .filter(file => file.toLowerCase().includes(pickerSearch.toLowerCase()))
                                    .map(file => (
                                        <div 
                                            key={file} 
                                            onClick={() => {
                                                if (pickerType === 'img') {
                                                    setNewSong({...newSong, cover: `/img/${file}`});
                                                } else {
                                                    const cleanTitle = file.replace(/\.(mp3|wav|m4a)$/i, '').replace(/_/g, ' ');
                                                    setNewSong({...newSong, src: `/sound/${file}`, title: newSong.title || cleanTitle});
                                                }
                                                setPickerOpen(false);
                                                setPickerSearch('');
                                            }}
                                            style={{ 
                                                padding: '12px', 
                                                background: 'rgba(255,255,255,0.03)', 
                                                borderRadius: '12px', 
                                                cursor: 'pointer', 
                                                border: '1px solid transparent',
                                                transition: 'all 0.2s',
                                                display: 'flex',
                                                flexDirection: pickerType === 'img' ? 'column' : 'row',
                                                alignItems: 'center',
                                                gap: '12px'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                                e.currentTarget.style.borderColor = 'var(--primary-light)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                                e.currentTarget.style.borderColor = 'transparent';
                                            }}
                                        >
                                            {pickerType === 'img' ? (
                                                <>
                                                    <img src={`/img/${file}`} alt="" style={{ width: '100%', aspectRatio: '1/1', borderRadius: '8px', objectFit: 'cover', marginBottom: '8px' }} />
                                                    <span style={{ fontSize: '0.75rem', textAlign: 'center', wordBreak: 'break-all', opacity: 0.8 }}>{file}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-file-audio" style={{ fontSize: '1.2rem', color: 'var(--primary-light)' }}></i>
                                                    <span style={{ fontSize: '0.9rem', flex: 1 }}>{file}</span>
                                                </>
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ padding: '15px 20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)' }}>
                            Tìm thấy { (pickerType === 'img' ? localImages : localSounds).length } file trong thư mục
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default AdminPanel;
