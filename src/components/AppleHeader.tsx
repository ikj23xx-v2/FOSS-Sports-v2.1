import React, { useState, useEffect } from 'react';
import { Settings, RefreshCw, Tv, User, Sun, Moon, Zap } from 'lucide-react';
import { UserLocationMarket, UserProfile, HeaderBadgeStyle } from '../types';
import { HeaderStadiumBadge } from './HeaderStadiumBadge';

interface AppleHeaderProps {
  userMarket: string | UserLocationMarket;
  hasAssignedMarket?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onOpenMarketModal: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onOpenSettings: () => void;
  onOpenProfile?: () => void;
  onOpenArcBoost?: () => void;
  onBadgeClick?: () => void;
  currentView?: 'scores' | 'standings' | 'news';
  onViewChange?: (view: 'scores' | 'standings' | 'news') => void;
  currentUser?: UserProfile | null;
  badgeStyle?: HeaderBadgeStyle;
}

export const AppleHeader: React.FC<AppleHeaderProps> = ({
  userMarket,
  hasAssignedMarket = false,
  isDarkMode,
  onToggleTheme,
  onOpenMarketModal,
  onRefresh,
  isRefreshing = false,
  onOpenSettings,
  onOpenProfile,
  onOpenArcBoost,
  onBadgeClick,
  currentView = 'scores',
  onViewChange,
  currentUser,
  badgeStyle = 'dual_fs',
}) => {
  const marketDisplay =
    typeof userMarket === 'string'
      ? userMarket
      : userMarket?.cityName || '';

  // Internal dark mode fallback if not explicitly controlled from props
  const [internalDarkMode, setInternalDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    }
    return true;
  });

  const effectiveDarkMode = isDarkMode !== undefined ? isDarkMode : internalDarkMode;

  const handleToggle = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setInternalDarkMode((prev) => {
        const next = !prev;
        if (typeof document !== 'undefined') {
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return next;
      });
    }
  };

  // Tilt coordinates for 3D embossed pop-out depth effect
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Gyroscope orientation on real mobile devices
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma || 0; // Left/right (-90 to 90)
      const beta = e.beta || 0;   // Forward/back (-180 to 180)
      setTilt({
        x: Math.min(Math.max(gamma / 3, -12), 12),
        y: Math.min(Math.max(beta / 3, -12), 12),
      });
    };

    // Mouse movement simulation for desktop preview
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 14;
      setTilt({ x, y });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-300 border-b px-4 py-3 backdrop-blur-2xl ${
        effectiveDarkMode
          ? 'bg-black/80 border-white/10 text-white shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-white/85 border-black/10 text-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
      }`}
    >
      <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Desktop Nav */}
        {onViewChange ? (
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => onViewChange('scores')}
              className={`transition-colors py-1 cursor-pointer ${
                currentView === 'scores'
                  ? effectiveDarkMode
                    ? 'text-white font-bold border-b-2 border-white'
                    : 'text-black font-bold border-b-2 border-black'
                  : effectiveDarkMode
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Scores
            </button>
            <button
              onClick={() => onViewChange('standings')}
              className={`transition-colors py-1 cursor-pointer ${
                currentView === 'standings'
                  ? effectiveDarkMode
                    ? 'text-white font-bold border-b-2 border-white'
                    : 'text-black font-bold border-b-2 border-black'
                  : effectiveDarkMode
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Standings
            </button>
            <button
              onClick={() => onViewChange('news')}
              className={`transition-colors py-1 cursor-pointer ${
                currentView === 'news'
                  ? effectiveDarkMode
                    ? 'text-white font-bold border-b-2 border-white'
                    : 'text-black font-bold border-b-2 border-black'
                  : effectiveDarkMode
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Headlines
            </button>
          </nav>
        ) : (
          <div />
        )}

        {/* Right Controls: Moved to Far Right with 3D Halo Glow Effect & Stadium Badge */}
        <div className="ml-auto flex items-center justify-end gap-1.5 md:gap-2 flex-shrink-0">
          {/* Day / Night Mode Toggle with Golden Amber 3D Halo */}
          <button
            onClick={handleToggle}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer relative ${
              effectiveDarkMode
                ? 'bg-gradient-to-b from-[#26262B] via-[#151518] to-[#0A0A0D] border border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),0_0_16px_rgba(245,158,11,0.32),0_4px_16px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_22px_rgba(245,158,11,0.5),0_6px_20px_rgba(0,0,0,0.8)]'
                : 'bg-gradient-to-b from-white via-zinc-50 to-zinc-200 border border-black/15 shadow-[inset_0_1px_1.5px_rgba(255,255,255,1),0_0_14px_rgba(245,158,11,0.25),0_3px_12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_0_18px_rgba(245,158,11,0.35)]'
            }`}
            title={effectiveDarkMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          >
            {effectiveDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.65)]" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.45)]" />
            )}
          </button>

          {/* Location / Broadcast Market Button with 3D Luminous Glass Halo */}
          <button
            onClick={onOpenMarketModal}
            className={`h-9 flex items-center justify-center transition-all active:scale-95 cursor-pointer relative text-xs font-bold ${
              hasAssignedMarket && marketDisplay
                ? 'px-3 gap-2 rounded-full'
                : 'w-9 rounded-full'
            } ${
              effectiveDarkMode
                ? 'bg-gradient-to-b from-[#26262B] via-[#151518] to-[#0A0A0D] border border-white/30 text-white shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.45),0_0_16px_rgba(245,158,11,0.22),0_4px_16px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_22px_rgba(245,158,11,0.4),0_6px_20px_rgba(0,0,0,0.8)]'
                : 'bg-gradient-to-b from-white via-zinc-50 to-zinc-200 border border-black/15 text-zinc-900 shadow-[inset_0_1px_1.5px_rgba(255,255,255,1),0_0_12px_rgba(0,0,0,0.06),0_3px_12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_0_16px_rgba(245,158,11,0.25)]'
            }`}
            title={hasAssignedMarket && marketDisplay ? `TV Market: ${marketDisplay}` : 'Set Local TV Market & Clips'}
          >
            <Tv className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.55)] flex-shrink-0" />
            {hasAssignedMarket && marketDisplay && (
              <span className="max-w-[76px] truncate tracking-tight">{marketDisplay}</span>
            )}
          </button>

          {/* Sync / Refresh Button with Crystalline White-Cyan 3D Halo */}
          <button
            onClick={onRefresh}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer relative ${
              effectiveDarkMode
                ? 'bg-gradient-to-b from-[#26262B] via-[#151518] to-[#0A0A0D] border border-white/30 text-zinc-100 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),0_0_16px_rgba(56,189,248,0.28),0_4px_16px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_22px_rgba(56,189,248,0.45),0_6px_20px_rgba(0,0,0,0.8)]'
                : 'bg-gradient-to-b from-white via-zinc-50 to-zinc-200 border border-black/15 text-zinc-800 shadow-[inset_0_1px_1.5px_rgba(255,255,255,1),0_0_12px_rgba(0,0,0,0.06),0_3px_12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_0_16px_rgba(56,189,248,0.25)]'
            }`}
            title="Refresh Live Scores"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.5)] ${
                isRefreshing ? 'animate-spin text-white' : ''
              }`}
            />
          </button>

          {/* User Account Button with Emerald / Silver 3D Halo */}
          {onOpenProfile && (
            <button
              onClick={onOpenProfile}
              className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer ${
                effectiveDarkMode
                  ? 'bg-gradient-to-b from-[#26262B] via-[#151518] to-[#0A0A0D] border border-white/30 text-zinc-100 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),0_0_16px_rgba(52,211,153,0.28),0_4px_16px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_22px_rgba(52,211,153,0.45),0_6px_20px_rgba(0,0,0,0.8)]'
                  : 'bg-gradient-to-b from-white via-zinc-50 to-zinc-200 border border-black/15 text-zinc-800 shadow-[inset_0_1px_1.5px_rgba(255,255,255,1),0_0_12px_rgba(0,0,0,0.06),0_3px_12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_0_16px_rgba(52,211,153,0.25)]'
              }`}
              title={currentUser ? `Account: ${currentUser.displayName}` : 'User Account'}
            >
              {currentUser ? (
                <span className="text-[10px] font-bold font-mono text-white drop-shadow">
                  {currentUser.displayName.slice(0, 2).toUpperCase()}
                </span>
              ) : (
                <User className="w-3.5 h-3.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
              )}
              {currentUser && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#30D158] ring-1.5 ring-black shadow-[0_0_6px_#30D158]" />
              )}
            </button>
          )}

          {/* Arc Boost & Zapper Button with Neon Pink-Amber Halo */}
          {onOpenArcBoost && (
            <button
              onClick={onOpenArcBoost}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer relative ${
                effectiveDarkMode
                  ? 'bg-gradient-to-b from-[#26262B] via-[#151518] to-[#0A0A0D] border border-white/30 text-zinc-100 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),0_0_16px_rgba(244,63,94,0.35),0_4px_16px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_22px_rgba(244,63,94,0.5),0_6px_20px_rgba(0,0,0,0.8)]'
                  : 'bg-gradient-to-b from-white via-zinc-50 to-zinc-200 border border-black/15 text-zinc-800 shadow-[inset_0_1px_1.5px_rgba(255,255,255,1),0_0_12px_rgba(244,63,94,0.15),0_3px_12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_0_16px_rgba(244,63,94,0.3)]'
              }`}
              title="Arc Boosts & Visual Zapper ⚡"
            >
              <Zap className="w-3.5 h-3.5 text-pink-400 drop-shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
            </button>
          )}

          {/* App Settings Menu with Polished Metallic 3D Halo */}
          <button
            onClick={onOpenSettings}
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer relative ${
              effectiveDarkMode
                ? 'bg-gradient-to-b from-[#26262B] via-[#151518] to-[#0A0A0D] border border-white/30 text-zinc-100 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),0_0_16px_rgba(255,255,255,0.22),0_4px_16px_rgba(0,0,0,0.7)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_22px_rgba(255,255,255,0.35),0_6px_20px_rgba(0,0,0,0.8)]'
                : 'bg-gradient-to-b from-white via-zinc-50 to-zinc-200 border border-black/15 text-zinc-800 shadow-[inset_0_1px_1.5px_rgba(255,255,255,1),0_0_12px_rgba(0,0,0,0.06),0_3px_12px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,1),0_0_16px_rgba(255,255,255,0.2)]'
            }`}
            title="App Settings & APK Export"
          >
            <Settings className="w-3.5 h-3.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.4)]" />
          </button>

          {/* Far-Right Child: FOSS SPORTS Games Live Now Stadium Badge Overlay */}
          <HeaderStadiumBadge onClick={onBadgeClick} />
        </div>
      </div>
    </header>
  );
};
