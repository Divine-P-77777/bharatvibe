'use client';

import { useEffect } from 'react';
import { useLenisScroll } from '@/hooks/useLenisScroll';
import UserNav from '@/components/layout/UserNav';

export default function ClientLayout({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { scroll } = useLenisScroll();

  useEffect(() => {
    if (scroll) {
      scroll.resize(); 
    }
  }, [scroll]);

  return (
    <>
      <UserNav />
      <main data-scroll-container>
        {children}
        {footer && footer}
      </main>
    </>
  );
}
