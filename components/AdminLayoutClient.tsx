'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Mail,
  User,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Trello,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Task Board', path: '/admin/tasks', icon: Trello },
  { name: 'Contact Submissions', path: '/admin/contacts', icon: Mail },
  { name: 'Guest Applications', path: '/admin/guests', icon: User },
  { name: 'Sponsorship Inquiries', path: '/admin/sponsorships', icon: Briefcase },
  { name: 'Content Management', path: '/admin/content', icon: FileText },
  { name: 'Hosts', path: '/admin/hosts', icon: Users },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
]

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#112B4F] via-[#1a3d5f] to-[#112B4F] flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#112B4F] border-b border-[#FAA21B]/20 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-10 w-10" />
            <span className="text-white font-bold">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-white">
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#112B4F] border-r border-[#FAA21B]/20 transition-transform duration-300 ease-in-out lg:h-auto`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 p-6 border-b border-[#FAA21B]/20">
              <img src="/logo.png" alt="Logo" className="h-12 w-12" />
              <div>
                <h1 className="text-white font-bold text-lg">Admin Panel</h1>
                <p className="text-[#FAA21B] text-sm">Back n&apos; Body Hurts</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive(item.path)
                        ? 'bg-[#FAA21B] text-[#112B4F] font-bold shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Sign Out */}
            <div className="p-4 border-t border-[#FAA21B]/20">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
