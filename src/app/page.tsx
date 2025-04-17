// app/page.tsx
"use client";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LocomotiveScroll from "locomotive-scroll";
import HeroSlider from "@/components/layout/HeroSlider";
import LocationsSection from "@/components/sections/Locations";
import CultureSection from "@/components/sections/Culture";
import FoodSection from "@/components/sections/Food";
import ParallaxWrapper from "@/components/parallax/ParallaxWrapper";
import ClientLayout from "@/components/layout/ClientLayout";
import SectionWrapper from "@/components/parallax/SectionWrapper";

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    const locomotiveScroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      smartphone: { smooth: true },
      tablet: { smooth: true },
      multiplier: 0.8,
      inertia: 0.8,
    });

    return () => {
      locomotiveScroll.destroy();
    };
  }, []);

  return (
    <div ref={scrollRef} data-scroll-container>
        <ClientLayout>
      <AnimatePresence mode="wait">
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-black text-white"
        >
          {/* Hero Section */}
          <section 
            data-scroll-section 
            className="h-screen relative snap-start"
          >
            <ParallaxWrapper variant="hero">
              <HeroSlider />
            </ParallaxWrapper>
          </section>

          {/* Content Sections */}
          <LocationsSection />
          <CultureSection />
          <FoodSection />

          {/* Filmora-style Transition Effects */}
          <div data-scroll-section className="h-screen snap-start">
            <div className="container mx-auto h-full flex items-center justify-center">
              <motion.div
                data-scroll
                data-scroll-speed="1"
                className="text-center"
              >
                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                  Discover More Wonders
                </h2>
                <p className="text-xl md:text-2xl text-gray-400">
                  Scroll to continue your cultural journey
                </p>
              </motion.div>
            </div>
          </div>
        </motion.main>
      </AnimatePresence>
      </ClientLayout>
    </div>
  );
}