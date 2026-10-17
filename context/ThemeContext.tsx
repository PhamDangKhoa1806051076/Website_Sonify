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
        // Use a small delay or Promise.resolve to avoid synchronous setState warning in some React versions/linters
        const hydrateTheme = () => {
            const savedTheme = localStorage.getItem('sonify_theme') as Theme;
            if (savedTheme) {
                setThemeState(savedTheme);
            } else {
                setThemeState('system');
            }
        };
        hydrateTheme();
    }, []);

    useEffect(() => {
        const updateTheme = () => {
            const root = window.document.documentElement;
            let actualTheme = theme;
            
            if (theme === 'system') {
                // Sử dụng prefers-color-scheme để theo dõi chế độ hệ thống OS
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                actualTheme = prefersDark ? 'dark' : 'light';
            }

            setResolvedTheme(actualTheme);
            root.setAttribute('data-theme', actualTheme);
            localStorage.setItem('sonify_theme', theme);
        };

        updateTheme();

        // Lắng nghe thay đổi chế độ hệ thống OS realtime
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') {
                updateTheme();
            }
        };
        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
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
