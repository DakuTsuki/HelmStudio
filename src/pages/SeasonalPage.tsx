import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Calendar,
  Flame,
  Star,
  Tv,
  ChevronRight,
  TrendingUp,
  Layers,
  Filter
} from 'lucide-react';
import { Anime } from '../types';
import { anilistService } from '../services/anilist';
import { AnimeCard } from '../components/AnimeCard';
import { SkeletonCard } from '../components/SkeletonCard';

interface SeasonalPageProps {
  onSelectAnime: (animeId: number) => void;
  onNavigate?: (view: string) => void;
}

const SEASONS: Array<{ label: string; value: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'; icon: string }> = [
  { label: 'Winter', value: 'WINTER', icon: '❄️' },
  { label: 'Spring', value: 'SPRING', icon: '🌸' },
  { label: 'Summer', value: 'SUMMER', icon: '☀️' },
  { label: 'Fall', value: 'FALL', icon: '🍁' }
];

export const SeasonalPage: React.FC<SeasonalPageProps> = ({ onSelectAnime, onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0 - 11

  // Detect current season
  const getDefaultSeason = (): 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL' => {
    if (currentMonth <= 2) return 'WINTER';
    if (currentMonth <= 5) return 'SPRING';
    if (currentMonth <= 8) return 'SUMMER';
    return 'FALL';
  };

  const [selectedSeason, setSelectedSeason] = useState<'WINTER' | 'SPRING' | 'SUMMER' | 'FALL'>(getDefaultSeason());
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [formatFilter, setFormatFilter] = useState<'ALL' | 'TV' | 'MOVIE'>('ALL');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  const years = [currentYear + 1, currentYear, currentYear - 1, currentYear - 2];

  useEffect(() => {
    let isMounted = true;
    async function loadSeasonal() {
      setLoading(true);
      try {
        const data = await anilistService.getSeasonalAnime(selectedSeason, selectedYear, 1, 28);
        if (isMounted) {
          setAnimeList(data);
        }
      } catch (err) {
        console.error('Failed to load seasonal data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadSeasonal();
    return () => {
      isMounted = false;
    };
  }, [selectedSeason, selectedYear]);

  const filteredAnime = animeList.filter(anime => {
    if (formatFilter === 'TV') return anime.format === 'TV' || anime.format === 'TV_SHORT';
    if (formatFilter === 'MOVIE') return anime.format === 'MOVIE';
    return true;
  });

  return (
    <div className="min-h-screen pb-24 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-600/30 text-violet-300 text-xs font-bold border border-violet-500/30 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Seasonal Archive & Charts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span>{selectedSeason} {selectedYear} Anime Chart</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse seasonal line-ups, premiering shows, top-rated broadcasts, and movies.
          </p>
        </div>

        {/* Season & Year Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Season Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-white/10">
            {SEASONS.map(s => {
              const active = selectedSeason === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setSelectedSeason(s.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    active
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Year Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-white/10">
            {years.map(yr => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="glass-panel p-3 sm:p-4 rounded-2xl border border-white/5 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Format:
          </span>
          {(['ALL', 'TV', 'MOVIE'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setFormatFilter(fmt)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                formatFilter === fmt
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {fmt === 'ALL' ? 'All Releases' : fmt === 'TV' ? 'TV Broadcasts' : 'Movies'}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Showing <span className="text-white font-bold">{filteredAnime.length}</span> titles
        </div>
      </div>

      {/* Anime Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {filteredAnime.map(anime => (
            <AnimeCard key={anime.id} anime={anime} onSelect={onSelectAnime} />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-3xl border border-white/5">
          <p className="text-sm text-slate-300 font-semibold">No titles found for {selectedSeason} {selectedYear}.</p>
          <p className="text-xs text-slate-500 mt-1">Try switching to a different season or format filter.</p>
        </div>
      )}
    </div>
  );
};
