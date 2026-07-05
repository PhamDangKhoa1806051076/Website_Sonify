'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const { t } = useLanguage();
    
    const [view, setView] = useState<'login' | 'signup' | 'forgot-password'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [authKey, setAuthKey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [forgotStep, setForgotStep] = useState<1 | 2>(1);
    const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
    const [isCheckingRole, setIsCheckingRole] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const switchView = (newView: 'login' | 'signup' | 'forgot-password') => {
        setView(newView);
        setError('');
        setSuccessMsg('');
        setForgotStep(1);
        setUserRole(null);
        setAuthKey('');
        setNewPassword('');
        setShowPassword(false);
        setShowNewPassword(false);
    };

    if (!isOpen) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        const result = await login(username, password);
        if (result.success) {
            onClose();
        } else {
            setError(result.message || 'Sai tên đăng nhập hoặc mật khẩu!');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, name, phoneNumber })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg('Đăng ký thành công! Hãy đăng nhập.');
                setTimeout(() => switchView('login'), 2000);
            } else {
                setError(data.message || 'Đăng ký thất bại!');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Lỗi hệ thống');
        }
    };

    const handleCheckRole = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsCheckingRole(true);
        try {
            const res = await fetch('/api/auth/check-role', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            if (data.success) {
                setUserRole(data.role);
                setForgotStep(2);
            } else {
                setError(data.message || 'Không tìm thấy tài khoản này!');
            }
        } catch (err) {
            console.error('Role check error:', err);
            setError('Lỗi hệ thống');
        } finally {
            setIsCheckingRole(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, authKey, newPassword })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg('Đổi mật khẩu thành công! Hãy đăng nhập.');
                setTimeout(() => switchView('login'), 2000);
            } else {
                setError(data.message || 'Đổi mật khẩu thất bại!');
            }
        } catch (err) {
            console.error('Password reset error:', err);
            setError('Lỗi hệ thống');
        }
    };

    const viewTitles = {
        'login': t('header-login'),
        'signup': 'Tạo tài khoản',
        'forgot-password': 'Đổi mật khẩu'
    };

    const viewIcons = {
        'login': 'fa-right-to-bracket',
        'signup': 'fa-user-plus',
        'forgot-password': 'fa-key'
    };

    return (
        <motion.div
            className="auth-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <motion.div
                className="auth-card"
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Header */}
                <div className="auth-card-header">
                    <button className="auth-close-btn" onClick={onClose} aria-label="Đóng">
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '14px',
                            background: 'linear-gradient(135deg, var(--primary-color), #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
                            flexShrink: 0
                        }}>
                            <i className={`fa-solid ${viewIcons[view]}`} style={{ color: 'white', fontSize: '1.1rem' }}></i>
                        </div>
                        <div>
                            <h2 className="auth-header" style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
                                {viewTitles[view]}
                            </h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0', fontWeight: 500 }}>
                                {view === 'login' ? 'Chào mừng bạn trở lại' : view === 'signup' ? 'Tham gia Sonify ngay hôm nay' : 'Lấy lại quyền truy cập tài khoản'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="auth-card-body">
                    {/* Messages */}
                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
                            fontSize: '0.8375rem', color: '#f87171', fontWeight: 500
                        }}>
                            <i className="fa-solid fa-circle-exclamation" style={{ flexShrink: 0 }}></i>
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
                            borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
                            fontSize: '0.8375rem', color: '#4ade80', fontWeight: 500
                        }}>
                            <i className="fa-solid fa-circle-check" style={{ flexShrink: 0 }}></i>
                            {successMsg}
                        </div>
                    )}

                    {/* LOGIN */}
                    {view === 'login' && (
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
                            </div>
                            <div className="form-group password-group">
                                <input type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                                <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`} onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}></i>
                            </div>
                            <div className="auth-options">
                                <label className="custom-checkbox">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    Nhớ đăng nhập
                                </label>
                                <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); switchView('forgot-password'); }}>Quên mật khẩu?</a>
                            </div>
                            <button type="submit" className="btn-auth-submit">
                                <i className="fa-solid fa-right-to-bracket" style={{ marginRight: '8px' }}></i>
                                Đăng nhập
                            </button>
                            <p className="auth-switch">Chưa có tài khoản? <span onClick={() => switchView('signup')}>Đăng ký ngay</span></p>
                        </form>
                    )}

                    {/* SIGNUP */}
                    {view === 'signup' && (
                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <input type="text" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder="Tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} required autoComplete="username" />
                            </div>
                            <div className="form-group">
                                <input type="text" placeholder="Số điện thoại (dùng để khôi phục mật khẩu)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>
                            <div className="form-group password-group">
                                <input type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
                                <i className={`fa-regular ${showPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`} onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}></i>
                            </div>
                            <button type="submit" className="btn-auth-submit">
                                <i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i>
                                Tạo tài khoản
                            </button>
                            <p className="auth-switch">Đã có tài khoản? <span onClick={() => switchView('login')}>Đăng nhập</span></p>
                        </form>
                    )}

                    {/* FORGOT PASSWORD */}
                    {view === 'forgot-password' && (
                        <>
                            {forgotStep === 1 ? (
                                <form onSubmit={handleCheckRole}>
                                    <div className="form-group">
                                        <input type="text" placeholder="Nhập tên đăng nhập" value={username} onChange={(e) => setUsername(e.target.value)} required />
                                    </div>
                                    <button type="submit" className="btn-auth-submit" disabled={isCheckingRole}>
                                        {isCheckingRole ? (
                                            <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Đang kiểm tra...</>
                                        ) : (
                                            <><i className="fa-solid fa-arrow-right" style={{ marginRight: '8px' }}></i>Tiếp theo</>
                                        )}
                                    </button>
                                    <p className="auth-switch">Nhớ mật khẩu? <span onClick={() => switchView('login')}>Đăng nhập</span></p>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword}>
                                    <div className="form-group">
                                        <input type="text" value={username} readOnly style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type={userRole === 'admin' ? 'password' : 'text'}
                                            placeholder={userRole === 'admin' ? 'Mật khẩu xác nhận (Admin)' : 'Số điện thoại đã đăng ký'}
                                            value={authKey} onChange={(e) => setAuthKey(e.target.value)} required
                                        />
                                    </div>
                                    <div className="form-group password-group">
                                        <input type={showNewPassword ? 'text' : 'password'} placeholder="Mật khẩu mới" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoComplete="new-password" />
                                        <i className={`fa-regular ${showNewPassword ? 'fa-eye' : 'fa-eye-slash'} toggle-password`} onClick={() => setShowNewPassword(!showNewPassword)} style={{ cursor: 'pointer' }}></i>
                                    </div>
                                    <button type="submit" className="btn-auth-submit">
                                        <i className="fa-solid fa-key" style={{ marginRight: '8px' }}></i>
                                        Xác nhận đổi mật khẩu
                                    </button>
                                    <p className="auth-switch">
                                        <span onClick={() => { setForgotStep(1); setError(''); setAuthKey(''); setNewPassword(''); }}>
                                            <i className="fa-solid fa-arrow-left" style={{ marginRight: '6px', fontSize: '0.75rem' }}></i>
                                            Nhập lại tên đăng nhập
                                        </span>
                                    </p>
                                </form>
                            )}
                        </>
                    )}

                    {/* Demo credentials */}
                    <div className="demo-creds">
                        <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary-light)', flexShrink: 0 }}></i>
                        <span>Dùng thử: <strong>user</strong> / <strong>1234</strong></span>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AuthModal;
