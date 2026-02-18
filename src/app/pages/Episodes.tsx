import { useState } from "react";
import { useOutletContext } from "react-router";
import { Search } from "lucide-react";
import { episodes, categories } from "../data/episodes";
import { EpisodeCard } from "../components/EpisodeCard";
import { Episode } from "../data/episodes";

export function Episodes() {
  const { setCurrentEpisode } = useOutletContext<{ setCurrentEpisode: (episode: Episode) => void }>();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEpisodes = episodes.filter((episode) => {
    const matchesCategory = selectedCategory === "All" || episode.category === selectedCategory;
    const matchesSearch = episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          episode.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            All Episodes
          </h1>
          <p className="text-xl text-[#FAA21B] font-medium">
            Explore our complete collection of conversations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FAA21B]" />
            <input
              type="text"
              placeholder="Search episodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-[#FAA21B]/30 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:border-[#FAA21B] focus:ring-2 focus:ring-[#FAA21B]/20 outline-none transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-bold transition-all ${
                  selectedCategory === category
                    ? "bg-[#FAA21B] text-[#112B4F] shadow-lg"
                    : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-white/80">
            Showing <span className="font-bold text-[#FAA21B]">{filteredEpisodes.length}</span> episode{filteredEpisodes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Episodes Grid */}
        {filteredEpisodes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEpisodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                onPlay={setCurrentEpisode}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#FAA21B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-[#FAA21B]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No episodes found
            </h3>
            <p className="text-white/60">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}