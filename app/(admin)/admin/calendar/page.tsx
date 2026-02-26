import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from 'date-fns'
import { createClient } from '@/lib/supabase/server'
import { CalendarClient } from '@/app/(admin)/admin/calendar/CalendarClient'
import { getHosts } from '@/app/(admin)/admin/actions'
import type { CalendarEvent } from '@/types'

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
  const [{ data }, hosts] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .gte('event_date', format(gridFrom, 'yyyy-MM-dd'))
      .lte('event_date', format(gridTo, 'yyyy-MM-dd'))
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false }),
    getHosts(),
  ])

  return (
    <CalendarClient
      events={(data as CalendarEvent[]) ?? []}
      year={year}
      month={month}
      hosts={hosts}
    />
  )
}
