// components/ScrollTransitionCard.tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';

interface ScrollCardProps {
  children: React.ReactNode;
  section: 'locations' | 'culture' | 'food';
}

const ScrollTransitionCard = ({ children, section }: ScrollCardProps) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 1], 
    section === 'locations' ? [1, 0.8] : 
    section === 'culture' ? [0.8, 1] : 
    [1, 0.8]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], 
    section === 'locations' ? [1, 0.5, 0] : 
    section === 'culture' ? [0, 1, 0.5] : 
    [0.5, 1, 0]
  );

  const y = useTransform(scrollYProgress, [0, 1], 
    section === 'locations' ? [0, -100] : 
    section === 'culture' ? [100, 0] : 
    [0, 100]
  );

  return (
    <motion.div
      ref={ref}
      style={{ scale, opacity, y }}
      className={`p-6 rounded-2xl shadow-xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollTransitionCard;