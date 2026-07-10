'use client';

import React, { useState, useEffect } from 'react';

const RealTimeClock: React.FC = () => {
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('vi-VN', { hour12: false }));
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, []);

    return <div className="header-clock">{time}</div>;
};

export default RealTimeClock;
