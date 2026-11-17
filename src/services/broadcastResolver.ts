import { Game, BroadcastDetails, UserLocationMarket } from '../types';

export const POPULAR_TV_MARKETS: UserLocationMarket[] = [
  { marketId: 'boston', cityName: 'Boston', stateCode: 'MA', dmaName: 'Boston-Manchester (MA/NH)' },
  { marketId: 'new_york', cityName: 'New York', stateCode: 'NY', dmaName: 'New York Tri-State (NY/NJ/CT)' },
  { marketId: 'los_angeles', cityName: 'Los Angeles', stateCode: 'CA', dmaName: 'Greater Los Angeles (CA)' },
  { marketId: 'chicago', cityName: 'Chicago', stateCode: 'IL', dmaName: 'Chicago & Suburbs (IL/IN)' },
  { marketId: 'philadelphia', cityName: 'Philadelphia', stateCode: 'PA', dmaName: 'Philadelphia Metro (PA/NJ/DE)' },
  { marketId: 'dallas', cityName: 'Dallas-Fort Worth', stateCode: 'TX', dmaName: 'DFW Metroplex (TX)' },
  { marketId: 'san_francisco', cityName: 'San Francisco Bay Area', stateCode: 'CA', dmaName: 'SF-Oakland-San Jose (CA)' },
  { marketId: 'miami', cityName: 'Miami', stateCode: 'FL', dmaName: 'Miami-Fort Lauderdale (FL)' },
  { marketId: 'london', cityName: 'London', stateCode: 'UK', dmaName: 'United Kingdom (Sky/TNT/BBC)' },
  { marketId: 'national_us', cityName: 'United States', stateCode: 'US', dmaName: 'National US Out-of-Market' },
];

interface TeamBroadcastProfile {
  teamIdOrAbbr: string;
  homeMarketId: string;
  regionalNetwork: string;
  cableChannel: string;
  otaAffiliate?: string; // Over-the-air channel
  streaming: string;
}

const TEAM_BROADCAST_REGISTRY: Record<string, TeamBroadcastProfile> = {
  // NBA
  'BOS': { teamIdOrAbbr: 'BOS', homeMarketId: 'boston', regionalNetwork: 'NBC Sports Boston', cableChannel: 'Ch. 852 / Xfinity 773', streaming: 'NBC Sports App / League Pass' },
  'LAL': { teamIdOrAbbr: 'LAL', homeMarketId: 'los_angeles', regionalNetwork: 'Spectrum SportsNet', cableChannel: 'Ch. 785 / DirectTV 691', streaming: 'Spectrum SportsNet+ / League Pass' },
  'GSW': { teamIdOrAbbr: 'GSW', homeMarketId: 'san_francisco', regionalNetwork: 'NBC Sports Bay Area', cableChannel: 'Ch. 720 / Xfinity 40', streaming: 'NBC Sports App / League Pass' },
  'NYK': { teamIdOrAbbr: 'NYK', homeMarketId: 'new_york', regionalNetwork: 'MSG Network', cableChannel: 'Ch. 571 / Optimum 37', streaming: 'MSG+ / League Pass' },
  'BKN': { teamIdOrAbbr: 'BKN', homeMarketId: 'new_york', regionalNetwork: 'YES Network', cableChannel: 'Ch. 573 / Xfinity 844', streaming: 'YES App / League Pass' },
  'CHI': { teamIdOrAbbr: 'CHI', homeMarketId: 'chicago', regionalNetwork: 'Chicago Sports Net (CHSN)', cableChannel: 'Ch. 62.2 / DirectTV 665', streaming: 'CHSN App / League Pass' },
  'PHI': { teamIdOrAbbr: 'PHI', homeMarketId: 'philadelphia', regionalNetwork: 'NBC Sports Philadelphia', cableChannel: 'Ch. 847 / Xfinity 37', streaming: 'NBC Sports App / League Pass' },
  'DAL': { teamIdOrAbbr: 'DAL', homeMarketId: 'dallas', regionalNetwork: 'MavsTV / KFAA 29', cableChannel: 'Ch. 29 OTA / YouTube TV', streaming: 'MavsTV / League Pass' },
  'MIA': { teamIdOrAbbr: 'MIA', homeMarketId: 'miami', regionalNetwork: 'FanDuel Sports Sun', cableChannel: 'Ch. 653 / DirecTV 656', streaming: 'FanDuel Sports App / League Pass' },
  'MIL': { teamIdOrAbbr: 'MIL', homeMarketId: 'chicago', regionalNetwork: 'FanDuel Sports Wisconsin', cableChannel: 'Ch. 669', streaming: 'FanDuel Sports App / League Pass' },
  'DEN': { teamIdOrAbbr: 'DEN', homeMarketId: 'dallas', regionalNetwork: 'Altitude Sports', cableChannel: 'Ch. 681 DirecTV', streaming: 'Altitude+ / League Pass' },
  'PHX': { teamIdOrAbbr: 'PHX', homeMarketId: 'los_angeles', regionalNetwork: 'Arizona\'s Family Sports', cableChannel: 'Ch. 3.2 / 44 OTA', streaming: 'Suns Live / League Pass' },

  // NFL
  'KC': { teamIdOrAbbr: 'KC', homeMarketId: 'dallas', regionalNetwork: 'CBS 5 KCTV (Local Affiliate)', cableChannel: 'Ch. 5 CBS', streaming: 'Paramount+ / NFL Sunday Ticket' },
  'BUF': { teamIdOrAbbr: 'BUF', homeMarketId: 'new_york', regionalNetwork: 'CBS 4 WIVB (Local Affiliate)', cableChannel: 'Ch. 4 CBS', streaming: 'Paramount+ / NFL Sunday Ticket' },
  'NE': { teamIdOrAbbr: 'NE', homeMarketId: 'boston', regionalNetwork: 'WBZ CBS 4 / WFXT FOX 25', cableChannel: 'Ch. 4 WBZ / Ch. 25 FOX', streaming: 'Paramount+ / NFL Sunday Ticket' },
  'NYG': { teamIdOrAbbr: 'NYG', homeMarketId: 'new_york', regionalNetwork: 'WNYW FOX 5 / WCBS 2', cableChannel: 'Ch. 5 FOX / Ch. 2 CBS', streaming: 'NFL+ / YouTube Sunday Ticket' },
  'NYJ': { teamIdOrAbbr: 'NYJ', homeMarketId: 'new_york', regionalNetwork: 'WCBS 2 / WNYW FOX 5', cableChannel: 'Ch. 2 CBS / Ch. 5 FOX', streaming: 'Paramount+ / NFL+' },
  'DAL_NFL': { teamIdOrAbbr: 'DAL', homeMarketId: 'dallas', regionalNetwork: 'KDFW FOX 4 / KTVT CBS 11', cableChannel: 'Ch. 4 FOX / Ch. 11 CBS', streaming: 'NFL Sunday Ticket / Fox Sports' },
  'PHI_NFL': { teamIdOrAbbr: 'PHI', homeMarketId: 'philadelphia', regionalNetwork: 'WTXF FOX 29 / KYW CBS 3', cableChannel: 'Ch. 29 FOX / Ch. 3 CBS', streaming: 'Fox Sports / Paramount+' },

  // MLB
  'NYY': { teamIdOrAbbr: 'NYY', homeMarketId: 'new_york', regionalNetwork: 'YES Network', cableChannel: 'Ch. 573 / Xfinity 844', streaming: 'YES App / MLB.TV' },
  'BOS_MLB': { teamIdOrAbbr: 'BOS', homeMarketId: 'boston', regionalNetwork: 'NESN', cableChannel: 'Ch. 851 / Xfinity 51', streaming: 'NESN 360 / MLB.TV' },
  'LAD': { teamIdOrAbbr: 'LAD', homeMarketId: 'los_angeles', regionalNetwork: 'Spectrum SportsNet LA', cableChannel: 'Ch. 780 / Spectrum 68', streaming: 'MLB.TV' },

  // EPL / Soccer
  'ARS': { teamIdOrAbbr: 'ARS', homeMarketId: 'london', regionalNetwork: 'Sky Sports Premier League / TNT 1', cableChannel: 'Sky Ch. 401 / Virgin 501', streaming: 'Peacock (US) / NOW TV (UK)' },
  'MCI': { teamIdOrAbbr: 'MCI', homeMarketId: 'london', regionalNetwork: 'TNT Sports 1 / Sky Sports', cableChannel: 'TNT Ch. 410', streaming: 'Peacock (US) / Discovery+ (UK)' },
  'LIV': { teamIdOrAbbr: 'LIV', homeMarketId: 'london', regionalNetwork: 'Sky Sports Main Event', cableChannel: 'Sky Ch. 402', streaming: 'Peacock (US) / NOW TV (UK)' },
};

class BroadcastResolverService {
  private currentMarket: UserLocationMarket = POPULAR_TV_MARKETS[0]; // Default: Boston

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('foss_user_market');
      if (saved) {
        try {
          this.currentMarket = JSON.parse(saved);
        } catch {
          this.currentMarket = POPULAR_TV_MARKETS[0];
        }
      }
    }
  }

  public hasUserAssignedMarket(): boolean {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('foss_market_assigned') === 'true';
    }
    return false;
  }

  public getMarket(): UserLocationMarket {
    return this.currentMarket;
  }

  public setMarket(market: UserLocationMarket) {
    this.currentMarket = market;
    if (typeof window !== 'undefined') {
      localStorage.setItem('foss_user_market', JSON.stringify(market));
      localStorage.setItem('foss_market_assigned', 'true');
    }
  }

  /**
   * Attempts browser geolocation lookup and matches nearest major US TV market
   */
  public async detectLocation(): Promise<UserLocationMarket> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(this.currentMarket);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          // Simple geographical bounding boxes for top sports media markets
          let matched: UserLocationMarket = POPULAR_TV_MARKETS[0]; // fallback Boston

          if (lat >= 41.5 && lat <= 43.5 && lon >= -72.0 && lon <= -70.0) {
            matched = POPULAR_TV_MARKETS[0]; // Boston
          } else if (lat >= 40.4 && lat <= 41.3 && lon >= -74.5 && lon <= -73.0) {
            matched = POPULAR_TV_MARKETS[1]; // New York
          } else if (lat >= 33.5 && lat <= 34.6 && lon >= -118.8 && lon <= -117.5) {
            matched = POPULAR_TV_MARKETS[2]; // Los Angeles
          } else if (lat >= 41.5 && lat <= 42.5 && lon >= -88.3 && lon <= -87.3) {
            matched = POPULAR_TV_MARKETS[3]; // Chicago
          } else if (lat >= 39.7 && lat <= 40.2 && lon >= -75.4 && lon <= -74.8) {
            matched = POPULAR_TV_MARKETS[4]; // Philadelphia
          } else if (lat >= 32.5 && lat <= 33.2 && lon >= -97.5 && lon <= -96.5) {
            matched = POPULAR_TV_MARKETS[5]; // Dallas
          } else if (lat >= 37.2 && lat <= 38.2 && lon >= -122.6 && lon <= -121.8) {
            matched = POPULAR_TV_MARKETS[6]; // San Francisco Bay Area
          } else if (lat >= 25.5 && lat <= 26.3 && lon >= -80.5 && lon <= -80.0) {
            matched = POPULAR_TV_MARKETS[7]; // Miami
          } else if (lat >= 51.0 && lat <= 52.0 && lon >= -0.5 && lon <= 0.3) {
            matched = POPULAR_TV_MARKETS[8]; // London
          } else {
            matched = { ...POPULAR_TV_MARKETS[9], cityName: 'Local Market', dmaName: 'Detected Location' };
          }

          matched.isAutoDetected = true;
          this.setMarket(matched);
          resolve(matched);
        },
        () => {
          resolve(this.currentMarket);
        },
        { timeout: 4000 }
      );
    });
  }

  /**
   * Resolves exact channel for a specific game based on user location
   */
  public resolveChannel(game: Game, marketOverride?: UserLocationMarket): BroadcastDetails {
    const market = marketOverride || this.currentMarket;
    const homeAbbr = game.home.team.abbr.toUpperCase();
    const awayAbbr = game.away.team.abbr.toUpperCase();

    const homeProfile = TEAM_BROADCAST_REGISTRY[homeAbbr];
    const awayProfile = TEAM_BROADCAST_REGISTRY[awayAbbr];

    const isNational = Boolean(
      game.broadcast &&
      (game.broadcast.includes('ESPN') ||
       game.broadcast.includes('TNT') ||
       game.broadcast.includes('ABC') ||
       game.broadcast.includes('NBC') ||
       game.broadcast.includes('CBS') ||
       game.broadcast.includes('FOX') ||
       game.broadcast.includes('Prime Video'))
    );

    // 1. Is user in the Home team's media market?
    if (homeProfile && homeProfile.homeMarketId === market.marketId) {
      return {
        national: game.broadcast,
        homeRegional: homeProfile.regionalNetwork,
        channelNumber: homeProfile.cableChannel,
        streaming: homeProfile.streaming,
        resolvedChannel: `${homeProfile.regionalNetwork} (${homeProfile.cableChannel})`,
        marketNote: `In-Market Local Broadcast (${market.cityName})`,
      };
    }

    // 2. Is user in the Away team's media market?
    if (awayProfile && awayProfile.homeMarketId === market.marketId) {
      return {
        national: game.broadcast,
        awayRegional: awayProfile.regionalNetwork,
        channelNumber: awayProfile.cableChannel,
        streaming: awayProfile.streaming,
        resolvedChannel: `${awayProfile.regionalNetwork} (${awayProfile.cableChannel})`,
        marketNote: `In-Market Local Broadcast (${market.cityName})`,
      };
    }

    // 3. National broadcast
    if (isNational && game.broadcast) {
      return {
        national: game.broadcast,
        resolvedChannel: `${game.broadcast} (National)`,
        streaming: game.broadcast.includes('NBC') ? 'Peacock' : (game.broadcast.includes('CBS') ? 'Paramount+' : 'ESPN / Max / Fox Sports'),
        marketNote: 'National Broadcast (Available Everywhere)',
      };
    }

    // 4. UK / Premier League in London
    if (game.league === 'epl') {
      if (market.marketId === 'london') {
        return {
          national: 'Sky Sports / TNT Sports',
          resolvedChannel: 'Sky Sports Premier League (Ch. 401)',
          streaming: 'NOW TV / Discovery+',
          marketNote: 'UK Live Television Broadcast',
        };
      }
      return {
        national: game.broadcast || 'USA Network / Peacock',
        resolvedChannel: game.broadcast || 'USA Network / Peacock',
        streaming: 'Peacock Premium',
        marketNote: 'US Broadcast via NBC Sports',
      };
    }

    // 5. Out of Market: streaming package
    const sportPass = game.league === 'nba' ? 'NBA League Pass' : (game.league === 'nfl' ? 'NFL Sunday Ticket / YouTube' : 'MLB.TV');

    return {
      national: game.broadcast,
      streaming: sportPass,
      resolvedChannel: `${sportPass} · Out-of-Market (${market.cityName})`,
      marketNote: `Out-of-Market in ${market.cityName}`,
    };
  }
}

export const broadcastResolver = new BroadcastResolverService();
