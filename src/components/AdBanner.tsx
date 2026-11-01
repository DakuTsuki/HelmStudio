import React, { useState } from 'react';
import { ExternalLink, Sparkles, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdBannerProps {
  position?: 'banner' | 'sidebar';
  onOpenUpgradeModal?: () => void;
}

export const AdBanner: React.FC<AdBannerProps> = ({ position = 'banner', onOpenUpgradeModal }) => {
  const { currentUser } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Prompt requirement: Ad slots (banner, sidebar) hidden for Premium & Pro
  if (currentUser.role === 'premium' || currentUser.role === 'pro' || dismissed) {
    return null;
  }

  if (position === 'sidebar') {
    return (
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/40 border border-violet-500/20 relative overflow-hidden group">
        <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-2">
          <span>Sponsored</span>
          {onOpenUpgradeModal && (
            <button
              onClick={onOpenUpgradeModal}
              className="text-violet-400 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Sparkles className="w-2.5 h-2.5" /> Remove Ads
            </button>
          )}
        </div>
        <div className="rounded-xl overflow-hidden mb-2.5 border border-white/5">
          <img
            src="https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80"
            alt="Anime Figure Collection"
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <h5 className="text-xs font-bold text-white leading-tight">GoodSmile Official 2025 Winter Sale</h5>
        <p className="text-[11px] text-slate-300 mt-1">Get up to 30% off licensed Nendoroids & Pop Up Parade figures with code HELM2025.</p>
        <a
          href="https://www.goodsmile.info"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 w-full py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Shop Licensed Merch</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full my-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900/80 to-purple-950/40 border border-violet-500/20 relative flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0 border border-violet-500/30">
          <Sparkles className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/10 text-slate-400">
              Sponsored
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Helm Studio x Crunchyroll Store: 15% Off Your Next Collector's Edition
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Use code <span className="text-violet-300 font-mono font-bold">HELMOTAKU</span> at checkout.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <a
          href="https://store.crunchyroll.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <span>Claim Offer</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <button
          onClick={() => {
            if (onOpenUpgradeModal) onOpenUpgradeModal();
            else setDismissed(true);
          }}
          className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Upgrade to Premium to remove ads"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
