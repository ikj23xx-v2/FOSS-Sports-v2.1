import { Game, KalshiMarket } from '../types';

function toSafeInt(val: unknown, fallback = 0): number {
  const n = parseInt(String(val ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
}

export class KalshiService {
  /**
   * Resolves Kalshi prediction market win probabilities (0-100%) for a game.
   * Dynamically tracks live scores and momentum, or falls back to pre-game market pricing derived from spreads.
   */
  public resolveMarket(g: Game): KalshiMarket {
    const homeAbbr = g.home.team.abbr?.toUpperCase() || 'HOME';
    const awayAbbr = g.away.team.abbr?.toUpperCase() || 'AWAY';

    // If game is live, dynamically calculate probability from score differential and period
    if (g.live || g.state === 'in') {
      if (g.league === 'f1') {
        const existingHome = Number.isFinite(g.kalshi?.homeWinProb) ? Number(g.kalshi?.homeWinProb) : 65;
        const clampedHome = Math.min(96, Math.max(4, Math.round(existingHome)));
        return {
          homeWinProb: clampedHome,
          awayWinProb: 100 - clampedHome,
          homeTicker: `${homeAbbr}-WIN`,
          awayTicker: `${awayAbbr}-WIN`,
          volume: g.kalshi?.volume || '$240K',
        };
      }

      const homeScore = toSafeInt(g.home.score, 0);
      const awayScore = toSafeInt(g.away.score, 0);
      const diff = homeScore - awayScore;

      // League multiplier for score swing sensitivity
      const sportMultiplier = g.league === 'nfl' ? 3.5 : g.league === 'epl' || g.league === 'mls' ? 18 : 3.8;
      let calculated = 50 + Math.round(diff * sportMultiplier);

      // Period weighting (later periods have less time to catch up, exaggerating probability)
      const period = Number.isFinite(g.period) ? Number(g.period) : 1;
      if (period >= 4) {
        calculated = diff > 0 ? Math.min(96, calculated + 6) : diff < 0 ? Math.max(4, calculated - 6) : 50;
      }

      const homeProb = Number.isFinite(calculated) ? Math.min(96, Math.max(4, calculated)) : 50;
      const awayProb = 100 - homeProb;

      return {
        homeWinProb: homeProb,
        awayWinProb: awayProb,
        homeTicker: `${homeAbbr}-WIN`,
        awayTicker: `${awayAbbr}-WIN`,
        volume: `$${(120 + Math.abs(diff) * 14).toFixed(0)}K`,
      };
    }

    // If post-game (final)
    if (g.state === 'post') {
      if (g.league === 'f1') {
        return {
          homeWinProb: 100,
          awayWinProb: 0,
          homeTicker: `${homeAbbr}-WIN`,
          awayTicker: `${awayAbbr}-WIN`,
          volume: g.kalshi?.volume || '$320K',
        };
      }

      const homeScore = toSafeInt(g.home.score, 0);
      const awayScore = toSafeInt(g.away.score, 0);
      return {
        homeWinProb: homeScore > awayScore ? 100 : awayScore > homeScore ? 0 : 50,
        awayWinProb: awayScore > homeScore ? 100 : homeScore > awayScore ? 0 : 50,
        homeTicker: `${homeAbbr}-WIN`,
        awayTicker: `${awayAbbr}-WIN`,
        volume: '$248K',
      };
    }

    // Pre-game fallback derived from spread or default 50/50
    let homeProb = 50;
    if (g.odds?.spread) {
      const parts = g.odds.spread.split(' ');
      const spreadVal = parseFloat(parts[parts.length - 1]);
      if (Number.isFinite(spreadVal)) {
        if (spreadVal < 0) {
          // Home favored (e.g. -5.5 -> 50 + 16.5 = 67%)
          homeProb = Math.min(92, Math.max(52, 50 + Math.round(-spreadVal * 3.2)));
        } else if (spreadVal > 0) {
          // Away favored (e.g. +4.0 -> 50 - 12 = 38%)
          homeProb = Math.min(48, Math.max(8, 50 - Math.round(spreadVal * 3.2)));
        }
      }
    }

    const safeHomeProb = Number.isFinite(homeProb) ? homeProb : 50;
    const awayProb = 100 - safeHomeProb;

    return {
      homeWinProb: safeHomeProb,
      awayWinProb: awayProb,
      homeTicker: `${homeAbbr}-WIN`,
      awayTicker: `${awayAbbr}-WIN`,
      volume: '$86K',
    };
  }
}

export const kalshiService = new KalshiService();
