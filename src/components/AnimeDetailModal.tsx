import React, { useState } from 'react';
import {
  X,
  Star,
  Play,
  BookmarkPlus,
  ExternalLink,
  Plus,
  Minus,
  MessageSquare,
  ThumbsUp,
  Flag,
  Calendar,
  Layers,
  Sparkles,
  Share2
} from 'lucide-react';
import { Anime, CommentItem, WatchStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

interface AnimeDetailModalProps {
  anime: Anime | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenReportModal?: (content: string, type: 'comment' | 'user') => void;
}

export const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({
  anime,
  isOpen,
  onClose,
  onOpenReportModal
}) => {
  const { currentUser, userList, addOrUpdateAnimeInList, removeFromList, incrementProgress, addNotification } = useAuth();

  const [showTrailer, setShowTrailer] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // Local comments state per anime
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'cm_1',
      animeId: anime?.id,
      userId: 'usr_pro',
      username: 'ZephyrBlade',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      userRole: 'pro',
      content: 'The animation peak in the latest episode completely surpassed the source material. A-tier sound design!',
      likes: 24,
      userLiked: false,
      replies: [
        {
          id: 'cm_1_rep_1',
          commentId: 'cm_1',
          userId: 'usr_mod',
          username: 'SakuraGuard',
          userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
          userRole: 'moderator',
          content: 'Agreed! The pacing has been phenomenal.',
          likes: 8,
          createdAt: '1 hour ago'
        }
      ],
      createdAt: '3 hours ago'
    },
    {
      id: 'cm_2',
      animeId: anime?.id,
      userId: 'usr_premium',
      username: 'LunaValkyrie',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      userRole: 'premium',
      content: 'Solid 9/10 so far. Definitely a contender for Anime of the Year in our weekly polls.',
      likes: 15,
      userLiked: false,
      replies: [],
      createdAt: '5 hours ago'
    }
  ]);

  if (!isOpen || !anime) return null;

  const currentListItem = userList.find(item => item.animeId === anime.id);
  const currentStatus = currentListItem?.status;
  const currentScore = currentListItem?.score || 0;
  const currentProgress = currentListItem?.progress || 0;

  const handleStatusChange = (newStatus: WatchStatus) => {
    addOrUpdateAnimeInList(anime, newStatus, currentScore, currentProgress);
  };

  const handleScoreChange = (score: number) => {
    addOrUpdateAnimeInList(anime, currentStatus || 'CURRENT', score, currentProgress);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: CommentItem = {
      id: `cm_${Date.now()}`,
      animeId: anime.id,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      content: commentInput.trim(),
      likes: 1,
      userLiked: true,
      replies: [],
      createdAt: 'Just now'
    };

    setComments(prev => [newComment, ...prev]);
    setCommentInput('');
  };

  const handleAddReply = (commentId: string) => {
    const text = replyInputMap[commentId];
    if (!text || !text.trim()) return;

    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: `rep_${Date.now()}`,
              commentId,
              userId: currentUser.id,
              username: currentUser.username,
              userAvatar: currentUser.avatar,
              userRole: currentUser.role,
              content: text.trim(),
              likes: 0,
              createdAt: 'Just now'
            }
          ]
        };
      }
      return c;
    }));

    setReplyInputMap(prev => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  const handleToggleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: c.userLiked ? c.likes - 1 : c.likes + 1,
          userLiked: !c.userLiked
        };
      }
      return c;
    }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addNotification({
      type: 'system',
      title: 'Link Copied',
      message: `Direct link for ${anime.title.english || anime.title.romaji} copied to clipboard.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl my-auto glass-panel rounded-3xl border border-violet-500/25 shadow-2xl overflow-hidden text-slate-100 max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur border border-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* Header Banner */}
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
            <img
              src={anime.bannerImage || anime.coverImage.extraLarge}
              alt={anime.title.romaji}
              className="w-full h-full object-cover object-center filter brightness-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/60 to-transparent" />

            {/* Trailer overlay button */}
            {anime.trailer?.id && (
              <button
                onClick={() => setShowTrailer(!showTrailer)}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-2.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white font-bold text-xs flex items-center gap-2 shadow-2xl backdrop-blur transition-all cursor-pointer hover:scale-105 glow-crimson"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{showTrailer ? 'Hide Trailer' : 'Watch Official Trailer'}</span>
              </button>
            )}

            {/* Quick Share */}
            <button
              onClick={handleCopyLink}
              className="absolute top-4 left-4 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-slate-200 border border-white/10 transition-colors cursor-pointer"
              title="Share Anime Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Embedded Trailer If Active */}
          {showTrailer && anime.trailer?.id && (
            <div className="p-4 bg-black border-y border-rose-500/30">
              <div className="relative pt-[56.25%] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${anime.trailer.id}?autoplay=1`}
                  title="Anime Trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Main Info Section */}
          <div className="px-5 sm:px-8 pb-8 -mt-20 sm:-mt-24 relative z-10">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Poster Card */}
              <div className="relative group shrink-0 mx-auto sm:mx-0">
                <div className="w-40 sm:w-48 h-60 sm:h-72 rounded-2xl overflow-hidden border-2 border-violet-500/40 shadow-2xl bg-slate-900">
                  <img
                    src={anime.coverImage.extraLarge}
                    alt={anime.title.romaji}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {anime.averageScore && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-violet-600/95 text-white font-black text-xs flex items-center gap-1 shadow-lg backdrop-blur">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{anime.averageScore}%</span>
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold text-xs uppercase">
                    {anime.format}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    anime.status === 'RELEASING'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-700/50 text-slate-300'
                  }`}>
                    {anime.status}
                  </span>
                  {anime.seasonYear && (
                    <span className="text-xs text-slate-400 font-medium">
                      {anime.season} {anime.seasonYear}
                    </span>
                  )}
                  {anime.episodes && (
                    <span className="text-xs text-slate-400">
                      • {anime.episodes} Episodes
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {anime.title.english || anime.title.romaji}
                </h1>
                {anime.title.native && (
                  <p className="text-xs font-medium text-slate-400 mt-0.5 font-sans">
                    {anime.title.native} • {anime.title.romaji}
                  </p>
                )}

                {/* Genres Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {anime.genres.map(g => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-violet-950/40 text-slate-300 text-xs font-medium border border-white/5 transition-colors"
                    >
                      {g}
                    </span>
                  ))}
                </div>

                {/* Next Airing Countdown Banner */}
                {anime.nextAiringEpisode && (
                  <div className="mt-4 p-3 rounded-2xl bg-gradient-to-r from-violet-950/60 to-purple-950/60 border border-violet-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-violet-300 font-semibold">
                      <Calendar className="w-4 h-4 text-violet-400" />
                      <span>Episode {anime.nextAiringEpisode.episode} Airing In:</span>
                    </div>
                    <span className="font-mono font-bold text-white bg-black/40 px-2.5 py-1 rounded-lg">
                      {Math.floor(anime.nextAiringEpisode.timeUntilAiring / 3600)}h{' '}
                      {Math.floor((anime.nextAiringEpisode.timeUntilAiring % 3600) / 60)}m
                    </span>
                  </div>
                )}

                {/* Licensed "Where to watch" links */}
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    Licensed Streaming Services
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {anime.streamingLinks && anime.streamingLinks.length > 0 ? (
                      anime.streamingLinks.map(link => (
                        <a
                          key={link.site}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-violet-900/40 text-slate-200 hover:text-white border border-white/10 hover:border-violet-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        >
                          <span>{link.site}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                        </a>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">Available on Crunchyroll & Netflix</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive "My List & Rating" Control Panel */}
            <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-violet-500/20 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Status Selector */}
                <div>
                  <span className="block text-xs font-semibold text-slate-400 mb-2">Watchlist Status</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(['CURRENT', 'COMPLETED', 'PLANNING', 'DROPPED'] as WatchStatus[]).map(status => {
                      const isActive = currentStatus === status;
                      const labels: Record<WatchStatus, string> = {
                        CURRENT: 'Watching',
                        COMPLETED: 'Completed',
                        PLANNING: 'Plan to Watch',
                        DROPPED: 'Dropped',
                        PAUSED: 'Paused'
                      };
                      return (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                            isActive
                              ? 'bg-violet-600 text-white border-violet-400 shadow-md'
                              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-white/5'
                          }`}
                        >
                          {labels[status]}
                        </button>
                      );
                    })}
                    {currentListItem && (
                      <button
                        onClick={() => removeFromList(anime.id)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Episode Progress Incrementor */}
                <div className="flex items-center gap-4">
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 mb-1">Episodes</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (currentProgress > 0) {
                            addOrUpdateAnimeInList(anime, currentStatus || 'CURRENT', currentScore, currentProgress - 1);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-sm font-bold text-white px-2">
                        {currentProgress} / {anime.episodes || '?'}
                      </span>
                      <button
                        onClick={() => incrementProgress(anime.id)}
                        className="p-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 1-10 Star Rating */}
                  <div>
                    <span className="block text-xs font-semibold text-slate-400 mb-1">Your Score (1-10)</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => (
                        <button
                          key={s}
                          onClick={() => {
                            handleScoreChange(s);
                            confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
                          }}
                          className={`w-5 h-6 text-[10px] font-bold rounded cursor-pointer transition-all ${
                            s <= currentScore
                              ? 'bg-amber-400 text-black shadow-sm scale-105'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="mt-6">
              <h3 className="text-base font-bold text-white mb-2">Synopsis</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                {anime.description}
              </p>
            </div>

            {/* Main Characters & Cast */}
            {anime.characters && anime.characters.length > 0 && (
              <div className="mt-8">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-violet-400" />
                  Main Characters & Cast
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {anime.characters.map(char => (
                    <div
                      key={char.id}
                      className="p-2 rounded-xl bg-slate-900/60 border border-white/5 flex items-center gap-2.5"
                    >
                      {char.image?.large ? (
                        <img
                          src={char.image.large}
                          alt={char.name.full}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-800" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-200 truncate">{char.name.full}</p>
                        {char.voiceActor && (
                          <p className="text-[10px] text-slate-400 truncate">VA: {char.voiceActor.name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Threaded Community Comments */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  Community Reviews & Discussions ({comments.length})
                </h3>
              </div>

              {/* Add Comment Input */}
              <form onSubmit={handleAddComment} className="mb-6 flex gap-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  className="w-9 h-9 rounded-xl object-cover shrink-0 mt-0.5 border border-white/10"
                />
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={commentInput}
                    onChange={e => setCommentInput(e.target.value)}
                    placeholder="Share your review, hype, or critique for this series..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                  />
                  <div className="flex justify-end mt-1.5">
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                    >
                      Post Review
                    </button>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map(c => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={c.userAvatar} alt={c.username} className="w-7 h-7 rounded-lg object-cover" />
                        <span className="text-xs font-bold text-slate-200">{c.username}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold bg-violet-500/20 text-violet-300">
                          {c.userRole}
                        </span>
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenReportModal && onOpenReportModal(c.content, 'comment')}
                          className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer"
                          title="Report Comment"
                        >
                          <Flag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed pl-9">{c.content}</p>

                    <div className="flex items-center gap-4 pl-9 text-xs">
                      <button
                        onClick={() => handleToggleLikeComment(c.id)}
                        className={`flex items-center gap-1 cursor-pointer transition-colors ${
                          c.userLiked ? 'text-violet-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{c.likes}</span>
                      </button>
                      <button
                        onClick={() => setActiveReplyId(activeReplyId === c.id ? null : c.id)}
                        className="text-slate-400 hover:text-violet-300 cursor-pointer transition-colors"
                      >
                        Reply
                      </button>
                    </div>

                    {/* Replies */}
                    {c.replies.length > 0 && (
                      <div className="pl-9 pt-2 space-y-2 border-l-2 border-violet-500/20 ml-9 mt-2">
                        {c.replies.map(rep => (
                          <div key={rep.id} className="text-xs text-slate-300">
                            <span className="font-semibold text-slate-200 mr-1.5">{rep.username}:</span>
                            <span>{rep.content}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input Box */}
                    {activeReplyId === c.id && (
                      <div className="pl-9 pt-2 flex gap-2">
                        <input
                          type="text"
                          value={replyInputMap[c.id] || ''}
                          onChange={e => setReplyInputMap({ ...replyInputMap, [c.id]: e.target.value })}
                          placeholder="Write a reply..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-violet-500"
                        />
                        <button
                          onClick={() => handleAddReply(c.id)}
                          className="px-3 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-bold cursor-pointer"
                        >
                          Reply
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
