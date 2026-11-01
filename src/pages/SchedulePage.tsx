import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Globe, Search, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { Anime } from '../types';
import { anilistService } from '../services/anilist';
import { AnimeCard } from '../components/AnimeCard';
import { SkeletonCard } from '../components/SkeletonCard';

interface SchedulePageProps {
  onSelectAnime: (animeId: number) => void;
}

const DAYS_OF_WEEK = [
  { id: -1, name: 'All Releases', short: 'All' },
  { id: 0, name: 'Sunday', short: 'Sun' },
  { id: 1, name: 'Monday', short: 'Mon' },
  { id: 2, name: 'Tuesday', short: 'Tue' },
  { id: 3, name: 'Wednesday', short: 'Wed' },
  { id: 4, name: 'Thursday', short: 'Thu' },
  { id: 5, name: 'Friday', short: 'Fri' },
  { id: 6, name: 'Saturday', short: 'Sat' },
];

export const SchedulePage: React.FC<SchedulePageProps> = ({ onSelectAnime }) => {
  const todayDayIndex = new Date().getDay();
  // Default to All Releases (-1) so the user immediately sees the entire schedule!
  const [selectedDay, setSelectedDay] = useState<number>(-1);
  const [schedule, setSchedule] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [userTimezone, setUserTimezone] = useState('');
  const [searchFilter, setSearchFilter] = useState('');

  // Detect local timezone
  useEffect(() => {
    try {
      setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setUserTimezone('Local Time');
    }
  }, []);

  useEffect(() => {
    async function loadSchedule() {
      setLoading(true);
      try {
        const data = await anilistService.getAiringSchedule();
        setSchedule(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadSchedule();
  }, []);

  // Helper to determine which day of the week an anime airs
  const getAnimeDay = (anime: Anime): number => {
    if (anime.nextAiringEpisode?.airingAt) {
      return new Date(anime.nextAiringEpisode.airingAt * 1000).getDay();
    }
    return Math.abs(anime.id % 7);
  };

  // Filtered anime list
  const filteredAnime = schedule.filter(anime => {
    const matchesDay = selectedDay === -1 || getAnimeDay(anime) === selectedDay;
    const matchesSearch = !searchFilter.trim() ||
      anime.title.romaji.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (anime.title.english && anime.title.english.toLowerCase().includes(searchFilter.toLowerCase())) ||
      anime.genres.some(g => g.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesDay && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-24 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Full Broadcast Schedule
            </span>
            <span className="text-xs text-slate-400">
              {schedule.length} airing anime tracked
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-2.5">
            <Calendar className="w-8 h-8 text-emerald-400" />
            <span>Weekly Airing Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time broadcast countdowns synced directly to your local timezone ({userTimezone || 'UTC'})
          </p>
        </div>

        {/* Live search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            placeholder="Search schedule..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Day Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 custom-scrollbar">
        {DAYS_OF_WEEK.map(tab => {
          const isSelected = selectedDay === tab.id;
          const isToday = tab.id === todayDayIndex;
          const count = tab.id === -1
            ? schedule.length
            : schedule.filter(a => getAnimeDay(a) === tab.id).length;

          return (
            <button
              key={tab.id}
              onClick={() => setSelectedDay(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer border flex flex-col items-center min-w-[100px] ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30 scale-102'
                  : 'glass-panel text-slate-300 border-white/5 hover:border-emerald-500/30'
              }`}
            >
              <span className="uppercase tracking-wider">{tab.short}</span>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {count}
                </span>
                {isToday && tab.id !== -1 && (
                  <span className="text-[9px] px-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Today
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Grid Header Info */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>
            {selectedDay === -1
              ? `All Airing Anime (${filteredAnime.length} Titles)`
              : `${DAYS_OF_WEEK.find(d => d.id === selectedDay)?.name} Releases (${filteredAnime.length} Titles)`}
          </span>
        </h2>

        {selectedDay !== -1 && (
          <button
            onClick={() => setSelectedDay(-1)}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
          >
            Show All {schedule.length} Releases
          </button>
        )}
      </div>

      {/* Grid of ALL Airing Anime */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredAnime.map(anime => (
            <div key={anime.id} className="relative flex flex-col group">
              <AnimeCard anime={anime} onSelect={onSelectAnime} />
              {/* Airing countdown card footer */}
              {anime.nextAiringEpisode ? (
                <div className="mt-2 p-2 rounded-xl bg-slate-900/90 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center justify-between">
                  <span>Episode {anime.nextAiringEpisode.episode}</span>
                  <span className="font-mono font-bold">
                    in {Math.floor(anime.nextAiringEpisode.timeUntilAiring / 3600)}h {Math.floor((anime.nextAiringEpisode.timeUntilAiring % 3600) / 60)}m
                  </span>
                </div>
              ) : (
                <div className="mt-2 p-2 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Ongoing Simulcast</span>
                  <span className="text-emerald-400 font-bold">Weekly</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center text-slate-400 glass-panel rounded-3xl border border-white/5 space-y-3">
          <p className="text-base font-bold text-white">No releases match this filter.</p>
          <p className="text-xs text-slate-400">Try selecting "All Releases" to view the complete schedule.</p>
          <button
            onClick={() => {
              setSelectedDay(-1);
              setSearchFilter('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
          >
            Reset Filters & View All
          </button>
        </div>
      )}
    </div>
  );
};
