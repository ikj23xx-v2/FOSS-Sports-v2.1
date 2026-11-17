import React, { useState } from 'react';
import { UserLocationMarket } from '../types';
import { POPULAR_TV_MARKETS, broadcastResolver } from '../services/broadcastResolver';
import { Tv, MapPin, Radio, Video, Play, ExternalLink, Check, Sparkles } from 'lucide-react';
import { sounds } from '../services/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentMarket: UserLocationMarket;
  onSelectMarket: (market: UserLocationMarket) => void;
}

interface LocalClip {
  id: string;
  title: string;
  team: string;
  source: string;
  duration: string;
  thumbnail: string;
  url: string;
}

export const BroadcastMarketModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentMarket,
  onSelectMarket,
}) => {
  const [activeTab, setActiveTab] = useState<'markets' | 'channels' | 'clips' | 'radio'>('markets');
  const [isDetecting, setIsDetecting] = useState(false);
  const [activeRadio, setActiveRadio] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetect = async () => {
    setIsDetecting(true);
    sounds.playTap();
    try {
      const detected = await broadcastResolver.detectLocation();
      onSelectMarket(detected);
    } catch {
      // Handled
    } finally {
      setIsDetecting(false);
    }
  };

  const localClips: LocalClip[] = [
    {
      id: 'clip-1',
      title: 'Crunch Time Defensive Clinic: 4th Quarter Lockdown Breakdown',
      team: currentMarket.cityName || 'Local Team',
      source: 'Regional Sports Network',
      duration: '3:18',
      thumbnail: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&auto=format&fit=crop&q=80',
      url: 'https://youtube.com',
    },
    {
      id: 'clip-2',
      title: 'Full Postgame Press Conference & Locker Room Reactions',
      team: currentMarket.cityName || 'Local Team',
      source: 'Team Broadcast Feed',
      duration: '8:45',
      thumbnail: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=600&auto=format&fit=crop&q=80',
      url: 'https://youtube.com',
    },
    {
      id: 'clip-3',
      title: 'Top 5 Plays of the Week & Insider Injury Report',
      team: 'Regional All-Access',
      source: 'Sports Broadcast Wire',
      duration: '4:02',
      thumbnail: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?w=600&auto=format&fit=crop&q=80',
      url: 'https://youtube.com',
    },
  ];

  const radioStations = [
    {
      id: 'sta-1',
      name: '98.5 The Sports Hub',
      market: 'Boston',
      frequency: '98.5 FM',
      callsign: 'WBZ-FM',
      description: 'Official flagship for Celtics, Patriots, Bruins & Revolution',
    },
    {
      id: 'sta-2',
      name: 'WFAN 101.9 / 660 AM',
      market: 'New York',
      frequency: '101.9 FM',
      callsign: 'WFAN',
      description: 'New York sports talk powerhouse & live game broadcasts',
    },
    {
      id: 'sta-3',
      name: '670 The Score',
      market: 'Chicago',
      frequency: '670 AM',
      callsign: 'WSCR',
      description: 'Chicago Cubs & Bulls play-by-play live radio network',
    },
    {
      id: 'sta-4',
      name: 'ESPN LA 710 AM',
      market: 'Los Angeles',
      frequency: '710 AM',
      callsign: 'KSPN',
      description: 'Lakers, Rams & Southern California live game coverage',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-xl select-none animate-fadeIn">
      <div className="relative w-full max-w-lg mx-auto bg-gradient-to-b from-[#1E1C22] via-[#121216] to-[#0A0A0C] border border-white/20 rounded-[28px] p-5 md:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95)] text-white max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Top Specular Rim */}
        <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.25)]">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-tight uppercase">TV Markets & Live Broadcasts</h2>
              <p className="text-[11px] text-zinc-400 font-medium">Where to Watch & Local Team Video Feeds</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-white/10 rounded-xl mb-4 flex-shrink-0">
          <button
            onClick={() => setActiveTab('markets')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'markets'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Markets
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'channels'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Channels
          </button>
          <button
            onClick={() => setActiveTab('clips')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'clips'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Team Clips
          </button>
          <button
            onClick={() => setActiveTab('radio')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'radio'
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Radio
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 no-scrollbar">
          
          {/* TAB 1: Markets */}
          {activeTab === 'markets' && (
            <div className="space-y-3">
              {/* GPS Detection Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-transparent border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-blue-400 font-bold block mb-0.5">
                    Automatic Geolocation
                  </span>
                  <p className="text-xs font-bold text-white">Auto-Assign TV Market</p>
                  <p className="text-[10.5px] text-zinc-400">Finds nearest regional sports network & local affiliate</p>
                </div>
                <button
                  disabled={isDetecting}
                  onClick={handleDetect}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <MapPin className={`w-3.5 h-3.5 ${isDetecting ? 'animate-spin' : ''}`} />
                  <span>{isDetecting ? 'Locating...' : 'Allow GPS'}</span>
                </button>
              </div>

              {/* Market Selection Grid */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block px-1">
                  Designated Market Areas (DMAs)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {POPULAR_TV_MARKETS.map((m) => {
                    const isSelected = currentMarket.marketId === m.marketId;
                    return (
                      <button
                        key={m.marketId}
                        onClick={() => {
                          sounds.playTap();
                          onSelectMarket(m);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all active:scale-[0.98] cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-400/15 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.2)] text-white'
                            : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07] text-zinc-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-extrabold text-xs truncate flex items-center gap-1.5">
                            <span>{m.cityName}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">({m.stateCode})</span>
                          </div>
                          <div className="text-[9.5px] text-zinc-400 truncate mt-0.5">{m.dmaName}</div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center flex-shrink-0 text-xs font-bold">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Channels & Broadcast Guides */}
          {activeTab === 'channels' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block mb-1">
                  Active Market: {currentMarket.cityName} ({currentMarket.stateCode})
                </span>
                <p className="text-xs text-zinc-300">
                  Broadcasts automatically resolve to regional networks and over-the-air channels available in this market.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block px-1">
                  Regional & Cable Feeds
                </span>
                {[
                  { name: 'NBC Sports Boston', channel: 'Ch. 852 / Xfinity 773', stream: 'NBC Sports App / League Pass', tier: 'RSN' },
                  { name: 'NESN / NESN 360', channel: 'Ch. 851 / Xfinity 51', stream: 'NESN 360 App', tier: 'RSN' },
                  { name: 'ESPN / ABC Sports', channel: 'Ch. 850 / Ch. 5 OTA', stream: 'ESPN App / Disney+', tier: 'National' },
                  { name: 'TNT Sports / Max', channel: 'Ch. 825 / DirecTV 245', stream: 'Max Sports Add-on', tier: 'National' },
                  { name: 'Paramount+ / CBS', channel: 'Ch. 4 WBZ OTA', stream: 'Paramount+ Live TV', tier: 'OTA' },
                ].map((ch) => (
                  <div
                    key={ch.name}
                    className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{ch.name}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-300 font-mono">
                          {ch.tier}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-zinc-400 mt-0.5">{ch.channel}</div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">
                      {ch.stream}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Local Team Clips */}
          {activeTab === 'clips' && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block px-1">
                Curated Video Highlights & Breakdown
              </span>
              <div className="space-y-2.5">
                {localClips.map((clip) => (
                  <div
                    key={clip.id}
                    className="group p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all flex items-center gap-3 cursor-pointer"
                    onClick={() => sounds.playTap()}
                  >
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-black flex-shrink-0 border border-white/10">
                      <img
                        src={clip.thumbnail}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-md">
                          <Play className="w-3 h-3 fill-black ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[8px] font-mono text-white font-bold">
                        {clip.duration}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-mono text-amber-400 uppercase font-bold truncate">
                        {clip.team} · {clip.source}
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 mt-0.5 leading-snug group-hover:text-amber-300 transition-colors">
                        {clip.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Radio */}
          {activeTab === 'radio' && (
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 font-bold block px-1">
                Live Radio Play-by-Play & Sports Talk
              </span>
              <div className="space-y-2">
                {radioStations.map((station) => {
                  const isPlaying = activeRadio === station.id;
                  return (
                    <div
                      key={station.id}
                      className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                          <Radio className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-white flex items-center gap-2">
                            <span>{station.name}</span>
                            <span className="text-[9px] font-mono text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded">
                              {station.market}
                            </span>
                          </div>
                          <div className="text-[10.5px] text-zinc-400 mt-0.5">{station.description}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          sounds.playTap();
                          setActiveRadio(isPlaying ? null : station.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase font-mono flex items-center gap-1 transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse'
                            : 'bg-white/10 hover:bg-white/20 text-white'
                        }`}
                      >
                        <span>{isPlaying ? 'ON AIR' : 'LISTEN'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
