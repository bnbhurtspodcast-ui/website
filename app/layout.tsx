import type { Metadata } from 'next'
import { Oswald, DM_Sans } from 'next/font/google'
import { CHANNEL_IMAGE } from '@/lib/rss'
import './globals.css'

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: "Back n' Body Hurts Podcast",
    template: "%s | Back n' Body Hurts",
  },
  description:
    "A Toronto-based podcast covering all things EDM — tips, recommendations, and real talk about local and worldwide events.",
  metadataBase: new URL('https://bnbhurtspodcast.com'),
  openGraph: {
    siteName: "Back n' Body Hurts Podcast",
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: CHANNEL_IMAGE,
        width: 1400,
        height: 1400,
        alt: "Back n' Body Hurts Podcast cover art",
      },
    ],
  },
  twitter: {
    card: 'summary',
    images: [CHANNEL_IMAGE],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${dmSans.variable}`} style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
