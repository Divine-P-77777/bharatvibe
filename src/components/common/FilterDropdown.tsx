"use client";
import { useAppSelector } from '@/store/hooks';

type Props = {
  items: string[];
};

export default function FilterDropdown({ items }: Props) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <select
      className={`px-4 py-2 rounded-full text-sm   focus:outline-none transition-all duration-300
        ${isDarkMode ? "bg-white/10 text-white border border-orange-600" : "bg-black/5 text-white  border border-gray-200"}`}
    >
      <option value="" className={`border rounded-full mt-10 ${isDarkMode?"hover:text-black hover:bg-amber-500 bg-black":"hover:text-white bg-white text-orange-400 "} `}>All States</option>
      {items.map((state) => (
        <option key={state} value={state} className={` border rounded-full ${isDarkMode?"bg-black text-white  hover:text-orange-500":"bg-gradient-to-b from-orange-400 to-rose-500 hover:text-black hover:bg-amber-500 text-orange-500"} `}>
          {state}
        </option>
      ))}
    </select>
  );
}

