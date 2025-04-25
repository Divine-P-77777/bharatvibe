'use client';

import ClientPage from '@/components/layout/ClientPage';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

const LocomotiveScrollProvider = dynamic(
  () => import('@/hooks/useLocomotiveScroll').then(mod => mod.LocomotiveScrollProvider),
  { ssr: false }
);

export default function Home() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    // Set dark/light class on body
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(isDarkMode ? 'dark' : 'light');

    // Scroll to hash (if any)
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const section = document.querySelector(hash) as HTMLElement | null;
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Delay to allow hydration and DOM readiness
    }
  }, [isDarkMode]);

  return (
    <LocomotiveScrollProvider>
      
      <ClientPage />
    </LocomotiveScrollProvider>
  );
}
