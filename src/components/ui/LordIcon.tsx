'use client';

import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (typeof window !== 'undefined' && window.lottie) {
      const setupIcon = async () => {
        if (iconRef.current) {
          await window.lottie.loadAnimation({
            container: iconRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: src
          });
        }
      };

      setupIcon();
    }
  }, [src]);

  return (
    <div
      ref={iconRef}
      className={`lord-icon ${className || ''}`}
      data-trigger={trigger}
      data-colors-primary={colors?.primary}
      data-colors-secondary={colors?.secondary}
      style={{
        width: size,
        height: size
      }}
    />
  );
};

export default LordIcon;