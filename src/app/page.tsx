'use client';

import ClientPage from '@/components/layout/ClientPage';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

const LocomotiveScrollProvider = dynamic(
  () => import('@/hooks/useLocomotiveScroll').then(mod => mod.LocomotiveScrollProvider),
  { ssr: false }
);

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const section = document.querySelector(hash) as HTMLElement | null;
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Delay to allow hydration and DOM readiness
    }
  }, []);

  return (
    <LocomotiveScrollProvider>
      <ClientPage />
    </LocomotiveScrollProvider>
  );
}
