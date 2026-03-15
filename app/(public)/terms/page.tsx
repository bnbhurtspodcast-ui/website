import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the Back n' Body Hurts Podcast website.",
  openGraph: {
    title: "Terms & Conditions | Back n' Body Hurts",
    description: "Terms and conditions for using the Back n' Body Hurts Podcast website.",
    url: '/terms',
    images: [{ url: '/logo.png', width: 1400, height: 1400, alt: "Back n' Body Hurts Podcast" }],
  },
  twitter: {
    card: 'summary',
    title: "Terms & Conditions | Back n' Body Hurts",
    description: "Terms and conditions for using the Back n' Body Hurts Podcast website.",
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

export default function TermsPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <h1
            className="text-4xl font-extrabold mb-3"
            style={{ fontFamily: 'var(--font-barlow), sans-serif', color: '#FAA21B' }}
          >
            Terms &amp; Conditions
          </h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Last updated: March 15, 2026
          </p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Welcome to the Back n&apos; Body Hurts Podcast website. By accessing or using this website
            you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not
            use this site.
          </p>
        </div>

        <Section title="1. About This Website">
          <p>
            This website is operated by Back n&apos; Body Hurts Podcast (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or
            &ldquo;our&rdquo;), a Canadian podcast based in Ontario. The site is used to share podcast
            content, events, and information related to the rave and EDM music scene. We create and
            manage our own content exclusively — we do not manage social media content or services on
            behalf of third parties.
          </p>
        </Section>

        <Section title="2. Acceptance of Terms">
          <p>
            By visiting this website, you confirm that you are at least 13 years of age and agree to
            comply with these Terms &amp; Conditions, our Privacy Policy, and all applicable laws and
            regulations, including the laws of the Province of Ontario and the federal laws of Canada.
          </p>
        </Section>

        <Section title="3. Use of This Website">
          <p>
            This website is intended for informational and entertainment purposes. You may browse,
            listen to episodes, and submit inquiries through our contact, guest submission, or
            sponsorship forms.
          </p>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use the site for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the site</li>
            <li>Reproduce, distribute, or commercially exploit our content without written permission</li>
            <li>Transmit any harmful, offensive, or disruptive material</li>
          </ul>
        </Section>

        <Section title="4. User Accounts">
          <p>
            <strong style={{ color: '#FAA21B' }}>No public account registration is available.</strong>{' '}
            This website does not allow users to create accounts. All administrative accounts are
            internal and are created manually by us.
          </p>
          <p>
            In the future, when we launch an online shop, we may offer account registration to
            customers for order management purposes. Any such accounts will be subject to updated
            terms at that time.
          </p>
        </Section>

        <Section title="5. Intellectual Property">
          <p>
            All content on this website — including but not limited to podcast episodes, artwork, logos,
            text, graphics, and audio — is the property of Back n&apos; Body Hurts Podcast or its
            content licensors, and is protected by Canadian copyright law and applicable international
            intellectual property laws.
          </p>
          <p>
            You may share links to our content and embed our publicly available podcast episodes for
            personal, non-commercial purposes, provided proper attribution is given.
          </p>
        </Section>

        <Section title="6. Third-Party Platforms">
          <p>
            We publish and distribute content on the following third-party platforms. Your use of those
            platforms is subject to their respective terms and community guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Meta (Instagram &amp; Facebook)</strong> —
              Subject to{' '}
              <a
                href="https://www.facebook.com/terms.php"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#FAA21B' }}
              >
                Meta Terms of Service
              </a>{' '}
              and Community Standards
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>TikTok</strong> — Subject to{' '}
              <a
                href="https://www.tiktok.com/legal/page/us/terms-of-service/en"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#FAA21B' }}
              >
                TikTok Terms of Service
              </a>{' '}
              and Community Guidelines
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>YouTube</strong> — Subject to{' '}
              <a
                href="https://www.youtube.com/t/terms"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#FAA21B' }}
              >
                YouTube Terms of Service
              </a>
            </li>
            <li>
              <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Apple App Store</strong> — Where
              applicable, subject to{' '}
              <a
                href="https://www.apple.com/legal/internet-services/itunes/us/terms.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#FAA21B' }}
              >
                Apple Media Services Terms
              </a>
            </li>
          </ul>
          <p>
            We are not responsible for the content, privacy practices, or availability of any
            third-party platforms.
          </p>
        </Section>

        <Section title="7. Payments & Donations">
          <p>
            We currently accept donations via PayPal. Donation transactions are processed by PayPal and
            are subject to{' '}
            <a
              href="https://www.paypal.com/us/legalhub/useragreement-full"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#FAA21B' }}
            >
              PayPal&apos;s User Agreement
            </a>
            . We do not store your payment information.
          </p>
          <p>
            When our online shop launches, payments will be processed by one or more of the following
            services: Stripe, Apple Pay, or Google Pay. Each processor operates under its own terms and
            privacy policy, and payment data will be handled solely by those processors — not stored by
            us.
          </p>
        </Section>

        <Section title="8. Disclaimers">
          <p>
            This website and its content are provided &ldquo;as is&rdquo; without warranties of any kind, either
            express or implied. We do not warrant that the site will be uninterrupted, error-free, or
            free of viruses or other harmful components.
          </p>
          <p>
            Opinions expressed on the podcast are those of the hosts and guests and do not constitute
            professional advice of any kind.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the fullest extent permitted by applicable law, Back n&apos; Body Hurts Podcast and its
            team shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages arising from your use of or inability to use this website or its content.
          </p>
        </Section>

        <Section title="10. Governing Law">
          <p>
            These Terms &amp; Conditions are governed by and construed in accordance with the laws of
            the Province of <strong style={{ color: 'rgba(255,255,255,0.9)' }}>Ontario, Canada</strong>{' '}
            and the federal laws of Canada applicable therein, including the{' '}
            <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA). Any disputes
            shall be subject to the exclusive jurisdiction of the courts located in Ontario, Canada.
          </p>
        </Section>

        <Section title="11. Changes to These Terms">
          <p>
            We reserve the right to update these Terms &amp; Conditions at any time. The &ldquo;Last
            updated&rdquo; date at the top of this page will reflect any changes. Continued use of the
            site after changes are posted constitutes your acceptance of the revised terms.
          </p>
        </Section>

        <Section title="12. Contact Us">
          <p>If you have questions about these Terms &amp; Conditions, please contact us at:</p>
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
        </Section>
      </div>
    </div>
  )
}
