import React from 'react';
import { sounds } from '../services/sound';
import { Calendar, Radio, Newspaper, SlidersHorizontal } from 'lucide-react';

interface AppleDockProps {
  currentTab: 'scores' | 'live' | 'news' | 'settings';
  onSelectTab: (tab: 'scores' | 'live' | 'news' | 'settings') => void;
  liveCount: number;
}

interface DockItem {
  id: 'scores' | 'live' | 'news' | 'settings';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count?: number;
}

export const AppleDock: React.FC<AppleDockProps> = ({
  currentTab,
  onSelectTab,
  liveCount,
}) => {
  const items: DockItem[] = [
    { id: 'scores', label: 'Scores', icon: Calendar },
    { id: 'live', label: 'Live', icon: Radio, count: liveCount },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  ];


  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto theme-dock backdrop-blur-2xl border theme-border rounded-full px-3 py-1.5 shadow-2xl flex items-center gap-1 sm:gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playTabSwitch();
                onSelectTab(item.id);
              }}
              className={`relative flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-1 px-2 rounded-full transition-all active:scale-90 cursor-pointer ${
                isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5px]' : 'stroke-[1.8px]'
                  }`}
                />
                {typeof item.count === 'number' && Number.isFinite(item.count) && item.count > 0 ? (
                  <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                ) : null}
              </div>

              <span
                className={`foss-dock-label text-[10px] mt-0.5 tracking-tight ${
                  isActive ? 'font-black text-white' : 'font-medium text-neutral-400'
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <span className="w-1 h-1 rounded-full bg-white mt-0.5" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
