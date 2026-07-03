'use client';

import React from 'react';

interface AdminStatsProps {
    songsCount: number;
    feedbacksCount: number;
}

const AdminStats: React.FC<AdminStatsProps> = ({ 
    songsCount, 
    feedbacksCount
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
                        Phiếu góp ý {feedbacksCount > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '0.65rem', fontWeight: 700 }}>NEW</span>}
                    </h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', lineHeight: '1.1' }}>{feedbacksCount}</p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                        <i className="fa-solid fa-arrow-right" style={{ marginRight: '6px' }}></i>
                        Xem chi tiết tại Quản lý người dùng
                    </p>
                </div>
                <div className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.8rem', borderRadius: '20px', border: '1px solid var(--glass-border)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' }}>
                    <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Trạng thái hệ thống</h3>
                    <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#22c55e', lineHeight: '1.1', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', display: 'inline-block', boxShadow: '0 0 10px #22c55e' }} />
                        ONLINE
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
