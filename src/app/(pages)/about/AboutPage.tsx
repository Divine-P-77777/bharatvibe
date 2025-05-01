"use client";
import {useState,useEffect} from "react";
import  {ParallaxInnovative}   from "@/components/parallax/ParallaxInnovative";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from '@/store/hooks'
import UserNav from "@/components/layout/UserNav"
import Footer from "@/components/layout/Footer"
import Loader from '@/components/ui/loader'

export default function AboutPage() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode)
  const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 2000) 
  
      return () => clearTimeout(timer)
    }, [])
  return (
    <>
        {loading && <Loader />}
    <UserNav/>
    
    <div className="flex flex-col ">
      <ParallaxInnovative
        imageUrl="https://images.unsplash.com/photo-1548869447-faef5000334c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        heading="Welcome to Bharat Vibes"
        subheading="Celebrating India's Diversity"
        isDarkMode={isDarkMode}
      >
        <p className="text-lg md:text-xl">
          Bharat Vibes is a platform dedicated to showcasing the beauty, history,
          and vibrancy of Indian culture. Our mission is to create a community
          where people can share experiences, explore traditions, and celebrate
          the essence of India.
        </p>
      </ParallaxInnovative>

      <ParallaxInnovative
        imageUrl="https://images.unsplash.com/photo-1549119246-cf57ef8a17b2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        heading="Why Indian Culture Matters"
        subheading="A Rich Heritage of Unity in Diversity"
        isDarkMode={isDarkMode}
      >
        <p className="text-lg md:text-xl">
          From over a thousand spoken languages to colorful traditional attires
          and regional cuisines, India is a treasure trove of culture. Bharat
          Vibes honors these nuances by giving everyone a voice to share and
          preserve our traditions.
        </p>
      </ParallaxInnovative>

      <ParallaxInnovative
        imageUrl="https://images.pexels.com/photos/3184397/pexels-photo-3184397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        heading="What Makes Bharat Vibes Unique"
        subheading="More Than Just a Platform"
        isDarkMode={isDarkMode}
      >
        <p className="text-lg md:text-xl">
          Users can post stories, upload photos and videos, engage in thoughtful
          discussions, upvote content, and earn Vibe Coins as rewards. It’s a
          vibrant community driven by passion and positivity.
        </p>
      </ParallaxInnovative>

      <ParallaxInnovative
        imageUrl="https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        heading="Our Tech Stack"
        subheading="Powered by Innovation"
        isDarkMode={isDarkMode}
      >
        <ul className="list-disc ml-6 text-lg md:text-xl space-y-2">
          <li>Next.js & TypeScript for fast, scalable web development</li>
          <li>Supabase for realtime backend and authentication</li>
          <li>Cloudinary for high-quality media hosting</li>
          <li>Redux for state management</li>
          <li>Framer Motion for stunning animations</li>
        </ul>
      </ParallaxInnovative>

      <ParallaxInnovative
        imageUrl="https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        heading="High-Quality Media & 3D Support"
        subheading="Experience India Like Never Before"
        isDarkMode={isDarkMode}
      >
        <Suspense fallback={<p>Loading media experience...</p>}>
          <p className="text-lg md:text-xl">
            Bharat Vibes embraces modern media with lazy-loaded images,
            interactive 3D support, and immersive storytelling. Whether it's a
            regional dance video or a 3D temple model, we bring culture to life.
          </p>
        </Suspense>
      </ParallaxInnovative>
    </div>
    <Footer/>
    </>
  );
}
