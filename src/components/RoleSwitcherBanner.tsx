import React, { useState } from 'react';
import { Shield, Sparkles, UserCheck, Crown, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentUser, switchUserRole, allUsers, loginAsDemoUser } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-20 md:bottom-6 right-6 z-40 px-3 py-1.5 rounded-full bg-violet-600/90 hover:bg-violet-600 text-white text-xs font-semibold shadow-lg backdrop-blur flex items-center gap-1.5 cursor-pointer border border-violet-400/40"
        title="Open Role Switcher"
      >
        <Shield className="w-3.5 h-3.5" />
        <span>Role: <strong className="uppercase">{currentUser.role}</strong></span>
      </button>
    );
  }

  const roleConfigs: { role: UserRole; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
    { role: 'user', label: 'User', icon: <UserCheck className="w-3.5 h-3.5" />, color: 'bg-slate-700 text-slate-200', desc: 'Standard member (ads on, vote, comment)' },
    { role: 'premium', label: 'Premium', icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />, color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', desc: 'Ad-free, gold badge, priority voting' },
    { role: 'pro', label: 'Pro', icon: <Crown className="w-3.5 h-3.5 text-purple-300" />, color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', desc: 'Host custom debates & tournaments' },
    { role: 'moderator', label: 'Mod', icon: <Shield className="w-3.5 h-3.5 text-emerald-300" />, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', desc: 'Moderate reports, edit recaps' },
    { role: 'admin', label: 'Admin', icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-300" />, color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', desc: 'Full /admin dashboard access' },
  ];

  return (
    <div className="fixed bottom-18 md:bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[94%] glass-panel rounded-2xl p-2.5 shadow-2xl border border-violet-500/30 flex flex-col md:flex-row items-center justify-between gap-2.5">
      <div className="flex items-center gap-2 text-xs">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-slate-300 font-medium hidden sm:inline">Role Sandbox:</span>
        <span className="text-slate-400">Current:</span>
        <span className="px-2 py-0.5 rounded-full bg-violet-600 text-white font-bold uppercase text-[10px] tracking-wider">
          {currentUser.role}
        </span>
        <span className="text-slate-400 hidden lg:inline">({currentUser.username})</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {roleConfigs.map(item => {
          const isActive = currentUser.role === item.role;
          return (
            <button
              key={item.role}
              onClick={() => {
                switchUserRole(item.role);
                // Also match with predefined demo user if found
                const match = allUsers.find(u => u.role === item.role);
                if (match) loginAsDemoUser(match.id);
              }}
              title={item.desc}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-violet-600 text-white border-violet-400 shadow-md scale-105'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-white/5 hover:border-violet-500/30'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}

        <button
          onClick={() => setIsDismissed(true)}
          className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
          title="Minimize bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
