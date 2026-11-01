import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, UserAnimeListItem, WatchStatus, Anime, NotificationItem } from '../types';
import { INITIAL_USERS, MOCK_NOTIFICATIONS, MOCK_CURATED_ANIME } from '../data/mockData';

interface AuthContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  userList: UserAnimeListItem[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  switchUserRole: (role: UserRole) => void;
  loginAsDemoUser: (userId: string) => void;
  loginWithEmail: (email: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addOrUpdateAnimeInList: (anime: Anime, status: WatchStatus, score?: number, progress?: number) => void;
  removeFromList: (animeId: number) => void;
  incrementProgress: (animeId: number) => void;
  getAnimeStatusInList: (animeId: number) => UserAnimeListItem | undefined;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => void;
  supabaseConfig: { url: string; anonKey: string };
  setSupabaseConfig: (config: { url: string; anonKey: string }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('helm_theme') as 'dark' | 'light') || 'dark';
  });

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('helm_theme', t);
    if (t === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  // Supabase mock / live config
  const [supabaseConfig, setSupabaseConfigState] = useState<{ url: string; anonKey: string }>(() => {
    const saved = localStorage.getItem('helm_supabase_config');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      url: (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co',
      anonKey: (import.meta as unknown as { env: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || 'public-anon-key-placeholder'
    };
  });

  const setSupabaseConfig = (config: { url: string; anonKey: string }) => {
    setSupabaseConfigState(config);
    localStorage.setItem('helm_supabase_config', JSON.stringify(config));
  };

  // User management
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('helm_users');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_USERS;
  });

  // Default active user is a standard public community member (role: 'user')
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const savedId = localStorage.getItem('helm_active_user_id');
    const found = allUsers.find(u => u.id === savedId);
    const standardUser = allUsers.find(u => u.role === 'user') || allUsers[allUsers.length - 1];
    return found || standardUser;
  });

  useEffect(() => {
    localStorage.setItem('helm_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('helm_active_user_id', currentUser.id);
  }, [currentUser]);

  // User anime watchlist state
  const [userList, setUserList] = useState<UserAnimeListItem[]>(() => {
    const saved = localStorage.getItem(`helm_userlist_${currentUser.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    // Seed initial list
    return [
      {
        animeId: MOCK_CURATED_ANIME[0].id,
        anime: MOCK_CURATED_ANIME[0],
        status: 'CURRENT',
        progress: 17,
        score: 9.5,
        updatedAt: '2 hours ago'
      },
      {
        animeId: MOCK_CURATED_ANIME[2].id,
        anime: MOCK_CURATED_ANIME[2],
        status: 'COMPLETED',
        progress: 28,
        score: 10,
        updatedAt: '3 days ago'
      },
      {
        animeId: MOCK_CURATED_ANIME[3].id,
        anime: MOCK_CURATED_ANIME[3],
        status: 'CURRENT',
        progress: 8,
        score: 9.0,
        updatedAt: 'Yesterday'
      },
      {
        animeId: MOCK_CURATED_ANIME[1].id,
        anime: MOCK_CURATED_ANIME[1],
        status: 'PLANNING',
        progress: 0,
        score: 0,
        updatedAt: '5 days ago'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(`helm_userlist_${currentUser.id}`, JSON.stringify(userList));
  }, [userList, currentUser.id]);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('helm_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return MOCK_NOTIFICATIONS;
  });

  useEffect(() => {
    localStorage.setItem('helm_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Switch role quickly
  const switchUserRole = (newRole: UserRole) => {
    const targetUser = allUsers.find(u => u.role === newRole);
    if (targetUser) {
      setCurrentUser(targetUser);
    } else {
      const updated = { ...currentUser, role: newRole };
      setCurrentUser(updated);
      setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    }
  };

  const loginAsDemoUser = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const loginWithEmail = async (email: string): Promise<boolean> => {
    const existing = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      return true;
    }
    // Create new user profile
    const username = email.split('@')[0] || 'User' + Math.floor(Math.random() * 900 + 100);
    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      username,
      email,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
      role: 'user',
      badges: ['New Otaku'],
      stats: { episodesWatched: 0, totalDays: 0, meanScore: 0 },
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    // Switch to casual user
    const casual = allUsers.find(u => u.role === 'user') || allUsers[allUsers.length - 1];
    setCurrentUser(casual);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  // List management
  const addOrUpdateAnimeInList = (anime: Anime, status: WatchStatus, score = 0, progress = 0) => {
    setUserList(prev => {
      const existingIdx = prev.findIndex(item => item.animeId === anime.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = {
          ...copy[existingIdx],
          status,
          score: score || copy[existingIdx].score,
          progress: progress !== undefined ? progress : copy[existingIdx].progress,
          updatedAt: 'Just now'
        };
        return copy;
      } else {
        const newItem: UserAnimeListItem = {
          animeId: anime.id,
          anime,
          status,
          score,
          progress: progress || (status === 'COMPLETED' ? (anime.episodes || 12) : 0),
          updatedAt: 'Just now'
        };
        return [newItem, ...prev];
      }
    });

    addNotification({
      type: 'system',
      title: 'Anime List Updated',
      message: `"${anime.title.english || anime.title.romaji}" marked as ${status}.`
    });
  };

  const removeFromList = (animeId: number) => {
    setUserList(prev => prev.filter(item => item.animeId !== animeId));
  };

  const incrementProgress = (animeId: number) => {
    setUserList(prev => prev.map(item => {
      if (item.animeId === animeId) {
        const maxEp = item.anime.episodes || 999;
        const newProgress = Math.min(maxEp, item.progress + 1);
        const newStatus: WatchStatus = newProgress >= maxEp ? 'COMPLETED' : item.status;
        return {
          ...item,
          progress: newProgress,
          status: newStatus,
          updatedAt: 'Just now'
        };
      }
      return item;
    }));
  };

  const getAnimeStatusInList = (animeId: number) => {
    return userList.find(item => item.animeId === animeId);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        userList,
        notifications,
        unreadNotifsCount,
        theme,
        setTheme,
        toggleTheme,
        switchUserRole,
        loginAsDemoUser,
        loginWithEmail,
        logout,
        updateProfile,
        addOrUpdateAnimeInList,
        removeFromList,
        incrementProgress,
        getAnimeStatusInList,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        supabaseConfig,
        setSupabaseConfig
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
