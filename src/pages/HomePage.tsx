import React, { useState, useEffect } from 'react';
import {
  Play,
  BookmarkPlus,
  Star,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  Award,
  Vote,
  ExternalLink,
  Swords,
  Dices,
  CheckCircle2
} from 'lucide-react';
import { Anime, EventItem, NewsArticle } from '../types';
import { anilistService } from '../services/anilist';
import { MOCK_EVENTS, MOCK_NEWS } from '../data/mockData';
import { ThreeHeroCanvas } from '../components/ThreeHeroCanvas';
import { AnimeCard } from '../components/AnimeCard';
import { SkeletonCard } from '../components/SkeletonCard';
import { AdBanner } from '../components/AdBanner';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface HomePageProps {
  onSelectAnime: (animeId: number) => void;
  onNavigate: (view: string) => void;
  onOpenUpgradeModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectAnime,
  onNavigate,
  onOpenUpgradeModal
}) => {
  const { addOrUpdateAnimeInList, userList } = useAuth();

  const [trending, setTrending] = useState<Anime[]>([]);
  const [airingToday, setAiringToday] = useState<Anime[]>([]);
  const [popular, setPopular] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero Carousel State
  const [heroIndex, setHeroIndex] = useState(0);

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
          anilistService.getTrendingAnime(1, 8),
          anilistService.getAiringSchedule(),
          anilistService.getPopularAnime(1, 8)
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

  // Auto-advance hero carousel every 7 seconds
  useEffect(() => {
    if (trending.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % Math.min(trending.length, 5));
    }, 7000);
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
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <div className="min-h-screen pb-24 text-slate-100">
      {/* 3D Three.js Hero Section */}
      <section className="relative w-full h-[580px] sm:h-[640px] overflow-hidden flex items-end pb-12 sm:pb-16 bg-[#070913]">
        {/* Three.js interactive 3D particle & knot canvas */}
        <ThreeHeroCanvas accentColor="#8b5cf6" />

        {/* Dynamic Background Backdrop image of active hero anime */}
        {activeHero && (
          <div className="absolute inset-0 z-0">
            <img
              src={activeHero.bannerImage || activeHero.coverImage.extraLarge}
              alt={activeHero.title.romaji}
              className="w-full h-full object-cover object-center filter brightness-[0.38] scale-105 transition-all duration-1000 ease-out"
            />
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#070913] via-[#070913]/60 to-transparent" />
          </div>
        )}

        {/* Hero Spotlight Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          {activeHero ? (
            <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-violet-600/90 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-violet-600/30 glow-violet">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                  #1 Trending on Helm
                </span>
                {activeHero.averageScore && (
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur text-amber-300 font-bold text-xs flex items-center gap-1 border border-white/10">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    {activeHero.averageScore}%
                  </span>
                )}
                <span className="text-xs text-slate-300 uppercase font-semibold">
                  {activeHero.format} • {activeHero.seasonYear || 2025}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight">
                {activeHero.title.english || activeHero.title.romaji}
              </h1>

              {/* Synopsis */}
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 mt-3 max-w-xl leading-relaxed">
                {activeHero.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button
                  onClick={() => onSelectAnime(activeHero.id)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-violet-600/30 transition-all hover:scale-105 cursor-pointer glow-violet"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>View Details & Where to Watch</span>
                </button>

                <button
                  onClick={() => addOrUpdateAnimeInList(activeHero, 'PLANNING', 0, 0)}
                  className="px-5 py-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 border border-white/15 backdrop-blur transition-all cursor-pointer"
                >
                  <BookmarkPlus className="w-4 h-4 text-violet-400" />
                  <span>{userList.some(i => i.animeId === activeHero.id) ? 'In My List' : 'Add to List'}</span>
                </button>
              </div>

              {/* Carousel Indicators */}
              <div className="flex items-center gap-2 mt-8">
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
              <div className="h-20 w-full rounded-xl skeleton-shimmer" />
            </div>
          )}
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 mt-8">
        {/* Interactive Feature: Anime of the Week + Quick Arena Strip */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Community Vote Widget */}
          <div className="lg:col-span-2 glass-panel p-5 sm:p-6 rounded-3xl border border-violet-500/20 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center">
                  <Vote className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Anime of the Week: Community Ballot</h3>
                  <p className="text-xs text-slate-400">Cast your official vote for the most epic episode this week</p>
                </div>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 uppercase tracking-wider">
                Live Voting
              </span>
            </div>

            <div className="space-y-2.5">
              {aotwPoll.options.map(option => {
                const isSelected = aotwVoted === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleVoteAOTW(option.id)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? 'border-violet-400 bg-violet-950/40 shadow-md'
                        : 'border-white/5 hover:border-violet-500/30 bg-slate-900/60'
                    }`}
                  >
                    {/* Animated Progress Bar fill */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out ${
                        isSelected ? 'bg-violet-600/30' : 'bg-slate-800/40 group-hover:bg-slate-800/60'
                      }`}
                      style={{ width: `${option.percent}%` }}
                    />

                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-600 group-hover:border-violet-400 shrink-0" />
                        )}
                        <span className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-white">
                          {option.name}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-300">
                        {option.percent}% <span className="text-[10px] text-slate-400 font-normal">({option.votes})</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {aotwVoted && (
              <p className="text-[11px] text-emerald-400 mt-3 text-center font-medium">
                Vote recorded! Community ranking updates dynamically every 15 minutes.
              </p>
            )}
          </div>

          {/* Quick Arena Debate Spotlight */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-rose-500/20 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Swords className="w-4 h-4" />
                Featured Live Debate
              </div>
              <h4 className="text-lg font-extrabold text-white leading-snug">
                Gojo vs. Sukuna: Who Is Truly The Strongest?
              </h4>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                Active arena clash! Join Team Gojo (Limitless) or Team Sukuna (Malevolent Shrine) with live chat & voting.
              </p>

              {/* Vote Split Ratio */}
              <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-violet-400">Team Gojo (52%)</span>
                  <span className="text-rose-400">Team Sukuna (48%)</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex">
                  <div className="h-full bg-violet-600" style={{ width: '52%' }} />
                  <div className="h-full bg-rose-600" style={{ width: '48%' }} />
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigate('events')}
              className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              <span>Enter Debate Arena</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Trending Now Row */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl sm:text-2xl font-black text-white">Trending Now</h2>
            </div>
            <button
              onClick={() => onNavigate('browse')}
              className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              trending.slice(0, 8).map(anime => (
                <AnimeCard key={anime.id} anime={anime} onSelect={onSelectAnime} />
              ))
            )}
          </div>
        </section>

        {/* Airing Today Strip with Live Timers */}
        <section className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Airing This Season ({airingToday.length} Total)</h2>
                <p className="text-xs text-slate-400">Live simulcast countdowns synced to your local clock</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('schedule')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Weekly Calendar ({airingToday.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              airingToday.slice(0, 8).map(anime => (
                <AnimeCard key={anime.id} anime={anime} onSelect={onSelectAnime} />
              ))
            )}
          </div>
        </section>

        {/* Helm News Feed Strip (Anime Corner & X Official) */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Helm News & Recaps</h2>
                <p className="text-xs text-slate-400">Pulled from Anime Corner RSS & verified X updates</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('news')}
              className="text-xs text-slate-400 hover:text-white font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>View All Articles</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {MOCK_NEWS.map(article => (
              <div
                key={article.id}
                onClick={() => onNavigate('news')}
                className="group glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between border border-white/5 hover:border-violet-500/30 transition-all"
              >
                <div>
                  <div className="h-44 w-full overflow-hidden relative">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur text-violet-300 text-[10px] font-bold uppercase border border-white/10">
                      {article.source}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1.5">
                      <span>{article.publishedAt}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px]">{article.author}</span>
                  <span className="text-violet-400 font-bold group-hover:underline flex items-center gap-0.5">
                    Read recap <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sponsored Ad Banner (Automated hide for Premium/Pro) */}
        <AdBanner position="banner" onOpenUpgradeModal={onOpenUpgradeModal} />
      </div>
    </div>
  );
};
