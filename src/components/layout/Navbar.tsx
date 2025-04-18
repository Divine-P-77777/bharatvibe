"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDarkMode } from "@/store/themeSlice";
import { usePathname } from "next/navigation";

const navItems = [
  { path: "/", name: "Home" },
  { path: "/locations", name: "Explore Locations" },
  { path: "/culture", name: "Explore Culture" },
  { path: "/food", name: "Explore Food" },
  { path: "/about", name: "About Us" },
  { path: "/contact", name: "Contact Us" },
  { path: "/login", name: "Login" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 shadow-md shadow-cyan-500/20 py-3 px-4 
        ${isDarkMode ? "bg-[#0A192F] text-[#F8F8F8]" : "bg-[#1ba5e5] text-[#0A192F]"}`}
      data-scroll
      data-scroll-sticky
      data-scroll-target="#main-container"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={60} 
            height={60}
            className="rounded-xl border hover:shadow-lg hover:border-cyan-400 transition-all duration-300"
          />
          <span className="text-xl font-bold hover:text-cyan-400 transition-colors duration-300">BharatVibe</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center gap-2 p-2 rounded-full 
          ${isDarkMode ? "bg-black" : "bg-white/30"}`}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 rounded-full transition-all duration-300 
                  ${isActive ? 
                    (isDarkMode ? "bg-cyan-500/20 text-cyan-400" : "bg-white text-[#1ba5e5]") 
                    : "hover:bg-white/10"}
                  hover:scale-105 hover:shadow-md`}
              >
                {item.name}
                {isActive && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Section */}
        <div className="flex justify-between items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className="rounded-full p-2 transition-all duration-300 hover:scale-110 hover:rotate-12"
          >
            <Image
              src={isDarkMode ? "/sun.png" : "/moon.png"}
              alt="Theme Toggle"
              width={32}
              height={32}
              className={`rounded-full border transition-all duration-300
                ${isDarkMode ? "border-cyan-500 hover:border-yellow-400" : "border-gray-900 hover:border-blue-400"}`}
            />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-full transition-all duration-300
              ${isDarkMode ? "hover:bg-cyan-500/20" : "hover:bg-white/30"}`}
          >
            <Image
              src={menuOpen ? "/close.svg" : "/menu.svg"}
              alt="Menu"
              width={32}
              height={32}
              className="hover:scale-110 transition-transform duration-300"
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className={`absolute top-16 right-4 w-64 p-4 rounded-2xl shadow-xl transition-all duration-300 
              border backdrop-blur-sm transform origin-top-right
              ${isDarkMode 
                ? "bg-[#0A192F]/90 text-[#F8F8F8] border-cyan-500" 
                : "bg-white/90 text-[#0A192F] border-gray-900"}`}
          >
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block text-center px-4 py-3 my-2 rounded-xl transition-all duration-300 
                    ${isActive
                      ? (isDarkMode ? "bg-cyan-500/20 text-cyan-400" : "bg-[#1ba5e5]/10 text-[#1ba5e5]")
                      : "hover:bg-cyan-500/10"}
                    hover:scale-105 hover:shadow-md`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="mobile-navbar-indicator"
                      className="w-1 h-1 mx-auto rounded-full bg-cyan-400"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </motion.nav>
  );
}