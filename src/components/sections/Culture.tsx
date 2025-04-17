// app/culture/page.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import SearchBar from "@/components/common/SearchBar";
import FilterDropdown from "@/components/common/FilterDropdown";
import CultureCard from "@/components/common/CultureCard";
import SectionCard from "@/components/parallax/SectionCard";
import { regions, dummyCulture } from "@/constants/index";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function CultureSection() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();

  return (
    <motion.section
      id="culture"
      className="relative min-h-screen py-20 z-20"
      style={{
        background: isDarkMode
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,1))'
          : 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(236,254,255,1))'
      }}
      data-scroll-section
    >
      <div className="container mx-auto px-4 pt-16">
        <SectionCard title="Explore Culture">
          <div className="flex flex-col items-center gap-4 mb-10"
               data-scroll
               data-scroll-speed="1">
            <SearchBar />
            <FilterDropdown items={regions} />
          </div>

          <div className="overflow-x-auto whitespace-nowrap mb-12 mt-8 pb-4">
  <div className="inline-flex gap-6 min-w-0">
    {dummyCulture.map((culture, index) => (
      <motion.div
        key={culture.id}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <CultureCard culture={culture} />
      </motion.div>
    ))}
  </div>
</div>


          <div className="flex justify-center"
               data-scroll
               data-scroll-speed="1">
            <button
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition hover:scale-105 backdrop-blur-md ${
                isDarkMode
                  ? "bg-white/10 text-white border-sky-300"
                  : "bg-black/10 text-black border-sky-500"
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Post your cultural experience & earn coins!</span>
            </button>
          </div>
        </SectionCard>
      </div>
    </motion.section>
  );
}