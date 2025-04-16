"use client";
import { useTheme } from "next-themes";

type Props = {
  items: string[];
};

export default function FilterDropdown({ items }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <select
      className={`px-4 py-2 rounded-full text-sm focus:outline-none transition-all duration-300
        ${isDark ? "bg-white/10 text-white border border-gray-600" : "bg-black/5 text-black border border-gray-200"}`}
    >
      <option value="">All States</option>
      {items.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  );
}

