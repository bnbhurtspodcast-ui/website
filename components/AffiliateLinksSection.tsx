'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { ExternalLink, Copy, Check, Tag } from 'lucide-react'
import type { AffiliateLink } from '@/types'

function AffiliateCard({ link }: { link: AffiliateLink }) {
  const [copied, setCopied] = useState(false)
  const [imgError, setImgError] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: silently fail
    }
  }

  return (
    <motion.div
      className="rave-card rave-card-lift rounded-2xl overflow-hidden flex flex-col"
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
    >
      {/* Image */}
      <div
        className="relative w-full overflow-hidden flex items-center justify-center flex-shrink-0"
        style={{ aspectRatio: '16/9', background: 'rgba(10,18,32,0.8)' }}
      >
        {!imgError ? (
          <img
            src={link.image_url}
            alt={link.name}
            onError={() => setImgError(true)}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <Tag className="size-10" style={{ color: 'rgba(250,162,27,0.25)' }} aria-hidden="true" />
        )}
        {/* Type badge — pinned top-right over image */}
        <span
          className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
          style={
            link.type === 'link'
              ? {
                  backgroundColor: 'rgba(59,130,246,0.2)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59,130,246,0.35)',
                  backdropFilter: 'blur(6px)',
                }
              : {
                  backgroundColor: 'rgba(250,162,27,0.18)',
                  color: '#FAA21B',
                  border: '1px solid rgba(250,162,27,0.35)',
                  backdropFilter: 'blur(6px)',
                }
          }
        >
          {link.type === 'link' ? 'Link' : 'Code'}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-black uppercase leading-tight mb-2 text-white"
          style={{
            fontFamily: 'var(--font-barlow), sans-serif',
            fontSize: '1.15rem',
            letterSpacing: '0.02em',
          }}
        >
          {link.name}
        </h3>
        <p
          className="text-sm leading-relaxed mb-4 flex-1"
          style={{ color: 'rgba(255,255,255,0.55)' }}
        >
          {link.description}
        </p>

        {/* Terms */}
        {link.terms && (
          <p
            className="text-xs leading-relaxed mb-4 italic"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {link.terms}
          </p>
        )}

        {/* CTA */}
        {link.type === 'link' ? (
          <a
            href={link.value}
            target="_blank"
            rel="noopener noreferrer"
            className="rave-btn inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm w-full"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            Visit Link
          </a>
        ) : (
          <button
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm w-full transition-all duration-200"
            style={{
              backgroundColor: copied
                ? 'rgba(34,197,94,0.12)'
                : 'rgba(250,162,27,0.1)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(250,162,27,0.35)'}`,
              color: copied ? '#4ade80' : '#FAA21B',
            }}
          >
            {copied ? (
              <Check className="size-4 flex-shrink-0" aria-hidden="true" />
            ) : (
              <Copy className="size-4 flex-shrink-0" aria-hidden="true" />
            )}
            <span className="truncate max-w-[160px]">
              {copied ? 'Copied!' : link.value}
            </span>
          </button>
        )}

        {/* Website link — secondary, below CTA */}
        {link.website_link && (
          <a
            href={link.website_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 mt-2.5 text-xs w-full transition-colors"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)' }}
          >
            <ExternalLink className="size-3" aria-hidden="true" />
            Visit Website
          </a>
        )}
      </div>
    </motion.div>
  )
}

export function AffiliateLinksSection({ links }: { links: AffiliateLink[] }) {
  if (links.length === 0) return null

  return (
    <section
      className="py-20"
      style={{
        background:
          'linear-gradient(180deg, transparent 0%, rgba(250,162,27,0.05) 50%, transparent 100%)',
        borderTop: '1px solid rgba(250,162,27,0.15)',
        borderBottom: '1px solid rgba(250,162,27,0.15)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="font-black uppercase leading-none tracking-tight mb-3 text-white"
            style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              textShadow: '0 0 40px rgba(250,162,27,0.25)',
            }}
          >
            Affiliated Links
          </h2>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Deals and links from the BNB Hurts family
          </p>
        </motion.div>

        {/* Card grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {links.map((link) => (
            <AffiliateCard key={link.id} link={link} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
