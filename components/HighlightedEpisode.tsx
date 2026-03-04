function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    if (url.hostname === 'youtu.be') return url.pathname.slice(1)
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v')
      if (v) return v
      const pathParts = url.pathname.split('/')
      const embedIdx = pathParts.indexOf('embed')
      if (embedIdx !== -1) return pathParts[embedIdx + 1] ?? null
    }
  } catch {
    // not a URL — fall through
  }
  return null
}

interface HighlightedEpisodeProps {
  youtubeUrl: string
}

export function HighlightedEpisode({ youtubeUrl }: HighlightedEpisodeProps) {
  const videoId = extractYouTubeId(youtubeUrl)
  if (!videoId) return null

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2
            className="font-black uppercase leading-none tracking-tight mb-2"
            style={{
              fontFamily: 'var(--font-barlow), sans-serif',
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              color: 'white',
            }}
          >
            Watch Now
          </h2>
          <p className="font-medium text-sm uppercase tracking-widest" style={{ color: 'rgba(250,162,27,0.8)' }}>
            Featured episode
          </p>
        </div>

        <div className="aspect-video w-full max-w-4xl mx-auto overflow-hidden rounded-2xl ring-1 ring-[#FAA21B]/20 shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="Highlighted episode"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>
    </section>
  )
}
