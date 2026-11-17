import React, { useState } from 'react';
import { motion, PanInfo } from 'framer-motion';
import { sounds } from '../services/sound';

// --- TYPES & LEAGUE DATA ---
export type LeagueType = 'nba' | 'nfl' | 'mlb' | 'nhl';

export interface TeamScore {
  name: string;
  record: string;
  score: string;
  gradient: string;
}

export interface ScorecardProps {
  id: string;
  league: LeagueType;
  status: string;
  broadcast: string;
  homeTeam: TeamScore;
  awayTeam: TeamScore;
  marketConsensus?: string;
  consensusPercentage?: string;
}

export interface MarketPreset {
  id: string;
  name: string;
  timezone: string;
  abbrev: string;
}

export const MARKET_PRESETS: MarketPreset[] = [
  { id: 'dc', name: 'Washington D.C.', timezone: 'Eastern Time (ET)', abbrev: 'WDC' },
  { id: 'nyc', name: 'New York', timezone: 'Eastern Time (ET)', abbrev: 'NYC' },
  { id: 'bos', name: 'Boston', timezone: 'Eastern Time (ET)', abbrev: 'BOS' },
  { id: 'chi', name: 'Chicago', timezone: 'Central Time (CT)', abbrev: 'CHI' },
  { id: 'dal', name: 'Dallas', timezone: 'Central Time (CT)', abbrev: 'DAL' },
  { id: 'lax', name: 'Los Angeles', timezone: 'Pacific Time (PT)', abbrev: 'LAX' },
  { id: 'sfo', name: 'San Francisco', timezone: 'Pacific Time (PT)', abbrev: 'SFO' },
];

export const LEAGUE_THEMES: Record<LeagueType, { name: string; borderColor: string; fieldWatermark: string }> = {
  nba: {
    name: 'NBA',
    borderColor: 'rgba(29,66,138,0.4)',
    fieldWatermark: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.08'%3E%3Cpath d='M50,0 V100 M0,50 H100 M50,50' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
  },
  nfl: {
    name: 'NFL',
    borderColor: 'rgba(1,51,105,0.4)',
    fieldWatermark: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.08'%3E%3Cpath d='M0,20 H100 M0,40 H100 M0,60 H100' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
  },
  mlb: {
    name: 'MLB',
    borderColor: 'rgba(4,30,66,0.4)',
    fieldWatermark: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.08'%3E%3Cpath d='M50,10 L90,50 L50,90 Z' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
  },
  nhl: {
    name: 'NHL',
    borderColor: 'rgba(207,69,32,0.4)',
    fieldWatermark: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.08'%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
  },
};

// Grouped by league to allow horizontal swiping per league
export const LEAGUE_GAMES: Record<LeagueType, ScorecardProps[]> = {
  nhl: [
    {
      id: 'nhl-1',
      league: 'nhl',
      status: 'FINAL SCORE',
      broadcast: 'TNT, truTV (National)',
      awayTeam: { name: 'Tampa Bay Lightning', record: '12-4-2', score: '8', gradient: 'linear-gradient(135deg, rgba(0,94,184,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Buffalo Sabres', record: '8-7-3', score: '3', gradient: 'linear-gradient(135deg, rgba(0,47,108,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      marketConsensus: 'Tampa Bay Lightning Implied',
      consensusPercentage: '100%',
    },
    {
      id: 'nhl-2',
      league: 'nhl',
      status: '8:00 PM ET',
      broadcast: 'ESPN, ESPN+',
      awayTeam: { name: 'Boston Bruins', record: '10-6-1', score: '0', gradient: 'linear-gradient(135deg, rgba(252,186,25,0.2) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Montreal Canadiens', record: '6-10-2', score: '0', gradient: 'linear-gradient(135deg, rgba(191,24,30,0.2) 0%, rgba(26,31,44,0.95) 70%)' },
    },
  ],
  nba: [
    {
      id: 'nba-1',
      league: 'nba',
      status: 'FINAL SCORE',
      broadcast: 'ESPN',
      awayTeam: { name: 'New York Knicks', record: '39-21', score: '107', gradient: 'linear-gradient(135deg, rgba(245,130,32,0.3) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Cleveland Cavaliers', record: '42-18', score: '115', gradient: 'linear-gradient(135deg, rgba(111,26,42,0.4) 0%, rgba(26,31,44,0.95) 70%)' },
    },
  ],
  nfl: [
    {
      id: 'nfl-1',
      league: 'nfl',
      status: 'LIVE Q4 0:12',
      broadcast: 'FOX',
      awayTeam: { name: 'Atlanta Falcons', record: '8-8', score: '21', gradient: 'linear-gradient(135deg, rgba(167,25,48,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Carolina Panthers', record: '9-7', score: '24', gradient: 'linear-gradient(135deg, rgba(0,133,202,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
    },
  ],
  mlb: [
    {
      id: 'mlb-1',
      league: 'mlb',
      status: 'FINAL SCORE',
      broadcast: 'MLB.TV',
      awayTeam: { name: 'Tampa Bay Rays', record: '98-64', score: '1', gradient: 'linear-gradient(135deg, rgba(9,40,75,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Milwaukee Brewers', record: '103-59', score: '4', gradient: 'linear-gradient(135deg, rgba(20,40,90,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
    },
  ],
};

export const SAMPLE_SCOREBOARDS: ScorecardProps[] = [
  ...LEAGUE_GAMES.nhl,
  ...LEAGUE_GAMES.nba,
  ...LEAGUE_GAMES.nfl,
  ...LEAGUE_GAMES.mlb,
];

// Official 2-to-3 letter broadcast scorebug abbreviations
export function getScoreboardAbbr(name: string): string {
  const n = name.toLowerCase().trim();
  if (n.includes('knicks')) return 'NYK';
  if (n.includes('cavaliers') || n.includes('cavs')) return 'CLE';
  if (n.includes('celtics')) return 'BOS';
  if (n.includes('bulls')) return 'CHI';
  if (n.includes('magic') || n.includes('orlando')) return 'ORL';
  if (n.includes('jazz') || n.includes('utah')) return 'UTA';
  if (n.includes('lakers')) return 'LAL';
  if (n.includes('warriors')) return 'GSW';
  if (n.includes('lightning')) return 'TB';
  if (n.includes('sabres')) return 'BUF';
  if (n.includes('bruins')) return 'BOS';
  if (n.includes('canadiens') || n.includes('habs')) return 'MTL';
  if (n.includes('falcons')) return 'ATL';
  if (n.includes('panthers')) return 'CAR';
  if (n.includes('rays')) return 'TB';
  if (n.includes('brewers')) return 'MIL';
  if (n.includes('norris')) return 'NOR';
  if (n.includes('verstappen')) return 'VER';

  const parts = name.trim().split(/\s+/);
  if (parts.length > 1) {
    const last = parts[parts.length - 1];
    return last.slice(0, 3).toUpperCase();
  }
  return name.slice(0, 3).toUpperCase();
}

// ESPN official transparent high-res PNG team logos
export function getScoreboardLogo(name: string, league: LeagueType): string {
  const n = name.toLowerCase();
  if (n.includes('knicks')) return 'https://a.espncdn.com/i/teamlogos/nba/500/nyk.png';
  if (n.includes('cavaliers') || n.includes('cavs')) return 'https://a.espncdn.com/i/teamlogos/nba/500/cle.png';
  if (n.includes('celtics')) return 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png';
  if (n.includes('bulls')) return 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png';
  if (n.includes('magic') || n.includes('orlando')) return 'https://a.espncdn.com/i/teamlogos/nba/500/orl.png';
  if (n.includes('jazz') || n.includes('utah')) return 'https://a.espncdn.com/i/teamlogos/nba/500/uta.png';
  if (n.includes('lightning')) return 'https://a.espncdn.com/i/teamlogos/nhl/500/tb.png';
  if (n.includes('sabres')) return 'https://a.espncdn.com/i/teamlogos/nhl/500/buf.png';
  if (n.includes('bruins')) return 'https://a.espncdn.com/i/teamlogos/nhl/500/bos.png';
  if (n.includes('canadiens')) return 'https://a.espncdn.com/i/teamlogos/nhl/500/mtl.png';
  if (n.includes('falcons')) return 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png';
  if (n.includes('panthers')) return 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png';
  if (n.includes('rays')) return 'https://a.espncdn.com/i/teamlogos/mlb/500/tb.png';
  if (n.includes('brewers')) return 'https://a.espncdn.com/i/teamlogos/mlb/500/mil.png';

  return `https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/${league}.png`;
}

// --- APP ICON COMPONENT ---
export const FossSportsAppIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions =
    size === 'sm' ? 'w-12 h-12 rounded-xl' : size === 'lg' ? 'w-32 h-32 rounded-3xl' : 'w-20 h-20 rounded-2xl';

  return (
    <div
      className={`relative overflow-hidden bg-[#090a0f] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex flex-col items-center justify-between p-2 select-none group ${dimensions}`}
    >
      <div className="absolute inset-0 bg-radial from-slate-800/60 via-[#090a0f] to-black z-0" />
      <div className="absolute top-1 left-2 w-3 h-1 bg-blue-400 blur-[2px] rounded-full opacity-90 animate-pulse" />
      <div className="absolute top-1 right-2 w-3 h-1 bg-red-500 blur-[2px] rounded-full opacity-90" />

      <div className="relative z-10 flex justify-between w-full px-1 pt-0.5 animate-pulse">
        <div className="flex gap-[2px]">
          <div className="w-1 h-1 bg-white rounded-full shadow" />
          <div className="w-1 h-1 bg-white rounded-full shadow" />
        </div>
        <div className="flex gap-[2px]">
          <div className="w-1 h-1 bg-white rounded-full shadow" />
          <div className="w-1 h-1 bg-white rounded-full shadow" />
        </div>
      </div>

      <div className="relative z-10 text-center my-auto">
        <h3 className="font-black italic uppercase tracking-tighter text-white drop-shadow leading-none text-xs sm:text-base">
          FOSS
        </h3>
        <h3 className="font-black italic uppercase tracking-tighter text-zinc-200 drop-shadow leading-none text-xs sm:text-base">
          SPORTS
        </h3>
      </div>

      <div className="relative z-10 w-4/5 h-2.5 bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-700 rounded-full border border-white/30 shadow mb-1 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-white rounded-full shadow" />
      </div>
    </div>
  );
};

// --- SINGLE SCORECARD ITEM ---
export const ScorecardItem: React.FC<{
  item: ScorecardProps;
  isLeaguePage?: boolean;
  onSelectTeam: (teamName: string, league: LeagueType, gradient: string) => void;
}> = ({ item, isLeaguePage = false, onSelectTeam }) => {
  const theme = LEAGUE_THEMES[item.league] || LEAGUE_THEMES.nba;
  const awayAbbr = getScoreboardAbbr(item.awayTeam.name);
  const homeAbbr = getScoreboardAbbr(item.homeTeam.name);
  const awayLogo = getScoreboardLogo(item.awayTeam.name, item.league);
  const homeLogo = getScoreboardLogo(item.homeTeam.name, item.league);

  return (
    <div
      className="w-full max-w-xl mx-auto mb-4 bg-[#12141c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-3 sm:p-4 flex flex-col gap-2 transition-all hover:border-white/20 select-none relative"
      style={{ backgroundImage: theme.fieldWatermark, backgroundPosition: 'right center', backgroundRepeat: 'no-repeat' }}
    >
      {/* Header status & Broadcast */}
      <div className="flex justify-between items-center px-2 pt-1 border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 font-black">
            {item.status}
          </span>
          {item.broadcast && (
            <span className="text-[9px] font-mono text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-bold">
              📺 {item.broadcast}
            </span>
          )}
        </div>
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black">
          {theme.name}
        </span>
      </div>

      {/* Away Team Row: Uses official logo and up to 3 letters on scoreboards, full name on league page */}
      <div
        onClick={() => {
          sounds.playTap();
          onSelectTeam(item.awayTeam.name, item.league, item.awayTeam.gradient);
        }}
        className="flex items-center justify-between p-3 rounded-2xl bg-[#181b24] hover:border-amber-400/60 border border-white/5 transition cursor-pointer group shadow-md"
        style={{ background: item.awayTeam.gradient }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 shrink-0 shadow">
            <img
              src={awayLogo}
              alt={item.awayTeam.name}
              className="w-8 h-8 object-contain drop-shadow"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            {isLeaguePage ? (
              <>
                <h3 className="font-black text-sm sm:text-base text-white group-hover:text-amber-300 transition truncate">
                  {item.awayTeam.name}
                </h3>
                <span className="text-[11px] font-mono text-zinc-400">{item.awayTeam.record}</span>
              </>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-black text-lg sm:text-xl text-white group-hover:text-amber-300 font-mono tracking-tight">
                  {awayAbbr}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">{item.awayTeam.record}</span>
              </div>
            )}
          </div>
        </div>
        <span className="text-2xl sm:text-3xl font-black text-white font-mono score-font tabular-nums shrink-0 pl-3">
          {item.awayTeam.score}
        </span>
      </div>

      {/* Home Team Row: Uses official logo and up to 3 letters on scoreboards, full name on league page */}
      <div
        onClick={() => {
          sounds.playTap();
          onSelectTeam(item.homeTeam.name, item.league, item.homeTeam.gradient);
        }}
        className="flex items-center justify-between p-3 rounded-2xl bg-[#181b24] hover:border-amber-400/60 border border-white/5 transition cursor-pointer group shadow-md"
        style={{ background: item.homeTeam.gradient }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1 shrink-0 shadow">
            <img
              src={homeLogo}
              alt={item.homeTeam.name}
              className="w-8 h-8 object-contain drop-shadow"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="min-w-0">
            {isLeaguePage ? (
              <>
                <h3 className="font-black text-sm sm:text-base text-white group-hover:text-amber-300 transition truncate">
                  {item.homeTeam.name}
                </h3>
                <span className="text-[11px] font-mono text-zinc-400">{item.homeTeam.record}</span>
              </>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-black text-lg sm:text-xl text-white group-hover:text-amber-300 font-mono tracking-tight">
                  {homeAbbr}
                </span>
                <span className="text-[11px] font-mono text-zinc-400">{item.homeTeam.record}</span>
              </div>
            )}
          </div>
        </div>
        <span className="text-2xl sm:text-3xl font-black text-white font-mono score-font tabular-nums shrink-0 pl-3">
          {item.homeTeam.score}
        </span>
      </div>

      {/* Market Consensus & Probabilities If Available */}
      {item.marketConsensus && (
        <div className="mt-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[10px] font-mono">
          <span className="text-zinc-400 flex items-center gap-1.5 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="truncate">{item.marketConsensus}</span>
          </span>
          <span className="font-black text-amber-400 shrink-0 pl-2">
            {item.consensusPercentage || '100%'}
          </span>
        </div>
      )}
    </div>
  );
};

// --- SWIPABLE SCORECARD CAROUSEL PER LEAGUE ---
export const SwipableLeagueScoreboard: React.FC<{
  league: LeagueType;
  games: ScorecardProps[];
  isLeaguePage?: boolean;
  onSelectTeam: (teamName: string, league: LeagueType, gradient: string) => void;
}> = ({ league, games, isLeaguePage = false, onSelectTeam }) => {
  const [index, setIndex] = useState(0);
  const theme = LEAGUE_THEMES[league];

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold && index < games.length - 1) {
      sounds.playTabSwitch();
      setIndex((prev) => prev + 1);
    } else if (info.offset.x > swipeThreshold && index > 0) {
      sounds.playTabSwitch();
      setIndex((prev) => prev - 1);
    }
  };

  const activeGame = games[index] || games[0];
  if (!activeGame) return null;

  const awayAbbr = getScoreboardAbbr(activeGame.awayTeam.name);
  const homeAbbr = getScoreboardAbbr(activeGame.homeTeam.name);
  const awayLogo = getScoreboardLogo(activeGame.awayTeam.name, league);
  const homeLogo = getScoreboardLogo(activeGame.homeTeam.name, league);

  return (
    <div className="w-full max-w-xl mx-auto mb-5 select-none">
      {/* Swipe Title & segmented navigation indicators */}
      <div className="flex justify-between items-center mb-2 px-3">
        <span className="text-[11px] font-black tracking-widest text-zinc-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          {league.toUpperCase()} SCOREBOARD
        </span>
        {games.length > 1 && (
          <div className="flex gap-1.5 items-center">
            {games.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  sounds.playTap();
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === index ? 'w-6 bg-amber-400' : 'w-2 bg-zinc-600 hover:bg-zinc-500'
                }`}
                title={`Matchup ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Swipe Interactive Area */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        className="relative bg-[#12141c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col gap-3 cursor-grab active:cursor-grabbing hover:border-blue-500/40 transition-colors"
      >
        <div
          className="absolute inset-0 pointer-events-none z-0 bg-no-repeat bg-center bg-cover opacity-10"
          style={{ backgroundImage: theme.fieldWatermark }}
        />

        {/* Status / Broadcast row */}
        <div className="relative z-10 flex justify-between items-center text-[10px] font-mono">
          <span className="uppercase tracking-widest text-zinc-400 font-bold">{activeGame.status}</span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-zinc-300 font-medium flex items-center gap-1">
            📡 {activeGame.broadcast}
          </span>
        </div>

        {/* Away Team Row: Uses official logo and up to 3 letters on scoreboards, full name on league page */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            sounds.playTap();
            onSelectTeam(activeGame.awayTeam.name, league, activeGame.awayTeam.gradient);
          }}
          className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-[#181b24] hover:bg-[#1f222d] border border-transparent hover:border-amber-400/40 transition-all cursor-pointer group shadow-sm"
          style={{ background: activeGame.awayTeam.gradient }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-md">
              <img
                src={awayLogo}
                alt={activeGame.awayTeam.name}
                className="w-8 h-8 object-contain drop-shadow"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0">
              {isLeaguePage ? (
                <>
                  <h3 className="font-black text-sm sm:text-base text-white group-hover:text-amber-400 transition truncate">
                    {activeGame.awayTeam.name}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">{activeGame.awayTeam.record}</span>
                </>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="font-black text-lg sm:text-xl text-white group-hover:text-amber-400 font-mono tracking-tight">
                    {awayAbbr}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{activeGame.awayTeam.record}</span>
                </div>
              )}
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono score-font tabular-nums shrink-0 pl-3">
            {activeGame.awayTeam.score}
          </span>
        </div>

        {/* Home Team Row: Uses official logo and up to 3 letters on scoreboards, full name on league page */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            sounds.playTap();
            onSelectTeam(activeGame.homeTeam.name, league, activeGame.homeTeam.gradient);
          }}
          className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-[#181b24] hover:bg-[#1f222d] border border-transparent hover:border-amber-400/40 transition-all cursor-pointer group shadow-sm"
          style={{ background: activeGame.homeTeam.gradient }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center p-1.5 shrink-0 shadow-md">
              <img
                src={homeLogo}
                alt={activeGame.homeTeam.name}
                className="w-8 h-8 object-contain drop-shadow"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0">
              {isLeaguePage ? (
                <>
                  <h3 className="font-black text-sm sm:text-base text-white group-hover:text-amber-400 transition truncate">
                    {activeGame.homeTeam.name}
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">{activeGame.homeTeam.record}</span>
                </>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="font-black text-lg sm:text-xl text-white group-hover:text-amber-400 font-mono tracking-tight">
                    {homeAbbr}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{activeGame.homeTeam.record}</span>
                </div>
              )}
            </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white font-mono score-font tabular-nums shrink-0 pl-3">
            {activeGame.homeTeam.score}
          </span>
        </div>

        {/* Consensus overlay if available */}
        {activeGame.marketConsensus && (
          <div className="relative z-10 mt-1 pt-2.5 border-t border-white/10 flex justify-between items-center text-[11px] font-mono">
            <span className="text-zinc-400 flex items-center gap-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="truncate">{activeGame.marketConsensus}</span>
            </span>
            <span className="text-amber-400 font-bold shrink-0 pl-2">
              {activeGame.consensusPercentage || '100%'}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  );
};
