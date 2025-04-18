'use client';

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "@/constants";
import Image from "next/image";
import { IndianRupee, MapPin } from "lucide-react";
import ScrollPrompt from "@/components/parallax/ScrollPrompt";
import { isBrowser } from "@/utils/browser";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"in" | "out">("in");
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isMobile = useIsMobile();

  const zoomVariants = {
    enter: {
      scale: 1.2,
      opacity: 0,
      filter: "blur(20px)"
    },
    center: {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.33, 1, 0.68, 1] }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      filter: "blur(20px)",
      transition: { duration: 0.8, ease: "easeIn" }
    }
  };

  useEffect(() => {
    if (!isBrowser()) return;
    timerRef.current = setInterval(() => {
      setDirection("out");
      setCurrent(prev => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goToSlide = (index: number) => {
    if (!isBrowser()) return;
    setDirection(index > current ? "in" : "out");
    setCurrent(index);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrent(prev => (prev + 1) % heroSlides.length);
      }, 8000);
    }
  };

  return (
    <div id="home" className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="relative w-full min-h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {heroSlides.map((slide, index) => (
            current === index && (
              <motion.div
                key={slide.id}
                variants={zoomVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                {/* Background Image with Zoom Layer */}
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10 }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </motion.div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                  <motion.div
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-3xl mb-8 font-light text-gray-200">
                      {slide.subtitle}
                    </p>
                  </motion.div>

                  {/* Cultural Elements */}
                  <div className="absolute bottom-24 flex gap-6">
                    <motion.div className="cultural-tag" initial={{ x: -50 }} animate={{ x: 0 }}>
                      <MapPin className="text-amber-400" />
                      <span>Discover Locations</span>
                    </motion.div>

                    <motion.div className="cultural-tag" initial={{ x: 50 }} animate={{ x: 0 }} transition={{ delay: 0.3 }}>
                      <IndianRupee className="text-emerald-400" />
                      <span>Earn Credits</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className={`
          z-30 absolute
          ${isMobile ? 'right-4 bottom-40 -translate-y-1/2 flex-col' : 'bottom-8 left-1/2 -translate-x-1/2 flex-row'}
          flex gap-3
        `}>
          {heroSlides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              className={`p-1 rounded-full cursor-pointer ${current === index ? 'bg-amber-400' : 'bg-white/30'}`}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="h-2 rounded-full bg-current"
                animate={{
                  width: current === index ? '32px' : '12px',
                  opacity: current === index ? 1 : 0.7,
                  height: isMobile ? (current === index ? '15px' : '10px') : '8px'
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Scroll Prompt - Show only on mobile */}
      {isMobile && <ScrollPrompt />}
    </div>
  );
};

export default HeroSlider;
