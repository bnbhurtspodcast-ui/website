'use client'

import { Mail } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#112B4F] via-[#1a3d5f] to-[#112B4F] flex items-center justify-center py-12">
      <div className="mx-auto max-w-md w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Back n' Body Hurts" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Forgot Password</h1>
          <p className="text-[#FAA21B]">We&apos;ll send you a reset link</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {sent ? (
            <div className="text-center space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                Password reset email sent! Check your inbox.
              </div>
              <Link
                href="/admin/signin"
                className="block text-sm text-[#FAA21B] hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#112B4F] mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
                    placeholder="info@bnbhurtspodcast.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-[#FAA21B] text-[#112B4F] rounded-full font-bold hover:bg-[#FAA21B]/90 transition-colors shadow-lg disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>

              <div className="text-center">
                <Link
                  href="/admin/signin"
                  className="text-sm text-[#FAA21B] hover:underline"
                >
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
