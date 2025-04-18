// Locomotive Scroll Context to share scroll instance globally in your Next.js + TypeScript app
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { usePathname } from "next/navigation";
import { isBrowser, safeQuerySelector, safeWindow } from "@/utils/browser";

interface LocomotiveScrollContextType {
  scroll: LocomotiveScroll | null;
  setScroll: (scroll: LocomotiveScroll | null) => void;
}

const LocomotiveScrollContext = createContext<LocomotiveScrollContextType>({
  scroll: null,
  setScroll: () => {},
});

export const useLocomotiveScroll = () => useContext(LocomotiveScrollContext);

export const LocomotiveScrollProvider = ({ children }: { children: ReactNode }) => {
  const [scroll, setScroll] = useState<LocomotiveScroll | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!isBrowser()) return;

    const scrollContainer = safeQuerySelector('[data-scroll-container]') as HTMLElement;
    if (!scrollContainer) return;

    // Destroy previous scroll if exists
    scroll?.destroy();

    // Initialize LocomotiveScroll
    const loco = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      lerp: 0.08, // smoother easing
      multiplier: 0.8, // more natural speed
      class: 'is-inview',
      scrollFromAnywhere: true,
    });

    setScroll(loco);

    return () => {
      loco.destroy();
    };
  }, [pathname]); // reinitialize on route change

  useEffect(() => {
    if (!isBrowser() || !scroll) return;

    const updateScroll = () => scroll.update();
    safeWindow.addEventListener("resize", updateScroll);
    safeWindow.addEventListener("orientationchange", updateScroll);

    return () => {
      safeWindow.removeEventListener("resize", updateScroll);
      safeWindow.removeEventListener("orientationchange", updateScroll);
    };
  }, [scroll]);

  return (
    <LocomotiveScrollContext.Provider value={{ scroll, setScroll }}>
      {children}
    </LocomotiveScrollContext.Provider>
  );
};
