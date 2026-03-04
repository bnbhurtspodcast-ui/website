// ── Episode (from RSS feed, camelCase) ────────────────────────────────────────
export interface Episode {
  id: string           // guid from RSS
  title: string
  description: string
  publishedAt: string  // pubDate string, e.g. "Wed, 11 Feb 2026 11:00:00 GMT"
  duration: string     // e.g. "01:10:46"
  audioUrl: string
  imageUrl: string
  episodeType: string  // "full" | "trailer" | "bonus"
  youtubeVideoId?: string
}

// ── Supabase database types (snake_case matching column names) ─────────────────

export interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'reviewed' | 'responded'
  reviewed_by?: string | null
  created_at: string
  updated_at: string
}

export interface GuestApplication {
  id: string
  name: string
  email: string
  phone?: string
  expertise: string
  topic_idea: string
  bio: string
  social_media?: string
  availability?: string
  status: 'pending' | 'reviewing' | 'approved' | 'rejected' | 'scheduled'
  reviewed_by?: string | null
  created_at: string
  updated_at: string
}

export interface SponsorshipInquiry {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone?: string
  website?: string
  budget?: string
  goals: string
  message?: string
  package_interest?: string
  status: 'new' | 'reviewing' | 'negotiating' | 'accepted' | 'declined'
  reviewed_by?: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
}

export interface KanbanColumn {
  id: string
  name: string
  color: string        // color key: 'blue', 'green', 'gray', etc. — resolved to Tailwind class in UI
  sort_order: number
  trello_list_id?: string
}

export interface Task {
  id: string
  title: string
  description: string
  column_id: string            // uuid FK to kanban_columns.id
  assignee_names: string[]     // display names of all assignees
  assignee_ids: string[]       // uuid FKs to auth.users
  due_date?: string            // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  label_color?: string         // color key: 'blue', 'red', etc.
  sort_order: number
  created_at: string
  trello_card_id?: string
  archived_at?: string | null
  event_id?: string | null      // FK to events.id — set when task is created from a calendar event
}

export interface Host {
  id: string
  name: string
  photo_url?: string
  interests?: string
  description?: string
  social_links: { platform: string; url: string }[]
  sort_order: number
  user_id?: string | null   // uuid FK to auth.users; null for legacy rows
  role: 'host' | 'team'    // 'host' = shown on public /about; 'team' = internal only
  created_at: string
  updated_at: string
}

// ── EDMTrain / Calendar types ──────────────────────────────────────────────────

export interface EventArtist {
  id: number
  name: string
  link?: string
  b2b_ind?: boolean
}

export interface CalendarEvent {
  id: string
  edmtrain_id?: number | null
  name: string
  link?: string | null
  event_date: string          // "YYYY-MM-DD"
  start_time?: string | null  // "HH:MM:SS"
  end_time?: string | null
  ages?: string | null
  festival_ind: boolean
  livestream_ind: boolean
  venue_name?: string | null
  venue_location?: string | null
  venue_address?: string | null
  venue_lat?: number | null
  venue_lng?: number | null
  artists: EventArtist[]
  hosts: string[]
  notes?: string | null
  synced_at?: string | null
  created_at: string
  updated_at: string
}

export interface EdmtrainEvent {
  id: number
  name: string | null
  link: string
  date: string
  startTime: string | null
  endTime: string | null
  ages: string | null
  festivalInd: boolean
  livestreamInd: boolean
  venue: {
    name: string
    location: string
    address: string
    lat: number
    lng: number
  }
  artistList: Array<{
    id: number
    name: string
    link: string
    b2bInd: boolean
  }> | null
}

export interface EdmtrainApiResponse {
  success: boolean
  data: EdmtrainEvent[]
}

// ── site_settings ─────────────────────────────────────────────────────────────

export interface SiteSetting {
  key: string
  value: string | null
  updated_at: string
}
