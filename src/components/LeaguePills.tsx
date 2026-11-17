import React from 'react';
import { LEAGUES } from '../services/mockData';
import { sounds } from '../services/sound';
import { Star } from 'lucide-react';

interface LeaguePillsProps {
  selectedKey: string;
  onSelect: (key: string) => void;
  liveCountByLeague?: Record<string, number>;
}

export const LeaguePills: React.FC<LeaguePillsProps> = ({
  selectedKey,
  onSelect,
  liveCountByLeague = {},
}) => {
  const totalLive = Object.values(liveCountByLeague).reduce((a, b) => a + b, 0);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-4 sm:px-6">
        {/* All Scores / League Feed Pill */}
        <button
          onClick={() => {
            sounds.playTabSwitch();
            sounds.playLeagueJingle('all');
            onSelect('all');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ${
            selectedKey === 'all'
              ? 'theme-pill-active shadow-lg font-bold'
              : 'theme-card theme-text-muted border theme-border hover:text-white'
          }`}
        >
          <span>All Leagues</span>
          {totalLive > 0 && (
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                selectedKey === 'all' ? 'bg-red-600 text-white' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {totalLive}
            </span>
          )}
        </button>

        {LEAGUES.map((league) => {
          const isSelected = selectedKey.toLowerCase() === league.key.toLowerCase();
          const isMyTeams = league.key === 'my_teams';
          const liveCount = liveCountByLeague[league.key] || 0;

          return (
            <button
              key={league.key}
              onClick={() => {
                sounds.playTabSwitch();
                sounds.playLeagueJingle(league.key);
                onSelect(league.key);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-tight transition-all active:scale-95 cursor-pointer whitespace-nowrap shrink-0 ${
                isSelected
                  ? 'theme-pill-active shadow-lg font-bold'
                  : 'theme-card theme-text-muted border theme-border hover:text-white'
              }`}
            >
              {isMyTeams && (
                <Star
                  className={`w-3.5 h-3.5 ${
                    isSelected ? 'fill-black text-black' : 'fill-amber-400/80 text-amber-400'
                  }`}
                />
              )}
              <span>{league.tab}</span>
              {liveCount > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-red-600 text-white' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {liveCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
