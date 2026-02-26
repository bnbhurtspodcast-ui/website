import type { Metadata } from 'next'
import { Mail, MapPin, Send } from 'lucide-react'
import { submitContactForm } from './actions'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    "Get in touch with the Back n' Body Hurts team. Send us your questions, feedback, or guest suggestions — we'd love to hear from you.",
  openGraph: {
    title: "Contact | Back n' Body Hurts",
    description:
      "Get in touch with the Back n' Body Hurts team. Send us your questions, feedback, or guest suggestions.",
    url: '/contact',
  },
  twitter: {
    card: 'summary',
    title: "Contact | Back n' Body Hurts",
    description:
      "Get in touch with the Back n' Body Hurts team. Send us your questions, feedback, or guest suggestions.",
  },
}

export default async function ContactPage({
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
            Your message was sent successfully. We&apos;ll get back to you soon!
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
          <h1 className="font-black uppercase leading-none tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', color: 'white' }}>
            Contact Us
          </h1>
          <p className="text-xl font-medium" style={{ color: '#FAA21B' }}>
            Got questions? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {[
            {
              Icon: Mail,
              title: 'Email',
              content: (
                <a href="mailto:info@bnbhurtspodcast.com" className="text-[#FAA21B] hover:underline">
                  info@bnbhurtspodcast.com
                </a>
              ),
            },
            {
              Icon: MapPin,
              title: 'Location',
              content: <p style={{ color: '#FAA21B' }}>Toronto, ON</p>,
            },
          ].map(({ Icon, title, content }) => (
            <div key={title} className="rave-card p-6 rounded-xl">
              <div className="rave-icon-box w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-[#FAA21B]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
              {content}
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="rave-panel rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-barlow), sans-serif' }}>
            Send us a message
          </h2>

          <form action={submitContactForm} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Your Name
                </label>
                <input type="text" id="name" name="name" required placeholder="John Doe"
                  className="rave-input w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  Email Address
                </label>
                <input type="email" id="email" name="email" required placeholder="john@example.com"
                  className="rave-input w-full px-4 py-3 rounded-lg" />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Subject
              </label>
              <input type="text" id="subject" name="subject" required placeholder="How can we help?"
                className="rave-input w-full px-4 py-3 rounded-lg" />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Message
              </label>
              <textarea id="message" name="message" required rows={6} placeholder="Tell us what's on your mind..."
                className="rave-input w-full px-4 py-3 rounded-lg resize-none" />
            </div>

            <button type="submit"
              className="rave-btn w-full md:w-auto px-8 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-lg">
              <Send className="h-5 w-5" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
