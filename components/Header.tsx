'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import RealTimeClock from './RealTimeClock';

interface HeaderProps {
    setActiveTab: (tab: string) => void;
    onLoginClick: () => void;
    onFeedbackClick: () => void;
    onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setActiveTab, onLoginClick, onFeedbackClick, onSearch }) => {
    const { t, language, setLanguage } = useLanguage();
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [settingsView, setSettingsView] = useState<'main' | 'lang' | 'theme'>('main');
    const [greeting, setGreeting] = useState('');

    const userDropdownRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);

    // Compute greeting
    useEffect(() => {
        const h = new Date().getHours();
        const defaultName = language === 'vi' ? 'bạn' : 'there';
        let base: string;
        if (language === 'vi') {
            base = h < 12 ? 'Chào buổi sáng' : h < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
        } else {
            base = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGreeting(user ? `${base}, ${user.name}` : `${base}, ${defaultName}`);
    }, [language, user]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
                setIsUserDropdownOpen(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setIsSettingsOpen(false);
                setSettingsView('main');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsUserDropdownOpen(false);
        setActiveTab('home');
    };

    return (
        <header className="top-nav">
            <div className="search-bar">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input 
                    type="text" 
                    placeholder={t('search-placeholder')} 
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            <div className="header-actions">
                <div className="user-row-group">
                    <span id="greeting-text">{greeting}</span>
                    <RealTimeClock />

                    {user ? (
                        <div className="user-avatar-wrap" ref={userDropdownRef}>
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff&size=64`}
                                alt="Avatar"
                                onClick={() => setIsUserDropdownOpen(prev => !prev)}
                            />

                            {isUserDropdownOpen && (
                                <div className="user-dropdown">
                                    <button onClick={() => { setActiveTab('profile'); setIsUserDropdownOpen(false); }}>
                                        <i className="fa-solid fa-user"></i>
                                        <span>{t('nav-profile')}</span>
                                    </button>
                                    <button onClick={handleLogout} style={{ color: '#ef4444' }}>
                                        <i className="fa-solid fa-right-from-bracket"></i>
                                        <span>{t('nav-logout')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button className="btn-login-header" onClick={onLoginClick}>
                            {t('header-login')}
                        </button>
                    )}

                    {/* Settings Gear */}
                    <div
                        className="header-settings"
                        ref={settingsRef}
                        onClick={() => { setIsSettingsOpen(prev => !prev); setSettingsView('main'); }}
                    >
                        <i className="fa-solid fa-gear"></i>

                        {isSettingsOpen && (
                            <div className="settings-dropdown" onClick={e => e.stopPropagation()}>
                                {settingsView === 'main' && (
                                    <div className="settings-menu-main">
                                        <div className="settings-menu-item" onClick={() => setSettingsView('lang')}>
                                            <div className="item-left">
                                                <i className="fa-solid fa-language"></i>
                                                <span>{t('settings-lang')}</span>
                                            </div>
                                            <i className="fa-solid fa-chevron-right arrow-icon"></i>
                                        </div>
                                        <div className="settings-menu-item" onClick={() => setSettingsView('theme')}>
                                            <div className="item-left">
                                                <i className="fa-solid fa-circle-half-stroke"></i>
                                                <span>{t('settings-theme')}</span>
                                            </div>
                                            <i className="fa-solid fa-chevron-right arrow-icon"></i>
                                        </div>
                                        <div className="settings-menu-item" onClick={() => { onFeedbackClick(); setIsSettingsOpen(false); }}>
                                            <div className="item-left">
                                                <i className="fa-regular fa-comment-dots"></i>
                                                <span>{t('settings-feedback')}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {settingsView === 'lang' && (
                                    <div className="settings-menu-lang">
                                        <div className="submenu-header" onClick={() => setSettingsView('main')}>
                                            <i className="fa-solid fa-arrow-left"></i>
                                            <span>{t('settings-back')}</span>
                                        </div>
                                        <div className={`lang-option ${language === 'vi' ? 'active' : ''}`} onClick={() => { setLanguage('vi'); }}>
                                            🇻🇳 Tiếng Việt {language === 'vi' && <i className="fa-solid fa-check check-icon"></i>}
                                        </div>
                                        <div className={`lang-option ${language === 'en' ? 'active' : ''}`} onClick={() => { setLanguage('en'); }}>
                                            🇬🇧 English {language === 'en' && <i className="fa-solid fa-check check-icon"></i>}
                                        </div>
                                    </div>
                                )}

                                {settingsView === 'theme' && (
                                    <div className="settings-menu-lang">
                                        <div className="submenu-header" onClick={() => setSettingsView('main')}>
                                            <i className="fa-solid fa-arrow-left"></i>
                                            <span>{t('settings-back')}</span>
                                        </div>
                                        {(['dark', 'light', 'blue', 'system'] as const).map(t_opt => (
                                            <div
                                                key={t_opt}
                                                className={`lang-option ${theme === t_opt ? 'active' : ''}`}
                                                onClick={() => setTheme(t_opt)}
                                            >
                                                <span>
                                                    {t_opt === 'dark' ? `🌙 ${t('theme-dark')}` : 
                                                     t_opt === 'light' ? `☀️ ${t('theme-light')}` : 
                                                     t_opt === 'blue' ? `💧 ${t('theme-blue')}` : 
                                                     `⏰ ${t('theme-system')}`}
                                                </span>
                                                {theme === t_opt && <i className="fa-solid fa-check check-icon"></i>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
