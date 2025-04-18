"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface CardTransitionProps {
  children: React.ReactNode;
  index: number;
}

export default function CardTransition({ children, index }: CardTransitionProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.3]
  );

  const y = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [100, 0, 0, -100]
  );

  const zIndex = 100 - index;

  return (
    <motion.div
      ref={cardRef}
      style={{
        scale,
        opacity,
        y,
        zIndex,
        position: "relative",
      }}
      data-scroll
      data-scroll-speed={0.1 * (index + 1)}
      className="w-full min-h-screen flex items-center justify-center perspective-1000"
    >
      <div className="w-full max-w-7xl mx-auto px-4 transform-style-3d">
        {children}
      </div>
    </motion.div>
  );
} 