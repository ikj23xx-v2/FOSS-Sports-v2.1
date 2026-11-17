import React from 'react';
import { motion } from 'framer-motion';

export type ActiveTab = 'leagues' | 'nba' | 'nfl' | 'mlb' | 'nhl';

interface MarqueeItem {
  id: string;
  name: string;
  logo: string;
  detail: string;
  tag?: string;
  accentColor?: string;
}

// 1. Universal Multi-Sport Overview Feed (Only for "Leagues" tab)
const ALL_LEAGUES_DATA: MarqueeItem[] = [
  { id: 'nba', name: 'NBA', logo: '🏀', detail: '6 LIVE', accentColor: '#1D428A' },
  { id: 'nfl', name: 'NFL', logo: '🏈', detail: 'THU NIGHT', accentColor: '#013369' },
  { id: 'mlb', name: 'MLB', logo: '⚾', detail: 'SPRING TR.', accentColor: '#041E42' },
  { id: 'nhl', name: 'NHL', logo: '🏒', detail: '4 LIVE', accentColor: '#CF4520' },
  { id: 'wnba', name: 'WNBA', logo: '🏀', detail: 'OFFSEASON', accentColor: '#FA4616' },
];

// 2. Dedicated Single-League Data Pools (Triggered when inside NBA, NFL, MLB, or NHL tabs)
const LEAGUE_ISOLATED_DATA: Record<Exclude<ActiveTab, 'leagues'>, { leagueName: string; leagueLogo: string; accent: string; items: MarqueeItem[] }> = {
  nba: {
    leagueName: 'NBA',
    leagueLogo: '🏀',
    accent: '#1D428A',
    items: [
      { id: 'bos', name: 'BOSTON CELTICS', logo: '🍀', detail: '34-10', tag: '#1 EAST', accentColor: '#007A33' },
      { id: 'chi', name: 'CHICAGO BULLS', logo: '🐂', detail: '21-23', tag: '#9 EAST', accentColor: '#CE1141' },
      { id: 'gsw', name: 'GOLDEN STATE', logo: '🌉', detail: '25-19', tag: '#6 WEST', accentColor: '#1D428A' },
      { id: 'lal', name: 'LA LAKERS', logo: '👑', detail: '26-18', tag: '#5 WEST', accentColor: '#552583' },
      { id: 'nyk', name: 'NEW YORK', logo: '🗽', detail: '29-15', tag: '#3 EAST', accentColor: '#F58426' },
      { id: 'mil', name: 'MILWAUKEE', logo: '🦌', detail: '31-13', tag: '#2 EAST', accentColor: '#00471B' },
    ],
  },
  nfl: {
    leagueName: 'NFL',
    leagueLogo: '🏈',
    accent: '#013369',
    items: [
      { id: 'kc', name: 'KANSAS CITY', logo: '🏹', detail: '13-2', tag: '#1 AFC', accentColor: '#E31837' },
      { id: 'bal', name: 'BALTIMORE', logo: '🐦', detail: '12-3', tag: '#2 AFC', accentColor: '#241773' },
      { id: 'det', name: 'DETROIT', logo: '🦁', detail: '13-2', tag: '#1 NFC', accentColor: '#0076B6' },
      { id: 'buf', name: 'BUFFALO', logo: '🦬', detail: '11-4', tag: '#3 AFC', accentColor: '#00338D' },
      { id: 'phi', name: 'PHILADELPHIA', logo: '🦅', detail: '12-3', tag: '#2 NFC', accentColor: '#004C54' },
    ],
  },
  mlb: {
    leagueName: 'MLB',
    leagueLogo: '⚾',
    accent: '#041E42',
    items: [
      { id: 'lad', name: 'LA DODGERS', logo: '⚾', detail: '98-64', tag: 'NL WEST', accentColor: '#005A9C' },
      { id: 'nyy', name: 'NY YANKEES', logo: '🗽', detail: '94-68', tag: 'AL EAST', accentColor: '#0C2340' },
      { id: 'cle', name: 'CLEVELAND', logo: '🛡️', detail: '92-69', tag: 'AL CENT', accentColor: '#E31937' },
      { id: 'bal', name: 'BALTIMORE', logo: '🐦', detail: '91-71', tag: 'AL EAST', accentColor: '#DF4601' },
    ],
  },
  nhl: {
    leagueName: 'NHL',
    leagueLogo: '🏒',
    accent: '#CF4520',
    items: [
      { id: 'nyr', name: 'NY RANGERS', logo: '🗽', detail: '38-16-4', tag: 'METRO', accentColor: '#0038A8' },
      { id: 'edm', name: 'EDMONTON', logo: '🛢️', detail: '36-18-3', tag: 'PACIFIC', accentColor: '#FF4C00' },
      { id: 'dal', name: 'DALLAS', logo: '⭐', detail: '37-17-5', tag: 'CENTRAL', accentColor: '#006847' },
      { id: 'fla', name: 'FLORIDA', logo: '🐆', detail: '39-16-4', tag: 'ATLANTIC', accentColor: '#041E42' },
    ],
  },
};

interface Props {
  currentTab: ActiveTab;
  onSelectItem?: (id: string) => void;
  onSelectTeamOrLeague?: (id: string) => void;
}

export const DynamicLeagueMarquee: React.FC<Props> = ({ currentTab, onSelectItem, onSelectTeamOrLeague }) => {
  const isGlobal = currentTab === 'leagues';
  const handleSelect = onSelectItem || onSelectTeamOrLeague;
  
  // Isolate data pool based on active tab selection
  const leagueConfig = !isGlobal ? LEAGUE_ISOLATED_DATA[currentTab] : null;
  const rawItems = leagueConfig ? leagueConfig.items : ALL_LEAGUES_DATA;
  
  // Triple items to guarantee smooth infinite scrolling loop
  const tickerItems = [...rawItems, ...rawItems, ...rawItems];

  return (
    <div className="foss-breaking-news-ticker relative w-full overflow-hidden py-2.5 select-none border-b border-white/10 bg-black/50 backdrop-blur-xl flex items-center">
      
      {/* Pinned League Indicator Badge on the Left (Only on Single-League Tabs) */}
      {!isGlobal && leagueConfig && (
        <div 
          className="absolute left-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full text-black font-black text-[10px] uppercase tracking-wider shadow-md"
          style={{ backgroundColor: leagueConfig.accent }}
        >
          <span>{leagueConfig.leagueLogo}</span>
          <span className="text-white">{leagueConfig.leagueName} HUB</span>
        </div>
      )}

      {/* Edge Fades */}
      <div className={`absolute left-0 top-0 bottom-0 z-10 pointer-events-none bg-gradient-to-r from-black via-black/80 to-transparent ${!isGlobal ? 'w-28' : 'w-8'}`} />
      <div className="absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none bg-gradient-to-l from-black to-transparent" />

      {/* Marquee Track */}
      <motion.div
        key={currentTab}
        className={`flex gap-3 items-center whitespace-nowrap will-change-transform ${!isGlobal ? 'pl-28' : 'pl-4'}`}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          ease: 'linear',
          duration: isGlobal ? 18 : 22, // Faster, lively sports ticker pace
          repeat: Infinity,
        }}
        whileHover={{ transition: { duration: 0 } }}
      >
        {tickerItems.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            onClick={() => handleSelect && handleSelect(item.id)}
            className="group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/25 backdrop-blur-md cursor-pointer transition-all active:scale-95 flex-shrink-0 shadow-lg"
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
              style={{
                backgroundColor: item.accentColor ? `${item.accentColor}44` : 'rgba(255,255,255,0.1)',
                border: `1px solid ${item.accentColor || 'rgba(255,255,255,0.2)'}`,
              }}
            >
              <span>{item.logo}</span>
            </div>

            <span className="text-[11px] font-black tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase">
              {item.name}
            </span>

            {item.tag && (
              <span className="text-[8px] font-mono text-zinc-300 bg-white/10 px-1.5 py-0.5 rounded border border-white/10 font-bold">
                {item.tag}
              </span>
            )}

            <span className="text-[10px] font-mono font-bold text-emerald-400">
              {item.detail}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};
