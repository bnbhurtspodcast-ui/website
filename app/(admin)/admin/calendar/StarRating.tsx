'use client'

import { Star } from 'lucide-react'

export function StarRating({
  value,
  onChange,
  label,
  size = 'md',
}: {
  value: number
  onChange?: (v: number) => void
  label: string
  size?: 'sm' | 'md'
}) {
  const starSize = size === 'sm' ? 'size-3' : 'size-4'
  const readOnly = !onChange

  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-white/60 min-w-[80px]">{label}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={[
              'transition-colors',
              readOnly ? 'cursor-default' : 'hover:scale-110',
            ].join(' ')}
            aria-label={readOnly ? undefined : `Rate ${label} ${star} out of 5`}
          >
            <Star
              className={[
                starSize,
                star <= value ? 'text-[#FAA21B] fill-[#FAA21B]' : 'text-white/20',
              ].join(' ')}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
