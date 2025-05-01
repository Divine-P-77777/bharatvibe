'use client';

import { useRef, useEffect } from 'react';
import { useLocomotiveScroll } from '@/hooks/useLocomotiveScroll';
import { isBrowser } from '@/utils/browser';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface ScrollWrapperProps {
  children: React.ReactNode;
}

export default function ScrollWrapper({ children }: ScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!isBrowser() || !containerRef.current) return;

    const scroll = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      lerp: 0.075,
      multiplier: 0.5,
      class: 'is-inview',
      scrollFromAnywhere: true,
      resetNativeScroll: true,
    });

    setScroll(scroll);

    const handleResize = () => scroll.update();
    window.addEventListener('resize', handleResize);
    requestAnimationFrame(() => scroll.update());

    return () => {
      scroll.destroy();
      setScroll(null);
      window.removeEventListener('resize', handleResize);
    };
  }, [setScroll]);

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="relative min-h-screen w-full"
    >
      {children}
    </div>
  );
}
