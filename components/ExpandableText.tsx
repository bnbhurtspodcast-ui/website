'use client'

import { useState } from 'react'

export function ExpandableText({ text, lines = 5 }: { text: string; lines?: number }) {
  const [expanded, setExpanded] = useState(false)

  const clampStyle = expanded ? undefined : {
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  }

  return (
    <div className="flex-1">
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', ...clampStyle }}>
        {text}
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-sm font-semibold mt-1 hover:opacity-80 transition-opacity"
        style={{ color: '#FAA21B' }}
      >
        {expanded ? 'See less' : 'See more'}
      </button>
    </div>
  )
}
