"use client";

import { useState, FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDarkMode } from "@/store/themeSlice";
import { usePathname, useRouter } from "next/navigation";
import { safeQuerySelector, safeScrollIntoView, safeWindow } from "@/utils/browser";

interface NavItem {
    name: string;
    hash: string;
    path?: string;
}

const navItems: NavItem[] = [
    { name: "Home", hash: "#home", path: "/" },
    { name: "Explore Locations", hash: "#locations", path: "/#locations" },
    { name: "Explore Culture", hash: "#culture", path: "/#culture" },
    { name: "Explore Food", hash: "#food", path: "/#food" },
    { name: "About Us", hash: "#about", path: "/#about" },
    { name: "Contact Us", hash: "#contact", path: "/#contact" },
    { name: "Login", hash: "/login", path: "/login" },
];

const Navbar: FC = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const pathname = usePathname();

    const handleHashNavigation = (hash: string) => {
        if (pathname !== '/') {
          router.push(`/${hash}`);
        } else {
          setTimeout(() => {
            const section = safeQuerySelector(hash) as HTMLElement | null;
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100); // give time for route transition/render
        }
        setMenuOpen(false);
      };
      
    

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-transparent py-3 px-4 
            ${isDarkMode ? "text-[#F8F8F8]" : "text-[#0A192F]"}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link href="/#home" className="flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                    {/* Logo content */}
                </Link>

                <div className={`hidden md:flex items-center gap-2 p-2 rounded-full 
                    ${isDarkMode ? "bg-black" : "bg-white/30"}`}>
                    {navItems.map((item) => (
                        <button
                            key={item.hash}
                            onClick={() => handleHashNavigation(item.hash)}
                            className={`relative px-4 py-2 rounded-full transition-all duration-300 
                                ${safeWindow.location?.hash === item.hash
                                    ? isDarkMode
                                        ? "bg-cyan-500/20 text-cyan-400"
                                        : "bg-white text-[#1ba5e5]"
                                    : "hover:bg-white/10"}
                                hover:scale-105 hover:shadow-md`}>
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Toggle + Menu */}
                <div className="flex justify-between items-center gap-4">
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => dispatch(toggleDarkMode())}
                        className="rounded-full p-2 "
                    >
                        <Image
                            src={isDarkMode ? "/sun.png" : "/moon.png"}
                            alt="Theme Toggle"
                            width={36}
                            height={36}
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
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div
                    className={`absolute top-16 right-4 w-64 p-4 rounded-2xl shadow-xl transition-all duration-300 
            border backdrop-blur-sm transform origin-top-right
            ${isDarkMode ? "bg-[#0A192F]/90 text-[#F8F8F8] border-cyan-500" : "bg-white/90 text-[#0A192F] border-gray-900"}`}
                >
                    {navItems.map((item) => (
                        <Link
                            key={item.hash}
                            href={item.path || item.hash}
                            className={`block text-center px-4 py-3 my-2 rounded-xl transition-all duration-300 
                ${pathname === (item.path || item.hash)
                                    ? isDarkMode
                                        ? "bg-cyan-500/20 text-cyan-400"
                                        : "bg-[#1ba5e5]/10 text-[#1ba5e5]"
                                    : "hover:bg-cyan-500/10"}
                hover:scale-105 hover:shadow-md`}
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
