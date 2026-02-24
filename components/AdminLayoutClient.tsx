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
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Task Board', path: '/admin/tasks', icon: Trello },
    ],
  },
  {
    label: 'Submissions',
    items: [
      { name: 'Contact Submissions', path: '/admin/contacts', icon: Mail },
      { name: 'Guest Applications', path: '/admin/guests', icon: User },
      { name: 'Sponsorship Inquiries', path: '/admin/sponsorships', icon: Briefcase },
    ],
  },
  {
    label: 'Manage',
    items: [
      { name: 'Content Management', path: '/admin/content', icon: FileText },
      { name: 'Hosts', path: '/admin/hosts', icon: Users },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
]

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string>('')

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? '')
    })
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  return (
    <div className="min-h-screen admin-dot-grid flex flex-col">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#080f1a] border-b border-[#FAA21B]/15 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="BNB Hurts Podcast logo" className="size-10" />
            <span className="text-white font-bold">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
            className="p-2 text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FAA21B]"
          >
            {sidebarOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#0a1220]/95 border-r border-[#FAA21B]/15 backdrop-blur-md transition-transform duration-300 ease-in-out lg:h-auto`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="hidden lg:flex items-center gap-3 p-6 border-b border-[#FAA21B]/12">
              <img src="/logo.png" alt="BNB Hurts Podcast logo" className="size-12" />
              <div>
                <h1 className="text-white font-bold text-base tracking-tight">Admin Panel</h1>
                <p className="text-[#FAA21B]/70 text-xs font-medium tracking-wider uppercase">Back n&apos; Body Hurts</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Admin navigation">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="admin-nav-section">{group.label}</p>
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setSidebarOpen(false)}
                        aria-current={isActive(item.path) ? 'page' : undefined}
                        className={`admin-nav-item ${isActive(item.path) ? 'active' : ''}`}
                      >
                        <Icon className="size-4 flex-shrink-0" aria-hidden="true" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              ))}
            </nav>

            {/* Bottom: user block + sign out */}
            <div className="border-t border-[#FAA21B]/12 p-3 space-y-2">
              {userEmail && (
                <div className="admin-user-block">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-full bg-[#FAA21B]/20 flex items-center justify-center flex-shrink-0">
                      <User className="size-3.5 text-[#FAA21B]" aria-hidden="true" />
                    </div>
                    <p className="text-xs text-white/50 truncate">{userEmail}</p>
                  </div>
                </div>
              )}
              <button
                onClick={handleSignOut}
                aria-label="Sign out"
                className="w-full admin-nav-item hover:!bg-red-500/10 hover:!text-red-400 hover:!border-l-red-400/40"
              >
                <LogOut className="size-4 flex-shrink-0" aria-hidden="true" />
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
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
