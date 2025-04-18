'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { isBrowser } from '@/utils/browser';

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  if (!isBrowser()) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6, ease: 'anticipate' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;