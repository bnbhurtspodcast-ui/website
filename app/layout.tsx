import type { Metadata } from 'next'
import { Oswald, DM_Sans } from 'next/font/google'
import Script from 'next/script'
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
  keywords: [
    'Toronto EDM podcast',
    'rave culture podcast',
    'electronic music podcast',
    'DJ interviews Toronto',
    'rave scene podcast',
    'EDM community Toronto',
    'tech house podcast',
    'rave guide podcast',
  ],
  metadataBase: new URL('https://bnbhurtspodcast.com'),
  alternates: {
    canonical: 'https://bnbhurtspodcast.com',
  },
  openGraph: {
    siteName: "Back n' Body Hurts Podcast",
    type: 'website',
    locale: 'en_CA',
    images: [
      {
        url: '/logo.png',
        width: 1400,
        height: 1400,
        alt: "Back n' Body Hurts Podcast cover art",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@bnbhurtspodcast',
    images: ['/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'PodcastSeries',
              name: "Back n' Body Hurts Podcast",
              description:
                "Opinionated guidance for all involved in the rave scene — from the host to the attendees. Toronto's EDM and rave culture podcast.",
              url: 'https://bnbhurtspodcast.com',
              image: 'https://bnbhurtspodcast.com/logo.png',
              inLanguage: 'en',
              webFeed: 'https://anchor.fm/s/ee3c58cc/podcast/rss',
              genre: ['EDM', 'Electronic Music', 'Rave Culture', 'Music Podcast'],
              locationCreated: {
                '@type': 'Place',
                name: 'Toronto, Ontario, Canada',
              },
              author: {
                '@type': 'Organization',
                name: "Back n' Body Hurts Podcast",
                url: 'https://bnbhurtspodcast.com',
              },
              publisher: {
                '@type': 'Organization',
                name: "Back n' Body Hurts Podcast",
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://bnbhurtspodcast.com/logo.png',
                },
              },
              sameAs: [
                'https://open.spotify.com/show/7Evzpy1MHgZR8Yy9xDuxXY',
                'https://podcasts.apple.com/us/podcast/back-n-body-hurts/id1722381103',
                'https://www.youtube.com/@BnBHurtsPodcast',
                'https://www.instagram.com/bnbhurtspodcast',
                'https://twitter.com/bnbhurtspodcast',
              ],
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B8H3ZHPQ89"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B8H3ZHPQ89');
          `}
        </Script>
      </head>
      <body className={`${oswald.variable} ${dmSans.variable}`} style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
