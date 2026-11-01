import { Anime, DebaterRanking, EventItem, ForumThread, NewsArticle, NotificationItem, ReportItem, TournamentData, UserProfile } from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'usr_admin',
    username: 'KageMaster',
    email: 'admin@helmstudio.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    bio: 'Founder & Head Producer at Helm Studio. Shounen analyst & dark fantasy fanatic.',
    role: 'admin',
    badges: ['Founding Member', 'Admin Staff', 'Tournament Host', 'Otaku Titan'],
    stats: { episodesWatched: 1842, totalDays: 31.2, meanScore: 8.6 },
    createdAt: '2024-01-15'
  },
  {
    id: 'usr_mod',
    username: 'SakuraGuard',
    email: 'mod@helmstudio.io',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    bio: 'Senior Community Moderator. Keeping debates respectful and civil since season 1.',
    role: 'moderator',
    badges: ['Community Shield', 'Mod Verified', 'Debate Referee'],
    stats: { episodesWatched: 1210, totalDays: 20.8, meanScore: 8.2 },
    createdAt: '2024-02-10'
  },
  {
    id: 'usr_pro',
    username: 'ZephyrBlade',
    email: 'pro@helmstudio.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Pro Host & Competitive Anime Debater. Winner of Spring 2024 Shounen Showdown.',
    role: 'pro',
    badges: ['Pro Host', 'Debate Grandmaster', 'Tournament Victor'],
    stats: { episodesWatched: 940, totalDays: 16.3, meanScore: 8.9 },
    createdAt: '2024-03-01'
  },
  {
    id: 'usr_premium',
    username: 'LunaValkyrie',
    email: 'premium@helmstudio.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'Premium subscriber & lore deep-diver. Currently obsessed with Dandadan & Frieren.',
    role: 'premium',
    badges: ['Premium Patron', 'Gold Debater', 'Top Reviewer'],
    stats: { episodesWatched: 650, totalDays: 11.2, meanScore: 7.9 },
    createdAt: '2024-04-12'
  },
  {
    id: 'usr_user',
    username: 'RenAmamiya',
    email: 'ren@helmstudio.io',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    bio: 'Casual anime fan here for the debates and weekly episode schedules!',
    role: 'user',
    badges: ['New Explorer', 'Voter'],
    stats: { episodesWatched: 215, totalDays: 3.7, meanScore: 8.0 },
    createdAt: '2024-05-20'
  }
];

export const MOCK_CURATED_ANIME: Anime[] = [
  {
    id: 195604,
    title: {
      romaji: 'Black Clover 2nd Season',
      english: 'Black Clover Season 2',
      native: 'ブラッククローバー'
    },
    coverImage: {
      extraLarge: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80',
      large: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80',
      medium: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80',
      color: '#10b981'
    },
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    description: 'Asta and the Black Bulls return for the monumental Spade Kingdom and Judgement arcs. With the Devil Union perfected, the Clover Kingdom embarks on a war that will determine the fate of magic itself.',
    format: 'TV',
    status: 'RELEASING',
    episodes: 26,
    duration: 24,
    genres: ['Action', 'Comedy', 'Fantasy'],
    averageScore: 88,
    popularity: 310000,
    season: 'FALL',
    seasonYear: 2026,
    studios: ['Studio Pierrot'],
    nextAiringEpisode: {
      airingAt: Math.floor(Date.now() / 1000) + 18500,
      timeUntilAiring: 18500,
      episode: 6
    },
    trailer: {
      id: 'r_L1qX9b9aM',
      site: 'youtube'
    },
    streamingLinks: [
      { site: 'Crunchyroll', url: 'https://www.crunchyroll.com/series/GRE5G1EQ6/black-clover', color: '#ff6200' },
      { site: 'Netflix', url: 'https://www.netflix.com', color: '#e50914' }
    ]
  },
  {
    id: 195516,
    title: {
      romaji: 'Kusuriya no Hitorigoto 3rd Season',
      english: 'The Apothecary Diaries Season 3',
      native: '薬屋のひとりごと'
    },
    coverImage: {
      extraLarge: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
      large: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
      medium: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
      color: '#06b6d4'
    },
    bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    description: 'Maomao delves into deeper royal court conspiracies, poisonous medicinal intrigues, and uncovers long-buried secrets behind Jinshi’s imperial lineage.',
    format: 'TV',
    status: 'RELEASING',
    episodes: 24,
    duration: 24,
    genres: ['Drama', 'Mystery'],
    averageScore: 89,
    popularity: 298000,
    season: 'FALL',
    seasonYear: 2026,
    studios: ['TOHO animation STUDIO', 'OLM'],
    nextAiringEpisode: {
      airingAt: Math.floor(Date.now() / 1000) + 32000,
      timeUntilAiring: 32000,
      episode: 6
    },
    trailer: {
      id: 'Qp_zT3Xw42g',
      site: 'youtube'
    },
    streamingLinks: [
      { site: 'Crunchyroll', url: 'https://www.crunchyroll.com/series/G3KHEVDJ7/the-apothecary-diaries', color: '#ff6200' }
    ]
  },
  {
    id: 151807,
    title: {
      romaji: 'Ore dake Level Up na Ken',
      english: 'Solo Leveling Season 2: Arise from the Shadow',
      native: '俺だけレベルアップな件'
    },
    coverImage: {
      extraLarge: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx151807-31GjLdGk4W7x.png',
      large: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80',
      medium: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      color: '#4361ee'
    },
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
    description: 'They say whatever doesn’t kill you makes you stronger, but that isn’t the case for the world’s weakest hunter Sung Jinwoo. After being brutally slaughtered by monsters in a high-ranking dual dungeon, Jinwoo came back with the System, a program only he could see, that is leveling him up in every way.',
    format: 'TV',
    status: 'RELEASING',
    episodes: 24,
    duration: 24,
    genres: ['Action', 'Adventure', 'Fantasy'],
    averageScore: 88,
    popularity: 284500,
    season: 'WINTER',
    seasonYear: 2025,
    studios: ['A-1 Pictures'],
    nextAiringEpisode: {
      airingAt: Math.floor(Date.now() / 1000) + 14200,
      timeUntilAiring: 14200,
      episode: 18
    },
    trailer: {
      id: 'x_tKqU-Fh9g',
      site: 'youtube',
      thumbnail: 'https://i.ytimg.com/vi/x_tKqU-Fh9g/hqdefault.jpg'
    },
    streamingLinks: [
      { site: 'Crunchyroll', url: 'https://www.crunchyroll.com/series/GEXH3W2W7/solo-leveling', color: '#ff6200' },
      { site: 'Netflix', url: 'https://www.netflix.com/title/81749761', color: '#e50914' }
    ]
  },
  {
    id: 145064,
    title: {
      romaji: 'Jujutsu Kaisen Season 3: The Culling Game',
      english: 'Jujutsu Kaisen: The Culling Game',
      native: '呪術廻戦'
    },
    coverImage: {
      extraLarge: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500&q=80',
      large: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=500&q=80',
      medium: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=300&q=80',
      color: '#f43f5e'
    },
    bannerImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
    description: 'Following the devastating Shibuya Incident, Kenjaku initiates the Culling Game across Japan, forcing sorcerers and awakened curses into a brutal battle royale to merge humanity with Tengen.',
    format: 'TV',
    status: 'NOT_YET_RELEASED',
    episodes: 24,
    duration: 24,
    genres: ['Action', 'Supernatural', 'Fantasy'],
    averageScore: 91,
    popularity: 312000,
    season: 'SPRING',
    seasonYear: 2025,
    studios: ['MAPPA'],
    trailer: {
      id: 'pkZXflMmU1I',
      site: 'youtube'
    },
    streamingLinks: [
      { site: 'Crunchyroll', url: 'https://www.crunchyroll.com/series/GRDV0019R/jujutsu-kaisen', color: '#ff6200' },
      { site: 'Netflix', url: 'https://www.netflix.com', color: '#e50914' }
    ]
  },
  {
    id: 154587,
    title: {
      romaji: 'Sousou no Frieren',
      english: 'Frieren: Beyond Journey’s End',
      native: '葬送のフリーレン'
    },
    coverImage: {
      extraLarge: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
      large: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=80',
      medium: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
      color: '#10b981'
    },
    bannerImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    description: 'The mage Frieren defeated the Demon King alongside the hero Himmel’s party after a 10-year quest. Peace was restored to the realm. As an elf, Frieren lives over a thousand years. She takes on a new journey to retrace their footsteps and understand humanity.',
    format: 'TV',
    status: 'FINISHED',
    episodes: 28,
    duration: 24,
    genres: ['Adventure', 'Drama', 'Fantasy'],
    averageScore: 94,
    popularity: 295000,
    season: 'FALL',
    seasonYear: 2023,
    studios: ['Madhouse'],
    trailer: {
      id: 'ZEkwCGJ3o9M',
      site: 'youtube'
    },
    streamingLinks: [
      { site: 'Crunchyroll', url: 'https://www.crunchyroll.com/series/GG5H5XMQ5/frieren-beyond-journeys-end', color: '#ff6200' },
      { site: 'Prime Video', url: 'https://www.amazon.com/gp/video', color: '#00a8e1' }
    ]
  },
  {
    id: 166873,
    title: {
      romaji: 'Dandadan',
      english: 'Dandadan',
      native: 'ダンダダン'
    },
    coverImage: {
      extraLarge: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80',
      large: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80',
      medium: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=300&q=80',
      color: '#ec4899'
    },
    bannerImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1600&q=80',
    description: 'Momo Ayase strikes up an unusual friendship with the school UFO fanatic, whom she nicknames "Okarun" because he shares a name with Ken Takakura. While Momo believes in spirits, she thinks aliens are nonsense. Her new friend thinks the exact opposite!',
    format: 'TV',
    status: 'RELEASING',
    episodes: 12,
    duration: 24,
    genres: ['Action', 'Comedy', 'Supernatural', 'Sci-Fi'],
    averageScore: 89,
    popularity: 240000,
    season: 'FALL',
    seasonYear: 2024,
    studios: ['Science SARU'],
    nextAiringEpisode: {
      airingAt: Math.floor(Date.now() / 1000) + 48000,
      timeUntilAiring: 48000,
      episode: 9
    },
    trailer: {
      id: 'e6q8z4E9v78',
      site: 'youtube'
    },
    streamingLinks: [
      { site: 'Crunchyroll', url: 'https://www.crunchyroll.com/series/GZHMSV4E7/dandadan', color: '#ff6200' },
      { site: 'Netflix', url: 'https://www.netflix.com', color: '#e50914' },
      { site: 'Hulu', url: 'https://www.hulu.com', color: '#1ce783' }
    ]
  },
  {
    id: 171016,
    title: {
      romaji: 'Chainsaw Man: Reze Arc Movie',
      english: 'Chainsaw Man: The Movie - Reze Arc',
      native: 'チェンソーマン 劇場版 レゼ篇'
    },
    coverImage: {
      extraLarge: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80',
      large: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=500&q=80',
      medium: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=300&q=80',
      color: '#f97316'
    },
    bannerImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
    description: 'Denji meets Reze, a sweet girl working in a local cafe who shows an unexpected interest in him. But in the violent world of devil hunters, sweet encounters often mask explosive secrets.',
    format: 'MOVIE',
    status: 'NOT_YET_RELEASED',
    episodes: 1,
    duration: 105,
    genres: ['Action', 'Gore', 'Supernatural', 'Thriller'],
    averageScore: 92,
    popularity: 215000,
    seasonYear: 2025,
    studios: ['MAPPA'],
    trailer: {
      id: 'z6b8H2bS59o',
      site: 'youtube'
    },
    streamingLinks: [
      { site: 'Crunchyroll', url: 'https://www.crunchyroll.com/series/GVDHX8QNW/chainsaw-man', color: '#ff6200' }
    ]
  },
  {
    id: 153518,
    title: {
      romaji: 'Kimetsu no Yaiba: Hashira Geiko-hen',
      english: 'Demon Slayer: Kimetsu no Yaiba Hashira Training Arc',
      native: '鬼滅の刃 柱稽古編'
    },
    coverImage: {
      extraLarge: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80',
      large: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=500&q=80',
      medium: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80',
      color: '#06b6d4'
    },
    bannerImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1600&q=80',
    description: 'Tanjiro goes to see the Stone Hashira, Himejima, who intends to prepare him for the battles to come. The training to become a Hashira is rigorous and demanding, yet earning Himejima’s approval seems impossible.',
    format: 'TV',
    status: 'FINISHED',
    episodes: 8,
    duration: 26,
    genres: ['Action', 'Fantasy', 'Historical'],
    averageScore: 86,
    popularity: 260000,
    season: 'SPRING',
    seasonYear: 2024,
    studios: ['ufotable'],
    trailer: {
      id: '2oTdy9bX-u8',
      site: 'youtube'
    },
    streamingLinks: [
      { site: 'Crunchyroll', url: 'https://www.crunchyroll.com/series/GY5P48XEY/demon-slayer-kimetsu-no-yaiba', color: '#ff6200' },
      { site: 'Netflix', url: 'https://www.netflix.com', color: '#e50914' }
    ]
  }
];

export const MOCK_TOURNAMENT: TournamentData = {
  id: 'tourn_shounen_2025',
  title: 'Ultimate Anime Protagonist Showdown 2025',
  category: 'Shounen & Seinen Clash',
  currentRound: 2, // Round of 16 finished, in Quarterfinals
  matches: [
    // Round of 16 (Round 1)
    {
      id: 'm1_1',
      round: 1,
      matchIndex: 0,
      participantA: { id: 'c1', name: 'Sung Jinwoo', anime: 'Solo Leveling', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', votes: 1420, seed: 1, isWinner: true },
      participantB: { id: 'c16', name: 'Asta', anime: 'Black Clover', avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=150&q=80', votes: 610, seed: 16 },
      status: 'completed',
      winnerId: 'c1'
    },
    {
      id: 'm1_2',
      round: 1,
      matchIndex: 1,
      participantA: { id: 'c8', name: 'Denji', anime: 'Chainsaw Man', avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=150&q=80', votes: 1105, seed: 8, isWinner: true },
      participantB: { id: 'c9', name: 'Tanjiro Kamado', anime: 'Demon Slayer', avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80', votes: 980, seed: 9 },
      status: 'completed',
      winnerId: 'c8'
    },
    {
      id: 'm1_3',
      round: 1,
      matchIndex: 2,
      participantA: { id: 'c4', name: 'Satoru Gojo', anime: 'Jujutsu Kaisen', avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=150&q=80', votes: 2340, seed: 4, isWinner: true },
      participantB: { id: 'c13', name: 'Ichigo Kurosaki', anime: 'Bleach TYBW', avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80', votes: 1250, seed: 13 },
      status: 'completed',
      winnerId: 'c4'
    },
    {
      id: 'm1_4',
      round: 1,
      matchIndex: 3,
      participantA: { id: 'c5', name: 'Monkey D. Luffy', anime: 'One Piece', avatar: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=150&q=80', votes: 2190, seed: 5, isWinner: true },
      participantB: { id: 'c12', name: 'Gon Freecss', anime: 'Hunter x Hunter', avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', votes: 840, seed: 12 },
      status: 'completed',
      winnerId: 'c5'
    },
    {
      id: 'm1_5',
      round: 1,
      matchIndex: 4,
      participantA: { id: 'c2', name: 'Frieren', anime: 'Beyond Journey’s End', avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', votes: 1890, seed: 2, isWinner: true },
      participantB: { id: 'c15', name: 'Edward Elric', anime: 'Fullmetal Alchemist', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', votes: 1420, seed: 15 },
      status: 'completed',
      winnerId: 'c2'
    },
    {
      id: 'm1_6',
      round: 1,
      matchIndex: 5,
      participantA: { id: 'c7', name: 'Eren Yeager', anime: 'Attack on Titan', avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=150&q=80', votes: 1670, seed: 7, isWinner: true },
      participantB: { id: 'c10', name: 'Mob (Shigeo Kageyama)', anime: 'Mob Psycho 100', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', votes: 1110, seed: 10 },
      status: 'completed',
      winnerId: 'c7'
    },
    {
      id: 'm1_7',
      round: 1,
      matchIndex: 6,
      participantA: { id: 'c3', name: 'Thorfinn Karlsefni', anime: 'Vinland Saga', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', votes: 1540, seed: 3, isWinner: true },
      participantB: { id: 'c14', name: 'Ken Kaneki', anime: 'Tokyo Ghoul', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', votes: 1130, seed: 14 },
      status: 'completed',
      winnerId: 'c3'
    },
    {
      id: 'm1_8',
      round: 1,
      matchIndex: 7,
      participantA: { id: 'c6', name: 'Okarun (Ken Takakura)', anime: 'Dandadan', avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&q=80', votes: 1390, seed: 6, isWinner: true },
      participantB: { id: 'c11', name: 'Spike Spiegel', anime: 'Cowboy Bebop', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80', votes: 1280, seed: 11 },
      status: 'completed',
      winnerId: 'c6'
    },

    // Quarterfinals (Round 2) - ACTIVE VOTING!
    {
      id: 'm2_1',
      round: 2,
      matchIndex: 0,
      participantA: { id: 'c1', name: 'Sung Jinwoo', anime: 'Solo Leveling', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', votes: 1840, seed: 1 },
      participantB: { id: 'c8', name: 'Denji', anime: 'Chainsaw Man', avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=150&q=80', votes: 1620, seed: 8 },
      status: 'voting'
    },
    {
      id: 'm2_2',
      round: 2,
      matchIndex: 1,
      participantA: { id: 'c4', name: 'Satoru Gojo', anime: 'Jujutsu Kaisen', avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=150&q=80', votes: 2950, seed: 4 },
      participantB: { id: 'c5', name: 'Monkey D. Luffy', anime: 'One Piece', avatar: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=150&q=80', votes: 2880, seed: 5 },
      status: 'voting'
    },
    {
      id: 'm2_3',
      round: 2,
      matchIndex: 2,
      participantA: { id: 'c2', name: 'Frieren', anime: 'Beyond Journey’s End', avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', votes: 2210, seed: 2 },
      participantB: { id: 'c7', name: 'Eren Yeager', anime: 'Attack on Titan', avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=150&q=80', votes: 1980, seed: 7 },
      status: 'voting'
    },
    {
      id: 'm2_4',
      round: 2,
      matchIndex: 3,
      participantA: { id: 'c3', name: 'Thorfinn Karlsefni', anime: 'Vinland Saga', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', votes: 1430, seed: 3 },
      participantB: { id: 'c6', name: 'Okarun (Ken Takakura)', anime: 'Dandadan', avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&q=80', votes: 1510, seed: 6 },
      status: 'voting'
    },

    // Semifinals (Round 3) - Upcoming
    {
      id: 'm3_1',
      round: 3,
      matchIndex: 0,
      participantA: { id: 'tbd_1', name: 'Winner QF 1', anime: 'TBD', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80', votes: 0, seed: 1 },
      participantB: { id: 'tbd_2', name: 'Winner QF 2', anime: 'TBD', avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=150&q=80', votes: 0, seed: 4 },
      status: 'upcoming'
    },
    {
      id: 'm3_2',
      round: 3,
      matchIndex: 1,
      participantA: { id: 'tbd_3', name: 'Winner QF 3', anime: 'TBD', avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', votes: 0, seed: 2 },
      participantB: { id: 'tbd_4', name: 'Winner QF 4', anime: 'TBD', avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&q=80', votes: 0, seed: 6 },
      status: 'upcoming'
    },

    // Grand Final (Round 4) - Upcoming
    {
      id: 'm4_1',
      round: 4,
      matchIndex: 0,
      participantA: { id: 'tbd_final1', name: 'Semifinalist A', anime: 'TBD', avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=150&q=80', votes: 0, seed: 1 },
      participantB: { id: 'tbd_final2', name: 'Semifinalist B', anime: 'TBD', avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=150&q=80', votes: 0, seed: 2 },
      status: 'upcoming'
    }
  ]
};

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt_debate_gojo_sukuna',
    title: 'Gojo Satoru vs. Ryomen Sukuna: Who is Truly the Strongest?',
    description: 'The definitive clash of cursed sorcery. Defend your stance: Infinity & Hollow Purple vs. Malevolent Shrine & World Cutting Slash. Real-time voting and moderated debate rules in effect.',
    banner: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    type: 'debate',
    date: '2025-02-14T20:00:00Z',
    hostUserId: 'usr_admin',
    hostName: 'KageMaster',
    hostRole: 'admin',
    status: 'live',
    isOfficial: true,
    teamA: { name: 'Team Gojo (The Honored One)', color: '#8b5cf6', votes: 3410 },
    teamB: { name: 'Team Sukuna (King of Curses)', color: '#f43f5e', votes: 3120 },
    debateMessages: [
      {
        id: 'dbm_1',
        userId: 'usr_pro',
        username: 'ZephyrBlade',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        userRole: 'pro',
        stance: 'A',
        content: 'Limitless with Six Eyes allows near-infinite efficiency. Sukuna needed Mahoraga as a blueprint to learn the World Slash in the first place—in a pure 1v1 without Ten Shadows, Gojo takes it 7 out of 10 times.',
        upvotes: 184,
        isPinned: true,
        createdAt: '10m ago'
      },
      {
        id: 'dbm_2',
        userId: 'usr_mod',
        username: 'SakuraGuard',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        userRole: 'moderator',
        stance: 'B',
        content: 'Sukuna has the greatest jujutsu intellect across 1000 years. His open barrier domain Malevolent Shrine overpowered Unlimited Void’s exterior three times in a row. He held back his True Heian Form.',
        upvotes: 142,
        isPinned: false,
        createdAt: '7m ago'
      },
      {
        id: 'dbm_3',
        userId: 'usr_premium',
        username: 'LunaValkyrie',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        userRole: 'premium',
        stance: 'A',
        content: 'Black Flash chain x4 from Satoru Gojo literally knocked Sukuna unconscious in Chapter 232. The visual spectacle alone makes Gojo the real champion in our hearts.',
        upvotes: 97,
        isPinned: false,
        createdAt: '4m ago'
      }
    ]
  },
  {
    id: 'evt_poll_aotw',
    title: 'Anime of the Week: Episode of the Year Contenders',
    description: 'Which weekly episode gave you pure chills this week? Realtime community poll, one vote per verified user.',
    banner: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    type: 'poll',
    date: '2025-02-12T18:00:00Z',
    hostUserId: 'usr_mod',
    hostName: 'SakuraGuard',
    hostRole: 'moderator',
    status: 'live',
    isOfficial: true,
    totalVotes: 4890,
    pollOptions: [
      { id: 'opt_1', text: 'Solo Leveling S2 - Episode 17: "The Monarch Awakens"', votes: 2190, color: '#8b5cf6' },
      { id: 'opt_2', text: 'Dandadan - Episode 8: "The Turbo Granny Rematch"', votes: 1450, color: '#ec4899' },
      { id: 'opt_3', text: 'Bleach TYBW Part 3 - Episode 6: "The Royal Guard Fall"', votes: 790, color: '#f97316' },
      { id: 'opt_4', text: 'Re:Zero Season 3 - Episode 7: "Pristella on Fire"', votes: 460, color: '#06b6d4' }
    ]
  },
  {
    id: 'evt_tourn_bracket',
    title: 'Ultimate Anime Protagonist Showdown 2025',
    description: '16 legendary anime protagonists face off in our signature single-elimination bracket. Quarterfinals are LIVE right now!',
    banner: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
    type: 'tournament',
    date: '2025-02-10T00:00:00Z',
    hostUserId: 'usr_admin',
    hostName: 'KageMaster',
    hostRole: 'admin',
    status: 'live',
    isOfficial: true,
    tournament: MOCK_TOURNAMENT
  },
  {
    id: 'evt_giveaway_scale_figure',
    title: 'Helm Studio x Good Smile: 1/7 Scale Satoru Gojo & Frieren Figure Giveaway',
    description: 'Celebrate reaching 150k members! Enter for free. Premium & Pro members get 3x entry tickets automatically.',
    banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    type: 'giveaway',
    date: '2025-02-28T23:59:00Z',
    hostUserId: 'usr_admin',
    hostName: 'Helm Official',
    hostRole: 'admin',
    status: 'live',
    isOfficial: true,
    giveaway: {
      id: 'gw_1',
      title: '1/7 Scale Satoru Gojo Shibuya Ver. & Frieren Staff Deluxe Edition',
      prize: '2x Official Licensed Figures ($450 Value) + 1-Year Helm Pro Pass',
      banner: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      endsAt: '2025-02-28T23:59:59Z',
      entrantsCount: 8420,
      sponsor: 'Good Smile Company Partnered'
    }
  }
];

export const MOCK_LEADERBOARD: DebaterRanking[] = [
  {
    userId: 'usr_pro',
    username: 'ZephyrBlade',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    role: 'pro',
    points: 4820,
    wins: 42,
    argumentsCount: 189,
    weeklyRank: 1,
    allTimeRank: 1,
    tier: 'Grandmaster'
  },
  {
    userId: 'usr_admin',
    username: 'KageMaster',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    role: 'admin',
    points: 4150,
    wins: 38,
    argumentsCount: 144,
    weeklyRank: 3,
    allTimeRank: 2,
    tier: 'Grandmaster'
  },
  {
    userId: 'usr_debater_shinji',
    username: 'NeonEvangel',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
    role: 'premium',
    points: 3690,
    wins: 31,
    argumentsCount: 160,
    weeklyRank: 2,
    allTimeRank: 3,
    tier: 'Diamond'
  },
  {
    userId: 'usr_debater_levi',
    username: 'AckermanSpin',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    role: 'user',
    points: 3100,
    wins: 26,
    argumentsCount: 112,
    weeklyRank: 4,
    allTimeRank: 4,
    tier: 'Diamond'
  },
  {
    userId: 'usr_premium',
    username: 'LunaValkyrie',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    role: 'premium',
    points: 2780,
    wins: 22,
    argumentsCount: 95,
    weeklyRank: 5,
    allTimeRank: 5,
    tier: 'Platinum'
  }
];

export const MOCK_NEWS: NewsArticle[] = [
  {
    id: 'news_1',
    title: 'Anime Corner Winter 2025 Rankings: Solo Leveling Dominates Week 5 Polls',
    slug: 'anime-corner-winter-2025-rankings-solo-leveling-week-5',
    excerpt: 'Over 45,000 community votes placed Solo Leveling Season 2 at the pinnacle of this week’s anime charts, followed closely by Dandadan and Re:Zero.',
    content: `Anime Corner’s weekly anime polling results for Winter 2025 Week 5 are officially in, and **Solo Leveling Season 2: Arise from the Shadow** has secured the #1 position with an astonishing 18.4% of total cast ballots.

The spectacular animation quality provided by A-1 Pictures during Sung Jinwoo's encounter with the Red Gate bears ignited social discussions across Twitter/X and community debate boards.

Rounding out the top three were:
1. **Solo Leveling S2** (18.4%)
2. **Dandadan** (14.2%)
3. **Re:Zero - Starting Life in Another World Season 3** (11.8%)

*Data gathered directly from Anime Corner's official weekly poll survey.*`,
    source: 'Anime Corner',
    sourceUrl: 'https://animecorner.me',
    author: 'Anime Corner Editorial Team',
    authorRole: 'Official Feed Partner',
    publishedAt: '2 hours ago',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['Rankings', 'Solo Leveling', 'Winter 2025', 'Anime Corner'],
    readTime: '3 min read'
  },
  {
    id: 'news_2',
    title: 'Jujutsu Kaisen: MAPPA Teases The Culling Game Production Key Visuals',
    slug: 'jujutsu-kaisen-mappa-culling-game-visuals',
    excerpt: 'MAPPA releases high-resolution character concept art showcasing Yuta Okkotsu, Megumi Fushiguro, and Hajime Kashimo ahead of the premiere.',
    content: `During their weekend special stage, studio MAPPA unveiled the first official teaser stills for the upcoming **Jujutsu Kaisen: The Culling Game Arc**.

Featuring a gritty, high-contrast aesthetic reminiscent of the Shibuya Incident arc, the studio promised groundbreaking battle choreography for the upcoming colonies showdown.

Director Shota Goshozono confirmed returning staff members and teased a movie-caliber production schedule for the primary battle episodes.`,
    source: 'X Official',
    sourceUrl: 'https://x.com/animecorner_ac',
    author: '@AnimeCorner_ac via X',
    authorRole: 'Live Social Wire',
    publishedAt: '5 hours ago',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    tags: ['Jujutsu Kaisen', 'MAPPA', 'Breaking News', 'Visuals'],
    readTime: '2 min read'
  },
  {
    id: 'news_3',
    title: 'Frieren: Beyond Journey’s End Season 2 Officially Greenlit for Production',
    slug: 'frieren-season-2-officially-greenlit',
    excerpt: 'Madhouse announces the return of the beloved fantasy series following record-breaking manga sales and international streaming milestones.',
    content: `Fans of the timeless journey rejoice! TOHO Animation and Studio Madhouse have confirmed that **Frieren: Beyond Journey’s End Season 2** is officially in production.

The announcement was accompanied by an illustration from manga artist Tsukasa Abe depicting Frieren, Fern, and Stark continuing their northern trek towards Aureole.`,
    source: 'Helm Editorial',
    sourceUrl: 'https://helmstudio.io/news/frieren-season-2',
    author: 'KageMaster',
    authorRole: 'Helm Head Writer',
    publishedAt: '1 day ago',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    tags: ['Frieren', 'Madhouse', 'Sequel Announcement', 'Editorial'],
    readTime: '4 min read'
  }
];

export const MOCK_FORUM_THREADS: ForumThread[] = [
  {
    id: 'th_1',
    category: 'Debate Lounge',
    title: 'Sukuna’s World-Cutting Slash: Brilliant Tactical Jujutsu or Narrative Asspull?',
    content: 'Let us break down the binding vows used in Chapter 236. Did Gege Akutami properly foreshadow how Mahoraga’s adaptation can be mirrored by another sorcerer, or was Sukuna painted into a corner?',
    authorId: 'usr_pro',
    authorName: 'ZephyrBlade',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    authorRole: 'pro',
    repliesCount: 68,
    upvotes: 312,
    isPinned: true,
    createdAt: '4 hours ago',
    tags: ['Jujutsu Kaisen', 'Lore Debate', 'Manga Spoilers']
  },
  {
    id: 'th_2',
    category: 'General Anime',
    title: 'What made Dandadan the biggest surprise hit of the year?',
    content: 'Science SARU knocked the psychedelic art direction out of the park. Between the romance dynamics between Momo and Okarun and the emotional backstory of Turbo Granny, this is top tier.',
    authorId: 'usr_premium',
    authorName: 'LunaValkyrie',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    authorRole: 'premium',
    repliesCount: 43,
    upvotes: 185,
    isPinned: false,
    createdAt: '8 hours ago',
    tags: ['Dandadan', 'Science SARU', 'Discussion']
  },
  {
    id: 'th_3',
    category: 'Episode Discussions',
    title: 'Solo Leveling S2 Ep 17 Discussion & Breakdown: Jinwoo vs. Monarch of White Flames',
    content: 'The sound design when Jinwoo summoned the Shadow Army was pure ASMR. How do you rate this episode compared to the manhwa source material?',
    authorId: 'usr_admin',
    authorName: 'KageMaster',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    authorRole: 'admin',
    repliesCount: 112,
    upvotes: 490,
    isPinned: true,
    createdAt: '1 day ago',
    tags: ['Solo Leveling', 'Weekly Discussion', 'A-1 Pictures']
  }
];

export const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'rep_1',
    targetType: 'comment',
    targetId: 'cm_toxic_99',
    reason: 'Hostile insults and uncivil trolling in Gojo vs Sukuna debate',
    reportedContent: 'Anyone who votes for Sukuna is literally brainless and has never read a manga in their life!',
    reporterName: 'LunaValkyrie',
    reportedUserName: 'GojoStan999',
    createdAt: '25m ago',
    status: 'pending'
  },
  {
    id: 'rep_2',
    targetType: 'thread',
    targetId: 'th_spoiler_44',
    reason: 'Unmarked major manga ending spoilers in thread title',
    reportedContent: '[SPOILER] Ending revealed: Character X dies at the climax of season 3',
    reporterName: 'ZephyrBlade',
    reportedUserName: 'SpeedReaderX',
    createdAt: '1 hour ago',
    status: 'pending'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'episode',
    title: 'New Episode Airing Soon!',
    message: 'Solo Leveling S2 Episode 18 airs in 3 hours on Crunchyroll.',
    animeId: 151807,
    read: false,
    createdAt: '15m ago'
  },
  {
    id: 'notif_2',
    type: 'event',
    title: 'Live Debate Reminder',
    message: 'The Gojo vs. Sukuna arena debate is now LIVE. Cast your vote!',
    link: '/events',
    read: false,
    createdAt: '1 hour ago'
  },
  {
    id: 'notif_3',
    type: 'reply',
    title: 'New Reply to Your Comment',
    message: 'ZephyrBlade replied to your post on "Solo Leveling S2 Ep 17".',
    read: true,
    createdAt: '3 hours ago'
  }
];
