import React from 'react';
import { motion } from 'framer-motion';

export type ActiveTab = 'leagues' | 'nba' | 'nfl' | 'mlb' | 'nhl';

export interface MarqueeItem {
  id: string;
  name: string;
  logo: string;
  detail: string; // e.g. "28-12" or "3 LIVE"
  tag?: string;
  accentColor?: string;
}

// 1. Data Source for All-Leagues Global View
const ALL_LEAGUES_DATA: MarqueeItem[] = [
  { id: 'nba', name: 'NBA', logo: '🏀', detail: '6 LIVE', accentColor: '#1D428A' },
  { id: 'nfl', name: 'NFL', logo: '🏈', detail: 'THU NIGHT', accentColor: '#013369' },
  { id: 'mlb', name: 'MLB', logo: '⚾', detail: 'SPRING TR.', accentColor: '#041E42' },
  { id: 'nhl', name: 'NHL', logo: '🏒', detail: '4 LIVE', accentColor: '#CF4520' },
  { id: 'f1', name: 'F1', logo: '🏎️', detail: 'RACE WEEK', accentColor: '#E10600' },
  { id: 'epl', name: 'EPL', logo: '⚽', detail: 'MATCHDAY', accentColor: '#38003C' },
];

// 2. League-Specific Team Logo Data Pools
const LEAGUE_TEAMS_DATA: Record<Exclude<ActiveTab, 'leagues'>, MarqueeItem[]> = {
  nba: [
    { id: 'bos', name: 'BOS', logo: '🍀', detail: '34-10', accentColor: '#007A33', tag: '#1 EAST' },
    { id: 'chi', name: 'CHI', logo: '🐂', detail: '22-24', accentColor: '#CE1141', tag: 'IN-PLAY' },
    { id: 'lal', name: 'LAL', logo: '👑', detail: '28-20', accentColor: '#552583', tag: 'WEST' },
    { id: 'gsw', name: 'GSW', logo: '🌉', detail: '27-21', accentColor: '#1D428A', tag: 'WEST' },
    { id: 'mil', name: 'MIL', logo: '🦌', detail: '31-15', accentColor: '#00471B', tag: '#2 EAST' },
    { id: 'mia', name: 'MIA', logo: '🔥', detail: '26-20', accentColor: '#98002E', tag: 'EAST' },
    { id: 'nyk', name: 'NYK', logo: '🗽', detail: '30-17', accentColor: '#F58426', tag: 'EAST' },
    { id: 'den', name: 'DEN', logo: '🏔️', detail: '32-15', accentColor: '#0E2240', tag: '#1 WEST' },
  ],
  nfl: [
    { id: 'kc', name: 'KC', logo: '🏹', detail: '14-3', accentColor: '#E31837', tag: 'AFC #1' },
    { id: 'sf', name: 'SF', logo: '⛏️', detail: '12-5', accentColor: '#AA0000', tag: 'NFC #1' },
    { id: 'bal', name: 'BAL', logo: '🐦', detail: '13-4', accentColor: '#241773', tag: 'AFC' },
    { id: 'det', name: 'DET', logo: '🦁', detail: '12-5', accentColor: '#0076B6', tag: 'NFC NORTH' },
    { id: 'buf', name: 'BUF', logo: '🦬', detail: '11-6', accentColor: '#00338D', tag: 'AFC EAST' },
    { id: 'phi', name: 'PHI', logo: '🦅', detail: '11-6', accentColor: '#004C54', tag: 'NFC' },
    { id: 'dal', name: 'DAL', logo: '⭐', detail: '12-5', accentColor: '#003594', tag: 'NFC EAST' },
    { id: 'gb', name: 'GB', logo: '🧀', detail: '10-7', accentColor: '#203731', tag: 'NFC' },
  ],
  mlb: [
    { id: 'lad', name: 'LAD', logo: '⚾', detail: '100-62', accentColor: '#005A9C', tag: 'NL WEST' },
    { id: 'nyy', name: 'NYY', logo: '⚾', detail: '94-68', accentColor: '#0C2340', tag: 'AL EAST' },
    { id: 'atl', name: 'ATL', logo: '⚾', detail: '104-58', accentColor: '#CE1141', tag: 'NL EAST' },
    { id: 'hou', name: 'HOU', logo: '🚀', detail: '90-72', accentColor: '#EB6E1F', tag: 'AL WEST' },
    { id: 'phi', name: 'PHI', logo: '🔔', detail: '90-72', accentColor: '#E81828', tag: 'NL' },
    { id: 'bal', name: 'BAL', logo: '🐦', detail: '101-61', accentColor: '#DF4601', tag: 'AL' },
    { id: 'bos', name: 'BOS', logo: '🧦', detail: '81-81', accentColor: '#BD3039', tag: 'AL' },
  ],
  nhl: [
    { id: 'edm', name: 'EDM', logo: '🏒', detail: '49-27', accentColor: '#041E42', tag: 'PACIFIC' },
    { id: 'fla', name: 'FLA', logo: '🐆', detail: '52-24', accentColor: '#041E42', tag: 'ATLANTIC' },
    { id: 'bos', name: 'BOS', logo: '🐻', detail: '47-20', accentColor: '#FFB81C', tag: 'ATLANTIC' },
    { id: 'nyr', name: 'NYR', logo: '🗽', detail: '55-23', accentColor: '#0038A8', tag: 'METRO #1' },
    { id: 'col', name: 'COL', logo: '🏔️', detail: '50-25', accentColor: '#6F263D', tag: 'CENTRAL' },
    { id: 'vgk', name: 'VGK', logo: '⚔️', detail: '45-29', accentColor: '#B4975A', tag: 'PACIFIC' },
    { id: 'tor', name: 'TOR', logo: '🍁', detail: '46-26', accentColor: '#00205B', tag: 'ATLANTIC' },
  ],
};

interface Props {
  activeTab?: ActiveTab;
  onSelectItem?: (item: MarqueeItem) => void;
}

export const TeamMarqueeStrip: React.FC<Props> = ({ activeTab = 'leagues', onSelectItem }) => {
  const items = activeTab === 'leagues' ? ALL_LEAGUES_DATA : (LEAGUE_TEAMS_DATA[activeTab] || ALL_LEAGUES_DATA);
  const doubledItems = [...items, ...items, ...items];

  return (
    <div className="foss-leaders-marquee w-full overflow-hidden py-1.5 px-2 select-none">
      <div className="relative w-full flex items-center overflow-hidden">
        {/* Soft edge blur gradients */}
        <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-black/80 to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-2.5 flex-nowrap"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 22,
            ease: 'linear',
          }}
          whileHover={{ animationPlayState: 'paused' }}
        >
          {doubledItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              onClick={() => onSelectItem && onSelectItem(item)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all cursor-pointer flex-shrink-0 group backdrop-blur-md"
            >
              <span className="text-sm drop-shadow">{item.logo}</span>
              <span className="text-xs font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
                {item.name}
              </span>
              <span className="text-[10px] font-mono text-zinc-400 font-semibold">
                {item.detail}
              </span>
              {item.tag && (
                <span
                  className="text-[8.5px] font-mono font-bold px-1.5 py-0.2 rounded-full border border-white/10"
                  style={{
                    backgroundColor: item.accentColor ? `${item.accentColor}25` : 'rgba(255,255,255,0.08)',
                    color: item.accentColor || '#FFFFFF',
                  }}
                >
                  {item.tag}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
