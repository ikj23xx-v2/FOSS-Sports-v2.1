import React from 'react';

export type SportType = 'nba' | 'nfl' | 'mlb' | 'nhl';

interface LeagueTheme {
  gradientClass: string;
  primaryGlow: string;
  secondaryGlow: string;
  accentStroke: string;
}

const LEAGUE_THEMES: Record<SportType, LeagueTheme> = {
  nba: {
    // Deep Black leaning into NBA Royal Blue (#1D428A) & Crimson (#C8102E)
    gradientClass: 'from-[#0D1933] via-[#07090F] to-[#040406]',
    primaryGlow: 'bg-[#1D428A]/25',
    secondaryGlow: 'bg-[#C8102E]/15',
    accentStroke: 'stroke-[#4A77D4]',
  },
  nfl: {
    // Deep Black leaning into NFL Midnight Navy (#013369) & Authentic Red (#D50A0A)
    gradientClass: 'from-[#06162B] via-[#06080D] to-[#030406]',
    primaryGlow: 'bg-[#013369]/30',
    secondaryGlow: 'bg-[#D50A0A]/15',
    accentStroke: 'stroke-[#3B76B8]',
  },
  mlb: {
    // Deep Black leaning into MLB Dark Navy (#041E42) & Seam Red (#BF0D3E)
    gradientClass: 'from-[#081326] via-[#07070B] to-[#040406]',
    primaryGlow: 'bg-[#041E42]/35',
    secondaryGlow: 'bg-[#BF0D3E]/20',
    accentStroke: 'stroke-[#E03A5E]',
  },
  nhl: {
    // Deep Carbon Black leaning into NHL Metallic Silver (#A7A9AC) & Orange/Gold (#CF4520)
    gradientClass: 'from-[#16181D] via-[#08090B] to-[#030305]',
    primaryGlow: 'bg-[#A7A9AC]/20',
    secondaryGlow: 'bg-[#CF4520]/15',
    accentStroke: 'stroke-[#94A3B8]',
  },
};

interface Props {
  sport: SportType;
  children?: React.ReactNode;
}

export const SportFieldBackground: React.FC<Props> = ({ sport, children }) => {
  const theme = LEAGUE_THEMES[sport] || LEAGUE_THEMES.nba;

  return (
    <div
      className={`relative w-full min-h-screen overflow-hidden bg-gradient-to-b ${theme.gradientClass} text-white transition-colors duration-700`}
    >
      {/* 1. Dual-Tone League Logo Ambient Lighting */}
      <div
        className={`absolute -top-24 left-1/4 w-[550px] h-[320px] ${theme.primaryGlow} blur-[140px] rounded-full pointer-events-none transition-colors duration-700`}
      />
      <div
        className={`absolute -top-16 right-1/4 w-[450px] h-[280px] ${theme.secondaryGlow} blur-[140px] rounded-full pointer-events-none transition-colors duration-700`}
      />

      {/* 2. Subtle League-Colored Court / Field Vector Watermark */}
      <div className="foss-sport-watermark absolute inset-0 pointer-events-none flex items-center justify-center opacity-15 transition-opacity duration-500">
        {sport === 'nba' && (
          <svg viewBox="0 0 940 500" className={`w-[90%] max-w-5xl ${theme.accentStroke} fill-none stroke-[2.5]`}>
            <rect x="20" y="20" width="900" height="460" rx="10" />
            <line x1="470" y1="20" x2="470" y2="480" />
            <circle cx="470" cy="250" r="60" />
            <rect x="20" y="170" width="190" height="160" />
            <path d="M 210,190 A 60,60 0 0,1 210,310" strokeDasharray="8 8" />
            <path d="M 20,70 L 140,70 A 237.5,237.5 0 0,1 140,430 L 20,430" />
            <rect x="730" y="170" width="190" height="160" />
            <path d="M 730,190 A 60,60 0 0,0 730,310" strokeDasharray="8 8" />
            <path d="M 920,70 L 800,70 A 237.5,237.5 0 0,0 800,430 L 920,430" />
          </svg>
        )}

        {sport === 'nfl' && (
          <svg viewBox="0 0 1000 450" className={`w-[92%] max-w-5xl ${theme.accentStroke} fill-none stroke-[2]`}>
            <rect x="20" y="20" width="960" height="410" />
            <line x1="120" y1="20" x2="120" y2="430" />
            <line x1="880" y1="20" x2="880" y2="430" />
            {[200, 280, 360, 440, 520, 600, 680, 760, 840].map((x) => (
              <line key={x} x1={x} y1="20" x2={x} y2="430" strokeOpacity="0.4" strokeDasharray="4 4" />
            ))}
            <line x1="500" y1="20" x2="500" y2="430" strokeWidth="3" />
          </svg>
        )}

        {sport === 'mlb' && (
          <svg viewBox="0 0 600 600" className={`w-[80%] max-w-3xl ${theme.accentStroke} fill-none stroke-[2.5]`}>
            <path d="M 300,520 L 500,320 L 300,120 L 100,320 Z" />
            <circle cx="300" cy="320" r="15" fill="currentColor" fillOpacity="0.15" />
            <path d="M 80,340 A 260,260 0 0,1 520,340" strokeDasharray="6 6" />
            <line x1="300" y1="520" x2="50" y2="270" />
            <line x1="300" y1="520" x2="550" y2="270" />
          </svg>
        )}

        {sport === 'nhl' && (
          <svg viewBox="0 0 900 450" className={`w-[90%] max-w-5xl ${theme.accentStroke} fill-none stroke-[2.5]`}>
            <rect x="20" y="20" width="860" height="410" rx="90" />
            <line x1="450" y1="20" x2="450" y2="430" strokeWidth="4" stroke="#CF4520" strokeOpacity="0.4" />
            <circle cx="450" cy="225" r="55" stroke="#38BDF8" strokeOpacity="0.35" />
            <line x1="320" y1="20" x2="320" y2="430" stroke="#38BDF8" strokeOpacity="0.4" />
            <line x1="580" y1="20" x2="580" y2="430" stroke="#38BDF8" strokeOpacity="0.4" />
          </svg>
        )}
      </div>

      {/* 3. Foreground Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};
