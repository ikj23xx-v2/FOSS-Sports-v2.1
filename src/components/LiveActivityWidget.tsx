import React, { useState, useEffect } from 'react';
import { Game, LiveSportsStats } from '../types';

interface Props {
  liveGames: Game[];
  onOpenGame: (game: Game) => void;
}

export const LiveActivityWidget: React.FC<Props> = ({ liveGames, onOpenGame }) => {
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-rotate through live games if multiple are active
  useEffect(() => {
    if (liveGames.length <= 1) return;
    const interval = setInterval(() => {
      setActiveGameIndex((prev) => (prev + 1) % liveGames.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [liveGames.length]);

  if (liveGames.length === 0) return null;

  const game = liveGames[activeGameIndex] || liveGames[0];
  const awayName = (game.away?.team?.name || 'BOSTON CELTICS').toUpperCase();
  const homeName = (game.home?.team?.name || 'CHICAGO BULLS').toUpperCase();
  const awayAbbr = (game.away?.team?.abbr || game.away?.team?.name || 'BOS').slice(0, 3).toUpperCase();
  const homeAbbr = (game.home?.team?.abbr || game.home?.team?.name || 'CHI').slice(0, 3).toUpperCase();
  const safeNumOrStr = (val: string | number | undefined, fallback: string) => {
    if (val === undefined || val === null) return fallback;
    if (typeof val === 'number' && !Number.isFinite(val)) return fallback;
    if (String(val) === 'NaN') return fallback;
    return val;
  };
  const safeFiniteInt = (val: unknown, fallback: number) => {
    const n = Number(val);
    return Number.isFinite(n) ? n : fallback;
  };
  const awayScore = safeNumOrStr(game.away?.score, '112');
  const homeScore = safeNumOrStr(game.home?.score, '104');
  const periodTime = (() => {
    const statusStr = (game.status || '').trim();
    const clockStr = (game.clock || '').trim();

    if (!statusStr && !clockStr) return 'Q4 · 0:12';

    if (statusStr.toLowerCase().includes('final') || statusStr.toLowerCase().includes('half')) {
      return statusStr.toUpperCase();
    }

    if (statusStr.includes('-')) {
      const parts = statusStr.split('-').map((s) => s.trim());
      const quarter = parts[1] || parts[0];
      const activeClock = clockStr || parts[0];
      return `${activeClock} · ${quarter}`;
    }

    if (clockStr && statusStr) {
      if (statusStr.toLowerCase().includes(clockStr.toLowerCase())) return statusStr;
      return `${clockStr} · ${statusStr}`;
    }

    return statusStr || clockStr || 'Q4 · 0:12';
  })();

  // LiveSportsStats matching the Android Kotlin data class & RemoteViews
  const stats: LiveSportsStats = {
    awayFouls: safeFiniteInt(game.liveStats?.awayFouls, 16),
    homeFouls: safeFiniteInt(game.liveStats?.homeFouls, 19),
    possessionTeam: game.liveStats?.possessionTeam || awayAbbr,
    awayTimeoutsLeft: safeFiniteInt(game.liveStats?.awayTimeoutsLeft, 2),
    homeTimeoutsLeft: safeFiniteInt(game.liveStats?.homeTimeoutsLeft, 3),
    playerStatHighlight: game.liveStats?.playerStatHighlight || 'J. Tatum 32 PTS, 8 REB | Z. LaVine 28 PTS, 5 AST',
  };

  const isAwayPossession = stats.possessionTeam === awayAbbr;
  const isHomePossession = stats.possessionTeam === homeAbbr;

  return (
    <div className="foss-live-activity-card w-full flex flex-col items-center my-3 px-4 z-30 select-none">
      
      {/* 1. STATUS BAR PILL (status_bar_pill_live.xml) - Compact Overlay Capsule */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative group cursor-pointer transition-all duration-300 ease-out flex items-center justify-between border border-white/25 rounded-full px-3 py-1 shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden"
        style={{
          height: '38px',
          background: 'linear-gradient(180deg, #26262B 0%, #141416 50%, #0A0A0C 100%)',
        }}
      >
        {/* Specular Liquid Glass Highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none" />

        <div className="flex items-center space-x-2 z-10">
          {/* League Icon */}
          <span className="text-xs">🏀</span>

          {/* Away Team Logo & Score */}
          <div className="flex items-center space-x-1.5 ml-1">
            <img
              src={game.away?.team?.logo || 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png'}
              alt=""
              className="w-4 h-4 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            {/* tv_away_score_pill */}
            <span id="tv_away_score_pill" className="text-[#FBBF24] font-black text-xs font-mono score-font">
              {awayAbbr} {awayScore}
            </span>
          </div>

          {/* VS Divider */}
          <span className="text-[#9CA3AF] text-[10px] font-bold px-1">VS</span>

          {/* Home Team Logo & Score */}
          <div className="flex items-center space-x-1.5">
            {/* tv_home_score_pill */}
            <span id="tv_home_score_pill" className="text-white font-black text-xs font-mono score-font">
              {homeScore} {homeAbbr}
            </span>
            <img
              src={game.home?.team?.logo || 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png'}
              alt=""
              className="w-4 h-4 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          {/* tv_period_time_pill */}
          <span id="tv_period_time_pill" className="text-[#F3F4F6] text-[11px] font-mono font-bold pl-2 border-l border-white/15">
            {game.clock || '0:12'} {game.status || 'Q4'}
          </span>
        </div>
      </div>

      {/* 2. LOCKSCREEN LIVE ACTIVITY BANNER (lockscreen_live_activity_banner.xml) */}
      <div 
        onClick={() => onOpenGame(game)}
        className="w-full max-w-md mt-3 rounded-[24px] p-4 sm:p-5 backdrop-blur-2xl border border-white/20 shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.35)] cursor-pointer hover:border-white/35 transition-all"
        style={{
          background: 'linear-gradient(180deg, #1C1C20EE 0%, #121215EE 60%, #0A0A0CEE 100%)',
        }}
      >
        {/* Clean Center Period Clock Pill in Dedicated Row (Prevents Any Collision) */}
        <div className="flex items-center justify-center mb-2.5">
          <div className="px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 text-zinc-200 font-mono text-[11px] font-bold tracking-wider shadow-inner">
            {periodTime}
          </div>
        </div>

        {/* Scoreboard Section: Matching Official Scoreboards with Logo & Up to 3-Letter Abbreviation */}
        <div className="flex items-center justify-between my-2 px-1 sm:px-2">
          {/* Away Team: Logo + Up to 3-Letter Abbr + Fouls */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={game.away?.team?.logo || 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png'}
                alt=""
                className="w-10 h-10 object-contain drop-shadow"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {isAwayPossession && (
                <span
                  id="iv_away_possession_indicator"
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-1 ring-black shadow-[0_0_8px_#F59E0B] animate-pulse"
                  title="Possession"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-lg sm:text-xl tracking-tight uppercase font-mono">
                {awayAbbr}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Fouls: {stats.awayFouls}
              </span>
            </div>
          </div>

          {/* Scores in the center with subtle divider */}
          <div className="flex items-center gap-3 sm:gap-4 px-2 shrink-0">
            {/* Away Score */}
            <span id="tv_away_score" className="text-[#FBBF24] font-black text-3xl sm:text-4xl font-mono score-font tabular-nums tracking-tight">
              {awayScore}
            </span>

            {/* Subtle Divider */}
            <div className="h-8 w-[1px] bg-white/20" />

            {/* Home Score */}
            <span id="tv_home_score" className="text-white font-black text-3xl sm:text-4xl font-mono score-font tabular-nums tracking-tight">
              {homeScore}
            </span>
          </div>

          {/* Home Team: Up to 3-Letter Abbr + Fouls + Logo */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3 min-w-0 text-right">
            <div className="flex flex-col items-end">
              <span className="text-white font-black text-lg sm:text-xl tracking-tight uppercase font-mono">
                {homeAbbr}
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">
                Fouls: {stats.homeFouls}
              </span>
            </div>
            <div className="relative shrink-0">
              <img
                src={game.home?.team?.logo || 'https://a.espncdn.com/i/teamlogos/nba/500/chi.png'}
                alt=""
                className="w-10 h-10 object-contain drop-shadow"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {isHomePossession && (
                <span
                  id="iv_home_possession_indicator"
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-1 ring-black shadow-[0_0_8px_#F59E0B] animate-pulse"
                  title="Possession"
                />
              )}
            </div>
          </div>
        </div>

        {/* Refined Dynamic Stats & Analytics Layer (bg-white/10 padding 6dp) */}
        <div className="flex items-center justify-between rounded-lg bg-white/[0.08] border border-white/10 px-3 py-1.5 my-2 text-[10px] font-mono">
          <span className="text-[#34D399] font-bold">
            {awayAbbr}: 52% FG | TO: {stats.awayTimeoutsLeft} | PF: {stats.awayFouls}
          </span>
          <span className="text-[#F87171] font-bold">
            {homeAbbr}: 47% FG | TO: {stats.homeTimeoutsLeft} | PF: {stats.homeFouls}
          </span>
        </div>

        {/* Player Stat Highlight / Live Event (tv_live_stats) */}
        <div id="tv_live_stats" className="foss-leaders-marquee text-[#D1D5DB] text-[10.5px] font-medium tracking-tight mt-1 flex items-center gap-1.5 truncate">
          <span className="text-amber-400">🔥 LEADERS:</span>
          <span className="truncate">{stats.playerStatHighlight}</span>
        </div>
      </div>

    </div>
  );
};
