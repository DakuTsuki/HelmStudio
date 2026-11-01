import React, { useState } from 'react';
import { Flag, X, ShieldAlert, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetContent?: string;
  targetType?: 'comment' | 'user' | 'thread';
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetContent = '',
  targetType = 'comment'
}) => {
  const { addNotification } = useAuth();
  const [reason, setReason] = useState('Harassment or offensive language');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to local report list for the admin dashboard
    const existingReports = JSON.parse(localStorage.getItem('helm_moderation_reports') || '[]');
    const newReport = {
      id: `rep_${Date.now()}`,
      targetType,
      targetId: `item_${Date.now()}`,
      reason,
      reportedContent: targetContent || 'Reported item',
      reporterName: 'Active User',
      reportedUserName: 'Flagged User',
      createdAt: 'Just now',
      status: 'pending'
    };
    localStorage.setItem('helm_moderation_reports', JSON.stringify([newReport, ...existingReports]));

    addNotification({
      type: 'system',
      title: 'Report Logged',
      message: 'Thank you for keeping Helm Studio safe. Moderators have been alerted.'
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-rose-500/30 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-white">Report Content to Moderation</h3>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in zoom-in-95">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-emerald-300">Report Dispatched</h4>
            <p className="text-xs text-slate-300 mt-1">Our moderation team will review this promptly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {targetContent && (
              <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-xs text-slate-400 italic line-clamp-3">
                "{targetContent}"
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Violation Reason
              </label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              >
                <option value="Harassment or offensive language">Harassment or offensive language</option>
                <option value="Unmarked spoilers">Unmarked spoilers</option>
                <option value="Pirated link or illegal stream">Pirated link or illegal stream</option>
                <option value="Spam or malicious links">Spam or malicious links</option>
                <option value="Other TOS violation">Other TOS violation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional context (optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Help moderators understand what happened..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
