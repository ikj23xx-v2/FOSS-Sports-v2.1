import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Game, NewsArticle, StandingsEntry, AppCustomization, UserLocationMarket, UserProfile, LeagueInfo } from './types';
import { espn } from './services/espn';
import { sounds } from './services/sound';
import { LEAGUES } from './services/mockData';
import { broadcastResolver } from './services/broadcastResolver';
import { kalshiService } from './services/kalshiService';
import { userManager } from './services/userManager';
import { AppleHeader } from './components/AppleHeader';
import { LeaguePills } from './components/LeaguePills';
import { LeagueHeaderView } from './components/LeagueHeaderView';
import { LeagueHeroBanner } from './components/LeagueHeroBanner';
import { LeagueHorizontalCarousel } from './components/LeagueHorizontalCarousel';
import { NewsTickerBar } from './components/NewsTickerBar';
import { LiveBreakingNewsTicker } from './components/LiveBreakingNewsTicker';
import { GameCard } from './components/GameCard';
import { GameDetailModal } from './components/GameDetailModal';
import { ApkExportModal } from './components/ApkExportModal';
import { SettingsModal } from './components/SettingsModal';
import { StandingsView } from './components/StandingsView';
import { NewsView } from './components/NewsView';
import { AppleDock } from './components/AppleDock';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { GamePredictionModal } from './components/GamePredictionModal';
import { WeeklyDraftRoom } from './components/WeeklyDraftRoom';
import { BroadcastMarketModal } from './components/BroadcastMarketModal';
import { PackOpeningModal } from './components/PackOpeningModal';
import { SplashScreen } from './components/SplashScreen';
import { CinematicSplash } from './components/CinematicSplash';
import { DreamcastConsoleSplash } from './components/DreamcastConsoleSplash';
import { ArcBoostModal } from './components/ArcBoostModal';
import { useBoostSettings } from './hooks/useBoostSettings';
import { useFoldableDevice } from './hooks/useFoldableDevice';
import { SportFieldBackground, SportType } from './components/SportFieldBackground';
import { DynamicLeagueMarquee, ActiveTab } from './components/DynamicLeagueMarquee';
import { CardData } from './components/HoloCard';
import { MatchAlertService } from './services/MatchAlertService';
import { AlertCircle, Sparkles, Layers, ArrowLeft, Smartphone } from 'lucide-react';
import { CosmicWarpIntro } from './components/CosmicWarpIntro';
import { LiveActivityWidget } from './components/LiveActivityWidget';
import { LiveScorecardWithMeter } from './components/LiveScorecardWithMeter';
import { TeamHomeHubModal } from './components/TeamHomeHubModal';
import { LeagueType } from './components/SportsFeedCard';
import { getAppIconDataUrl } from './components/AppIcon';

const DEFAULT_CUSTOMIZATION: AppCustomization = {
  themePreset: 'oled',
  accentColor: '#FFFFFF',
  cardDensity: 'standard',
  radiusStyle: 'standard',
  upperHeadings: true,
  hideScoresSpoiler: false,
  showOdds: false,
  showKalshi: false,
  showSituations: true,
  showTicker: true,
  tickerContextual: true,
  startPage: 'scores',
  soundPack: 'apple',
  appIcon: 'stadium',
  cosmicWarpIntro: true,
  showMarketConsensus: true,
  marketProviders: ['Kalshi', 'Polymarket', 'DraftKings', 'FanDuel'],
  headerBadgeStyle: 'dual_fs',
  leagueJinglesEnabled: true,
};


const FOLLOWED_LEAGUES = ['nba', 'f1', 'nfl', 'mlb', 'nhl', 'epl', 'mls'];

export default function App() {
  const [currentLeague, setCurrentLeague] = useState<string>('all');
  const [currentView, setCurrentView] = useState<'scores' | 'standings' | 'news'>('scores');
  const [games, setGames] = useState<Game[]>([]);
  const [gamesByLeague, setGamesByLeague] = useState<Record<string, Game[]>>({});
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [standings, setStandings] = useState<StandingsEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isApkModalOpen, setIsApkModalOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => userManager.getCurrentUser());
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsArticle | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(15);
  const [isSimulator, setIsSimulator] = useState<boolean>(true);
  const [userMarket, setUserMarket] = useState<UserLocationMarket>(() => broadcastResolver.getMarket());
  const [hasAssignedMarket, setHasAssignedMarket] = useState<boolean>(() => broadcastResolver.hasUserAssignedMarket());
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState<boolean>(false);
  const [isPackModalOpen, setIsPackModalOpen] = useState<boolean>(false);
  const [predictingGame, setPredictingGame] = useState<Game | null>(null);
  const [userPoints, setUserPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('foss_user_points');
      const parsed = saved ? parseInt(saved, 10) : NaN;
      return Number.isFinite(parsed) && parsed >= 0 ? parsed : 750;
    } catch {
      return 750;
    }
  });
  const [isDraftRoomOpen, setIsDraftRoomOpen] = useState<boolean>(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState<boolean>(false);
  const [showDreamcastSignup, setShowDreamcastSignup] = useState<boolean>(false);
  const [selectedHubTeam, setSelectedHubTeam] = useState<{
    name: string;
    league: LeagueType;
    gradient?: string;
  } | null>(null);
  useBoostSettings();
  const { isFoldableHardware, isUnfolded } = useFoldableDevice();
  const [showArenaSplash, setShowArenaSplash] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem('foss_arena_splash_dismissed');
    } catch {
      return false;
    }
  });

  const activeSportType: SportType = useMemo(() => {
    if (currentLeague === 'nfl') return 'nfl';
    if (currentLeague === 'mlb') return 'mlb';
    if (currentLeague === 'nhl') return 'nhl';
    return 'nba';
  }, [currentLeague]);

  const activeMarqueeTab: ActiveTab = useMemo(() => {
    if (currentLeague === 'all') return 'leagues';
    if (['nba', 'nfl', 'mlb', 'nhl'].includes(currentLeague)) {
      return currentLeague as ActiveTab;
    }
    return 'leagues';
  }, [currentLeague]);

  const rewardCards: CardData[] = useMemo(() => [
    { id: 'c-1', name: 'Jayson Tatum', team: 'BOS', league: 'NBA', position: 'SF', projectedPoints: 34.8, image: '🍀', isFoil: true, multiplier: 2.5, serialNumber: '07/25' },
    { id: 'c-2', name: 'Patrick Mahomes', team: 'KC', league: 'NFL', position: 'QB', projectedPoints: 28.5, image: '🏹', isFoil: true, multiplier: 1.8, serialNumber: '12/50' },
    { id: 'c-3', name: 'Shohei Ohtani', team: 'LAD', league: 'MLB', position: 'DH', projectedPoints: 31.2, image: '⚾', isFoil: true, multiplier: 2.0, serialNumber: '01/10' },
    { id: 'c-4', name: 'Connor McDavid', team: 'EDM', league: 'NHL', position: 'C', projectedPoints: 26.4, image: '🏒', isFoil: false, multiplier: 1.0 },
    { id: 'c-5', name: 'Anthony Edwards', team: 'MIN', league: 'NBA', position: 'SG', projectedPoints: 27.1, image: '🐺', isFoil: false, multiplier: 1.0 },
  ], []);

  // Customization & Themes from C.kt
  const [customization, setCustomization] = useState<AppCustomization>(() => {
    try {
      const saved = localStorage.getItem('foss_customization');
      if (saved) {
        return { ...DEFAULT_CUSTOMIZATION, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_CUSTOMIZATION;
  });

  // Cosmic Warp Cold Start Splash screen
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    try {
      const alreadyShown = sessionStorage.getItem('foss_splash_shown');
      return !alreadyShown && customization.cosmicWarpIntro;
    } catch {
      return false;
    }
  });

  // Favorite teams in local storage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('foss_fav_teams');
      return saved ? JSON.parse(saved) : ['bos-celtics', 'kc-chiefs', 'ny-yankees', 'ars-arsenal'];
    } catch {
      return ['bos-celtics', 'kc-chiefs', 'ny-yankees', 'ars-arsenal'];
    }
  });

  const toggleFavorite = (teamId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId];
      localStorage.setItem('foss_fav_teams', JSON.stringify(next));
      return next;
    });
  };

  // Update customization & sync with DOM dataset and root variables
  const updateCustomization = (updates: Partial<AppCustomization>) => {
    setCustomization((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('foss_customization', JSON.stringify(next));
      return next;
    });
  };

  // Sync theme to root DOM
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', customization.themePreset);
    root.setAttribute('data-radius', customization.radiusStyle);

    if (customization.themePreset === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }

    if (customization.themePreset === 'custom' && customization.customTheme) {
      const ct = customization.customTheme;
      root.style.setProperty('--theme-bg', ct.bg);
      root.style.setProperty('--theme-card', ct.card);
      root.style.setProperty('--theme-card-hover', `${ct.card}E6`);
      root.style.setProperty('--theme-border', ct.cardBorder);
      root.style.setProperty('--theme-text', ct.text);
      root.style.setProperty('--theme-text-muted', ct.text2);
      root.style.setProperty('--theme-text-dim', `${ct.text2}99`);
      root.style.setProperty('--theme-dock-bg', `${ct.card}E0`);
      root.style.setProperty('--theme-accent', ct.accent);
      root.style.setProperty('--theme-accent-text', ct.accent === '#FFFFFF' ? '#000000' : '#FFFFFF');
      root.style.setProperty('--theme-radius', `${ct.cornerRadius}px`);
      document.body.style.backgroundColor = ct.bg;
    } else {
      root.style.removeProperty('--theme-bg');
      root.style.removeProperty('--theme-card');
      root.style.removeProperty('--theme-card-hover');
      root.style.removeProperty('--theme-border');
      root.style.removeProperty('--theme-text');
      root.style.removeProperty('--theme-text-muted');
      root.style.removeProperty('--theme-text-dim');
      root.style.removeProperty('--theme-dock-bg');
      root.style.removeProperty('--theme-radius');
      document.body.style.removeProperty('background-color');

      if (customization.accentColor && customization.themePreset !== 'light') {
        root.style.setProperty('--theme-accent', customization.accentColor);
        root.style.setProperty('--theme-accent-text', customization.accentColor === '#FFFFFF' ? '#000000' : '#FFFFFF');
      } else {
        root.style.removeProperty('--theme-accent');
        root.style.removeProperty('--theme-accent-text');
      }
    }
  }, [customization.themePreset, customization.radiusStyle, customization.accentColor, customization.customTheme]);

  // Sync selected app launcher icon with browser favicon (preserve PNG apple-touch-icon)
  useEffect(() => {
    try {
      const iconUrl = getAppIconDataUrl(customization.appIcon || 'stadium');
      const iconLink = document.querySelector<HTMLLinkElement>("link[rel*='icon']:not([rel='apple-touch-icon'])");
      if (iconLink) {
        iconLink.href = iconUrl;
      }
    } catch (err) {
      console.error('Error synchronizing app icon to document head:', err);
    }
  }, [customization.appIcon]);

  // Fetch games for active league or all leagues with location broadcast channels
  const loadData = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    setIsRefreshing(true);
    try {
      if (currentLeague === 'all') {
        const results = await Promise.all(
          FOLLOWED_LEAGUES.map(async (lKey) => {
            try {
              const fetched = await espn.fetchScoreboard(lKey);
              const resolved = fetched.map((g) => {
                const withBc: Game = {
                  ...g,
                  broadcastDetails: broadcastResolver.resolveChannel(g, userMarket),
                };
                withBc.kalshi = g.kalshi || kalshiService.resolveMarket(withBc);
                return withBc;
              });
              return { key: lKey, games: resolved };
            } catch {
              return { key: lKey, games: [] };
            }
          })
        );
        const byLeague: Record<string, Game[]> = {};
        let allCombined: Game[] = [];
        results.forEach((r) => {
          byLeague[r.key] = r.games;
          allCombined = allCombined.concat(r.games);
        });
        setGamesByLeague((prev) => ({ ...prev, ...byLeague }));
        setGames(allCombined);
        const fetchedNews = await espn.fetchNews('nba');
        setNews(fetchedNews);
      } else {
        const [fetchedGames, fetchedNews, fetchedStandings] = await Promise.all([
          espn.fetchScoreboard(currentLeague),
          espn.fetchNews(currentLeague === 'my_teams' ? 'nba' : currentLeague),
          espn.fetchStandings(currentLeague === 'my_teams' ? 'nba' : currentLeague),
        ]);
        const gamesWithBroadcast = fetchedGames.map((g) => {
          const withBc: Game = {
            ...g,
            broadcastDetails: broadcastResolver.resolveChannel(g, userMarket),
          };
          withBc.kalshi = g.kalshi || kalshiService.resolveMarket(withBc);
          return withBc;
        });
        setGames(gamesWithBroadcast);
        setGamesByLeague((prev) => ({ ...prev, [currentLeague]: gamesWithBroadcast }));
        setNews(fetchedNews);
        setStandings(fetchedStandings);
      }
    } catch (err) {
      console.error('Failed to load ESPN data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentLeague, userMarket]);


  const handleSelectMarket = (m: UserLocationMarket) => {
    setUserMarket(m);
    broadcastResolver.setMarket(m);
    setGames((prev) =>
      prev.map((g) => ({
        ...g,
        broadcastDetails: broadcastResolver.resolveChannel(g, m),
      }))
    );
  };

  const handleDetectLocation = async () => {
    const detected = await broadcastResolver.detectLocation();
    setUserMarket(detected);
    setGames((prev) =>
      prev.map((g) => ({
        ...g,
        broadcastDetails: broadcastResolver.resolveChannel(g, detected),
      }))
    );
  };

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periodic background tick
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [loadData, refreshInterval]);

  // Live Simulator Clock & Score Ticker (runs in background)
  useEffect(() => {
    if (!isSimulator) return;

    const simTimer = setInterval(() => {
      const updateGameItem = (g: Game): Game => {
        if (!g.live || g.league === 'f1' || g.f1Race) return g;

        let newClock = g.clock;
        if (g.clock && g.clock.includes(':')) {
          const [min, sec] = g.clock.split(':').map(Number);
          if (Number.isFinite(min) && Number.isFinite(sec)) {
            const totalSec = Math.max(0, min * 60 + sec - 3);
            const m = Math.floor(totalSec / 60);
            const s = totalSec % 60;
            newClock = `${m}:${s < 10 ? '0' : ''}${s}`;
          }
        }

        let newHome = g.home;
        let newAway = g.away;
        let newSituation = g.situation;

        if (Math.random() < 0.15) {
          const isHomeScoring = Math.random() > 0.5;
          const pts = g.league === 'nfl' ? (Math.random() > 0.6 ? 7 : 3) : (g.league === 'epl' || g.league === 'mls' ? 1 : (Math.random() > 0.4 ? 2 : 3));

          if (isHomeScoring) {
            const parsedPrev = parseInt(String(g.home.score ?? 0), 10);
            const prev = Number.isFinite(parsedPrev) ? parsedPrev : 0;
            newHome = { ...g.home, score: prev + pts };
          } else {
            const parsedPrev = parseInt(String(g.away.score ?? 0), 10);
            const prev = Number.isFinite(parsedPrev) ? parsedPrev : 0;
            newAway = { ...g.away, score: prev + pts };
          }

          sounds.playScore();
          newSituation = {
            ...g.situation,
            lastPlay: `${isHomeScoring ? g.home.team.name : g.away.team.name} scores! (+${pts} pts)`,
          };
        }

        const updatedGame: Game = {
          ...g,
          clock: newClock,
          home: newHome,
          away: newAway,
          situation: newSituation,
        };
        updatedGame.kalshi = kalshiService.resolveMarket(updatedGame);
        return updatedGame;
      };

      setGames((prev) => prev.map(updateGameItem));
      setGamesByLeague((prev) => {
        const next: Record<string, Game[]> = {};
        Object.entries(prev).forEach(([key, list]) => {
          next[key] = list.map(updateGameItem);
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(simTimer);
  }, [isSimulator]);

  // Manual simulation trigger for a specific game
  const handleSimulatePlay = (gameId: string) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id !== gameId || g.league === 'f1' || g.f1Race) return g;
        const parsedAway = parseInt(String(g.away.score ?? 0), 10);
        const parsedHome = parseInt(String(g.home.score ?? 0), 10);
        const currentAway = Number.isFinite(parsedAway) ? parsedAway : 0;
        const currentHome = Number.isFinite(parsedHome) ? parsedHome : 0;
        const isHome = Math.random() > 0.5;
        const points = g.league === 'nfl' ? 7 : (g.league === 'epl' ? 1 : 3);

        const updated: Game = {
          ...g,
          home: isHome ? { ...g.home, score: currentHome + points } : g.home,
          away: !isHome ? { ...g.away, score: currentAway + points } : g.away,
          situation: {
            ...g.situation,
            lastPlay: `${isHome ? g.home.team.name : g.away.team.name} executed scoring drive (+${points} PTS)`,
          },
        };
        updated.kalshi = kalshiService.resolveMarket(updated);
        setSelectedGame(updated);

        // Web Audio API Synthesized Crowd Cheer & Sport-specific Haptic Alert
        MatchAlertService.playSportCheer(g.league || 'nba');

        return updated;
      })
    );
  };

  const handleMakePrediction = (gameId: string, pickedTeam: 'home' | 'away', pointsWagered: number) => {
    const safeWager = Number.isFinite(pointsWagered) ? Math.max(0, pointsWagered) : 0;
    setUserPoints((prev) => {
      const safePrev = Number.isFinite(prev) ? prev : 750;
      const next = Math.max(0, safePrev - safeWager);
      localStorage.setItem('foss_user_points', String(next));
      return next;
    });
  };

  const liveCountByLeague = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.entries(gamesByLeague).forEach(([lKey, list]) => {
      counts[lKey] = list.filter((g) => g.live || g.state === 'in').length;
    });
    return counts;
  }, [gamesByLeague]);

  const liveCount = useMemo(() => {
    return games.filter((g) => g.live || g.state === 'in').length;
  }, [games]);

  const activeLiveGames = useMemo(() => {
    return games.filter((g) => g.live || g.state === 'in');
  }, [games]);

  const activeLeagueObj: LeagueInfo = useMemo(() => {
    if (currentLeague === 'all') {
      return {
        key: 'all',
        name: 'All Followed Leagues',
        short: 'ALL',
        tab: 'All Leagues',
        sport: 'basketball',
        espnSport: 'all',
        espnLeague: 'all',
        emblem: 'https://a.espncdn.com/combiner/i?img=/i/teamlogos/leagues/500/nba.png',
        seasonPhase: 'Live ESPN Clocks & Broadcasts Across Leagues',
      };
    }
    return LEAGUES.find((l) => l.key === currentLeague) || LEAGUES[1];
  }, [currentLeague]);

  const handleDockSelect = (tab: 'scores' | 'live' | 'news' | 'settings') => {
    if (tab === 'scores') {
      setCurrentView('scores');
    } else if (tab === 'live') {
      setCurrentView('scores');
      const firstLive = games.find((g) => g.live);
      if (firstLive) {
        setSelectedGame(firstLive);
      }
    } else if (tab === 'news') {
      setCurrentView('news');
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    }
  };


  const isDarkMode = customization.themePreset !== 'light';
  const handleToggleTheme = () => {
    updateCustomization({
      themePreset: isDarkMode ? 'light' : 'oled',
    });
  };

  return (
    <SportFieldBackground sport={activeSportType}>
      <div className={`min-h-screen theme-canvas flex flex-col font-sans transition-colors duration-200 ${isUnfolded ? 'max-w-[1400px] mx-auto' : ''}`}>
        {/* Apple Sports Clean Top Bar */}
        <AppleHeader
          currentView={currentView}
          onViewChange={(v) => setCurrentView(v)}
          onRefresh={() => loadData()}
          isRefreshing={isRefreshing}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenArcBoost={() => setIsBoostModalOpen(true)}
          userMarket={userMarket}
          hasAssignedMarket={hasAssignedMarket}
          onOpenMarketModal={() => setIsBroadcastModalOpen(true)}
          currentUser={currentUser}
          isDarkMode={isDarkMode}
          onToggleTheme={handleToggleTheme}
          badgeStyle={customization.headerBadgeStyle || 'dual_fs'}
          onBadgeClick={() => {
            setIsDraftRoomOpen(true);
          }}
        />

        {/* Foldable Device Hardware Posture Indicator Pill (when unfolded) */}
        {isFoldableHardware && isUnfolded && (
          <div className="w-full flex justify-center pt-1.5 pb-0.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              <Smartphone className="w-3 h-3 text-cyan-400 rotate-90" />
              <span>DUAL SCREEN BOOK MODE · ACTIVE</span>
            </div>
          </div>
        )}

        {/* Dynamic Infinite League & Team Marquee Strip */}
        <DynamicLeagueMarquee
          currentTab={activeMarqueeTab}
          onSelectTeamOrLeague={(id) => {
            if (['nba', 'nfl', 'mlb', 'nhl'].includes(id)) {
              setCurrentLeague(id);
              return;
            }
            const teamMap: Record<string, { name: string; league: LeagueType }> = {
              bos: { name: 'Boston Celtics', league: 'nba' },
              chi: { name: 'Chicago Bulls', league: 'nba' },
              gsw: { name: 'Golden State Warriors', league: 'nba' },
              lal: { name: 'Los Angeles Lakers', league: 'nba' },
              nyk: { name: 'New York Knicks', league: 'nba' },
              mil: { name: 'Milwaukee Bucks', league: 'nba' },
              kc: { name: 'Kansas City Chiefs', league: 'nfl' },
              bal: { name: 'Baltimore Ravens', league: 'nfl' },
              det: { name: 'Detroit Lions', league: 'nfl' },
              buf: { name: 'Buffalo Bills', league: 'nfl' },
              phi: { name: 'Philadelphia Eagles', league: 'nfl' },
              lad: { name: 'Los Angeles Dodgers', league: 'mlb' },
              nyy: { name: 'New York Yankees', league: 'mlb' },
              cle: { name: 'Cleveland Guardians', league: 'mlb' },
              edm: { name: 'Edmonton Oilers', league: 'nhl' },
              fla: { name: 'Florida Panthers', league: 'nhl' },
              col: { name: 'Colorado Avalanche', league: 'nhl' },
              dal: { name: 'Dallas Stars', league: 'nhl' },
            };
            const match = teamMap[id.toLowerCase()];
            if (match) {
              sounds.playTap();
              setSelectedHubTeam(match);
            }
          }}
        />

        {/* Main Container */}
        <main className={`flex-1 w-full mx-auto pb-28 pt-2 ${isUnfolded ? 'max-w-6xl' : 'max-w-7xl'}`}>
          {/* League Pills Segmented Selector */}
          <LeaguePills
            selectedKey={currentLeague}
            onSelect={(key) => setCurrentLeague(key)}
            liveCountByLeague={liveCountByLeague}
          />

        {/* Breaking News Ticker Capsule */}
        {customization.showTicker && (
          <LiveBreakingNewsTicker
            activeLeagueId={currentLeague}
            onOpenArticle={(art) => {
              setSelectedNewsArticle({
                id: art.id,
                title: art.headline,
                summary: art.headline,
                link: art.url,
                time: Date.now(),
                league: currentLeague,
                byline: art.source,
              });
            }}
          />
        )}

        {/* Dynamic Content Views */}
        <div className="px-4 sm:px-6 mt-4">
          {currentView === 'scores' && (
            <div className="space-y-6">
              {/* Apple Sports 1:1 Live Activity Widget (Dynamic Island & Lock Screen Banner) */}
              <LiveActivityWidget
                liveGames={activeLiveGames}
                onOpenGame={(g) => setSelectedGame(g)}
              />

              {/* Live Matchup Scorecard with Interactive Clutch Meter */}
              {activeLiveGames.length > 0 && (
                <div className="max-w-md mx-auto w-full">
                  <LiveScorecardWithMeter
                    game={activeLiveGames.find((g) => g.league !== 'f1' && !g.f1Race) || activeLiveGames[0]}
                    userPoints={userPoints}
                    onPredictionSubmitted={handleMakePrediction}
                  />
                </div>
              )}

              {currentLeague === 'all' ? (
                <>
                  {/* Quick Mobile / Foldable Install & APK Access Bar */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        setIsApkModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition active:scale-95 cursor-pointer"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Install App / Android APK</span>
                    </button>
                  </div>

                  {/* Hero Banner for All Leagues Slate */}
                  <LeagueHeroBanner
                    league={activeLeagueObj}
                    liveCount={liveCount}
                    matchupCount={games.length}
                    totalGames={games.length}
                    userMarket={userMarket?.cityName || 'Boston'}
                    marketCity={userMarket?.cityName}
                  />

                  {/* League-by-League Vertical Feed with Horizontal Scrolling Palm Pre Cards */}
                  {isLoading && games.length === 0 ? (
                    <div className="space-y-6">
                      {[1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className="h-44 theme-card border animate-pulse p-4 rounded-3xl"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {FOLLOWED_LEAGUES.map((lKey) => {
                        const lObj = LEAGUES.find((l) => l.key === lKey);
                        if (!lObj) return null;
                        const lGames = gamesByLeague[lKey] || [];
                        return (
                          <LeagueHorizontalCarousel
                            key={lKey}
                            league={lObj}
                            games={lGames}
                            onSelectGame={(g) => setSelectedGame(g)}
                            onSeeAll={() => setCurrentLeague(lKey)}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Back to All Leagues Navigation Action */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        sounds.playTabSwitch();
                        setCurrentLeague('all');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>All Leagues Feed</span>
                    </button>
                  </div>

                  {/* Apple Sports Official Brand Badge & Typography Lockup */}
                  <LeagueHeaderView
                    league={activeLeagueObj}
                    liveCount={liveCount}
                    totalGames={games.length}
                    themePreset={customization.themePreset}
                    upperHeadings={customization.upperHeadings}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                    onOpenExport={() => setIsApkModalOpen(true)}
                  />

                  {/* Apple TV-style Panoramic Hero Banner */}
                  <LeagueHeroBanner
                    league={activeLeagueObj}
                    liveCount={liveCount}
                    matchupCount={games.length}
                    totalGames={games.length}
                    userMarket={userMarket?.cityName || 'Boston'}
                    marketCity={userMarket?.cityName}
                  />

                  {/* Horizontal Palm Pre Carousel Preview */}
                  <LeagueHorizontalCarousel
                    league={activeLeagueObj}
                    games={games}
                    onSelectGame={(g) => setSelectedGame(g)}
                  />

                  {/* Matchups Grid with customization */}
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[1, 2, 3, 4, 5, 6].map((idx) => (
                        <div
                          key={idx}
                          className="h-44 theme-card border animate-pulse p-4 rounded-3xl"
                        />
                      ))}
                    </div>
                  ) : games.length === 0 ? (
                    <div className="theme-card border p-12 text-center max-w-md mx-auto my-8 rounded-3xl">
                      <AlertCircle className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-white mb-1">
                        No Scheduled Games Today
                      </h3>
                      <p className="text-xs theme-text-muted mb-4">
                        There are no games scheduled today for {activeLeagueObj.name}.
                      </p>
                      <button
                        onClick={() => {
                          sounds.playTap();
                          setCurrentLeague('all');
                        }}
                        className="px-4 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                      >
                        Back to All Leagues
                      </button>
                    </div>
                  ) : (
                    <div
                      className={`grid gap-4 ${
                        customization.cardDensity === 'compact'
                          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                          : customization.cardDensity === 'expanded'
                          ? 'grid-cols-1 lg:grid-cols-2'
                          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                      }`}
                    >
                      {games.map((g) => (
                        <GameCard
                          key={g.id}
                          game={g}
                          onSelect={(game) => setSelectedGame(game)}
                          isFavorite={favorites.includes(g.home.team.id) || favorites.includes(g.away.team.id)}
                          onToggleFavorite={toggleFavorite}
                          customization={customization}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {currentView === 'standings' && (
            <StandingsView
              leagueName={activeLeagueObj.name}
              entries={standings}
            />
          )}

          {currentView === 'news' && (
            <NewsView
              articles={news}
              selectedLeague={activeLeagueObj.name}
              onSelectTeam={(teamName, league, gradient) => {
                setSelectedHubTeam({ name: teamName, league, gradient });
              }}
            />
          )}
        </div>
      </main>

      {/* Apple Floating Frosted Glass Dock */}
      <AppleDock
        currentTab={currentView === 'scores' ? 'scores' : currentView === 'news' ? 'news' : 'scores'}
        onSelectTab={handleDockSelect}
        liveCount={liveCount}
      />

      {/* Game Detail Bottom Sheet / Modal */}
      <GameDetailModal
        initialGame={selectedGame}
        game={selectedGame}
        games={games}
        onClose={() => setSelectedGame(null)}
        onSimulatePlay={handleSimulatePlay}
        onOpenPredictor={(g) => setPredictingGame(g)}
        customization={customization}
      />

      {/* FOSS Sports Matchup Predictor & Wager Modal */}
      {predictingGame && (
        <GamePredictionModal
          game={predictingGame}
          userPoints={userPoints}
          onClose={() => setPredictingGame(null)}
          onMakePrediction={handleMakePrediction}
        />
      )}

      {/* Weekly Mock Snake Draft Room */}
      {isDraftRoomOpen && (
        <WeeklyDraftRoom
          onClose={() => setIsDraftRoomOpen(false)}
          onOpenPack={() => {
            setIsDraftRoomOpen(false);
            setIsPackModalOpen(true);
          }}
        />
      )}

      {/* Broadcast TV Market & Team Clips Modal */}
      <BroadcastMarketModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        currentMarket={userMarket}
        onSelectMarket={(m) => {
          setUserMarket(m);
          setHasAssignedMarket(true);
          broadcastResolver.setMarket(m);
        }}
      />

      {/* Topps Bunt Style Holographic Foil Pack Opening Modal */}
      {isPackModalOpen && (
        <PackOpeningModal
          league="NBA"
          cards={rewardCards}
          onComplete={() => setIsPackModalOpen(false)}
        />
      )}

      {/* APK & Android Source Code Export Hub Modal */}
      <ApkExportModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />

      {/* Settings & Themes Customization Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isSimulator={isSimulator}
        onToggleSimulator={() => setIsSimulator((prev) => !prev)}
        refreshInterval={refreshInterval}
        onSetRefreshInterval={(sec) => setRefreshInterval(sec)}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        customization={customization}
        onUpdateCustomization={updateCustomization}
        onPreviewWarp={() => setShowSplash(true)}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenArcBoost={() => setIsBoostModalOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
      />

      {/* User Account & Profile Sheet Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onOpenAuth={() => {
          setIsProfileOpen(false);
          setIsAuthOpen(true);
        }}
        onUpdateUser={(updates: Partial<UserProfile>) => {
          if (currentUser) {
            const updated = userManager.updateUser(updates);
            if (updated) setCurrentUser(updated);
          }
        }}
        onSignOut={() => {
          userManager.signOut();
          setCurrentUser(null);
        }}
        favoritesCount={favorites.length}
        themeName={customization.themePreset}
      />

      {/* Authentication & SMS 2FA Verification Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }}
      />

      {/* Arc Boosts & Visual Zapper Modal */}
      <ArcBoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
      />

      {/* Team Headquarters Bottom-Sheet Modal (Jerseys, Roster, Standings, News) */}
      {selectedHubTeam && (
        <TeamHomeHubModal
          teamName={selectedHubTeam.name}
          league={selectedHubTeam.league}
          teamGradient={selectedHubTeam.gradient}
          isOpen={!!selectedHubTeam}
          onClose={() => setSelectedHubTeam(null)}
        />
      )}

      {/* Cinematic Arena Intro Splash Screen */}
      {showArenaSplash && (
        <CinematicSplash
          onEnter={() => {
            setShowArenaSplash(false);
            try { sessionStorage.setItem('foss_arena_splash_dismissed', 'true'); } catch {}
          }}
          onClose={() => {
            setShowArenaSplash(false);
            try { sessionStorage.setItem('foss_arena_splash_dismissed', 'true'); } catch {}
          }}
        />
      )}

      {/* 2K Dreamcast Console Profile Creation Splash */}
      {showDreamcastSignup && (
        <DreamcastConsoleSplash
          onSignUp={(username, email) => {
            const newUser: UserProfile = {
              uid: `user-${Date.now()}`,
              displayName: username,
              email: email,
              phoneNumber: '',
              is2FAEnabled: false,
              avatarUrl: '',
              createdAt: Date.now(),
            };
            userManager.saveUser(newUser);
            setCurrentUser(newUser);
            setShowDreamcastSignup(false);
            sounds.playScore();
          }}
          onClose={() => setShowDreamcastSignup(false)}
        />
      )}

      {/* Cosmic Warp 3D Space Intro Splash Screen (Cold start & Settings preview) */}
      {showSplash && (
        <CosmicWarpIntro
          appIcon={customization.appIcon || 'stadium'}
          onFinish={() => {
            try {
              sessionStorage.setItem('foss_splash_shown', 'true');
            } catch {
              // Ignore
            }
            setShowSplash(false);
          }}
        />
      )}
      </div>
    </SportFieldBackground>
  );
}
