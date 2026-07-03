'use client';

import React from 'react';

interface Feedback {
    id: string | number;
    _id?: string;
    email: string;
    message: string;
    timestamp: string;
}

interface AdminStatsProps {
    songsCount: number;
    feedbacks: Feedback[];
    setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
    onClearAllFeedback: () => void;
}

const AdminStats: React.FC<AdminStatsProps> = ({ 
    songsCount, 
    feedbacks, 
    setFeedbacks, 
    onClearAllFeedback 
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* TOP STATS */}
            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)', transition: 'transform 0.3s ease' }}>
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Tổng bài hát</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-light)', lineHeight: '1.1' }}>{songsCount}</p>
                </div>
                <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' }}>
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Phiếu góp ý {feedbacks.length > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 700 }}>NEW</span>}
                    </h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', lineHeight: '1.1' }}>{feedbacks.length}</p>
                </div>
                <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' }}>
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Trạng thái hệ thống</h3>
                    <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#22c55e', lineHeight: '1.1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 10px #22c55e' }} />
                        ONLINE
                    </p>
                </div>
            </div>

            {/* PREMIUM FEEDBACK LIST */}
            <div className="admin-feedback-section">
                <div className="section-header" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
                        <i className="fa-solid fa-envelope-open-text" style={{ marginRight: '12px', color: 'var(--primary-light)' }}></i>
                        Danh sách phản hồi của người dùng
                    </h3>
                    {feedbacks.length > 0 && (
                        <button 
                            onClick={onClearAllFeedback} 
                            className="btn-clear-all" 
                            style={{ 
                                background: 'rgba(239,68,68,0.1)', 
                                color: '#ef4444', 
                                border: '1px solid rgba(239,68,68,0.2)', 
                                padding: '8px 18px', 
                                borderRadius: '10px', 
                                cursor: 'pointer', 
                                fontSize: '0.85rem', 
                                fontWeight: 600,
                                transition: 'var(--transition)'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                        >
                            Xóa tất cả phiếu
                        </button>
                    )}
                </div>

                {feedbacks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: '24px', border: '1px dashed var(--glass-border)' }}>
                        <i className="fa-solid fa-inbox" style={{ fontSize: '3.5rem', color: 'var(--text-muted)', marginBottom: '1.2rem', display: 'block' }}></i>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Chưa có ý kiến đóng góp nào được ghi nhận.</p>
                    </div>
                ) : (
                    <div className="feedback-grid-premium" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '2rem' }}>
                        {feedbacks.map((f, idx) => (
                            <div key={f.id} className="feedback-ticket" style={{ background: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.35)', backdropFilter: 'blur(15px)', transition: 'transform 0.3s ease' }}>
                                {/* Header Ticket */}
                                <div style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, #a855f7 100%)', padding: '24px', textAlign: 'center', color: 'white', position: 'relative' }}>
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
                                        style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'background 0.2s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                                    >
                                        <i className="fa-solid fa-xmark"></i>
                                    </button>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                                        <i className="fa-regular fa-comment-dots" style={{ marginRight: '10px' }}></i>
                                        Ý KIẾN NGƯỜI DÙNG SONIFY
                                    </h4>
                                    <p style={{ fontSize: '0.78rem', opacity: 0.8 }}>(Mã phiếu phản hồi hệ thống)</p>
                                </div>

                                {/* Body Ticket */}
                                <div style={{ padding: '24px' }}>
                                    <p style={{ marginBottom: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>Xin chào <span style={{ color: 'var(--primary-light)' }}>Admin</span>,</p>
                                    
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '16px', borderLeft: '4px solid var(--primary-color)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px dashed var(--glass-border)' }}>
                                            <span style={{ fontSize: '1.1rem' }}>📋</span>
                                            <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>Mã số góp ý: <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>#00{feedbacks.length - idx}</span></span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px dashed var(--glass-border)' }}>
                                            <span style={{ fontSize: '1.1rem' }}>📅</span>
                                            <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>Ngày gửi: <strong>{new Date(f.timestamp).toLocaleDateString('vi-VN')}</strong></span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px dashed var(--glass-border)' }}>
                                            <span style={{ fontSize: '1.1rem' }}>👤</span>
                                            <span style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>Người gửi: <strong>{f.email}</strong></span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginTop: '12px' }}>
                                            <span style={{ fontSize: '1.1rem' }}>💬</span>
                                            <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                                                <strong>Nội dung:</strong> <span style={{ color: 'var(--text-muted)', fontWeight: 500, display: 'block', marginTop: '6px', lineHeight: '1.5', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px' }}>{f.message}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminStats;
