import { Mail, Twitter, Instagram, Linkedin, Youtube, Music, Link, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { Host } from '@/types'

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
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-[#FAA21B]/30 overflow-hidden flex flex-col">
      <div className="h-56 overflow-hidden">
        {host.photo_url ? (
          <img
            src={host.photo_url}
            alt={host.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#FAA21B]/10">
            <Users className="h-20 w-20 text-[#FAA21B]/40" />
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-white mb-1">{host.name}</h3>
        {host.interests && (
          <p className="text-[#FAA21B] text-sm font-medium mb-3">{host.interests}</p>
        )}
        {host.description && (
          <p className="text-white/75 text-sm leading-relaxed flex-1">{host.description}</p>
        )}
        {host.social_links && host.social_links.length > 0 && (
          <div className="flex gap-3 mt-4">
            {host.social_links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.platform}
                className="p-2 bg-[#FAA21B] hover:bg-[#FAA21B]/90 rounded-full transition-colors"
              >
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
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  const hosts = (data as Host[]) ?? []

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Back n' Body Hurts Podcast" className="w-32 h-32 md:w-40 md:h-40" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Us
          </h1>
          <p className="text-xl text-[#FAA21B] font-medium leading-relaxed">
            A Toronto-based podcast providing opinionated guidance for all involve in the rave scene from the host to the attendees
          </p>
        </div>

        {/* Hosts Section */}
        {hosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">Meet Your Hosts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hosts.map((host) => (
                <HostCard key={host.id} host={host} />
              ))}
            </div>
          </div>
        )}

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
          <div className="space-y-4">
            <p className="text-white/80 leading-relaxed">
              Back n&apos; Body Hurts was born from Toronto&apos;s underground EDM scene. We cover
              tips, local and worldwide event recommendations, and have real conversations with the
              people who make the scene what it is.
            </p>
            <p className="text-white/80 leading-relaxed">
              Each episode, we sit down for unscripted conversations with DJs, promoters, wellness
              experts, and scene veterans. We share stories, practical advice, and don&apos;t pretend
              to have all the answers.
            </p>
            <p className="text-white/80 leading-relaxed">
              Whether you&apos;re looking for rave tips, event recommendations, or just want to hear
              real talk from the community, Back n&apos; Body Hurts is here for you.
            </p>
          </div>
        </div>

        {/* What We Cover */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">What We Cover</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'EDM Events & Festivals', description: 'Local Toronto events and worldwide festival coverage' },
              { title: 'Rave Wellness', description: 'Real talk about staying healthy and safe on the dance floor' },
              { title: 'DJ & Artist Features', description: 'Deep dives with the artists shaping the scene' },
              { title: 'Scene Culture', description: "The history, community, and culture of Toronto's EDM world" },
              { title: 'Music & Gear', description: 'Tips on music, production, and equipment for enthusiasts' },
              { title: 'Industry Insights', description: "Behind the scenes of the music industry and what's coming next" },
            ].map((topic) => (
              <div
                key={topic.title}
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border-2 border-[#FAA21B]/20 hover:border-[#FAA21B] transition-colors"
              >
                <h3 className="font-bold text-white mb-2">{topic.title}</h3>
                <p className="text-white/70 text-sm">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-[#FAA21B] rounded-2xl p-8 text-center">
          <Mail className="h-12 w-12 mx-auto mb-4 text-[#112B4F]" />
          <h2 className="text-2xl font-bold mb-4 text-[#112B4F]">Get in Touch</h2>
          <p className="mb-6 text-[#112B4F]/80 font-medium">
            Have a guest suggestion or feedback? We&apos;d love to hear from you!
          </p>
          <a
            href="mailto:info@bnbhurtspodcast.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#112B4F] text-white rounded-full font-bold hover:bg-[#112B4F]/90 transition-colors shadow-lg"
          >
            info@bnbhurtspodcast.com
          </a>
        </div>
      </div>
    </div>
  )
}
