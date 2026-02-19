'use client'

import { useState } from 'react'
import { changePassword } from '../actions'

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
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
        <input
          type="password"
          required
          value={current}
          onChange={e => setCurrent(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none"
          placeholder="••••••••"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
        <input
          type="password"
          required
          value={next}
          onChange={e => setNext(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none"
          placeholder="••••••••"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none"
          placeholder="••••••••"
        />
      </div>

      {status && (
        <p className={`text-sm font-medium ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Changing…' : 'Change Password'}
      </button>
    </form>
  )
}
