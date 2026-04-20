'use client';

import React from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { useTheme } from '@/context/ThemeContext';

const Background: React.FC = () => {
    const { currentSong } = usePlayer();
    const { resolvedTheme } = useTheme();
    
    if (!currentSong) return null;

    const isLight = resolvedTheme === 'light';

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            backgroundImage: `url(${currentSong.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(100px) brightness(${isLight ? 1.05 : 0.4}) saturate(${isLight ? 1.2 : 0.8})`,
            opacity: isLight ? 0.35 : 0.55,
            transform: 'scale(1.2)',
            transition: 'background-image 1.2s ease-in-out, filter 0.8s ease, opacity 0.8s ease'
        }} />
    );
};

export default Background;
