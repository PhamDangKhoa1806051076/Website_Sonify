'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { usePlayer } from '@/context/PlayerContext';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    isCollapsed?: boolean;
    onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isCollapsed = false, onToggleCollapse }) => {
    const { t } = useLanguage();
    const { user, isAuthenticated } = useAuth();
    const { playlists, deletePlaylist } = usePlayer();

    const isAdmin = user?.role === 'admin';

    const navItems = [
        { id: 'home', icon: 'fa-house', label: 'nav-home', userOnly: false, adminOnly: false },
        { id: 'recent', icon: 'fa-clock-rotate-left', label: 'nav-recent', userOnly: true, adminOnly: false },
        { id: 'charts', icon: 'fa-chart-simple', label: 'nav-charts', userOnly: true, adminOnly: false },
        { id: 'explore', icon: 'fa-compass', label: 'nav-explore', userOnly: true, adminOnly: false },
        { id: 'library', icon: 'fa-music', label: 'nav-library', userOnly: true, adminOnly: false },
        { id: 'admin-music', icon: 'fa-compact-disc', label: 'Quản lý Nhạc', userOnly: false, adminOnly: true },
        { id: 'admin-categories', icon: 'fa-folder-tree', label: 'Quản lý Thể loại', userOnly: false, adminOnly: true },
        { id: 'admin-users', icon: 'fa-users', label: 'Quản lý User', userOnly: false, adminOnly: true },
    ];

    return (
        <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '1.2rem 1rem',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}>
                <button 
                    className="btn-sidebar-toggle" 
                    onClick={onToggleCollapse}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-main)',
                        fontSize: '1.4rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        transition: 'var(--transition)'
                    }}
                >
                    <i className="fa-solid fa-bars"></i>
                </button>
                
                {!isCollapsed && (
                    <div className="logo" onClick={() => { window.location.href = '/'; }} style={{ cursor: 'pointer', padding: 0 }}>
                        <i className="fa-solid fa-music"></i>
                        <span>Sonify</span>
                    </div>
                )}
            </div>
            
            <nav className="nav-menu">
                <ul>
                    {navItems.map(item => {
                        if (item.adminOnly && !isAdmin) return null;
                        return (
                            <motion.li 
                                key={item.id}
                                className={activeTab === item.id ? 'active' : ''}
                                onClick={() => {
                                    if (item.id === 'home') {
                                        window.location.href = '/';
                                    } else {
                                        onTabChange(item.id);
                                    }
                                }}
                                title={isCollapsed ? (item.label.startsWith('nav-') ? t(item.label) : item.label) : ''}
                                style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            >
                                <i className={`fa-solid ${item.icon}`}></i>
                                {!isCollapsed && <span>{item.label.startsWith('nav-') ? t(item.label) : item.label}</span>}
                            </motion.li>
                        );
                    })}
                </ul>
            </nav>

            {(!isAdmin && isAuthenticated && !isCollapsed) && (
                <div className="playlists">
                    <h3>{t('playlist-title')}</h3>
                    <ul>
                        <li 
                            className={activeTab === 'liked' ? 'active' : ''}
                            onClick={() => onTabChange('liked')}
                        >
                            <i className="fa-solid fa-heart"></i>
                            <span>{t('nav-liked')}</span>
                        </li>
                        {playlists.map(p => (
                            <li key={p.id} className="playlist-item-sidebar">
                                <div className="playlist-info-click" onClick={() => onTabChange(`playlist-${p.id}`)}>
                                    <i className="fa-solid fa-list-ul"></i>
                                    <span>{p.name}</span>
                                </div>
                                <button 
                                    className="btn-delete-playlist"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Bạn có chắc muốn xóa playlist "${p.name}"?`)) {
                                            deletePlaylist(p.id);
                                        }
                                    }}
                                >
                                    <i className="fa-solid fa-xmark"></i>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
