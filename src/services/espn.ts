import { Game, GameSide, LeagueInfo, NewsArticle, StandingsEntry, Team } from '../types';
import { LEAGUES, SAMPLE_GAMES, SAMPLE_NEWS, SAMPLE_STANDINGS } from './mockData';
import { kalshiService } from './kalshiService';

const BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports';

interface ESPNCompetitionCompetitor {
  id: string;
  homeAway: string;
  score?: string;
  records?: Array<{ summary?: string; type?: string }>;
  linescores?: Array<{ value: number }>;
  team: {
    id: string;
    name: string;
    displayName: string;
    abbreviation: string;
    logo?: string;
    logos?: Array<{ href: string }>;
    color?: string;
  };
}

interface ESPNEvent {
  id: string;
  date: string;
  competitions?: Array<{
    id: string;
    status: {
      type: {
        state: 'pre' | 'in' | 'post';
        shortDetail?: string;
        description?: string;
      };
      displayClock?: string;
      period?: number;
    };
    venue?: { fullName?: string; address?: { city?: string; state?: string } };
    broadcasts?: Array<{ names?: string[] }>;
    competitors?: ESPNCompetitionCompetitor[];
    situation?: {
      downDistanceText?: string;
      lastPlay?: { text?: string };
      possession?: string;
      batter?: {
        athlete?: { displayName?: string };
        summary?: string;
      };
      balls?: number;
      strikes?: number;
      outs?: number;
    };
    odds?: Array<{ details?: string; overUnder?: number; provider?: { name?: string } }>;
    leaders?: Array<{
      name: string;
      displayName: string;
      leaders?: Array<{
        displayValue: string;
        athlete?: { displayName: string; headshot?: string };
        team?: { abbreviation: string };
      }>;
    }>;
  }>;
}

export function getOfficialLogoUrl(leagueKey: string, teamId: string): string {
  const key = leagueKey.toLowerCase();
  let espnSport = 'basketball';
  let espnLeague = 'nba';

  switch (key) {
    case 'nba':
      espnSport = 'basketball';
      espnLeague = 'nba';
      break;
    case 'wnba':
      espnSport = 'basketball';
      espnLeague = 'wnba';
      break;
    case 'nfl':
      espnSport = 'football';
      espnLeague = 'nfl';
      break;
    case 'cfb':
      espnSport = 'football';
      espnLeague = 'college-football';
      break;
    case 'cbb':
      espnSport = 'basketball';
      espnLeague = 'mens-college-basketball';
      break;
    case 'mlb':
      espnSport = 'baseball';
      espnLeague = 'mlb';
      break;
    case 'nhl':
      espnSport = 'hockey';
      espnLeague = 'nhl';
      break;
    case 'epl':
      espnSport = 'soccer';
      espnLeague = 'eng.1';
      break;
    case 'mls':
      espnSport = 'soccer';
      espnLeague = 'usa.1';
      break;
    default:
      espnSport = 'basketball';
      espnLeague = 'nba';
      break;
  }
  return `https://a.espncdn.com/i/teamlogos/${espnSport}/${espnLeague}/500/${teamId}.png`;
}

export class EspnService {
  private cache: Map<string, { time: number; data: unknown }> = new Map();

  private async fetchWithCache<T>(url: string, ttlMs: number = 10000): Promise<T | null> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.time < ttlMs) {
      return cached.data as T;
    }

    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) return null;
      const data = await res.json();
      this.cache.set(url, { time: Date.now(), data });
      return data as T;
    } catch {
      return null;
    }
  }

  public getLeague(key: string): LeagueInfo {
    return LEAGUES.find((l) => l.key.toLowerCase() === key.toLowerCase()) || LEAGUES[1];
  }

  public parseTeam(leagueKey: string, raw: ESPNCompetitionCompetitor['team']): Team {
    const id = raw.id || raw.abbreviation?.toLowerCase() || '1';
    const fallbackLogo = getOfficialLogoUrl(leagueKey, id);
    const logo =
      (raw.logo && raw.logo.length > 5)
        ? raw.logo
        : (raw.logos && raw.logos[0]?.href)
          ? raw.logos[0].href
          : fallbackLogo;

    return {
      id: raw.id,
      league: leagueKey,
      name: raw.displayName || raw.name || 'Team',
      shortName: raw.name || raw.displayName,
      abbr: raw.abbreviation || (raw.name ? raw.name.slice(0, 3).toUpperCase() : 'TEA'),
      logo,
      color: raw.color ? `#${raw.color}` : undefined,
    };
  }


  public async fetchScoreboard(leagueKey: string, dateStr?: string): Promise<Game[]> {
    if (leagueKey === 'my_teams') {
      return this.fetchMyTeamsGames();
    }

    const league = this.getLeague(leagueKey);
    let url = `${BASE_URL}/${league.espnSport}/${league.espnLeague}/scoreboard`;
    if (dateStr) {
      url += `?dates=${dateStr}`;
    }

    const data = await this.fetchWithCache<{ events?: ESPNEvent[] }>(url, 8000);

    if (!data?.events || data.events.length === 0) {
      // Return realistic fallback for that league so the user always has games to test
      return SAMPLE_GAMES[leagueKey] || SAMPLE_GAMES['nba'] || [];
    }

    const games: Game[] = [];

    for (const ev of data.events) {
      const comp = ev.competitions?.[0];
      if (!comp || !comp.competitors || comp.competitors.length < 2) continue;

      let homeSide: GameSide | null = null;
      let awaySide: GameSide | null = null;

      for (const c of comp.competitors) {
        const team = this.parseTeam(leagueKey, c.team);
        const record = c.records?.[0]?.summary;
        const side: GameSide = {
          team,
          score: c.score,
          record,
          linescores: c.linescores,
        };
        if (c.homeAway === 'home') {
          homeSide = side;
        } else {
          awaySide = side;
        }
      }

      if (!homeSide || !awaySide) continue;

      const state = comp.status?.type?.state || 'pre';
      const isLive = state === 'in';
      const status = comp.status?.type?.shortDetail || comp.status?.type?.description;
      const clock = comp.status?.displayClock;

      let situation;
      if (comp.situation) {
        situation = {
          downDistance: comp.situation.downDistanceText,
          lastPlay: comp.situation.lastPlay?.text,
          possession: comp.situation.possession,
          balls: comp.situation.balls,
          strikes: comp.situation.strikes,
          outs: comp.situation.outs,
          batter: comp.situation.batter
            ? {
                id: 'batter-1',
                name: comp.situation.batter.athlete?.displayName || 'Batter',
                summary: comp.situation.batter.summary,
              }
            : undefined,
        };
      }

      let odds;
      if (comp.odds && comp.odds.length > 0) {
        odds = {
          spread: comp.odds[0].details,
          overUnder: comp.odds[0].overUnder ? `O/U ${comp.odds[0].overUnder}` : undefined,
          provider: comp.odds[0].provider?.name,
        };
      }

      let venue;
      if (comp.venue?.fullName) {
        venue = comp.venue.fullName;
        if (comp.venue.address?.city) {
          venue += `, ${comp.venue.address.city}`;
        }
      }

      let broadcast;
      if (comp.broadcasts && comp.broadcasts.length > 0 && comp.broadcasts[0].names) {
        broadcast = comp.broadcasts[0].names.join(', ');
      }

      const leaders = comp.leaders?.map((cat) => {
        const first = cat.leaders?.[0];
        return {
          category: cat.name,
          displayName: cat.displayName,
          athleteName: first?.athlete?.displayName || '',
          athleteHeadshot: first?.athlete?.headshot,
          teamAbbr: first?.team?.abbreviation || '',
          value: first?.displayValue || '',
        };
      }).filter((l) => l.athleteName);

      const parsedEventDate = new Date(ev.date).getTime();
      const gameObj: Game = {
        id: ev.id,
        league: leagueKey,
        date: Number.isFinite(parsedEventDate) ? parsedEventDate : Date.now(),
        state,
        live: isLive,
        status,
        clock,
        period: comp.status?.period,
        home: homeSide,
        away: awaySide,
        situation,
        odds,
        venue,
        broadcast,
        leaders,
      };

      gameObj.kalshi = kalshiService.resolveMarket(gameObj);
      games.push(gameObj);
    }


    return games.length > 0 ? games : (SAMPLE_GAMES[leagueKey] || []);
  }

  public async fetchMyTeamsGames(): Promise<Game[]> {
    const rawFavs = localStorage.getItem('foss_fav_teams');
    const favTeamIds: string[] = rawFavs ? JSON.parse(rawFavs) : ['bos-celtics', 'kc-chiefs', 'ny-yankees', 'ars-arsenal'];

    // Parallel fetch top leagues
    const results = await Promise.all([
      this.fetchScoreboard('nba'),
      this.fetchScoreboard('nfl'),
      this.fetchScoreboard('mlb'),
      this.fetchScoreboard('epl'),
    ]);

    const allGames = results.flat();
    const favGames = allGames.filter((g) =>
      favTeamIds.some(
        (fav) =>
          g.home.team.id === fav ||
          g.away.team.id === fav ||
          fav.toLowerCase().includes(g.home.team.abbr.toLowerCase()) ||
          fav.toLowerCase().includes(g.away.team.abbr.toLowerCase())
      )
    );

    return favGames.length > 0 ? favGames : allGames.slice(0, 4);
  }

  public async fetchNews(leagueKey?: string): Promise<NewsArticle[]> {
    const league = this.getLeague(leagueKey || 'nba');
    const url = `${BASE_URL}/${league.espnSport}/${league.espnLeague}/news`;

    const data = await this.fetchWithCache<{ articles?: Array<{ id: string; headline: string; description: string; links?: { web?: { href?: string } }; images?: Array<{ url: string }>; published: string }> }>(url, 30000);

    if (!data?.articles || data.articles.length === 0) {
      return SAMPLE_NEWS;
    }

    return data.articles.map((a, i) => {
      const parsedPub = new Date(a.published).getTime();
      return {
        id: a.id || `news-${i}`,
        title: a.headline,
        summary: a.description || '',
        link: a.links?.web?.href || 'https://espn.com',
        time: Number.isFinite(parsedPub) ? parsedPub : Date.now() - i * 600000,
        league: league.key,
        image: a.images?.[0]?.url,
        isBreaking: a.headline.toLowerCase().includes('trade') || a.headline.toLowerCase().includes('breaking') || a.headline.toLowerCase().includes('injury'),
      };
    });
  }

  public async fetchStandings(leagueKey: string): Promise<StandingsEntry[]> {
    return SAMPLE_STANDINGS[leagueKey] || SAMPLE_STANDINGS['nba'] || [];
  }
}

export const espn = new EspnService();
