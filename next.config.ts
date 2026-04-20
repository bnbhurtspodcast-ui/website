import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd3t3ozftmdmh3i.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.buzzsprout.com',
      },
      {
        protocol: 'https',
        hostname: '*.libsyn.com',
      },
      {
        protocol: 'https',
        hostname: '*.libsynpro.com',
      },
      {
        protocol: 'https',
        hostname: '*.podbean.com',
      },
      {
        protocol: 'https',
        hostname: '*.anchor.fm',
      },
      {
        protocol: 'https',
        hostname: '*.spotify.com',
      },
    ],
  },
}

export default nextConfig
