'use client';

import React from 'react';

interface AdminStatsProps {
    songsCount: number;
    feedbacksCount: number;
}

const AdminStats: React.FC<AdminStatsProps> = ({ songsCount, feedbacksCount }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
            }}>
                {/* Stat: Tổng bài hát */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, var(--bg-card) 100%)',
                    padding: '1.6rem 1.8rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(99,102,241,0.18)',
                    boxShadow: 'var(--card-shadow)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(99,102,241,0.2)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)'; }}
                >
                    <div style={{
                        position: 'absolute', top: '-20px', right: '-20px',
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(99,102,241,0.08)'
                    }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: 'rgba(99,102,241,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.1rem', color: 'var(--primary-light)'
                        }}>
                            <i className="fa-solid fa-compact-disc"></i>
                        </div>
                        <h3 style={{
                            fontSize: '0.72rem', color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600, margin: 0
                        }}>Tổng bài hát</h3>
                    </div>
                    <p style={{
                        fontSize: '2.8rem', fontWeight: 800,
                        background: 'linear-gradient(135deg, var(--primary-light) 0%, #a5b4fc 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        lineHeight: '1', margin: 0, letterSpacing: '-0.03em'
                    }}>{songsCount}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', opacity: 0.7 }}>bài trong thư viện</p>
                </div>

                {/* Stat: Góp ý */}
                <div style={{
                    background: feedbacksCount > 0
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, var(--bg-card) 100%)'
                        : 'var(--bg-card)',
                    padding: '1.6rem 1.8rem',
                    borderRadius: '20px',
                    border: `1px solid ${feedbacksCount > 0 ? 'rgba(245,158,11,0.2)' : 'var(--glass-border)'}`,
                    boxShadow: 'var(--card-shadow)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: feedbacksCount > 0 ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.06)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.1rem',
                            color: feedbacksCount > 0 ? '#f59e0b' : 'var(--text-muted)'
                        }}>
                            <i className="fa-solid fa-comment-dots"></i>
                        </div>
                        <h3 style={{
                            fontSize: '0.72rem', color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600, margin: 0,
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}>
                            Góp ý nhận được
                            {feedbacksCount > 0 && (
                                <span style={{
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white', padding: '1px 7px',
                                    borderRadius: '10px', fontSize: '0.6rem', fontWeight: 700,
                                    letterSpacing: '0.5px'
                                }}>MỚI</span>
                            )}
                        </h3>
                    </div>
                    <p style={{
                        fontSize: '2.8rem', fontWeight: 800,
                        color: feedbacksCount > 0 ? '#f59e0b' : 'var(--text-muted)',
                        lineHeight: '1', margin: 0, letterSpacing: '-0.03em'
                    }}>{feedbacksCount}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', opacity: 0.7 }}>
                        <i className="fa-solid fa-arrow-right" style={{ marginRight: '5px', fontSize: '0.65rem' }}></i>
                        Xem tại tab Góp ý → Quản lý User
                    </p>
                </div>

                {/* Stat: Trạng thái */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, var(--bg-card) 100%)',
                    padding: '1.6rem 1.8rem',
                    borderRadius: '20px',
                    border: '1px solid rgba(34,197,94,0.15)',
                    boxShadow: 'var(--card-shadow)',
                    transition: 'transform 0.25s ease',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '12px',
                            background: 'rgba(34,197,94,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '1.1rem', color: '#22c55e'
                        }}>
                            <i className="fa-solid fa-server"></i>
                        </div>
                        <h3 style={{
                            fontSize: '0.72rem', color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '1.2px', fontWeight: 600, margin: 0
                        }}>Hệ thống</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: '#22c55e', flexShrink: 0,
                            boxShadow: '0 0 8px #22c55e, 0 0 16px rgba(34,197,94,0.4)',
                            display: 'inline-block'
                        }} />
                        <p style={{
                            fontSize: '1.6rem', fontWeight: 800, color: '#22c55e',
                            lineHeight: '1', margin: 0, letterSpacing: '0.02em'
                        }}>ONLINE</p>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', opacity: 0.7 }}>tất cả dịch vụ hoạt động</p>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
