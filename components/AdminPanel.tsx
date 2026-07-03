'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';
import AdminMusic from './admin/AdminMusic';
import AdminUsers from './admin/AdminUsers';
import AdminStats from './admin/AdminStats';
import AdminCategories from './admin/AdminCategories';

interface AdminPanelProps {
    view: 'manage' | 'users' | 'stats' | 'music' | 'categories';
}

interface Feedback {
    id: string | number;
    _id?: string;
    email: string;
    message: string;
    timestamp: string;
}

interface Session {
    deviceId: string;
    lastActive: string;
    label: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ view }) => {
    const { user } = useAuth();
    const { allSongs, refreshSongs } = usePlayer();
    const [users, setUsers] = useState<{ username: string; name: string; role: string; createdAt?: string; sessions?: Session[] }[]>([]);
    const [localSounds, setLocalSounds] = useState<string[]>([]);
    const [localImages, setLocalImages] = useState<string[]>([]);
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
                if (view === 'users' || view === 'manage' || view === 'stats') {
                    const uRes = await fetch('/api/users', {
                        headers: { 'x-username': user?.username || '' }
                    });
                    const uData = await uRes.json();
                    if (uData.success) setUsers(uData.data);
                }
            } catch (err) {
                console.error('Error fetching admin data:', err);
            }
        };
        fetchData();
    }, [view, user?.username]);

    if (user?.role !== 'admin') return <div className="content">Access Denied</div>;

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
                <h2>{view === 'users' ? 'Quản lý người dùng' : view === 'categories' ? 'Quản lý Thể loại' : 'Bảng điều khiển Admin'}</h2>
            </div>
            
            <div className="admin-tools">
                {isDashboard && (
                    <AdminStats 
                        songsCount={allSongs.length}
                        feedbacksCount={feedbacks.length}
                    />
                )}

                {view === 'music' && (
                    <AdminMusic 
                        allSongs={allSongs}
                        refreshSongs={refreshSongs}
                        localSounds={localSounds}
                        localImages={localImages}
                    />
                )}

                {view === 'categories' && (
                    <AdminCategories />
                )}

                {view === 'users' && (
                    <AdminUsers 
                        users={users}
                        setUsers={setUsers}
                        feedbacks={feedbacks}
                        setFeedbacks={setFeedbacks}
                    />
                )}
            </div>
        </section>
    );
};

export default AdminPanel;
