import type { Metadata } from 'next'
import { Download, FileText, Newspaper } from 'lucide-react'
import { getEpisodes } from '@/lib/rss'

export const metadata: Metadata = {
  title: 'Press Kit',
  description:
    "Media resources and brand assets for Back n' Body Hurts Podcast. Download logos, cover art, host photos, and read our show overview.",
  openGraph: {
    title: "Press Kit | Back n' Body Hurts",
    description:
      "Media resources and brand assets for Back n' Body Hurts Podcast. Download logos, cover art, host photos, and read our show overview.",
    url: '/press-kit',
  },
  twitter: {
    card: 'summary',
    title: "Press Kit | Back n' Body Hurts",
    description:
      "Media resources and brand assets for Back n' Body Hurts Podcast. Download logos, cover art, host photos, and read our show overview.",
  },
}

export default async function PressKitPage() {
  const allEpisodes = await getEpisodes()

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="rave-icon-box w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ boxShadow: '0 0 20px rgba(250,162,27,0.15)' }}>
            <Newspaper className="h-10 w-10 text-[#FAA21B]" />
          </div>
          <h1 className="font-black uppercase leading-none tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', color: 'white' }}>
            Press Kit
          </h1>
          <p className="text-xl font-medium mb-4" style={{ color: '#FAA21B' }}>
            Media resources and brand assets
          </p>
          <p className="max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Everything you need to write about or feature Back n&apos; Body Hurts Podcast. All assets
            are free to use for press and promotional purposes.
          </p>
        </div>

        {/* Quick Facts */}
        <div className="rave-panel rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
            Quick Facts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Podcast Name', value: "Back n' Body Hurts" },
              { label: 'Host', value: 'BNB Crew' },
              { label: 'Launch Date', value: 'December 2023' },
              { label: 'Episode Count', value: allEpisodes.length },
              { label: 'Format', value: 'Bi-Weekly Talks, Interview & Discussion' },
              { label: 'Category', value: 'EDM' },
              { label: 'Location', value: 'Toronto, ON' },
              { label: 'Contact', value: 'info@bnbhurtspodcast.com' },
            ].map(({ label, value }) => (
              <div key={label}>
                <h3 className="font-bold mb-1" style={{ color: 'rgba(250,162,27,0.8)', fontFamily: 'var(--font-barlow), sans-serif' }}>
                  {label}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.75)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About the Show */}
        <div className="rave-panel rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
            About the Show
          </h2>
          <p className="mb-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Back n&apos; Body Hurts is a Toronto-based podcast covering all things EDM, from the host to the attendees. Ranging from tips,
            recommendations, real talk about local and worldwide events, and most importantly what makes raving great. Each episode features
            unscripted conversations with DJs, promoters, wellness experts, and scene veterans.
          </p>
          <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
            Since launching in late 2023, the show has published {allEpisodes.length} episodes and continues to grow,
            attracting a loyal audience of EDM enthusiasts who appreciate the show&apos;s authentic,
            community-driven approach.
          </p>
        </div>

        {/* Logo & Branding */}
        <div className="mb-12">
          <h2 className="font-black uppercase mb-6 leading-none"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white' }}>
            Logo & Branding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { bg: 'rgba(255,255,255,0.04)', label: 'Primary Logo', desc: 'High resolution PNG' },
              { bg: 'rgba(10,22,40,0.95)', label: 'Logo on Dark Background', desc: 'Optimized for dark backgrounds' },
            ].map(({ bg, label, desc }) => (
              <div key={label} className="rave-panel rounded-xl p-8">
                <div className="flex justify-center mb-4 rounded-lg p-8" style={{ background: bg }}>
                  <img src="/logo.png" alt="Back n' Body Hurts Logo" className="w-48 h-48 object-contain" />
                </div>
                <h3 className="font-bold text-white mb-2" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>{label}</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
                <a href="/logo.png" download="bnb-logo.png"
                  className="rave-btn w-full px-4 py-3 rounded-lg font-bold inline-flex items-center justify-center gap-2">
                  <Download className="h-5 w-5" />
                  Download PNG
                </a>
              </div>
            ))}
          </div>

          {/* Brand Colors */}
          <div className="mt-8 rave-panel rounded-xl p-8">
            <h3 className="text-xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
              Brand Colors
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Orange', hex: '#FAA21B', bg: '#FAA21B' },
                { name: 'Navy Blue', hex: '#112B4F', bg: '#112B4F' },
                { name: 'White', hex: '#FFFFFF', bg: '#FFFFFF', border: true },
                { name: 'Accent Blue', hex: '#1a3d5f', bg: '#1a3d5f' },
              ].map(({ name, hex, bg, border }) => (
                <div key={name}>
                  <div className="w-full h-24 rounded-lg mb-3"
                    style={{ backgroundColor: bg, border: border ? '1px solid rgba(255,255,255,0.2)' : 'none' }} />
                  <p className="font-bold text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{name}</p>
                  <p className="text-sm font-mono" style={{ color: 'rgba(255,255,255,0.45)' }}>{hex}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Downloadable Assets */}
        <div className="mb-12">
          <h2 className="font-black uppercase mb-6 leading-none"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white' }}>
            Downloadable Assets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: 'Media Kit PDF', desc: 'Complete press kit with all information and assets', label: 'Download PDF' },
              { icon: FileText, title: 'Host Photos', desc: 'High-resolution professional headshots', label: 'Download ZIP' },
              { icon: FileText, title: 'Cover Art', desc: 'Podcast cover art in various sizes', label: 'Download ZIP' },
              { icon: FileText, title: 'Promo Videos', desc: 'Short promotional clips for social media', label: 'Download ZIP' },
            ].map(({ icon: Icon, title, desc, label }) => (
              <div key={title} className="rave-card p-6 rounded-xl">
                <Icon className="h-10 w-10 text-[#FAA21B] mb-4" />
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>{title}</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>{desc}</p>
                <button className="rave-btn px-6 py-3 rounded-full font-bold inline-flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="rave-cta-box rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
            Media Inquiries
          </h2>
          <p className="font-medium mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            For interviews, features, or additional information, please contact our media team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@bnbhurtspodcast.com"
              className="rave-btn inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold">
              info@bnbhurtspodcast.com
            </a>
            <a href="mailto:info@bnbhurtspodcast.com"
              className="rave-btn-outline inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold">
              General Inquiries
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
