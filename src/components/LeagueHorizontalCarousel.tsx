import React, { useState, useRef } from 'react';
import { Game, League } from '../types';

interface Props {
  league: League;
  games: Game[];
  onSelectGame?: (game: Game) => void;
  onSeeAll?: () => void;
}

function formatHexColor(color: string | undefined, defaultColor: string): string {
  if (!color) return defaultColor;
  let clean = color.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (clean.length === 6) {
    return `#${clean}`;
  }
  return defaultColor;
}

interface CardProps {
  game: Game;
  onSelectGame?: (game: Game) => void;
}

const CarouselGameCard: React.FC<CardProps> = ({ game, onSelectGame }) => {
  const [showMiniCard, setShowMiniCard] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isF1 = game.league === 'f1' || !!game.f1Race;
  const f1 = game.f1Race;
  const p1 = f1?.podium?.[0];
  const broadcastName =
    game.broadcasts?.[0]?.name ||
    game.broadcastDetails?.resolvedChannel ||
    game.broadcast ||
    'National Feed';

  const awayColor = formatHexColor(game.away.team.color, '#2C2C2E');
  const homeColor = formatHexColor(game.home.team.color, '#1C1C1E');
  const rawAwayProb = game.away.winProbability ?? (game.kalshi?.awayWinProb ?? 50);
  const awayWinProb = Number.isFinite(rawAwayProb) ? Math.min(Math.max(Math.round(rawAwayProb), 0), 100) : 50;
  const gradientAngle = 135 + (awayWinProb - 50) * 0.3;
  const splitPoint = Math.min(Math.max(awayWinProb, 35), 65);
  const formatScoreDisplay = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '-';
    if (typeof val === 'number' && !Number.isFinite(val)) return '-';
    if (String(val) === 'NaN') return '-';
    return val;
  };
  const formattedTime = (() => {
    const d = new Date(game.date);
    return Number.isNaN(d.getTime()) ? 'TBD' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  })();

  // Press & Hold (Long Press 400ms) Handlers for Haptic Mini Card Preview
  const handleTouchStart = () => {
    pressTimer.current = setTimeout(() => {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // Crisp haptic click
      }
      setShowMiniCard(true);
    }, 400);
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
        onClick={() => onSelectGame?.(game)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        className="relative min-w-[285px] max-w-[285px] border border-white/20 rounded-2xl p-4 snap-start flex-shrink-0 shadow-[0_12px_36px_rgba(0,0,0,0.75)] backdrop-blur-2xl overflow-hidden ios-spring active:scale-[0.96] cursor-pointer"
        style={{
          background: isF1
            ? 'linear-gradient(135deg, rgba(225, 6, 0, 0.22) 0%, #141416E6 50%, rgba(28, 28, 30, 0.9) 100%)'
            : `linear-gradient(${gradientAngle}deg, ${awayColor}44 0%, #141416E6 ${splitPoint}%, ${homeColor}44 100%)`,
          transition: 'background 3500ms cubic-bezier(0.25, 1, 0.5, 1), transform 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Specular Liquid Glass Highlight Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.08] via-transparent to-black/40 rounded-2xl" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <div className="relative z-10">
          {/* Card Header */}
          <div className="flex items-center justify-between mb-3.5 text-xs">
            {game.live || game.state === 'in' ? (
              <span className="bg-[#FF453A] text-white font-extrabold px-2 py-0.5 rounded-md text-[10px] tracking-wide shadow-sm animate-pulse">
                LIVE
              </span>
            ) : game.state === 'post' ? (
              <span className="text-zinc-500 font-bold tracking-wide">FINAL</span>
            ) : (
              <span className="text-zinc-400 font-medium">
                {formattedTime}
              </span>
            )}
            <span className="bg-white/[0.08] text-zinc-300 px-2 py-0.5 rounded-md text-[10px] font-semibold border border-white/10 truncate max-w-[140px]">
              {broadcastName}
            </span>
          </div>

          {isF1 && f1 ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-base">{f1.countryFlag}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-extrabold text-sm uppercase tracking-tight truncate">
                    {f1.grandPrixName}
                  </div>
                  <div className="text-zinc-400 text-[11px] font-medium truncate">
                    {f1.circuitName}
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-white/10 my-2" />

              <div className="flex items-center justify-between text-xs pt-0.5">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                    P1
                  </span>
                  <span className="text-white font-bold text-xs truncate max-w-[130px]">
                    {p1 ? p1.driverName : f1.polePosition || 'Max Verstappen'}
                  </span>
                </div>
                <span className="text-zinc-400 text-[11px] font-mono">
                  {game.live ? `L${f1.currentLap}/${f1.totalLaps}` : `${f1.totalLaps} Laps`}
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Away Team Row */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src={game.away.team.logo}
                    alt=""
                    className="w-6 h-6 object-contain drop-shadow shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-white font-extrabold text-sm uppercase tracking-tight truncate">
                      {game.away.team.name}
                    </div>
                    <div className="text-zinc-400 text-[11px] font-medium">
                      {game.away.record}
                    </div>
                  </div>
                </div>
                <div className="text-white font-black text-xl tracking-tight score-font shrink-0 ml-2">
                  {formatScoreDisplay(game.away.score)}
                </div>
              </div>

              {/* Divider Line */}
              <div className="h-[1px] bg-white/10 my-2" />

              {/* Home Team Row */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <img
                    src={game.home.team.logo}
                    alt=""
                    className="w-6 h-6 object-contain drop-shadow shrink-0"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="min-w-0">
                    <div className="text-white font-extrabold text-sm uppercase tracking-tight truncate">
                      {game.home.team.name}
                    </div>
                    <div className="text-zinc-400 text-[11px] font-medium">
                      {game.home.record}
                    </div>
                  </div>
                </div>
                <div className="text-white font-black text-xl tracking-tight score-font shrink-0 ml-2">
                  {formatScoreDisplay(game.home.score)}
                </div>
              </div>
            </>
          )}
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
              <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest block mb-0.5">
                Quick Peek Preview
              </span>
              <h3 className="text-white font-black text-base uppercase tracking-tight">
                {game.away.team.name} vs {game.home.team.name}
              </h3>
            </div>
            <div className="space-y-2 bg-black/40 p-3 rounded-2xl border border-white/10 mb-3 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-semibold text-white">
                  {game.live ? `${game.status || 'LIVE'} · ${game.clock || 'Q4'}` : game.state === 'post' ? 'FINAL' : formattedTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Win Probability</span>
                <span className="font-semibold text-white">{awayWinProb}% Away</span>
              </div>
              <div className="flex justify-between">
                <span>Broadcast</span>
                <span className="font-semibold text-white">{broadcastName}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowMiniCard(false);
                onSelectGame?.(game);
              }}
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

export const LeagueHorizontalCarousel: React.FC<Props> = ({
  league,
  games,
  onSelectGame,
  onSeeAll,
}) => {
  const emblemLogo =
    league.logo ||
    league.emblem ||
    (league.key === 'f1'
      ? 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/f1.png'
      : `https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/${league.key}.png`);

  // Prioritize live games first, then upcoming (pre), then finished (post)
  const sortedGames = React.useMemo(() => {
    return [...games].sort((a, b) => {
      const aLive = a.live || a.state === 'in';
      const bLive = b.live || b.state === 'in';
      if (aLive && !bLive) return -1;
      if (!aLive && bLive) return 1;

      const aPre = a.state === 'pre';
      const bPre = b.state === 'pre';
      if (aPre && !bPre) return -1;
      if (!aPre && bPre) return 1;

      return (Number.isFinite(a.date) ? a.date : 0) - (Number.isFinite(b.date) ? b.date : 0);
    });
  }, [games]);

  return (
    <div className="mb-6">
      {/* League Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center space-x-2">
          <img
            src={emblemLogo}
            alt={league.name}
            className="w-6 h-6 object-contain"
            onError={(e) => {
              if (league.fallbackEmblem && e.currentTarget.src !== league.fallbackEmblem) {
                e.currentTarget.src = league.fallbackEmblem;
              }
            }}
          />
          <h3 className="text-white font-extrabold text-sm tracking-wider uppercase">
            {league.name}
          </h3>
        </div>
        <button
          onClick={onSeeAll}
          className="text-zinc-400 hover:text-white text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
        >
          {games.length} Games <span className="text-[10px]">›</span>
        </button>
      </div>

      {/* Horizontal Scrolling Card Row with High Contrast Elevation */}
      <div className="flex overflow-x-auto space-x-3.5 px-4 pb-3 scrollbar-none snap-x">
        {sortedGames.length === 0 ? (
          <div className="text-zinc-500 text-xs py-3 px-1 italic">
            No matchups scheduled today.
          </div>
        ) : (
          sortedGames.map((game) => (
            <CarouselGameCard
              key={game.id}
              game={game}
              onSelectGame={onSelectGame}
            />
          ))
        )}
      </div>
    </div>
  );
};
