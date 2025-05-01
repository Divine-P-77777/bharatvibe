'use client';

import { useEffect, useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useLocomotiveScroll } from '@/hooks/useLocomotiveScroll';

interface ParallaxWrapperProps {
  children: React.ReactNode;
  variant?: 'hero' | 'page' | 'card';
  speed?: number;
}

const ParallaxWrapper = ({
  children,
  variant = 'hero',
  speed = 1,
}: ParallaxWrapperProps) => {
  const { scroll } = useLocomotiveScroll();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    variant === 'hero' ? [1, 1.1 * speed] : [1, 0.95]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    variant === 'hero' ? [1, 0.2] : [0, 1]
  );
  const y = useTransform(scrollYProgress, [0, 1], [0, variant === 'hero' ? -50 : 50]);

  useEffect(() => {
    if (scroll && ref.current) {
      scroll.update();
    }
  }, [scroll]);

  const isHero = variant === 'hero';
  const isCard = variant === 'card';

  return (
    <motion.div
      ref={ref}
      data-scroll-section
      data-scroll-speed={isCard ? speed : undefined}
      style={isHero ? { scale, y } : undefined}
      className="relative will-change-transform"
    >
      {isHero ? (
        <>
          {children}
          <motion.div
            style={{ opacity: scrollYProgress }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl pointer-events-none"
          />
        </>
      ) : (
        <motion.div style={{ opacity }}>
          {children}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ParallaxWrapper;