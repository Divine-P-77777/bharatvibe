'use client';
import { useState,useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/store/hooks';
import { Button } from '@/components/ui/Button';
import Lenis from "@studio-freight/lenis";

const ReferralSection = () => {
  const { user } = useAuth();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const referralLink = `https://bharatvibes.vercel.app/signup?ref=${user?.id ?? 'your-id'}`;

  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };


  // Smooth Scrolling
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
    <div
      className={`min-h-screen  flex flex-col ${
        isDarkMode ? 'bg-black text-white' : 'bg-[#f9f4ed] text-black'
      }`}
    >

    
      <main className="flex-grow flex items-center justify-center px-4">
        <div
          className={`max-w-lg w-full ${
            isDarkMode ? 'bg-white/10 text-white' : 'bg-white/70 text-black'
          } backdrop-blur-lg p-6 rounded-xl shadow-lg transition-colors`}
        >
          <p className="mb-2 text-sm text-gray-600">Your Referral Link</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className={`w-full bg-transparent border ${
                isDarkMode ? 'border-gray-600 text-white' : 'border-gray-300 text-black'
              } p-2 rounded-md text-sm`}
            />
            <Button onClick={copyToClipboard}>
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </main>


    </div>
  );
};

export default ReferralSection;
