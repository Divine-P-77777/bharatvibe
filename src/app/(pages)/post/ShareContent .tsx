'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';
import PostCreationPanel from './PostCreationPanel';
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks'
import Lenis from "@studio-freight/lenis";

export default function Share() {
  const { user } = useAuth();
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode)
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }


  useEffect(() => {
        const lenis = new Lenis({
          duration: 1.2,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
          smooth: true,
          smoothTouch: false,
        } as unknown as ConstructorParameters<typeof Lenis>[0]);
        
      
        function raf(time: number) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
      
        requestAnimationFrame(raf);
      
        return () => {
          lenis.destroy();
        };
      }, []);

  return (
    <div className={`min-h-screen ${isDarkMode?"bg-black text-white":"bg-gray-50 text-gray-900"}`}>
      <Navbar />
      <div className="bharat-container  py-30 px-1 ">
        <h1 className="text-3xl font-bold mb-8 heading-gradient text-center">Share Your Story</h1>
        <div className={`mb-6  rounded-2xl shadow-md p-6 ${isDarkMode?"border border-amber-400":"bg-orange-200 "}`}>
          <p className={`mb-6 ${isDarkMode?"text-orange-100":"text-gray-600 "}`}>
            Share your experiences, photos, and stories about India's culture, cuisine, or beautiful locations. 
            Your contributions help others discover the vibrant heritage of Bharat!
          </p>
          <PostCreationPanel />
        </div>
      </div>
      <Footer />
    </div>
  );
}