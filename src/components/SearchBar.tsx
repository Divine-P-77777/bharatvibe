"use client";
import { useTheme } from "next-themes";

export default function SearchBar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <input
      type="text"
      placeholder="Search for locations..."
      className={`w-full md:w-1/2 px-4 py-2 rounded-full backdrop-blur-md text-sm focus:outline-none border transition-all duration-300
        ${isDark ? "bg-white/10 text-white placeholder-gray-300 border-gray-600" : "bg-black/5 text-black placeholder-gray-500 border-gray-200"}`}
    />
  );
}
