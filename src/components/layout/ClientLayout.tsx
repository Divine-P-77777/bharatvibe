"use client";

import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { useLocomotiveScroll } from "@/hooks/useLocomotiveScroll";
import UserNav from "@/components/layout/UserNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { setScroll } = useLocomotiveScroll();

  useEffect(() => {
    const scroll = new LocomotiveScroll({
      el: document.querySelector("[data-scroll-container]") as HTMLElement,
      smooth: true,
      smartphone: { smooth: true },
      tablet: { smooth: true },
    });

    setScroll(scroll);

    return () => scroll.destroy();
  }, [setScroll]);

  return (
    <>
      <UserNav />
      <main data-scroll-container>{children}</main>
    </>
  );
}
