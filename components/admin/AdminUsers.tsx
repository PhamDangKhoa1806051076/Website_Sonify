'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Session {
    deviceId: string;
    lastActive: string;
    label: string;
}

interface Feedback {
    id: string | number;
    _id?: string;
    email: string;
    message: string;
    timestamp: string;
}

interface User {
    username: string;
    name: string;
    role: string;
    email?: string;
    createdAt?: string;
    sessions?: Session[];
}

interface AdminUsersProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    feedbacks: Feedback[];
    setFeedbacks: React.Dispatch<React.SetStateAction<Feedback[]>>;
}

const ONLINE_THRESHOLD_MS = 2.5 * 60 * 1000; // 2.5 minutes

function formatTimeAgo(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    if (diffMin < 1) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    return date.toLocaleDateString('vi-VN');
}

const AdminUsers: React.FC<AdminUsersProps> = ({ users, setUsers, feedbacks, setFeedbacks }) => {
    const { user } = useAuth();
    const [now, setNow] = useState<number>(0);
    const [activeTab, setActiveTab] = useState<'users' | 'feedbacks'>('users');
    const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; username: string; name: string; items: Feedback[] }>({ open: false, username: '', name: '', items: [] });

    // Initial time set and Tick every 30s
    useEffect(() => {
        Promise.resolve().then(() => setNow(Date.now()));
        const tick = setInterval(() => setNow(Date.now()), 30000);
        return () => clearInterval(tick);
    }, []);

    // Auto-refresh user list every 60s to get latest sessions from server
    useEffect(() => {
        const refresh = setInterval(async () => {
            try {
                const res = await fetch('/api/users', {
                    headers: {
                        'x-username': user?.username || ''
                    }
                });
                const data = await res.json();
                if (data.success) setUsers(data.data);
            } catch { /* silent */ }
        }, 60000);
        return () => clearInterval(refresh);
    }, [setUsers, user?.username]);

    // Get feedbacks for a specific user (match by username or name)
    const getUserFeedbacks = (u: User): Feedback[] => {
        return feedbacks.filter(f => {
            const emailLower = (f.email || '').toLowerCase();
            const usernameLower = u.username.toLowerCase();
            const nameLower = u.name.toLowerCase();
            return emailLower.includes(usernameLower) || emailLower.includes(nameLower) || emailLower === usernameLower;
        });
    };

    const handleOpenFeedback = (username: string, name: string, items: Feedback[]) => {
        setFeedbackModal({ open: true, username, name, items });
    };

    const handleDeleteFeedback = async (f: Feedback) => {
        if (confirm('Xóa phiếu phản hồi này?')) {
            try {
                const res = await fetch(`/api/feedback/${f._id || f.id}`, { method: 'DELETE' });
                if ((await res.json()).success) {
                    setFeedbacks(prev => prev.filter(item => (item._id || item.id) !== (f._id || f.id)));
                    setFeedbackModal(prev => ({
                        ...prev,
                        items: prev.items.filter(item => (item._id || item.id) !== (f._id || f.id))
                    }));
                }
            } catch (err) { console.error(err); }
        }
    };


    return (
        <>
            {/* ===== TAB BAR ===== */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0' }}>
                <button
                    onClick={() => setActiveTab('users')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '10px 20px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: activeTab === 'users' ? 'var(--primary-light)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'users' ? '2px solid var(--primary-color)' : '2px solid transparent',
                        marginBottom: '-1px',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <i className="fa-solid fa-users"></i>
                    Người dùng
                    <span style={{
                        background: activeTab === 'users' ? 'var(--primary-color)' : 'rgba(255,255,255,0.08)',
                        color: activeTab === 'users' ? 'white' : 'var(--text-muted)',
                        borderRadius: '50px',
                        padding: '1px 8px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                    }}>{users.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('feedbacks')}
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '10px 20px',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: activeTab === 'feedbacks' ? 'var(--primary-light)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'feedbacks' ? '2px solid var(--primary-color)' : '2px solid transparent',
                        marginBottom: '-1px',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <i className="fa-solid fa-comment-dots"></i>
                    Góp ý
                    {feedbacks.length > 0 && (
                        <span style={{
                            background: activeTab === 'feedbacks' ? 'var(--primary-color)' : 'rgba(245,158,11,0.2)',
                            color: activeTab === 'feedbacks' ? 'white' : '#f59e0b',
                            borderRadius: '50px',
                            padding: '1px 8px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                        }}>{feedbacks.length}</span>
                    )}
                </button>
            </div>

            {/* ===== TAB: NGƯỜI DÙNG ===== */}
            {activeTab === 'users' && (
            <div className="admin-table-container">
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '14px 12px', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Tài khoản</th>
                            <th style={{ padding: '14px 12px', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Tên hiển thị</th>
                            <th style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Ngày tạo</th>
                            <th style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Hoạt động cuối</th>
                            <th style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Phân quyền</th>
                            <th style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Góp ý</th>
                            <th style={{ padding: '14px 12px', textAlign: 'right', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => {
                            const userFeedbacks = getUserFeedbacks(u);
                            return (
                            <tr key={u.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }} className="admin-table-row">
                                <td style={{ padding: '16px 12px', fontWeight: 600 }}>{u.username}</td>
                                <td style={{ padding: '16px 12px' }}>{u.name}</td>
                                <td style={{ padding: '16px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                                </td>
                                <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                    {u.sessions && u.sessions.length > 0 ? (() => {
                                        const sorted = [...u.sessions].sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
                                        const latest = sorted[0];
                                        const lastActiveDate = new Date(latest.lastActive);
                                        const isOnline = (now - lastActiveDate.getTime()) < ONLINE_THRESHOLD_MS;
                                        return (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}>
                                                <span style={{
                                                    width: '8px', height: '8px', borderRadius: '50%',
                                                    background: isOnline ? '#10b981' : '#6b7280',
                                                    display: 'inline-block', flexShrink: 0,
                                                    boxShadow: isOnline ? '0 0 6px #10b981' : 'none'
                                                }} />
                                                {isOnline ? (
                                                    <span style={{ color: '#10b981', fontWeight: 700 }}>Đang online</span>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)' }}>{formatTimeAgo(lastActiveDate)}</span>
                                                )}
                                            </div>
                                        );
                                    })() : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chưa đăng nhập</span>
                                    )}
                                </td>
                                <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                    {u.username === 'admin' || u.username === user?.username ? (
                                        <span style={{ 
                                            background: u.role === 'admin' ? '#f59e0b' : 'var(--primary-color)', 
                                            padding: '5px 14px', 
                                            borderRadius: '50px', 
                                            fontSize: '0.8rem', 
                                            fontWeight: 'bold', 
                                            color: 'white', 
                                            display: 'inline-block', 
                                            minWidth: '80px', 
                                            textAlign: 'center',
                                            boxShadow: u.role === 'admin' ? '0 2px 10px rgba(245, 158, 11, 0.3)' : '0 2px 10px rgba(99, 102, 241, 0.3)'
                                        }}>
                                            {u.role}
                                        </span>
                                    ) : (
                                        <select
                                            value={u.role}
                                            onChange={async (e) => {
                                                const newRole = e.target.value as 'admin' | 'user';
                                                if (confirm(`Bạn có chắc chắn muốn thay đổi vai trò của tài khoản "${u.username}" thành "${newRole}"?`)) {
                                                    try {
                                                        const res = await fetch('/api/users', {
                                                            method: 'PATCH',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'x-username': user?.username || ''
                                                            },
                                                            body: JSON.stringify({ username: u.username, role: newRole })
                                                        });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            setUsers(prev => prev.map(usr => usr.username === u.username ? { ...usr, role: newRole } : usr));
                                                        } else {
                                                            alert(data.error || 'Cập nhật phân quyền thất bại');
                                                        }
                                                    } catch {
                                                        alert('Lỗi hệ thống khi cập nhật phân quyền');
                                                    }
                                                }
                                            }}
                                            style={{
                                                background: u.role === 'admin' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(99, 102, 241, 0.12)',
                                                color: u.role === 'admin' ? '#f59e0b' : 'var(--primary-light)',
                                                border: '1px solid var(--glass-border)',
                                                padding: '5px 12px',
                                                borderRadius: '50px',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                outline: 'none',
                                                textAlign: 'center',
                                                minWidth: '90px',
                                                transition: 'var(--transition)'
                                            }}
                                        >
                                            <option value="user" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>user</option>
                                            <option value="admin" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>admin</option>
                                        </select>
                                    )}
                                </td>
                                {/* Góp ý badge */}
                                <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                    {userFeedbacks.length > 0 ? (
                                        <button
                                            onClick={() => handleOpenFeedback(u.username, u.name, userFeedbacks)}
                                            style={{
                                                background: 'rgba(245, 158, 11, 0.12)',
                                                color: '#f59e0b',
                                                border: '1px solid rgba(245, 158, 11, 0.25)',
                                                padding: '5px 14px',
                                                borderRadius: '50px',
                                                fontSize: '0.8rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f59e0b'; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)'; e.currentTarget.style.color = '#f59e0b'; }}
                                        >
                                            <i className="fa-solid fa-comment-dots"></i>
                                            {userFeedbacks.length}
                                        </button>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>
                                    )}
                                </td>
                                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                    {u.role !== 'admin' && (
                                        <button
                                            onClick={async () => {
                                                if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${u.username}" vĩnh viễn không?`)) {
                                                    try {
                                                        const res = await fetch(`/api/users?username=${u.username}`, { 
                                                            method: 'DELETE',
                                                            headers: {
                                                                'x-username': user?.username || ''
                                                            }
                                                        });
                                                        const data = await res.json();
                                                        if (data.success) {
                                                            setUsers(prev => prev.filter(user => user.username !== u.username));
                                                        } else {
                                                            alert(data.error || 'Xóa thất bại');
                                                        }
                                                    } catch {
                                                        alert('Lỗi hệ thống khi xóa');
                                                    }
                                                }
                                            }}
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
                                    )}
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>

            </div>
            )} {/* end activeTab === 'users' */}

            {/* ===== TAB: GÓP Ý ===== */}
            {activeTab === 'feedbacks' && (
                <div>
                    {feedbacks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                            <i className="fa-solid fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', opacity: 0.4 }}></i>
                            <p style={{ fontSize: '0.95rem' }}>Chưa có ý kiến đóng góp nào được ghi nhận.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {feedbacks.map((f, idx) => {
                                // Find matching user
                                const matchedUser = users.find(u => {
                                    const emailLower = (f.email || '').toLowerCase();
                                    return emailLower.includes(u.username.toLowerCase()) || emailLower.includes(u.name.toLowerCase()) || emailLower === u.username.toLowerCase();
                                });
                                return (
                                    <div key={f._id || f.id} style={{
                                        background: 'var(--bg-card)',
                                        borderRadius: '16px',
                                        padding: '20px',
                                        border: '1px solid var(--glass-border)',
                                        position: 'relative',
                                        transition: 'transform 0.2s'
                                    }}>
                                        {/* Delete button */}
                                        <button
                                            onClick={() => handleDeleteFeedback(f)}
                                            style={{
                                                position: 'absolute', top: '14px', right: '14px',
                                                background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444',
                                                cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.85rem', transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                            title="Xóa góp ý"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>

                                        {/* Meta row */}
                                        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px dashed var(--glass-border)' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 700, background: 'rgba(99,102,241,0.1)', padding: '2px 10px', borderRadius: '50px' }}>
                                                #{String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                                <i className="fa-regular fa-calendar" style={{ color: 'var(--primary-light)' }}></i>
                                                {new Date(f.timestamp).toLocaleString('vi-VN')}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                                                <i className="fa-regular fa-user" style={{ color: 'var(--primary-light)' }}></i>
                                                {f.email || 'Khách'}
                                            </span>
                                            {matchedUser ? (
                                                <span style={{ fontSize: '0.78rem', background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '2px 10px', borderRadius: '50px', fontWeight: 700 }}>
                                                    <i className="fa-solid fa-circle-check" style={{ marginRight: '4px' }}></i>
                                                    {matchedUser.name}
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '0.78rem', background: 'rgba(107,114,128,0.12)', color: '#9ca3af', padding: '2px 10px', borderRadius: '50px', fontWeight: 600 }}>
                                                    Khách vãng lai
                                                </span>
                                            )}
                                        </div>

                                        {/* Message */}
                                        <div style={{
                                            fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.7',
                                            background: 'rgba(255,255,255,0.03)', padding: '14px 16px',
                                            borderRadius: '10px', borderLeft: '3px solid var(--primary-color)'
                                        }}>
                                            {f.message}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ========== FEEDBACK MODAL (dùng khi click từ cột Góp ý trong tab Users) ========== */}
            {feedbackModal.open && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
                        zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                    }}
                    onClick={() => setFeedbackModal({ open: false, username: '', name: '', items: [] })}
                >
                    <div
                        style={{
                            background: 'var(--bg-sidebar)', width: '100%', maxWidth: '620px', maxHeight: '80vh',
                            borderRadius: '24px', border: '1px solid var(--glass-border)',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            animation: 'dropIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary-color) 0%, #a855f7 100%)',
                            padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white'
                        }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                                    <i className="fa-solid fa-comment-dots" style={{ marginRight: '10px' }}></i>
                                    Góp ý của {feedbackModal.name}
                                </h3>
                                <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '4px' }}>
                                    {feedbackModal.items.length} phản hồi
                                </p>
                            </div>
                            <button
                                onClick={() => setFeedbackModal({ open: false, username: '', name: '', items: [] })}
                                style={{
                                    background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer',
                                    borderRadius: '50%', width: '32px', height: '32px', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.35)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                            {feedbackModal.items.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                                    <i className="fa-solid fa-inbox" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
                                    Không còn phản hồi nào.
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {feedbackModal.items.map((f, idx) => (
                                        <div key={f._id || f.id} style={{
                                            background: 'var(--bg-card)', borderRadius: '16px', padding: '20px',
                                            border: '1px solid var(--glass-border)', position: 'relative'
                                        }}>
                                            <button
                                                onClick={() => handleDeleteFeedback(f)}
                                                style={{
                                                    position: 'absolute', top: '12px', right: '12px',
                                                    background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444',
                                                    cursor: 'pointer', borderRadius: '50%', width: '28px', height: '28px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    fontSize: '0.8rem', transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                            >
                                                <i className="fa-solid fa-xmark"></i>
                                            </button>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px dashed var(--glass-border)' }}>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 700 }}>#{String(idx + 1).padStart(2, '0')}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>📅 {new Date(f.timestamp).toLocaleDateString('vi-VN')}</span>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>👤 {f.email}</span>
                                            </div>
                                            <div style={{
                                                fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: '1.6',
                                                background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '10px',
                                                borderLeft: '3px solid var(--primary-color)'
                                            }}>
                                                {f.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminUsers;
