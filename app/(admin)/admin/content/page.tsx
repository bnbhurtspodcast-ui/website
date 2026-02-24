import { getEpisodes } from '@/lib/rss'
import { FileText, Clock, Calendar } from 'lucide-react'
import Image from 'next/image'

export const revalidate = 1800 // 30 min

export default async function ContentPage() {
  const episodes = await getEpisodes()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Content Management</h1>
        <p className="text-sm text-white/45">Episodes pulled live from your RSS feed — read only</p>
      </div>

      <div className="admin-card p-4 mb-6 flex items-center gap-3">
        <div className="w-1 h-5 bg-[#FAA21B] rounded-full flex-shrink-0" aria-hidden="true" />
        <p className="text-white/65 text-sm">
          <span className="font-bold text-[#FAA21B]">{episodes.length} episodes</span> found. Episodes are managed via your Anchor/Spotify RSS feed.
        </p>
      </div>

      <div className="space-y-4">
        {episodes.map((ep) => (
          <div key={ep.id} className="admin-card p-5 flex gap-5 items-start">
            {ep.imageUrl && (
              <div className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden ring-1 ring-[#FAA21B]/20">
                <Image src={ep.imageUrl} alt={ep.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white text-sm mb-1.5 line-clamp-1">{ep.title}</h3>
              <p className="text-xs text-white/50 line-clamp-2 mb-3 leading-relaxed">{ep.description}</p>
              <div className="flex items-center gap-4 text-xs text-white/45">
                {ep.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-3 text-white/30" aria-hidden="true" />{ep.duration}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="size-3 text-white/30" aria-hidden="true" />
                  {new Date(ep.publishedAt).toLocaleDateString()}
                </span>
                <span className="inline-flex px-2 py-0.5 bg-[#FAA21B]/10 text-[#FAA21B] rounded text-xs font-medium">
                  {ep.episodeType}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <a
                href={ep.audioUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Listen to audio for ${ep.title}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAA21B]/10 text-[#FAA21B] border border-[#FAA21B]/20 rounded-lg hover:bg-[#FAA21B]/20 transition-colors text-sm font-medium"
              >
                <FileText className="size-4" aria-hidden="true" />
                Audio
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
