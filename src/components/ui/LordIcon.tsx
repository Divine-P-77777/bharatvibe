'use client';

import { useEffect, useRef } from 'react';
import type { AnimationItem } from 'lottie-web';

interface LordIconProps {
  src: string;
  trigger?: string;
  colors?: {
    primary?: string;
    secondary?: string;
  };
  size?: number;
  className?: string;
}

const LordIcon = ({
  src,
  trigger = 'hover',
  colors,
  size = 24,
  className
}: LordIconProps) => {
  const iconRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<AnimationItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      const lottie = await import('lottie-web');
      if (isMounted && iconRef.current) {
        animationRef.current = lottie.default.loadAnimation({
          container: iconRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: src,
        });
      }
    };

    loadAnimation();

    return () => {
      isMounted = false;
      animationRef.current?.destroy();
    };
  }, [src]);

  return (
    <div
      ref={iconRef}
      className={`lord-icon ${className || ''}`}
      data-trigger={trigger}
      data-colors-primary={colors?.primary}
      data-colors-secondary={colors?.secondary}
      style={{ width: size, height: size }}
    />
  );
};

export default LordIcon;
