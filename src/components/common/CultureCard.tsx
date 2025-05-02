"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAppSelector } from "@/store/hooks";

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
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const router = useRouter();

  const handleDoubleClick = () => {
    router.push('/posts');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      onDoubleClick={handleDoubleClick}
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
            src={culture.image}
            alt={culture.title}
            fill
            className="object-cover pointer-events-none select-none"
            draggable={false}
            unoptimized
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
    </motion.div>
  );
}
