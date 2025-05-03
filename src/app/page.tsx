'use client';

import ClientPage from '@/components/layout/ClientPage';
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';

export default function Home() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    // Set dark/light class on body
    document.body.classList.remove('dark', 'light');
    document.body.classList.add(isDarkMode ? 'dark' : 'light');

    // Scroll to hash if present (handled better by Lenis in the provider)
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const section = document.querySelector(hash) as HTMLElement | null;
        if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Delay allows hydration and proper DOM
    }
  }, [isDarkMode]);

  return <ClientPage />;
}
