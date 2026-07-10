'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// --- Icons ---
function AppLogo() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{
                width: '56px', height: '56px', borderRadius: '18px',
                background: 'linear-gradient(145deg, #8B6FBF 0%, #6C5CE7 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(108,92,231,0.4)'
            }}>
                <i className="fa-solid fa-music" style={{ color: 'white', fontSize: '1.4rem' }}></i>
            </div>
        </div>
    );
}

function StyledInput({ type = 'text', value, onChange, placeholder, label, readOnly, autoComplete }: {
    type?: string; value: string; onChange?: (v: string) => void;
    placeholder?: string; label?: string; readOnly?: boolean; autoComplete?: string;
}) {
    const baseStyle: React.CSSProperties = {
        width: '100%', borderRadius: '12px', padding: '12px 16px',
        color: 'white', fontSize: '0.875rem', outline: 'none',
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)', transition: 'all 0.2s',
        opacity: readOnly ? 0.5 : 1, cursor: readOnly ? 'not-allowed' : 'text',
        fontFamily: 'inherit',
    };
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', color: '#d1d5db', fontSize: '0.7rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>}
            <input
                type={type} value={value} readOnly={readOnly} autoComplete={autoComplete}
                onChange={e => onChange && onChange(e.target.value)}
                placeholder={placeholder}
                style={baseStyle}
                onFocus={e => { if (!readOnly) { e.currentTarget.style.border = '1px solid rgba(108,92,231,0.6)'; e.currentTarget.style.background = 'rgba(108,92,231,0.06)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12), inset 0 1px 3px rgba(0,0,0,0.3)'; }}}
                onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.background = readOnly ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.3)'; }}
            />
        </div>
    );
}

function PasswordInput({ value, onChange, label, placeholder, autoComplete }: {
    value: string; onChange: (v: string) => void; label?: string; placeholder?: string; autoComplete?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div style={{ marginBottom: '1rem' }}>
            {label && <label style={{ display: 'block', color: '#d1d5db', fontSize: '0.7rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</label>}
            <div style={{ position: 'relative' }}>
                <input
                    type={show ? 'text' : 'password'}
                    value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder || '••••••••'} autoComplete={autoComplete}
                    style={{ width: '100%', borderRadius: '12px', padding: '12px 44px 12px 16px', color: 'white', fontSize: '0.875rem', outline: 'none', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)', transition: 'all 0.2s', fontFamily: 'inherit' }}
                    onFocus={e => { e.currentTarget.style.border = '1px solid rgba(108,92,231,0.6)'; e.currentTarget.style.background = 'rgba(108,92,231,0.06)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(108,92,231,0.12), inset 0 1px 3px rgba(0,0,0,0.3)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.3)'; }}
                />
                <button type="button" onClick={() => setShow(s => !s)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                    <i className={`fa-regular ${show ? 'fa-eye' : 'fa-eye-slash'}`} style={{ fontSize: '0.9rem' }}></i>
                </button>
            </div>
        </div>
    );
}

function PrimaryButton({ children, onClick, type = 'button', disabled }: {
    children: React.ReactNode; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean;
}) {
    return (
        <button type={type} onClick={onClick} disabled={disabled}
            style={{ width: '100%', padding: '13px', borderRadius: '12px', color: 'white', fontWeight: 600, fontSize: '0.9rem', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', background: disabled ? 'rgba(108,92,231,0.4)' : 'linear-gradient(135deg, #8B6FBF 0%, #6C5CE7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s', fontFamily: 'inherit', letterSpacing: '-0.01em' }}
            onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = '0.88'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
        >
            {children}
        </button>
    );
}

function OutlineButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
    return (
        <button type="button" onClick={onClick}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: '#d1d5db', fontSize: '0.875rem', fontWeight: 500, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', marginBottom: '10px' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.14)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; }}
        >
            {children}
        </button>
    );
}

function Divider() {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1))' }} />
            <span style={{ color: '#6b7280', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>hoặc</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.1))' }} />
        </div>
    );
}

function AlertBox({ type, message }: { type: 'error' | 'success'; message: string }) {
    const isError = type === 'error';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: isError ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${isError ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`, borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem', fontSize: '0.8375rem', color: isError ? '#f87171' : '#4ade80', fontWeight: 500 }}>
            <i className={`fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'}`} style={{ flexShrink: 0 }}></i>
            {message}
        </div>
    );
}

// ============================================================
// VIEW: ENTRY — Nhập username + nút Google/Phone + link đăng ký
// ============================================================
function EntryView({ username, setUsername, onContinue, onSwitchToSignup, error }: {
    username: string; setUsername: (v: string) => void;
    onContinue: () => void; onSwitchToSignup: () => void; error: string;
}) {
    return (
        <motion.div key="entry" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
            <AppLogo />
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.75rem', lineHeight: 1.2, letterSpacing: '-0.03em', margin: '0 0 8px' }}>Chào mừng<br />đến với Sonify</h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Đăng nhập hoặc tạo tài khoản mới</p>
            </div>
            {error && <AlertBox type="error" message={error} />}
            <StyledInput value={username} onChange={setUsername} placeholder="Tên đăng nhập" label="Tên đăng nhập" autoComplete="username" />
            <div style={{ marginBottom: '4px' }}>
                <PrimaryButton onClick={onContinue}>
                    Tiếp tục <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                </PrimaryButton>
            </div>
            <Divider />
            <OutlineButton>
                <i className="fa-solid fa-mobile-screen" style={{ fontSize: '0.95rem', color: '#9ca3af', width: '18px', textAlign: 'center' }}></i>
                <span style={{ flex: 1, textAlign: 'left' }}>Tiếp tục bằng số điện thoại</span>
            </OutlineButton>
            <OutlineButton>
                <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span style={{ flex: 1, textAlign: 'left' }}>Tiếp tục bằng Google</span>
            </OutlineButton>

            <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.75rem', marginTop: '1.25rem' }}>
                Chưa có tài khoản?{' '}
                <span onClick={onSwitchToSignup} style={{ color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}>Đăng ký ngay</span>
            </p>
            <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '0.7rem', marginTop: '12px', lineHeight: 1.6 }}>
                Bằng cách tiếp tục, bạn đồng ý với{' '}
                <span style={{ color: 'rgba(167,139,250,0.7)', cursor: 'pointer' }}>Điều khoản</span> và{' '}
                <span style={{ color: 'rgba(167,139,250,0.7)', cursor: 'pointer' }}>Chính sách bảo mật</span>
            </p>
        </motion.div>
    );
}

// ============================================================
// VIEW: PASSWORD — Nhập mật khẩu để đăng nhập
// ============================================================
function PasswordView({ username, onBack, onLogin, onForgot, error, successMsg }: {
    username: string; onBack: () => void;
    onLogin: (password: string) => void;
    onForgot: () => void;
    error: string; successMsg: string;
}) {
    const [password, setPassword] = useState('');
    return (
        <motion.div key="password" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
            <button type="button" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem', padding: 0, fontFamily: 'inherit' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.8rem' }}></i>
                </span>
                Quay lại
            </button>
            <AppLogo />
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', margin: '0 0 12px' }}>Nhập mật khẩu</h1>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '50px', background: 'rgba(108,92,231,0.12)', border: '1px solid rgba(108,92,231,0.25)' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa', flexShrink: 0 }} />
                    <span style={{ color: '#c4b5fd', fontSize: '0.8rem', fontWeight: 500 }}>{username}</span>
                </div>
            </div>
            {error && <AlertBox type="error" message={error} />}
            {successMsg && <AlertBox type="success" message={successMsg} />}
            <form onSubmit={e => { e.preventDefault(); onLogin(password); }}>
                <PasswordInput value={password} onChange={setPassword} label="Mật khẩu" autoComplete="current-password" />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', marginTop: '-4px' }}>
                    <button type="button" onClick={onForgot} style={{ color: 'rgba(167,139,250,0.8)', fontSize: '0.8rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Quên mật khẩu?
                    </button>
                </div>
                <PrimaryButton type="submit">
                    Đăng nhập <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.8rem' }}></i>
                </PrimaryButton>
            </form>
        </motion.div>
    );
}

// ============================================================
// VIEW: SIGNUP — Đăng ký tài khoản mới
// ============================================================
function SignupView({ onBack, onRegister, error, successMsg }: {
    onBack: () => void;
    onRegister: (data: { name: string; username: string; phoneNumber: string; password: string }) => void;
    error: string; successMsg: string;
}) {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    return (
        <motion.div key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
            <button type="button" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem', padding: 0, fontFamily: 'inherit' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.8rem' }}></i>
                </span>
                Quay lại
            </button>
            <AppLogo />
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', margin: '0 0 6px' }}>Tạo tài khoản</h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Tham gia Sonify ngay hôm nay</p>
            </div>
            {error && <AlertBox type="error" message={error} />}
            {successMsg && <AlertBox type="success" message={successMsg} />}
            <form onSubmit={e => { e.preventDefault(); onRegister({ name, username, phoneNumber, password }); }}>
                <StyledInput value={name} onChange={setName} placeholder="Họ và tên" label="Họ và tên" />
                <StyledInput value={username} onChange={setUsername} placeholder="Tên đăng nhập" label="Tên đăng nhập" autoComplete="username" />
                <StyledInput value={phoneNumber} onChange={setPhoneNumber} placeholder="Số điện thoại (dùng để khôi phục mật khẩu)" label="Số điện thoại" />
                <PasswordInput value={password} onChange={setPassword} label="Mật khẩu" autoComplete="new-password" />
                <div style={{ marginTop: '4px' }}>
                    <PrimaryButton type="submit">
                        <i className="fa-solid fa-user-plus" style={{ fontSize: '0.85rem' }}></i>
                        Tạo tài khoản
                    </PrimaryButton>
                </div>
            </form>
        </motion.div>
    );
}

// ============================================================
// VIEW: FORGOT — Khôi phục mật khẩu (2 bước)
// ============================================================
function ForgotView({ onBack, onCheckRole, onResetPassword, forgotStep, setForgotStep, forgotUsername, userRole, isCheckingRole, error, successMsg }: {
    onBack: () => void;
    onCheckRole: (username: string) => void;
    onResetPassword: (authKey: string, newPassword: string) => void;
    forgotStep: 1 | 2; setForgotStep: (s: 1 | 2) => void;
    forgotUsername: string;
    userRole: 'admin' | 'user' | null; isCheckingRole: boolean;
    error: string; successMsg: string;
}) {
    const [username, setUsername] = useState('');
    const [authKey, setAuthKey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [method, setMethod] = useState<'phone' | 'email'>('phone');
    return (
        <motion.div key="forgot" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
            <button type="button" onClick={forgotStep === 2 ? () => { setForgotStep(1); } : onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.5rem', padding: 0, fontFamily: 'inherit' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <i className="fa-solid fa-arrow-left" style={{ fontSize: '0.8rem' }}></i>
                </span>
                Quay lại
            </button>
            <AppLogo />
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.75rem', letterSpacing: '-0.03em', margin: '0 0 6px' }}>Khôi phục</h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Lấy lại quyền truy cập tài khoản</p>
            </div>
            {error && <AlertBox type="error" message={error} />}
            {successMsg && <AlertBox type="success" message={successMsg} />}
            {forgotStep === 1 ? (
                <form onSubmit={e => { e.preventDefault(); onCheckRole(username); }}>
                    <StyledInput value={username} onChange={setUsername} placeholder="Nhập tên đăng nhập" label="Tên đăng nhập" />
                    <PrimaryButton type="submit" disabled={isCheckingRole}>
                        {isCheckingRole ? <><i className="fa-solid fa-spinner fa-spin"></i> Đang kiểm tra...</> : <>Tiếp theo <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.8rem' }}></i></>}
                    </PrimaryButton>
                </form>
            ) : (
                <form onSubmit={e => { e.preventDefault(); onResetPassword(authKey, newPassword); }}>
                    <StyledInput value={forgotUsername} placeholder="Tên đăng nhập" readOnly />
                    {userRole === 'user' && (
                        <div style={{ display: 'flex', borderRadius: '12px', padding: '4px', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            {(['phone', 'email'] as const).map(m => (
                                <button key={m} type="button" onClick={() => setMethod(m)}
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s', background: method === m ? 'linear-gradient(135deg, #8B6FBF 0%, #6C5CE7 100%)' : 'transparent', color: method === m ? 'white' : '#6b7280' }}>
                                    <i className={`fa-solid ${m === 'phone' ? 'fa-mobile-screen' : 'fa-envelope'}`} style={{ fontSize: '0.85rem' }}></i>
                                    {m === 'phone' ? 'Điện thoại' : 'Email'}
                                </button>
                            ))}
                        </div>
                    )}
                    <StyledInput value={authKey} onChange={setAuthKey}
                        placeholder={userRole === 'admin' ? 'Mật khẩu xác nhận (Admin)' : 'Số điện thoại đã đăng ký'}
                        label={userRole === 'admin' ? 'Xác nhận Admin' : 'Số điện thoại'} />
                    <PasswordInput value={newPassword} onChange={setNewPassword} label="Mật khẩu mới" placeholder="Nhập mật khẩu mới" autoComplete="new-password" />
                    <PrimaryButton type="submit">
                        <i className="fa-solid fa-key" style={{ fontSize: '0.85rem' }}></i>
                        Xác nhận đổi mật khẩu
                    </PrimaryButton>
                </form>
            )}
        </motion.div>
    );
}

// ============================================================
// MAIN MODAL — Kết hợp tất cả views + logic auth
// ============================================================
const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth();

    type View = 'entry' | 'password' | 'signup' | 'forgot';
    const [view, setView] = useState<View>('entry');
    const [entryUsername, setEntryUsername] = useState('');
    const [entryError, setEntryError] = useState('');

    // Login state
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');

    // Register state
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');

    // Forgot state
    const [forgotStep, setForgotStep] = useState<1 | 2>(1);
    const [forgotUsername, setForgotUsername] = useState('');
    const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
    const [isCheckingRole, setIsCheckingRole] = useState(false);
    const [forgotError, setForgotError] = useState('');
    const [forgotSuccess, setForgotSuccess] = useState('');

    const resetAll = () => {
        setEntryError(''); setLoginError(''); setLoginSuccess('');
        setRegisterError(''); setRegisterSuccess('');
        setForgotStep(1); setForgotUsername(''); setUserRole(null);
        setForgotError(''); setForgotSuccess(''); setIsCheckingRole(false);
    };

    const handleContinue = () => {
        if (!entryUsername.trim()) { setEntryError('Vui lòng nhập tên đăng nhập'); return; }
        setEntryError('');
        setView('password');
    };

    const handleLogin = async (password: string) => {
        setLoginError(''); setLoginSuccess('');
        const result = await login(entryUsername, password);
        if (result.success) { onClose(); resetAll(); setView('entry'); setEntryUsername(''); }
        else setLoginError(result.message || 'Sai tên đăng nhập hoặc mật khẩu!');
    };

    const handleRegister = async (data: { name: string; username: string; phoneNumber: string; password: string }) => {
        setRegisterError(''); setRegisterSuccess('');
        try {
            const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
            const resData = await res.json();
            if (resData.success) { setRegisterSuccess('Đăng ký thành công! Hãy đăng nhập.'); setTimeout(() => { setView('entry'); resetAll(); }, 2000); }
            else setRegisterError(resData.message || 'Đăng ký thất bại!');
        } catch { setRegisterError('Lỗi hệ thống'); }
    };

    const handleCheckRole = async (username: string) => {
        setForgotUsername(username); setForgotError(''); setIsCheckingRole(true);
        try {
            const res = await fetch('/api/auth/check-role', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username }) });
            const data = await res.json();
            if (data.success) { setUserRole(data.role); setForgotStep(2); }
            else setForgotError(data.message || 'Không tìm thấy tài khoản!');
        } catch { setForgotError('Lỗi hệ thống'); }
        finally { setIsCheckingRole(false); }
    };

    const handleResetPassword = async (authKey: string, newPassword: string) => {
        setForgotError(''); setForgotSuccess('');
        try {
            const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: forgotUsername, authKey, newPassword }) });
            const data = await res.json();
            if (data.success) { setForgotSuccess('Đổi mật khẩu thành công!'); setTimeout(() => { setView('entry'); resetAll(); }, 2000); }
            else setForgotError(data.message || 'Đổi mật khẩu thất bại!');
        } catch { setForgotError('Lỗi hệ thống'); }
    };

    if (!isOpen) return null;

    return (
        <motion.div
            style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target === e.currentTarget) { onClose(); resetAll(); } }}
        >
            <motion.div
                style={{ position: 'relative', width: '100%', maxWidth: '400px', borderRadius: '28px', padding: '2rem', background: 'linear-gradient(160deg, rgba(30,20,50,0.97) 0%, rgba(15,12,30,0.98) 100%)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)' }}
                initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Close button */}
                <button onClick={() => { onClose(); resetAll(); }} style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#9ca3af'; }}
                >
                    <i className="fa-solid fa-xmark"></i>
                </button>

                <AnimatePresence mode="wait">
                    {view === 'entry' && <EntryView username={entryUsername} setUsername={setEntryUsername} onContinue={handleContinue} onSwitchToSignup={() => { resetAll(); setView('signup'); }} error={entryError} />}
                    {view === 'password' && <PasswordView username={entryUsername} onBack={() => setView('entry')} onLogin={handleLogin} onForgot={() => { resetAll(); setView('forgot'); }} error={loginError} successMsg={loginSuccess} />}
                    {view === 'signup' && <SignupView onBack={() => { resetAll(); setView('entry'); }} onRegister={handleRegister} error={registerError} successMsg={registerSuccess} />}
                    {view === 'forgot' && <ForgotView onBack={() => { resetAll(); setView('entry'); }} onCheckRole={handleCheckRole} onResetPassword={handleResetPassword} forgotStep={forgotStep} setForgotStep={setForgotStep} forgotUsername={forgotUsername} userRole={userRole} isCheckingRole={isCheckingRole} error={forgotError} successMsg={forgotSuccess} />}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default AuthModal;
