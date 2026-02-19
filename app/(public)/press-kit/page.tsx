import { Download, FileText, Newspaper } from 'lucide-react'
import { getEpisodes } from '@/lib/rss'

export default async function PressKitPage() {
  const allEpisodes = await getEpisodes()

  return (
    <div className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#FAA21B] rounded-full flex items-center justify-center mx-auto mb-6">
            <Newspaper className="h-10 w-10 text-[#112B4F]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Press Kit</h1>
          <p className="text-xl text-[#FAA21B] font-medium mb-4">Media resources and brand assets</p>
          <p className="text-white/80 max-w-2xl mx-auto">
            Everything you need to write about or feature Back n&apos; Body Hurts Podcast. All assets
            are free to use for press and promotional purposes.
          </p>
        </div>

        {/* Quick Facts */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-6">Quick Facts</h2>
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
                <h3 className="font-bold text-[#112B4F] mb-1">{label}</h3>
                <p className="text-gray-700">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* About the Show */}
        <div className="bg-white rounded-2xl p-8 mb-12 shadow-xl">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-4">About the Show</h2>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Back n&apos; Body Hurts is a Toronto-based podcast covering all things EDM, from the host to the attendees. Ranging from tips,
            recommendations, real talk about local and worldwide events, and most importantly what makes raving great. Each episode features
            unscripted conversations with DJs, promoters, wellness experts, and scene veterans.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Since launching in late 2023, the show has published {allEpisodes.length} episodes and continues to grow,
            attracting a loyal audience of EDM enthusiasts who appreciate the show&apos;s authentic,
            community-driven approach.
          </p>
        </div>

        {/* Logo & Branding */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Logo & Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-8">
              <div className="flex justify-center mb-4 bg-gray-100 rounded-lg p-8">
                <img src="/logo.png" alt="Back n' Body Hurts Logo" className="w-48 h-48 object-contain" />
              </div>
              <h3 className="font-bold text-[#112B4F] mb-2">Primary Logo</h3>
              <p className="text-gray-700 text-sm mb-4">High resolution PNG</p>
              <a
                href="/logo.png"
                download="bnb-logo.png"
                className="w-full px-4 py-3 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download PNG
              </a>
            </div>

            <div className="bg-white rounded-xl p-8">
              <div className="flex justify-center mb-4 bg-[#112B4F] rounded-lg p-8">
                <img src="/logo.png" alt="Back n' Body Hurts Logo" className="w-48 h-48 object-contain" />
              </div>
              <h3 className="font-bold text-[#112B4F] mb-2">Logo on Dark Background</h3>
              <p className="text-gray-700 text-sm mb-4">Optimized for dark backgrounds</p>
              <a
                href="/logo.png"
                download="bnb-logo-dark.png"
                className="w-full px-4 py-3 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                Download PNG
              </a>
            </div>
          </div>

          {/* Brand Colors */}
          <div className="mt-8 bg-white rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#112B4F] mb-6">Brand Colors</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Orange', hex: '#FAA21B', bg: '#FAA21B' },
                { name: 'Navy Blue', hex: '#112B4F', bg: '#112B4F' },
                { name: 'White', hex: '#FFFFFF', bg: '#FFFFFF', border: true },
                { name: 'Accent Blue', hex: '#1a3d5f', bg: '#1a3d5f' },
              ].map(({ name, hex, bg, border }) => (
                <div key={name}>
                  <div
                    className={`w-full h-24 rounded-lg mb-3 ${border ? 'border-2 border-gray-300' : ''}`}
                    style={{ backgroundColor: bg }}
                  />
                  <p className="font-bold text-[#112B4F] text-sm">{name}</p>
                  <p className="text-gray-600 text-sm font-mono">{hex}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Downloadable Assets */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Downloadable Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: 'Media Kit PDF', desc: 'Complete press kit with all information and assets', label: 'Download PDF' },
              { icon: FileText, title: 'Host Photos', desc: 'High-resolution professional headshots', label: 'Download ZIP' },
              { icon: FileText, title: 'Cover Art', desc: 'Podcast cover art in various sizes', label: 'Download ZIP' },
              { icon: FileText, title: 'Promo Videos', desc: 'Short promotional clips for social media', label: 'Download ZIP' },
            ].map(({ icon: Icon, title, desc, label }) => (
              <div key={title} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border-2 border-[#FAA21B]/20">
                <Icon className="h-10 w-10 text-[#FAA21B] mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/70 text-sm mb-4">{desc}</p>
                <button className="px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors inline-flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {label}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-[#FAA21B] rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#112B4F] mb-4">Media Inquiries</h2>
          <p className="text-[#112B4F]/80 mb-6 font-medium">
            For interviews, features, or additional information, please contact our media team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:info@bnbhurtspodcast.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#112B4F] text-white rounded-full font-bold hover:bg-[#112B4F]/90 transition-colors">
              info@bnbhurtspodcast.com
            </a>
            <a href="mailto:info@bnbhurtspodcast.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#112B4F] rounded-full font-bold hover:bg-white/90 transition-colors">
              General Inquiries
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
