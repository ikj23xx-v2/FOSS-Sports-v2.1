import React from 'react';
import { LeagueInfo } from '../types';

export interface LeagueHeroBannerProps {
  liveCount: number;
  matchupCount?: number;
  userMarket?: string | { cityName?: string };
  totalGames?: number;
  marketCity?: string;
  league?: LeagueInfo;
}

export const LeagueHeroBanner: React.FC<LeagueHeroBannerProps> = ({
  liveCount,
  matchupCount,
  userMarket,
  totalGames,
  marketCity,
  league,
}) => {
  const resolvedMatchupCount = matchupCount ?? totalGames ?? 12;
  const resolvedMarket =
    typeof userMarket === 'string'
      ? userMarket
      : userMarket?.cityName || marketCity || 'Boston';

  const isIndividualLeague = league && league.key !== 'all';
  const title = isIndividualLeague ? (league.name || league.short).toUpperCase() : 'LEAGUES';

  return (
    <div className="relative mx-3 sm:mx-4 my-3.5 overflow-hidden rounded-3xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.4)] transform-gpu transition-all select-none">
      
      {/* 1. Panoramic Stadium Arena Background (Option C Aesthetic) */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#06080E]">
        <img
          src="/assets/aistudio/Screenshot_2026-11-11_at_3.14.15_PM_aea6cd4e.png"
          alt="Panoramic Stadium Arena"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-110 opacity-75"
        />
        {/* Curved Visor Vignette and Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
      </div>

      {/* 2. Panoramic Curved Visor Glass Border with Neon Cyan/Blue (Left) & Ruby Red (Right) Highlights */}
      <div className="absolute inset-0 pointer-events-none rounded-3xl border border-white/20 shadow-[inset_3px_0_12px_rgba(56,189,248,0.5),inset_-3px_0_12px_rgba(244,63,94,0.5)]" />
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />

      {/* 3. Content Layer (Option C Styling) */}
      <div className="relative z-10 p-5 sm:p-7 flex flex-col justify-between min-h-[160px] sm:min-h-[190px]">
        {/* Top: Red Outlined LIVE Capsule Pill with Soft Halo Glow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-[10px] sm:text-[11px] font-black tracking-widest uppercase mb-2 shadow-[0_0_16px_rgba(239,68,68,0.45)] backdrop-blur-md self-start">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>{liveCount > 0 ? `${liveCount} GAMES LIVE NOW` : '5 GAMES LIVE NOW'}</span>
        </div>

        {/* Center: Bold Metallic 3D Chrome Italic Extruded Title */}
        <div className="my-auto">
          <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400">
              {title}
            </span>
          </h2>

          {/* Subtitle / Details */}
          <p className="text-zinc-300 text-xs sm:text-sm font-semibold tracking-wide leading-relaxed drop-shadow mt-2 max-w-lg">
            {resolvedMatchupCount} Scheduled Matchups Today · Live ESPN Clocks & Broadcasts · {resolvedMarket}
          </p>
        </div>
      </div>
    </div>
  );
};
