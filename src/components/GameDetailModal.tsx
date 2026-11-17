import React, { useState, useEffect } from 'react';
import { Game, AppCustomization } from '../types';
import { Tv, MapPin, Zap, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { sounds } from '../services/sound';
import { kalshiService } from '../services/kalshiService';

interface Props {
  initialGame?: Game | null;
  game?: Game | null;
  games?: Game[];
  onClose: () => void;
  onSimulatePlay?: (gameId: string) => void;
  onOpenPredictor?: (game: Game) => void;
  customization?: Partial<AppCustomization>;
}

export const GameDetailModal: React.FC<Props> = ({
  initialGame,
  game,
  games = [],
  onClose,
  onSimulatePlay,
  onOpenPredictor,
  customization,
}) => {
  const activeInitial = initialGame || game;
  if (!activeInitial) return null;

  const gameList = games && games.length > 0 ? games : [activeInitial];

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = gameList.findIndex((g) => g.id === activeInitial.id);
    return idx !== -1 ? idx : 0;
  });

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchYStart, setTouchYStart] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync index when selected initialGame changes from outside
  useEffect(() => {
    if (activeInitial) {
      const idx = gameList.findIndex((g) => g.id === activeInitial.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      }
    }
  }, [activeInitial?.id, gameList]);

  const currentGame = gameList[currentIndex] || activeInitial;
  const isLive = currentGame.live || currentGame.state === 'in';
  const isPost = currentGame.state === 'post';
  const market = currentGame.kalshi || kalshiService.resolveMarket(currentGame);
  const rawAwayProb = currentGame.away.winProbability ?? market.awayWinProb;
  const awayProb = Number.isFinite(rawAwayProb) ? Math.min(100, Math.max(0, Math.round(rawAwayProb))) : 50;
  const homeProb = 100 - awayProb;
  const activeProviders = customization?.marketProviders || ['Kalshi', 'Polymarket', 'DraftKings', 'FanDuel'];

  // Extract team colors for the glowing aura bar and matchup cards
  const awayColor = currentGame.away?.team?.color || '#3B82F6';
  const homeColor = currentGame.home?.team?.color || '#EF4444';

  const hasNext = currentIndex < gameList.length - 1;
  const hasPrev = currentIndex > 0;

  // Handle Horizontal Swipe (Carousel between games) & Vertical Swipe Down to Close
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchYStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchYStart !== null) {
      const currentY = e.targetTouches[0].clientY;
      const diffY = currentY - touchYStart;
      if (diffY > 0) {
        setTranslateY(diffY); // Track downward drag
      }
    }
  };

  const triggerSlideTransition = (callback: () => void) => {
    sounds.playTabSwitch();
    setIsAnimating(true);
    setTimeout(() => {
      callback();
      setIsAnimating(false);
    }, 180);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart !== null) {
      const touchEnd = e.changedTouches[0].clientX;
      const diffX = touchStart - touchEnd;

      // Threshold for horizontal swipe (left/right carousel)
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentIndex < gameList.length - 1) {
          triggerSlideTransition(() => setCurrentIndex(currentIndex + 1));
        } else if (diffX < 0 && currentIndex > 0) {
          triggerSlideTransition(() => setCurrentIndex(currentIndex - 1));
        }
      }
      setTouchStart(null);
    }

    if (touchYStart !== null) {
      // If swiped down past 120px, close modal smoothly
      if (translateY > 120) {
        sounds.playTap();
        onClose();
      } else {
        setTranslateY(0); // Snap back up
      }
      setTouchYStart(null);
    }
  };

  const nextGame = () => {
    if (currentIndex < gameList.length - 1) {
      triggerSlideTransition(() => setCurrentIndex(currentIndex + 1));
    }
  };

  const prevGame = () => {
    if (currentIndex > 0) {
      triggerSlideTransition(() => setCurrentIndex(currentIndex - 1));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col justify-end md:justify-center items-center transition-all duration-300 p-0 md:p-4"
      style={{
        transform: `translateY(${translateY}px)`,
        opacity: Math.max(1 - translateY / 400, 0),
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          sounds.playTap();
          onClose();
        }
      }}
    >
      {/* Swipe Down Grab Handle Indicator (strictly no X close buttons) */}
      <div
        className="w-full h-10 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-12 h-1.5 bg-zinc-600 hover:bg-zinc-500 rounded-full transition-colors" />
      </div>

      {/* Main Immersive Card Container with iOS App-Opening Spring Animation */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full max-w-lg mx-auto bg-gradient-to-b from-[#1C1C1E] to-[#121214] border border-white/20 rounded-t-[36px] md:rounded-3xl p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] relative overflow-hidden animate-ios-open max-h-[88vh] overflow-y-auto no-scrollbar ${
          isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation arrows for desktop */}
        {gameList.length > 1 && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={prevGame}
                aria-label="Previous Game"
                className="hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-md border border-white/20 cursor-pointer transition-transform active:scale-90"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {currentIndex < gameList.length - 1 && (
              <button
                onClick={nextGame}
                aria-label="Next Game"
                className="hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-md border border-white/20 cursor-pointer transition-transform active:scale-90"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </>
        )}

        {/* GLOWING AURA SWIPE BAR (Mixed Team Colors & Directional Motion) */}
        <div className="w-full flex items-center justify-between mb-5 px-1">
          {/* Left Directional Aura Indicator */}
          <div className="h-1 flex-1 rounded-full mr-2 relative overflow-hidden bg-white/10">
            {hasPrev && (
              <div 
                className="absolute inset-y-0 left-0 w-full animate-pulse blur-[1px]"
                style={{
                  background: `linear-gradient(90deg, ${awayColor}, ${homeColor})`,
                  boxShadow: `0 0 12px ${awayColor}`
                }}
              />
            )}
          </div>

          {/* Center Pill Glow Indicator */}
          <div 
            className="w-10 h-1 rounded-full blur-[0.5px] animate-pulse"
            style={{
              background: `linear-gradient(90deg, ${awayColor}, ${homeColor})`,
              boxShadow: `0 0 10px ${homeColor}`
            }}
          />

          {/* Right Directional Aura Indicator */}
          <div className="h-1 flex-1 rounded-full ml-2 relative overflow-hidden bg-white/10">
            {hasNext && (
              <div 
                className="absolute inset-y-0 right-0 w-full animate-pulse blur-[1px]"
                style={{
                  background: `linear-gradient(90deg, ${homeColor}, ${awayColor})`,
                  boxShadow: `0 0 12px ${homeColor}`
                }}
              />
            )}
          </div>
        </div>

        {/* Game Status Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="bg-[#FF453A] text-white font-black px-2.5 py-1 rounded-md text-xs tracking-wider uppercase animate-pulse shadow-[0_0_12px_rgba(255,69,58,0.5)]">
                LIVE · {currentGame.status || 'Q4'} {currentGame.clock ? `· ${currentGame.clock}` : ''}
              </span>
            ) : isPost ? (
              <span className="text-zinc-400 font-black tracking-wider text-xs">
                FINAL SCORE
              </span>
            ) : (
              <span className="text-zinc-400 font-semibold text-xs">
                {new Date(currentGame.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-white/10 text-zinc-300 px-3 py-1 rounded-full text-xs font-semibold border border-white/10 truncate max-w-[170px]">
              {currentGame.broadcastDetails?.resolvedChannel ||
                currentGame.broadcasts?.[0]?.name ||
                currentGame.broadcast ||
                'National Broadcast'}
            </span>
          </div>
        </div>

        {/* F1 Grand Prix Specific Layout */}
        {currentGame.league === 'f1' && currentGame.f1Race ? (
          <div className="space-y-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10">
              <span className="text-[11px] font-mono uppercase tracking-wider text-red-500 font-bold block mb-1">
                {currentGame.f1Race.countryFlag} {currentGame.f1Race.country} Grand Prix
              </span>
              <h3 className="text-xl font-black text-white uppercase tracking-tight font-display">
                {currentGame.f1Race.grandPrixName}
              </h3>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                <span>{currentGame.f1Race.circuitName} · {currentGame.f1Race.totalLaps} LAPS</span>
              </p>
            </div>

            {/* Podium Classification */}
            {currentGame.f1Race.podium && currentGame.f1Race.podium.length > 0 && (
              <div className="space-y-2 bg-black/40 rounded-2xl p-3 border border-white/10">
                <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold px-1 mb-1">
                  Race Classification & Interval Gaps
                </p>
                {currentGame.f1Race.podium.map((d) => (
                  <div
                    key={d.driverCode}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md text-[11px] font-black flex items-center justify-center shrink-0 ${
                          d.position === 1
                            ? 'bg-amber-400 text-black'
                            : d.position === 2
                            ? 'bg-slate-300 text-black'
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        {d.position}
                      </span>
                      <span
                        className="w-1.5 h-6 rounded-full shrink-0"
                        style={{ backgroundColor: d.constructorColor || '#E10600' }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white uppercase tracking-tight truncate">
                          {d.driverName} ({d.driverCode})
                        </p>
                        <p className="text-[10.5px] text-zinc-400 truncate">{d.constructorName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono text-white tabular-nums">
                      {d.timeOrGap || 'LEADER'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Standard Teams & Scores Matchup View */
          <div className="space-y-4 mb-6">
            {/* Away Team */}
            <div 
              className="flex items-center justify-between p-4 rounded-2xl border border-white/10"
              style={{ background: `linear-gradient(135deg, ${awayColor}22 0%, rgba(255,255,255,0.03) 100%)` }}
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <img
                  src={currentGame.away.team.logo}
                  alt=""
                  className="w-10 h-10 object-contain drop-shadow-md shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="min-w-0">
                  <h3 className="text-white font-black text-lg uppercase tracking-tight truncate">
                    {currentGame.away.team.name}
                  </h3>
                  <p className="text-zinc-400 text-xs font-medium">
                    {currentGame.away.record || 'Away'}
                  </p>
                </div>
              </div>
              <div className="text-white font-black text-3xl tracking-tighter shrink-0 ml-3 score-font font-mono">
                {typeof currentGame.away.score === 'number' && Number.isNaN(currentGame.away.score) ? '-' : (currentGame.away.score ?? '-')}
              </div>
            </div>

            {/* Home Team */}
            <div 
              className="flex items-center justify-between p-4 rounded-2xl border border-white/10"
              style={{ background: `linear-gradient(135deg, ${homeColor}22 0%, rgba(255,255,255,0.03) 100%)` }}
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <img
                  src={currentGame.home.team.logo}
                  alt=""
                  className="w-10 h-10 object-contain drop-shadow-md shrink-0"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="min-w-0">
                  <h3 className="text-white font-black text-lg uppercase tracking-tight truncate">
                    {currentGame.home.team.name}
                  </h3>
                  <p className="text-zinc-400 text-xs font-medium">
                    {currentGame.home.record || 'Home'}
                  </p>
                </div>
              </div>
              <div className="text-white font-black text-3xl tracking-tighter shrink-0 ml-3 score-font font-mono">
                {typeof currentGame.home.score === 'number' && Number.isNaN(currentGame.home.score) ? '-' : (currentGame.home.score ?? '-')}
              </div>
            </div>
          </div>
        )}

        {/* Market Consensus & Odds Breakdown Card */}
        {customization?.showMarketConsensus !== false && (
          <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                Market Consensus
              </span>
              <span className="text-zinc-500 text-[10px]">Aggregated Live</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white font-semibold">{currentGame.away.team.name} Implied</span>
              <span className="text-white font-black score-font">{awayProb}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full my-2 overflow-hidden flex">
              <div className="bg-white h-full transition-all duration-500" style={{ width: `${awayProb}%` }} />
              <div className="bg-zinc-600 h-full transition-all duration-500" style={{ width: `${homeProb}%` }} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white font-semibold">{currentGame.home.team.name} Implied</span>
              <span className="text-white font-black score-font">{homeProb}%</span>
            </div>

            {/* Aggregated Provider Breakdown Pills (Kalshi, Polymarket, DraftKings, FanDuel) */}
            {activeProviders.length > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
                {activeProviders.map((provider) => {
                  let awayVal = `${awayProb}%`;
                  let homeVal = `${homeProb}%`;
                  if (provider === 'Polymarket') {
                    awayVal = `¢${awayProb}`;
                    homeVal = `¢${homeProb}`;
                  } else if (provider === 'DraftKings' || provider === 'FanDuel') {
                    const clampedAway = Math.min(99, Math.max(1, awayProb));
                    const clampedHome = Math.min(99, Math.max(1, homeProb));
                    const awayML = clampedAway >= 50 ? `-${Math.round((clampedAway / (100 - clampedAway)) * 100)}` : `+${Math.round(((100 - clampedAway) / clampedAway) * 100)}`;
                    const homeML = clampedHome >= 50 ? `-${Math.round((clampedHome / (100 - clampedHome)) * 100)}` : `+${Math.round(((100 - clampedHome) / clampedHome) * 100)}`;
                    awayVal = awayML;
                    homeVal = homeML;
                  }

                  return (
                    <div
                      key={provider}
                      className="bg-black/40 border border-white/10 rounded-xl p-2 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-zinc-400 font-semibold text-[10px] uppercase">
                        <span>{provider}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#30D158]" />
                      </div>
                      <div className="flex items-center justify-between mt-1 text-white font-mono text-[10px]">
                        <span className="truncate mr-1">{currentGame.away.team.abbr || currentGame.away.team.name.slice(0, 3)}: {awayVal}</span>
                        <span className="truncate">{currentGame.home.team.abbr || currentGame.home.team.name.slice(0, 3)}: {homeVal}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* FOSS Predictor CTA */}
            {onOpenPredictor && (
              <button
                onClick={() => {
                  sounds.playTap();
                  onOpenPredictor(currentGame);
                }}
                className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/25 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/40 text-amber-300 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.2)]"
              >
                <span>⭐ Predict Winner & Win Points</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400 text-black font-extrabold font-mono">2.0x</span>
              </button>
            )}
          </div>
        )}

        {/* Live Simulator Trigger Button if testing mode */}
        {onSimulatePlay && (
          <div className="flex justify-center mb-6">
            <button
              onClick={() => {
                sounds.playScore();
                onSimulatePlay(currentGame.id);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white rounded-full text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Simulate Live Play & Score (+PTS)</span>
            </button>
          </div>
        )}

        {/* Carousel Pagination Dots & Hint */}
        <div className="flex flex-col items-center justify-center space-y-2 pb-2">
          {gameList.length > 1 && (
            <div className="flex space-x-1.5 max-w-full overflow-x-auto no-scrollbar py-1">
              {gameList.slice(0, 16).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerSlideTransition(() => setCurrentIndex(idx))}
                  aria-label={`Go to game ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
          )}
          <p className="text-zinc-500 text-[11px] font-medium tracking-tight">
            Swipe left/right for other games · Swipe down to close
          </p>
        </div>
      </div>
    </div>
  );
};
