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
          className="inline-flex items-center gap-2 font-medium mb-8 transition-all group hover:text-[#FAA21B]"
          style={{ color: 'rgba(250,162,27,0.75)' }}
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          All Episodes
        </Link>

        {/* Title */}
        <h1
          className="font-black uppercase leading-tight mb-4"
          style={{
            fontFamily: 'var(--font-barlow), sans-serif',
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            color: 'white',
          }}
        >
          {episode.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-1 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <Calendar className="h-4 w-4" />
            <span>{formatDate(episode.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4 text-[#FAA21B]" />
            <span className="font-medium text-[#FAA21B]">{episode.duration}</span>
          </div>
          {episode.episodeType !== 'full' && (
            <span
              className="px-3 py-0.5 rounded-full text-xs font-bold capitalize"
              style={{
                background: 'rgba(250,162,27,0.12)',
                color: '#FAA21B',
                border: '1px solid rgba(250,162,27,0.3)',
              }}
            >
              {episode.episodeType}
            </span>
          )}
        </div>

        {/* Video or artwork */}
        {episode.youtubeVideoId ? (
          <div
            className="relative w-full aspect-video rounded-xl overflow-hidden mb-8"
            style={{
              border: '1px solid rgba(250,162,27,0.22)',
              boxShadow: '0 0 30px rgba(0,0,0,0.6)',
            }}
          >
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
          <div
            className="relative w-full rounded-xl overflow-hidden mb-8"
            style={{
              border: '1px solid rgba(250,162,27,0.22)',
              boxShadow: '0 0 30px rgba(0,0,0,0.6)',
            }}
          >
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
            <div
              className="relative rounded-xl overflow-hidden"
              style={{
                border: '1px solid rgba(250,162,27,0.2)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <img
                src={episode.imageUrl}
                alt={episode.title}
                className="h-32 w-32 object-cover"
              />
            </div>
          ) : null}
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
