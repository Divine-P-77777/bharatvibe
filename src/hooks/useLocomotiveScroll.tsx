"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { usePathname, useRouter } from "next/navigation";
import { isBrowser, safeQuerySelector, safeWindow } from "@/utils/browser";

interface LocomotiveScrollContextType {
  scroll: LocomotiveScroll | null;
  setScroll: (scroll: LocomotiveScroll | null) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const LocomotiveScrollContext = createContext<LocomotiveScrollContextType>({
  scroll: null,
  setScroll: () => {},
  activeSection: "home",
  setActiveSection: () => {},
});

export const useLocomotiveScroll = () => useContext(LocomotiveScrollContext);

export const LocomotiveScrollProvider = ({ children }: { children: ReactNode }) => {
  const [scroll, setScroll] = useState<LocomotiveScroll | null>(null);
  const [activeSection, setActiveSection] = useState<string>("home");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isBrowser() || pathname !== "/") {
      scroll?.destroy();
      setScroll(null);
      setActiveSection("home");
      return;
    }

    const scrollContainer = safeQuerySelector('[data-scroll-container]') as HTMLElement;
    if (!scrollContainer) return;

    scroll?.destroy();

    const loco = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      lerp: 0.08,
      multiplier: 0.8,
      class: 'is-inview',
      scrollFromAnywhere: true,
    });

    const handleHash = () => {
      const hash = safeWindow?.location?.hash;
      if (hash) {
        const section = hash.substring(1);
        setActiveSection(section);
        loco.scrollTo(hash);
      }
    };

    loco.on("scroll", (obj) => {
      const elements = obj.currentElements;
      let foundSection = false;
      
      for (const key in elements) {
        if (elements[key].el?.dataset.scrollSection) {
          const newSection = elements[key].el.id || "home";
          setActiveSection(newSection);
          safeWindow?.history?.replaceState({}, "", `/#${newSection}`);
          foundSection = true;
          break;
        }
      }
      
      if (!foundSection && obj.scroll.y < 100) {
        setActiveSection("home");
        safeWindow?.history?.replaceState({}, "", "/");
      }
    });

    handleHash();
    safeWindow.addEventListener('hashchange', handleHash);
    
    setScroll(loco);

    return () => {
      loco.destroy();
      safeWindow.removeEventListener('hashchange', handleHash);
      setScroll(null);
    };
  }, [pathname]);

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
    <LocomotiveScrollContext.Provider value={{ scroll, setScroll, activeSection, setActiveSection }}>
      {children}
    </LocomotiveScrollContext.Provider>
  );
};