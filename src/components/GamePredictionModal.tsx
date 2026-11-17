import React, { useState } from 'react';
import { MatchAlertService } from '../services/MatchAlertService';
import { Game } from '../types';

interface LeaderboardUser {
  rank: number;
  username: string;
  points: number;
  correctStreak: number;
}

interface Props {
  game: Game;
  onClose: () => void;
  userPoints: number;
  onMakePrediction: (gameId: string, pickedTeam: 'home' | 'away', pointsWagered: number) => void;
}

export const GamePredictionModal: React.FC<Props> = ({ game, onClose, userPoints, onMakePrediction }) => {
  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away' | null>(null);
  const [wager, setWager] = useState(10);
  const [submitted, setSubmitted] = useState(false);

  // Mock global leaderboard rankings
  const leaderboard: LeaderboardUser[] = [
    { rank: 1, username: 'BostonTD_88', points: 1420, correctStreak: 9 },
    { rank: 2, username: 'FossBaller', points: 1280, correctStreak: 7 },
    { rank: 3, username: 'GridironKing', points: 1150, correctStreak: 5 },
    { rank: 4, username: 'You (Ivan)', points: userPoints, correctStreak: 3 },
  ];

  const handleLockIn = () => {
    if (!selectedTeam) return;
    onMakePrediction(game.id, selectedTeam, wager);
    MatchAlertService.playPredictionWin(game.league || 'nba');
    setSubmitted(true);
  };

  const selectedTeamName = selectedTeam === 'away' ? game.away.team.name : game.home.team.name;
  const selectedTeamLogo = selectedTeam === 'away' ? game.away.team.logo : game.home.team.logo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#1C1C22] via-[#121216] to-[#0A0A0C] border border-white/20 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9)] text-white">
        
        {/* Top Refraction Highlight Rim */}
        <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-black uppercase tracking-wider">
            ⭐ FOSS Predictor Game
          </div>
          <button 
            onClick={onClose} 
            className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white font-bold text-sm transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!submitted ? (
          <>
            <h3 className="text-center font-black text-lg uppercase tracking-tight mb-4">
              Who Wins This Matchup?
            </h3>

            {/* Team Picker Cards */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                onClick={() => setSelectedTeam('away')}
                className={`flex flex-col items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedTeam === 'away' 
                    ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)] ring-2 ring-blue-500/40' 
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                <img 
                  src={game.away.team.logo} 
                  alt="" 
                  className="w-12 h-12 object-contain mb-2 drop-shadow"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="text-xs font-bold text-center truncate w-full">{game.away.team.name}</span>
                <span className="text-[10px] text-zinc-400 mt-1 font-mono">AWAY</span>
              </button>

              <button
                onClick={() => setSelectedTeam('home')}
                className={`flex flex-col items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedTeam === 'home' 
                    ? 'bg-rose-600/20 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)] ring-2 ring-rose-500/40' 
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                <img 
                  src={game.home.team.logo} 
                  alt="" 
                  className="w-12 h-12 object-contain mb-2 drop-shadow"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="text-xs font-bold text-center truncate w-full">{game.home.team.name}</span>
                <span className="text-[10px] text-zinc-400 mt-1 font-mono">HOME</span>
              </button>
            </div>

            {/* Points & Wager Section */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3.5 mb-5">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-zinc-400 font-medium">Your Balance:</span>
                <span className="font-mono font-bold text-amber-400">🪙 {userPoints} PTS</span>
              </div>

              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-zinc-400 font-medium">Wager Points:</span>
                <span className="font-mono font-black text-white text-sm">{wager} PTS</span>
              </div>

              {/* Preset Wager Chips */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    disabled={userPoints < amt}
                    onClick={() => setWager(amt)}
                    className={`py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      wager === amt 
                        ? 'bg-amber-400 text-black font-extrabold shadow-[0_0_12px_rgba(251,191,36,0.5)]' 
                        : userPoints < amt 
                        ? 'bg-white/5 text-zinc-600 cursor-not-allowed'
                        : 'bg-white/10 text-zinc-300 hover:bg-white/20'
                    }`}
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[11px]">
                <span className="text-zinc-400">Potential Payout:</span>
                <span className="font-mono font-black text-emerald-400">+{wager * 2} PTS (2.0x)</span>
              </div>
            </div>

            {/* Lock In Button */}
            <button
              disabled={!selectedTeam || userPoints < wager}
              onClick={handleLockIn}
              className={`w-full py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                selectedTeam && userPoints >= wager
                  ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black shadow-[0_4px_20px_rgba(245,158,11,0.4)] active:scale-95'
                  : 'bg-white/10 text-zinc-500 cursor-not-allowed border border-white/5'
              }`}
            >
              {selectedTeam ? `Lock In ${selectedTeam.toUpperCase()} (+${wager * 2} PTS)` : 'Select A Team'}
            </button>
          </>
        ) : (
          /* Submitted Confirmation Screen */
          <div className="text-center py-2 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              ✓
            </div>
            
            <h3 className="font-black text-lg uppercase tracking-tight text-white mb-1">
              Prediction Locked!
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              You picked <span className="text-white font-bold">{selectedTeamName}</span> with a wager of <span className="text-amber-400 font-bold font-mono">{wager} PTS</span>.
            </p>

            {/* Live Leaderboard Preview */}
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-3 mb-5 text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2 flex justify-between">
                <span>Leaderboard Standing</span>
                <span>Streak</span>
              </div>
              <div className="space-y-1.5 text-xs">
                {leaderboard.map((user) => (
                  <div 
                    key={user.rank}
                    className={`flex items-center justify-between p-1.5 rounded-lg font-mono ${
                      user.username.includes('You') 
                        ? 'bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold' 
                        : 'text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-center font-bold text-zinc-500 text-[11px]">#{user.rank}</span>
                      <span className="text-xs truncate max-w-[120px]">{user.username}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{user.points} pts</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-black">
                        🔥 {user.correctStreak}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Back to Scores
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
