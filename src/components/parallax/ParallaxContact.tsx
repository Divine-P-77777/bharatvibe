'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { motion } from 'framer-motion';

const blobs = [
  {
    className: 'top-0 left-0 w-96 h-96',
    gradient: 'from-pink-400 to-purple-500',
    blur: 'blur-3xl',
  },
  {
    className: 'bottom-0 right-0 w-80 h-80',
    gradient: 'from-cyan-400 to-blue-500',
    blur: 'blur-2xl',
  },
  {
    className: 'top-1/2 left-1/3 w-72 h-72',
    gradient: 'from-yellow-400 to-orange-500',
    blur: 'blur-2xl',
  },
];

export default function ParallaxContact({ children }: { children: React.ReactNode }) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (containerRef.current) {
        containerRef.current.style.backgroundPositionY = `${scrollTop * 0.3}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-black via-zinc-900 to-gray-800'
          : 'bg-gradient-to-br from-white via-cyan-100 to-sky-200'
      }`}
    >
    
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute ${blob.className} rounded-full bg-gradient-to-r ${blob.gradient} opacity-30 ${blob.blur}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
