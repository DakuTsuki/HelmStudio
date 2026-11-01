export type UserRole = 'user' | 'premium' | 'pro' | 'moderator' | 'admin';

export type WatchStatus = 'CURRENT' | 'COMPLETED' | 'PLANNING' | 'DROPPED' | 'PAUSED';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  banner?: string;
  bio?: string;
  role: UserRole;
  badges: string[];
  stats: {
    episodesWatched: number;
    totalDays: number;
    meanScore: number;
  };
  createdAt: string;
}

export interface AnimeTitle {
  romaji: string;
  english: string | null;
  native: string | null;
}

export interface AnimeCoverImage {
  extraLarge: string;
  large: string;
  medium: string;
  color?: string;
}

export interface AiringEpisode {
  airingAt: number;
  timeUntilAiring: number;
  episode: number;
}

export interface AnimeTrailer {
  id: string;
  site: string; // "youtube"
  thumbnail?: string;
}

export interface CharacterItem {
  id: number;
  name: {
    full: string;
    native?: string;
  };
  image?: {
    large: string;
  };
  role: string;
  voiceActor?: {
    name: string;
    language: string;
    image?: string;
  };
}

export interface StreamingLink {
  site: string; // 'Crunchyroll' | 'Netflix' | 'Hulu' | 'Prime Video' | 'Muse Asia' | 'Ani-One'
  url: string;
  color?: string;
}

export interface Anime {
  id: number;
  title: AnimeTitle;
  coverImage: AnimeCoverImage;
  bannerImage: string | null;
  description: string;
  format: 'TV' | 'TV_SHORT' | 'MOVIE' | 'SPECIAL' | 'OVA' | 'ONA';
  status: 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
  episodes: number | null;
  duration: number | null;
  genres: string[];
  averageScore: number | null;
  popularity: number;
  season?: 'WINTER' | 'SPRING' | 'SUMMER' | 'FALL';
  seasonYear?: number;
  studios?: string[];
  nextAiringEpisode?: AiringEpisode | null;
  trailer?: AnimeTrailer | null;
  characters?: CharacterItem[];
  streamingLinks?: StreamingLink[];
  userListStatus?: WatchStatus;
  userScore?: number;
  userProgress?: number;
}

export interface UserAnimeListItem {
  animeId: number;
  anime: Anime;
  status: WatchStatus;
  progress: number;
  score: number;
  notes?: string;
  updatedAt: string;
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  username: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  likes: number;
  userLiked?: boolean;
  createdAt: string;
}

export interface CommentItem {
  id: string;
  animeId?: number;
  eventId?: string;
  threadId?: string;
  userId: string;
  username: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  likes: number;
  userLiked?: boolean;
  replies: CommentReply[];
  createdAt: string;
  reported?: boolean;
}

export type EventType = 'debate' | 'poll' | 'tournament' | 'giveaway';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  color?: string;
}

export interface DebateMessage {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  userRole: UserRole;
  stance: 'A' | 'B';
  content: string;
  upvotes: number;
  isPinned?: boolean;
  createdAt: string;
}

export interface TournamentMatchParticipant {
  id: string;
  name: string;
  anime: string;
  avatar: string;
  votes: number;
  seed: number;
  isWinner?: boolean;
}

export interface TournamentMatch {
  id: string;
  round: number; // 1: Round of 16 (8 matches), 2: Quarterfinals (4 matches), 3: Semis (2 matches), 4: Finals (1 match)
  matchIndex: number;
  participantA: TournamentMatchParticipant;
  participantB: TournamentMatchParticipant;
  status: 'upcoming' | 'voting' | 'completed';
  winnerId?: string;
}

export interface TournamentData {
  id: string;
  title: string;
  category: string;
  currentRound: number;
  matches: TournamentMatch[];
  champion?: TournamentMatchParticipant;
}

export interface DebaterRanking {
  userId: string;
  username: string;
  avatar: string;
  role: UserRole;
  points: number;
  wins: number;
  argumentsCount: number;
  weeklyRank: number;
  allTimeRank: number;
  tier: 'Grandmaster' | 'Diamond' | 'Platinum' | 'Gold' | 'Silver';
}

export interface GiveawayItem {
  id: string;
  title: string;
  prize: string;
  banner: string;
  endsAt: string;
  entrantsCount: number;
  userEntered?: boolean;
  sponsor: string;
  winner?: {
    username: string;
    avatar: string;
  };
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  banner: string;
  type: EventType;
  date: string;
  hostUserId: string;
  hostName: string;
  hostRole: UserRole;
  status: 'upcoming' | 'live' | 'completed';
  isOfficial?: boolean;
  reminded?: boolean;
  // Poll data
  pollOptions?: PollOption[];
  totalVotes?: number;
  userVoteId?: string;
  // Debate data
  teamA?: { name: string; color: string; votes: number };
  teamB?: { name: string; color: string; votes: number };
  debateMessages?: DebateMessage[];
  // Tournament data
  tournament?: TournamentData;
  // Giveaway data
  giveaway?: GiveawayItem;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  source: 'Anime Corner' | 'X Official' | 'Helm Editorial';
  sourceUrl: string;
  author: string;
  authorRole?: string;
  publishedAt: string;
  coverImage: string;
  tags: string[];
  readTime: string;
}

export interface ForumThread {
  id: string;
  category: 'General Anime' | 'Episode Discussions' | 'Theories & Spoilers' | 'Debate Lounge' | 'Manga & LN';
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: UserRole;
  repliesCount: number;
  upvotes: number;
  userUpvoted?: boolean;
  isPinned: boolean;
  createdAt: string;
  tags: string[];
}

export interface ReportItem {
  id: string;
  targetType: 'comment' | 'user' | 'thread';
  targetId: string;
  reason: string;
  reportedContent: string;
  reporterName: string;
  reportedUserName: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface NotificationItem {
  id: string;
  type: 'episode' | 'event' | 'reply' | 'system';
  title: string;
  message: string;
  link?: string;
  animeId?: number;
  read: boolean;
  createdAt: string;
}

export interface AdSlotConfig {
  id: string;
  position: 'banner' | 'sidebar' | 'infeed';
  title: string;
  imageUrl: string;
  linkUrl: string;
  sponsorName: string;
  active: boolean;
}
