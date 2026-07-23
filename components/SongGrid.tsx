'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SongCard from './SongCard';
import { Song } from '@/data/constants';

interface SongGridProps {
    songs: Song[];
}

const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.045,
            delayChildren: 0.05
        }
    }
};

const itemVariants: any = {
    hidden: { opacity: 0, y: 18, scale: 0.97 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.38,
            ease: [0.16, 1, 0.3, 1]
        }
    }
};

const SongGrid: React.FC<SongGridProps> = ({ songs }) => {
    return (
        <motion.div
            className="song-grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            key={songs.map(s => s.id).join(',')}
        >
            {songs.map(song => (
                <motion.div key={song.id} variants={itemVariants}>
                    <SongCard song={song} />
                </motion.div>
            ))}
        </motion.div>
    );
};

export default React.memo(SongGrid);
