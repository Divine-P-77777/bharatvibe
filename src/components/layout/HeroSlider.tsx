'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { heroSlides } from "@/constants";
import Image from "next/image";
import { IndianRupee, MapPin } from "lucide-react";
import ScrollPrompt from "@/components/parallax/ScrollPrompt";
import { useScroll, useTransform, motion, useMotionValueEvent } from 'framer-motion';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    const resizeObserver = new ResizeObserver(check);
    resizeObserver.observe(document.body);
    return () => resizeObserver.unobserve(document.body);
  }, []);

  return isMobile;
};

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"in" | "out">("in");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const yTitle = useTransform(scrollY, [0, 300], [0, -40]);
  const ySubtitle = useTransform(scrollY, [0, 300], [0, -20]);

  const zoomVariants = {
    enter: { 
      scale: 1.2, 
      opacity: 0, 
      transition: { duration: 1.2, ease: [0.33, 1, 0.68, 1] } 
    },
    center: { 
      scale: 1, 
      opacity: 1, 
      transition: { duration: 1.2, ease: [0.33, 1, 0.68, 1] } 
    },
    exit: { 
      scale: 0.8, 
      opacity: 0, 
      transition: { duration: 0.8, ease: "easeIn" } 
    }
  };

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setDirection("out");
      setCurrent(prev => (prev + 1) % heroSlides.length);
    }, 8000);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setDirection(index > current ? "in" : "out");
    setCurrent(index);
    timerRef.current && clearInterval(timerRef.current);
    startTimer();
  }, [current, startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <div id="home" className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="relative w-full min-h-screen overflow-hidden bg-black">
        <AnimatePresence mode="wait" initial={false}>
          {heroSlides.map((slide, index) => current === index && (
            <motion.div
              key={slide.id}
              variants={zoomVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <motion.div
                ref={imageRef}
                className="absolute inset-0 overflow-hidden"
                style={{ y, scale: 1.05 }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 10 }}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                </motion.div>

                <div className="absolute inset-0 bg-black opacity-50 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20" />
              </motion.div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <motion.div
                  className="max-w-4xl mx-auto"
                  style={{ y: yTitle }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-400">
                    {slide.title}
                  </h1>
                </motion.div>
                
                <motion.div
                  style={{ y: ySubtitle }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="text-xl md:text-3xl mb-8 font-light text-gray-200">
                    {slide.subtitle}
                  </p>
                </motion.div>

                <div className="absolute bottom-24 flex sm:flex-row flex-col gap-6">
                  <motion.div 
                    className="cultural-tag" 
                    initial={{ x: -50 }} 
                    animate={{ x: 0 }}
                    transition={{ type: 'spring', stiffness: 50 }}
                  >
                    <MapPin className="text-amber-400" />
                    <span className="text-gray-200 text-sm sm:text-lg">Discover Locations</span>
                  </motion.div>

                  <motion.div 
                    className="cultural-tag" 
                    initial={{ x: 50 }} 
                    animate={{ x: 0 }} 
                    transition={{ type: 'spring', stiffness: 50, delay: 0.3 }}
                  >
                    <IndianRupee className="text-emerald-400" />
                    <span className="text-gray-200 text-sm sm:text-lg">Earn Credits</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
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

      {isMobile && <ScrollPrompt />}
    </div>
  );
};

export default HeroSlider;