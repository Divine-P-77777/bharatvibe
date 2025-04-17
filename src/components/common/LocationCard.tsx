"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/hooks";

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
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div
        className={`w-64 rounded-xl shadow-lg overflow-hidden transition duration-300
        ${isDarkMode
            ? "bg-white/10 text-white border border-gray-700"
            : "bg-white text-black border border-gray-200"
        }`}
      >
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
    </motion.div>
  );
}
