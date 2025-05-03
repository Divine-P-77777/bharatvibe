'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Lenis from '@studio-freight/lenis';
import { motion } from 'framer-motion';

import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase/client';
import { useAppSelector } from '@/store/hooks';

import Loader from '@/components/ui/loader';
import ProfileCard from '../ProfileCard';
import UserNav from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';

export default function OnboardPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  // Smooth scrolling with Lenis
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
    return () => lenis.destroy();
  }, []);

  // Fetch profile after authentication
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || loading) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) return;
      setProfile(data);

      if (data.username) {
        router.push(`/profile/${data.username}`);
      }
    };

    fetchProfile();
  }, [user, loading, router]);

  if (loading || !profile) return <Loader />;

  return (
    <>
      <UserNav />
      <div className={`min-h-screen px-4 pt-16 transition-colors duration-500 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
        <div className="max-w-4xl pt-15 mx-auto text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-xl"
          >
            Welcome to BharatVibes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`${isDarkMode ? 'text-gray-300' : 'text-black '}`}
          >
            Let's build your presence with vibes and identity 🌟
          </motion.p>
        </div>

        <div className="text-center mb-6">
          <Link href="/">
            <button className="py-2 px-5 bg-gradient-to-r from-rose-400 to-amber-600 text-white rounded-full font-semibold shadow hover:scale-105 transition">
              Back to Home
            </button>
          </Link>
        </div>
        <div className='mx-0 sm:mx-30 '>
          <ProfileCard user={profile} isOwnProfile={true} />
        </div>
      </div>
      <Footer />
    </>
  );
}
