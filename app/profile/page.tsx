'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Profile from '@/components/Profile';

export default function ProfilePage() {
  return (
    <motion.div
      key="profile-page"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <Profile />
    </motion.div>
  );
}
