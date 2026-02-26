import { createClient } from '@/lib/supabase/server'
import { Settings as SettingsIcon, User, Lock } from 'lucide-react'
import ChangePasswordForm from '@/app/(admin)/admin/settings/ChangePasswordForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-white/45">Configure your admin panel and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 bg-[#FAA21B]/10 border border-[#FAA21B]/20 rounded-full flex items-center justify-center">
              <User className="size-6 text-[#FAA21B]" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-white">Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="admin-label" htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                className="admin-input"
                defaultValue={user?.email ?? ''}
                readOnly
                autoComplete="email"
              />
              <p className="text-xs text-white/30 mt-1">Email is managed via Supabase Auth</p>
            </div>
            <div>
              <label className="admin-label" htmlFor="profile-id">User ID</label>
              <input
                id="profile-id"
                type="text"
                className="admin-input font-mono text-sm"
                defaultValue={user?.id ?? ''}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="size-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center">
              <Lock className="size-6 text-red-400" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold text-white">Security</h2>
          </div>
          <ChangePasswordForm />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="admin-danger-card p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 bg-red-500/12 rounded-full border border-red-500/25 flex items-center justify-center">
            <SettingsIcon className="size-5 text-red-400" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
        </div>
        <p className="text-sm text-red-400/60 mb-4">These actions are irreversible. Please proceed with caution.</p>
        <div className="flex gap-3">
          <button
            disabled
            className="px-6 py-2 border border-red-500/35 text-red-400/70 rounded-lg font-bold hover:border-red-400 hover:text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear All Submissions
          </button>
          <button
            disabled
            className="px-6 py-2 bg-red-600/80 text-white rounded-lg font-bold hover:bg-red-600 border border-red-500/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
