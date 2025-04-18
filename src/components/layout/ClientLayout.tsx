"use client";

import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { useLocomotiveScroll } from "@/hooks/useLocomotiveScroll";
import UserNav from "@/components/layout/UserNav";
import { isBrowser, safeQuerySelector } from "@/utils/browser";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { setScroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!isBrowser()) return;

    const scrollContainer = safeQuerySelector("[data-scroll-container]") as HTMLElement;
    if (!scrollContainer) return;

    const scroll = new LocomotiveScroll({
      el: scrollContainer,
      smooth: true,
      lerp: 0.075,
      multiplier: 0.5,
      reloadOnContextChange: true,
      class: 'is-inview',
      scrollFromAnywhere: true,
      resetNativeScroll: true
    });

    setScroll(scroll);

    return () => {
      if (scroll) {
        scroll.destroy();
      }
    };
  }, [setScroll]);

  return (
    <>
      <UserNav />
      <main data-scroll-container>{children}</main>
    </>
  );
}
