"use client";

import Image from "next/image";
import { useAppSelector } from "@/store/hooks";

type Props = {
  food: {
    id: string;
    title: string;
    image: string;
    rating: number;
    spiceLevel: number;
    cuisineType: string;
  };
};

export default function FoodCard({ food }: Props) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <div className={`w-64 rounded-xl shadow-lg overflow-hidden transition duration-300
      ${isDarkMode ? "bg-white/10 text-white border border-gray-700" : "bg-white text-black border border-gray-200"}`}>
      <div className="relative h-40 w-full">
        <Image
          src={food.image}
          alt={food.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="text-lg font-bold truncate">{food.title}</h3>
        <div className="flex justify-between">
          <p className="text-sm">⭐ {food.rating}</p>
          <p className="text-sm">🌶️ {food.spiceLevel}/5</p>
        </div>
        <p className="text-sm truncate">Cuisine: {food.cuisineType}</p>
      </div>
    </div>
  );
}
