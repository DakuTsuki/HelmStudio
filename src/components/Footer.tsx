import React from 'react';
import { ExternalLink, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenRequestModal: () => void;
  onOpenUpgradeModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenRequestModal,
  onOpenUpgradeModal
}) => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#070913]/90 backdrop-blur-xl py-12 px-4 sm:px-6 text-slate-400 text-xs mt-12 pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-rose-600 p-0.5">
              <div className="w-full h-full bg-[#070913] rounded-[6px] flex items-center justify-center font-bold text-violet-400 text-sm">
                H
              </div>
            </div>
            <span className="font-display font-black text-white text-base tracking-wider">
              HELM<span className="text-violet-400">STUDIO</span>
            </span>
          </div>
          <p className="leading-relaxed text-slate-400">
            The next-generation cinematic anime community, weekly airing countdowns, and real-time interactive debate arena.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Licensed & Legal Streaming Hub</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation</h4>
          <ul className="space-y-1.5">
            <li>
              <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                Home Showcase
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('browse')} className="hover:text-white transition-colors cursor-pointer">
                Browse Library
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('schedule')} className="hover:text-white transition-colors cursor-pointer">
                Simulcast Calendar
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('events')} className="hover:text-white transition-colors cursor-pointer">
                Debate Arena & Tournaments
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('community')} className="hover:text-white transition-colors cursor-pointer">
                Community Forum
              </button>
            </li>
          </ul>
        </div>

        {/* Resources & Feeds */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Feeds & Upgrades</h4>
          <ul className="space-y-1.5">
            <li>
              <button onClick={() => onNavigate('news')} className="hover:text-white transition-colors cursor-pointer">
                Helm News (Anime Corner & X)
              </button>
            </li>
            <li>
              <button onClick={onOpenUpgradeModal} className="text-amber-300 hover:text-amber-200 transition-colors cursor-pointer flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Pro Tier Event Hosting
              </button>
            </li>
            <li>
              <button onClick={onOpenRequestModal} className="hover:text-white transition-colors cursor-pointer">
                Request an Anime
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('admin')} className="text-rose-400 hover:text-rose-300 transition-colors cursor-pointer flex items-center gap-1">
                <span>Staff & Admin Portal</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Community & Legal */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Official Discord</h4>
          <p className="text-[11px] text-slate-400">
            Join the official Helm Studio Discord to participate in live voice debate stages and weekly watchalongs.
          </p>
          <a
            href="https://discord.gg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5865F2] hover:bg-[#4752c4] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <span>discord.gg/helmstudio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Legal & Anti-Piracy Notice */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
        <p>
          © 2025 Helm Studio. Anime metadata and artwork powered by AniList GraphQL. News powered by Anime Corner. Helm Studio does not host or distribute copyright-protected video streams.
        </p>
        <p className="flex items-center gap-1 shrink-0">
          Built for anime fans worldwide
        </p>
      </div>
    </footer>
  );
};
