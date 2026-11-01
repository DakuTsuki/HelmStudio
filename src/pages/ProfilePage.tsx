import React, { useState } from 'react';
import {
  User,
  Star,
  Film,
  Calendar,
  Award,
  Plus,
  Minus,
  Trash2,
  Edit3,
  ExternalLink,
  Crown,
  Sparkles,
  Play,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { WatchStatus } from '../types';

interface ProfilePageProps {
  onSelectAnime: (animeId: number) => void;
  onOpenUpgradeModal: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onSelectAnime,
  onOpenUpgradeModal
}) => {
  const {
    currentUser,
    userList,
    updateProfile,
    incrementProgress,
    removeFromList,
    addOrUpdateAnimeInList
  } = useAuth();

  const [activeListTab, setActiveListTab] = useState<WatchStatus | 'ALL'>('ALL');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio || '');

  // Filter list
  const filteredList = activeListTab === 'ALL'
    ? userList
    : userList.filter(item => item.status === activeListTab);

  // Continue Watching items (status === 'CURRENT')
  const continueWatching = userList.filter(item => item.status === 'CURRENT');

  const handleSaveBio = () => {
    updateProfile({ bio: bioInput.trim() });
    setIsEditingBio(false);
  };

  return (
    <div className="min-h-screen pb-24 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Profile Header Banner */}
      <div className="relative glass-panel rounded-3xl overflow-hidden border border-white/10 mb-8">
        {/* Banner Cover */}
        <div className="h-44 sm:h-56 w-full bg-slate-900 relative">
          <img
            src={currentUser.banner || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80'}
            alt="Profile Banner"
            className="w-full h-full object-cover filter brightness-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/40 to-transparent" />
        </div>

        {/* User Card Bar */}
        <div className="px-6 sm:px-8 pb-6 -mt-16 sm:-mt-20 relative z-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#070913] shadow-2xl bg-slate-900"
              />
              <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-600 text-white shadow">
                {currentUser.role}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{currentUser.username}</h1>
                {currentUser.role === 'pro' && (
                  <Crown className="w-5 h-5 text-purple-400" />
                )}
                {currentUser.role === 'premium' && (
                  <Sparkles className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <p className="text-xs text-slate-400">{currentUser.email} • Member since {currentUser.createdAt}</p>

              {/* Bio */}
              {isEditingBio ? (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    value={bioInput}
                    onChange={e => setBioInput(e.target.value)}
                    className="px-3 py-1 rounded-xl bg-slate-900 border border-white/20 text-xs text-white"
                  />
                  <button
                    onClick={handleSaveBio}
                    className="px-3 py-1 rounded-xl bg-violet-600 text-white text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-300 mt-1 max-w-lg flex items-center gap-2">
                  <span>{currentUser.bio || 'Anime enthusiast & Helm debater.'}</span>
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="text-slate-500 hover:text-violet-300 p-0.5"
                    title="Edit Bio"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser.role !== 'pro' && (
              <button
                onClick={onOpenUpgradeModal}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Upgrade to Pro</span>
              </button>
            )}
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-2xl bg-[#5865F2]/20 hover:bg-[#5865F2] text-[#5865F2] hover:text-white border border-[#5865F2]/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Discord</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-white/10 bg-slate-950/40 divide-x divide-white/5 text-center py-4">
          <div>
            <span className="font-mono text-xl sm:text-2xl font-black text-white">
              {currentUser.stats.episodesWatched + userList.reduce((acc, i) => acc + i.progress, 0)}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">Episodes Watched</span>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl font-black text-violet-300">
              {userList.length}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">Total In List</span>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl font-black text-emerald-300">
              {currentUser.stats.totalDays}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">Days Spent</span>
          </div>
          <div>
            <span className="font-mono text-xl sm:text-2xl font-black text-amber-300">
              {currentUser.stats.meanScore}
            </span>
            <span className="block text-[11px] text-slate-400 font-medium">Mean Score</span>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="glass-panel p-4 rounded-3xl border border-white/10 mb-8">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" />
          Earned Achievement Badges ({currentUser.badges.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {currentUser.badges.map(badge => (
            <div
              key={badge}
              className="px-3 py-1.5 rounded-xl bg-violet-950/40 border border-violet-500/30 text-violet-300 text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Watching Row */}
      {continueWatching.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Play className="w-4 h-4 text-rose-400 fill-rose-400" />
            <h2 className="text-lg font-black text-white">Continue Watching</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {continueWatching.map(item => (
              <div
                key={item.animeId}
                className="glass-card p-3.5 rounded-2xl border border-white/5 flex items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => onSelectAnime(item.animeId)}
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                >
                  <img
                    src={item.anime.coverImage.medium}
                    alt={item.anime.title.romaji}
                    className="w-12 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white group-hover:text-violet-300 truncate">
                      {item.anime.title.english || item.anime.title.romaji}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Progress: {item.progress} / {item.anime.episodes || '?'}
                    </p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-violet-500 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (item.progress / (item.anime.episodes || 12)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => incrementProgress(item.animeId)}
                  className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white cursor-pointer shadow shrink-0"
                  title="Watched +1 Episode"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My List Tabs */}
      <section className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-violet-400" />
            <h2 className="text-xl font-black text-white">My Anime Library</h2>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'CURRENT', label: 'Watching' },
              { id: 'COMPLETED', label: 'Completed' },
              { id: 'PLANNING', label: 'Planning' },
              { id: 'DROPPED', label: 'Dropped' },
            ].map(tab => {
              const isActive = activeListTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveListTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* List Table */}
        {filteredList.length > 0 ? (
          <div className="divide-y divide-white/5">
            {filteredList.map(item => (
              <div
                key={item.animeId}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => onSelectAnime(item.animeId)}
                  className="flex items-center gap-3.5 cursor-pointer min-w-0"
                >
                  <img
                    src={item.anime.coverImage.medium}
                    alt={item.anime.title.romaji}
                    className="w-11 h-15 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-white group-hover:text-violet-300 truncate">
                      {item.anime.title.english || item.anime.title.romaji}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="capitalize">{item.status.toLowerCase()}</span>
                      <span>•</span>
                      <span>{item.anime.format}</span>
                      {item.score > 0 && (
                        <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                          <Star className="w-3 h-3 fill-amber-300" />
                          {item.score}/10
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        if (item.progress > 0) {
                          addOrUpdateAnimeInList(item.anime, item.status, item.score, item.progress - 1);
                        }
                      }}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white px-1">
                      {item.progress} / {item.anime.episodes || '?'}
                    </span>
                    <button
                      onClick={() => incrementProgress(item.animeId)}
                      className="p-1 rounded-lg bg-violet-600 hover:bg-violet-500 text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromList(item.animeId)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove from List"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">
            No titles currently in this category. Browse the catalog to bookmark anime!
          </div>
        )}
      </section>
    </div>
  );
};
