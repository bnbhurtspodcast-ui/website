import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { EdmtrainApiResponse, EdmtrainEvent } from '@/types'

const EDMTRAIN_LOCATION_ID = 74 // Toronto, ON

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.EDMTRAIN_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'EDMTRAIN_API_KEY not set' }, { status: 500 })
  }

  let apiData: EdmtrainApiResponse
  try {
    const res = await fetch(
      `https://edmtrain.com/api/events?client=${apiKey}&locationIds=${EDMTRAIN_LOCATION_ID}`,
      { cache: 'no-store' }
    )
    if (!res.ok) throw new Error(`EDMTrain API returned ${res.status}`)
    apiData = await res.json()
  } catch (err) {
    console.error('[sync-events] fetch error:', err)
    return NextResponse.json({ error: 'EDMTrain fetch failed' }, { status: 502 })
  }

  if (!apiData.success || !Array.isArray(apiData.data)) {
    return NextResponse.json({ error: 'Unexpected EDMTrain response shape' }, { status: 502 })
  }

  const supabase = createAdminClient()
  const now = new Date().toISOString()

  const rows = apiData.data.filter((e: EdmtrainEvent) => e.name && e.date).map((e: EdmtrainEvent) => ({
    edmtrain_id:    e.id,
    name:           e.name,
    link:           e.link ?? null,
    event_date:     e.date,
    start_time:     e.startTime ?? null,
    end_time:       e.endTime ?? null,
    ages:           e.ages ?? null,
    festival_ind:   e.festivalInd,
    livestream_ind: e.livestreamInd,
    venue_name:     e.venue?.name ?? null,
    venue_location: e.venue?.location ?? null,
    venue_address:  e.venue?.address ?? null,
    venue_lat:      e.venue?.lat ?? null,
    venue_lng:      e.venue?.lng ?? null,
    artists: (e.artists ?? []).map((a) => ({
      id:      a.id,
      name:    a.name,
      link:    a.link,
      b2b_ind: a.b2bInd,
    })),
    synced_at:  now,
    updated_at: now,
    // hosts and notes intentionally omitted — upsert must not overwrite manual edits
  }))

  const { error } = await supabase
    .from('events')
    .upsert(rows, { onConflict: 'edmtrain_id', ignoreDuplicates: false })

  if (error) {
    console.error('[sync-events] upsert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log(`[sync-events] upserted ${rows.length} events`)
  return NextResponse.json({ synced: rows.length, ts: now })
}
