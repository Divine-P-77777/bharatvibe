'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { isBrowser } from "@/utils/browser";

interface SectionTransitionProps {
  children: React.ReactNode;
  index: number;
  title: string;
}

export default function SectionTransition({ children, index, title }: SectionTransitionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Motion transforms for smooth zoom and opacity transitions
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]); // Slight adjustment on Y-axis
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1.1, 1, 1, 0.9]); // Zoom-in on entry and zoom-out on scroll-out
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0.8, 0.5]); // Fade effect
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0, -2]); // Mild rotation
  const titleX = useTransform(scrollYProgress, [0, 0.5, 1], [-60, 0, 60]); // Slight title animation
  const titleOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.7, 0.8], [0, 1, 1, 0]);

  // Intersection observer for entrance animation
  useEffect(() => {
    if (!isBrowser()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasAnimated(true);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center justify-center perspective-1000 px-4" // Slightly less than min-h-screen
      data-scroll-section
    >
      <motion.div
        style={{ scale, opacity, rotateX, y }}
        className="w-full max-w-7xl relative flex items-center justify-center"
      >
        <motion.h2
          style={{ x: titleX, opacity: titleOpacity }}
          className="absolute -left-16 top-1/2 -translate-y-1/2 text-5xl font-bold text-white/10 rotate-90 origin-left whitespace-nowrap select-none"
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.7,
            delay: index * 0.15,
            ease: [0.25, 1, 0.5, 1]
          }}
          className="w-full"
          data-scroll
          data-scroll-speed={0.05 * (index + 1)}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
