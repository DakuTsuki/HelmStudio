import React from 'react';
import { Star, BookmarkPlus, Play, Check } from 'lucide-react';
import { Anime } from '../types';
import { useAuth } from '../context/AuthContext';

interface AnimeCardProps {
  anime: Anime;
  onSelect: (animeId: number) => void;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onSelect }) => {
  const { userList, addOrUpdateAnimeInList } = useAuth();
  const listItem = userList.find(item => item.animeId === anime.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (listItem) {
      // Toggle or keep
    } else {
      addOrUpdateAnimeInList(anime, 'PLANNING', 0, 0);
    }
  };

  return (
    <div
      onClick={() => onSelect(anime.id)}
      className="group relative flex flex-col rounded-2xl overflow-hidden glass-card cursor-pointer border border-white/5 hover:border-violet-500/40 transition-all duration-300"
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[3/4.2] w-full overflow-hidden bg-slate-900">
        <img
          src={anime.coverImage.large || anime.coverImage.extraLarge}
          alt={anime.title.romaji}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {anime.averageScore ? (
            <div className="px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur text-amber-300 font-bold text-[11px] flex items-center gap-1 border border-white/10 shadow">
              <Star className="w-3 h-3 fill-amber-300" />
              <span>{anime.averageScore}%</span>
            </div>
          ) : (
            <div />
          )}

          <span className="px-2 py-0.5 rounded-lg bg-violet-950/80 backdrop-blur text-violet-300 font-bold text-[10px] uppercase border border-violet-500/30">
            {anime.format}
          </span>
        </div>

        {/* Airing Episode countdown pill if available */}
        {anime.nextAiringEpisode && (
          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-emerald-950/85 backdrop-blur text-emerald-300 font-medium text-[10px] border border-emerald-500/30">
            Ep {anime.nextAiringEpisode.episode} in {Math.floor(anime.nextAiringEpisode.timeUntilAiring / 3600)}h
          </div>
        )}

        {/* Hover Quick Action Buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 justify-between">
          <button
            onClick={handleQuickAdd}
            className={`p-2 rounded-xl backdrop-blur transition-all cursor-pointer ${
              listItem
                ? 'bg-emerald-600 text-white'
                : 'bg-white/20 hover:bg-violet-600 text-white'
            }`}
            title={listItem ? `In List: ${listItem.status}` : 'Quick Add to Planning'}
          >
            {listItem ? <Check className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
          </button>

          <span className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
            <Play className="w-3 h-3 fill-white" /> Details
          </span>
        </div>
      </div>

      {/* Info Content */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1 leading-snug">
            {anime.title.english || anime.title.romaji}
          </h3>
          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
            {anime.genres.slice(0, 2).join(' • ')}
          </p>
        </div>

        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
          <span className="capitalize">{anime.status.toLowerCase().replace('_', ' ')}</span>
          {anime.episodes ? <span>{anime.episodes} eps</span> : <span>Air ongoing</span>}
        </div>
      </div>
    </div>
  );
};
