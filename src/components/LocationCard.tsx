"use client";
import { useTheme } from "next-themes";
import Image from "next/image";

type Props = {
  location: {
    id: string;
    title: string;
    image: string;
    rating: number;
    guideAvailable: boolean;
  };
};

export default function LocationCard({ location }: Props) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`w-64 rounded-xl shadow-lg overflow-hidden transition duration-300
      ${isDark ? "bg-white/10 text-white border border-gray-700" : "bg-white text-black border border-gray-200"}`}>
      <div className="relative h-40 w-full">
        <Image
          src={location.image}
          alt={location.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-bold truncate">{location.title}</h3>
        <p className="text-sm">Rating: {location.rating} ⭐</p>
        <p className="text-sm">
          Guide: {location.guideAvailable ? "✔️ Available" : "❌ Not Available"}
        </p>
      </div>
    </div>
  );
}
