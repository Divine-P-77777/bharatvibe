import dynamic from 'next/dynamic';

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

export default function Index() {
  return (
    <ClientLayout footer={
      <div className="h-auto" data-scroll-section>
        <Footer />
      </div>
    }>
    
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
  );
}
