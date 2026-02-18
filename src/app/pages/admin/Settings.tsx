import { Settings as SettingsIcon, User, Bell, Lock, Palette, Globe } from "lucide-react";

export function Settings() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-[#FAA21B]">Configure your admin panel and podcast settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-[#FAA21B]/10 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-[#FAA21B]" />
            </div>
            <h2 className="text-xl font-bold text-[#112B4F]">Profile Settings</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none"
                placeholder="Your name"
                defaultValue="Admin User"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none"
                placeholder="admin@backnbodyhurts.com"
                defaultValue="admin@backnbodyhurts.com"
              />
            </div>
            <button className="w-full px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors">
              Save Changes
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-[#112B4F]">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">New contact submissions</span>
              <input type="checkbox" className="w-5 h-5 rounded text-[#FAA21B]" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Guest applications</span>
              <input type="checkbox" className="w-5 h-5 rounded text-[#FAA21B]" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Sponsorship inquiries</span>
              <input type="checkbox" className="w-5 h-5 rounded text-[#FAA21B]" defaultChecked />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <span className="text-sm font-medium text-gray-700">Email digests</span>
              <input type="checkbox" className="w-5 h-5 rounded text-[#FAA21B]" />
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
              <Lock className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-[#112B4F]">Security</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors">
              Change Password
            </button>
          </div>
        </div>

        {/* Appearance Settings */}
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
              <select className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none">
                <option>Light</option>
                <option>Dark</option>
                <option>Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-gray-400" />
                <select className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-[#FAA21B] outline-none">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
            <button className="w-full px-6 py-3 bg-[#FAA21B] text-[#112B4F] rounded-lg font-bold hover:bg-[#FAA21B]/90 transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
        </div>
        <p className="text-sm text-red-700 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>
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
  );
}
