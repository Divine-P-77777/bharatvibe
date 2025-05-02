import ReferralSection from './ReferralSection';
import Image from 'next/image';
import UserNav from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';
export default function ReferPage() {
  return (
    <>   <UserNav />
    <div className="min-h-screen px-4 py-12 flex flex-col items-center justify-center bg-gradient-to-b from-amber-500 to-rose-300 dark:from-rose-300 dark:to-amber-500 text-white transition-colors duration-300">
      
      <h1 className="text-4xl font-bold text-center mb-2 mt-20 ">Refer & Earn</h1>

      <p className="mt-2 text-center max-w-xl text-white/90 dark:text-black/90">
        Share your unique referral link and earn <strong className="text-yellow-300">50 coins</strong> when your friend signs up and makes their first post!
      </p>

      <div className="mt-8">
        <Image
          src="/refer.png"
          alt="Refer & Earn"
          width={600}
          height={400}
          className="rounded-xl shadow-lg"
        />
      </div>

      <div className="my-2 w-full max-w-xl">
        <ReferralSection />
      </div>
           
    </div>
    <Footer /></>
  );
}
