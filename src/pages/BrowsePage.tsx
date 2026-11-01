import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  Calendar,
  Grid,
  List,
  ChevronDown,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Anime } from '../types';
import { anilistService } from '../services/anilist';
import { AnimeCard } from '../components/AnimeCard';
import { SkeletonCard } from '../components/SkeletonCard';

interface BrowsePageProps {
  onSelectAnime: (animeId: number) => void;
}

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror',
  'Mecha', 'Mystery', 'Psychological', 'Romance', 'Sci-Fi',
  'Slice of Life', 'Sports', 'Supernatural', 'Thriller'
];

const SEASONS = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
const STATUSES = [
  { label: 'Releasing', value: 'RELEASING' },
  { label: 'Finished', value: 'FINISHED' },
  { label: 'Not Yet Released', value: 'NOT_YET_RELEASED' }
];

export const BrowsePage: React.FC<BrowsePageProps> = ({ onSelectAnime }) => {
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const fetchAnime = async () => {
    setLoading(true);
    try {
      const res = await anilistService.searchAnime({
        search: search || undefined,
        genres: selectedGenre ? [selectedGenre] : undefined,
        year: selectedYear,
        season: selectedSeason || undefined,
        status: selectedStatus || undefined,
        sort: sortBy,
        perPage: 24
      });
      setAnimeList(res.anime);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAnime();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedGenre, selectedYear, selectedSeason, selectedStatus, sortBy]);

  const handleReset = () => {
    setSearch('');
    setSelectedGenre('');
    setSelectedYear(undefined);
    setSelectedSeason('');
    setSelectedStatus('');
    setSortBy('popularity');
  };

  return (
    <div className="min-h-screen pb-24 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-violet-400" />
            <span>Browse Anime Library</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Search across thousands of anime titles powered by the AniList GraphQL catalog
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-violet-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Live search titles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900/90 border border-white/10 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-violet-500 transition-colors shadow-inner"
          />
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-slate-200">Refine Filters</span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg cursor-pointer ${
                  viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer ml-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {/* Genre */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Genre</label>
            <select
              value={selectedGenre}
              onChange={e => setSelectedGenre(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            >
              <option value="">All Genres</option>
              {GENRES.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Year</label>
            <select
              value={selectedYear || ''}
              onChange={e => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            >
              <option value="">Any Year</option>
              {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2015, 2010].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* Season */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Season</label>
            <select
              value={selectedSeason}
              onChange={e => setSelectedSeason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            >
              <option value="">Any Season</option>
              {SEASONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Status</label>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            >
              <option value="">Any Status</option>
              {STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="col-span-2 sm:col-span-4 lg:col-span-1">
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Top Rated</option>
              <option value="trending">Trending Now</option>
              <option value="newest">Release Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : animeList.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {animeList.map(anime => (
              <AnimeCard key={anime.id} anime={anime} onSelect={onSelectAnime} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {animeList.map(anime => (
              <div
                key={anime.id}
                onClick={() => onSelectAnime(anime.id)}
                className="glass-panel p-3.5 rounded-2xl border border-white/5 hover:border-violet-500/30 transition-all flex items-center justify-between gap-4 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={anime.coverImage.medium}
                    alt={anime.title.romaji}
                    className="w-14 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-white truncate">
                      {anime.title.english || anime.title.romaji}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {anime.genres.join(', ')}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                      <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold uppercase text-[10px]">
                        {anime.format}
                      </span>
                      <span>{anime.status}</span>
                      {anime.episodes && <span>• {anime.episodes} eps</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {anime.averageScore && (
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-300 font-extrabold text-sm">
                        <Star className="w-4 h-4 fill-amber-300" />
                        <span>{anime.averageScore}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400">Score</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="p-16 text-center text-slate-400 glass-panel rounded-3xl border border-white/5">
          <p className="text-base font-semibold text-white">No titles match your criteria.</p>
          <p className="text-xs text-slate-400 mt-1">Try adjusting or resetting your genre and year filters.</p>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
