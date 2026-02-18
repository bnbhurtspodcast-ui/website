import Link from 'next/link'
import { Play, Mic2, Users, TrendingUp, ExternalLink } from 'lucide-react'
import { getEpisodes } from '@/lib/rss'
import { EpisodeCard } from '@/components/EpisodeCard'

export const revalidate = 3600 // 1 hour ISR

export default async function HomePage() {
  const allEpisodes = await getEpisodes()
  const featuredEpisodes = allEpisodes.slice(0, 3)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FAA21B] via-[#ff8c42] to-[#FAA21B] opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzExMkI0RiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <img
                src="/logo.png"
                alt="Back n' Body Hurts Podcast"
                className="w-48 h-48 md:w-64 md:h-64"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#112B4F]/20 backdrop-blur-sm rounded-full text-[#112B4F] text-sm mb-6 font-bold">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              New episodes every week
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-[#112B4F] mb-6">
              Back n&apos; Body Hurts
              <br />
              <span className="text-white drop-shadow-lg">Podcast</span>
            </h1>

            <p className="text-xl text-[#112B4F] font-medium mb-8 max-w-2xl mx-auto">
              Real talk about life&apos;s aches, pains, and everything in between. No filters, just
              honest conversations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/episodes"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#112B4F] text-white rounded-full font-bold hover:bg-[#112B4F]/90 transition-colors shadow-lg"
              >
                <Play className="h-5 w-5" />
                Listen Now
              </Link>
              <a
                href="#subscribe"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/90 backdrop-blur-sm text-[#112B4F] rounded-full font-bold hover:bg-white transition-colors border-2 border-[#112B4F]"
              >
                Subscribe Free
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FAA21B] rounded-full mb-4">
                <Mic2 className="h-6 w-6 text-[#112B4F]" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">58+</div>
              <div className="text-[#FAA21B] font-medium">Episodes Published</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FAA21B] rounded-full mb-4">
                <Users className="h-6 w-6 text-[#112B4F]" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">Toronto</div>
              <div className="text-[#FAA21B] font-medium">EDM Community</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#FAA21B] rounded-full mb-4">
                <TrendingUp className="h-6 w-6 text-[#112B4F]" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">Weekly</div>
              <div className="text-[#FAA21B] font-medium">New Episodes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Episodes */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Latest Episodes</h2>
              <p className="text-[#FAA21B] font-medium">Fresh from the feed</p>
            </div>
            <Link
              href="/episodes"
              className="hidden sm:inline-flex items-center gap-2 text-[#FAA21B] hover:text-[#FAA21B]/80 font-bold"
            >
              View All
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {featuredEpisodes.map((episode) => (
              <EpisodeCard key={episode.id} episode={episode} />
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link
              href="/episodes"
              className="inline-flex items-center gap-2 text-[#FAA21B] hover:text-[#FAA21B]/80 font-bold"
            >
              View All Episodes
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section id="subscribe" className="py-20 bg-[#FAA21B]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#112B4F] mb-4">
            Never Miss an Episode
          </h2>
          <p className="text-[#112B4F]/80 text-lg mb-8 font-medium">
            Subscribe to Back n&apos; Body Hurts on your favorite podcast platform
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            {['Apple Podcasts', 'Spotify', 'Google Podcasts', 'YouTube'].map((platform) => (
              <button
                key={platform}
                className="px-6 py-3 bg-[#112B4F] text-white rounded-full font-bold hover:bg-[#112B4F]/90 transition-colors shadow-lg"
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
