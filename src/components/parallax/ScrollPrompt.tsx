'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ScrollPrompt() {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      role="presentation"
      data-lenis-prevent
    >
      <span className="text-sm select-none">Scroll to Explore</span>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        aria-hidden="true"
      >
        <ChevronDown className="w-6 h-6 text-inherit" />
      </motion.div>
    </motion.div>
  );
}
