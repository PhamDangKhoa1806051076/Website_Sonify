'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface QuickMix {
    id: string;
    emoji: string;
    label: string;
    gradient: string;
    filter: string;
    glow: string;
}

const quickMixes: QuickMix[] = [
    { id: 'chill', emoji: '☕', label: 'Chill', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', filter: 'chill', glow: 'rgba(102,126,234,0.5)' },
    { id: 'energy', emoji: '⚡', label: 'Energy', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', filter: 'energy', glow: 'rgba(245,87,108,0.5)' },
    { id: 'focus', emoji: '🎯', label: 'Focus', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', filter: 'focus', glow: 'rgba(79,172,254,0.5)' },
    { id: 'sleep', emoji: '🌙', label: 'Sleep', gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', filter: 'sleep', glow: 'rgba(161,140,209,0.5)' },
    { id: 'workout', emoji: '🏋️', label: 'Workout', gradient: 'linear-gradient(135deg, #fa709a, #fee140)', filter: 'workout', glow: 'rgba(250,112,154,0.5)' },
    { id: 'vibe', emoji: '🎧', label: 'Vibe', gradient: 'linear-gradient(135deg, #a8edea, #fed6e3)', filter: 'vibe', glow: 'rgba(168,237,234,0.5)' },
];

const MobileGreeting: React.FC = () => {
    const [greeting, setGreeting] = useState('');
    const [greetingEmoji, setGreetingEmoji] = useState('');
    const [activeMix, setActiveMix] = useState<string | null>(null);

    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) {
                setGreeting('Chào buổi sáng');
                setGreetingEmoji('☀️');
            } else if (hour >= 12 && hour < 18) {
                setGreeting('Buổi chiều vui vẻ');
                setGreetingEmoji('🌤️');
            } else if (hour >= 18 && hour < 22) {
                setGreeting('Chào buổi tối');
                setGreetingEmoji('🌙');
            } else {
                setGreeting('Đêm khuya rồi');
                setGreetingEmoji('✨');
            }
        };
        updateGreeting();
        const timer = setInterval(updateGreeting, 60000);
        return () => clearInterval(timer);
    }, []);

    const handleMixTap = (mix: QuickMix) => {
        if (activeMix === mix.id) {
            setActiveMix(null);
            // Dispatch reset event
            window.dispatchEvent(new CustomEvent('quick-mix-filter', { detail: null }));
        } else {
            setActiveMix(mix.id);
            window.dispatchEvent(new CustomEvent('quick-mix-filter', { detail: mix.filter }));
        }
    };

    return (
        <div className="mobile-greeting-section">
            {/* Greeting */}
            <motion.div
                className="mobile-greeting-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                <span className="mobile-greeting-emoji">{greetingEmoji}</span>
                <h2 className="mobile-greeting-title">{greeting}</h2>
                <p className="mobile-greeting-sub">Hôm nay bạn muốn nghe gì?</p>
            </motion.div>

            {/* Quick Mix Cards */}
            <div className="quick-mix-scroll-wrapper">
                <div className="quick-mix-fade-left" />
                <div className="quick-mix-container">
                    {quickMixes.map((mix, i) => (
                        <motion.button
                            key={mix.id}
                            className={`quick-mix-card ${activeMix === mix.id ? 'active' : ''}`}
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: i * 0.06, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            whileTap={{ scale: 0.92 }}
                            onClick={() => handleMixTap(mix)}
                            style={{
                                background: activeMix === mix.id ? mix.gradient : 'rgba(255,255,255,0.06)',
                                boxShadow: activeMix === mix.id ? `0 6px 20px ${mix.glow}` : 'none',
                            }}
                        >
                            <span className="quick-mix-emoji">{mix.emoji}</span>
                            <span className="quick-mix-label">{mix.label}</span>
                        </motion.button>
                    ))}
                </div>
                <div className="quick-mix-fade-right" />
            </div>
        </div>
    );
};

export default MobileGreeting;
