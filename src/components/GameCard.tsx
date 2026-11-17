import React, { useState } from 'react';
import { Game, AppCustomization } from '../types';
import { sounds } from '../services/sound';
import { kalshiService } from '../services/kalshiService';
import { Star, Tv, Eye, EyeOff, Flag } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (teamId: string) => void;
  customization?: Partial<AppCustomization>;
}

export const GameCard: React.FC<GameCardProps> = ({
  game,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
  customization = {},
}) => {
  const [revealed, setRevealed] = useState(false);

  const isLive = game.live || game.state === 'in';
  const isPost = game.state === 'post';
  const isPre = game.state === 'pre';
  const isF1 = game.league === 'f1' || !!game.f1Race;

  const parsedAway = parseInt(String(game.away.score ?? ''), 10);
  const parsedHome = parseInt(String(game.home.score ?? ''), 10);
  const awayScoreNum = Number.isFinite(parsedAway) ? parsedAway : 0;
  const homeScoreNum = Number.isFinite(parsedHome) ? parsedHome : 0;

  const awayIsWinner = isPost && awayScoreNum > homeScoreNum;
  const homeIsWinner = isPost && homeScoreNum > awayScoreNum;

  const isCompact = customization.cardDensity === 'compact';
  const isExpanded = customization.cardDensity === 'expanded';
  const isSpoilerHidden = customization.hideScoresSpoiler && !revealed && (isLive || isPost);
  const showOdds = customization.showOdds !== false;
  const showKalshi = customization.showKalshi !== false;
  const showSituations = customization.showSituations !== false;

  const market = React.useMemo(() => {
    return game.kalshi || kalshiService.resolveMarket(game);
  }, [game]);

  const favoredTeam = market.homeWinProb >= market.awayWinProb ? game.home.team.abbr : game.away.team.abbr;
  const favoredProb = Math.max(market.homeWinProb, market.awayWinProb);

  const formattedTime = React.useMemo(() => {
    if (game.status && (game.status.includes('PM') || game.status.includes('AM') || game.status.includes(':'))) {
      return game.status;
    }
    const d = new Date(game.date);
    if (Number.isNaN(d.getTime())) return 'TBD';
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }, [game.date, game.status]);

  // Clean Apple Sports F1 Grand Prix Card
  if (isF1 && game.f1Race) {
    const f1 = game.f1Race;
    const p1 = f1.podium?.[0];
    const p2 = f1.podium?.[1];

    return (
      <div
        onClick={() => {
          sounds.playTap();
          onSelect(game);
        }}
        className="group relative bg-gradient-to-b from-[#1C1C1E] to-[#141416] border border-white/20 backdrop-blur-xl rounded-3xl p-4 active:scale-[0.99] transition-all duration-150 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.7)] hover:border-white/30"
      >
        {/* Header Bar: Status on Left, Broadcast & Kalshi pushed Right */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {isLive ? (
              <span className="flex items-center gap-1.5 bg-[#FF453A] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            ) : isPost ? (
              <span className="text-xs font-bold text-[#636366] uppercase tracking-wider">
                FINAL
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#8E8E93]">
                {formattedTime.toUpperCase()}
              </span>
            )}

            <span className="text-xs font-bold text-[#8E8E93] tabular-nums">
              {isLive ? `· ${game.status || 'Live Grand Prix'}` : isPost ? `· ${f1.totalLaps} LAPS` : `· ${f1.sessionType}`}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(game.broadcastDetails?.resolvedChannel || game.broadcasts?.[0]?.name || game.broadcast) && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#1F1F23] border border-[#2A2A2E] text-[#8E8E93]">
                <Tv className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate max-w-[140px] sm:max-w-[180px]">
                  {game.broadcastDetails?.resolvedChannel || game.broadcasts?.[0]?.name || game.broadcast}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Grand Prix Title and Circuit */}
        <div className="mb-3 pb-2 border-b border-[#2A2A2E]/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-tight uppercase font-display">
              {f1.grandPrixName.toUpperCase()}
            </h3>
            <p className="text-[11px] text-[#8E8E93] font-medium flex items-center gap-1.5 mt-0.5">
              <span>{f1.countryFlag}</span>
              <span>{f1.circuitName}</span>
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
            F1
          </span>
        </div>

        {/* Top Drivers / Classification Rows */}
        <div className="space-y-2">
          {/* P1 Driver Row */}
          {p1 && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-5 h-5 rounded-md bg-white/10 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  1
                </span>
                <span
                  className="w-1.5 h-6 rounded-full shrink-0"
                  style={{ backgroundColor: p1.constructorColor || '#E10600' }}
                />
                <div className="min-w-0">
                  <p className="font-bold text-white text-[14.5px] tracking-tight uppercase truncate">
                    {p1.driverName.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-[#8E8E93] truncate">
                    {p1.constructorName} {p1.tireCompound ? `· ${p1.tireCompound}` : ''}
                  </p>
                </div>
              </div>
              <span className="font-black font-mono text-[17px] text-white tabular-nums tracking-tight text-right shrink-0">
                {p1.timeOrGap || 'LEADER'}
              </span>
            </div>
          )}

          {/* P2 Driver Row */}
          {p2 && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-5 h-5 rounded-md bg-white/5 text-[#8E8E93] text-[10px] font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <span
                  className="w-1.5 h-6 rounded-full shrink-0"
                  style={{ backgroundColor: p2.constructorColor || '#8E8E93' }}
                />
                <div className="min-w-0">
                  <p className="font-bold text-neutral-300 text-[14.5px] tracking-tight uppercase truncate">
                    {p2.driverName.toUpperCase()}
                  </p>
                  <p className="text-[11px] text-[#8E8E93] truncate">
                    {p2.constructorName} {p2.tireCompound ? `· ${p2.tireCompound}` : ''}
                  </p>
                </div>
              </div>
              <span className="font-black font-mono text-[17px] text-[#8E8E93] tabular-nums tracking-tight text-right shrink-0">
                {p2.timeOrGap || '+1.84s'}
              </span>
            </div>
          )}
        </div>

        {/* Footnote: Pole position or fastest lap */}
        {(f1.polePosition || f1.fastestLap) && (
          <div className="mt-3 pt-2 border-t border-[#2A2A2E] flex items-center justify-between text-[11px] text-[#8E8E93]">
            <span className="truncate">
              ⚡ {f1.fastestLap || f1.polePosition}
            </span>
            <span className="font-mono text-[10px] uppercase text-[#636366]">
              {f1.totalLaps} LAPS
            </span>
          </div>
        )}
      </div>
    );
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

  const awayColor = formatHexColor(game.away.team.color, '#2C2C2E');
  const homeColor = formatHexColor(game.home.team.color, '#1C1C1E');
  const rawAwayProb = game.away.winProbability ?? game.kalshi?.awayWinProb ?? 50;
  const awayWinProb = Number.isFinite(rawAwayProb) ? rawAwayProb : 50;
  const gradientAngle = 135 + (awayWinProb - 50) * 0.3;
  const splitPoint = Math.min(Math.max(awayWinProb, 35), 65);

  // Apple Sports Strict Matchup Card (GameCardView)
  return (
    <div
      onClick={() => {
        sounds.playTap();
        onSelect(game);
      }}
      style={{
        background: isF1
          ? 'linear-gradient(135deg, rgba(225, 6, 0, 0.22) 0%, #141416E6 50%, rgba(28, 28, 30, 0.9) 100%)'
          : `linear-gradient(${gradientAngle}deg, ${awayColor}44 0%, #141416E6 ${splitPoint}%, ${homeColor}44 100%)`,
        transition: 'background 3500ms cubic-bezier(0.25, 1, 0.5, 1), transform 150ms ease',
      }}
      className={`group relative border border-white/20 backdrop-blur-xl rounded-3xl active:scale-[0.99] transition-all duration-300 cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.7)] hover:border-white/30 overflow-hidden ${
        isCompact ? 'p-3' : isExpanded ? 'p-5' : 'p-4'
      }`}
    >
      {/* Specular Liquid Glass Highlight Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.08] to-black/40 rounded-3xl" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* 1. Header: Left = Status Indicator (LIVE red pill or FINAL) + game clock; Right = Broadcast Channel */}
        <div className={`flex items-center justify-between gap-2 ${isCompact ? 'mb-2' : 'mb-3'}`}>
          <div className="flex items-center gap-2 min-w-0">
            {isLive ? (
              <span className="flex items-center gap-1.5 bg-[#FF453A] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE
              </span>
            ) : isPost ? (
              <span className="text-xs font-bold text-[#636366] uppercase tracking-wider">
                FINAL
              </span>
            ) : (
              <span className="text-xs font-semibold text-[#8E8E93]">
                {formattedTime.toUpperCase()}
              </span>
            )}

            {isLive && (
              <span className="text-xs font-bold text-[#8E8E93] tabular-nums font-mono">
                · {game.status?.toUpperCase()} {game.clock ? `· ${game.clock}` : ''}
              </span>
            )}
          </div>

          {/* Right Header Badges: Location / Broadcast Channel & Controls (strictly no gambling data) */}
          <div className="flex items-center gap-2 shrink-0">
            {(game.broadcastDetails?.resolvedChannel || game.broadcast) && (
              <span
                className="flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#1F1F23] border border-[#2A2A2E] text-[#8E8E93] truncate max-w-[140px] sm:max-w-[180px]"
                title={game.broadcastDetails?.marketNote || 'Broadcast Channel'}
              >
                <Tv className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">
                  {game.broadcastDetails?.resolvedChannel || game.broadcast}
                </span>
              </span>
            )}

            {/* Spoiler toggle button if enabled */}
            {customization.hideScoresSpoiler && (isLive || isPost) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap();
                  setRevealed(!revealed);
                }}
                title={revealed ? 'Hide score' : 'Reveal score'}
                className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors"
              >
                {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Favorite star */}
            {onToggleFavorite && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap();
                  onToggleFavorite(game.home.team.id);
                }}
                title="Add to My Teams"
                className="p-1 rounded-full text-neutral-600 hover:text-amber-400 transition-colors"
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    isFavorite ? 'fill-amber-400 text-amber-400' : ''
                  }`}
                />
              </button>
            )}
          </div>
        </div>

      {/* 2. Stacked Teams Matchup: Logo (far left) + Team Name & Record (stacked) + Score (right-aligned heavy black numeric) */}
      <div className={isCompact ? 'space-y-2' : 'space-y-3'}>
        {/* Away Team Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center min-w-0 flex-1">
            {/* Official 24px Logo on the far left */}
            <div className="w-6 h-6 shrink-0 mr-3 flex items-center justify-center">
              <img
                src={game.away.team.logo}
                alt={game.away.team.name}
                className="w-6 h-6 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Team Name strictly UPPERCASE and record stacked vertically */}
            <div className="min-w-0 flex-1">
              <p
                className={`font-bold tracking-tight text-[15px] sm:text-[15.5px] truncate font-display leading-tight ${
                  isPost && !awayIsWinner ? 'text-[#636366]' : 'text-white'
                }`}
              >
                {game.away.team.name.toUpperCase()}
              </p>
              {game.away.record && (
                <p className="text-[11.5px] text-[#8E8E93] font-mono leading-tight mt-0.5">
                  {game.away.record}
                </p>
              )}
            </div>
          </div>

          {/* Right-aligned heavy black numeric typography (22sp/18sp with score-font tabular-nums) */}
          {!isPre ? (
            isSpoilerHidden ? (
              <span className="text-xs font-mono px-2 py-1 rounded bg-[#1F1F23] border border-[#2A2A2E] text-[#8E8E93]">
                Hidden
              </span>
            ) : (
              <span
                className={`font-black font-mono score-font tabular-nums tracking-tight text-right ${
                  isCompact ? 'text-[18px]' : 'text-[22px]'
                } ${isPost && !awayIsWinner ? 'text-[#636366]' : 'text-white'}`}
              >
                {typeof game.away.score === 'number' && Number.isNaN(game.away.score) ? '-' : (game.away.score ?? '-')}
              </span>
            )
          ) : (
            <span className="text-xs text-[#636366] font-mono font-bold tracking-wider">
              VS
            </span>
          )}
        </div>

        {/* Divider Line between Away and Home Team */}
        <div className="h-[1px] bg-white/10 my-2" />

        {/* Home Team Row */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center min-w-0 flex-1">
            {/* Official 24px Logo on the far left */}
            <div className="w-6 h-6 shrink-0 mr-3 flex items-center justify-center">
              <img
                src={game.home.team.logo}
                alt={game.home.team.name}
                className="w-6 h-6 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            {/* Team Name strictly UPPERCASE and record stacked vertically */}
            <div className="min-w-0 flex-1">
              <p
                className={`font-extrabold tracking-tight text-[15px] sm:text-[15.5px] truncate font-display leading-tight ${
                  isPost && !homeIsWinner ? 'text-[#636366]' : 'text-white'
                }`}
              >
                {game.home.team.name.toUpperCase()}
              </p>
              {game.home.record && (
                <p className="text-[11.5px] text-[#8E8E93] font-mono leading-tight mt-0.5">
                  {game.home.record}
                </p>
              )}
            </div>
          </div>

          {/* Right-aligned heavy black numeric typography (22sp/18sp with score-font tabular-nums) */}
          {!isPre ? (
            isSpoilerHidden ? (
              <span className="text-xs font-mono px-2 py-1 rounded bg-[#1F1F23] border border-[#2A2A2E] text-[#8E8E93]">
                Hidden
              </span>
            ) : (
              <span
                className={`font-black font-mono score-font tabular-nums tracking-tight text-right ${
                  isCompact ? 'text-[18px]' : 'text-[22px]'
                } ${isPost && !homeIsWinner ? 'text-[#636366]' : 'text-white'}`}
              >
                {typeof game.home.score === 'number' && Number.isNaN(game.home.score) ? '-' : (game.home.score ?? '-')}
              </span>
            )
          ) : (
            <span className="text-xs text-[#636366] font-mono font-bold tracking-wider">
              VS
            </span>
          )}
        </div>
      </div>

      {/* Expanded Linescore Strip (if density === expanded) */}
      {isExpanded && game.away.linescores && game.away.linescores.length > 0 && !isSpoilerHidden && (
        <div className="mt-3 pt-2 border-t border-[#2A2A2E] flex items-center justify-between text-[11px] font-mono text-[#8E8E93]">
          <span className="uppercase text-[10px] text-[#636366]">Periods</span>
          <div className="flex gap-2">
            {game.away.linescores.map((ls, idx) => (
              <span key={idx} className="tabular-nums">
                {ls.value}-{game.home.linescores?.[idx]?.value ?? 0}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Situational or Last Play Footnote */}
      {showSituations && game.situation && !isCompact && (
        <div className="mt-3 pt-2.5 border-t border-[#2A2A2E] flex items-center justify-between gap-2 text-[11px] text-[#8E8E93]">
          <div className="truncate flex-1">
            {game.situation.downDistance && (
              <span className="font-bold text-white mr-1.5">
                {game.situation.downDistance}
              </span>
            )}
            {game.situation.batter && (
              <span className="font-bold text-white mr-1.5">
                {game.situation.batter.name} ({game.situation.batter.summary})
              </span>
            )}
            {game.situation.lastPlay && (
              <span className="text-[#636366] truncate">
                {game.situation.lastPlay}
              </span>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
