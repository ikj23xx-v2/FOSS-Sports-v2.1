import React, { useState } from 'react';
import { GamePredictionModal } from './GamePredictionModal';
import { MatchAlertService } from '../services/MatchAlertService';
import { Game } from '../types';

interface LiveScoreData {
  away: number;
  home: number;
  period: string;
  foulCountAway: number;
  foulCountHome: number;
  possessionsAway: number;
  possessionsHome: number;
  probBOS: number; // Away team prob %
  probCHI: number; // Home team prob %
}

interface Props {
  game: Game;
  liveScore?: LiveScoreData;
  userPoints: number;
  onPredictionSubmitted: (gameId: string, pickedTeam: 'home' | 'away', pointsWagered: number) => void;
}

export const LiveScorecardWithMeter: React.FC<Props> = ({
  game,
  liveScore: liveScoreProp,
  userPoints,
  onPredictionSubmitted,
}) => {
  const [isPredictorOpen, setIsPredictorOpen] = useState(false);

  const parsedAway = parseInt(String(game.away?.score ?? ''), 10);
  const parsedHome = parseInt(String(game.home?.score ?? ''), 10);
  const awayScore: number | string = Number.isFinite(parsedAway)
    ? parsedAway
    : (game.away?.score ? String(game.away.score) : 0);
  const homeScore: number | string = Number.isFinite(parsedHome)
    ? parsedHome
    : (game.home?.score ? String(game.home.score) : 0);
  const periodDisplay = game.clock && game.status ? `${game.clock} ${game.status}` : 'Q4 0:12';
  const awayAbbr = (game.away?.team?.abbr || game.away?.team?.name || 'BOS').slice(0, 3).toUpperCase();
  const homeAbbr = (game.home?.team?.abbr || game.home?.team?.name || 'CHI').slice(0, 3).toUpperCase();

  const rawAwayProb = game.away?.winProbability ?? game.kalshi?.awayWinProb ?? 50;
  const safeAwayProb = Number.isFinite(rawAwayProb) ? Math.min(99, Math.max(1, Math.round(rawAwayProb))) : 50;

  const liveScore = liveScoreProp
    ? {
        ...liveScoreProp,
        away: Number.isNaN(liveScoreProp.away) ? 0 : liveScoreProp.away,
        home: Number.isNaN(liveScoreProp.home) ? 0 : liveScoreProp.home,
        foulCountAway: Number.isFinite(liveScoreProp.foulCountAway) ? liveScoreProp.foulCountAway : 0,
        foulCountHome: Number.isFinite(liveScoreProp.foulCountHome) ? liveScoreProp.foulCountHome : 0,
        probBOS: Number.isFinite(liveScoreProp.probBOS) ? liveScoreProp.probBOS : safeAwayProb,
        probCHI: Number.isFinite(liveScoreProp.probCHI) ? liveScoreProp.probCHI : 100 - safeAwayProb,
      }
    : {
        away: awayScore,
        home: homeScore,
        period: periodDisplay,
        foulCountAway: Number.isFinite(game.liveStats?.awayFouls) ? Number(game.liveStats?.awayFouls) : 16,
        foulCountHome: Number.isFinite(game.liveStats?.homeFouls) ? Number(game.liveStats?.homeFouls) : 19,
        possessionsAway: 54,
        possessionsHome: 51,
        probBOS: safeAwayProb,
        probCHI: 100 - safeAwayProb,
      };

  const awayProb = Number.isFinite(liveScore.probBOS) ? liveScore.probBOS : 50;
  const homeProb = Number.isFinite(liveScore.probCHI) ? liveScore.probCHI : 50;

  return (
    <div className="relative mx-4 my-3 overflow-hidden rounded-2xl bg-gradient-to-b from-[#1E1C22] via-[#121216] to-[#0A0A0C] border border-white/20 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white select-none">
      {/* Top Refraction Highlight Rim */}
      <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

      {/* 1. In-game Matchup Header */}
      <div className="flex justify-between items-center text-[10px] text-zinc-400 uppercase tracking-widest mb-3 font-mono">
        <span className="flex items-center gap-1.5 font-bold">
          <span className="text-sm">🏀</span>
          <span>Matchup</span>
        </span>
        <span className="text-zinc-300 font-bold font-mono">
          <span>{liveScore.period}</span>
        </span>
      </div>

      <div className="flex justify-between items-center mb-4 px-2">
        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <img 
            src={game.away.team.logo} 
            alt="" 
            className="w-10 h-10 object-contain drop-shadow mb-1"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="text-sm font-black text-white uppercase font-mono tracking-wider">
            {awayAbbr}
          </span>
          <span className="text-[9.5px] text-zinc-400 font-mono">Fouls: {liveScore.foulCountAway}</span>
        </div>

        {/* Spread out Scores with divider */}
        <div className="flex items-center gap-4 sm:gap-6 px-3 flex-shrink-0">
          <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono score-font tabular-nums tracking-tight">{liveScore.away}</span>
          <div className="h-6 w-[1px] bg-white/20" />
          <span className="text-3xl sm:text-4xl font-black text-white font-mono score-font tabular-nums tracking-tight">{liveScore.home}</span>
        </div>

        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 min-w-0">
          <img 
            src={game.home.team.logo} 
            alt="" 
            className="w-10 h-10 object-contain drop-shadow mb-1"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="text-sm font-black text-white uppercase font-mono tracking-wider">
            {homeAbbr}
          </span>
          <span className="text-[9.5px] text-zinc-400 font-mono">Fouls: {liveScore.foulCountHome}</span>
        </div>
      </div>

      {/* 2. Embedded "Clutch Meter" Button/Section (Tap to Prediction Popup) */}
      <button
        onClick={() => {
          MatchAlertService.triggerHaptic(game.league || 'nba', 'score');
          setIsPredictorOpen(true);
        }}
        className="foss-clutch-meter w-full relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left transition-all active:scale-[0.98] hover:bg-white/[0.06] group cursor-pointer shadow-inner"
        title="Tap to launch Matchup Predictor"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1 font-mono">
            ⚡ Clutch Meter
          </span>
          <span className="text-[8.5px] font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1 group-hover:text-white transition-colors">
            Tap to launch Predictor <span className="text-amber-400 font-bold">▲</span>
          </span>
        </div>

        {/* Dynamic Probability Wave Waveform */}
        <div className="relative h-12 w-full rounded-lg overflow-hidden bg-black/50 border border-white/10 flex items-center">
          {/* Away team (left, Green / Emerald) probability wave */}
          <div 
            className="h-full bg-gradient-to-r from-emerald-600/40 via-emerald-700/15 to-transparent transition-all duration-700" 
            style={{ width: `${awayProb}%` }}
          />
          {/* Home team (right, Red / Rose) probability wave */}
          <div 
            className="h-full bg-gradient-to-l from-red-600/35 via-red-700/15 to-transparent transition-all duration-700 absolute right-0 top-0" 
            style={{ width: `${homeProb}%` }}
          />

          {/* Golden Interactive Slider line representing active odds */}
          <div 
            className="absolute top-0 bottom-0 w-[3px] bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_0_12px_#f59e0b] transition-all duration-700 z-10" 
            style={{ left: `calc(${awayProb}% - 1.5px)` }}
          />

          {/* Percentage Indicator overlays */}
          <div className="absolute inset-x-3 flex justify-between items-center text-[10.5px] font-mono font-bold text-zinc-300 pointer-events-none drop-shadow z-20">
            <span className={awayProb > homeProb ? "text-emerald-400 font-black drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" : "text-zinc-300"}>
              {awayProb}% {awayAbbr}
            </span>
            <span className={homeProb > awayProb ? "text-red-400 font-black drop-shadow-[0_0_8px_rgba(248,113,113,0.4)]" : "text-zinc-300"}>
              {homeProb}% {homeAbbr}
            </span>
          </div>
        </div>
      </button>

      {/* 3. Render prediction mini-game modal popup as requested */}
      {isPredictorOpen && (
        <GamePredictionModal
          game={game}
          onClose={() => setIsPredictorOpen(false)}
          userPoints={userPoints}
          onMakePrediction={(gameId, pickedTeam, pointsWagered) => {
            onPredictionSubmitted(gameId, pickedTeam, pointsWagered);
          }}
        />
      )}
    </div>
  );
};
