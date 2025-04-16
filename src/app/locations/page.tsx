"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import LocationCard from "@/components/LocationCard";
import { states, dummyLocations } from "@/constants";
import { Plus } from "lucide-react";

const fadeSlide = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function LocationsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <motion.div
      className={`min-h-screen px-4 md:px-16 pt-24 pb-12 transition-colors duration-500 ${
        isDark ? "bg-black text-gray-200" : "bg-white text-sky-700"
      }`}
      initial="hidden"
      animate="show"
      variants={fadeSlide}
    >
      <div className="flex flex-col items-center gap-4 mb-10">
        <SearchBar />
        <FilterDropdown items={states} />
      </div>

      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide mb-12">
        <div className="inline-flex gap-6">
          {dummyLocations.map((loc, index) => (
            <motion.div
              key={loc.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <LocationCard location={loc} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <button className="flex items-center gap-2 px-5 py-3 bg-opacity-10 backdrop-blur-md text-white dark:text-sky-400 rounded-full border border-sky-300 hover:scale-105 transition">
          <Plus className="w-5 h-5" />
          <span>It's your turn to post your favorite location & earn coins!</span>
        </button>
      </div>
    </motion.div>
  );
}