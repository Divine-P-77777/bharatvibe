import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BharatVibes - Celebrate Indian Culture',
    short_name: 'BharatVibes',
    description: 'BharatVibes is your cultural space to share India’s local food, festivals, hidden places & traditions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff8f0',
    theme_color: '#ff5722',
    orientation: 'portrait',
    scope: '/',
    lang: 'en-IN',
    icons: [
      {
        src: '/3Dlogo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ]
  }
}



// npx pwa-asset-generator public/logo.png public -m app/manifest.ts