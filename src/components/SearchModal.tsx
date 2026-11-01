import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Star, Calendar, Sparkles, Loader2 } from 'lucide-react';
import { anilistService } from '../services/anilist';
import { Anime } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnime: (animeId: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectAnime }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await anilistService.searchAnime({ search: searchTerm, perPage: 8 });
      setResults(res.anime);
      setLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Keyboard escape shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-violet-500/30 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-slate-900/60">
          <Search className="w-5 h-5 text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search anime by title, character, or studio (e.g. Solo Leveling, MAPPA)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none"
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-violet-400 animate-spin shrink-0" />
          ) : searchTerm ? (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto divide-y divide-white/5 p-2">
          {loading && results.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
              <span>Querying AniList live catalog...</span>
            </div>
          ) : results.length > 0 ? (
            results.map(anime => (
              <div
                key={anime.id}
                onClick={() => {
                  onSelectAnime(anime.id);
                  onClose();
                }}
                className="p-3 rounded-2xl flex items-center gap-3.5 hover:bg-violet-950/30 cursor-pointer transition-all group"
              >
                <img
                  src={anime.coverImage.medium}
                  alt={anime.title.romaji}
                  className="w-12 h-16 rounded-xl object-cover border border-white/10 group-hover:border-violet-500/50 transition-colors shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                    {anime.title.english || anime.title.romaji}
                  </h4>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{anime.title.native || anime.title.romaji}</p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold uppercase text-[10px]">
                      {anime.format}
                    </span>
                    {anime.averageScore && (
                      <span className="flex items-center gap-0.5 text-amber-300 font-bold">
                        <Star className="w-3 h-3 fill-amber-300" />
                        {anime.averageScore}%
                      </span>
                    )}
                    {anime.seasonYear && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {anime.seasonYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : searchTerm ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No matching anime found for "{searchTerm}".
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs">
              <Sparkles className="w-5 h-5 text-violet-400 mx-auto mb-2" />
              Type anything to search live across over 10,000+ anime titles powered by AniList.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
