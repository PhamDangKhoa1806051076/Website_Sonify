'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Session {
    deviceId: string;
    lastActive: string;
    label: string;
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

const AdminUsers: React.FC<AdminUsersProps> = ({ users, setUsers }) => {
    const { user } = useAuth();
    const [now, setNow] = useState<number>(0);

    // Initial time set and Tick every 30s
    useEffect(() => {
        // Use a microtask to avoid the "cascading renders" error in some React linters
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

    return (
        <div className="admin-table-container">
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <th style={{ padding: '14px 12px', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Tài khoản</th>
                        <th style={{ padding: '14px 12px', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Tên hiển thị</th>
                        <th style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Ngày tạo</th>
                        <th style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Hoạt động cuối</th>
                        <th style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Phân quyền</th>
                        <th style={{ padding: '14px 12px', textAlign: 'right', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }} className="admin-table-row">
                            <td style={{ padding: '16px 12px', fontWeight: 600 }}>{u.username}</td>
                            <td style={{ padding: '16px 12px' }}>{u.name}</td>
                            <td style={{ padding: '16px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                            </td>
                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                {u.sessions && u.sessions.length > 0 ? (
                                    <div style={{ fontSize: '0.8rem' }}>
                                        {u.sessions.map((s) => {
                                            const lastActiveDate = new Date(s.lastActive);
                                            const isOnline = (now - lastActiveDate.getTime()) < ONLINE_THRESHOLD_MS;
                                            return (
                                                <div key={s.deviceId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
                                                    {/* Online / Offline dot */}
                                                    <span style={{
                                                        width: '8px', height: '8px', borderRadius: '50%',
                                                        background: isOnline ? '#10b981' : '#6b7280',
                                                        display: 'inline-block', flexShrink: 0,
                                                        boxShadow: isOnline ? '0 0 6px #10b981' : 'none'
                                                    }} />
                                                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{s.label}:</span>
                                                    {isOnline ? (
                                                        <span style={{ color: '#10b981', fontWeight: 700 }}>Online</span>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-muted)' }}>{formatTimeAgo(lastActiveDate)}</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Chưa đăng nhập</span>
                                )}
                            </td>
                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                <span style={{ background: u.role === 'admin' ? '#f59e0b' : 'var(--primary-color)', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', color: 'white', display: 'inline-block', minWidth: '75px', textAlign: 'center' }}>
                                    {u.role}
                                </span>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
