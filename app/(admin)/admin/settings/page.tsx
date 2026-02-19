import { createClient } from '@/lib/supabase/server'
import { Settings as SettingsIcon, User, Bell, Lock, Palette, Globe } from 'lucide-react'
import ChangePasswordForm from './ChangePasswordForm'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-[#FAA21B]">Configure your admin panel and podcast settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#FAA21B]/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-[#FAA21B]" />
            </div>
            <h2 className="text-xl font-bold text-[#112B4F]">Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-gray-50 outline-none text-gray-700"
                defaultValue={user?.email ?? ''}
                readOnly
              />
              <p className="text-xs text-gray-500 mt-1">Email is managed via Supabase Auth</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 bg-gray-50 outline-none text-gray-500 text-sm font-mono"
                defaultValue={user?.id ?? ''}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        {false && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-[#112B4F]">Notifications</h2>
            </div>
            <div className="space-y-4">
              {['New contact submissions', 'Guest applications', 'Sponsorship inquiries', 'Email digests'].map((item, i) => (
                <label key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                  <input type="checkbox" className="w-5 h-5 rounded accent-[#FAA21B]" defaultChecked={i < 3} />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Security */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#112B4F]">Security</h2>
          </div>
          <ChangePasswordForm />
        </div>

        {/* Appearance */}
        {false && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <Palette className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-[#112B4F]">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
              <select disabled className="w-full px-4 py-2 rounded-lg border-2 bg-gray-200 border-gray-200 focus:border-[#FAA21B] outline-none">
                <option>Auto</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-400" />
                <select disabled className="flex-1 px-4 py-2 rounded-lg border-2 bg-gray-200 border-gray-200 focus:border-[#FAA21B] outline-none">
                  <option>English</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
        </div>
        <p className="text-sm text-red-700 mb-4">These actions are irreversible. Please proceed with caution.</p>
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-white border-2 border-red-300 text-red-700 rounded-lg font-bold hover:bg-red-50 transition-colors">
            Clear All Submissions
          </button>
          <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}
