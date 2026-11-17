import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';
import { sounds } from '../services/sound';

interface NewsTickerBarProps {
  articles: NewsArticle[];
  onOpenArticle: (article: NewsArticle) => void;
  speedMultiplier?: number;
}

export const NewsTickerBar: React.FC<NewsTickerBarProps> = ({
  articles,
  onOpenArticle,
  speedMultiplier = 1.0,
}) => {
  const [index, setIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);

  useEffect(() => {
    if (articles.length <= 1) return;
    const intervalTime = Math.max(3000, Math.floor(5500 / speedMultiplier));
    const interval = setInterval(() => {
      setIsSliding(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % articles.length);
        setIsSliding(false);
      }, 250);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [articles.length, speedMultiplier]);

  if (!articles || articles.length === 0) return null;

  const current = articles[index] || articles[0];
  const isBreaking = Boolean(
    current.isBreaking ||
    current.title.toLowerCase().includes('breaking') ||
    current.title.toLowerCase().includes('trade:')
  );

  return (
    <div className="foss-breaking-news-ticker px-4 sm:px-6 my-2">
      <div
        onClick={() => {
          sounds.playTap();
          onOpenArticle(current);
        }}
        className="w-full bg-[#161618] hover:bg-[#1F1F23] border border-[#2A2A2E] rounded-[12px] px-2.5 py-1.5 flex items-center justify-between gap-2.5 cursor-pointer transition-colors group overflow-hidden"
      >
        {/* ESPN Red Breaking Badge / League Tag */}
        <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          <span
            className={`shrink-0 text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded-[4px] text-white ${
              isBreaking ? 'bg-[#FF453A]' : 'bg-[#1F1F23] border border-[#2A2A2E]'
            }`}
          >
            {isBreaking ? 'BREAKING' : current.league.toUpperCase()}
          </span>

          {/* Marquee Text with slide animation */}
          <p
            className={`text-[12.5px] font-medium text-white truncate transition-all duration-200 ${
              isSliding ? 'opacity-0 translate-x-3' : 'opacity-100 translate-x-0'
            }`}
          >
            {current.title}
          </p>
        </div>

        {/* Counter indicator */}
        <span className="text-[10px] font-mono text-[#636366] shrink-0">
          {index + 1}/{articles.length}
        </span>
      </div>
    </div>
  );
};
