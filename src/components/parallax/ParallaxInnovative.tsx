'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useLocomotiveScroll } from '@/hooks/useLocomotiveScroll';

interface ParallaxInnovativeProps {
  imageUrl: string;
  heading: string;
  subheading?: string;
  isDarkMode?: boolean;
  children?: React.ReactNode;
}

export const ParallaxInnovative: React.FC<ParallaxInnovativeProps> = ({
  imageUrl,
  heading,
  subheading,
  children,
  isDarkMode = false,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  useLocomotiveScroll();

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      data-scroll-section
    >
   
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={heading}
          fill
          className="object-cover"
          loading="lazy"
          data-scroll
          data-scroll-speed="-3" 
        />
      </div>

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div
        ref={ref}
        className="relative z-10 text-center max-w-4xl px-6 py-16 text-white"
      >
        <motion.h2
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500"
          data-scroll
          data-scroll-speed="1.5"
        >
          {heading}
        </motion.h2>

        {subheading && (
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="mt-4 text-lg sm:text-xl"
            data-scroll
            data-scroll-speed="1"
          >
            {subheading}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className={`mt-10 mx-auto max-w-2xl p-6 rounded-2xl backdrop-blur-lg ${
            isDarkMode ? 'bg-black/40 text-white' : 'bg-white/80 text-black'
          }`}
          data-scroll
          data-scroll-speed="2"
        >
          <motion.div
            initial={{ y: 30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
