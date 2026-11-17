import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { LeagueType } from './SportsFeedCard';

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
      status: 'LIVE 3RD 04:12',
      broadcast: 'ESPN, ESPN+',
      awayTeam: { name: 'Boston Bruins', record: '10-6-1', score: '4', gradient: 'linear-gradient(135deg, rgba(252,186,25,0.28) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Montreal Canadiens', record: '6-10-2', score: '2', gradient: 'linear-gradient(135deg, rgba(191,24,30,0.32) 0%, rgba(26,31,44,0.95) 70%)' },
      marketConsensus: 'Boston Bruins Implied',
      consensusPercentage: '84%',
    },
    {
      id: 'nhl-3',
      league: 'nhl',
      status: '9:30 PM ET',
      broadcast: 'Monumental Sports',
      awayTeam: { name: 'Washington Capitals', record: '11-5-1', score: '0', gradient: 'linear-gradient(135deg, rgba(200,16,46,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Carolina Hurricanes', record: '13-4-0', score: '0', gradient: 'linear-gradient(135deg, rgba(204,0,0,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      marketConsensus: 'Carolina Hurricanes Implied',
      consensusPercentage: '58%',
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
      marketConsensus: 'Cleveland Cavaliers Implied',
      consensusPercentage: '100%',
    },
    {
      id: 'nba-2',
      league: 'nba',
      status: 'LIVE Q3 4:15',
      broadcast: 'NBA League Pass',
      awayTeam: { name: 'Boston Celtics', record: '45-15', score: '88', gradient: 'linear-gradient(135deg, rgba(0,122,51,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Chicago Bulls', record: '29-31', score: '81', gradient: 'linear-gradient(135deg, rgba(206,17,65,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      marketConsensus: 'Boston Celtics Implied',
      consensusPercentage: '78%',
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
      marketConsensus: 'Carolina Panthers Implied',
      consensusPercentage: '88%',
    },
    {
      id: 'nfl-2',
      league: 'nfl',
      status: 'FINAL SCORE',
      broadcast: 'CBS',
      awayTeam: { name: 'Washington Commanders', record: '11-5', score: '31', gradient: 'linear-gradient(135deg, rgba(90,20,20,0.4) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Dallas Cowboys', record: '7-9', score: '20', gradient: 'linear-gradient(135deg, rgba(0,53,148,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      marketConsensus: 'Washington Commanders Implied',
      consensusPercentage: '100%',
    },
  ],
  mlb: [
    {
      id: 'mlb-1',
      league: 'mlb',
      status: 'FINAL SCORE',
      broadcast: 'MLB.TV • Out-of-Market',
      awayTeam: { name: 'Milwaukee Brewers', record: '103-59', score: '4', gradient: 'linear-gradient(135deg, rgba(20,40,90,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Tampa Bay Rays', record: '98-64', score: '1', gradient: 'linear-gradient(135deg, rgba(9,40,75,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      marketConsensus: 'Milwaukee Brewers Implied',
      consensusPercentage: '100%',
    },
    {
      id: 'mlb-2',
      league: 'mlb',
      status: 'FINAL SCORE',
      broadcast: 'MASN / MLB Network',
      awayTeam: { name: 'Cleveland Guardians', record: '96-66', score: '6', gradient: 'linear-gradient(135deg, rgba(227,25,55,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      homeTeam: { name: 'Baltimore Orioles', record: '91-71', score: '3', gradient: 'linear-gradient(135deg, rgba(223,70,1,0.35) 0%, rgba(26,31,44,0.95) 70%)' },
      marketConsensus: 'Cleveland Guardians Implied',
      consensusPercentage: '100%',
    },
  ],
};

const LEAGUE_THEMES: Record<LeagueType, { name: string; borderColor: string; fieldWatermark: string }> = {
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

const cardSlideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 280 : -280,
    opacity: 0,
    scale: 0.96,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 280 : -280,
    opacity: 0,
    scale: 0.96,
  }),
};

export const SwipableLeagueScoreboard: React.FC<{
  league: LeagueType;
  games: ScorecardProps[];
  onSelectTeam: (teamName: string, league: LeagueType, gradient: string) => void;
}> = ({ league, games, onSelectTeam }) => {
  const [[index, direction], setPage] = useState<[number, number]>([0, 0]);
  const isSwipingCardRef = useRef(false);
  const pointerStartXRef = useRef<number | null>(null);
  const theme = LEAGUE_THEMES[league] || LEAGUE_THEMES.nba;

  const paginate = (newDirection: number) => {
    const nextIndex = index + newDirection;
    if (nextIndex >= 0 && nextIndex < games.length) {
      setPage([nextIndex, newDirection]);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeDistanceThreshold = 35;
    const swipeVelocityThreshold = 250;

    if (
      (info.offset.x < -swipeDistanceThreshold || info.velocity.x < -swipeVelocityThreshold) &&
      index < games.length - 1
    ) {
      paginate(1);
    } else if (
      (info.offset.x > swipeDistanceThreshold || info.velocity.x > swipeVelocityThreshold) &&
      index > 0
    ) {
      paginate(-1);
    }

    setTimeout(() => {
      isSwipingCardRef.current = false;
    }, 80);
  };

  const activeGame = games[index] || games[0];
  if (!activeGame) return null;

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      {/* League Header + Top Segmented Progress Indicators + Quick Arrows */}
      <div className="flex justify-between items-center mb-2 px-3">
        <span className="text-[11px] font-black tracking-widest text-zinc-300 flex items-center gap-1.5 uppercase font-mono">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          {league.toUpperCase()} GAMES ({index + 1}/{games.length})
        </span>

        {games.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => paginate(-1)}
              disabled={index === 0}
              className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-300 disabled:opacity-25 hover:border-amber-400/50 cursor-pointer flex items-center justify-center transition"
              title="Previous Game"
            >
              ◀
            </button>
            <button
              onClick={() => paginate(1)}
              disabled={index === games.length - 1}
              className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-[10px] text-zinc-300 disabled:opacity-25 hover:border-amber-400/50 cursor-pointer flex items-center justify-center transition"
              title="Next Game"
            >
              ▶
            </button>
          </div>
        )}
      </div>

      {/* Viewport Wrapper for Animated Horizontal Swiping */}
      <div className="relative overflow-hidden rounded-3xl">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeGame.id}
            custom={direction}
            variants={cardSlideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            onPointerDown={(e) => {
              pointerStartXRef.current = e.clientX;
            }}
            onPointerMove={(e) => {
              if (pointerStartXRef.current !== null && Math.abs(e.clientX - pointerStartXRef.current) > 8) {
                isSwipingCardRef.current = true;
              }
            }}
            onPointerUp={() => {
              pointerStartXRef.current = null;
            }}
            onDragStart={() => {
              isSwipingCardRef.current = true;
            }}
            onDragEnd={handleDragEnd}
            className="relative bg-[#12141c] border border-white/10 rounded-3xl overflow-hidden shadow-xl p-4 sm:p-5 flex flex-col gap-3 touch-pan-y select-none cursor-grab active:cursor-grabbing hover:border-blue-500/40 transition-colors"
          >
            <div className="absolute inset-0 pointer-events-none z-0 bg-no-repeat bg-center bg-cover opacity-10" style={{ backgroundImage: theme.fieldWatermark }} />

            {/* Top Segmented Blue Bars inside Card */}
            {games.length > 1 && (
              <div className="relative z-10 flex gap-1.5 pb-1">
                {games.map((g, i) => (
                  <button
                    key={g.id}
                    onClick={() => setPage([i, i > index ? 1 : -1])}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 cursor-pointer ${
                      i === index
                        ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                        : 'bg-blue-500/25 hover:bg-blue-500/40'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Status / Broadcast Row */}
            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono">
              <span className="uppercase tracking-widest text-zinc-400 font-bold">{activeGame.status}</span>
              <span className="foss-broadcast-pill px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-medium">
                {activeGame.broadcast}
              </span>
            </div>

            {/* Away Team Row */}
            <div 
              onClick={() => {
                if (isSwipingCardRef.current) return;
                onSelectTeam(activeGame.awayTeam.name, league, activeGame.awayTeam.gradient);
              }}
              className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-[#181b24] hover:bg-[#1f222d] border border-white/5 hover:border-amber-400/50 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-md border border-white/10">
                  {activeGame.awayTeam.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white uppercase group-hover:text-amber-400 transition">{activeGame.awayTeam.name}</h3>
                  <span className="foss-team-record text-xs font-mono text-zinc-400">{activeGame.awayTeam.record}</span>
                </div>
              </div>
              <span className="text-2xl font-black text-white font-mono">{activeGame.awayTeam.score}</span>
            </div>

            {/* Home Team Row */}
            <div 
              onClick={() => {
                if (isSwipingCardRef.current) return;
                onSelectTeam(activeGame.homeTeam.name, league, activeGame.homeTeam.gradient);
              }}
              className="relative z-10 flex items-center justify-between p-3.5 rounded-2xl bg-[#181b24] hover:bg-[#1f222d] border border-white/5 hover:border-amber-400/50 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-black text-xs shadow-md border border-white/10">
                  {activeGame.homeTeam.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-white uppercase group-hover:text-amber-400 transition">{activeGame.homeTeam.name}</h3>
                  <span className="foss-team-record text-xs font-mono text-zinc-400">{activeGame.homeTeam.record}</span>
                </div>
              </div>
              <span className="text-2xl font-black text-white font-mono">{activeGame.homeTeam.score}</span>
            </div>

            {/* Clean Implied Consensus Bar */}
            {activeGame.marketConsensus && (
              <div className="foss-consensus-bar relative z-10 mt-1 p-3 rounded-2xl bg-[#181b24]/80 border border-white/5 flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                  <span>MARKET CONSENSUS</span>
                  <span>Aggregated Live</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-white">
                  <span>{activeGame.marketConsensus}</span>
                  <span className="font-mono text-amber-400">{activeGame.consensusPercentage}</span>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
