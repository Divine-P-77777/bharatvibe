// components/HeroSlider.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { heroSlides } from "@/constants";
import Image from "next/image";

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {heroSlides.map((slide, index) => (
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: index === current ? 1 : 0,
            scale: index === current ? 1 : 1.05,
          }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 w-full h-full ${
            index === current ? "z-10" : "z-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center text-white text-center px-6">
            <motion.h1
              className="text-5xl md:text-6xl font-extrabold mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {slide.title}
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-6"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {slide.subtitle}
            </motion.p>
            <motion.button
              className="px-6 py-3 bg-white text-black rounded-full font-semibold shadow-lg hover:scale-105 transition"
              whileTap={{ scale: 0.95 }}
            >
              Explore Now
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HeroSlider;
