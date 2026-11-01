import React, { useState } from 'react';
import {
  Flame,
  Swords,
  Trophy,
  Vote,
  Gift,
  PlusCircle,
  Clock,
  Sparkles,
  Send,
  ThumbsUp,
  Pin,
  CheckCircle2,
  Share2,
  AlertCircle,
  Crown,
  ChevronRight,
  ShieldAlert,
  Download,
  Copy,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DebateMessage, EventItem, TournamentData, TournamentMatch } from '../types';
import { MOCK_EVENTS, MOCK_LEADERBOARD, MOCK_TOURNAMENT } from '../data/mockData';
import confetti from 'canvas-confetti';

interface EventsPageProps {
  onOpenUpgradeModal: () => void;
  onOpenReportModal?: (content: string, type: 'comment' | 'user') => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onOpenUpgradeModal,
  onOpenReportModal
}) => {
  const { currentUser, addNotification } = useAuth();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'debate' | 'tournament' | 'polls' | 'giveaways' | 'leaderboard'>('debate');

  // Events list state
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);

  // 1. Live Debate State
  const activeDebate = events.find(e => e.type === 'debate') || events[0];
  const [userStance, setUserStance] = useState<'A' | 'B'>('A');
  const [debateVotes, setDebateVotes] = useState({
    teamA: activeDebate.teamA?.votes || 3410,
    teamB: activeDebate.teamB?.votes || 3120,
    hasVoted: false
  });
  const [debateMessages, setDebateMessages] = useState<DebateMessage[]>(activeDebate.debateMessages || []);
  const [argumentInput, setArgumentInput] = useState('');

  // 2. Tournament Bracket State
  const [tournament, setTournament] = useState<TournamentData>(MOCK_TOURNAMENT);
  const [votedMatchIds, setVotedMatchIds] = useState<Record<string, string>>({});
  const [showShareModal, setShowShareModal] = useState(false);

  // 3. Giveaway State
  const activeGiveaway = events.find(e => e.type === 'giveaway')?.giveaway;
  const [giveawayEntered, setGiveawayEntered] = useState(false);
  const [giveawayWinner, setGiveawayWinner] = useState<{ username: string; avatar: string } | null>(null);
  const [isRollingWinner, setIsRollingWinner] = useState(false);

  // 4. Leaderboard Tab State
  const [leaderboardTab, setLeaderboardTab] = useState<'weekly' | 'alltime'>('weekly');

  // 5. Create Event Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'debate' | 'poll' | 'tournament' | 'giveaway'>('debate');
  const [newDate, setNewDate] = useState('');

  // Check if current user has permission to create events (Pro, Mod, Admin)
  const canHostEvents = currentUser.role === 'pro' || currentUser.role === 'moderator' || currentUser.role === 'admin';

  // --- Debate Handlers ---
  const handleVoteDebate = (stance: 'A' | 'B') => {
    if (debateVotes.hasVoted) return;
    setUserStance(stance);
    setDebateVotes(prev => ({
      ...prev,
      teamA: stance === 'A' ? prev.teamA + 1 : prev.teamA,
      teamB: stance === 'B' ? prev.teamB + 1 : prev.teamB,
      hasVoted: true
    }));
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handleSendArgument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!argumentInput.trim()) return;

    const newMsg: DebateMessage = {
      id: `dbm_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      stance: userStance,
      content: argumentInput.trim(),
      upvotes: 1,
      createdAt: 'Just now'
    };

    setDebateMessages(prev => [newMsg, ...prev]);
    setArgumentInput('');
    confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
  };

  const handleUpvoteArgument = (id: string) => {
    setDebateMessages(prev => prev.map(m => m.id === id ? { ...m, upvotes: m.upvotes + 1 } : m));
  };

  const handlePinArgument = (id: string) => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'moderator') return;
    setDebateMessages(prev => prev.map(m => m.id === id ? { ...m, isPinned: !m.isPinned } : m));
  };

  // --- Tournament Handlers ---
  const handleVoteTournamentMatch = (matchId: string, participantId: string) => {
    if (votedMatchIds[matchId]) return;

    setVotedMatchIds(prev => ({ ...prev, [matchId]: participantId }));
    setTournament(prev => ({
      ...prev,
      matches: prev.matches.map(m => {
        if (m.id === matchId) {
          const isA = m.participantA.id === participantId;
          return {
            ...m,
            participantA: isA ? { ...m.participantA, votes: m.participantA.votes + 1 } : m.participantA,
            participantB: !isA ? { ...m.participantB, votes: m.participantB.votes + 1 } : m.participantB,
          };
        }
        return m;
      })
    }));

    confetti({ particleCount: 35, spread: 55, origin: { y: 0.7 } });
  };

  // Auto-advance tournament simulation (for admins/mods or evaluation)
  const handleAutoAdvanceQuarterfinals = () => {
    setTournament(prev => {
      const qfWinners = prev.matches
        .filter(m => m.round === 2)
        .map(m => m.participantA.votes >= m.participantB.votes ? m.participantA : m.participantB);

      return {
        ...prev,
        currentRound: 3,
        matches: prev.matches.map(m => {
          if (m.round === 2) {
            const winner = m.participantA.votes >= m.participantB.votes ? m.participantA.id : m.participantB.id;
            return { ...m, status: 'completed', winnerId: winner };
          }
          if (m.id === 'm3_1' && qfWinners[0] && qfWinners[1]) {
            return {
              ...m,
              participantA: { ...qfWinners[0], votes: 0 },
              participantB: { ...qfWinners[1], votes: 0 },
              status: 'voting'
            };
          }
          if (m.id === 'm3_2' && qfWinners[2] && qfWinners[3]) {
            return {
              ...m,
              participantA: { ...qfWinners[2], votes: 0 },
              participantB: { ...qfWinners[3], votes: 0 },
              status: 'voting'
            };
          }
          return m;
        })
      };
    });

    confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
  };

  // --- Giveaway Handlers ---
  const handleEnterGiveaway = () => {
    if (giveawayEntered) return;
    setGiveawayEntered(true);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    addNotification({
      type: 'event',
      title: 'Giveaway Entry Confirmed',
      message: 'You have entered the GoodSmile Scale Figure & Helm Pro Pass giveaway!'
    });
  };

  const handleRollGiveawayWinner = () => {
    setIsRollingWinner(true);
    setTimeout(() => {
      setIsRollingWinner(false);
      const chosen = {
        username: 'ZephyrBlade',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      };
      setGiveawayWinner(chosen);
      confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
    }, 2000);
  };

  // --- Create Event Handler ---
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newEvt: EventItem = {
      id: `evt_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Community hosted event.',
      banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
      type: newType,
      date: newDate || new Date().toISOString(),
      hostUserId: currentUser.id,
      hostName: currentUser.username,
      hostRole: currentUser.role,
      status: 'live',
      teamA: newType === 'debate' ? { name: 'Team Alpha', color: '#8b5cf6', votes: 0 } : undefined,
      teamB: newType === 'debate' ? { name: 'Team Omega', color: '#f43f5e', votes: 0 } : undefined,
      debateMessages: []
    };

    setEvents(prev => [newEvt, ...prev]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDesc('');
    addNotification({
      type: 'event',
      title: 'Event Published',
      message: `Your ${newType} "${newEvt.title}" is now active in the arena.`
    });
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  // Calculate vote percentages for the live debate
  const totalDebateVotes = debateVotes.teamA + debateVotes.teamB;
  const teamAPercent = totalDebateVotes > 0 ? Math.round((debateVotes.teamA / totalDebateVotes) * 100) : 50;
  const teamBPercent = 100 - teamAPercent;

  return (
    <div className="min-h-screen pb-24 text-slate-100 max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs uppercase tracking-wider border border-rose-500/30 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 fill-rose-400" />
              Signature Arena
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Real-time Voting & Moderated Debates
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white">
            Debates & Community Events
          </h1>
        </div>

        {/* Action Button: Create Event */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (canHostEvents) {
                setShowCreateModal(true);
              } else {
                onOpenUpgradeModal();
              }
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              canHostEvents
                ? 'bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white shadow-violet-600/30'
                : 'glass-panel text-violet-300 border border-violet-500/40 hover:bg-violet-950/40'
            }`}
          >
            {canHostEvents ? (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Host New Event</span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 text-purple-300" />
                <span>Host Events (Pro Tier)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 custom-scrollbar">
        {[
          { id: 'debate', label: 'Live Debate Room', icon: Swords, count: '1 Live' },
          { id: 'tournament', label: '16-Character Tournament', icon: Trophy, count: 'Round 2' },
          { id: 'polls', label: 'Community Polls', icon: Vote, count: '3 Active' },
          { id: 'giveaways', label: 'Otaku Giveaways', icon: Gift, count: '$450 Prize' },
          { id: 'leaderboard', label: 'Debater Leaderboard', icon: Crown, count: 'Top 50' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-2 border ${
                isActive
                  ? 'bg-violet-600 text-white border-violet-400 shadow-lg shadow-violet-600/25 scale-102'
                  : 'glass-panel text-slate-300 border-white/5 hover:border-violet-500/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                isActive ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* 1. LIVE DEBATE ROOM                                            */}
      {/* ============================================================== */}
      {activeTab === 'debate' && (
        <div className="space-y-6">
          {/* Arena Banner & Matchup */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-violet-500/30 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  Official Arena Debate #48
                </span>
                <h2 className="text-xl sm:text-3xl font-black text-white">
                  {activeDebate.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                  {activeDebate.description}
                </p>
              </div>

              {/* Host Tag */}
              <div className="glass-card p-3 rounded-2xl flex items-center gap-3 shrink-0 self-start md:self-center border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-violet-600/30 flex items-center justify-center font-bold text-violet-300">
                  ADM
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Hosted by {activeDebate.hostName}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">Live Moderation Active</p>
                </div>
              </div>
            </div>

            {/* Two-Sided Stance Selector & Live Ratio Bar */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-extrabold">
                <button
                  onClick={() => handleVoteDebate('A')}
                  className={`flex-1 w-full sm:w-auto p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    userStance === 'A'
                      ? 'bg-violet-900/50 border-violet-400 shadow-lg shadow-violet-500/20'
                      : 'bg-slate-900 border-white/5 hover:border-violet-500/40 text-slate-300'
                  }`}
                >
                  <span className="text-violet-300">Team Gojo (Infinity)</span>
                  <span className="font-mono text-white text-base">{teamAPercent}% ({debateVotes.teamA})</span>
                </button>

                <span className="text-slate-400 uppercase font-black tracking-widest text-xs px-2">
                  VS
                </span>

                <button
                  onClick={() => handleVoteDebate('B')}
                  className={`flex-1 w-full sm:w-auto p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                    userStance === 'B'
                      ? 'bg-rose-950/50 border-rose-400 shadow-lg shadow-rose-500/20'
                      : 'bg-slate-900 border-white/5 hover:border-rose-500/40 text-slate-300'
                  }`}
                >
                  <span className="text-rose-300">Team Sukuna (Shrine)</span>
                  <span className="font-mono text-white text-base">{teamBPercent}% ({debateVotes.teamB})</span>
                </button>
              </div>

              {/* Animated Progress Ratio */}
              <div className="h-3 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-700 ease-out"
                  style={{ width: `${teamAPercent}%` }}
                />
                <div
                  className="h-full bg-gradient-to-r from-rose-500 to-rose-600 transition-all duration-700 ease-out"
                  style={{ width: `${teamBPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>Total Ballots: {totalDebateVotes}</span>
                <span className="text-violet-300 font-semibold">
                  {debateVotes.hasVoted ? `Your current stance: Team ${userStance}` : 'Click either side to cast your verified vote'}
                </span>
              </div>
            </div>
          </div>

          {/* Live Debate Chat Stream */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-violet-400" />
                <span>Live Arguments & Counter-Arguments ({debateMessages.length})</span>
              </h3>
              <span className="text-xs text-slate-400">Upvoted points rank debaters</span>
            </div>

            {/* Post Argument Form */}
            <form onSubmit={handleSendArgument} className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span>Posting as:</span>
                <button
                  type="button"
                  onClick={() => setUserStance(userStance === 'A' ? 'B' : 'A')}
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] cursor-pointer ${
                    userStance === 'A' ? 'bg-violet-600 text-white' : 'bg-rose-600 text-white'
                  }`}
                >
                  Team {userStance === 'A' ? 'Gojo (A)' : 'Sukuna (B)'} [Click to change]
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={argumentInput}
                  onChange={e => setArgumentInput(e.target.value)}
                  placeholder="Enter a compelling canonical argument, feat, or chapter reference..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  disabled={!argumentInput.trim()}
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Argue</span>
                </button>
              </div>
            </form>

            {/* Arguments Stream */}
            <div className="space-y-3 pt-3">
              {debateMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    msg.isPinned
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-lg'
                      : msg.stance === 'A'
                      ? 'bg-violet-950/20 border-violet-500/20'
                      : 'bg-rose-950/20 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={msg.userAvatar} alt={msg.username} className="w-7 h-7 rounded-lg object-cover" />
                      <span className="text-xs font-bold text-white">{msg.username}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-bold bg-white/10 text-slate-300">
                        {msg.userRole}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        msg.stance === 'A' ? 'bg-violet-500/30 text-violet-300' : 'bg-rose-500/30 text-rose-300'
                      }`}>
                        Team {msg.stance}
                      </span>
                      {msg.isPinned && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold flex items-center gap-0.5">
                          <Pin className="w-2.5 h-2.5" /> Pinned
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {(currentUser.role === 'admin' || currentUser.role === 'moderator') && (
                        <button
                          onClick={() => handlePinArgument(msg.id)}
                          className="text-slate-400 hover:text-amber-300 p-1 rounded transition-colors cursor-pointer text-xs"
                          title="Pin Argument (Mod Control)"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => onOpenReportModal && onOpenReportModal(msg.content, 'comment')}
                        className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors cursor-pointer text-xs"
                        title="Report"
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans pl-9">
                    {msg.content}
                  </p>

                  <div className="flex items-center justify-between pl-9 mt-2 text-xs text-slate-400">
                    <span>{msg.createdAt}</span>
                    <button
                      onClick={() => handleUpvoteArgument(msg.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-violet-600/30 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      <ThumbsUp className="w-3 h-3 text-violet-400" />
                      <span className="font-bold text-xs">{msg.upvotes} Upvotes</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. 16-CHARACTER TOURNAMENT BRACKET                              */}
      {/* ============================================================== */}
      {activeTab === 'tournament' && (
        <div className="space-y-6">
          {/* Tournament Overview Card */}
          <div className="glass-panel p-6 rounded-3xl border border-violet-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Trophy className="w-4 h-4" />
                Official Single Elimination Bracket
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{tournament.title}</h2>
              <p className="text-xs text-slate-300 mt-1">
                16 legendary anime characters. Cast your votes round-by-round to crown the ultimate champion!
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Auto-advance simulation button for testing */}
              {(currentUser.role === 'admin' || currentUser.role === 'moderator' || currentUser.role === 'pro') && (
                <button
                  onClick={handleAutoAdvanceQuarterfinals}
                  className="px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  title="Simulate round completion and auto-advance winners"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Auto-Advance Round</span>
                </button>
              )}

              {/* Share Result Card */}
              <button
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Bracket Card</span>
              </button>
            </div>
          </div>

          {/* Interactive Bracket Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Quarterfinals (Round 2) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-xs font-black uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" /> Quarterfinals (Active)
                </h3>
                <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full font-bold">
                  Round 2
                </span>
              </div>

              {tournament.matches.filter(m => m.round === 2).map((match, idx) => {
                const votedFor = votedMatchIds[match.id];
                return (
                  <div
                    key={match.id}
                    className="p-3.5 rounded-2xl glass-card border border-white/10 space-y-2 relative"
                  >
                    <span className="text-[10px] text-slate-400 font-mono font-bold block mb-1">
                      Match {idx + 1}
                    </span>

                    {/* Participant A */}
                    <div
                      onClick={() => handleVoteTournamentMatch(match.id, match.participantA.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        votedFor === match.participantA.id
                          ? 'bg-violet-900/40 border-violet-400'
                          : 'bg-slate-900/80 border-white/5 hover:border-violet-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={match.participantA.avatar}
                          alt={match.participantA.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{match.participantA.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{match.participantA.anime}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-violet-300">
                        {match.participantA.votes}
                      </span>
                    </div>

                    {/* Participant B */}
                    <div
                      onClick={() => handleVoteTournamentMatch(match.id, match.participantB.id)}
                      className={`p-2 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        votedFor === match.participantB.id
                          ? 'bg-rose-900/40 border-rose-400'
                          : 'bg-slate-900/80 border-white/5 hover:border-rose-500/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={match.participantB.avatar}
                          alt={match.participantB.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{match.participantB.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{match.participantB.anime}</p>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-rose-300">
                        {match.participantB.votes}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 2: Semifinals (Round 3) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Swords className="w-3.5 h-3.5" /> Semifinals
                </h3>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                  Round 3
                </span>
              </div>

              {tournament.matches.filter(m => m.round === 3).map((match, idx) => (
                <div
                  key={match.id}
                  className="p-3.5 rounded-2xl glass-card border border-white/10 space-y-2 opacity-90"
                >
                  <span className="text-[10px] text-slate-400 font-mono font-bold block mb-1">
                    Semi {idx + 1}
                  </span>

                  <div className="p-2 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">{match.participantA.name}</span>
                    <span className="text-[10px] text-slate-500">Seed {match.participantA.seed}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900/50 border border-white/5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">{match.participantB.name}</span>
                    <span className="text-[10px] text-slate-500">Seed {match.participantB.seed}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Column 3: Grand Final (Round 4) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" /> Grand Final
                </h3>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  Championship
                </span>
              </div>

              {tournament.matches.filter(m => m.round === 4).map(match => (
                <div
                  key={match.id}
                  className="p-4 rounded-3xl bg-gradient-to-b from-amber-950/30 to-purple-950/30 border border-amber-500/30 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h4 className="text-center text-sm font-bold text-white">Championship Showdown</h4>

                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-center text-xs text-slate-300">
                    Winner of Semi 1
                  </div>
                  <div className="text-center text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                    VS
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/5 text-center text-xs text-slate-300">
                    Winner of Semi 2
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. COMMUNITY POLLS                                             */}
      {/* ============================================================== */}
      {activeTab === 'polls' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.filter(e => e.type === 'poll').map(poll => (
            <div key={poll.id} className="glass-panel p-6 rounded-3xl border border-violet-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">
                  Community Poll
                </span>
                <span className="text-xs text-slate-400">{poll.totalVotes || 0} votes</span>
              </div>

              <h3 className="text-lg font-bold text-white leading-snug">{poll.title}</h3>
              <p className="text-xs text-slate-300">{poll.description}</p>

              <div className="space-y-2 pt-2">
                {poll.pollOptions?.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      confetti({ particleCount: 30, spread: 50 });
                      addNotification({
                        type: 'event',
                        title: 'Vote Cast',
                        message: `You voted for "${opt.text}".`
                      });
                    }}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-white/5 hover:border-violet-500/30 flex items-center justify-between text-xs text-left cursor-pointer transition-all"
                  >
                    <span className="font-semibold text-slate-200">{opt.text}</span>
                    <span className="font-mono text-violet-300 font-bold">{opt.votes}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. OTAKU GIVEAWAYS                                             */}
      {/* ============================================================== */}
      {activeTab === 'giveaways' && activeGiveaway && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-violet-500/30 relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                Official Giveaway • {activeGiveaway.sponsor}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{activeGiveaway.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Prize package: <strong className="text-amber-300">{activeGiveaway.prize}</strong>
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span>{activeGiveaway.entrantsCount} Verified Entrants</span>
                <span>•</span>
                <span>Ends Feb 28, 2025</span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col items-center gap-3">
              {giveawayWinner ? (
                <div className="p-4 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-center animate-in zoom-in-95">
                  <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-1" />
                  <p className="text-xs text-amber-300 uppercase font-bold">Selected Winner</p>
                  <p className="text-base font-black text-white mt-0.5">{giveawayWinner.username}</p>
                </div>
              ) : (
                <button
                  onClick={handleEnterGiveaway}
                  disabled={giveawayEntered}
                  className={`px-8 py-3.5 rounded-2xl font-extrabold text-sm transition-all cursor-pointer shadow-xl ${
                    giveawayEntered
                      ? 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 cursor-default'
                      : 'bg-gradient-to-r from-violet-600 to-rose-600 hover:from-violet-500 hover:to-rose-500 text-white shadow-violet-600/30 hover:scale-105'
                  }`}
                >
                  {giveawayEntered ? '✓ You Are Entered!' : 'Enter Giveaway (Free)'}
                </button>
              )}

              {/* Admin test button to draw winner */}
              {(currentUser.role === 'admin' || currentUser.role === 'moderator') && !giveawayWinner && (
                <button
                  onClick={handleRollGiveawayWinner}
                  disabled={isRollingWinner}
                  className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                >
                  {isRollingWinner ? 'Drawing winner...' : 'Test Draw Winner (Admin Mod)'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. DEBATER LEADERBOARD                                         */}
      {/* ============================================================== */}
      {activeTab === 'leaderboard' && (
        <div className="glass-panel p-6 rounded-3xl border border-violet-500/20 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>Helm Studio Debate Champions</span>
              </h3>
              <p className="text-xs text-slate-400">
                Earn Arena Points through debate participation, community upvotes, and tournament brackets
              </p>
            </div>

            <div className="flex bg-slate-900 p-1 rounded-xl border border-white/5 text-xs font-bold">
              <button
                onClick={() => setLeaderboardTab('weekly')}
                className={`px-3 py-1 rounded-lg cursor-pointer ${
                  leaderboardTab === 'weekly' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setLeaderboardTab('alltime')}
                className={`px-3 py-1 rounded-lg cursor-pointer ${
                  leaderboardTab === 'alltime' ? 'bg-violet-600 text-white' : 'text-slate-400'
                }`}
              >
                All-Time
              </button>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {MOCK_LEADERBOARD.map((user, idx) => (
              <div key={user.userId} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={`w-7 text-center font-mono font-black text-sm ${
                    idx === 0 ? 'text-amber-400' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-500'
                  }`}>
                    #{idx + 1}
                  </span>
                  <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{user.username}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 font-bold uppercase">
                        {user.tier}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{user.wins} Wins • {user.argumentsCount} Arguments posted</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-base font-black text-violet-300">
                    {user.points.toLocaleString()}
                  </span>
                  <span className="block text-[10px] text-slate-400">Arena Pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shareable Tournament Result Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel p-6 rounded-3xl border border-violet-500/40 max-w-md w-full text-center space-y-4">
            <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Shareable Bracket Card</h3>
            <div className="p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs text-slate-300 font-mono">
              [HELM STUDIO TOURNAMENT: Round 2 Quarterfinals]<br />
              Leader: Satoru Gojo (2,950 votes) vs Monkey D. Luffy (2,880 votes)<br />
              https://helmstudio.io/events?bracket=shounen-2025
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText('https://helmstudio.io/events?bracket=shounen-2025');
                  addNotification({
                    type: 'system',
                    title: 'Link Copied',
                    message: 'Bracket link copied to clipboard!'
                  });
                  setShowShareModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Host New Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="glass-panel p-6 rounded-3xl border border-violet-500/30 max-w-lg w-full space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-violet-400" />
              <span>Create Community Event</span>
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                >
                  <option value="debate">Live Stance Debate</option>
                  <option value="poll">Community Poll</option>
                  <option value="tournament">Tournament Bracket (16 Char)</option>
                  <option value="giveaway">Merch Giveaway</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Eren Yeager: Hero or Villain?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description / Rules</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Provide context for debaters and voters..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-violet-500 resize-none"
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
                  Launch Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
