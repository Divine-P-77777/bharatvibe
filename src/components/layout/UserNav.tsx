"use client";

import { useState, FC, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleDarkMode } from "@/store/themeSlice";
import { redirect, usePathname, useRouter } from "next/navigation";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { safeWindow } from "@/utils/browser";
import { useAuth } from "@/hooks/useAuth";
import { Label } from "@/components/ui/label";
import Popup from "@/components/ui/Popup";
import { useToast } from '@/hooks/use-toast';


interface NavItem {
  name: string;
  path: string;
  authRequired?: boolean;
}

const navItems: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "Explore", path: "/posts" },
  { name: "Upload", path: "/post" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
  { name: "My Profile", path: "/profile", authRequired: true },

  { name: "Login", path: "/auth", authRequired: false },
  { name: "Logout", path: "/logout", authRequired: true },
];

const Navbar: FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { scroll, activeSection, setActiveSection } = useLenisScroll();
  const { user } = useAuth();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [scrolled, setScrolled] = useState(false);




  const handleLogout = async () => {
    try {
      await signOut();
      setShowLogoutPopup(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const onClose = () => {
    setShowLogoutPopup(false);
  };

  const handleNavigation = (path: string) => {
    setMenuOpen(false);

    if (path === "/") {
      setActiveSection("home");
      if (pathname !== "/") {
        window.location.href = "/";
      } else {
        scroll?.scrollTo(0);
        safeWindow.history?.replaceState({}, "", "/");
      }
      return;
    }

    if (path === "/logout") {
      setShowLogoutPopup(true);
      return;
    }

    if (path === "/post" && !user) {
      toast({
        title: '',
        description: 'Login first to upload a post',
      });
      router.push("/auth");
      return;
    }

    router.push(path);
  };

  const filteredNavItems = navItems.filter(item => {
    if (item.authRequired === undefined) return true;
    return item.authRequired === !!user;
  });

  const isActive = (path: string) => {
    return pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
    
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };


    window.addEventListener("scroll", handleScroll);
    
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (pathname === "/" && !safeWindow.location?.hash) {
      setActiveSection("home");
    }
  }, [pathname, setActiveSection]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 py-2 px-2 sm:px-4 ${scrolled ? 'bg-transparent' : 'bg-transparent'} ${isDarkMode ? "text-[#F8F8F8]" : "text-[#0A192F]"}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          onClick={() => handleNavigation("/")}
          className={`flex items-center gap-2 hover:scale-105 transition-transform duration-300 border ${isDarkMode ? "bg-black border-orange-600  backdrop-blur-2xl" : "bg-white/40 border-orange-400 backdrop-blur-3xl"} py-3 px-3 ml-0 rounded-full`}
        >
          <div className="flex justify-center items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
            <div>BharatVibes</div>
          </div>
        </Link>

        <div className={`hidden md:flex backdrop-blur-sm items-center border gap-2 p-2 rounded-full ${isDarkMode ? "bg-black/80 border-orange-600" : "bg-white/40 border-orange-400 backdrop-blur-3xl"}`}>
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`relative px-4 py-2 rounded-full transition-all duration-300 ${isActive(item.path)
                ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                : isDarkMode
                  ? "hover:border hover:bg-white hover:text-black hover:border-amber-500 text-white"
                  : "hover:border hover:bg-white hover:text-black hover:border-amber-500 "
                } hover:scale-105 hover:shadow-md`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className={`flex justify-between border ${isDarkMode ? "border-orange-600 hover:border-red-400 bg-black " : "border-orange-400 hover:border-orange-400 bg-white/30 backdrop-blur-3xl"} items-center gap-4 rounded-full px-2 sm:px-0`}>
          <button onClick={() => dispatch(toggleDarkMode())} className="rounded-full p-2">
            <Image
              src={isDarkMode ? "/sun.png" : "/moon.png"}
              alt="Theme Toggle"
              width={36}
              height={36}
              className="rounded-full border transition-all duration-300"
            />
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 rounded-full transition-all duration-300 ${isDarkMode ? "hover:bg-orange-500/20" : "hover:bg-red-500/10"}`}
          >
            <Image
              src={menuOpen ? (isDarkMode ? "/close.svg" : "/whiteclose.png") : (isDarkMode ? "/menu.svg" : "/whitemenu.png")}
              alt="Menu"
              width={32}
              height={32}
              className="hover:scale-110 transition-transform duration-300"
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className={`absolute top-24 right-4 w-64 p-4 rounded-2xl shadow-xl transition-all duration-300 border backdrop-blur-sm transform origin-top-right z-40 ${isDarkMode ? "bg-black/40 backdrop-blur-4xl text-[#F8F8F8] border-orange-500" : "backdrop-blur-3xl bg-white/90 text-[#0A192F] border-red-500"}`}>
          {filteredNavItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`block w-full text-left px-4 py-3 my-2 rounded-xl transition-all duration-300 ${isActive(item.path)
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                : isDarkMode
                  ? "hover:bg-orange-500/20 text-white"
                  : "hover:bg-red-500/10 text-black"
                } hover:scale-105 hover:shadow-md`}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}
      {showLogoutPopup && (
        <Popup isOpen={showLogoutPopup} onClose={() => setShowLogoutPopup(false)}>
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-4 dark:text-white">Confirm Logout</h2>
              <p className="mb-6 dark:text-gray-300">Are you sure you want to log out?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Logout
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </nav>
  );
};

export default Navbar;
