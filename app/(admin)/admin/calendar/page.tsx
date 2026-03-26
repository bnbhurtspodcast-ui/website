import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { CalendarClient } from '@/app/(admin)/admin/calendar/CalendarClient'
import { getHosts } from '@/app/(admin)/admin/hosts/actions'
import { getRecordingSessionTasksForDateRange } from '@/app/(admin)/admin/calendar/actions'
import type { CalendarEvent, SocialPost } from '@/types'

export const revalidate = 0

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ y?: string; m?: string }>
}) {
  const params = await searchParams
  const now = new Date()
  const year = parseInt(params.y ?? '') || now.getFullYear()
  const month = parseInt(params.m ?? String(now.getMonth()))

  const monthStart = startOfMonth(new Date(year, month, 1))
  const monthEnd = endOfMonth(monthStart)
  const gridFrom = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridTo = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const supabase = await createClient()
  const gridFromStr = format(gridFrom, 'yyyy-MM-dd')
  const gridToStr = format(gridTo, 'yyyy-MM-dd')

  const { data: { user } } = await supabase.auth.getUser()

  const [{ data }, { data: socialPostsData }, hosts, recordingTasks] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .gte('event_date', gridFromStr)
      .lte('event_date', gridToStr)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false }),
    supabase
      .from('social_posts')
      .select('*')
      .gte('scheduled_at', gridFromStr + 'T00:00:00Z')
      .lte('scheduled_at', gridToStr + 'T23:59:59Z')
      .in('status', ['scheduled', 'posted'])
      .order('scheduled_at', { ascending: true }),
    getHosts(),
    getRecordingSessionTasksForDateRange(gridFromStr, gridToStr),
  ])

  return (
    <CalendarClient
      events={(data as CalendarEvent[]) ?? []}
      socialPosts={(socialPostsData as SocialPost[]) ?? []}
      year={year}
      month={month}
      hosts={hosts}
      recordingTasks={recordingTasks}
      currentUserId={user?.id ?? null}
    />
  )
}
