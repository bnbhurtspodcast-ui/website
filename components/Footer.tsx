import Link from 'next/link'
import { Instagram, Youtube, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        backgroundColor: '#060f1e',
        borderColor: 'rgba(250,162,27,0.12)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="Back n' Body Hurts Podcast" className="h-12 w-12" />
              <span
                className="text-xl font-bold text-white tracking-wide"
                style={{ fontFamily: 'var(--font-barlow), sans-serif' }}
              >
                Back n&apos; Body Hurts
              </span>
            </div>
            <p className="mb-4 max-w-md text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Providing opinionated guidance for all involved in the rave scene — from the host to the attendees
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://www.instagram.com/bnbhurtspodcast/', Icon: Instagram, label: 'Instagram' },
                { href: 'https://www.youtube.com/@BnBHurtsPodcast', Icon: Youtube, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full transition-all duration-200 group"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(250,162,27,0.12)'
                    el.style.borderColor = 'rgba(250,162,27,0.5)'
                    el.style.boxShadow = '0 0 14px rgba(250,162,27,0.25)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = 'rgba(255,255,255,0.05)'
                    el.style.borderColor = 'rgba(255,255,255,0.1)'
                    el.style.boxShadow = 'none'
                  }}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 text-white/60 group-hover:text-[#FAA21B] transition-colors" />
                </a>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <a
                href="https://www.youtube.com/@BnBHurtsPodcast?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all"
                style={{ backgroundColor: '#FF0000' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 14px rgba(255,0,0,0.45)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                <Youtube className="h-4 w-4" />
                Subscribe
              </a>
              <a
                href="https://www.paypal.com/donate/?hosted_button_id=SMDDJYTZD9R52"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{ backgroundColor: '#FAA21B', color: '#112B4F' }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 0 14px rgba(250,162,27,0.45)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                }}
              >
                Donate
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-white font-bold mb-4 text-xs uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-barlow), sans-serif' }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/episodes', label: 'Episodes' },
                { href: '/about', label: 'About' },
                { href: '/admin/signin', label: 'Backstage Pass' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={(e) => { ;(e.currentTarget as HTMLElement).style.color = '#FAA21B' }}
                    onMouseLeave={(e) => { ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-white font-bold mb-4 text-xs uppercase tracking-widest"
              style={{ fontFamily: 'var(--font-barlow), sans-serif' }}
            >
              Get in Touch
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="flex items-center gap-2 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={(e) => { ;(e.currentTarget as HTMLElement).style.color = '#FAA21B' }}
                  onMouseLeave={(e) => { ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}
                >
                  <Mail className="h-3.5 w-3.5" />
                  Contact Us
                </Link>
              </li>
              {[
                { href: '/guest-submission', label: 'Guest Submissions' },
                { href: '/sponsorship', label: 'Sponsorship' },
                { href: '/press-kit', label: 'Press Kit' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="transition-colors"
                    style={{ color: 'rgba(255,255,255,0.55)' }}
                    onMouseEnter={(e) => { ;(e.currentTarget as HTMLElement).style.color = '#FAA21B' }}
                    onMouseLeave={(e) => { ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            &copy; 2026 Back n&apos; Body Hurts Podcast. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
