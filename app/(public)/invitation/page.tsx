import type { Metadata } from 'next'
import { CalendarDays, Send } from 'lucide-react'
import { submitInvitation } from '@/app/(public)/invitation/actions'

export const metadata: Metadata = {
  title: 'Invite Us to Your Show',
  description:
    "Invite the Back n' Body Hurts podcast hosts to your event. Tell us about the show and we'll get back to you!",
  keywords: ['invite BnB Hurts', 'EDM podcast event invitation'],
  openGraph: {
    title: "Invite Us | Back n' Body Hurts",
    description: "Invite the Back n' Body Hurts podcast hosts to your event.",
    url: '/invitation',
    images: [{ url: '/logo.png', width: 1400, height: 1400, alt: "Back n' Body Hurts Podcast" }],
  },
  twitter: {
    card: 'summary',
    title: "Invite Us | Back n' Body Hurts",
    description: "Invite the Back n' Body Hurts podcast hosts to your event.",
    images: ['/logo.png'],
  },
}

export default async function InvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error } = await searchParams
  const formToken = Buffer.from(Date.now().toString()).toString('base64')

  return (
    <div className="py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {success === 'true' && (
          <div
            className="mb-8 px-5 py-4 rounded-xl font-medium"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.35)',
              color: 'rgb(134,239,172)',
            }}
          >
            Your invitation was submitted! We&apos;ll be in touch soon.
          </div>
        )}
        {error && (
          <div
            className="mb-8 px-5 py-4 rounded-xl font-medium"
            style={{
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.35)',
              color: 'rgb(252,165,165)',
            }}
          >
            {decodeURIComponent(error)}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-6"
            style={{ background: 'rgba(250,162,27,0.12)', border: '1px solid rgba(250,162,27,0.3)' }}>
            <CalendarDays className="h-7 w-7 text-[#FAA21B]" />
          </div>
          <h1
            className="font-black uppercase leading-none tracking-tight mb-4"
            style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
              color: 'white',
            }}
          >
            Invite Us to Your Show
          </h1>
          <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Fill in the details below and we&apos;ll check it out. We love discovering new events!
          </p>
        </div>

        {/* Form */}
        <div className="rave-panel rounded-2xl p-8">
          <form action={submitInvitation} className="space-y-8">
            {/* Spam protection */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '-9999px',
                opacity: 0,
                pointerEvents: 'none',
                height: 0,
                overflow: 'hidden',
              }}
            >
              <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
            </div>
            <input type="hidden" name="form_token" value={formToken} />

            {/* Event Details */}
            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#FAA21B' }}>
                Event Details
              </legend>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event_name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      Event Name <span style={{ color: '#FAA21B' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="event_name"
                      name="event_name"
                      required
                      placeholder="e.g. Summer Rave 2026"
                      className="rave-input w-full px-4 py-3 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="event_date" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      Event Date
                    </label>
                    <input
                      type="date"
                      id="event_date"
                      name="event_date"
                      className="rave-input w-full px-4 py-3 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="event_type" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      Event Type <span style={{ color: '#FAA21B' }}>*</span>
                    </label>
                    <select
                      id="event_type"
                      name="event_type"
                      required
                      className="rave-input w-full px-4 py-3 rounded-lg"
                    >
                      <option value="event">Event</option>
                      <option value="festival">Festival</option>
                      <option value="concert">Concert</option>
                      <option value="club_night">Club Night</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="is_free" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      Is it free? <span style={{ color: '#FAA21B' }}>*</span>
                    </label>
                    <select
                      id="is_free"
                      name="is_free"
                      required
                      className="rave-input w-full px-4 py-3 rounded-lg"
                    >
                      <option value="true">Yes — Free</option>
                      <option value="false">No — Paid</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="ticket_price" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Ticket Price <span style={{ color: 'rgba(255,255,255,0.35)' }}>(if paid — leave blank if free)</span>
                  </label>
                  <input
                    type="text"
                    id="ticket_price"
                    name="ticket_price"
                    placeholder="e.g. $20, $15–$30, Free with RSVP"
                    className="rave-input w-full px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            </fieldset>

            {/* Venue */}
            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#FAA21B' }}>
                Venue
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="venue_name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Venue Name
                  </label>
                  <input
                    type="text"
                    id="venue_name"
                    name="venue_name"
                    placeholder="e.g. Rebel Toronto"
                    className="rave-input w-full px-4 py-3 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="venue_location" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Location / City
                  </label>
                  <input
                    type="text"
                    id="venue_location"
                    name="venue_location"
                    placeholder="e.g. Toronto, ON"
                    className="rave-input w-full px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            </fieldset>

            {/* More Info */}
            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#FAA21B' }}>
                More Info
              </legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Event Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    placeholder="Tell us about the event — lineup, vibe, etc."
                    className="rave-input w-full px-4 py-3 rounded-lg resize-none"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Message / Notes for Us
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Anything else you'd like us to know?"
                    className="rave-input w-full px-4 py-3 rounded-lg resize-none"
                  />
                </div>
              </div>
            </fieldset>

            {/* Contact Info */}
            <fieldset>
              <legend className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: '#FAA21B' }}>
                Your Contact Info
              </legend>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact_name" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      Your Name <span style={{ color: '#FAA21B' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="contact_name"
                      name="contact_name"
                      required
                      placeholder="Jane Smith"
                      className="rave-input w-full px-4 py-3 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact_email" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                      Email <span style={{ color: '#FAA21B' }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="contact_email"
                      name="contact_email"
                      required
                      placeholder="jane@example.com"
                      className="rave-input w-full px-4 py-3 rounded-lg"
                    />
                  </div>
                </div>
                <div className="md:w-1/2">
                  <label htmlFor="contact_phone" className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.75)' }}>
                    Phone <span style={{ color: 'rgba(255,255,255,0.35)' }}>(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="contact_phone"
                    name="contact_phone"
                    placeholder="+1 (416) 555-0100"
                    className="rave-input w-full px-4 py-3 rounded-lg"
                  />
                </div>
              </div>
            </fieldset>

            <button
              type="submit"
              className="rave-btn w-full md:w-auto px-8 py-4 rounded-full font-bold inline-flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="h-5 w-5" />
              Send Invitation
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
