'use client';

import React from 'react';
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
        { id: 'explore', icon: 'fa-compass', label: 'nav-explore', userOnly: true, adminOnly: false },
        { id: 'library', icon: 'fa-music', label: 'nav-library', userOnly: true, adminOnly: false },
        { id: 'admin-manage', icon: 'fa-chart-pie', label: 'Bảng điều khiển Admin', userOnly: false, adminOnly: true },
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
                    <div className="logo" onClick={() => window.location.reload()} style={{ cursor: 'pointer', padding: 0 }}>
                        <i className="fa-solid fa-music"></i>
                        <span>Sonify</span>
                    </div>
                )}
            </div>
            
            <nav className="nav-menu">
                <ul>
                    {navItems.map(item => {
                        if (item.adminOnly && !isAdmin) return null;
                        
                        // Insert the chart section right after "recent"
                        const isAfterRecent = item.id === 'explore';
                        
                        return (
                            <React.Fragment key={item.id}>
                                {isAfterRecent && (!isAdmin && isAuthenticated && !isCollapsed) && (
                                    <div className="sidebar-section">
                                        <h3 style={{
                                            fontSize: '0.75rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            color: 'var(--text-muted)',
                                            margin: '1.5rem 1rem 0.5rem',
                                            fontWeight: '600'
                                        }}>Bảng xếp hạng</h3>
                                        <ul>
                                            <li className={activeTab === 'chart-trending' ? 'active' : ''} onClick={() => onTabChange('chart-trending')}>
                                                <i className="fa-solid fa-fire"></i>
                                                <span>Bài hát thịnh hành</span>
                                            </li>
                                            <li className={activeTab === 'chart-global' ? 'active' : ''} onClick={() => onTabChange('chart-global')}>
                                                <i className="fa-solid fa-earth-americas" style={{color: '#f3727f'}}></i>
                                                <span style={{color: '#f3727f'}}>Top toàn cầu</span>
                                            </li>
                                            <li className={activeTab === 'chart-vn' ? 'active' : ''} onClick={() => onTabChange('chart-vn')}>
                                                <i className="fa-solid fa-star" style={{color: '#ffa42b'}}></i>
                                                <span style={{color: '#ffa42b'}}>Top Việt Nam</span>
                                            </li>
                                            <li className={activeTab === 'chart-most-listened' ? 'active' : ''} onClick={() => onTabChange('chart-most-listened')}>
                                                <i className="fa-solid fa-headphones" style={{color: '#539df5'}}></i>
                                                <span style={{color: '#539df5'}}>Nghe nhiều nhất</span>
                                            </li>
                                        </ul>
                                        {/* Divider after chart section */}
                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem' }} />
                                    </div>
                                )}
                                <li 
                                    className={activeTab === item.id ? 'active' : ''}
                                    onClick={() => onTabChange(item.id)}
                                    title={isCollapsed ? (item.label.startsWith('nav-') ? t(item.label) : item.label) : ''}
                                    style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}
                                >
                                    <i className={`fa-solid ${item.icon}`}></i>
                                    {!isCollapsed && <span>{item.label.startsWith('nav-') ? t(item.label) : item.label}</span>}
                                </li>
                            </React.Fragment>
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
