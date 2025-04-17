// components/parallax/ParallaxWrapper.tsx
"use client";

import { useEffect, useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import {useLocomotiveScroll} from '@/hooks/useLocomotiveScroll';

interface ParallaxWrapperProps {
  children: React.ReactNode;
  variant?: 'hero' | 'page' | 'card';
  speed?: number;
}

const ParallaxWrapper = ({ children, variant = 'hero', speed = 1 }: ParallaxWrapperProps) => {
  const { scroll } = useLocomotiveScroll();
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const scale = useTransform(scrollYProgress, [0, 1], variant === 'hero' ? [1, 1.2 * speed] : [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 1], variant === 'hero' ? [1, 0] : [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [0, variant === 'hero' ? -100 : 100]);

  useEffect(() => {
    if (scroll && ref.current) {
      scroll.update();
    }
  }, [scroll]);

  return (
    <motion.div
      ref={ref}
      style={variant === 'hero' ? { scale, y } : {}}
      data-scroll-section
      data-scroll-speed={variant === 'card' ? speed : 0}
    >
      {variant !== 'hero' && (
        <motion.div style={{ opacity }}>
          {children}
        </motion.div>
      )}
      {variant === 'hero' && children}
      {variant === 'hero' && (
        <motion.div 
          style={{ opacity: scrollYProgress }}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />
      )}
    </motion.div>
  );
};

export default ParallaxWrapper;