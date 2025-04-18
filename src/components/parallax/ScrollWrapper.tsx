// Provides smooth scrolling and updates on window resize.

// Cleans up the scroll instance on unmount.

'use client';

import { useRef, useEffect, useState } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import { useLocomotiveScroll } from '@/hooks/useLocomotiveScroll';
import { isBrowser } from '@/utils/browser';
import 'locomotive-scroll/dist/locomotive-scroll.css';

interface ScrollWrapperProps {
  children: React.ReactNode;
}

export default function ScrollWrapper({ children }: ScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scroll, setScroll } = useLocomotiveScroll();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isBrowser()) return;
    
    // Wait for the component to be mounted and ready
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || !containerRef.current || scroll) return;

    let instance: LocomotiveScroll | null = null;

    try {
      instance = new LocomotiveScroll({
        el: containerRef.current,
        smooth: true,
        lerp: 0.075,
        multiplier: 0.5,
        class: 'is-inview',
        getDirection: true,
        reloadOnContextChange: true,
        touchMultiplier: 2,
        initPosition: { x: 0, y: 0 }
      });

      setScroll(instance);

      // Update scroll on window resize
      const handleResize = () => {
        instance?.update();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (instance) {
          instance.destroy();
          setScroll(null);
        }
      };
    } catch (error) {
      console.error('Failed to initialize LocomotiveScroll:', error);
      return () => {
        if (instance) {
          instance.destroy();
          setScroll(null);
        }
      };
    }
  }, [isReady, setScroll, scroll]);

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
