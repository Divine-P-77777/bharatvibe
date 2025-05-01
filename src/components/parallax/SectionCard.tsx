'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

export default function SectionCard({
  title,
  jump_to = '',
  postButtonText = 'Post Now',
  category,
  children,
}: {
  title: string;
  jump_to?: string;
  postButtonText?: string;
  category?: string;
  children: React.ReactNode;
}) {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const exploreLink = category ? `/posts?category=${category}` : jump_to || '/posts';

  return (
    <motion.div
      className={`relative rounded-3xl shadow-sm ${
        isDarkMode
          ? 'bg-gradient-to-r from-black-400 to-gray-900 shadow-orange-600 text-orange-500'
          : 'bg-gradient-to-r from-amber-400 to-rose-400 shadow-gray-600 text-white'
      } bg-opacity-90 backdrop-blur-xl p-8 shadow-2xl`}
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      viewport={{ once: false, amount: 0.3 }}
    >
      <h2 className="text-4xl text-center font-bold mb-8 sticky top-0 bg-inherit z-10 py-4">
        {title}
      </h2>

      <div className="space-y-8">{children}</div>

      <div className="flex justify-center mt-6" data-scroll data-scroll-speed="2">
        <Link
          href={exploreLink}
          className="px-5 py-2 bg-white text-black rounded-full hover:bg-opacity-90 transition-all hover:scale-125"
        >
          Explore More
        </Link>
      </div>

      <div className="flex justify-center mt-8" data-scroll data-scroll-speed="1">
        <button
          className={`flex items-center gap-2 px-5 py-3 rounded-full border transition hover:scale-105 backdrop-blur-md ${
            isDarkMode
              ? 'bg-white/10 text-white border-sky-300'
              : 'bg-white text-black border-orange-500'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span>{postButtonText}</span>
        </button>
      </div>
    </motion.div>
  );
}
