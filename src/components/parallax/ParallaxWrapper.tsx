// components/parallax/ParallaxWrapper.tsx
'use client';

import { ReactNode, useEffect, useMemo } from 'react';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import { isBrowser } from '@/utils/browser';
import clsx from 'clsx';

interface ParallaxWrapperProps {
  children: ReactNode;
  variant?: 'hero' | 'default';
}

const ParallaxWrapper = ({ children, variant = 'default' }: ParallaxWrapperProps) => {
  const { scroll } = useLenisScroll();

  // Update Lenis scroll instance on mount/update
  useEffect(() => {
    if (!isBrowser() || !scroll) return;
    scroll.resize?.(); // Call resize to re-calc layout
  }, [scroll]);

  const wrapperClass = useMemo(
    () =>
      clsx(
        'relative w-full',
        variant === 'hero' && 'min-h-screen flex items-center justify-center'
      )
      ,
    [variant]
  );

  return (
    <div data-scroll-section className={wrapperClass}>
      {children}
    </div>
  );
};

export default ParallaxWrapper;
