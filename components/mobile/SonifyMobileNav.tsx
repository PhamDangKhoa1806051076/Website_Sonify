'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const SonifyMobileNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    {
      name: 'Trang chủ',
      href: '/ban danh cho app moblie/app',
      icon: 'fa-house',
      match: (path: string) => path === '/ban danh cho app moblie/app' || path === '/ban%20danh%20cho%20app%20moblie/app'
    },
    {
      name: 'BXH',
      href: '/ban danh cho app moblie/app/rankings',
      icon: 'fa-chart-simple',
      match: (path: string) => path.includes('/rankings')
    },
    {
      name: 'Tài khoản',
      href: '/ban danh cho app moblie/app/account',
      icon: 'fa-user',
      match: (path: string) => path.includes('/account') || path.includes('/login') || path.includes('/register')
    },
    ...(user?.role === 'admin' ? [{
      name: 'Admin',
      href: '/ban danh cho app moblie/app/admin',
      icon: 'fa-user-shield',
      match: (path: string) => path.includes('/admin')
    }] : [])
  ];

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-2xl border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const isActive = item.match(pathname || '');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'text-indigo-400 bg-indigo-500/10 font-bold scale-105'
                : 'text-zinc-400 hover:text-zinc-200 font-medium'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg mb-0.5 ${isActive ? 'text-indigo-400' : ''}`}></i>
            <span className="text-[11px] tracking-tight">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default SonifyMobileNav;
