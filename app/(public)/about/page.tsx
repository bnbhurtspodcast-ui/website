import type { Metadata } from 'next'
import { Mail, Twitter, Instagram, Linkedin, Youtube, Music, Link, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Host } from '@/types'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "Meet the hosts of Back n' Body Hurts — a Toronto-based EDM podcast with unscripted conversations about rave culture, events, wellness, and the music scene.",
  openGraph: {
    title: "About Us | Back n' Body Hurts",
    description:
      "Meet the hosts of Back n' Body Hurts — a Toronto-based EDM podcast with unscripted conversations about rave culture, events, wellness, and the music scene.",
    url: '/about',
  },
  twitter: {
    card: 'summary',
    title: "About Us | Back n' Body Hurts",
    description:
      "Meet the hosts of Back n' Body Hurts — a Toronto-based EDM podcast with unscripted conversations about rave culture, events, wellness, and the music scene.",
  },
}

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase()
  const cls = 'h-5 w-5 text-[#112B4F]'
  if (p === 'instagram') return <Instagram className={cls} />
  if (p === 'twitter' || p === 'x') return <Twitter className={cls} />
  if (p === 'linkedin') return <Linkedin className={cls} />
  if (p === 'youtube') return <Youtube className={cls} />
  if (p === 'tiktok') return <Music className={cls} />
  return <Link className={cls} />
}

function HostCard({ host }: { host: Host }) {
  return (
    <div className="rave-card rave-card-lift rounded-2xl overflow-hidden flex flex-col">
      <div className="h-56 overflow-hidden">
        {host.photo_url ? (
          <img src={host.photo_url} alt={host.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(250,162,27,0.06)' }}>
            <Users className="h-20 w-20" style={{ color: 'rgba(250,162,27,0.3)' }} />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
          {host.name}
        </h3>
        {host.interests && (
          <p className="text-sm font-medium mb-3" style={{ color: '#FAA21B' }}>{host.interests}</p>
        )}
        {host.description && (
          <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{host.description}</p>
        )}
        {host.social_links && host.social_links.length > 0 && (
          <div className="flex gap-3 mt-4">
            {host.social_links.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}
                className="p-2 bg-[#FAA21B] hover:bg-[#FAA21B]/90 rounded-full transition-colors">
                <SocialIcon platform={link.platform} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default async function AboutPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('hosts')
    .select('*')
    .eq('role', 'host')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  const hosts = (data as Host[]) ?? []

  return (
    <div className="pt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div aria-hidden="true" className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(250,162,27,0.25) 0%, transparent 70%)', filter: 'blur(20px)', transform: 'scale(1.5)' }} />
              <img src="/logo.png" alt="Back n' Body Hurts Podcast" className="w-32 h-32 md:w-40 md:h-40 relative z-10" />
            </div>
          </div>
          <h1 className="font-black uppercase leading-none tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(3rem, 8vw, 5rem)', color: 'white', textShadow: '0 0 40px rgba(250,162,27,0.2)' }}>
            About Us
          </h1>
          <p className="text-xl font-medium leading-relaxed" style={{ color: '#FAA21B' }}>
            A Toronto-based podcast providing opinionated guidance for all involved in the rave scene from the host to the attendees
          </p>
        </div>

        {/* Hosts Section */}
        {hosts.length > 0 && (
          <div className="mb-16">
            <h2 className="font-black uppercase mb-8 leading-none"
              style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'white' }}>
              Meet Your Hosts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hosts.map((host) => <HostCard key={host.id} host={host} />)}
            </div>
          </div>
        )}

        {/* Mission */}
        <div className="mb-16">
          <h2 className="font-black uppercase mb-6 leading-none"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'white' }}>
            Our Mission
          </h2>
          <div className="space-y-4">
            {[
              "Back n' Body Hurts was born from Toronto's underground EDM scene. We cover tips, local and worldwide event recommendations, and have real conversations with the people who make the scene what it is.",
              "Each episode, we sit down for unscripted conversations with DJs, promoters, wellness experts, and scene veterans. We share stories, practical advice, and don't pretend to have all the answers.",
              "Whether you're looking for rave tips, event recommendations, or just want to hear real talk from the community, Back n' Body Hurts is here for you.",
            ].map((text, i) => (
              <p key={i} className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{text}</p>
            ))}
          </div>
        </div>

        {/* What We Cover */}
        <div className="mb-16">
          <h2 className="font-black uppercase mb-6 leading-none"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'white' }}>
            What We Cover
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { title: 'EDM Events & Festivals', description: 'Local Toronto events and worldwide festival coverage' },
              { title: 'Rave Wellness', description: 'Real talk about staying healthy and safe on the dance floor' },
              { title: 'DJ & Artist Features', description: 'Deep dives with the artists shaping the scene' },
              { title: 'Scene Culture', description: "The history, community, and culture of Toronto's EDM world" },
              { title: 'Music & Gear', description: 'Tips on music, production, and equipment for enthusiasts' },
              { title: 'Industry Insights', description: "Behind the scenes of the music industry and what's coming next" },
            ].map((topic) => (
              <div key={topic.title} className="rave-card p-6 rounded-xl">
                <h3 className="font-bold text-white mb-2" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
                  {topic.title}
                </h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{topic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="rave-cta-box rounded-2xl p-8 text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-[#FAA21B]" />
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
            Get in Touch
          </h2>
          <p className="mb-6 font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Have a guest suggestion or feedback? We&apos;d love to hear from you!
          </p>
          <a href="mailto:info@bnbhurtspodcast.com"
            className="rave-btn inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-lg">
            info@bnbhurtspodcast.com
          </a>
        </div>
      </div>
    </div>
  )
}
