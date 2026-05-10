'use client';

import React from 'react';
import SongCard from './SongCard';
import { Song } from '@/data/constants';

interface SongGridProps {
    songs: Song[];
}

const SongGrid: React.FC<SongGridProps> = ({ songs }) => {
    return (
        <div className="song-grid">
            {songs.map(song => (
                <SongCard key={song.id} song={song} />
            ))}
        </div>
    );
};

export default React.memo(SongGrid);
