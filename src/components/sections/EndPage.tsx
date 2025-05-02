'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import { useRef } from 'react';

export default function EndPage() {
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

    const imageScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
    const textTranslateY = useTransform(scrollYProgress, [0, 1], [100, 0]);

    return (
        <section
            ref={ref}
            className={`relative py-30 min-h-screen z-20 overflow-hidden ${isDarkMode
                ? 'bg-gradient-to-br from-black via-gray-900 to-gray-950'
                : 'bg-gradient-to-br from-white via-pink-50 to-yellow-50'
                }`}
            data-scroll-section
        >
            
            <div className="overflow-hidden py-4 border-y-2 border-dashed border-gray-400 dark:border-gray-600 mb-10">
                <motion.div
                    className="flex whitespace-nowrap text-[2.5rem] sm:text-[4rem] font-extrabold animate-slide-left"
                    initial={{ x: '100%' }}
                    animate={{ x: '-100%' }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: 'linear',
                    }}
                >
                    {[...Array(2)].flatMap((_, loopIndex) =>
                        ['Explore', 'Post', 'Earn Coin'].map((word, i) => (
                            <span
                                key={`${loopIndex}-${i}-${word}`}
                                className={`px-8 bg-gradient-to-r bg-clip-text text-transparent ${word === 'Explore'
                                        ? 'from-blue-500 to-purple-600'
                                        : word === 'Post'
                                            ? 'from-pink-500 to-red-500'
                                            : 'from-yellow-400 to-green-500'
                                    }`}
                            >
                                {word}
                            </span>
                        ))
                    )}
                </motion.div>
            </div>


          
            <div className="container mx-auto px-4 pb-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              
                <motion.div
                    style={{ scale: imageScale }}
                    className="w-full lg:w-1/2 sticky top-28"
                >
                    <motion.img
                        src="https://www.fomostore.in/cdn/shop/products/Brothers-Innovation-Stickers-Travels-Explore_the_Wild-Image-1.png?v=1738334595"
                        alt="Explore India"
                        className="rounded-3xl shadow-2xl object-cover w-full max-h-[400px]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    />
                </motion.div>

                
                <motion.div
                    style={{ y: textTranslateY }}
                    className={`w-full lg:w-1/2 p-8 rounded-3xl shadow-2xl backdrop-blur-md ${isDarkMode ? 'bg-white/5 text-white' : 'bg-white/70 text-gray-800'
                        }`}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 bg-clip-text text-transparent">
                        Explore. Post. Earn Coins.
                    </h2>

                    <p className="text-lg sm:text-xl mb-6">
                        Discover vibrant <strong>cultures</strong>, breathtaking <strong>locations</strong>, and delicious <strong>foods</strong> of India.
                        Want to contribute? Post your own blog — and earn coins for every action you take!
                    </p>

                    <ul className="space-y-4 text-base sm:text-lg">
                        <li>✅ Explore blogs on Indian traditions & places</li>
                        <li>✅ Share your own experiences with images</li>
                        <li>✅ Earn <span className="text-yellow-500 font-semibold">coins</span> with each blog</li>
                        <li>✅ Coins can be <span className="text-green-500 font-semibold">converted into real money</span></li>
                    </ul>

                    <div className="mt-8">
                        <button className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-6 py-3 rounded-full text-lg font-semibold hover:scale-105 transition">
                            Start Posting & Earning 🚀
                        </button>
                    </div>
                </motion.div>
            </div>

            
            <style jsx>{`
        @keyframes slide-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-slide-left {
          animation: slide-left 30s linear infinite;
        }
      `}</style>
        </section>
    );
}
