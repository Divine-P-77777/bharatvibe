'use client';

import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import { isBrowser } from '@/utils/browser';

interface ScrollWrapperProps {
  children: React.ReactNode;
}

const ScrollWrapper = ({ children }: ScrollWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBrowser()) return;
    if (!containerRef.current) return;

    const scroll = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      smartphone: {
        smooth: true,
        breakpoint: 768,
      },
      tablet: {
        smooth: true,
        breakpoint: 1024,
      },
    });

    return () => {
      scroll.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} data-scroll-container>
      {children}
    </div>
  );
};

export default ScrollWrapper;
