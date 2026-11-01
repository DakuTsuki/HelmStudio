import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Calendar,
  Flame,
  MessageSquare,
  Newspaper,
  Shield,
  Search,
  Dices,
  Crown,
  Bell,
  Sun,
  Moon,
  User,
  PlusCircle,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSearch: () => void;
  onSurpriseMe: () => void;
  onOpenRequestModal: () => void;
  onOpenUpgradeModal: () => void;
  onSelectAnime: (animeId: number) => void;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenSearch,
  onSurpriseMe,
  onOpenRequestModal,
  onOpenUpgradeModal,
  onSelectAnime,
  onOpenAuthModal
}) => {
  const { currentUser, unreadNotifsCount, theme, toggleTheme, logout } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(event.target as Node)) {
        setShowNotifs(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home', icon: null },
    { id: 'browse', label: 'Browse', icon: <Compass className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'events', label: 'Arena & Debates', icon: <Flame className="w-4 h-4 text-rose-400" /> },
    { id: 'community', label: 'Community', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'news', label: 'Helm News', icon: <Newspaper className="w-4 h-4" /> }
  ];

  const canAccessAdmin = currentUser.role === 'admin' || currentUser.role === 'moderator';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-rose-600 p-0.5 shadow-lg group-hover:scale-105 transition-all glow-violet">
            <div className="w-full h-full bg-[#070913] rounded-[10px] flex items-center justify-center">
              <span className="font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-violet-400 to-rose-400 text-lg">
                H
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-black text-lg tracking-wider text-white">
                HELM<span className="text-violet-400">STUDIO</span>
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold hidden sm:inline -mt-1">
              Cinematic Anime Arena
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => {
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            );
          })}

          {canAccessAdmin && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-rose-600/20 text-rose-300 border border-rose-500/30'
                  : 'text-rose-300 hover:text-rose-200 hover:bg-rose-500/10'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin HQ</span>
            </button>
          )}
        </nav>

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Live Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-2 transition-all cursor-pointer"
            title="Search Anime (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-violet-400" />
            <span className="hidden md:inline">Search anime...</span>
            <kbd className="hidden md:inline text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-white/5">
              /
            </kbd>
          </button>

          {/* Surprise Me Button (Extra) */}
          <button
            onClick={onSurpriseMe}
            className="p-2 rounded-xl bg-violet-950/40 hover:bg-violet-900/60 text-violet-300 border border-violet-500/30 transition-all cursor-pointer hover:scale-105"
            title="Surprise Me: Roll Random High-Tier Anime"
          >
            <Dices className="w-4 h-4" />
          </button>

          {/* Upgrade / Pro button */}
          {currentUser.role !== 'pro' && (
            <button
              onClick={onOpenUpgradeModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white text-xs font-bold shadow-md shadow-violet-600/20 transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Upgrade</span>
            </button>
          )}

          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-400" />}
          </button>

          {/* Notification Bell */}
          <div className="relative" ref={notifsRef}>
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-extrabold text-white flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
            <NotificationDropdown
              isOpen={showNotifs}
              onClose={() => setShowNotifs(false)}
              onSelectAnime={onSelectAnime}
            />
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 transition-all cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                className="w-7 h-7 rounded-xl object-cover border border-violet-500/40"
              />
              <span className="hidden sm:inline text-xs font-semibold text-slate-200 max-w-[90px] truncate">
                {currentUser.username}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
            </button>

            {/* Profile Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 glass-panel rounded-2xl shadow-2xl border border-violet-500/20 overflow-hidden z-50 p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2.5 border-b border-white/10 mb-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white truncate">{currentUser.username}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold bg-violet-600/30 text-violet-300 border border-violet-500/30">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-violet-950/40 hover:text-violet-300 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <User className="w-4 h-4 text-violet-400" />
                    <span>My Profile & List</span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenRequestModal();
                      setShowUserMenu(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-slate-200 hover:bg-violet-950/40 hover:text-violet-300 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    <span>Request Anime</span>
                  </button>

                  {canAccessAdmin && (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 rounded-xl text-left text-xs font-semibold text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Shield className="w-4 h-4 text-rose-400" />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <div className="border-t border-white/10 my-1 pt-1 space-y-1">
                    {onOpenAuthModal && (
                      <button
                        onClick={() => {
                          onOpenAuthModal();
                          setShowUserMenu(false);
                        }}
                        className="w-full px-3 py-1.5 rounded-xl text-left text-xs font-semibold text-violet-300 hover:bg-violet-950/40 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <User className="w-4 h-4 text-violet-400" />
                        <span>Sign In / Create Account</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl text-left text-xs font-semibold text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Switch to Guest</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
