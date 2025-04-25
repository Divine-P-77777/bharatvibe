'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { blogs } from '@/constants/index';
import BlogCard from '../common/BlogCard';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BlogSection() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <motion.section
      id="blog"
      className="relative min-h-[900px] py-10 z-20"
      style={{
        background: isDarkMode
          ? 'linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(10,10,10,1))'
          : 'linear-gradient(to bottom, #ffffff, #e0f7fa)',
      }}
      data-scroll-section
    >
      <div className="container mx-auto px-4 pt-10 ">
        {/* Card Container */}
        <motion.div
          className="relative rounded-3xl border bg-opacity-90 backdrop-blur-xl p-8 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: false, amount: 0.3 }}
        >
          {/* Title */}
          <h2 className="text-4xl font-bold mb-8 sticky top-0 bg-inherit z-10 py-4">
            Explore Blog of Culture & Tradition of India
          </h2>

          {/* Swiper Carousel */}
          <div className="overflow-x-auto whitespace-nowrap mb-12 mt-8 pb-4">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {blogs.map((blog) => (
                <SwiperSlide key={blog.id}>
                  <BlogCard blog={blog} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Explore More Button */}
          <div className="flex justify-center mt-4">
            <Link
              href="/blog"
              className="px-4 py-2 bg-white text-black rounded-full hover:bg-opacity-90 transition-all"
            >
              Explore 
            </Link>
          </div>

          {/* Post Button */}
          <div
            className="flex justify-center mt-10"
            data-scroll
            data-scroll-speed="1"
          >
            <Link
              href="/blog-upload"
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition hover:scale-105 backdrop-blur-md ${
                isDarkMode
                  ? 'bg-white/10 text-white border-sky-300'
                  : 'bg-black/10 text-black border-sky-500'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Post Blog Now</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
