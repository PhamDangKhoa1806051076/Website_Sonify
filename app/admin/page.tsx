'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AdminPanel from '@/components/AdminPanel';

export default function AdminPage() {
  const searchParams = useSearchParams();
  const rawView = searchParams.get('view');
  const view = (['music', 'users', 'stats', 'categories'].includes(rawView || '')
    ? rawView
    : 'music') as 'music' | 'users' | 'stats' | 'categories';

  return (
    <motion.div
      key={`admin-page-${view}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <AdminPanel view={view} />
    </motion.div>
  );
}
