import { useState, useEffect } from 'react';

export interface BoostElement {
  id: string;
  name: string;
  selector: string;
  description: string;
  defaultHidden: boolean;
}

export const BOOSTABLE_ELEMENTS: BoostElement[] = [
  {
    id: 'live-activity',
    name: 'Live Activity Banner',
    selector: '.foss-live-activity-card',
    description: 'Pinpoint halftime/live header with shooting stats & fouls',
    defaultHidden: false,
  },
  {
    id: 'clutch-meter',
    name: 'Clutch Probability Wave',
    selector: '.foss-clutch-meter',
    description: 'Live in-game probability slider & wave bar',
    defaultHidden: false,
  },
  {
    id: 'stat-leaders',
    name: 'Stat Leaders Marquee',
    selector: '.foss-leaders-marquee',
    description: 'Individual player scoring & assist tickers',
    defaultHidden: false,
  },
  {
    id: 'breaking-news',
    name: 'Breaking News Ticker',
    selector: '.foss-breaking-news-ticker',
    description: 'Athletic / SB Nation live headline bar',
    defaultHidden: false,
  },
  {
    id: 'stadium-badge',
    name: 'Stadium Live Nav Badge',
    selector: '.foss-stadium-badge',
    description: 'Header stadium-lit Games Live Now pill',
    defaultHidden: false,
  },
  {
    id: 'dock-labels',
    name: 'Dock Navigation Labels',
    selector: '.foss-dock-label',
    description: 'Text labels under dock icons (Scores, Live, News, etc.)',
    defaultHidden: false,
  },
  {
    id: 'court-watermark',
    name: 'Court & Field Watermarks',
    selector: '.foss-sport-watermark',
    description: 'Subtle league-colored SVG court, rink, or field outlines',
    defaultHidden: false,
  },
];

export const useBoostSettings = () => {
  const [hiddenIds, setHiddenIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('foss_boost_hidden');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customCSS, setCustomCSS] = useState<string>(() => {
    try {
      return localStorage.getItem('foss_boost_custom_css') || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('foss_boost_hidden', JSON.stringify(hiddenIds));
    } catch {
      // Ignore
    }
  }, [hiddenIds]);

  useEffect(() => {
    try {
      localStorage.setItem('foss_boost_custom_css', customCSS);
    } catch {
      // Ignore
    }
  }, [customCSS]);

  // Inject or update live CSS in the document head
  useEffect(() => {
    const styleId = 'foss-boost-injected-styles';
    let styleTag = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    const rules = hiddenIds
      .map((id) => {
        const item = BOOSTABLE_ELEMENTS.find((b) => b.id === id);
        return item ? `${item.selector} { display: none !important; }` : '';
      })
      .filter(Boolean)
      .join('\n');

    styleTag.textContent = `${rules}\n${customCSS}`;
  }, [hiddenIds, customCSS]);

  const toggleElement = (id: string) => {
    setHiddenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAll = () => {
    setHiddenIds([]);
    setCustomCSS('');
  };

  return { hiddenIds, toggleElement, customCSS, setCustomCSS, resetAll };
};
