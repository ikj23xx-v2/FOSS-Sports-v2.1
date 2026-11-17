import React from 'react';
import { AppleHeader } from './AppleHeader';
import { LeagueHeroBanner } from './LeagueHeroBanner';
import { LiveActivityWidget } from './LiveActivityWidget';
import { LiveBreakingNewsTicker } from './LiveBreakingNewsTicker';
import { Game, HeaderBadgeStyle } from '../types';

interface MainFeedProps {
  userMarket: string;
  liveGames: Game[];
  totalMatchups: number;
  onOpenMarketModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onOpenSettings: () => void;
  onOpenGame: (game: Game) => void;
  onOpenProfile?: () => void;
  currentView?: 'scores' | 'standings' | 'news';
  onViewChange?: (view: 'scores' | 'standings' | 'news') => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  badgeStyle?: HeaderBadgeStyle;
  children: React.ReactNode; // For the league carousels
}

export const MainFeed: React.FC<MainFeedProps> = ({
  userMarket,
  liveGames,
  totalMatchups,
  onOpenMarketModal,
  onRefresh,
  isRefreshing,
  onOpenSettings,
  onOpenGame,
  onOpenProfile,
  currentView,
  onViewChange,
  isDarkMode = true,
  onToggleTheme,
  badgeStyle = 'dual_fs',
  children,
}) => {
  return (
    <div
      className={`min-h-screen pb-12 overflow-x-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-black text-white' : 'bg-[#F2F2F7] text-zinc-900'
      }`}
    >
      {/* 1. Sticky Top Navigation Header */}
      <AppleHeader
        userMarket={userMarket}
        onOpenMarketModal={onOpenMarketModal}
        onRefresh={onRefresh}
        isRefreshing={isRefreshing}
        onOpenSettings={onOpenSettings}
        onOpenProfile={onOpenProfile}
        currentView={currentView}
        onViewChange={onViewChange}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
        badgeStyle={badgeStyle}
      />

      {/* Main Content Flow with Consistent Vertical Spacing */}
      <main className="max-w-md mx-auto flex flex-col pt-2">
        {/* 2. Dynamic Island / Live Activity Ticker (Only shows if live games exist) */}
        {liveGames.length > 0 && (
          <div className="mb-2">
            <LiveActivityWidget liveGames={liveGames} onOpenGame={onOpenGame} />
          </div>
        )}

        {/* 3. Leagues Hero Banner */}
        <LeagueHeroBanner
          liveCount={liveGames.length}
          matchupCount={totalMatchups}
          userMarket={userMarket}
        />

        {/* 4. 3D Liquid Glass Breaking News Ticker Capsule */}
        <LiveBreakingNewsTicker activeLeagueId="all" />

        {/* 5. League Carousels Section */}
        <div className="mt-2 space-y-4">
          {children}
        </div>
      </main>
    </div>
  );
};
