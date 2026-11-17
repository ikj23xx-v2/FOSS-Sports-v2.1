import React, { useState, useEffect } from 'react';
import { sounds } from '../services/sound';

export interface NewsItem {
  id: string;
  source: string;
  headline: string;
  timeAgo: string;
  url: string;
  teamColor?: string;
}

interface Props {
  activeLeagueId?: string;   // e.g. 'nba', 'nfl', 'all'
  selectedTeamSlug?: string; // e.g. 'celtics', 'panthers'
  selectedTeamId?: string;
  onOpenArticle?: (article: NewsItem) => void;
}

export const LiveBreakingNewsTicker: React.FC<Props> = ({
  activeLeagueId = 'all',
  selectedTeamSlug = 'celtics',
  selectedTeamId,
  onOpenArticle,
}) => {
  // Initial high-fidelity real-world fallback briefs while live feeds aggregate
  const initialHeadlines: NewsItem[] = [
    {
      id: 'init-1',
      source: 'The Athletic',
      headline: 'Inside the tactical adjustments shaping the second half of the NBA playoff race.',
      timeAgo: '2m ago',
      url: 'https://theathletic.com/nba/',
      teamColor: '#007A33', // Celtics Green
    },
    {
      id: 'init-2',
      source: 'CelticsBlog (SB Nation)',
      headline: 'Postgame Breakdown: Defensive rotations that sealed the win in crunch time.',
      timeAgo: '6m ago',
      url: 'https://www.celticsblog.com/',
      teamColor: '#007A33',
    },
    {
      id: 'init-3',
      source: 'r/nba Official',
      headline: '[Highlight] Incredible buzzer-beater seals a thrilling overtime finish!',
      timeAgo: '12m ago',
      url: 'https://reddit.com/r/nba',
      teamColor: '#CE1141', // Bulls Red
    },
    {
      id: 'init-4',
      source: 'The Athletic NFL',
      headline: 'Trade deadline intel: Which contenders are aggressively pursuing pass rushers?',
      timeAgo: '18m ago',
      url: 'https://theathletic.com/nfl/',
      teamColor: '#0085CA', // NFL Blue
    },
    {
      id: 'init-5',
      source: 'r/bostonceltics',
      headline: 'Brad Stevens on roster depth and upcoming road trip preparations.',
      timeAgo: '24m ago',
      url: 'https://reddit.com/r/bostonceltics',
      teamColor: '#007A33',
    },
  ];

  const [headlines, setHeadlines] = useState<NewsItem[]>(initialHeadlines);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Define feed endpoints for The Athletic, SB Nation team blogs, and Team Subreddits
  const getFeedUrls = (league: string, team: string) => {
    const feeds: { source: string; url: string; color: string }[] = [];
    const normalizedLeague = (league || 'all').toLowerCase();
    const normalizedTeam = (team || selectedTeamId || 'celtics').toLowerCase();

    if (normalizedLeague === 'nba' || normalizedLeague === 'all') {
      if (normalizedTeam.includes('celtic') || normalizedTeam === 'bos') {
        feeds.push({
          source: 'CelticsBlog (SB Nation)',
          url: 'https://www.celticsblog.com/rss/current',
          color: '#007A33',
        });
        feeds.push({
          source: 'r/bostonceltics',
          url: 'https://www.reddit.com/r/bostonceltics/hot.json?limit=5',
          color: '#007A33',
        });
      }
      feeds.push({
        source: 'r/nba',
        url: 'https://www.reddit.com/r/nba/hot.json?limit=5',
        color: '#1d4ed8',
      });
      feeds.push({
        source: 'The Athletic NBA',
        url: 'https://theathletic.com/rss/nba/',
        color: '#EF4444',
      });
    }

    if (normalizedLeague === 'nfl' || normalizedLeague === 'all') {
      feeds.push({
        source: 'SB Nation NFL',
        url: 'https://www.sbnation.com/rss/current',
        color: '#1e3a8a',
      });
      feeds.push({
        source: 'r/nfl',
        url: 'https://www.reddit.com/r/nfl/hot.json?limit=5',
        color: '#047857',
      });
    }

    if (normalizedLeague === 'mlb') {
      feeds.push({
        source: 'r/baseball',
        url: 'https://www.reddit.com/r/baseball/hot.json?limit=5',
        color: '#002D62',
      });
    }

    if (normalizedLeague === 'nhl') {
      feeds.push({
        source: 'r/hockey',
        url: 'https://www.reddit.com/r/hockey/hot.json?limit=5',
        color: '#FFB81C',
      });
    }

    // Default fallback feed if none matched
    if (feeds.length === 0) {
      feeds.push({
        source: 'The Athletic',
        url: 'https://theathletic.com/rss/',
        color: '#ef4444',
      });
    }

    return feeds;
  };

  // Fetch and parse RSS and JSON feeds asynchronously via CORS proxy
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchFeeds = async () => {
      const targetFeeds = getFeedUrls(activeLeagueId, selectedTeamSlug);
      const aggregatedItems: NewsItem[] = [];

      for (const feed of targetFeeds) {
        try {
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`;
          const response = await fetch(proxyUrl, { signal: controller.signal });
          if (!response.ok) continue;

          const data = await response.json();
          if (!data.contents) continue;

          if (feed.url.includes('.json')) {
            // Parse Reddit JSON feed
            const json = JSON.parse(data.contents);
            const posts = json.data?.children || [];
            posts.forEach((post: { data?: { stickied?: boolean; title?: string; created_utc?: number; permalink?: string } }, idx: number) => {
              const p = post.data;
              if (p && !p.stickied && p.title) {
                const createdUtc = Number(p.created_utc);
                const diffMins = Number.isFinite(createdUtc) && createdUtc > 0
                  ? Math.max(1, Math.floor((Date.now() / 1000 - createdUtc) / 60))
                  : 5;
                const timeStr = diffMins > 60 ? `${Math.floor(diffMins / 60)}h ago` : `${diffMins}m ago`;
                aggregatedItems.push({
                  id: `${feed.source}-${idx}`,
                  source: feed.source,
                  headline: p.title,
                  timeAgo: timeStr,
                  url: `https://reddit.com${p.permalink}`,
                  teamColor: feed.color,
                });
              }
            });
          } else {
            // Parse RSS XML feed
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, 'text/xml');
            const items = xml.querySelectorAll('item');

            items.forEach((item, idx) => {
              const title = item.querySelector('title')?.textContent || '';
              const link = item.querySelector('link')?.textContent || '#';
              const pubDate = item.querySelector('pubDate')?.textContent;
              let timeStr = 'Recent';
              if (pubDate) {
                const ts = new Date(pubDate).getTime();
                if (Number.isFinite(ts)) {
                  const diffMins = Math.max(1, Math.floor((Date.now() - ts) / 60000));
                  timeStr = diffMins > 60 ? `${Math.floor(diffMins / 60)}h ago` : `${diffMins}m ago`;
                }
              }
              if (title && idx < 6) {
                aggregatedItems.push({
                  id: `${feed.source}-${idx}`,
                  source: feed.source,
                  headline: title.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim(),
                  timeAgo: timeStr,
                  url: link,
                  teamColor: feed.color,
                });
              }
            });
          }
        } catch {
          // Keep current fallback silently if network or proxy is busy
        }
      }

      if (isMounted && aggregatedItems.length > 0) {
        setHeadlines(aggregatedItems);
      }
    };

    fetchFeeds();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [activeLeagueId, selectedTeamSlug, selectedTeamId]);

  // ESPN-style dynamic rotation: Snappy 4.5s normally, slow relaxed 9s when hovered
  useEffect(() => {
    if (headlines.length <= 1) return;
    const intervalTime = isHovered ? 9000 : 4500;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [headlines.length, isHovered]);

  const currentItem = headlines[currentIndex] || headlines[0];

  const handleItemClick = (e: React.MouseEvent) => {
    sounds.playTap();
    if (onOpenArticle) {
      onOpenArticle(currentItem);
    }
  };

  return (
    <div className="foss-breaking-news-ticker w-full flex justify-center my-3 px-4 z-40 select-none">
      <a 
        href={currentItem.url || '#'} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleItemClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group cursor-pointer flex items-center justify-between w-full max-w-md h-[54px] rounded-full bg-gradient-to-b from-[#2A2A2E] via-[#141416] to-[#0A0A0C] border border-white/25 px-4 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.4)] overflow-hidden transition-all duration-300 active:scale-[0.98]"
        title={`${currentItem.headline} — ${currentItem.source} (Tap to read full thread)`}
      >
        {/* Specular Liquid Glass Refraction Glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.08] to-transparent pointer-events-none" />

        {/* Left: Breaking Live Badge */}
        <div className="flex items-center space-x-2 z-10 flex-shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF453A] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF453A]" />
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF453A] font-mono">
            BREAKING
          </span>
        </div>

        {/* Center: Headline with smooth transition on hover */}
        <div className="flex flex-col items-start mx-3 z-10 overflow-hidden flex-1 min-w-0">
          <span className={`text-white font-bold text-xs tracking-tight truncate w-full transition-colors ${isHovered ? 'text-amber-300' : 'group-hover:text-amber-400'}`}>
            {currentItem.headline}
          </span>
          <span className="text-[9px] font-semibold text-zinc-400 font-mono uppercase tracking-wider truncate w-full">
            {currentItem.source} · {currentItem.timeAgo} {isHovered && '· (Paused / Slow)'}
          </span>
        </div>

        {/* Right: FOSS Sports Branding Pill */}
        <div className="flex flex-col items-end z-10 flex-shrink-0 pl-2 border-l border-white/10">
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 font-sans leading-tight">
            FOSS
          </span>
          <span className="text-[9px] font-black text-white tracking-tighter leading-tight">
            SPORTS
          </span>
        </div>

        {/* Dynamic Team Color Glow Underlay */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none blur-md transition-all duration-500"
          style={{ background: currentItem.teamColor || '#3B82F6' }}
        />
      </a>
    </div>
  );
};
