'use client'

import { Star } from 'lucide-react'

export function StarRating({
  value,
  onChange,
  label,
  description,
  size = 'md',
}: {
  value: number
  onChange?: (v: number) => void
  label: string
  description?: string
  size?: 'sm' | 'md'
}) {
  const starSize = size === 'sm' ? 'size-3' : 'size-4'
  const readOnly = !onChange

  return (
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-[80px]">
        <span className="text-xs text-white/60">{label}</span>
        {description && (
          <p className="text-[10px] text-white/35 leading-tight mt-0.5">{description}</p>
        )}
      </div>
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
