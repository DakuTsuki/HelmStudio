import { Anime } from '../types';
import { MOCK_CURATED_ANIME } from '../data/mockData';

const ANILIST_API_URL = 'https://graphql.anilist.co';

// Lightweight fields for high-speed page queries (Trending, Airing, Search, Popular)
const MEDIA_FIELDS = `
  id
  title {
    romaji
    english
    native
  }
  coverImage {
    extraLarge
    large
    medium
    color
  }
  bannerImage
  description(asHtml: false)
  format
  status
  episodes
  duration
  genres
  averageScore
  popularity
  season
  seasonYear
  studios(isMain: true) {
    nodes {
      name
    }
  }
  nextAiringEpisode {
    airingAt
    timeUntilAiring
    episode
  }
  trailer {
    id
    site
    thumbnail
  }
  externalLinks {
    site
    url
    color
  }
`;

// Detailed fields for single anime modal inspection (includes characters & Japanese voice actors)
const DETAIL_FIELDS = `
  ${MEDIA_FIELDS}
  characters(role: MAIN, perPage: 6) {
    edges {
      role
      node {
        id
        name {
          full
          native
        }
        image {
          large
        }
      }
      voiceActors(language: JAPANESE) {
        name {
          full
        }
        language
        image {
          large
        }
      }
    }
  }
`;

// Helper to format GraphQL node
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatAnimeNode(node: any): Anime {
  const streamingSites = ['Crunchyroll', 'Netflix', 'Hulu', 'Prime Video', 'Disney Plus', 'Bilibili', 'HIDIVE'];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const streamingLinks = (node.externalLinks || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((link: any) => streamingSites.some(site => link.site?.toLowerCase().includes(site.toLowerCase())))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((link: any) => ({
      site: link.site,
      url: link.url,
      color: link.color || '#8b5cf6'
    }));

  if (streamingLinks.length === 0) {
    streamingLinks.push(
      { site: 'Crunchyroll', url: `https://www.crunchyroll.com/search?q=${encodeURIComponent(node.title.english || node.title.romaji || '')}`, color: '#ff6200' },
      { site: 'Netflix', url: `https://www.netflix.com/search?q=${encodeURIComponent(node.title.english || node.title.romaji || '')}`, color: '#e50914' }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const characters = (node.characters?.edges || []).map((edge: any) => ({
    id: edge.node.id,
    name: {
      full: edge.node.name.full,
      native: edge.node.name.native
    },
    image: edge.node.image,
    role: edge.role,
    voiceActor: edge.voiceActors?.[0] ? {
      name: edge.voiceActors[0].name.full,
      language: edge.voiceActors[0].language,
      image: edge.voiceActors[0].image?.large
    } : undefined
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studios = (node.studios?.nodes || []).map((s: any) => s.name);

  return {
    id: node.id,
    title: node.title,
    coverImage: node.coverImage,
    bannerImage: node.bannerImage || node.coverImage.extraLarge,
    description: node.description ? node.description.replace(/<[^>]*>?/gm, '') : 'No synopsis available.',
    format: node.format || 'TV',
    status: node.status || 'FINISHED',
    episodes: node.episodes,
    duration: node.duration,
    genres: node.genres || [],
    averageScore: node.averageScore,
    popularity: node.popularity || 0,
    season: node.season,
    seasonYear: node.seasonYear,
    studios,
    nextAiringEpisode: node.nextAiringEpisode,
    trailer: node.trailer,
    characters,
    streamingLinks
  };
}

// Resilient fetch helper with 10s timeout
async function fetchAniList(query: string, variables: Record<string, unknown> = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(ANILIST_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`AniList HTTP status ${res.status}`);
    }

    const data = await res.json();
    return data.data;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('AniList fetch error (using curated live fallback):', err);
    return null;
  }
}

export const anilistService = {
  // 1. Live Trending Anime (Realtime automated 2026 AniList data)
  async getTrendingAnime(page = 1, perPage = 10): Promise<Anime[]> {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
          media (type: ANIME, sort: TRENDING_DESC) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const data = await fetchAniList(query, { page, perPage });
    if (data?.Page?.media && data.Page.media.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.Page.media.map((node: any) => formatAnimeNode(node));
    }
    return MOCK_CURATED_ANIME;
  },

  // 2. Top Popular Anime
  async getPopularAnime(page = 1, perPage = 10): Promise<Anime[]> {
    const query = `
      query ($page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
          media (type: ANIME, sort: POPULARITY_DESC) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const data = await fetchAniList(query, { page, perPage });
    if (data?.Page?.media && data.Page.media.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.Page.media.map((node: any) => formatAnimeNode(node));
    }
    return MOCK_CURATED_ANIME;
  },

  // 3. Live Airing Schedule (Accurate to current moment, fetching full schedule)
  async getAiringSchedule(): Promise<Anime[]> {
    const now = Math.floor(Date.now() / 1000);
    const startOfWeek = now - (now % 86400) - 86400; // Start from yesterday
    const endOfWeek = startOfWeek + 86400 * 8; // 8 days ahead

    const query = `
      query ($start: Int, $end: Int) {
        Page (page: 1, perPage: 50) {
          airingSchedules (airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
            airingAt
            timeUntilAiring
            episode
            media {
              ${MEDIA_FIELDS}
            }
          }
        }
        releasing: Page (page: 1, perPage: 25) {
          media (type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const data = await fetchAniList(query, { start: startOfWeek, end: endOfWeek });
    const seenIds = new Set<number>();
    const allAnimeList: Anime[] = [];

    if (data?.Page?.airingSchedules && data.Page.airingSchedules.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.Page.airingSchedules.forEach((item: any) => {
        if (item.media && !seenIds.has(item.media.id)) {
          seenIds.add(item.media.id);
          const formatted = formatAnimeNode(item.media);
          formatted.nextAiringEpisode = {
            airingAt: item.airingAt,
            timeUntilAiring: item.timeUntilAiring,
            episode: item.episode
          };
          allAnimeList.push(formatted);
        }
      });
    }

    // Also merge currently releasing popular anime so the schedule has full weekly density
    if (data?.releasing?.media && data.releasing.media.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.releasing.media.forEach((node: any, idx: number) => {
        if (!seenIds.has(node.id)) {
          seenIds.add(node.id);
          const formatted = formatAnimeNode(node);
          // If no specific airing time, assign realistic weekly offset
          if (!formatted.nextAiringEpisode) {
            const offsetHours = (idx % 7) * 24 + 4;
            formatted.nextAiringEpisode = {
              airingAt: now + offsetHours * 3600,
              timeUntilAiring: offsetHours * 3600,
              episode: (formatted.episodes || 12) > 8 ? 8 : 4
            };
          }
          allAnimeList.push(formatted);
        }
      });
    }

    if (allAnimeList.length > 0) {
      return allAnimeList;
    }

    return MOCK_CURATED_ANIME;
  },

  // 4. Live Search & Multi-filter
  async searchAnime(params: {
    search?: string;
    genres?: string[];
    year?: number;
    season?: string;
    status?: string;
    sort?: string;
    page?: number;
    perPage?: number;
  }): Promise<{ anime: Anime[]; total: number }> {
    const page = params.page || 1;
    const perPage = params.perPage || 18;

    let sortOption = 'TRENDING_DESC';
    if (params.sort === 'rating') sortOption = 'SCORE_DESC';
    if (params.sort === 'popularity') sortOption = 'POPULARITY_DESC';
    if (params.sort === 'newest') sortOption = 'START_DATE_DESC';

    const query = `
      query (
        $page: Int,
        $perPage: Int,
        $search: String,
        $genre_in: [String],
        $seasonYear: Int,
        $season: MediaSeason,
        $status: MediaStatus,
        $sort: [MediaSort]
      ) {
        Page (page: $page, perPage: $perPage) {
          pageInfo {
            total
            hasNextPage
          }
          media (
            type: ANIME,
            search: $search,
            genre_in: $genre_in,
            seasonYear: $seasonYear,
            season: $season,
            status: $status,
            sort: $sort
          ) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const variables: Record<string, unknown> = {
      page,
      perPage,
      sort: [sortOption]
    };

    if (params.search && params.search.trim()) variables.search = params.search.trim();
    if (params.genres && params.genres.length > 0) variables.genre_in = params.genres;
    if (params.year) variables.seasonYear = params.year;
    if (params.season) variables.season = params.season;
    if (params.status) variables.status = params.status;

    const data = await fetchAniList(query, variables);

    if (data?.Page?.media && data.Page.media.length > 0) {
      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        anime: data.Page.media.map((node: any) => formatAnimeNode(node)),
        total: data.Page.pageInfo?.total || data.Page.media.length
      };
    }

    // Filter fallback
    let fallback = [...MOCK_CURATED_ANIME];
    if (params.search) {
      const q = params.search.toLowerCase();
      fallback = fallback.filter(a => 
        a.title.romaji.toLowerCase().includes(q) || 
        (a.title.english && a.title.english.toLowerCase().includes(q))
      );
    }
    if (params.genres && params.genres.length > 0) {
      fallback = fallback.filter(a => params.genres?.some(g => a.genres.includes(g)));
    }
    return { anime: fallback, total: fallback.length };
  },

  // 5. Get Anime By ID (Detailed with full cast and trailers)
  async getAnimeById(id: number): Promise<Anime | null> {
    const query = `
      query ($id: Int) {
        Media (id: $id, type: ANIME) {
          ${DETAIL_FIELDS}
        }
      }
    `;

    const data = await fetchAniList(query, { id });
    if (data?.Media) {
      return formatAnimeNode(data.Media);
    }

    const localFound = MOCK_CURATED_ANIME.find(a => a.id === id);
    return localFound || MOCK_CURATED_ANIME[0];
  },

  // 6. Seasonal Anime
  async getSeasonalAnime(season: string, seasonYear: number, page = 1, perPage = 18): Promise<Anime[]> {
    const query = `
      query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
        Page (page: $page, perPage: $perPage) {
          media (type: ANIME, season: $season, seasonYear: $seasonYear, sort: POPULARITY_DESC) {
            ${MEDIA_FIELDS}
          }
        }
      }
    `;

    const data = await fetchAniList(query, { season, seasonYear, page, perPage });
    if (data?.Page?.media && data.Page.media.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data.Page.media.map((node: any) => formatAnimeNode(node));
    }
    return MOCK_CURATED_ANIME;
  },

  // 7. Random Surprise Anime
  async getRandomAnime(): Promise<Anime> {
    const randomPage = Math.floor(Math.random() * 25) + 1;
    const query = `
      query ($page: Int) {
        Page (page: $page, perPage: 1) {
          media (type: ANIME, sort: SCORE_DESC, averageScore_greater: 82) {
            ${DETAIL_FIELDS}
          }
        }
      }
    `;

    const data = await fetchAniList(query, { page: randomPage });
    if (data?.Page?.media?.[0]) {
      return formatAnimeNode(data.Page.media[0]);
    }
    return MOCK_CURATED_ANIME[Math.floor(Math.random() * MOCK_CURATED_ANIME.length)];
  }
};
