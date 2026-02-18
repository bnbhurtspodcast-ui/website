import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Back n' Body Hurts Podcast",
  description:
    "A Toronto-based podcast covering all things EDM — tips, recommendations, and real talk about local and worldwide events.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
