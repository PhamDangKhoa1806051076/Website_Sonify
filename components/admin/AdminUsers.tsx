'use client';

import React from 'react';

interface User {
    username: string;
    name: string;
    role: string;
    email?: string;
    createdAt?: string;
    sessions?: { deviceId: string; lastActive: string; label: string }[];
}

interface AdminUsersProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ users, setUsers }) => {
    return (
        <div className="admin-table-container">
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Tài khoản</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Tên hiển thị</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Ngày tạo</th>
                        <th style={{ padding: '12px', textAlign: 'center' }}>Hoạt động cuối</th>
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
                                {u.sessions && u.sessions.length > 0 ? (
                                    <div style={{ fontSize: '0.8rem' }}>
                                        {u.sessions.map((s, idx) => {
                                            const isActive = (new Date().getTime() - new Date(s.lastActive).getTime()) < 5 * 60 * 1000;
                                            return (
                                                <div key={s.deviceId} style={{ color: isActive ? 'var(--primary-color)' : 'var(--text-muted)', marginBottom: '4px' }}>
                                                    <span style={{ fontWeight: 700 }}>{s.label}: </span>
                                                    {new Date(s.lastActive).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                    {isActive && <span style={{ marginLeft: '4px', fontSize: '0.7rem', color: '#10b981' }}>(Online)</span>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>Chưa có</span>
                                )}
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
    );
};

export default AdminUsers;
