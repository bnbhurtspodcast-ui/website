// scripts/import-trello.mjs
// Imports non-closed Trello cards from kanbanboard.json into Supabase.
//
// Usage:
//   node scripts/import-trello.mjs
//
// Prerequisites:
//   - Run the SQL migration (supabase/migrations/001_kanban_upgrade.sql) first
//   - Add SUPABASE_SERVICE_ROLE_KEY to .env.local
//     (Supabase Dashboard → Settings → API → service_role key)
//   - Run once, note the member IDs printed, fill MEMBER_MAP below, re-run

import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

// ── Load .env.local manually (no dotenv dependency needed) ──────────────────
function loadEnv() {
  try {
    const raw = readFileSync('.env.local', 'utf-8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      const val = trimmed.slice(eqIdx + 1).trim()
      if (key && val && !process.env[key]) process.env[key] = val
    }
  } catch {
    console.warn('Could not load .env.local — ensure env vars are set in environment')
  }
}
loadEnv()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  console.error('Add SUPABASE_SERVICE_ROLE_KEY to .env.local and re-run.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Load Trello board data ───────────────────────────────────────────────────
const board = JSON.parse(readFileSync('kanbanboard.json', 'utf-8'))
const members = board.members ?? []

// ── Step 1: Load column map from DB (trello_list_id → supabase uuid) ────────
const { data: dbColumns, error: colErr } = await supabase
  .from('kanban_columns')
  .select('id, trello_list_id, name')

if (colErr) {
  console.error('Failed to load kanban_columns from DB:', colErr.message)
  console.error('Make sure the SQL migration has been run first.')
  process.exit(1)
}

const listIdToColumnId = {}
for (const col of dbColumns) {
  if (col.trello_list_id) listIdToColumnId[col.trello_list_id] = col.id
}

console.log(`Loaded ${dbColumns.length} columns from DB`)

// ── Fill this map with Supabase user UUIDs ───────────────────────────────────
// Get UUIDs from Supabase Dashboard → Authentication → Users
const MEMBER_MAP = {
  '65dea4c6270d1ef29fa84577': `f2ab26d0-dca1-4759-ac05-b173bfeabdb0`,  // Back&Body Hurts Podcast
  '660b79c86ff25de6b3473782': `1e764f6d-3114-4cf2-b52d-55eb38a6f9aa`,  // Benny Y
  '667251ae0b17e784acd981d7': `f2ab26d0-dca1-4759-ac05-b173bfeabdb0`,  // BnBHurts Podcasts
  '6615fc988c99fc71138e942c': `16ab3fbd-cba7-4d2b-967a-0443003fb12a`,  // Christine L
  '670dba16c56e756d4fb57b20': `f2ab26d0-dca1-4759-ac05-b173bfeabdb0`,  // Haider Warraich
  '5c9901869bcb245dff874649': `f2ab26d0-dca1-4759-ac05-b173bfeabdb0`,  // Klaudia Ciasnocha
  '65dec3bba40dc71be4088f12': `3a4c8f03-619b-4126-b0c1-24478cbeb461`,  // Sonny Modi
  '5b252cc1fa60647aeded6f60': `b75cfe17-03ff-432b-a06d-de324d131799`,  // yikern
}

// ── Step 2: Print member mapping status ──────────────────────────────────────
console.log('\n=== TRELLO MEMBER → SUPABASE USER MAPPING ===')
members.forEach((m) => {
  const mapped = MEMBER_MAP[m.id]
  const status = mapped ? `✓ mapped → ${mapped}` : '✗ not mapped (null)'
  console.log(`  ${m.fullName} (${m.username}): ${status}`)
})
console.log('')

// ── Step 3: Filter open cards ────────────────────────────────────────────────
const openCards = (board.cards ?? []).filter((c) => c.closed === false)
console.log(`Found ${openCards.length} open cards to import\n`)

// ── Step 4: Import each card ─────────────────────────────────────────────────
let imported = 0
let skipped = 0
let errors = 0

for (const card of openCards) {
  const columnId = listIdToColumnId[card.idList]
  if (!columnId) {
    console.warn(`  SKIP: No column for list ${card.idList} (card: "${card.name}")`)
    skipped++
    continue
  }

  // Primary assignee: use the first member ID on the card
  const primaryMemberId = card.idMembers?.[0] ?? null
  const assigneeUserId = primaryMemberId ? (MEMBER_MAP[primaryMemberId] ?? null) : null
  const assigneeMember = primaryMemberId ? members.find((m) => m.id === primaryMemberId) : null
  const assigneeName = assigneeMember?.fullName ?? null

  const taskRow = {
    title: card.name,
    description: card.desc || '',
    column_id: columnId,
    assignee: assigneeName,
    assignee_user_id: assigneeUserId,
    due_date: card.due ? card.due.split('T')[0] : null,
    priority: 'medium',   // Trello has no priority field; default to medium
    tags: [],
    label_color: null,       // No label names used in this board export
    sort_order: card.pos ? Math.min(Math.round(card.pos / 65536), 2147483647) : 0,
    trello_card_id: card.id,
  }

  const { error } = await supabase
    .from('tasks')
    .upsert(taskRow, { onConflict: 'trello_card_id', ignoreDuplicates: false })

  if (error) {
    console.error(`  ERROR: "${card.name}" — ${error.message}`)
    errors++
  } else {
    imported++
  }
}

console.log(`\nImport complete:`)
console.log(`  ${imported} imported/updated`)
console.log(`  ${skipped}  skipped (no column mapping)`)
console.log(`  ${errors}  errors`)

if (Object.values(MEMBER_MAP).every((v) => v === null)) {
  console.log('\nTIP: Fill in MEMBER_MAP with Supabase user UUIDs and re-run to link assignees.')
}
