import { createClient } from '@/lib/supabase/server'
import { Mail, User, Briefcase, FileText, Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const [
    { count: contactCount },
    { count: guestCount },
    { count: sponsorCount },
    { data: recentContacts },
    { data: recentGuests },
    { data: recentSponsors },
  ] = await Promise.all([
    supabase.from('contact_submissions').select('*', { count: 'exact', head: true }),
    supabase.from('guest_applications').select('*', { count: 'exact', head: true }),
    supabase.from('sponsorship_inquiries').select('*', { count: 'exact', head: true }),
    supabase
      .from('contact_submissions')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('guest_applications')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(2),
    supabase
      .from('sponsorship_inquiries')
      .select('id, company_name, created_at')
      .order('created_at', { ascending: false })
      .limit(2),
  ])

  const stats = [
    { label: 'Contact Submissions', value: contactCount ?? 0, icon: Mail, path: '/admin/contacts' },
    { label: 'Guest Applications', value: guestCount ?? 0, icon: User, path: '/admin/guests' },
    { label: 'Sponsorship Inquiries', value: sponsorCount ?? 0, icon: Briefcase, path: '/admin/sponsorships' },
    { label: 'RSS Episodes', value: '58+', icon: FileText, path: '/admin/content' },
  ]

  type ActivityItem = { type: 'contact' | 'guest' | 'sponsorship'; name: string; action: string; time: string }

  const recentActivity: ActivityItem[] = [
    ...(recentContacts ?? []).map((c) => ({
      type: 'contact' as const,
      name: c.name,
      action: 'submitted a contact form',
      time: new Date(c.created_at).toLocaleDateString(),
    })),
    ...(recentGuests ?? []).map((g) => ({
      type: 'guest' as const,
      name: g.name,
      action: 'applied to be a guest',
      time: new Date(g.created_at).toLocaleDateString(),
    })),
    ...(recentSponsors ?? []).map((s) => ({
      type: 'sponsorship' as const,
      name: s.company_name,
      action: 'requested sponsorship info',
      time: new Date(s.created_at).toLocaleDateString(),
    })),
  ].sort(() => -1)

  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Dashboard Overview</h1>
        <p className="text-sm text-white/45">Welcome back — here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.path}
              className="admin-stat-card p-6 block"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2.5 bg-[#FAA21B]/10 border border-[#FAA21B]/20 rounded-lg">
                  <Icon className="size-5 text-[#FAA21B]" aria-hidden="true" />
                </div>
              </div>
              <div className="text-4xl font-black text-white tracking-tight mt-4 mb-1">{stat.value}</div>
              <div className="text-xs text-white/45 font-medium uppercase tracking-wider">{stat.label}</div>
              <div className="mt-4 h-0.5 bg-gradient-to-r from-[#FAA21B]/50 to-transparent rounded-full" aria-hidden="true" />
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="admin-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-[#FAA21B] rounded-full" aria-hidden="true" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="size-4 text-[#FAA21B]" aria-hidden="true" />
            Recent Activity
          </h2>
        </div>
        {recentActivity.length === 0 ? (
          <p className="text-white/35 text-sm">No submissions yet.</p>
        ) : (
          <div className="space-y-0" aria-live="polite">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
              >
                <div
                  className={`p-2 rounded-full flex-shrink-0 ${
                    activity.type === 'contact'
                      ? 'bg-violet-500/15 ring-1 ring-violet-500/25'
                      : activity.type === 'guest'
                      ? 'bg-blue-500/15 ring-1 ring-blue-500/25'
                      : 'bg-emerald-500/15 ring-1 ring-emerald-500/25'
                  }`}
                >
                  {activity.type === 'contact' && <Mail className="size-4 text-violet-400" aria-hidden="true" />}
                  {activity.type === 'guest' && <User className="size-4 text-blue-400" aria-hidden="true" />}
                  {activity.type === 'sponsorship' && <Briefcase className="size-4 text-emerald-400" aria-hidden="true" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white/60">
                    <span className="font-semibold text-white">{activity.name}</span> {activity.action}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
