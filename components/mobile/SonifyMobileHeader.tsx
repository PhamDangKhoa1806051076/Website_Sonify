'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

interface SonifyMobileHeaderProps {
  onSearchClick?: () => void;
  onAuthClick?: () => void;
}

export const SonifyMobileHeader: React.FC<SonifyMobileHeaderProps> = ({
  onSearchClick,
  onAuthClick,
}) => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  return (
    <header className="mobile-header sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <Link href="/ban%20danh%20cho%20app%20moblie/app" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <i className="fa-solid fa-music text-white text-sm"></i>
        </div>
        <span className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-pink-400">
          Sonify Mobile
        </span>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Language Switch */}
        <button
          onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
          className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-all"
        >
          {language === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
        </button>

        {/* Auth / Profile */}
        {user ? (
          <Link
            href="/ban%20danh%20cho%20app%20moblie/app/account"
            className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center overflow-hidden"
          >
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-indigo-300">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </Link>
        ) : (
          <button
            onClick={onAuthClick}
            className="px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-xs font-bold text-white shadow-md hover:brightness-110 transition-all"
          >
            Đăng nhập
          </button>
        )}
      </div>
    </header>
  );
};

export default SonifyMobileHeader;
