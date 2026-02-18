import { getEpisodes } from '@/lib/rss'
import { FileText, Clock, Calendar } from 'lucide-react'
import Image from 'next/image'

export const revalidate = 1800 // 30 min

export default async function ContentPage() {
  const episodes = await getEpisodes()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
        <p className="text-[#FAA21B]">Episodes pulled live from your RSS feed — read only</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-[#FAA21B]/20">
        <p className="text-white/80 text-sm">
          <span className="font-bold text-[#FAA21B]">{episodes.length} episodes</span> found. Episodes are managed via your Anchor/Spotify RSS feed.
        </p>
      </div>

      <div className="space-y-4">
        {episodes.map((ep) => (
          <div key={ep.id} className="bg-white rounded-xl p-6 shadow-lg flex gap-4">
            {ep.imageUrl && (
              <div className="flex-shrink-0 w-20 h-20 relative rounded-lg overflow-hidden">
                <Image src={ep.imageUrl} alt={ep.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[#112B4F] mb-1 truncate">{ep.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{ep.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                {ep.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />{ep.duration}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
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
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAA21B]/10 text-[#FAA21B] rounded-lg hover:bg-[#FAA21B]/20 transition-colors text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                Audio
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
