"use client";

import { useAppSelector } from '@/store/hooks';

export default function SearchBar() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <input
      type="text"
      placeholder="Search for locations..."
      className={`w-full md:w-1/2 px-4 py-2 rounded-full backdrop-blur-md text-sm focus:outline-none border transition-all duration-300
        ${isDarkMode ? "bg-white/10 text-white placeholder-gray-300 border-orange-600" : "bg-black/5 text-white placeholder-white border-white"}`}
    />
  );
}
