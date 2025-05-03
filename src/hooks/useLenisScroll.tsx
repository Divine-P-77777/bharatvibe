'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import Lenis from '@studio-freight/lenis';
import { usePathname } from 'next/navigation';
import { isBrowser, safeQuerySelector, safeWindow } from '@/utils/browser';

interface LenisScrollContextType {
  scroll: Lenis | null;
  setScroll: (scroll: Lenis | null) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

interface LenisOptions {
  duration?: number;
  easing?: (t: number) => number;
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  direction?: 'vertical' | 'horizontal';
  gestureDirection?: 'both' | 'vertical' | 'horizontal';
  mouseMultiplier?: number;
  touchMultiplier?: number;
  normalizeWheel?: boolean;
  wrapper?: HTMLElement;
  content?: HTMLElement;
}

const LenisScrollContext = createContext<LenisScrollContextType>({
  scroll: null,
  setScroll: () => {},
  activeSection: 'home',
  setActiveSection: () => {},
});

export const useLenisScroll = () => useContext(LenisScrollContext);

export const LenisScrollProvider = ({ children }: { children: ReactNode }) => {
  const [scroll, setScroll] = useState<Lenis | null>(null);
  const [activeSection, setActiveSection] = useState<string>('home');
  const pathname = usePathname();
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isBrowser() || pathname !== '/') {
      scroll?.destroy();
      setScroll(null);
      setActiveSection('home');
      return;
    }

    const scrollContainer = safeQuerySelector('[data-scroll-container]') as HTMLElement;
    if (!scrollContainer) return;

    scroll?.destroy();

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: true,
      gestureDirection: 'vertical',
      touchMultiplier: 1.3,
    } as unknown as ConstructorParameters<typeof Lenis>[0]);
    
    

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };

    rafRef.current = requestAnimationFrame(raf);
    setScroll(lenis);

    const handleHash = () => {
      const hash = safeWindow?.location?.hash;
      if (hash) {
        const section = hash.substring(1);
        setActiveSection(section);
        lenis.scrollTo(hash, { offset: -50 });
      }
    };

    safeWindow.addEventListener('hashchange', handleHash);
    handleHash();

    return () => {
      cancelAnimationFrame(rafRef.current!);
      safeWindow.removeEventListener('hashchange', handleHash);
      lenis.destroy();
      setScroll(null);
    };
  }, [pathname]);

  useEffect(() => {
    if (!isBrowser() || !scroll) return;

    const updateScroll = () => scroll?.resize();
    safeWindow.addEventListener('resize', updateScroll);
    safeWindow.addEventListener('orientationchange', updateScroll);

    return () => {
      safeWindow.removeEventListener('resize', updateScroll);
      safeWindow.removeEventListener('orientationchange', updateScroll);
    };
  }, [scroll]);

  return (
    <LenisScrollContext.Provider
      value={{ scroll, setScroll, activeSection, setActiveSection }}
    >
      {children}
    </LenisScrollContext.Provider>
  );
};
