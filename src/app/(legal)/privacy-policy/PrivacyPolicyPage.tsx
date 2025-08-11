
'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import Navbar from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';
import Lenis from "@studio-freight/lenis";

export default function PrivacyPolicyPage() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
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
    <><Navbar />
    <section
      className={`min-h-screen w-full px-6 py-20 md:px-24 transition-colors duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-br from-black text-amber-100 via-zinc-900 to-gray-800 '
          : 'bg-gradient-to-br from-white  via-cyan-100 to-sky-200 text-white'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`max-w-5xl mx-auto rounded-3xl p-8 shadow-xl backdrop-blur-md ${isDarkMode?" bg-black":"dark:bg-black/60"}  space-y-6`}
      >
        {isDarkMode?
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-transparent bg-clip-text">
          Privacy Policy – BharatVibes
        </h1>:
         <h1 className="text-4xl font-bold bg-gradient-to-r from-black  to-rose-500 text-transparent bg-clip-text">
         Privacy Policy – BharatVibes
       </h1>
        }

        <p>
          BharatVibes is a platform rooted in India’s cultural richness. We
          value your privacy as we honor our traditions—with transparency,
          respect, and trust.
        </p>

        <h2 className="text-2xl font-semibold ">1. Data Collection</h2>
        <p>
          We use <strong>Supabase</strong> for user authentication and
          storage. When you sign up or log in, we securely store basic personal
          information like your name, email, and avatar. This helps keep your
          profile safe and lets you post blogs, guides, and cultural media.
        </p>

        <h2 className="text-2xl font-semibold ">2. Media Uploads</h2>
        <p>
          All uploaded images and videos are stored via <strong>Cloudinary</strong>.
          These are used to enrich the platform and share your experience with
          others. Your uploaded content remains yours—you control what stays
          and what goes.
        </p>

        <h2 className="text-2xl font-semibold ">3. Analytics & Cookies</h2>
        <p>
          We use minimal cookies and simple analytics tools to understand
          platform usage and improve features. No tracking for ads or marketing
          is done. We don’t sell or share your data with any advertisers.
        </p>

        <h2 className="text-2xl font-semibold ">4. Coin Rewards System</h2>
        <p>
          BharatVibes rewards you with cultural "coins" for meaningful
          contributions like posting, commenting, and sharing guides. These
          coins are non-financial and don’t require sensitive personal
          information beyond what’s already stored securely.
        </p>

        <h2 className="text-2xl font-semibold ">5. Rights & Control</h2>
        <p>
          You may <strong>edit or delete</strong> your account and any media
          you've shared with us at any time. Your right to control your content
          is sacred, and we honor it fully.
        </p>

        <h2 className="text-2xl font-semibold ">6. Age Restriction</h2>
        <p>
          The platform is meant for users aged <strong>5 and above</strong>,
          with parental supervision advised for younger users due to interactive
          features and user-generated content.
        </p>

        <h2 className="text-2xl font-semibold ">7. Use of Email</h2>
        <p>
          Your email address is used solely for login, identity confirmation,
          and essential notifications (like comment replies or security
          alerts). We will never spam or send promotional content without your
          permission.
        </p>

        <h2 className="text-2xl font-semibold ">8. Final Word</h2>
        <p>
          BharatVibes stands not just as a tech platform, but as a cultural
          journey. We blend heritage with innovation, ensuring your experience
          remains immersive, secure, and respectfully yours.
        </p>

        <p className="pt-4 text-sm text-gray-600 dark:text-gray-400">
          Last updated: April 30, 2025
        </p>
      </motion.div>
    </section>
    <Footer/>
    </>
  );
}
