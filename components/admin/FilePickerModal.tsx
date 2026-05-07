'use client';
import React from 'react';
import Image from 'next/image';

interface FilePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'sound' | 'img';
    localSounds: string[];
    localImages: string[];
    search: string;
    onSearchChange: (val: string) => void;
    onSelect: (file: string) => void;
}

const FilePickerModal: React.FC<FilePickerModalProps> = ({
    isOpen,
    onClose,
    type,
    localSounds,
    localImages,
    search,
    onSearchChange,
    onSelect
}) => {
    if (!isOpen) return null;

    const files = type === 'img' ? localImages : localSounds;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#1a1a2e', width: '100%', maxWidth: '700px', maxHeight: '80vh', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
                {/* Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>
                        <i className={`fa-solid ${type === 'img' ? 'fa-image' : 'fa-music'}`} style={{ marginRight: '12px', color: 'var(--primary-light)' }}></i>
                        Chọn {type === 'img' ? 'Ảnh bìa' : 'Bài hát'} từ thư mục
                    </h3>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                {/* Search */}
                <div style={{ padding: '15px 20px' }}>
                    <input 
                        type="text" 
                        placeholder="Tìm kiếm file..." 
                        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '12px', color: 'white' }}
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                    />
                </div>

                {/* List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: type === 'img' ? 'repeat(auto-fill, minmax(130px, 1fr))' : '1fr', gap: '12px' }}>
                        {files
                            .filter(file => file.toLowerCase().includes(search.toLowerCase()))
                            .map(file => (
                                <div 
                                    key={file} 
                                    onClick={() => onSelect(file)}
                                    style={{ 
                                        padding: '12px', 
                                        background: 'rgba(255,255,255,0.03)', 
                                        borderRadius: '12px', 
                                        cursor: 'pointer', 
                                        border: '1px solid transparent',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: type === 'img' ? 'column' : 'row',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                        e.currentTarget.style.borderColor = 'var(--primary-light)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                >
                                    {type === 'img' ? (
                                        <>
                                            <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', marginBottom: '8px' }}>
                                                <Image 
                                                    src={`/img/${file}`} 
                                                    alt="" 
                                                    fill 
                                                    unoptimized
                                                    style={{ borderRadius: '8px', objectFit: 'cover' }} 
                                                />
                                            </div>
                                            <span style={{ fontSize: '0.75rem', textAlign: 'center', wordBreak: 'break-all', opacity: 0.8 }}>{file}</span>
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-file-audio" style={{ fontSize: '1.2rem', color: 'var(--primary-light)' }}></i>
                                            <span style={{ fontSize: '0.9rem', flex: 1 }}>{file}</span>
                                        </>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '15px 20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--glass-border)' }}>
                    Tìm thấy { files.length } file trong thư mục
                </div>
            </div>
        </div>
    );
};

export default FilePickerModal;
