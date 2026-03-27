'use client'

import { useState, useTransition } from 'react'
import { Info } from 'lucide-react'
import { StarRating } from '@/app/(admin)/admin/calendar/StarRating'
import { createEventReview } from '@/app/(admin)/admin/calendar/actions'
import { REVIEW_WEIGHTS, REVIEW_DESCRIPTIONS } from '@/app/(admin)/admin/calendar/reviewWeights'
import type { EventReview } from '@/types'

type ReviewFormData = {
  sound: number
  production: number
  vibes: number
  venue: number
  cost: number
  description: string
  will_go_again: boolean
}

export function EventReviewForm({
  eventId,
  existingReview,
  onDone,
  onCancel,
}: {
  eventId: string
  existingReview?: EventReview
  onDone: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<ReviewFormData>({
    sound: existingReview?.sound ?? 0,
    production: existingReview?.production ?? 0,
    vibes: existingReview?.vibes ?? 0,
    venue: existingReview?.venue ?? 0,
    cost: existingReview?.cost ?? 0,
    description: existingReview?.description ?? '',
    will_go_again: existingReview?.will_go_again ?? false,
  })
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showFormula, setShowFormula] = useState(false)

  const allRated = form.sound > 0 && form.production > 0 && form.vibes > 0 && form.venue > 0 && form.cost > 0
  const overallScore = allRated
    ? (
        form.sound * REVIEW_WEIGHTS.sound +
        form.vibes * REVIEW_WEIGHTS.vibes +
        form.production * REVIEW_WEIGHTS.production +
        form.venue * REVIEW_WEIGHTS.venue +
        form.cost * REVIEW_WEIGHTS.cost
      ).toFixed(2)
    : '—'
  const canSubmit = allRated

  function handleSubmit() {
    if (!canSubmit) return
    startTransition(async () => {
      const result = await createEventReview({
        event_id: eventId,
        ...form,
        description: form.description.trim() || null,
      })
      if (result.error) {
        setError(result.error)
      } else {
        onDone()
      }
    })
  }

  const labelCls = 'text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2 block'
  const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FAA21B]/60 transition-colors resize-none'

  return (
    <div className="space-y-4 pt-4 border-t border-white/8">
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </p>

      {/* Star ratings */}
      <div className="space-y-3">
        <StarRating label="Sound" description={REVIEW_DESCRIPTIONS.sound} value={form.sound} onChange={(v) => setForm((f) => ({ ...f, sound: v }))} />
        <StarRating label="Vibes" description={REVIEW_DESCRIPTIONS.vibes} value={form.vibes} onChange={(v) => setForm((f) => ({ ...f, vibes: v }))} />
        <StarRating label="Production" description={REVIEW_DESCRIPTIONS.production} value={form.production} onChange={(v) => setForm((f) => ({ ...f, production: v }))} />
        <StarRating label="Venue" description={REVIEW_DESCRIPTIONS.venue} value={form.venue} onChange={(v) => setForm((f) => ({ ...f, venue: v }))} />
        <StarRating label="Cost" description={REVIEW_DESCRIPTIONS.cost} value={form.cost} onChange={(v) => setForm((f) => ({ ...f, cost: v }))} />
      </div>

      {/* Overall score preview */}
      <div className="rounded-lg bg-white/5 border border-white/8 overflow-hidden">
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-white/40">Overall Score</span>
            <button
              type="button"
              onClick={() => setShowFormula((v) => !v)}
              className="text-white/25 hover:text-white/60 transition-colors"
              aria-label="How is this scored?"
            >
              <Info size={11} />
            </button>
          </div>
          <span className="text-sm font-bold text-[#FAA21B]">{overallScore} <span className="text-white/30 font-normal text-xs">/ 5</span></span>
        </div>
        {showFormula && (
          <div className="px-2 pb-2 border-t border-white/8 pt-1.5 space-y-1">
            {(Object.entries(REVIEW_WEIGHTS) as [keyof typeof REVIEW_WEIGHTS, number][]).map(([key, weight]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[10px] text-white/40 capitalize">{key}</span>
                <span className="text-[10px] text-white/25">{(weight * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Notes (optional)</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="What stood out about this event?"
          className={inputCls}
        />
      </div>

      {/* Will go again */}
      <label className="flex items-center gap-3 cursor-pointer group">
        <div
          onClick={() => setForm((f) => ({ ...f, will_go_again: !f.will_go_again }))}
          className={[
            'relative w-9 h-5 rounded-full border transition-colors cursor-pointer',
            form.will_go_again
              ? 'bg-[#FAA21B]/30 border-[#FAA21B]/60'
              : 'bg-white/8 border-white/15',
          ].join(' ')}
          role="switch"
          aria-checked={form.will_go_again}
        >
          <span
            className={[
              'absolute top-0.5 w-4 h-4 rounded-full transition-all',
              form.will_go_again
                ? 'left-4 bg-[#FAA21B]'
                : 'left-0.5 bg-white/30',
            ].join(' ')}
          />
        </div>
        <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors select-none">
          Will go again
        </span>
      </label>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 admin-btn-ghost rounded-lg text-sm font-semibold"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit || isPending}
          className="flex-1 py-2 admin-btn-primary rounded-lg text-sm disabled:opacity-40"
        >
          {isPending ? 'Saving…' : existingReview ? 'Update Review' : 'Submit Review'}
        </button>
      </div>
    </div>
  )
}
