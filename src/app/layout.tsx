import { Providers } from './Providers'
import './globals.css'
import GlobalLoader from '@/components/ui/GlobalLoader'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/3Dlogo.png" sizes="any" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&family=Noto+Sans+Devanagari:wght@400;500&display=swap"
          rel="stylesheet"
        />

        
        <meta property="og:title" content="Bharat Vibes | Explore India’s Culture" />
        <meta property="og:description" content="Explore the beauty and culture of India through Bharat Vibes." />
        <meta property="og:image" content="https://ik.imagekit.io/sdm2vyawn77777/Images%20/logo.png?updatedAt=1745677256653" />
        <meta property="og:url" content="https://bharatvibes.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bharat Vibes" />
        <meta property="og:locale" content="en_IN" />

       
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bharat Vibes | Explore India’s Culture" />
        <meta name="twitter:description" content="Explore the beauty and culture of India through Bharat Vibes." />
        <meta name="twitter:image" content="https://ik.imagekit.io/sdm2vyawn77777/Images%20/logo.png?updatedAt=1745677256653" />

      </head>
      <body>
        <Providers>
          <GlobalLoader />
          {children}
        </Providers>
      </body>
    </html>
  )
}
