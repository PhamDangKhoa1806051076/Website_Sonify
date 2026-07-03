'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    createdAt: string;
}

const AdminCategories: React.FC = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form inputs
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (err) {
            console.error('Lỗi khi tải thể loại:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Helper to generate slug from name
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // remove accent marks
            .replace(/[đĐ]/g, 'd')
            .replace(/([^0-9a-z-\s])/g, '') // remove special characters
            .replace(/\s+/g, '-') // replace spaces with hyphens
            .replace(/-+/g, '-') // remove duplicate hyphens
            .trim();
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        if (!editingCategory) {
            setSlug(generateSlug(val));
        }
    };

    const resetForm = () => {
        setName('');
        setSlug('');
        setDescription('');
        setErrorMsg('');
        setSuccessMsg('');
        setIsAdding(false);
        setEditingCategory(null);
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (!name.trim() || !slug.trim()) {
            setErrorMsg('Tên và Slug không được để trống.');
            return;
        }

        try {
            const isEdit = !!editingCategory;
            const url = isEdit ? `/api/categories/${editingCategory._id}` : '/api/categories';
            const method = isEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-username': user?.username || ''
                },
                body: JSON.stringify({ name, slug, description })
            });

            const data = await res.json();

            if (data.success) {
                setSuccessMsg(isEdit ? 'Đã cập nhật thể loại thành công!' : 'Đã thêm thể loại mới thành công!');
                setTimeout(() => {
                    resetForm();
                    fetchCategories();
                }, 1500);
            } else {
                setErrorMsg(data.error || 'Đã xảy ra lỗi.');
            }
        } catch (err) {
            setErrorMsg('Lỗi kết nối máy chủ.');
            console.error(err);
        }
    };

    const handleStartEdit = (cat: Category) => {
        setEditingCategory(cat);
        setName(cat.name);
        setSlug(cat.slug);
        setDescription(cat.description || '');
        setIsAdding(true);
        setErrorMsg('');
        setSuccessMsg('');
    };

    const handleDelete = async (cat: Category) => {
        if (confirm(`Bạn có chắc chắn muốn xóa thể loại "${cat.name}"?`)) {
            try {
                const res = await fetch(`/api/categories/${cat._id}`, {
                    method: 'DELETE',
                    headers: {
                        'x-username': user?.username || ''
                    }
                });
                const data = await res.json();
                if (data.success) {
                    alert('Đã xóa thể loại!');
                    fetchCategories();
                } else {
                    alert(data.error || 'Xóa thể loại thất bại.');
                }
            } catch (err) {
                alert('Lỗi hệ thống khi xóa.');
                console.error(err);
            }
        }
    };

    return (
        <div className="admin-main-content" style={{ marginTop: '2rem' }}>
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3>Danh sách Thể loại Nhạc</h3>
                <button
                    style={{
                        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 24px',
                        borderRadius: '50px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
                    }}
                    onClick={() => {
                        if (isAdding) resetForm();
                        else setIsAdding(true);
                    }}
                >
                    <i className={`fa-solid ${isAdding ? 'fa-xmark' : 'fa-plus'}`}></i> {isAdding ? 'Hủy bỏ' : 'Thêm Thể Loại Mới'}
                </button>
            </div>

            {isAdding && (
                <form
                    onSubmit={handleSaveCategory}
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '2rem',
                        borderRadius: '20px',
                        marginBottom: '2rem',
                        border: '1px solid var(--glass-border)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--primary-light)' }}>
                        {editingCategory ? `Cập nhật thể loại: ${editingCategory.name}` : 'Tạo Thể Loại Mới'}
                    </h4>

                    {errorMsg && (
                        <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '10px 15px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '8px' }}></i> {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div style={{ color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '10px 15px', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                            <i className="fa-solid fa-circle-check" style={{ marginRight: '8px' }}></i> {successMsg}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Tên Thể Loại</label>
                            <input
                                type="text"
                                placeholder="Nhạc Trẻ, Ballad..."
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }}
                                value={name}
                                onChange={handleNameChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Slug (Đường dẫn)</label>
                            <input
                                type="text"
                                placeholder="v-pop, ballad..."
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none' }}
                                value={slug}
                                onChange={e => setSlug(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mô tả ngắn</label>
                            <textarea
                                placeholder="Giai điệu Việt Nam trữ tình mới nhất..."
                                rows={3}
                                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: 'var(--text-main)', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', gap: '12px' }}>
                        <button
                            type="submit"
                            style={{
                                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '10px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                            }}
                        >
                            {editingCategory ? 'Cập Nhật' : 'Lưu Lại'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                border: '1px solid var(--glass-border)',
                                padding: '12px 30px',
                                borderRadius: '10px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                            }}
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            )}

            <div className="admin-table-container">
                <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                            <th style={{ padding: '14px 12px', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Tên thể loại</th>
                            <th style={{ padding: '14px 12px', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Slug</th>
                            <th style={{ padding: '14px 12px', textAlign: 'left', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Mô tả</th>
                            <th style={{ padding: '14px 12px', textAlign: 'center', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Ngày tạo</th>
                            <th style={{ padding: '14px 12px', textAlign: 'right', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> Đang tải dữ liệu thể loại...
                                </td>
                            </tr>
                        ) : categories.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    Chưa có thể loại nào được tạo.
                                </td>
                            </tr>
                        ) : (
                            categories.map(cat => (
                                <tr key={cat._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s' }} className="admin-table-row">
                                    <td style={{ padding: '16px 12px', fontWeight: 600 }}>{cat.name}</td>
                                    <td style={{ padding: '16px 12px', fontFamily: 'monospace', color: 'var(--primary-light)' }}>{cat.slug}</td>
                                    <td style={{ padding: '16px 12px', color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {cat.description || '—'}
                                    </td>
                                    <td style={{ padding: '16px 12px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {new Date(cat.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => handleStartEdit(cat)}
                                                style={{
                                                    background: 'rgba(99,102,241,0.1)',
                                                    color: 'var(--primary-light)',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary-color)'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = 'var(--primary-light)'; }}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i> Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat)}
                                                style={{
                                                    background: 'rgba(239,68,68,0.1)',
                                                    color: '#ef4444',
                                                    border: 'none',
                                                    padding: '8px 12px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = 'white'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                                            >
                                                <i className="fa-solid fa-trash"></i> Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategories;
