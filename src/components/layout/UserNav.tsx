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
            }, 100);
        }
        setMenuOpen(false);
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 bg-transparent py-3 px-2 sm:px-4 
            ${isDarkMode ? "text-[#F8F8F8]" : "text-[#0A192F]"}`}>

            <div className="max-w-7xl mx-auto flex justify-between items-center">
               
                    <Link href="/#home" className={`flex items-center gap-2 hover:scale-105 transition-transform duration-300  border
                        ${isDarkMode ? "bg-black border-orange-600" : "bg-white/40 border-orange-400 backdrop-blur-3xl"}  
                        py-3 px-3 ml-0 rounded-full`}>
                        <div className="flex justify-center items-center gap-2">
                            <img src="/logo.png" alt="" className="w-10 h-10 rounded-full" />
                            {/* <div className="text-xl">|</div> */}
                            <div>BharatVibes</div>
                        </div>
                    </Link>
              

                <div className={`hidden md:flex items-center border gap-2 p-2 rounded-full 
                   ${isDarkMode ? "bg-black border-orange-600" : "bg-white/40 border-orange-400 backdrop-blur-3xl"}  `}>
                    {navItems.map((item) => (
                        <button
                            key={item.hash}
                            onClick={() => handleHashNavigation(item.hash)}
                            className={`relative px-4 py-2 rounded-full transition-all duration-300 
                                ${safeWindow.location?.hash === item.hash
                                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                                    : isDarkMode
                                        ? "hover:bg-orange-500/20 text-white"
                                        : "hover:bg-red-500/10 text-black"}
                                hover:scale-105 hover:shadow-md`}>
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Toggle + Menu */}
                <div className={`flex justify-between border ${isDarkMode
                                    ? "border-orange-600 hover:border-red-400 bg-black"
                                    : "border-orange-400 hover:border-orange-400 bg-white/30 backdrop-blur-3xl"} items-center gap-4  rounded-full px-2 sm:px-0`}>
                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => dispatch(toggleDarkMode())}
                        className="rounded-full p-2"
                    >
                        <Image
                            src={isDarkMode ? "/sun.png" : "/moon.png"}
                            alt="Theme Toggle"
                            width={36}
                            height={36}
                            className={`rounded-full border transition-all duration-300
                                `}
                        />
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`md:hidden p-2 rounded-full transition-all duration-300
                            ${isDarkMode ? "hover:bg-orange-500/20" : "hover:bg-red-500/10"}`}>
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
                    className={`absolute top-24 right-4 w-64 p-4 rounded-2xl shadow-xl transition-all duration-300 
                        border backdrop-blur-sm transform origin-top-right z-40
                        ${isDarkMode
                            ? "bg-black/40 backdrop-blur-4xl  text-[#F8F8F8] border-orange-500"
                            : "bg-white/90 text-[#0A192F] border-red-500"}`}
                >
                    {navItems.map((item) => (
                        <button
                            key={item.hash}
                            onClick={() => handleHashNavigation(item.hash)}
                            className={`block w-full text-left px-4 py-3 my-2 rounded-xl transition-all duration-300 
                                ${pathname === (item.path || item.hash) || safeWindow.location?.hash === item.hash
                                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                    : isDarkMode
                                        ? "hover:bg-orange-500/20 text-white"
                                        : "hover:bg-red-500/10 text-black"}
                                hover:scale-105 hover:shadow-md`}>
                            {item.name}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
