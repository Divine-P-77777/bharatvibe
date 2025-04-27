import type { Metadata } from "next";

export const homeMetadata: Metadata = {
  title: 'Bharat Vibes | Explore India’s Culture',
  description: 'Showcasing India’s rich traditions, locations, foods, dresses, and guides with a vibrant community experience.',
  keywords: 'India, Culture, Travel, Food, Locations, Bharat Vibes, Traditions',
  openGraph: {
    title: 'Bharat Vibes',
    description: 'Explore the beauty and culture of India through Bharat Vibes.',
    url: 'https://bharatvibes.vercel.app', 
    siteName: 'Bharat Vibes',
    images: [
      {
        url: 'https://ik.imagekit.io/sdm2vyawn77777/Images%20/logo.png?updatedAt=1745677256653',
        width: 800,
        height: 600,
        alt: 'Bharat Vibes Cover',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};