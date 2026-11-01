import React, { useState } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  Pin,
  Tag,
  PlusCircle,
  ExternalLink,
  Shield,
  Flag,
  Share2,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ForumThread, NewsArticle } from '../types';
import { MOCK_FORUM_THREADS, MOCK_NEWS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface CommunityPageProps {
  onOpenReportModal?: (content: string, type: 'comment' | 'user' | 'thread') => void;
  onNavigateToNewsArticle?: (article: NewsArticle) => void;
}

const CATEGORIES = [
  'All Threads',
  'General Anime',
  'Episode Discussions',
  'Theories & Spoilers',
  'Debate Lounge',
  'Manga & LN'
];

export const CommunityPage: React.FC<CommunityPageProps> = ({
  onOpenReportModal,
  onNavigateToNewsArticle
}) => {
  const { currentUser, addNotification } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All Threads');
  const [threads, setThreads] = useState<ForumThread[]>(MOCK_FORUM_THREADS);

  // New Thread Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [threadTitle, setThreadTitle] = useState('');
  const [threadContent, setThreadContent] = useState('');
  const [threadCategory, setThreadCategory] = useState<'General Anime' | 'Episode Discussions' | 'Theories & Spoilers' | 'Debate Lounge' | 'Manga & LN'>('General Anime');
  const [threadTag, setThreadTag] = useState('');

  const filteredThreads = selectedCategory === 'All Threads'
    ? threads
    : threads.filter(t => t.category === selectedCategory);

  const handleUpvote = (id: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          upvotes: t.userUpvoted ? t.upvotes - 1 : t.upvotes + 1,
          userUpvoted: !t.userUpvoted
        };
      }
      return t;
    }));
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!threadTitle.trim() || !threadContent.trim()) return;

    const newThread: ForumThread = {
      id: `th_${Date.now()}`,
      category: threadCategory,
      title: threadTitle.trim(),
      content: threadContent.trim(),
      authorId: currentUser.id,
      authorName: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      repliesCount: 0,
      upvotes: 1,
      userUpvoted: true,
      isPinned: false,
      createdAt: 'Just now',
      tags: threadTag ? [threadTag.trim()] : ['Discussion']
    };

    setThreads(prev => [newThread, ...prev]);
    setShowCreateModal(false);
    setThreadTitle('');
    setThreadContent('');
    setThreadTag('');

    confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
    addNotification({
      type: 'reply',
      title: 'Thread Created',
      message: `Your thread "${newThread.title}" is now open for discussion.`
    });
  };

  return (
    <div className="min-h-screen pb-24 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-violet-400" />
            <span>Community Forum & Discussion Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Connect with fellow otaku, debate plot twists, and analyze ongoing seasonal series
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/25 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start a Thread</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Categories & Discord Callout */}
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-3xl border border-white/10 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
              Categories
            </h3>
            {CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'bg-violet-600 text-white shadow-md'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{cat}</span>
                  {cat === 'All Threads' && (
                    <span className="text-[10px] opacity-70">{threads.length}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Official Discord Community Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-[#5865F2]/20 to-purple-950/40 border border-[#5865F2]/30 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#5865F2] flex items-center justify-center text-white font-black text-lg">
              D
            </div>
            <h4 className="text-sm font-bold text-white">Join the Helm Discord</h4>
            <p className="text-xs text-slate-300">
              Over 28,000 anime fans in live voice watch-parties, episode drops, and tournament stage chats.
            </p>
            <a
              href="https://discord.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Connect on Discord</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right Column: Forum Threads Stream */}
        <div className="lg:col-span-3 space-y-4">
          {filteredThreads.map(thread => (
            <div
              key={thread.id}
              className={`p-5 rounded-3xl glass-panel border transition-all ${
                thread.isPinned ? 'border-amber-500/30 bg-amber-950/10' : 'border-white/5 hover:border-violet-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <img src={thread.authorAvatar} alt={thread.authorName} className="w-8 h-8 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{thread.authorName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 font-bold uppercase">
                        {thread.authorRole}
                      </span>
                      {thread.isPinned && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center gap-1">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{thread.createdAt} in {thread.category}</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenReportModal && onOpenReportModal(thread.title, 'thread')}
                  className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Report Thread"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>

              <h2 className="text-base font-bold text-white mt-1 hover:text-violet-300 transition-colors cursor-pointer">
                {thread.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-sans">
                {thread.content}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5 text-xs">
                <div className="flex items-center gap-1.5">
                  {thread.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpvote(thread.id)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-xl transition-all cursor-pointer ${
                      thread.userUpvoted
                        ? 'bg-violet-600/30 text-violet-300 font-bold'
                        : 'bg-white/5 hover:bg-white/10 text-slate-400'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{thread.upvotes}</span>
                  </button>

                  <span className="text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{thread.repliesCount} replies</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Thread Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel p-6 rounded-3xl border border-violet-500/30 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Discussion Thread</h3>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={threadCategory}
                  onChange={e => setThreadCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                >
                  <option value="General Anime">General Anime</option>
                  <option value="Episode Discussions">Episode Discussions</option>
                  <option value="Theories & Spoilers">Theories & Spoilers</option>
                  <option value="Debate Lounge">Debate Lounge</option>
                  <option value="Manga & LN">Manga & LN</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Thread Title *</label>
                <input
                  type="text"
                  required
                  value={threadTitle}
                  onChange={e => setThreadTitle(e.target.value)}
                  placeholder="What would you like to discuss?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Main Discussion Content *</label>
                <textarea
                  rows={4}
                  required
                  value={threadContent}
                  onChange={e => setThreadContent(e.target.value)}
                  placeholder="Share your thoughts, episode analysis, or theory..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tag (Optional)</label>
                <input
                  type="text"
                  value={threadTag}
                  onChange={e => setThreadTag(e.target.value)}
                  placeholder="e.g. SoloLeveling, Spoilers, StudioMappa"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                >
                  Post Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
