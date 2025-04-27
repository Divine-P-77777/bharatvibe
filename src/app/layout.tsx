import { homeMetadata } from '@/components/metadata/homeMetadata'
import { Providers } from './Providers'
import './globals.css'

export const metadata = homeMetadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/3Dlogo.png" sizes="any" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
