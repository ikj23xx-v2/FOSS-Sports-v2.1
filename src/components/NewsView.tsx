import React from 'react';
import { NewsArticle } from '../types';
import { sounds } from '../services/sound';
import { SportsFeedCard, LeagueType, NewsCardProps } from './SportsFeedCard';

interface NewsViewProps {
  articles: NewsArticle[];
  selectedLeague: string;
  onSelectTeam?: (teamName: string, league: LeagueType, gradient?: string) => void;
}

const SAMPLE_FALLBACK_NEWS: NewsCardProps[] = [
  { 
    id: 'sample-1', 
    league: 'nba', 
    teamName: 'Cleveland Cavaliers', 
    teamGradient: 'linear-gradient(135deg, rgba(111,26,42,0.35) 0%, rgba(26,31,44,0.95) 70%)', 
    timestamp: 'Just now', 
    title: 'Cleveland Cavaliers vs. New York Knicks: Game Highlights', 
    snippet: 'Jarrett Allen scores 22 points as the Cavaliers beat the Knicks 115-107 in a thrilling matchup.', 
    source: 'ESPN Wire' 
  },
  { 
    id: 'sample-2', 
    league: 'nfl', 
    teamName: 'Carolina Panthers', 
    teamGradient: 'linear-gradient(135deg, rgba(0,133,202,0.35) 0%, rgba(26,31,44,0.95) 70%)', 
    timestamp: '15m ago', 
    title: 'Carolina Panthers Secure Crucial Divisional Victory', 
    snippet: 'Late fourth-quarter defensive stops seal the win as the offense executes a flawless two-minute drill.', 
    source: 'NFL Network' 
  },
  { 
    id: 'sample-3', 
    league: 'mlb', 
    teamName: 'Baltimore Orioles', 
    teamGradient: 'linear-gradient(135deg, rgba(223,80,0,0.35) 0%, rgba(26,31,44,0.95) 70%)', 
    timestamp: '1h ago', 
    title: 'Spring Training Preview: Top Prospects to Watch', 
    snippet: 'Scouts highlight breakout candidates making waves early in camp ahead of opening day.', 
    source: 'Baseball Digest' 
  },
  { 
    id: 'sample-4', 
    league: 'nhl', 
    teamName: 'Carolina Hurricanes', 
    teamGradient: 'linear-gradient(135deg, rgba(204,0,0,0.35) 0%, rgba(26,31,44,0.95) 70%)', 
    timestamp: '3h ago', 
    title: 'Overtime Thriller Highlights Tuesday Night Hockey', 
    snippet: 'A dramatic end-to-end rush results in a game-winning goal with seconds remaining in extra time.', 
    source: 'SportsNet' 
  },
];

export const NewsView: React.FC<NewsViewProps> = ({
  articles,
  selectedLeague,
  onSelectTeam,
}) => {
  const mapToLeagueType = (league: string): LeagueType => {
    const l = league.toLowerCase();
    if (l.includes('nfl')) return 'nfl';
    if (l.includes('mlb')) return 'mlb';
    if (l.includes('nhl')) return 'nhl';
    return 'nba';
  };

  // Helper to extract or suggest a team name from an article headline
  const detectTeamName = (title: string, league: LeagueType): string => {
    const t = title.toLowerCase();
    if (league === 'nba') {
      if (t.includes('cavalier') || t.includes('cleveland')) return 'Cleveland Cavaliers';
      if (t.includes('celtic') || t.includes('boston') || t.includes('tatum')) return 'Boston Celtics';
      if (t.includes('laker') || t.includes('los angeles') || t.includes('lebron')) return 'Los Angeles Lakers';
      if (t.includes('warrior') || t.includes('golden state') || t.includes('curry')) return 'Golden State Warriors';
      if (t.includes('bull') || t.includes('chicago')) return 'Chicago Bulls';
      if (t.includes('knick') || t.includes('new york')) return 'New York Knicks';
      if (t.includes('magic') || t.includes('orlando')) return 'Orlando Magic';
      if (t.includes('jazz') || t.includes('utah')) return 'Utah Jazz';
      return 'Cleveland Cavaliers';
    }
    if (league === 'nfl') {
      if (t.includes('panther') || t.includes('carolina')) return 'Carolina Panthers';
      if (t.includes('chief') || t.includes('kansas city') || t.includes('mahomes')) return 'Kansas City Chiefs';
      if (t.includes('49er') || t.includes('san francisco') || t.includes('purdy')) return 'San Francisco 49ers';
      if (t.includes('eagle') || t.includes('philadelphia') || t.includes('hurts')) return 'Philadelphia Eagles';
      return 'Carolina Panthers';
    }
    if (league === 'mlb') {
      if (t.includes('oriole') || t.includes('baltimore')) return 'Baltimore Orioles';
      if (t.includes('yankee') || t.includes('new york') || t.includes('judge')) return 'New York Yankees';
      if (t.includes('dodger') || t.includes('los angeles') || t.includes('ohtani')) return 'Los Angeles Dodgers';
      return 'Baltimore Orioles';
    }
    if (league === 'nhl') {
      if (t.includes('hurricane') || t.includes('carolina')) return 'Carolina Hurricanes';
      if (t.includes('oiler') || t.includes('edmonton') || t.includes('mcdavid')) return 'Edmonton Oilers';
      if (t.includes('bruin') || t.includes('boston') || t.includes('pastrnak')) return 'Boston Bruins';
      return 'Carolina Hurricanes';
    }
    return 'Cleveland Cavaliers';
  };

  const liveCards: NewsCardProps[] = (articles || []).map((item) => {
    const safeTime = Number.isFinite(item.time) ? item.time : Date.now();
    const diff = Math.max(0, Date.now() - safeTime);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const timeAgo = !Number.isFinite(hours) || hours < 1 ? 'Just now' : hours === 1 ? '1h ago' : `${hours}h ago`;
    const leagueType = mapToLeagueType(item.league);
    const teamName = detectTeamName(item.title, leagueType);

    return {
      id: item.id,
      league: leagueType,
      teamName,
      timestamp: timeAgo,
      title: item.title,
      snippet: item.summary || item.title,
      source: item.byline || 'ESPN Wire',
      url: item.link,
    };
  });

  // Combine live articles with sample cards, ensuring unique IDs
  const combinedCards = liveCards.length > 0 ? [...liveCards, ...SAMPLE_FALLBACK_NEWS] : SAMPLE_FALLBACK_NEWS;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-xl font-black text-white font-display">
          Top Sports News & Analysis
        </h2>
        <span className="text-xs text-neutral-400 font-mono">
          Powered by ESPN & Community Feeds
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {combinedCards.map((cardData) => (
          <SportsFeedCard
            key={cardData.id}
            item={cardData}
            onSelectTeam={(name, lg, grad) => {
              sounds.playTap();
              if (onSelectTeam) onSelectTeam(name, lg, grad);
            }}
            onReadMore={(url) => {
              sounds.playTap();
              if (url) window.open(url, '_blank');
            }}
          />
        ))}
      </div>
    </div>
  );
};

