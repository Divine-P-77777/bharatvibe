// app/layout.tsx
import { Providers } from './Providers'
import './globals.css'
import GlobalLoader from '@/components/ui/GlobalLoader'
import { homeMetadata } from '@/components/metadata/homeMetadata'

export const metadata = homeMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/3Dlogo.png" sizes="any" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&family=Noto+Sans+Devanagari:wght@400;500&display=swap"
          rel="stylesheet"
        />
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
