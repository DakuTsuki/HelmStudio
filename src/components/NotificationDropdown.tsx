import React from 'react';
import { Bell, Check, Film, Flame, MessageSquare, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { NotificationItem } from '../types';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnime?: (animeId: number) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onSelectAnime
}) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAuth();

  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'episode':
        return <Film className="w-4 h-4 text-violet-400" />;
      case 'event':
        return <Flame className="w-4 h-4 text-rose-400" />;
      case 'reply':
        return <MessageSquare className="w-4 h-4 text-cyan-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-84 sm:w-96 glass-panel rounded-2xl shadow-2xl border border-violet-500/20 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-violet-400" />
          <span className="font-semibold text-sm text-slate-100">Notifications</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-medium">
            {notifications.filter(n => !n.read).length} new
          </span>
        </div>
        <button
          onClick={markAllNotificationsAsRead}
          className="text-xs text-slate-400 hover:text-violet-300 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No notifications right now.
          </div>
        ) : (
          notifications.map(item => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationAsRead(item.id);
                if (item.animeId && onSelectAnime) {
                  onSelectAnime(item.animeId);
                  onClose();
                }
              }}
              className={`p-3.5 flex gap-3 hover:bg-violet-950/20 cursor-pointer transition-colors ${
                !item.read ? 'bg-violet-500/5' : ''
              }`}
            >
              <div className="mt-0.5 w-8 h-8 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0 border border-white/5">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{item.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{item.createdAt}</span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">{item.message}</p>
              </div>
              {!item.read && (
                <div className="w-2 h-2 rounded-full bg-violet-400 self-center shrink-0" />
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-white/10 bg-slate-900/40 text-center">
        <span className="text-[11px] text-slate-400">
          Airing alerts & debate reminders refreshed every 15 min
        </span>
      </div>
    </div>
  );
};
