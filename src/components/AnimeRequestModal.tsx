import React, { useState } from 'react';
import { Send, X, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AnimeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnimeRequestModal: React.FC<AnimeRequestModalProps> = ({ isOpen, onClose }) => {
  const { addNotification } = useAuth();
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNotification({
      type: 'system',
      title: 'Anime Request Received',
      message: `Your request for "${title}" has been sent to our editorial catalog team.`
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setYear('');
      setNotes('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg glass-panel rounded-3xl border border-violet-500/30 p-6 sm:p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-bold text-white">Request an Anime</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Can't find a hidden gem or missing licensed streaming link? Submit it to our catalog curators.
        </p>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in zoom-in-95">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-base font-bold text-emerald-300">Request Dispatched!</h4>
            <p className="text-xs text-slate-300 mt-1">Our librarians review requests within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Anime Title (English or Romaji) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Kaiju No. 8, Hell's Paradise..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Release Year / Season (Optional)
              </label>
              <input
                type="text"
                value={year}
                onChange={e => setYear(e.target.value)}
                placeholder="e.g. 2024, Spring 2025"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Notes or Missing Streaming Platform
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Where is it currently streaming? Any specific OVA/movie details?"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-lg shadow-violet-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
