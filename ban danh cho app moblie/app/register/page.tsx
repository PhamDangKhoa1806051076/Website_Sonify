'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function MobileRegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Đăng ký thất bại');
      }

      const loginRes = await login(username, password);
      if (loginRes.success) {
        router.push('/ban danh cho app moblie/app/account');
      } else {
        router.push('/ban danh cho app moblie/app/login');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4 max-w-sm mx-auto">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/30">
          <i className="fa-solid fa-user-plus text-white text-2xl"></i>
        </div>
        <h1 className="text-xl font-bold text-white">Tạo tài khoản mới</h1>
        <p className="text-xs text-zinc-400">Tham gia cộng đồng nghe nhạc Sonify ngay hôm nay</p>
      </div>

      {error && (
        <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">Tên tài khoản</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tên tài khoản..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">Mật khẩu</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 font-bold text-sm text-white shadow-lg shadow-indigo-500/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Tạo tài khoản'}
        </button>
      </form>

      <div className="text-center text-xs text-zinc-400">
        Đã có tài khoản?{' '}
        <Link href="/ban%20danh%20cho%20app%20moblie/app/login" className="text-indigo-400 font-bold hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
}
