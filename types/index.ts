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

export interface Task {
  id: string
  title: string
  description: string
  column_id: 'todo' | 'in-progress' | 'review' | 'done'
  assignee?: string
  due_date?: string
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  sort_order: number
  created_at: string
}

export interface Host {
  id: string
  name: string
  photo_url?: string
  interests?: string
  description?: string
  social_links: { platform: string; url: string }[]
  sort_order: number
  created_at: string
  updated_at: string
}
