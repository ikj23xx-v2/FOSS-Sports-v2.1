import React, { useState, useEffect } from 'react';
import { sounds } from '../services/sound';
import { MatchAlertService } from '../services/MatchAlertService';

interface PlayerDraftCard {
  id: string;
  name: string;
  team: string;
  position: string;
  projectedPoints: number;
  image: string;
  isFoil: boolean;
  multiplier: number;
}

interface Props {
  onClose?: () => void;
  onOpenPack?: () => void;
}

export const WeeklyDraftRoom: React.FC<Props> = ({ onClose, onOpenPack }) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [pickNumber, setPickNumber] = useState(4); // User's position in this snake draft
  const [timer, setTimer] = useState(45); // Standard 45 seconds to pick
  const [draftedSquad, setDraftedSquad] = useState<PlayerDraftCard[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'G' | 'F' | 'C'>('ALL');

  // Mock Available Draft Pool
  const [availablePlayers, setAvailablePlayers] = useState<PlayerDraftCard[]>([
    { id: 'tatum', name: 'Jayson Tatum', team: 'BOS', position: 'F', projectedPoints: 24.5, image: '🍀', isFoil: true, multiplier: 1.5 },
    { id: 'lavine', name: 'Zach LaVine', team: 'CHI', position: 'G', projectedPoints: 19.8, image: '🐂', isFoil: false, multiplier: 1.0 },
    { id: 'giannis', name: 'Giannis Antetokounmpo', team: 'MIL', position: 'F', projectedPoints: 28.1, image: '🦌', isFoil: true, multiplier: 1.2 },
    { id: 'haliburton', name: 'Tyrese Haliburton', team: 'IND', position: 'G', projectedPoints: 22.3, image: '🐎', isFoil: false, multiplier: 1.0 },
    { id: 'jokic', name: 'Nikola Jokić', team: 'DEN', position: 'C', projectedPoints: 29.4, image: '🃏', isFoil: true, multiplier: 1.4 },
    { id: 'curry', name: 'Stephen Curry', team: 'GSW', position: 'G', projectedPoints: 25.2, image: '🌉', isFoil: true, multiplier: 1.3 },
    { id: 'edwards', name: 'Anthony Edwards', team: 'MIN', position: 'G', projectedPoints: 23.7, image: '🐺', isFoil: false, multiplier: 1.0 },
    { id: 'embiid', name: 'Joel Embiid', team: 'PHI', position: 'C', projectedPoints: 27.6, image: '🔔', isFoil: false, multiplier: 1.0 },
  ]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handlePick = (player: PlayerDraftCard) => {
    sounds.playScore();
    MatchAlertService.triggerHaptic('nba', 'win');

    setDraftedSquad((prev) => [...prev, player]);
    setAvailablePlayers((prev) => prev.filter((p) => p.id !== player.id));

    // Advance round & pick in snake order
    if (draftedSquad.length + 1 < 5) {
      setPickNumber((prev) => prev + 1);
      setCurrentRound((prev) => Math.floor((draftedSquad.length + 1) / 2) + 1);
      setTimer(45);
    }
  };

  const filteredPlayers = availablePlayers.filter((p) => {
    if (selectedFilter === 'ALL') return true;
    return p.position === selectedFilter;
  });

  const totalProjected = draftedSquad.reduce(
    (sum, p) => sum + p.projectedPoints * (p.isFoil ? p.multiplier : 1),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-xl select-none animate-fadeIn">
      <div className="relative w-full max-w-md mx-auto max-h-[92vh] bg-gradient-to-b from-[#1E1C24] via-[#121216] to-[#0A0A0C] border border-white/20 rounded-[28px] p-5 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-white flex flex-col justify-between overflow-hidden">
        
        {/* Top Refraction Highlight Rim */}
        <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* 1. Upper Info Bar, Header & Timer */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-black block">Weekly Mock Draft</span>
              <h2 className="text-sm font-black tracking-tight uppercase">
                {draftedSquad.length >= 5 ? 'ROSTER COMPLETE' : `ROUND ${currentRound} · PICK ${pickNumber}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {draftedSquad.length < 5 && (
              <div className="bg-[#FF453A]/15 border border-[#FF453A]/40 text-[#FF453A] px-3 py-1 rounded-xl text-center flex flex-col justify-center animate-pulse">
                <span className="text-[7.5px] font-black uppercase tracking-widest leading-none">TIME</span>
                <span className="text-xs font-black font-mono leading-none mt-0.5">{timer}s</span>
              </div>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white font-bold text-xs transition-all cursor-pointer"
                title="Close Draft Room"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Position Filter Pills */}
        <div className="flex items-center gap-1.5 mb-3">
          {(['ALL', 'G', 'F', 'C'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedFilter(pos)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
                selectedFilter === pos
                  ? 'bg-amber-400 text-black font-extrabold shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                  : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {pos}
            </button>
          ))}
          <div className="ml-auto text-[10px] font-mono text-zinc-400">
            Proj: <span className="text-emerald-400 font-bold">{totalProjected.toFixed(1)} PTS</span>
          </div>
        </div>

        {/* 2. Available Player Draft Carousel / Grid */}
        <div className="flex-1 overflow-y-auto mb-3 pr-1 space-y-3 no-scrollbar max-h-[46vh]">
          {draftedSquad.length >= 5 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-3xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                🏆
              </div>
              <h3 className="font-black text-base uppercase tracking-tight text-white mb-1">
                Draft Completed!
              </h3>
              <p className="text-xs text-zinc-400 mb-4">
                Your 5-player roster is locked with <span className="text-emerald-400 font-bold font-mono">{totalProjected.toFixed(1)} Projected PTS</span>.
              </p>
              <button
                onClick={() => {
                  if (onOpenPack) {
                    onOpenPack();
                  } else if (onClose) {
                    onClose();
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer active:scale-95 shadow-[0_0_20px_rgba(251,191,36,0.4)] flex items-center justify-center gap-2 mx-auto"
              >
                <span>🎁 Rip 5-Card Reward Pack</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredPlayers.map((player) => (
                <div 
                  key={player.id} 
                  className={`relative overflow-hidden rounded-2xl border bg-gradient-to-b from-[#1C1C22] to-[#0A0A0C] p-3 transition-all hover:border-white/30 ${
                    player.isFoil 
                      ? 'border-amber-500/50 shadow-[0_0_16px_rgba(245,158,11,0.2)]' 
                      : 'border-white/10'
                  }`}
                >
                  {/* Foil Shimmer effect badge */}
                  {player.isFoil && (
                    <div className="absolute top-2 right-2 bg-amber-400/20 border border-amber-400/50 px-1.5 py-0.5 rounded text-[7.5px] font-black uppercase text-amber-300 font-mono shadow-[0_0_6px_rgba(251,191,36,0.3)]">
                      FOIL x{player.multiplier}
                    </div>
                  )}

                  <div className="text-3xl mb-1 mt-0.5">{player.image}</div>
                  <h4 className="font-black text-xs tracking-tight text-white truncate">{player.name}</h4>
                  <p className="text-[9.5px] text-zinc-400 font-semibold mb-2">{player.position} · {player.team}</p>
                  
                  <div className="flex justify-between items-center bg-black/50 px-2 py-1 rounded-lg border border-white/5 mb-2.5 text-[10px] font-mono">
                    <span className="text-zinc-500">Proj:</span>
                    <span className="font-bold text-emerald-400">{player.projectedPoints} PTS</span>
                  </div>

                  <button 
                    onClick={() => handlePick(player)}
                    className="w-full py-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 text-black font-black text-[9.5px] rounded-lg uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 cursor-pointer"
                  >
                    DRAFT PLAYER
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. User's Lineup Dock */}
        <div className="bg-[#0A0A0C] border border-white/15 rounded-2xl p-3 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
              My Roster ({draftedSquad.length}/5)
            </span>
            <span className="text-[9px] font-mono text-amber-400 font-bold">
              {draftedSquad.filter((p) => p.isFoil).length} Foils
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar">
            {Array.from({ length: 5 }).map((_, index) => {
              const player = draftedSquad[index];
              return (
                <div 
                  key={index}
                  className={`w-14 h-16 bg-white/[0.03] rounded-xl flex flex-col items-center justify-center relative flex-shrink-0 transition-all ${
                    player
                      ? player.isFoil
                        ? 'border border-amber-400/50 shadow-[0_0_8px_rgba(251,191,36,0.3)] bg-amber-400/10'
                        : 'border border-white/20 bg-white/[0.06]'
                      : 'border border-dashed border-white/15'
                  }`}
                >
                  {player ? (
                    <>
                      <span className="text-lg leading-none mb-1">{player.image}</span>
                      <span className="text-[8px] font-bold truncate w-12 text-center text-zinc-200">
                        {player.name.split(' ').pop()}
                      </span>
                      <span className="text-[7px] text-emerald-400 font-mono font-bold leading-none">
                        {(player.projectedPoints * (player.isFoil ? player.multiplier : 1)).toFixed(0)}p
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-zinc-600 font-extrabold text-[10px]">R{index + 1}</span>
                      <span className="text-[7.5px] text-zinc-600 font-bold uppercase tracking-tighter">EMPTY</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
