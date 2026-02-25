import type { Metadata } from 'next'
import { Mic, Users, Calendar, Send } from 'lucide-react'
import { submitGuestApplication } from './actions'

export const metadata: Metadata = {
  title: 'Be a Guest',
  description:
    "Apply to be a guest on Back n' Body Hurts. Share your expertise in DJing, event production, rave wellness, or EDM culture with our Toronto audience.",
  openGraph: {
    title: "Be a Guest | Back n' Body Hurts",
    description:
      "Apply to be a guest on Back n' Body Hurts. Share your expertise in DJing, event production, rave wellness, or EDM culture with our Toronto audience.",
    url: '/guest-submission',
  },
  twitter: {
    card: 'summary',
    title: "Be a Guest | Back n' Body Hurts",
    description:
      "Apply to be a guest on Back n' Body Hurts. Share your expertise in DJing, event production, rave wellness, or EDM culture with our Toronto audience.",
  },
}

export default async function GuestSubmissionPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error } = await searchParams

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {success === 'true' && (
          <div className="mb-8 px-5 py-4 rounded-xl font-medium"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.35)', color: 'rgb(134,239,172)' }}>
            Your application was submitted successfully. We&apos;ll be in touch soon!
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
            <Mic className="h-10 w-10 text-[#FAA21B]" />
          </div>
          <h1 className="font-black uppercase leading-none tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', color: 'white' }}>
            Be a Guest
          </h1>
          <p className="text-xl font-medium mb-4" style={{ color: '#FAA21B' }}>
            Share your story with our audience
          </p>
          <p className="max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.65)' }}>
            We&apos;re always looking for interesting people with unique perspectives. If you think
            you&apos;d be a great fit for Back n&apos; Body Hurts, we&apos;d love to hear from you!
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { Icon: Users, title: 'Reach Our Community', desc: 'Share your message with our engaged EDM community' },
            { Icon: Mic, title: 'Professional Production', desc: 'High-quality audio and editing' },
            { Icon: Calendar, title: 'Flexible Scheduling', desc: 'Remote or in-studio options available' },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="rave-card p-6 rounded-xl text-center">
              <Icon className="h-8 w-8 text-[#FAA21B] mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
                {title}
              </h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div className="rave-panel rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
            Guest Application
          </h2>
          <form action={submitGuestApplication} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Full Name *</label>
                <input type="text" id="name" name="name" required placeholder="Your full name"
                  className="rave-input w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Email Address *</label>
                <input type="email" id="email" name="email" required placeholder="your@email.com"
                  className="rave-input w-full px-4 py-3 rounded-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="(416) 123-4567"
                  className="rave-input w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label htmlFor="socialMedia" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Social Media Handle</label>
                <input type="text" id="socialMedia" name="socialMedia" placeholder="@yourhandle"
                  className="rave-input w-full px-4 py-3 rounded-lg" />
              </div>
            </div>

            <div>
              <label htmlFor="expertise" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Area of Expertise *</label>
              <input type="text" id="expertise" name="expertise" required
                placeholder="e.g., DJing, Event Production, Rave Wellness"
                className="rave-input w-full px-4 py-3 rounded-lg" />
            </div>

            <div>
              <label htmlFor="topicIdea" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Proposed Topic/Discussion Idea *</label>
              <input type="text" id="topicIdea" name="topicIdea" required
                placeholder="What would you like to discuss?"
                className="rave-input w-full px-4 py-3 rounded-lg" />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Brief Bio *</label>
              <textarea id="bio" name="bio" required rows={5}
                placeholder="Tell us about yourself and why you'd be a great guest..."
                className="rave-input w-full px-4 py-3 rounded-lg resize-none" />
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Availability</label>
              <select id="availability" name="availability"
                className="rave-input w-full px-4 py-3 rounded-lg">
                <option value="">Select your availability</option>
                <option value="weekday-morning">Weekday Mornings</option>
                <option value="weekday-afternoon">Weekday Afternoons</option>
                <option value="weekday-evening">Weekday Evenings</option>
                <option value="weekend">Weekends</option>
                <option value="flexible">Flexible</option>
              </select>
            </div>

            <button type="submit"
              className="rave-btn w-full md:w-auto px-8 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-lg">
              <Send className="h-5 w-5" />
              Submit Application
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
