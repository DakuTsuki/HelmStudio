import React from 'react';
import { Home, Compass, Calendar, Flame, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  const { currentUser } = useAuth();

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'browse', label: 'Browse', icon: Compass },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'events', label: 'Events', icon: Flame },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-panel border-t border-white/10 backdrop-blur-2xl px-2 py-2">
      <div className="flex items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-violet-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#8b5cf6]" />
                )}
              </div>
              <span className="text-[10px] mt-1">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
