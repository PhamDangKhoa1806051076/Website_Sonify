'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminPanel from '@/components/AdminPanel';

export default function MobileAdminPage() {
  const { user } = useAuth();
  const [adminView, setAdminView] = useState<'music' | 'users' | 'categories' | 'stats'>('music');

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12 space-y-3">
        <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 text-xl">
          <i className="fa-solid fa-lock"></i>
        </div>
        <h2 className="text-base font-bold text-white">Quyền truy cập bị từ chối</h2>
        <p className="text-xs text-zinc-400">Trang này chỉ dành cho quản trị viên hệ thống (Admin).</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <i className="fa-solid fa-user-shield text-indigo-400"></i> Quản Trị Hệ Thống
        </h1>
      </div>

      {/* Sub tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-white/5 border border-white/10 rounded-2xl">
        <button
          onClick={() => setAdminView('music')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            adminView === 'music' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Bài hát
        </button>
        <button
          onClick={() => setAdminView('users')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            adminView === 'users' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          User
        </button>
        <button
          onClick={() => setAdminView('categories')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            adminView === 'categories' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Thể loại
        </button>
        <button
          onClick={() => setAdminView('stats')}
          className={`py-2 rounded-xl text-xs font-bold transition-all ${
            adminView === 'stats' ? 'bg-indigo-600 text-white shadow' : 'text-zinc-400 hover:text-white'
          }`}
        >
          Thống kê
        </button>
      </div>

      <div className="mobile-admin-wrapper bg-white/5 border border-white/10 rounded-3xl p-3">
        <AdminPanel view={adminView} />
      </div>
    </div>
  );
}
