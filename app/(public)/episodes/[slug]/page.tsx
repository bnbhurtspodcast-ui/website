import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { getEpisodes, searchYouTubeByTitle } from '@/lib/rss'
import { EpisodePlayButton } from '@/components/EpisodePlayButton'
import { EpisodeDescription } from '@/components/EpisodeDescription'

export const revalidate = 1800

export async function generateStaticParams() {
  const episodes = await getEpisodes()
  return episodes.map((ep) => ({ slug: encodeURIComponent(ep.id) }))
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function EpisodeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const id = decodeURIComponent(slug)
  const episodes = await getEpisodes()
  const found = episodes.find((ep) => ep.id === id)

  if (!found) notFound()

  const youtubeVideoId = await searchYouTubeByTitle(found.title)
  const episode = { ...found, youtubeVideoId: youtubeVideoId ?? undefined }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/episodes"
          className="inline-flex items-center gap-2 text-[#FAA21B] hover:text-[#FAA21B]/80 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Episodes
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{episode.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-1 text-white/70 text-sm">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(episode.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1 text-white/70 text-sm">
            <Clock className="h-4 w-4 text-[#FAA21B]" />
            <span className="font-medium text-[#FAA21B]">{episode.duration}</span>
          </div>
          {episode.episodeType !== 'full' && (
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#FAA21B]/20 text-[#FAA21B] capitalize">
              {episode.episodeType}
            </span>
          )}
        </div>

        {/* Video or artwork */}
        {episode.youtubeVideoId ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-8 shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${episode.youtubeVideoId}`}
              title={episode.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 w-full h-full"
            />
          </div>
        ) : (
          <div className="relative w-full rounded-xl overflow-hidden mb-8 shadow-lg">
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Play audio button */}
        <div className="mb-10 flex">
          {episode.youtubeVideoId ? (
            <div className="relative rounded-xl overflow-hidden shadow-lg">
            <img
              src={episode.imageUrl}
              alt={episode.title}
              className="h-32 w-32 object-cover"
            />
          </div>
          ): null}
          <div className="my-auto ml-auto">
            <EpisodePlayButton episode={episode} />
          </div>
        </div>

        {/* Description */}
        <EpisodeDescription html={episode.description} />
      </div>
    </div>
  )
}
