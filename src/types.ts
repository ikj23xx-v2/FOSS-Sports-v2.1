export type SportType = 'basketball' | 'football' | 'baseball' | 'hockey' | 'soccer' | 'racing';

export interface LeagueInfo {
  key: string;
  name: string;
  short: string;
  tab: string;
  sport: SportType;
  espnSport: string;
  espnLeague: string;
  color?: string;
  emblem?: string;
  fallbackEmblem?: string;
  seasonPhase?: string;
  logo?: string;
}

export type League = LeagueInfo;

export interface F1DriverResult {
  position: number;
  driverName: string;
  driverCode: string; // e.g. "VER", "NOR", "LEC", "HAM"
  constructorName: string; // e.g. "Red Bull", "McLaren", "Ferrari", "Mercedes"
  constructorColor?: string;
  timeOrGap?: string; // e.g. "LEADER", "+1.842s", "+5.120s"
  points?: number;
  tireCompound?: 'SOFT' | 'MEDIUM' | 'HARD' | 'INTER' | 'WET';
}

export interface F1RaceDetails {
  grandPrixName: string;
  circuitName: string;
  country: string;
  countryFlag: string;
  totalLaps: number;
  currentLap?: number;
  sessionType: string; // "Race Day", "Qualifying", "Practice 2", "Sprint"
  polePosition?: string;
  fastestLap?: string;
  podium?: F1DriverResult[];
}

export interface SportFeedbackRequest {
  id: string;
  sportName: string;
  timestamp: number;
  isPopularQuickVote?: boolean;
}


export interface Team {
  id: string;
  league: string;
  name: string;
  shortName?: string;
  abbr: string;
  logo: string;
  color?: string;
  alternateColor?: string;
}

export interface GameSide {
  team: Team;
  score?: string | number;
  record?: string;
  linescores?: Array<{ value: number }>;
  winProbability?: number; // 0 to 100
}

export interface Batter {
  id: string;
  name: string;
  summary?: string;
}

export interface Situation {
  downDistance?: string;
  lastPlay?: string;
  batter?: Batter;
  possession?: string; // team id with ball
  yardLine?: number;
  balls?: number;
  strikes?: number;
  outs?: number;
  onFirst?: boolean;
  onSecond?: boolean;
  onThird?: boolean;
}

export interface Odds {
  spread?: string;
  overUnder?: string;
  provider?: string;
}

export interface GameLeader {
  category: string;
  displayName: string;
  athleteName: string;
  athleteHeadshot?: string;
  teamAbbr: string;
  value: string;
}

export interface PlayByPlayItem {
  id: string;
  clock: string;
  period: number;
  text: string;
  scoringPlay?: boolean;
  scoreValue?: number;
  awayScore?: number;
  homeScore?: number;
  teamAbbr?: string;
}

export interface KalshiMarket {
  homeWinProb: number; // e.g. 68 for 68%
  awayWinProb: number; // e.g. 32 for 32%
  homeTicker: string;  // e.g. "BOS-WIN"
  awayTicker: string;  // e.g. "LAL-WIN"
  volume?: string;     // e.g. "$142K"
}

export interface LiveSportsStats {
  awayFouls: number;
  homeFouls: number;
  possessionTeam: string; // e.g. "BOS" or "CHI"
  awayTimeoutsLeft: number;
  homeTimeoutsLeft: number;
  playerStatHighlight: string; // e.g., "Tatum: 32 PTS, 8 AST" or "Vucevic: 22 PTS, 11 REB"
}

export interface Game {
  id: string;
  league: string;
  date: number; // timestamp ms
  formattedDate?: string;
  state: 'pre' | 'in' | 'post';
  live: boolean;
  status?: string; // e.g. "4th - 2:15", "Final", "7:00 PM EST"
  clock?: string;
  period?: number;
  home: GameSide;
  away: GameSide;
  situation?: Situation;
  odds?: Odds;
  venue?: string;
  broadcast?: string;
  broadcasts?: Array<{ name?: string }>;
  broadcastDetails?: BroadcastDetails;
  leaders?: GameLeader[];
  plays?: PlayByPlayItem[];
  kalshi?: KalshiMarket;
  f1Race?: F1RaceDetails;
  liveStats?: LiveSportsStats;
}

export interface BroadcastDetails {
  national?: string; // e.g. "ESPN", "TNT", "NBC", "CBS"
  homeRegional?: string; // e.g. "NBC Sports Boston"
  awayRegional?: string; // e.g. "Spectrum SportsNet"
  channelNumber?: string; // e.g. "Ch. 4 / HD 804"
  streaming?: string; // e.g. "NBA League Pass", "Peacock", "Paramount+"
  resolvedChannel?: string; // e.g. "NBC Sports Boston · Ch. 852" or "WBZ CBS 4"
  marketNote?: string; // e.g. "Local In-Market Broadcast" or "National Game" or "Out-of-Market"
}

export interface UserLocationMarket {
  marketId: string;
  cityName: string;
  stateCode: string;
  dmaName: string;
  isAutoDetected?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  link: string;
  time: number;
  league: string;
  image?: string;
  byline?: string;
  isBreaking?: boolean;
}

export interface StandingsEntry {
  team: Team;
  rank: number;
  wins: number;
  losses: number;
  ties?: number;
  winPct: string;
  gamesBack: string;
  streak: string;
  division?: string;
  conference?: string;
}

export type ThemePreset = 'oled' | 'midnight' | 'carbon' | 'stadium' | 'retro' | 'light' | 'team' | 'custom';
export type CardDensity = 'compact' | 'standard' | 'expanded';
export type RadiusStyle = 'sharp' | 'standard' | 'round';
export type SoundPackType = 'apple' | 'stadium' | 'arcade' | 'silent';
export type AppIconChoice = 'stadium' | 'cosmic' | 'minimal';

export interface CommunityThemeData {
  id: string;
  name: string;
  author: string;
  bg: string;
  card: string;
  cardBorder: string;
  accent: string;
  text: string;
  text2: string;
  cornerRadius: number;
  upvotes?: number;
  bannerStyle?: 'glass' | 'gradient' | 'flat';
}

export type HeaderBadgeStyle = 'trophy' | 'scoreboard' | 'dual_fs' | 'live_ring';

export interface AppCustomization {
  themePreset: ThemePreset;
  accentColor: string; // 'auto' | '#FFFFFF' | '#FF453A' | '#30D158' | '#0A84FF' | '#FF9F0A' | '#BF5AF2'
  cardDensity: CardDensity;
  radiusStyle: RadiusStyle;
  upperHeadings: boolean;
  hideScoresSpoiler: boolean;
  showOdds: boolean;
  showKalshi: boolean;
  showSituations: boolean;
  showTicker: boolean;
  tickerContextual: boolean;
  startPage: string;
  soundPack: SoundPackType;
  appIcon: AppIconChoice;
  cosmicWarpIntro: boolean;
  customTheme?: CommunityThemeData;
  marketProviders?: string[]; // e.g. ["Kalshi", "Polymarket", "DraftKings", "FanDuel"]
  showMarketConsensus?: boolean;
  headerBadgeStyle?: HeaderBadgeStyle;
  leagueJinglesEnabled?: boolean;
}

export interface UserProfile {
  uid: string;
  displayName: string;
  phoneNumber: string;
  email?: string;
  is2FAEnabled: boolean;
  avatarUrl?: string;
  createdAt: number;
  syncStatus?: 'synced' | 'syncing' | 'offline';
}



