'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Lắng nghe scroll trên .content div (không phải window vì layout dùng overflow)
        const contentEl = document.querySelector('.content');
        if (!contentEl) return;

        const handleScroll = () => {
            setVisible(contentEl.scrollTop > 120);
        };

        contentEl.addEventListener('scroll', handleScroll, { passive: true });
        return () => contentEl.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        const contentEl = document.querySelector('.content');
        if (contentEl) {
            contentEl.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    className="scroll-top-btn visible"
                    onClick={scrollToTop}
                    title="Lên đầu trang"
                    aria-label="Cuộn lên đầu trang"
                    initial={{ opacity: 0, y: 12, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.85 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fa-solid fa-chevron-up"></i>
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default ScrollToTop;
