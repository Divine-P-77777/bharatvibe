'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { blogs } from '@/constants/index';
import BlogCard from '../common/BlogCard';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function BlogSection() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  const showNavigation = blogs.length > 3;

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
      <div className="container mx-auto px-4 pt-10">
        <motion.div
          className={`relative rounded-3xl shadow-sm ${isDarkMode ? "bg-gradient-to-r from-black-400 to-gray-900 shadow-orange-600 text-orange-500" : "bg-gradient-to-r from-amber-400 to-rose-400 shadow-gray-600 text-white"} bg-opacity-90 backdrop-blur-xl p-8 shadow-2xl`}
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text ${!isDarkMode ? "bg-gradient-to-r from-gray-600 to-black" : "bg-gradient-to-r from-rose-300 to-orange-500"}`}>
            Explore Blog of Culture & Tradition of India
          </h2>

          <div className="relative overflow-hidden mb-12 mt-8 pb-12">
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={20}
              slidesPerView={1}
              navigation={showNavigation}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              className="!overflow-visible"
            >
              {blogs.map((blog) => (
                <SwiperSlide key={blog.id} className="flex min-w-0">
                  <BlogCard blog={blog} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="flex justify-center mt-4" data-scroll data-scroll-speed="2">
            <Link
              href="/blog"
              className="px-4 py-2 bg-white text-black rounded-full hover:bg-opacity-90 transition-all"
            >
              Explore
            </Link>
          </div>

          <div className="flex justify-center mt-10" data-scroll data-scroll-speed="1">
            <Link
              href="/blog-upload"
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition hover:scale-105 backdrop-blur-md ${
                isDarkMode
              ? 'bg-white/10 text-white border-sky-300'
              : 'bg-white text-black border-orange-500'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Post Blog Now</span>
            </Link>
          </div>
        </motion.div>
      </div>

    
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: ${isDarkMode ? 'orange' : 'white'};
          top: 50%;
          transform: translateY(-50%);
          width: 30px;
          height: 30px;
          margin-top: 0;
        }
        .swiper-button-next {
          right: -2px ;
          
        }
        .swiper-button-prev {
          left: -2px;
        }
        .swiper-pagination {
          bottom: -30px !important;
        }
        .swiper-pagination-bullet {
          background: ${isDarkMode ? 'orange' : 'white'};
          opacity: 1;
        }
      `}</style>
    </motion.section>
  );
}