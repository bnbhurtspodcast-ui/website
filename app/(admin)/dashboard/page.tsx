import { createClient } from '@/lib/supabase/server'
import { Mail, User, Briefcase, FileText, TrendingUp, Calendar } from 'lucide-react'
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
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-[#FAA21B]">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.path}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-[#FAA21B]/10 rounded-lg">
                  <Icon className="h-6 w-6 text-[#FAA21B]" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-[#112B4F] mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-[#112B4F] mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-[#FAA21B]" />
          Recent Activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500 text-sm">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
              >
                <div
                  className={`p-2 rounded-full ${
                    activity.type === 'contact'
                      ? 'bg-purple-100'
                      : activity.type === 'guest'
                      ? 'bg-blue-100'
                      : 'bg-green-100'
                  }`}
                >
                  {activity.type === 'contact' && <Mail className="h-4 w-4 text-purple-600" />}
                  {activity.type === 'guest' && <User className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'sponsorship' && <Briefcase className="h-4 w-4 text-green-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.name}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
