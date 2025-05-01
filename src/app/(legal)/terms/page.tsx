'use client';

import { motion } from 'framer-motion';
import { useAppSelector } from '@/store/hooks';
import UserNav from '@/components/layout/UserNav';
import Footer from '@/components/layout/Footer';

export default function TermsAndConditionsPage() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);

  return (
    <>
      <UserNav />
      <section
        className={`min-h-screen w-full px-6 py-20 md:px-24 transition-colors duration-500 ${
          isDarkMode
            ? 'bg-gradient-to-br from-black via-zinc-900 to-gray-800 text-white'
            : 'bg-gradient-to-br from-white via-cyan-100 to-sky-200 text-black'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto rounded-3xl p-8 shadow-xl backdrop-blur-md bg-white/80 dark:bg-black/50 space-y-6"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-transparent bg-clip-text">
            Terms & Conditions – BharatVibes
          </h1>

          <p>
            Welcome to <strong>BharatVibes</strong>, a cultural community platform celebrating the rich heritage of India. By using our services, you agree to the following terms designed to promote a safe, inspiring, and respectful environment.
          </p>

          <h2 className={`text-2xl font-semibold ${isDarkMode?"text-orange-500":"text-white"}`}>1. Platform Use</h2>
          <p>
            BharatVibes allows you to explore and contribute to India’s cultural landscape. You may browse content, post media (images, videos, PDFs), comment, and participate in community discussions while earning BharatCoins through positive engagement.
          </p>

          <h2 className="text-2xl font-semibold text-orange-500">2. User Content & Ownership</h2>
          <p>
            You retain ownership of any original content you upload. By posting, you grant BharatVibes a non-exclusive, royalty-free license to display and distribute your content within the platform for community benefit. We do not claim ownership of your intellectual property.
          </p>

          <h2 className="text-2xl font-semibold text-orange-500">3. Community Guidelines</h2>
          <ul className="list-disc pl-6">
            <li>No nudity, sexually explicit, or violent content.</li>
            <li>No hate speech, casteism, or discrimination of any kind.</li>
            <li>Respect India’s cultural diversity and traditions.</li>
            <li>Refrain from spamming, impersonation, or misusing the platform.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-orange-500">4. Moderation & Reporting</h2>
          <p>
            Our moderators reserve the right to hide, block, or delete content or accounts that violate guidelines. Users can report inappropriate content, which will be reviewed promptly. Repeated violations may result in permanent bans.
          </p>

          <h2 className="text-2xl font-semibold text-orange-500">5. BharatCoins System</h2>
          <p>
            Users earn BharatCoins for meaningful activity like posting, commenting, or contributing guides. These coins are a community reward—not a financial instrument. Redemption of coins (e.g., for featured profiles or access to special content) is subject to platform policies and may change.
          </p>

          <h2 className="text-2xl font-semibold text-orange-500">6. Termination</h2>
          <p>
            We reserve the right to terminate accounts that violate our terms or threaten community integrity. You may also delete your account anytime, which will remove all personal data from our servers (as per our Privacy Policy).
          </p>

          <h2 className="text-2xl font-semibold text-orange-500">7. Technologies Used</h2>
          <p>
            BharatVibes is powered by <strong>Next.js</strong>, <strong>Supabase</strong> for authentication and data, and <strong>Cloudinary</strong> for media uploads. By continuing to use our services, you consent to their basic use in line with our Privacy Policy.
          </p>

          <p className="pt-4 text-sm text-gray-600 dark:text-gray-400">
            Last updated: April 30, 2025
          </p>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
