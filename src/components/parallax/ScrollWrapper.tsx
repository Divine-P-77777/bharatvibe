// Provides smooth scrolling and updates on window resize.

// Cleans up the scroll instance on unmount.
"use client";

import { useRef, useEffect } from "react";
import { useLocomotiveScroll } from "@/hooks/useLocomotiveScroll";
import { isBrowser } from "@/utils/browser";
import "locomotive-scroll/dist/locomotive-scroll.css";

interface ScrollWrapperProps {
  children: React.ReactNode;
}

export default function ScrollWrapper({ children }: ScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scroll } = useLocomotiveScroll();

  useEffect(() => {
    if (!isBrowser() || !scroll || !containerRef.current) return;

    scroll.update();
  }, [scroll]);

  return (
    <div
      ref={containerRef}
      data-scroll-container
      className="relative min-h-screen w-full overflow-hidden"
    >
      {children}
    </div>
  );
}
