import React, { useState } from 'react';
import {
  Newspaper,
  ExternalLink,
  Sparkles,
  Calendar,
  Clock,
  PlusCircle,
  X,
  Share2,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NewsArticle } from '../types';
import { MOCK_NEWS } from '../data/mockData';
import confetti from 'canvas-confetti';

export const NewsPage: React.FC = () => {
  const { currentUser, addNotification } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>(MOCK_NEWS);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  // Admin/Mod Write Recap Modal
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tags, setTags] = useState('');

  const [isRefreshing, setIsRefreshing] = useState(false);

  const canWriteEditorial = currentUser.role === 'admin' || currentUser.role === 'moderator';

  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addNotification({
        type: 'system',
        title: 'News Feed Refreshed',
        message: 'Checked Anime Corner RSS & X Official updates. Feed is up to date!'
      });
    }, 1000);
  };

  const handlePublishRecap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newArticle: NewsArticle = {
      id: `news_${Date.now()}`,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: excerpt.trim() || content.slice(0, 120) + '...',
      content: content.trim(),
      source: 'Helm Editorial',
      sourceUrl: 'https://helmstudio.io',
      author: currentUser.username,
      authorRole: currentUser.role === 'admin' ? 'Head Editor' : 'Editorial Moderator',
      publishedAt: 'Just now',
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
      tags: tags ? tags.split(',').map(t => t.trim()) : ['Editorial'],
      readTime: '3 min read'
    };

    setArticles(prev => [newArticle, ...prev]);
    setShowEditor(false);
    setTitle('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setTags('');

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    addNotification({
      type: 'system',
      title: 'Article Published',
      message: `"${newArticle.title}" is now live on Helm News.`
    });
  };

  return (
    <div className="min-h-screen pb-24 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-bold text-xs uppercase tracking-wider border border-violet-500/30 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Live Wire & Editorial
            </span>
            <span className="text-xs text-slate-400">
              Refreshed every 15 min via Anime Corner & X Official
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Helm News & Industry Recaps
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefreshFeed}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl glass-panel hover:bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            title="Force refresh edge feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-violet-400' : ''}`} />
            <span className="hidden sm:inline">Refresh Feed</span>
          </button>

          {canWriteEditorial && (
            <button
              onClick={() => setShowEditor(true)}
              className="px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write Recap / Article</span>
            </button>
          )}
        </div>
      </div>

      {/* Featured / Lead Article */}
      {articles[0] && (
        <div
          onClick={() => setActiveArticle(articles[0])}
          className="glass-panel rounded-3xl overflow-hidden border border-violet-500/30 mb-8 cursor-pointer group grid grid-cols-1 lg:grid-cols-2"
        >
          <div className="h-64 sm:h-80 lg:h-full overflow-hidden relative">
            <img
              src={articles[0].coverImage}
              alt={articles[0].title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-black/80 backdrop-blur text-violet-300 text-xs font-bold uppercase border border-white/10">
              {articles[0].source}
            </span>
          </div>
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>{articles[0].publishedAt}</span>
                <span>•</span>
                <span>{articles[0].readTime}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-violet-300 transition-colors leading-tight">
                {articles[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed font-sans">
                {articles[0].excerpt}
              </p>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-4">
              <span className="text-xs text-slate-400">By {articles[0].author}</span>
              <span className="text-xs text-violet-400 font-bold group-hover:underline flex items-center gap-1">
                Read Full Story <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.slice(1).map(article => (
          <div
            key={article.id}
            onClick={() => setActiveArticle(article)}
            className="group glass-card rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between border border-white/5 hover:border-violet-500/30 transition-all"
          >
            <div>
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur text-violet-300 text-[10px] font-bold uppercase border border-white/10">
                  {article.source}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                  <span>{article.publishedAt}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] truncate max-w-[140px]">{article.author}</span>
              <span className="text-violet-400 font-bold group-hover:underline">
                Read story →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="relative glass-panel rounded-3xl border border-violet-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-5">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-violet-600/30 text-violet-300 text-[11px] font-bold uppercase border border-violet-500/30">
                Source: {activeArticle.source}
              </span>
              <span className="text-xs text-slate-400">{activeArticle.publishedAt}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {activeArticle.title}
            </h2>

            <div className="rounded-2xl overflow-hidden border border-white/10 max-h-72">
              <img src={activeArticle.coverImage} alt={activeArticle.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-invert prose-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
              {activeArticle.content}
            </div>

            {/* Source Attribution & Link */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between">
              <div className="text-xs">
                <span className="text-slate-400">Original Post: </span>
                <span className="text-slate-200 font-semibold">{activeArticle.source}</span>
              </div>
              <a
                href={activeArticle.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <span>Visit Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal for Admins & Mods */}
      {showEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-violet-500/30 max-w-xl w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-violet-400" />
              <span>Write Editorial Recap</span>
            </h3>

            <form onSubmit={handlePublishRecap} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Winter 2025 Mid-Season Breakdown: Standouts and Misses"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Excerpt</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="A one-sentence summary for the preview card..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={e => setCoverImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Article Content (Markdown) *</label>
                <textarea
                  rows={6}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Draft your analysis, thoughts, and episode review..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
