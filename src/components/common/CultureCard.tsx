"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

type Props = {
  culture: {
    id: string;
    title: string;
    image: string;
    rating: number;
    traditionRegion: string;
    significance: string;
  };
};

export default function CultureCard({ culture }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`w-64 min-w-[16rem] rounded-xl shadow-md overflow-hidden transition duration-300 ${
        isDark
          ? "bg-white/10 text-white border border-gray-700"
          : "bg-white text-black border border-gray-200"
      }`}
    >
      <div className="relative h-40 w-full">
        <Image
          src={culture.image}
          alt={culture.title}
          fill
          className="object-cover"
          unoptimized // You can remove this if using domains in next.config.js
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-bold truncate">{culture.title}</h3>
        <div className="flex justify-between text-sm">
          <span>⭐ {culture.rating}</span>
          <span>📍 {culture.traditionRegion}</span>
        </div>
        <p className="text-sm truncate">{culture.significance}</p>
      </div>
    </div>
  );
}
