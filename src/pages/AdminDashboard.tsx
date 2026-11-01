import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Film,
  Flag,
  BarChart3,
  Bell,
  Sliders,
  CheckCircle,
  Send,
  Lock,
  ArrowLeft,
  Key,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  Activity,
  LogOut,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReportItem, UserProfile, UserRole } from '../types';
import { MOCK_CURATED_ANIME, MOCK_REPORTS } from '../data/mockData';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { currentUser, allUsers, switchUserRole, loginAsDemoUser, addNotification } = useAuth();

  // Role Gate check
  const isAuthorized = currentUser.role === 'admin' || currentUser.role === 'moderator';

  // Sub-tabs
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'users' | 'anime' | 'notifications' | 'ads' | 'edge'>('analytics');

  // Staff Portal Login Form state (if not currently admin)
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Moderation state
  const [reports, setReports] = useState<ReportItem[]>(() => {
    const saved = localStorage.getItem('helm_moderation_reports');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return MOCK_REPORTS;
  });

  // User management state
  const [userListState, setUserListState] = useState<UserProfile[]>(allUsers);
  const [userSearch, setUserSearch] = useState('');
  const [bannedUsers, setBannedUsers] = useState<Record<string, boolean>>({});

  // Push notification state
  const [pushTitle, setPushTitle] = useState('New Solo Leveling Episode 18 Out Now!');
  const [pushMessage, setPushMessage] = useState('Simulcast is streaming live with English subtitles on Crunchyroll.');
  const [pushAudience, setPushAudience] = useState<'all' | 'solo_leveling' | 'premium'>('all');
  const [pushSent, setPushSent] = useState(false);

  // Ad manager state
  const [adEnabled, setAdEnabled] = useState(true);
  const [sponsorName, setSponsorName] = useState('Crunchyroll Store Winter Festival');

  // Edge cache status
  const [lastCacheSync, setLastCacheSync] = useState('2 minutes ago');
  const [isSyncingEdge, setIsSyncingEdge] = useState(false);

  // Handle Staff Login
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanPass = adminPass.trim();

    if (
      cleanEmail === 'admin@helmstudio.io' ||
      cleanPass === 'HELM_ADMIN_2026' ||
      cleanEmail.includes('admin')
    ) {
      const adminUser = allUsers.find(u => u.role === 'admin') || allUsers[0];
      loginAsDemoUser(adminUser.id);
      switchUserRole('admin');
      setAuthError(null);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else if (
      cleanEmail === 'mod@helmstudio.io' ||
      cleanPass === 'HELM_MOD_2026' ||
      cleanEmail.includes('mod')
    ) {
      const modUser = allUsers.find(u => u.role === 'moderator') || allUsers[1];
      loginAsDemoUser(modUser.id);
      switchUserRole('moderator');
      setAuthError(null);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } else {
      setAuthError('Unauthorized: Invalid staff passkey or email. Use official staff credentials (Passkey: HELM_ADMIN_2026).');
    }
  };

  // Quick 1-click test credentials login
  const handleQuickStaffLogin = (role: 'admin' | 'moderator') => {
    const target = allUsers.find(u => u.role === role);
    if (target) {
      loginAsDemoUser(target.id);
      switchUserRole(role);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    }
  };

  // Return to public standard user
  const handleExitAdmin = () => {
    const standardUser = allUsers.find(u => u.role === 'user') || allUsers[allUsers.length - 1];
    loginAsDemoUser(standardUser.id);
    switchUserRole('user');
    onNavigate('home');
  };

  // Report Actions
  const handleDismissReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    addNotification({
      type: 'system',
      title: 'Report Dismissed',
      message: 'The flagged report was dismissed from moderation queue.'
    });
  };

  const handleDeleteContent = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    addNotification({
      type: 'system',
      title: 'Violation Content Removed',
      message: 'Flagged message removed and author issued a formal warning.'
    });
  };

  const handleWarnUser = (username: string) => {
    addNotification({
      type: 'system',
      title: 'Official Warning Issued',
      message: `User ${username} received an infraction strike for TOS violation.`
    });
  };

  // User Actions
  const handleToggleBan = (userId: string) => {
    setBannedUsers(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleChangeRole = (userId: string, newRole: UserRole) => {
    setUserListState(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    addNotification({
      type: 'system',
      title: 'User Role Updated',
      message: `User role changed to ${newRole.toUpperCase()}.`
    });
  };

  // Push Notification Dispatch
  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pushTitle.trim() || !pushMessage.trim()) return;

    addNotification({
      type: 'episode',
      title: pushTitle.trim(),
      message: pushMessage.trim(),
      animeId: 151807
    });

    setPushSent(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setPushSent(false), 2500);
  };

  // Edge Sync
  const handleTriggerEdgeSync = () => {
    setIsSyncingEdge(true);
    setTimeout(() => {
      setIsSyncingEdge(false);
      setLastCacheSync('Just now');
      addNotification({
        type: 'system',
        title: 'Edge Cache Refreshed',
        message: 'Anime Corner RSS and X feed synchronized across all regional edge nodes.'
      });
    }, 1200);
  };

  const filteredUsers = userListState.filter(u =>
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  // =========================================================================
  // VIEW A: If user is NOT an admin/moderator, show the Staff Authorization Portal
  // =========================================================================
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 text-slate-100 bg-[#070913] relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-white">Staff Command Portal</h1>
            <p className="text-xs text-slate-400">
              Restricted area for Helm Studio administrators and community moderators.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/5 text-xs text-slate-300">
            <span className="font-semibold text-white block mb-0.5">Public Visitor Notice:</span>
            You are currently viewing the platform as a standard community member (<strong className="text-violet-300">{currentUser.username}</strong>). Normal members do not have access to this management dashboard.
          </div>

          {/* Quick 1-Click Staff Sign-In for Testing */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              1-Click Staff Access (Test Sandbox)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickStaffLogin('admin')}
                className="p-3 rounded-xl bg-rose-600/20 hover:bg-rose-600 border border-rose-500/30 text-rose-300 hover:text-white text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Login as Admin</span>
              </button>

              <button
                onClick={() => handleQuickStaffLogin('moderator')}
                className="p-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Login as Mod</span>
              </button>
            </div>
          </div>

          {/* Regular Credential Form */}
          <form onSubmit={handleStaffLogin} className="space-y-3 pt-2 border-t border-white/10">
            {authError && (
              <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {authError}
              </div>
            )}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Staff Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="admin@helmstudio.io"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Passkey / Token <span className="text-[10px] text-slate-500">(Passkey: HELM_ADMIN_2026)</span>
              </label>
              <input
                type="password"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                placeholder="HELM_ADMIN_2026"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Authenticate & Enter HQ</span>
            </button>
          </form>

          {/* Back button */}
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Anime Platform</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: Full Dedicated Admin HQ Workspace for Authenticated Admins & Mods
  // =========================================================================
  return (
    <div className="min-h-screen pb-24 text-slate-100 bg-[#070913]">
      {/* Dedicated Admin Header Bar */}
      <div className="glass-panel border-b border-white/10 py-3 px-4 sm:px-6 sticky top-16 z-30 bg-slate-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_#f43f5e]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  Admin Command HQ
                </span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] uppercase border border-rose-500/30">
                  {currentUser.role}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                Operator: {currentUser.username} ({currentUser.email})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Quick Button to return to the public website experience */}
            <button
              onClick={handleExitAdmin}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-colors cursor-pointer shadow-sm"
              title="Switch back to regular public user view"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-violet-400" />
              <span>Exit to Public Community Site</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 custom-scrollbar">
          {[
            { id: 'analytics', label: 'Platform Telemetry & DAU', icon: BarChart3 },
            { id: 'reports', label: `Moderation Queue (${reports.length})`, icon: Flag },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'anime', label: 'Anime Catalog Manager', icon: Film },
            { id: 'notifications', label: 'Push Notifications', icon: Bell },
            { id: 'edge', label: 'Supabase Edge Cache', icon: RefreshCw },
            { id: 'ads', label: 'Monetization & Ads', icon: Sliders },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                  isActive
                    ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/25 scale-102'
                    : 'glass-panel text-slate-300 border-white/5 hover:border-rose-500/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* 1. ANALYTICS & DAU                                             */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-3xl border border-white/10">
                <span className="text-xs font-bold text-slate-400 uppercase">Daily Active Users (DAU)</span>
                <p className="font-mono text-2xl sm:text-3xl font-black text-white mt-1">42,850</p>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% this week
                </span>
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-white/10">
                <span className="text-xs font-bold text-slate-400 uppercase">Episodes Logged</span>
                <p className="font-mono text-2xl sm:text-3xl font-black text-violet-300 mt-1">189,420</p>
                <span className="text-[11px] text-emerald-400 font-semibold">+8.2% bookmark velocity</span>
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-white/10">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Debaters</span>
                <p className="font-mono text-2xl sm:text-3xl font-black text-rose-300 mt-1">6,530</p>
                <span className="text-[11px] text-slate-400">Gojo vs Sukuna #1</span>
              </div>

              <div className="glass-panel p-5 rounded-3xl border border-white/10">
                <span className="text-xs font-bold text-slate-400 uppercase">Viewer Drop-off Rate</span>
                <p className="font-mono text-2xl sm:text-3xl font-black text-amber-300 mt-1">4.2%</p>
                <span className="text-[11px] text-emerald-400 font-semibold">95.8% retention index</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white">Most Watched Anime (Weekly Retention)</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Solo Leveling Season 2: Arise', progress: 92, count: '38.4k viewers' },
                    { name: 'Dandadan', progress: 78, count: '29.1k viewers' },
                    { name: 'Jujutsu Kaisen: Culling Game', progress: 74, count: '24.8k viewers' },
                    { name: 'Frieren: Beyond Journey’s End', progress: 68, count: '21.5k viewers' },
                    { name: 'Demon Slayer: Hashira Training', progress: 55, count: '17.2k viewers' },
                  ].map(item => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-200">{item.name}</span>
                        <span className="text-slate-400 font-mono">{item.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-600 to-rose-600" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-base font-bold text-white">Drop-off by Episode Benchmark ("The 3-Episode Rule")</h3>
                <div className="space-y-3">
                  {[
                    { ep: 'Episode 1 (Hook & Worldbuilding)', rate: '96% Completed' },
                    { ep: 'Episode 2 (Pacing & Animation Check)', rate: '91% Completed' },
                    { ep: 'Episode 3 (Decision point / 3-Ep Rule)', rate: '86% Completed' },
                    { ep: 'Episode 4 - 12 (Core Season Loyalists)', rate: '82% Completed' },
                  ].map(item => (
                    <div key={item.ep} className="p-3 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{item.ep}</span>
                      <span className="font-mono text-emerald-400 font-bold">{item.rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. MODERATION QUEUE                                            */}
        {/* ============================================================== */}
        {activeTab === 'reports' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flag className="w-4 h-4 text-rose-400" />
                  <span>Pending Moderation Queue ({reports.length})</span>
                </h3>
                <p className="text-xs text-slate-400">Content flagged by community members in debates and forums</p>
              </div>
            </div>

            {reports.length > 0 ? (
              <div className="space-y-3">
                {reports.map(rep => (
                  <div
                    key={rep.id}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase text-[10px]">
                          {rep.targetType}
                        </span>
                        <span className="text-slate-300 font-semibold">User: {rep.reportedUserName}</span>
                        <span className="text-slate-500">• Flagged by {rep.reporterName}</span>
                      </div>
                      <p className="text-xs font-semibold text-amber-300">Reason: {rep.reason}</p>
                      <div className="p-2.5 rounded-xl bg-black/50 border border-white/5 text-xs text-slate-300 italic font-sans">
                        "{rep.reportedContent}"
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleDismissReport(rep.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleWarnUser(rep.reportedUserName)}
                        className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600 text-amber-200 text-xs font-semibold border border-amber-500/30 cursor-pointer"
                      >
                        Warn User
                      </button>
                      <button
                        onClick={() => handleDeleteContent(rep.id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
                      >
                        Delete Content
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <span>Zero pending reports. The community arena is currently clear!</span>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. USER MANAGEMENT                                             */}
        {/* ============================================================== */}
        {activeTab === 'users' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-violet-400" />
                  <span>Member Directory & Role Matrix</span>
                </h3>
                <p className="text-xs text-slate-400">Promote to Moderator / Pro Host, or enforce temporary bans</p>
              </div>

              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search user..."
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="divide-y divide-white/5">
              {filteredUsers.map(user => {
                const isBanned = bannedUsers[user.id];
                return (
                  <div key={user.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{user.username}</span>
                          {isBanned ? (
                            <span className="text-[10px] px-2 py-0.2 rounded bg-rose-600 text-white font-bold uppercase">
                              Banned
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.2 rounded bg-violet-600/30 text-violet-300 font-bold uppercase">
                              {user.role}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">{user.email} • {user.stats.episodesWatched} eps logged</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={e => handleChangeRole(user.id, e.target.value as UserRole)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white"
                      >
                        <option value="user">User</option>
                        <option value="premium">Premium</option>
                        <option value="pro">Pro Host</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>

                      <button
                        onClick={() => handleToggleBan(user.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isBanned
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white border border-rose-500/30'
                        }`}
                      >
                        {isBanned ? 'Unban User' : 'Ban User'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. ANIME CATALOG MANAGER                                       */}
        {/* ============================================================== */}
        {activeTab === 'anime' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-violet-400" />
              <span>Curated Anime Spotlight & Editorial Pinning</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {MOCK_CURATED_ANIME.map(anime => (
                <div key={anime.id} className="p-3 rounded-2xl bg-slate-900/80 border border-white/10 flex gap-3">
                  <img src={anime.coverImage.medium} alt={anime.title.romaji} className="w-14 h-20 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-white truncate">{anime.title.english || anime.title.romaji}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{anime.format} • {anime.averageScore}% score</p>
                    <div className="mt-3 flex items-center gap-1.5">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet-600/30 text-violet-300 font-bold">
                        Featured
                      </span>
                      <button
                        onClick={() => {
                          addNotification({
                            type: 'system',
                            title: 'Pinned to Hero Spotlight',
                            message: `${anime.title.romaji} pinned to featured carousel.`
                          });
                        }}
                        className="text-[10px] text-slate-300 hover:text-white underline cursor-pointer"
                      >
                        Pin to Hero
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. PUSH NOTIFICATIONS COMPOSER                                 */}
        {/* ============================================================== */}
        {activeTab === 'notifications' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-violet-400" />
              <span>Targeted Broadcast Notification Dispatcher</span>
            </h3>
            <p className="text-xs text-slate-400">
              Send notifications directly to user notification bells with audience filters
            </p>

            <form onSubmit={handleSendPush} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Audience</label>
                <select
                  value={pushAudience}
                  onChange={e => setPushAudience(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                >
                  <option value="all">All Registered Members (42,850 users)</option>
                  <option value="solo_leveling">Members Watching Solo Leveling (18,200 users)</option>
                  <option value="premium">Premium & Pro Members Only (4,120 users)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notification Title *</label>
                <input
                  type="text"
                  required
                  value={pushTitle}
                  onChange={e => setPushTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notification Message *</label>
                <textarea
                  rows={3}
                  required
                  value={pushMessage}
                  onChange={e => setPushMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
                />
              </div>

              {pushSent ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold text-center">
                  Broadcast notification dispatched!
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Broadcast Notification</span>
                </button>
              )}
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* 6. SUPABASE EDGE CACHE MONITOR                                 */}
        {/* ============================================================== */}
        {activeTab === 'edge' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Supabase Edge Function: Anime Corner RSS Cache</span>
              </h3>
              <button
                onClick={handleTriggerEdgeSync}
                disabled={isSyncingEdge}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingEdge ? 'animate-spin' : ''}`} />
                <span>Force Resync</span>
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Edge worker runs every 15 minutes to scrape and cache Anime Corner RSS articles and X official timelines into Supabase Storage.
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex justify-between">
                <span className="text-slate-400">Schedule</span>
                <span className="font-mono text-emerald-400 font-bold">Every 15 minutes (`*/15 * * * *`)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex justify-between">
                <span className="text-slate-400">Last Edge Run</span>
                <span className="font-mono text-white font-bold">{lastCacheSync}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex justify-between">
                <span className="text-slate-400">Source Feed</span>
                <span className="font-mono text-violet-300">https://animecorner.me/feed</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-white/5 flex justify-between">
                <span className="text-slate-400">Cache Hit Ratio</span>
                <span className="font-mono text-emerald-400 font-bold">99.4% (Global CDN)</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 7. MONETIZATION & AD CAMPAIGN MANAGER                          */}
        {/* ============================================================== */}
        {activeTab === 'ads' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Sponsorship & Monetization Controls</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900 border border-white/5">
                <div>
                  <span className="text-xs font-bold text-white">Enable Sponsored Merch Banners</span>
                  <p className="text-[11px] text-slate-400">Suppressed automatically for Premium and Pro tiers</p>
                </div>
                <input
                  type="checkbox"
                  checked={adEnabled}
                  onChange={e => setAdEnabled(e.target.checked)}
                  className="w-5 h-5 accent-violet-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Active Sponsor Name</label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={e => setSponsorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-violet-950/40 border border-violet-500/30 text-xs text-violet-300">
                Premium plan pricing: $4.99/mo • Pro tier event hosting: $12.99/mo (Connected to Stripe Sandbox).
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
