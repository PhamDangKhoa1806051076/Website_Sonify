'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface User {
    username: string;
    name: string;
    role: 'admin' | 'user';
    likedSongs?: string[];
    playlists?: { id: string; name: string; songIds: (number | string)[] }[];
    deviceId?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const HEARTBEAT_INTERVAL = 60 * 1000; // 60 seconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const sendHeartbeat = async (currentUser: User) => {
        const deviceId = localStorage.getItem('sonify_deviceId');
        if (!deviceId || !currentUser?.username) return;
        try {
            await fetch('/api/auth/heartbeat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: currentUser.username, deviceId })
            });
        } catch { /* silent fail */ }
    };

    const startHeartbeat = (currentUser: User) => {
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        // Send immediately on login/page load
        sendHeartbeat(currentUser);
        heartbeatRef.current = setInterval(() => sendHeartbeat(currentUser), HEARTBEAT_INTERVAL);
    };

    const stopHeartbeat = () => {
        if (heartbeatRef.current) {
            clearInterval(heartbeatRef.current);
            heartbeatRef.current = null;
        }
    };

    // Restore session on page load and start heartbeat
    useEffect(() => {
        const savedSession = sessionStorage.getItem('sonify_session');
        if (savedSession) {
            const savedUser = JSON.parse(savedSession) as User;
            setUser(savedUser);
            startHeartbeat(savedUser);
        }
        // Cleanup on unmount
        return () => stopHeartbeat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
        try {
            const deviceId = localStorage.getItem('sonify_deviceId');
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, deviceId })
            });

            const data = await response.json();

            if (data.success) {
                const userData: User = data.user;
                setUser(userData);
                
                // Store device info for multi-session tracking
                if (data.user.deviceId) {
                    localStorage.setItem('sonify_deviceId', data.user.deviceId);
                }
                
                sessionStorage.setItem('sonify_session', JSON.stringify(userData));
                startHeartbeat(userData);
                return { success: true };
            }
            return { success: false, message: data.message || 'Sai tên đăng nhập hoặc mật khẩu!' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Lỗi kết nối máy chủ!' };
        }
    };

    const logout = () => {
        stopHeartbeat();
        setUser(null);
        sessionStorage.removeItem('sonify_session');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
