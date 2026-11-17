import React, { useState, useRef } from 'react';
import { Game } from '../types';

interface Props {
  game: Game;
  leagueId?: string; // e.g., 'nba', 'nfl', 'mlb', 'nhl', 'f1', 'epl'
  onClick: () => void;
}

export const GameCardView: React.FC<Props> = ({ game, leagueId, onClick }) => {
  const [showMiniCard, setShowMiniCard] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const awayColor = game.away.team.color || '#2C2C2E';
  const homeColor = game.home.team.color || '#1C1C1E';
  const rawAwayProb = game.away.winProbability ?? 50;
  const awayWinProb = Number.isFinite(rawAwayProb) ? Math.min(Math.max(Math.round(rawAwayProb), 0), 100) : 50;
  const gradientAngle = 135 + (awayWinProb - 50) * 0.3;
  const safeScore = (s: string | number | undefined) => {
    if (s === undefined || s === null) return '-';
    if (typeof s === 'number' && !Number.isFinite(s)) return '-';
    if (String(s) === 'NaN') return '-';
    return s;
  };
  const formattedTime = (() => {
    const d = new Date(game.date);
    return Number.isNaN(d.getTime()) ? 'TBD' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  })();

  // Helper to select the appropriate league background watermark icon/pattern
  const getLeagueWatermark = () => {
    const l = (leagueId || game.league || '').toLowerCase();
    switch (l) {
      case 'nba':
        return '🏀';
      case 'nfl':
        return '🏈';
      case 'mlb':
        return '⚾';
      case 'nhl':
        return '🏒';
      case 'f1':
        return '🏎️';
      case 'epl':
      case 'mls':
        return '⚽';
      default:
        return '🏆';
    }
  };

  // Press & Hold (Long Press) Handlers for Haptic Mini Card Preview
  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => {
      // Trigger device vibration haptic feedback if supported
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // Crisp haptic click
      }
      setShowMiniCard(true);
    }, 400); // 400ms hold threshold
  };

  const handleTouchEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  return (
    <>
      <div 
        onClick={onClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        className="relative min-w-[285px] max-w-[285px] rounded-2xl p-4 snap-start flex-shrink-0 cursor-pointer border border-white/15 shadow-[0_12px_36px_rgba(0,0,0,0.75)] backdrop-blur-2xl overflow-hidden active:scale-[0.98] transition-all ios-spring"
        style={{
          background: `linear-gradient(${gradientAngle}deg, ${awayColor}44 0%, #141416E6 50%, ${homeColor}44 100%)`,
        }}
      >
        {/* LEAGUE TEXTURE WATERMARK (Faint 3D Background Outline) */}
        <div className="absolute -right-4 -bottom-6 text-[110px] opacity-[0.06] select-none pointer-events-none transform rotate-12 filter blur-[1px]">
          {getLeagueWatermark()}
        </div>

        {/* Specular Liquid Glass Highlight & Rim Light */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.09] via-transparent to-black/50 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Card Header */}
        <div className="relative z-10 flex items-center justify-between mb-3.5 text-xs">
          {game.live || game.state === 'in' ? (
            <span className="bg-[#FF453A] text-white font-extrabold px-2 py-0.5 rounded-md text-[10px] tracking-wide shadow-sm animate-pulse">
              LIVE
            </span>
          ) : (
            <span className="text-zinc-400 font-medium">
              {formattedTime}
            </span>
          )}
          <span className="bg-white/10 text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-white/10">
            {game.broadcastDetails?.resolvedChannel || game.broadcasts?.[0]?.name || game.broadcast || 'National'}
          </span>
        </div>

        {/* Away Team Row */}
        <div className="relative z-10 flex items-center justify-between mb-2.5">
          <div className="flex items-center space-x-2.5 min-w-0">
            <img 
              src={game.away.team.logo} 
              alt="" 
              className="w-6 h-6 object-contain drop-shadow shrink-0" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
            <div className="min-w-0">
              <div className="text-white font-extrabold text-sm uppercase tracking-tight truncate">{game.away.team.name}</div>
              <div className="text-zinc-400 text-[11px] font-medium">{game.away.record}</div>
            </div>
          </div>
          <div className="text-white font-black text-xl tracking-tight score-font shrink-0 ml-2">{safeScore(game.away.score)}</div>
        </div>

        <div className="relative z-10 h-[1px] bg-white/10 my-2" />

        {/* Home Team Row */}
        <div className="relative z-10 flex items-center justify-between pt-0.5">
          <div className="flex items-center space-x-2.5 min-w-0">
            <img 
              src={game.home.team.logo} 
              alt="" 
              className="w-6 h-6 object-contain drop-shadow shrink-0" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }} 
            />
            <div className="min-w-0">
              <div className="text-white font-extrabold text-sm uppercase tracking-tight truncate">{game.home.team.name}</div>
              <div className="text-zinc-400 text-[11px] font-medium">{game.home.record}</div>
            </div>
          </div>
          <div className="text-white font-black text-xl tracking-tight score-font shrink-0 ml-2">{safeScore(game.home.score)}</div>
        </div>
      </div>

      {/* PRESS & HOLD HAPTIC MINI CARD POP-UP MODAL */}
      {showMiniCard && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            e.stopPropagation();
            setShowMiniCard(false);
          }}
        >
          <div 
            className="w-full max-w-xs bg-[#1C1C1EE6] border border-white/30 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)] transform animate-ios-open"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-3">
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block mb-0.5">Quick Peek Preview</span>
              <h3 className="text-white font-black text-base uppercase tracking-tight">{game.away.team.name} vs {game.home.team.name}</h3>
            </div>
            <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/10 mb-3 text-xs text-zinc-300">
              <div className="flex justify-between"><span>Venue</span><span className="font-semibold text-white">{game.venue || 'Stadium Arena'}</span></div>
              <div className="flex justify-between"><span>Win Probability</span><span className="font-semibold text-white">{awayWinProb}% Away</span></div>
              <div className="flex justify-between"><span>Broadcast</span><span className="font-semibold text-white">{game.broadcastDetails?.resolvedChannel || game.broadcasts?.[0]?.name || 'ESPN'}</span></div>
            </div>
            <button 
              onClick={() => { setShowMiniCard(false); onClick(); }}
              className="w-full py-2.5 rounded-xl bg-white text-black font-extrabold text-xs tracking-wide uppercase active:scale-95 transition cursor-pointer"
            >
              Open Full View
            </button>
          </div>
        </div>
      )}
    </>
  );
};
