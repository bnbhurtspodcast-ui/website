'use client'

import { useState } from 'react'
import { changePassword } from '@/app/(admin)/admin/actions'

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus(null)

    if (next !== confirm) {
      setStatus({ type: 'error', message: 'New passwords do not match' })
      return
    }
    if (next.length < 6) {
      setStatus({ type: 'error', message: 'Password must be at least 6 characters' })
      return
    }

    setLoading(true)
    const result = await changePassword(current, next)
    setLoading(false)

    if (result.error) {
      setStatus({ type: 'error', message: result.error })
    } else {
      setStatus({ type: 'success', message: 'Password changed successfully' })
      setCurrent('')
      setNext('')
      setConfirm('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="admin-label" htmlFor="current-password">Current Password</label>
        <input
          id="current-password"
          type="password"
          required
          value={current}
          onChange={e => setCurrent(e.target.value)}
          autoComplete="current-password"
          className="admin-input"
          placeholder="••••••••"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="admin-label" htmlFor="new-password">New Password</label>
        <input
          id="new-password"
          type="password"
          required
          value={next}
          onChange={e => setNext(e.target.value)}
          autoComplete="new-password"
          className="admin-input"
          placeholder="••••••••"
          spellCheck={false}
        />
      </div>
      <div>
        <label className="admin-label" htmlFor="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          type="password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          autoComplete="new-password"
          className="admin-input"
          placeholder="••••••••"
          spellCheck={false}
        />
      </div>

      {status && (
        <p
          role="alert"
          className={`text-sm font-medium ${status.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
      >
        {loading ? 'Changing…' : 'Change Password'}
      </button>
    </form>
  )
}
