'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system' | 'blue';

interface ThemeContextType {
    theme: Theme;
    resolvedTheme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark'); 
    const [resolvedTheme, setResolvedTheme] = useState<Theme>('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('sonify_theme') as Theme;
        if (savedTheme) {
            setThemeState(savedTheme);
        } else {
            setThemeState('system');
        }
    }, []);

    useEffect(() => {
        const updateTheme = () => {
            const root = window.document.documentElement;
            let actualTheme = theme;
            
            if (theme === 'system') {
                const hour = new Date().getHours();
                // 6:00 AM đến 5:59 PM là ban ngày (light), còn lại là ban đêm (dark)
                const isDayTime = hour >= 6 && hour < 18;
                actualTheme = isDayTime ? 'light' : 'dark';
            }

            setResolvedTheme(actualTheme);
            root.setAttribute('data-theme', actualTheme);
            localStorage.setItem('sonify_theme', theme);
        };

        updateTheme();

        let intervalId: NodeJS.Timeout;
        if (theme === 'system') {
            // Kiểm tra mỗi phút để cập nhật giao diện nếu chuyển giao giữa ngày và đêm
            intervalId = setInterval(updateTheme, 60000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [theme]);

    const setTheme = (t: Theme) => {
        setThemeState(t);
    };

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
