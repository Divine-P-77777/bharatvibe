'use client';

import { useAppSelector } from '@/store/hooks';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Footer = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <footer
      className={`w-full  px-6 py-10  transition-colors duration-500 ${
        isDarkMode ? 'bg-black text-white' : 'bg-white text-black'
      }`}
    >
      <div className="max-w-7xl  mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            <span className="text-gradient">Incredible India</span>
          </h2>
          <p className="text-sm text-gray-400">
            Explore hidden gems of India. Post blogs, share culture, food, and places – and earn coins!
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/blogs">Blogs</Link></li>
            <li><Link href="/upload">Post a Blog</Link></li>
            <li><Link href="/earn">Earn Coins</Link></li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" aria-label="Facebook"><FaFacebook className="hover:text-blue-500" /></a>
            <a href="#" aria-label="Instagram"><FaInstagram className="hover:text-pink-500" /></a>
            <a href="#" aria-label="Twitter"><FaTwitter className="hover:text-sky-400" /></a>
            <a href="#" aria-label="LinkedIn"><FaLinkedin className="hover:text-blue-700" /></a>
          </div>
        </div>

        {/* Subscribe */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Stay Updated</h3>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email"
              className={`rounded px-4 py-2 outline-none w-full ${
                isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-white'
              }`}
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold py-2 px-4 rounded hover:scale-105 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-xs text-gray-500 mt-12"
      >
        © {new Date().getFullYear()} Incredible India. All rights reserved. | Made with ❤️ by Dipu
      </motion.div>
    </footer>
  );
};

export default Footer;
