'use client';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import "./globals.css";  // Ensure the path is correct and the import is styled properly.
import { LocomotiveScrollProvider } from '@/hooks/useLocomotiveScroll';
import LocomotiveScroll from 'locomotive-scroll';

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector('[data-scroll-container]') as HTMLElement,
      smooth: true,
      smartphone: { smooth: true },
      tablet: { smooth: true }
    });

    return () => scroll.destroy();
  }, []);


  return (
    <html lang="en">
      <body data-scroll-container>
        <Provider store={store}>
       
          {children}
          
        </Provider>
      </body>
    </html>
  );
}
