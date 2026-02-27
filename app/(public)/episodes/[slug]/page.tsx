import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import { getEpisodes, searchYouTubeByTitle, CHANNEL_IMAGE } from '@/lib/rss'
import { EpisodePlayButton } from '@/components/EpisodePlayButton'
import { EpisodeDescription } from '@/components/EpisodeDescription'
import { EpisodesRegistrar } from '@/components/EpisodesRegistrar'

export const revalidate = 1800

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const id = decodeURIComponent(slug)
  const episodes = await getEpisodes()
  const episode = episodes.find((ep) => ep.id === id)

  if (!episode) {
    return { title: 'Episode Not Found' }
  }

  const plain = episode.description
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160)

  // Use episode-specific art if it has one; otherwise fall back to /logo.png which is served
  // from the app's own domain and is always crawlable by WhatsApp and other social crawlers.
  const ogImage = (episode.imageUrl && episode.imageUrl !== CHANNEL_IMAGE)
    ? episode.imageUrl
    : '/logo.png'

  return {
    title: episode.title,
    description: plain || `Listen to "${episode.title}" on Back n' Body Hurts.`,
    openGraph: {
      title: episode.title,
      description: plain || `Listen to "${episode.title}" on Back n' Body Hurts.`,
      url: `/episodes/${slug}`,
      type: 'article',
      publishedTime: episode.publishedAt,
      images: [{ url: ogImage, width: 1400, height: 1400, alt: episode.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: episode.title,
      description: plain || `Listen to "${episode.title}" on Back n' Body Hurts.`,
      images: [ogImage],
    },
  }

}

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
    <div className="pt-12">
      <EpisodesRegistrar episodes={episodes} />
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
            className="w-full rounded-xl overflow-hidden mb-8"
            style={{
              border: '1px solid rgba(250,162,27,0.22)',
              boxShadow: '0 0 30px rgba(0,0,0,0.6)',
              aspectRatio: '16 / 9',
            }}
          >
            <iframe
              src={`https://www.youtube.com/embed/${episode.youtubeVideoId}`}
              title={episode.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
              style={{ display: 'block' }}
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

      {/* Listen on your favourite podcast app */}
      <section
        className="mt-16 py-16"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(250,162,27,0.05) 50%, transparent 100%)',
          borderTop: '1px solid rgba(250,162,27,0.15)',
          borderBottom: '1px solid rgba(250,162,27,0.15)',
        }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="font-black uppercase mb-3"
            style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
              color: 'white',
              textShadow: '0 0 40px rgba(250,162,27,0.25)',
            }}
          >
            Listen on your favourite podcast app
          </h2>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Subscribe to Back n&apos; Body Hurts wherever you listen
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/back-n-body-hurts/id1722381103' },
              { label: 'Spotify', href: 'https://open.spotify.com/show/7Evzpy1MHgZR8Yy9xDuxXY' },
              { label: 'YouTube', href: 'https://www.youtube.com/@BnBHurtsPodcast/featured' },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-7 py-3.5 rounded-full font-bold transition-all hover:shadow-[0_0_22px_rgba(250,162,27,0.6)] hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#FAA21B', color: '#112B4F' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
