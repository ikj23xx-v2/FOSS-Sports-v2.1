import React, { useState } from 'react';
import { LeagueInfo } from '../types';
import { Layers } from 'lucide-react';

interface LeagueHeaderViewProps {
  league: LeagueInfo;
  liveCount: number;
  totalGames: number;
  themePreset: string;
  upperHeadings?: boolean;
  onOpenSettings: () => void;
  onOpenExport: () => void;
}

export const LeagueHeaderView: React.FC<LeagueHeaderViewProps> = ({
  league,
  liveCount,
  totalGames,
  themePreset,
  upperHeadings = true,
  onOpenSettings,
  onOpenExport,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  // Official League Emblem CDN mapping
  const emblemUrl = React.useMemo(() => {
    switch (league.key.toLowerCase()) {
      case 'nba':
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png';
      case 'nfl':
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nfl.png';
      case 'mlb':
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/mlb.png';
      case 'nhl':
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nhl.png';
      case 'epl':
        return imgFailed
          ? 'https://a.espncdn.com/i/leaguelogos/soccer/500/23.png'
          : 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/eng.1.png';
      case 'mls':
        return imgFailed
          ? 'https://a.espncdn.com/i/leaguelogos/soccer/500/19.png'
          : 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/usa.1.png';
      case 'cfb':
      case 'cbb':
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/ncaa/500/ncaa.png';
      case 'wnba':
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/wnba.png';
      case 'my_teams':
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png';
      default:
        return 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png';
    }
  }, [league.key, imgFailed]);

  // Clean brand name display (e.g. "NBA", "NFL", "Major League Baseball", "Premier League")
  const brandTitle = React.useMemo(() => {
    if (league.key === 'my_teams') return 'MY TEAMS';
    if (league.key === 'nba') return 'NBA';
    if (league.key === 'nfl') return 'NFL';
    if (league.key === 'mlb') return 'MLB';
    if (league.key === 'nhl') return 'NHL';
    if (league.key === 'epl') return 'PREMIER LEAGUE';
    if (league.key === 'mls') return 'MAJOR LEAGUE SOCCER';
    if (league.key === 'cfb') return 'NCAA FOOTBALL';
    if (league.key === 'cbb') return 'NCAA BASKETBALL';
    if (league.key === 'wnba') return 'WNBA';
    return league.short || league.name;
  }, [league]);

  return (
    <div className="flex items-center justify-between gap-4 pt-1 pb-3 border-b theme-border">
      {/* Left: Official League Emblem + Typography Column */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/[0.04] p-1.5 flex items-center justify-center shrink-0 border border-white/[0.08] shadow-sm">
          <img
            src={emblemUrl}
            alt={league.name}
            className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            onError={() => {
              if (!imgFailed) setImgFailed(true);
            }}
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white truncate">
              {upperHeadings ? brandTitle.toUpperCase() : brandTitle}
            </h1>
            {liveCount > 0 && (
              <span className="flex items-center gap-1 bg-[#FF453A] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm shadow-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {liveCount} LIVE
              </span>
            )}
          </div>
          <p className="text-xs theme-text-muted font-medium flex items-center gap-1.5 mt-0.5">
            <span>Scores & Schedule</span>
            <span className="theme-text-dim">·</span>
            <span className="theme-text-dim font-mono">
              {totalGames} Matchup{totalGames !== 1 ? 's' : ''} Today
            </span>
          </p>
        </div>
      </div>

      {/* Right: Theme pill & Android Project Files button */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 text-xs theme-text-muted hover:text-white px-2.5 py-1 rounded-full bg-white/[0.04] border theme-border transition-colors cursor-pointer"
        >
          <span>Theme: <strong className="capitalize text-white">{themePreset}</strong></span>
        </button>
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 text-xs theme-text-muted hover:text-white px-2.5 py-1 rounded-full bg-white/[0.04] border theme-border transition-colors cursor-pointer"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="sm:hidden">APK / Install</span>
          <span className="hidden sm:inline">Android Project Files</span>
        </button>
      </div>
    </div>
  );
};
