import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: "Privacy policy for the Back n' Body Hurts Podcast website — how we collect, use, and protect your information.",
  openGraph: {
    title: "Privacy Policy | Back n' Body Hurts",
    description: "Privacy policy for the Back n' Body Hurts Podcast website.",
    url: '/privacy',
    images: [{ url: '/logo.png', width: 1400, height: 1400, alt: "Back n' Body Hurts Podcast" }],
  },
  twitter: {
    card: 'summary',
    title: "Privacy Policy | Back n' Body Hurts",
    description: "Privacy policy for the Back n' Body Hurts Podcast website.",
    images: ['/logo.png'],
  },
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2
        className="text-xl font-bold mb-3 pb-2 border-b"
        style={{
          fontFamily: 'var(--font-barlow), sans-serif',
          color: '#FAA21B',
          borderColor: 'rgba(250,162,27,0.2)',
        }}
      >
        {title}
      </h2>
      <div className="space-y-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
        {children}
      </div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-extrabold mb-3"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', color: '#FAA21B' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Last updated: March 15, 2026
          </p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Back n&apos; Body Hurts Podcast (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to
            protecting your privacy. This Privacy Policy explains what information we collect, how we
            use it, and your rights. We comply with Canada&apos;s{' '}
            <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) as well as
            applicable provisions of the GDPR, CCPA, and the privacy policies of Meta, TikTok, YouTube,
            and Apple.
          </p>
        </div>

        <Section title="1. Who We Are">
          <p>
            Back n&apos; Body Hurts Podcast is a Canadian podcast based in Ontario. We create and
            distribute our own podcast content across multiple platforms. We do{' '}
            <strong style={{ color: '#FAA21B' }}>not</strong> manage social media content or data on
            behalf of third parties.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We only collect personal information that you voluntarily provide to us through our website forms:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Contact form</strong> — name, email
              address, and message
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Guest submission form</strong> — name,
              contact details, and any information you choose to share about yourself as a potential guest
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Sponsorship inquiry form</strong> — name,
              company, and contact information
            </li>
          </ul>
          <p>
            We do <strong style={{ color: '#FAA21B' }}>not</strong> collect sensitive personal information
            such as payment details, government IDs, or biometric data through this website.
          </p>
          <p>
            We do <strong style={{ color: '#FAA21B' }}>not</strong> offer public account registration.
            All administrative accounts are internal and are created manually by our team. No user data
            is stored in connection with account creation for the general public.
          </p>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>Information collected through our forms is used solely to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Respond to your inquiry or submission</li>
            <li>Evaluate guest and sponsorship applications</li>
            <li>Communicate with you regarding your request</li>
          </ul>
          <p>
            We will <strong style={{ color: '#FAA21B' }}>never</strong> sell, rent, or share your
            personal information with third parties for marketing or commercial purposes.
          </p>
        </Section>

        <Section title="4. Data Retention">
          <p>
            Form submissions are stored in our secure database only for as long as necessary to fulfill
            the purpose for which they were collected — typically until the inquiry has been addressed or
            the application reviewed. We periodically review and delete submissions that are no longer
            needed.
          </p>
        </Section>

        <Section title="5. Cookies & Analytics">
          <p>
            This website may use standard browser cookies for session management and basic functionality.
            We do <strong style={{ color: '#FAA21B' }}>not</strong> use advertising cookies, tracking
            pixels, or third-party behavioral analytics platforms. We do not build advertising profiles
            about you.
          </p>
          <p>
            You can configure your browser to refuse cookies or to alert you when cookies are being sent.
            Note that some parts of the site may not function properly without cookies.
          </p>
        </Section>

        <Section title="6. Third-Party Services">
          <p>
            We use the following third-party services in the operation of this website and our content
            distribution. Each service has its own privacy policy:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Supabase</strong> — secure cloud
              database used to store form submissions.{' '}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#FAA21B' }}>
                Supabase Privacy Policy
              </a>
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Meta (Instagram &amp; Facebook)</strong> —
              we post content to Meta platforms and may embed Instagram content on this site. Meta may
              collect data when you interact with embedded content.{' '}
              <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" style={{ color: '#FAA21B' }}>
                Meta Privacy Policy
              </a>
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>TikTok</strong> — we post content to
              TikTok. TikTok may collect data about how you interact with our content on their platform.{' '}
              <a href="https://www.tiktok.com/legal/page/us/privacy-policy/en" target="_blank" rel="noopener noreferrer" style={{ color: '#FAA21B' }}>
                TikTok Privacy Policy
              </a>
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>YouTube (Google)</strong> — we publish
              episodes to YouTube and may embed YouTube videos on this site. Google may collect data when
              you interact with embedded players.{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#FAA21B' }}>
                Google Privacy Policy
              </a>
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>PayPal</strong> — used to process
              donations. PayPal independently collects and processes your payment information.{' '}
              <a href="https://www.paypal.com/us/legalhub/privacy-full" target="_blank" rel="noopener noreferrer" style={{ color: '#FAA21B' }}>
                PayPal Privacy Policy
              </a>
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Stripe, Apple Pay &amp; Google Pay</strong> —
              will be used for payment processing when our online shop launches. These processors handle
              all payment data independently and securely; we do not receive or store your raw payment
              details.{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#FAA21B' }}>
                Stripe Privacy Policy
              </a>
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Apple App Store</strong> — if our
              content is distributed through Apple Podcasts or an App Store app, Apple independently
              collects usage data subject to their privacy policy.{' '}
              <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener noreferrer" style={{ color: '#FAA21B' }}>
                Apple Privacy Policy
              </a>
            </li>
          </ul>
        </Section>

        <Section title="7. PIPEDA Compliance (Canada)">
          <p>
            As a Canadian business, we comply with the{' '}
            <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA). Our practices
            are guided by its 10 fair information principles:
          </p>
          <ol className="list-decimal pl-5 space-y-1">
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Accountability</strong> — we are responsible for personal information we hold.</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Identifying Purposes</strong> — we identify why we collect information before or at the time of collection.</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Consent</strong> — we obtain your knowledge and consent when collecting personal information.</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Limiting Collection</strong> — we collect only what is necessary for the identified purpose.</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Limiting Use, Disclosure &amp; Retention</strong> — we use and retain information only as long as needed.</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Accuracy</strong> — we keep personal information as accurate and up-to-date as necessary.</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Safeguards</strong> — we protect personal information with appropriate security measures.</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Openness</strong> — we make our privacy policies readily available (this document).</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Individual Access</strong> — you have the right to access your personal information we hold.</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Challenging Compliance</strong> — you may contact us to address concerns about our privacy practices.</li>
          </ol>
        </Section>

        <Section title="8. Your Rights (GDPR / CCPA)">
          <p>
            Regardless of where you are located, you have the following rights regarding your personal
            information:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Right to Access</strong> — request a copy of the personal information we hold about you</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Right to Correction</strong> — request correction of inaccurate information</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Right to Deletion</strong> — request deletion of your personal information</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Right to Withdraw Consent</strong> — withdraw consent to our processing at any time</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Right to Data Portability</strong> — receive your data in a structured, machine-readable format</li>
            <li><strong style={{ color: 'rgba(255,255,255,0.85)' }}>Right to Object</strong> — object to processing in certain circumstances</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href="mailto:bnbhurtspodcast@gmail.com" style={{ color: '#FAA21B' }}>
              bnbhurtspodcast@gmail.com
            </a>
            . We will respond within 30 days.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            This website is not directed at children under the age of 13. We do not knowingly collect
            personal information from children under 13. If you believe we have inadvertently collected
            such information, please contact us immediately and we will delete it promptly. This policy
            is consistent with the Children&apos;s Online Privacy Protection Act (COPPA).
          </p>
        </Section>

        <Section title="10. Data Security">
          <p>
            We take reasonable technical and organizational measures to protect your personal information
            against unauthorized access, loss, or misuse. Form submission data is stored in Supabase,
            which employs industry-standard security practices including encryption at rest and in
            transit.
          </p>
          <p>
            While we strive to protect your information, no method of transmission over the Internet or
            electronic storage is 100% secure. We cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top
            of this page reflects any changes. We encourage you to review this page periodically.
            Continued use of the website after changes are posted constitutes your acceptance of the
            updated policy.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>
            For any privacy-related questions, concerns, or requests — including requests to access,
            correct, or delete your personal information — please contact us:
          </p>
          <div
            className="mt-3 p-4 rounded-xl"
            style={{ background: 'rgba(17,43,79,0.6)', border: '1px solid rgba(250,162,27,0.15)' }}
          >
            <p className="font-semibold" style={{ color: '#FAA21B' }}>
              Back n&apos; Body Hurts Podcast
            </p>
            <p>Ontario, Canada</p>
            <a
              href="mailto:bnbhurtspodcast@gmail.com"
              style={{ color: '#FAA21B' }}
            >
              bnbhurtspodcast@gmail.com
            </a>
          </div>
          <p className="mt-3">
            If you are a Canadian resident and believe your privacy rights under PIPEDA have been
            violated, you may also file a complaint with the{' '}
            <a
              href="https://www.priv.gc.ca/en/report-a-concern/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#FAA21B' }}
            >
              Office of the Privacy Commissioner of Canada
            </a>
            .
          </p>
        </Section>
      </div>
    </div>
  )
}
