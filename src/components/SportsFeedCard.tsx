import React from 'react';
import { motion } from 'framer-motion';

export type LeagueType = 'nba' | 'nfl' | 'mlb' | 'nhl';

export interface NewsCardProps {
  id: string;
  league: LeagueType;
  teamName?: string;
  teamGradient?: string;
  teamLogoBg?: string;
  timestamp: string;
  title: string;
  snippet: string;
  source: string;
  url?: string;
}

// 1. League-Specific Color Gradients & Field Background Assets
const LEAGUE_THEMES: Record<LeagueType, { name: string; gradient: string; borderColor: string; fieldWatermark: string; defaultTeam: string; defaultEmoji: string }> = {
  nba: {
    name: 'NBA',
    gradient: 'linear-gradient(135deg, rgba(29,66,138,0.22) 0%, rgba(15,23,42,0.9) 70%)',
    borderColor: 'rgba(29,66,138,0.4)',
    fieldWatermark: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.08'%3E%3Cpath d='M50,0 V100 M0,50 H100 M50,50 m -25,0 a 25,25 0 1,0 50,0 a 25,25 0 1,0 -50,0' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3C/svg%3E")`,
    defaultTeam: 'Boston Celtics',
    defaultEmoji: '🏀',
  },
  nfl: {
    name: 'NFL',
    gradient: 'linear-gradient(135deg, rgba(1,51,105,0.25) 0%, rgba(15,23,42,0.9) 70%)',
    borderColor: 'rgba(1,51,105,0.4)',
    fieldWatermark: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.08'%3E%3Cpath d='M0,20 H100 M0,40 H100 M0,60 H100 M0,80 H100 M50,0 V100' fill='none' stroke='%23ffffff' stroke-width='1.5' stroke-dasharray='4 2'/%3E%3C/svg%3E")`,
    defaultTeam: 'Kansas City Chiefs',
    defaultEmoji: '🏈',
  },
  mlb: {
    name: 'MLB',
    gradient: 'linear-gradient(135deg, rgba(4,30,66,0.25) 0%, rgba(15,23,42,0.9) 70%)',
    borderColor: 'rgba(4,30,66,0.4)',
    fieldWatermark: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.08'%3E%3Cpath d='M50,10 L90,50 L50,90 L10,50 Z' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Ccircle cx='50' cy='50' r='15' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
    defaultTeam: 'New York Yankees',
    defaultEmoji: '⚾',
  },
  nhl: {
    name: 'NHL',
    gradient: 'linear-gradient(135deg, rgba(207,69,32,0.22) 0%, rgba(15,23,42,0.9) 70%)',
    borderColor: 'rgba(207,69,32,0.4)',
    fieldWatermark: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' opacity='0.08'%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23ffffff' stroke-width='1.5'/%3E%3Cline x1='50' y1='0' x2='50' y2='100' stroke='%23ff3333' stroke-width='1.5'/%3E%3C/svg%3E")`,
    defaultTeam: 'Edmonton Oilers',
    defaultEmoji: '🏒',
  },
};

interface SportsFeedCardProps {
  item: NewsCardProps;
  onReadMore?: (url?: string) => void;
  onSelectTeam?: (teamName: string, league: LeagueType, gradient?: string) => void;
}

export const SportsFeedCard: React.FC<SportsFeedCardProps> = ({ item, onReadMore, onSelectTeam }) => {
  const theme = LEAGUE_THEMES[item.league] || LEAGUE_THEMES.nba;
  const teamName = item.teamName || theme.defaultTeam;

  // Extract up to 3-letter abbreviation
  const teamAbbr = teamName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative w-full max-w-xl mx-auto rounded-3xl p-5 mb-4 overflow-hidden shadow-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.01]"
      style={{
        background: item.teamGradient || theme.gradient,
        borderColor: theme.borderColor,
      }}
    >
      {/* League-Specific Playing Field Watermark Confined Strictly Inside the Card */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 bg-no-repeat bg-center bg-cover opacity-60"
        style={{ backgroundImage: theme.fieldWatermark }}
      />

      {/* Card Content Header with Clickable Team Home Hub Badge */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <button 
          onClick={() => onSelectTeam && onSelectTeam(teamName, item.league, item.teamGradient || theme.gradient)}
          className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 border border-white/20 hover:border-amber-400 transition group cursor-pointer shadow-md"
        >
          <span className="w-5 h-5 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-[10px] font-black text-black">
            {teamName.substring(0, 1)}
          </span>
          <span className="text-[10px] font-black uppercase tracking-wider text-white group-hover:text-amber-400 transition">
            {teamName} ↗
          </span>
        </button>

        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] font-mono">
          <span>🕒</span>
          <span>{item.timestamp}</span>
        </div>
      </div>

      {/* Headline & Snippet */}
      <div className="relative z-10 mb-4">
        <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mb-1.5 leading-snug">
          {item.title}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-300 font-medium line-clamp-2 leading-relaxed">
          {item.snippet}
        </p>
      </div>

      {/* Divider */}
      <div className="relative z-10 w-full h-[1px] bg-white/10 mb-3" />

      {/* Footer Info & Action Link */}
      <div className="relative z-10 flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-400">{item.source}</span>
        <button
          onClick={() => onReadMore && onReadMore(item.url)}
          className="font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors group cursor-pointer"
        >
          <span>Read full story</span>
          <span className="transform group-hover:translate-x-0.5 transition-transform">↗</span>
        </button>
      </div>
    </motion.div>
  );
};
