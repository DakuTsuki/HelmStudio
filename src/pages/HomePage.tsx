import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  BookmarkPlus,
  Star,
  ChevronRight,
  ChevronLeft,
  Flame,
  Clock,
  Sparkles,
  TrendingUp,
  Vote,
  Swords,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Anime } from '../types';
import { anilistService } from '../services/anilist';
import { MOCK_NEWS } from '../data/mockData';
import { ThreeHeroCanvas } from '../components/ThreeHeroCanvas';
import { AnimeCard } from '../components/AnimeCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface HomePageProps {
  onSelectAnime: (animeId: number) => void;
  onNavigate: (view: string) => void;
  onOpenUpgradeModal: () => void;
}

type AnimeTab = 'trending' | 'airing' | 'popular';

export const HomePage: React.FC<HomePageProps> = ({
  onSelectAnime,
  onNavigate,
}) => {
  const { addOrUpdateAnimeInList, userList } = useAuth();

  const [trending, setTrending] = useState<Anime[]>([]);
  const [airingToday, setAiringToday] = useState<Anime[]>([]);
  const [popular, setPopular] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  // Active Anime Tab
  const [activeTab, setActiveTab] = useState<AnimeTab>('trending');

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);

  // Horizontal Scroll ref
  const animeScrollRef = useRef<HTMLDivElement>(null);

  // Anime of the week vote state
  const [aotwVoted, setAotwVoted] = useState<string | null>(null);
  const [aotwPoll, setAotwPoll] = useState({
    title: 'Episode of the Week Showdown',
    options: [
      { id: '1', name: 'Solo Leveling S2 - Ep 17', votes: 2420, percent: 46 },
      { id: '2', name: 'Dandadan - Ep 9', votes: 1540, percent: 29 },
      { id: '3', name: 'Re:Zero S3 - Ep 8', votes: 810, percent: 15 },
      { id: '4', name: 'Bleach TYBW - Ep 7', votes: 530, percent: 10 },
    ]
  });

  useEffect(() => {
    let isMounted = true;
    async function loadHomeData() {
      setLoading(true);
      try {
        const [trendData, airData, popData] = await Promise.all([
          anilistService.getTrendingAnime(1, 10),
          anilistService.getAiringSchedule(),
          anilistService.getPopularAnime(1, 10)
        ]);

        if (isMounted) {
          setTrending(trendData);
          setAiringToday(airData);
          setPopular(popData);
        }
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadHomeData();
    return () => { isMounted = false; };
  }, []);

  // Auto-advance hero carousel every 8 seconds
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % Math.min(trending.length, 5));
    }, 8000);
    return () => clearInterval(interval);
  }, [trending]);

  const activeHero = trending[heroIndex] || trending[0];

  const handleVoteAOTW = (optionId: string) => {
    if (aotwVoted) return;
    setAotwVoted(optionId);
    setAotwPoll(prev => {
      const updated = prev.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt);
      const total = updated.reduce((acc, curr) => acc + curr.votes, 0);
      return {
        ...prev,
        options: updated.map(opt => ({
          ...opt,
          percent: Math.round((opt.votes / total) * 100)
        }))
      };
    });

    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.8 }
    });
  };

  const scrollRow = (direction: 'left' | 'right') => {
    if (animeScrollRef.current) {
      const offset = direction === 'left' ? -500 : 500;
      animeScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const currentAnimeList =
    activeTab === 'trending'
      ? trending
      : activeTab === 'airing'
      ? airingToday
      : popular;

  return (
    <div className="min-h-screen pb-20 text-slate-100">
      {/* 1. Cinematic Hero Section */}
      <section className="relative w-full h-[520px] sm:h-[600px] overflow-hidden flex items-end pb-10 sm:pb-14 bg-[#070913]">
        <ThreeHeroCanvas accentColor="#8b5cf6" />

        {activeHero && (
          <div className="absolute inset-0 z-0">
            <img
              src={activeHero.bannerImage || activeHero.coverImage.extraLarge}
              alt={activeHero.title.romaji}
              className="w-full h-full object-cover object-center filter brightness-[0.35] scale-105 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/65 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070913] via-[#070913]/50 to-transparent" />
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          {activeHero ? (
            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-violet-600/90 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-violet-600/30">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  Featured Showcase
                </span>
                {activeHero.averageScore && (
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-amber-300 font-bold text-xs flex items-center gap-1 border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    {activeHero.averageScore}%
                  </span>
                )}
                <span className="text-xs text-slate-300 uppercase font-semibold">
                  {activeHero.format} • {activeHero.seasonYear || 2026}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
                {activeHero.title.english || activeHero.title.romaji}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 sm:line-clamp-3 mt-3 max-w-xl leading-relaxed">
                {activeHero.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button
                  onClick={() => onSelectAnime(activeHero.id)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all hover:scale-105 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>View Details & Where to Watch</span>
                </button>

                <button
                  onClick={() => addOrUpdateAnimeInList(activeHero, 'PLANNING', 0, 0)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/15 backdrop-blur transition-all cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4 text-violet-400" />
                  <span>{userList.some(i => i.animeId === activeHero.id) ? 'In My List' : 'Add to List'}</span>
                </button>
              </div>

              {/* Minimal dots indicator */}
              <div className="flex items-center gap-2 mt-6">
                {trending.slice(0, 5).map((anime, idx) => (
                  <button
                    key={anime.id}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      idx === heroIndex ? 'w-8 bg-violet-400' : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-xl">
              <div className="h-6 w-32 rounded-full skeleton-shimmer" />
              <div className="h-12 w-3/4 rounded-xl skeleton-shimmer" />
              <div className="h-16 w-full rounded-xl skeleton-shimmer" />
            </div>
          )}
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 mt-8">

        {/* 2. Organized Tabbed Anime Feed (Trending / Airing Today / Popular) */}
        <section className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            {/* Tab switch pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-white/10 self-start">
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'trending'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Trending</span>
              </button>

              <button
                onClick={() => setActiveTab('airing')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'airing'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Airing Schedule</span>
              </button>

              <button
                onClick={() => setActiveTab('popular')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'popular'
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>All-Time Popular</span>
              </button>
            </div>

            {/* Quick Controls: Left/Right arrows + See All */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => scrollRow('left')}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRow('right')}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-white/5 cursor-pointer"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => onNavigate(activeTab === 'airing' ? 'schedule' : 'browse')}
                className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 ml-2 cursor-pointer"
              >
                <span>View Full {activeTab === 'airing' ? 'Calendar' : 'Catalog'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Smooth Horizontal Carousel */}
          <div
            ref={animeScrollRef}
            className="flex gap-4 overflow-x-auto pb-3 pt-1 scroll-smooth no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="min-w-[170px] sm:min-w-[210px] shrink-0">
                  <SkeletonCard />
                </div>
              ))
            ) : currentAnimeList.length > 0 ? (
              currentAnimeList.map(anime => (
                <div key={anime.id} className="min-w-[170px] sm:min-w-[210px] shrink-0">
                  <AnimeCard anime={anime} onSelect={onSelectAnime} />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6">No anime found in this section.</p>
            )}
          </div>
        </section>

        {/* 3. Community Highlights: Arena Spotlight & Ballot Side-by-Side */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Live Arena Clash Feature */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-rose-500/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <Swords className="w-4 h-4" />
                  Live Debate Arena
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 uppercase">
                  Active Clash
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                Gojo vs. Sukuna: Who Is Truly The Strongest?
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 line-clamp-2">
                Join Team Limitless or Team Malevolent Shrine. Real-time community debate chat with round timer.
              </p>

              {/* Vote Split Ratio */}
              <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-violet-400">Team Gojo (52%)</span>
                  <span className="text-rose-400">Team Sukuna (48%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex">
                  <div className="h-full bg-violet-600 transition-all duration-500" style={{ width: '52%' }} />
                  <div className="h-full bg-rose-600 transition-all duration-500" style={{ width: '48%' }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('events')}
              className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              <span>Enter Arena & Tournaments</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Episode Ballot / Anime of the Week */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-violet-500/20 flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
                  <Vote className="w-4 h-4" />
                  Community Ballot
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 uppercase">
                  Weekly Vote
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                {aotwPoll.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-3">
                Cast your vote for the best episode this week.
              </p>

              <div className="space-y-2">
                {aotwPoll.options.slice(0, 3).map(option => {
                  const isSelected = aotwVoted === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVoteAOTW(option.id)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? 'border-violet-400 bg-violet-950/40 shadow-sm'
                          : 'border-white/5 hover:border-violet-500/30 bg-slate-900/60'
                      }`}
                    >
                      <div
                        className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ease-out ${
                          isSelected ? 'bg-violet-600/30' : 'bg-slate-800/40 group-hover:bg-slate-800/60'
                        }`}
                        style={{ width: `${option.percent}%` }}
                      />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-600 group-hover:border-violet-400 shrink-0" />
                          )}
                          <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                            {option.name}
                          </span>
                        </div>
                        <div className="text-xs font-mono font-bold text-slate-300 ml-2">
                          {option.percent}%
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => onNavigate('events')}
              className="mt-4 text-center text-xs text-violet-400 hover:text-violet-300 font-bold block py-1 cursor-pointer"
            >
              <span>View Leaderboard & All Polls →</span>
            </button>
          </div>
        </section>

        {/* 4. Helm News Highlights (Clean 3-item strip) */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-lg font-black text-white">Helm News & Recaps</h2>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All News</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_NEWS.slice(0, 3).map(article => (
              <div
                key={article.id}
                onClick={() => onNavigate('news')}
                className="group glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between border border-white/5 hover:border-violet-500/30 transition-all"
              >
                <div>
                  <div className="h-36 w-full overflow-hidden relative">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur text-violet-300 text-[10px] font-bold uppercase border border-white/10">
                      {article.source}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-1">
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h4>
                  </div>
                </div>

                <div className="p-3.5 pt-0 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{article.author}</span>
                  <span className="text-violet-400 font-semibold group-hover:underline flex items-center gap-0.5">
                    Read <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};
