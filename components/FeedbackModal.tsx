'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [userEmail, setUserEmail] = useState('');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        setStatus('submitting');
        try {
            await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, message })
            });
            await fetch('https://formsubmit.co/ajax/khoakpham83@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    email: userEmail, message,
                    _subject: `Sonify - Phản hồi mới từ ${userEmail}`,
                    _template: 'table'
                })
            });
            setStatus('success');
            setMessage('');
            setTimeout(() => { onClose(); setStatus('idle'); }, 2500);
        } catch (error) {
            console.error('Feedback error:', error);
            setStatus('error');
        }
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '11px 16px',
        color: 'var(--text-main)',
        outline: 'none',
        fontSize: '0.875rem',
        fontWeight: 500,
        fontFamily: 'inherit',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
        letterSpacing: '-0.01em'
    };

    return (
        <div
            style={{
                position: 'fixed', inset: 0,
                background: 'rgba(2,6,23,0.8)',
                backdropFilter: 'blur(20px)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 10000,
                animation: 'fadeIn 0.25s ease',
                padding: '20px'
            }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div style={{
                background: 'var(--bg-sidebar)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '28px',
                width: '100%',
                maxWidth: '440px',
                overflow: 'hidden',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
                animation: 'dropIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid var(--glass-border)',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 100%)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '13px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 16px rgba(99,102,241,0.4)', flexShrink: 0
                        }}>
                            <i className="fa-solid fa-comment-dots" style={{ color: 'white', fontSize: '1rem' }}></i>
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
                                {t('settings-feedback')}
                            </h3>
                            <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                                Ý kiến của bạn giúp Sonify tốt hơn
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.08)', border: '1px solid var(--glass-border)',
                            color: 'var(--text-muted)', width: '32px', height: '32px',
                            borderRadius: '50%', cursor: 'pointer', fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'scale(1) rotate(0)'; }}
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '1.5rem 2rem' }}>
                    {status === 'success' ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: 'rgba(16,185,129,0.12)',
                                border: '1px solid rgba(16,185,129,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 1rem'
                            }}>
                                <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: '1.75rem' }}></i>
                            </div>
                            <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '6px', letterSpacing: '-0.02em' }}>Đã nhận góp ý!</p>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 500 }}>Cảm ơn bạn đã dành thời gian phản hồi.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                                <input
                                    type="email"
                                    placeholder="Email của bạn (để chúng tôi phản hồi)"
                                    value={userEmail}
                                    onChange={e => setUserEmail(e.target.value)}
                                    style={inputStyle}
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; e.target.style.background = 'rgba(99,102,241,0.05)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                                    required
                                />
                                <textarea
                                    placeholder="Nhập nhận xét hoặc góp ý của bạn..."
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    style={{
                                        ...inputStyle,
                                        minHeight: '140px',
                                        resize: 'none',
                                        lineHeight: '1.6'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'var(--primary-color)'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.12)'; e.target.style.background = 'rgba(99,102,241,0.05)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'var(--glass-border)'; e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(255,255,255,0.04)'; }}
                                    required
                                />
                            </div>

                            {status === 'error' && (
                                <div style={{
                                    display: 'flex', gap: '8px', alignItems: 'center',
                                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                                    borderRadius: '10px', padding: '10px 14px', marginBottom: '12px',
                                    fontSize: '0.8375rem', color: '#f87171', fontWeight: 500
                                }}>
                                    <i className="fa-solid fa-circle-exclamation"></i>
                                    Có lỗi xảy ra, vui lòng thử lại.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    background: 'linear-gradient(135deg, var(--primary-color) 0%, #7c3aed 100%)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontSize: '0.9rem',
                                    fontWeight: 600,
                                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                                    fontFamily: 'inherit',
                                    letterSpacing: '-0.01em',
                                    opacity: status === 'submitting' ? 0.7 : 1,
                                    boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                                onMouseEnter={e => { if (status !== 'submitting') { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.5)'; } }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)'; }}
                            >
                                {status === 'submitting' ? (
                                    <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i>Đang gửi...</>
                                ) : (
                                    <><i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i>Gửi góp ý</>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FeedbackModal;
