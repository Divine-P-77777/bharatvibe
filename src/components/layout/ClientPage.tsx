'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Loader from '@/components/ui/loader';

const HeroSlider = dynamic(() => import('@/components/layout/HeroSlider'), { ssr: false });
const LocationsSection = dynamic(() => import('@/components/sections/Locations'), { ssr: false });
const CultureSection = dynamic(() => import('@/components/sections/Culture'), { ssr: false });
const FoodSection = dynamic(() => import('@/components/sections/Food'), { ssr: false });
const ParallaxWrapper = dynamic(() => import('@/components/parallax/ParallaxWrapper'), { ssr: false });
const ClientLayout = dynamic(() => import('@/components/layout/ClientLayout'), { ssr: false });
const ScrollWrapper = dynamic(() => import('@/components/parallax/ScrollWrapper'), { ssr: false });
const BlogSection = dynamic(() => import('@/components/sections/BlogSection'), { ssr: false });
const EndPage = dynamic(() => import('@/components/sections/EndPage'), { ssr: false });
const Footer = dynamic(() => import('@/components/layout/Footer'), { ssr: false });

export default function ClientPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Loader />}

      <ClientLayout
        footer={
          <div className="relative z-20" data-scroll-section>
            <Footer />
          </div>

        }
      >
        <ScrollWrapper>
          <div id="main-container" className="relative">
            <div className="min-h-screen" data-scroll-section>
              <ParallaxWrapper variant="hero">
                <HeroSlider />
              </ParallaxWrapper>
            </div>

            <LocationsSection />
            <CultureSection />
            <FoodSection />
            <BlogSection />
            <EndPage />
          </div>
        </ScrollWrapper>
      </ClientLayout>
    </>
  );
}
