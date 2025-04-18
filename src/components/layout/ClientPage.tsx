"use client";

import dynamic from 'next/dynamic';
import SectionTransition from '../animations/SectionTransition';

const HeroSlider = dynamic(() => import('@/components/layout/HeroSlider'), { ssr: false });
const LocationsSection = dynamic(() => import('@/components/sections/Locations'), { ssr: false });
const CultureSection = dynamic(() => import('@/components/sections/Culture'), { ssr: false });
const FoodSection = dynamic(() => import('@/components/sections/Food'), { ssr: false });
const ParallaxWrapper = dynamic(() => import('@/components/parallax/ParallaxWrapper'), { ssr: false });
const ClientLayout = dynamic(() => import('@/components/layout/ClientLayout'), { ssr: false });
const ScrollWrapper = dynamic(() => import('@/components/parallax/ScrollWrapper'), { ssr: false });

export default function ClientPage() {
  return (
    <ClientLayout>
      <ScrollWrapper>
        <div id="main-container" className="relative">
          {/* Hero Section with proper spacing for navbar */}
          <div className="min-h-screen" data-scroll-section>

            <ParallaxWrapper variant="hero">
              <HeroSlider />
            </ParallaxWrapper>
          </div>
          {/* Main content sections with innovativ transitions */}
          {/* <SectionTransition index={0} title="Explore Locations"> */}
        
            <LocationsSection />
            
          {/* </SectionTransition> */}

          {/* <SectionTransition index={1} title="Experience Culture"> */}
            <CultureSection />
          {/* </SectionTransition> */}

          {/* <SectionTransition index={2} title="Taste India"> */}
            <FoodSection />
          {/* </SectionTransition> */}
        </div>
      </ScrollWrapper>
    </ClientLayout>
  );
} 