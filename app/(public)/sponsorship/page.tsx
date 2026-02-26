import type { Metadata } from 'next'
import { TrendingUp, Target, Users, Zap, Send } from 'lucide-react'
import { submitSponsorshipInquiry } from '@/app/(public)/sponsorship/actions'

export const metadata: Metadata = {
  title: 'Sponsorship',
  description:
    "Sponsor Back n' Body Hurts and reach Toronto's engaged EDM community. View our Bronze, Silver, and Gold sponsorship packages.",
  openGraph: {
    title: "Sponsorship | Back n' Body Hurts",
    description:
      "Sponsor Back n' Body Hurts and reach Toronto's engaged EDM community. View our Bronze, Silver, and Gold sponsorship packages.",
    url: '/sponsorship',
  },
  twitter: {
    card: 'summary',
    title: "Sponsorship | Back n' Body Hurts",
    description:
      "Sponsor Back n' Body Hurts and reach Toronto's engaged EDM community. View our Bronze, Silver, and Gold sponsorship packages.",
  },
}

const packages = [
  {
    tier: 'Bronze',
    price: '$100',
    features: ['30-second mid-roll ad', 'Mention in show notes', 'Social media mention'],
    popular: false,
  },
  {
    tier: 'Silver',
    price: '$250',
    features: ['60-second pre-roll ad', '30-second mid-roll ad', 'Featured in show notes', 'Multiple social posts', 'Website banner placement'],
    popular: true,
  },
  {
    tier: 'Gold',
    price: '$500',
    features: ['Exclusive episode sponsor', 'Host-read advertisements', 'Custom integration', 'All Silver benefits', 'Dedicated email feature', 'Analytics & reporting'],
    popular: false,
  },
]

export default async function SponsorshipPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error } = await searchParams

  return (
    <div className="pt-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {success === 'true' && (
          <div className="mb-8 px-5 py-4 rounded-xl font-medium"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.35)', color: 'rgb(134,239,172)' }}>
            Your sponsorship inquiry was submitted successfully. We&apos;ll be in touch soon!
          </div>
        )}
        {error && (
          <div className="mb-8 px-5 py-4 rounded-xl font-medium"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.35)', color: 'rgb(252,165,165)' }}>
            {decodeURIComponent(error)}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="rave-icon-box w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ boxShadow: '0 0 20px rgba(250,162,27,0.15)' }}>
            <TrendingUp className="h-10 w-10 text-[#FAA21B]" />
          </div>
          <h1 className="font-black uppercase leading-none tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(2rem, 6vw, 4rem)', color: 'white' }}>
            Sponsor Back n&apos; Body Hurts
          </h1>
          <p className="text-xl font-medium mb-4" style={{ color: '#FAA21B' }}>
            Reach an engaged audience that matters
          </p>
          <p className="max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Partner with us to connect with Toronto&apos;s EDM community. Our audience is engaged,
            diverse, and ready to hear from brands they can trust.
          </p>
        </div>

        {/* Sponsorship Packages */}
        <div className="mb-12">
          <h2 className="font-black uppercase text-center mb-8 leading-none"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white' }}>
            Sponsorship Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map(({ tier, price, features, popular }) => (
              <div
                key={tier}
                className={`rounded-2xl p-8 ${popular ? 'relative' : 'rave-card'}`}
                style={
                  popular
                    ? {
                        background: 'rgba(17,43,79,0.9)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(250,162,27,0.7)',
                        boxShadow: '0 0 40px rgba(250,162,27,0.2), 0 0 80px rgba(250,162,27,0.08), inset 0 0 20px rgba(250,162,27,0.04)',
                        transform: 'scale(1.03)',
                      }
                    : undefined
                }
              >
                {popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-bold"
                    style={{ backgroundColor: '#FAA21B', color: '#112B4F', boxShadow: '0 0 16px rgba(250,162,27,0.55)' }}>
                    POPULAR
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
                  {tier}
                </h3>
                <div className="text-3xl font-bold text-[#FAA21B] mb-6">
                  {price}<span className="text-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>/episode</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {features.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Zap className="h-5 w-5 text-[#FAA21B] flex-shrink-0 mt-0.5" />
                      <span style={{ color: 'rgba(255,255,255,0.75)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Why Partner With Us */}
        <div className="mb-12">
          <h2 className="font-black uppercase text-center mb-8 leading-none"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'white' }}>
            Why Partner With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { Icon: Target, title: 'Targeted Audience', desc: "Reach listeners who are actively engaged in Toronto's EDM scene." },
              { Icon: Users, title: 'Authentic Integration', desc: 'Host-read ads that feel natural and resonate with our audience.' },
              { Icon: TrendingUp, title: 'Proven Results', desc: 'Track record of delivering measurable ROI for our partners.' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="rave-card p-6 rounded-xl">
                <Icon className="h-10 w-10 text-[#FAA21B] mb-4" />
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
                  {title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.65)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inquiry Form */}
        <div className="rave-panel rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
            Request a Sponsorship Proposal
          </h2>
          <form action={submitSponsorshipInquiry} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Company Name *</label>
                <input type="text" id="companyName" name="companyName" required placeholder="Your company name"
                  className="rave-input w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Contact Name *</label>
                <input type="text" id="contactName" name="contactName" required placeholder="Your full name"
                  className="rave-input w-full px-4 py-3 rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Email Address *</label>
                <input type="email" id="email" name="email" required placeholder="your@email.com"
                  className="rave-input w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label htmlFor="budget" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Estimated Budget</label>
                <select id="budget" name="budget" className="rave-input w-full px-4 py-3 rounded-lg">
                  <option value="">Select a range</option>
                  <option value="under-1k">Under $1,000</option>
                  <option value="1k-5k">$1,000 - $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="over-10k">Over $10,000</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Campaign Goals *</label>
              <input type="text" id="goals" name="goals" required
                placeholder="e.g., Brand awareness, event promotion, product launch"
                className="rave-input w-full px-4 py-3 rounded-lg" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Additional Information</label>
              <textarea id="message" name="message" rows={4}
                placeholder="Tell us more about your sponsorship goals..."
                className="rave-input w-full px-4 py-3 rounded-lg resize-none" />
            </div>

            <button type="submit"
              className="rave-btn w-full md:w-auto px-8 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-lg">
              <Send className="h-5 w-5" />
              Request Proposal
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
