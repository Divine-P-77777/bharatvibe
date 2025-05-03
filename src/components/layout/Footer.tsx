'use client';

import { useAppSelector } from '@/store/hooks';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, Landmark, Utensils, Camera, MapPin, Pen, Coins, User } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import LordIcon from '@/components/ui/LordIcon';

const Footer = () => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <footer className={`min-h-screen w-full ${isDarkMode ? 'bg-black text-white' : 'bg-slate-50 text-gray-900'}`}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Logo & About Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <LordIcon
                src="https://cdn.lordicon.com/eflfmgmj.json"
                trigger="hover"
                colors={{ primary: '#f59e0b' }}
                size={40}
              />
              <h2 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">
                  Bharat Vibes
                </span>
              </h2>
            </div>
            <p className="text-base leading-relaxed text-slate-400">
              Embark on a digital yatra through India's soul. Share stories, discover traditions, 
              and connect with fellow culture enthusiasts.
            </p>
            <div className="flex gap-4">
              <Link href="/posts">
                <motion.button 
                  whileHover={{ scale: 1.05 }} 
                  className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-semibold text-white"
                >
                  <Globe size={20} />
                  Explore Now
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Quick Routes</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Link href="/" className="flex items-center gap-2 text-sm hover:text-amber-500">
                  <Landmark size={16} />
                  Home
                </Link>
                <Link href="/about" className="flex items-center gap-2 text-sm hover:text-amber-500">
                  <User size={16} />
                  About
                </Link>
                <Link href="/auth" className="flex items-center gap-2 text-sm hover:text-amber-500">
                  <Landmark size={16} />
                  Login
                </Link>
                <Link href="/profile" className="flex items-center gap-2 text-sm hover:text-amber-500">
                  <User size={16} />
                  Profile
                </Link>
              </div>
              <div className="space-y-3">
                <Link href="/post" className="flex items-center gap-2 text-sm hover:text-amber-500">
                  <Pen size={16} />
                  Upload Post
                </Link>
                <Link href="/redeem" className="flex items-center gap-2 text-sm hover:text-amber-500">
                  <Coins size={16} />
                  Earn Coins
                </Link>
                <Link href="/terms" className="flex items-center gap-2 text-sm hover:text-amber-500">
                  <Landmark size={16} />
                  Terms
                </Link>
                <Link href="/privacy-policy" className="flex items-center gap-2 text-sm hover:text-amber-500">
                  <Landmark size={16} />
                  Privacy
                </Link>
              </div>
            </div>
          </div>

          {/* Cultural Hub */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Cultural Hub</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <LordIcon
                  src="https://cdn.lordicon.com/uwynoprm.json"
                  trigger="hover"
                  colors={{ primary: '#f59e0b' }}
                  size={32}
                />
                <div>
                  <Link href="/post" className="text-sm font-medium hover:text-amber-500">
                    Heritage Trails
                  </Link>
                  <p className="text-xs text-slate-400">Discover ancient wonders</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <LordIcon
                  src="https://cdn.lordicon.com/nhfyhmlt.json"
                  trigger="hover"
                  colors={{ primary: '#f59e0b' }}
                  size={32}
                />
                <div>
                  <Link href="/posts" className="text-sm font-medium hover:text-amber-500">
                    Festival Guide
                  </Link>
                  <p className="text-xs text-slate-400">Celebrate with India</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <LordIcon
                  src="https://cdn.lordicon.com/elkhjhci.json"
                  trigger="hover"
                  colors={{ primary: '#f59e0b' }}
                  size={32}
                />
                <div>
                  <Link href="/posts?category=map" className="text-sm font-medium hover:text-amber-500">
                    Culinary Map
                  </Link>
                  <p className="text-xs text-slate-400">Taste regional flavors</p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Stay Connected</h3>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email"
                className={`w-full rounded-lg p-3 text-sm ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="w-full rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white"
              >
                Join Community
              </motion.button>
            </form>
            <div className="flex gap-4 text-xl">
              <Link href="#" className="hover:text-amber-500"><FaFacebook /></Link>
              <Link href="#" className="hover:text-amber-500"><FaInstagram /></Link>
              <Link href="#" className="hover:text-amber-500"><FaTwitter /></Link>
              <Link href="#" className="hover:text-amber-500"><FaYoutube /></Link>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 border-t border-gray-700 pt-8 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-400">
            <span>© {new Date().getFullYear()} Bharat Vibes</span>
            <span>•</span>
            <Link href="/privacy" className="hover:text-amber-500">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-amber-500">Terms of Service</Link>
            <span>•</span>
            <span>Made with ❤️ in India</span>
            <span>•</span>
            <Link href="https://dynamicphillic.vercel.app" target="_blank" className="hover:text-amber-500">
              Developed by DesiDynamiX
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;