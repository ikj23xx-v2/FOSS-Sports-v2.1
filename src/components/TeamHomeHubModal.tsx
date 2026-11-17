import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { LeagueType, MarketPreset, MARKET_PRESETS } from './ScorecardItem';
import { Volume2, VolumeX, Image as ImageIcon, Send } from 'lucide-react';
import { sounds } from '../services/sound';

export interface TeamHomeHubProps {
  teamName: string;
  league: LeagueType;
  teamGradient?: string;
  market?: MarketPreset;
  isOpen?: boolean;
  onClose: () => void;
}

export type HubTab = 'news' | 'standings' | 'roster' | 'jerseys' | 'chat';

export interface ChatMessage {
  id: string;
  user: string;
  text?: string;
  gifUrl?: string;
  time: string;
}

interface JerseyKit {
  id: string;
  edition: 'Home (Association)' | 'Away (Icon)' | 'Statement (Alternate)' | 'City Edition';
  year: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  description: string;
  featuredNumber: string;
  featurePlayer: string;
  details: string[];
}

// --- PROFANITY FILTER UTILITY ---
const PROFANITY_LIST = ['damn', 'hell', 'crap', 'idiot', 'suck', 'ass', 'bitch', 'bastard'];
export const filterProfanity = (text: string): string => {
  let cleaned = text;
  PROFANITY_LIST.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '***');
  });
  return cleaned;
};

// Curated high-energy sports reaction GIFs
const QUICK_GIFS = [
  { id: 'g1', title: 'Hype Dunk', url: 'https://media.giphy.com/media/l0HlRnAWXxn0MhOBK/giphy.gif' },
  { id: 'g2', title: 'Clutch Three', url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiOkM/giphy.gif' },
  { id: 'g3', title: 'Celebration', url: 'https://media.giphy.com/media/xT9IgzoKnwFNmISR8I/giphy.gif' },
  { id: 'g4', title: 'Defense Stop', url: 'https://media.giphy.com/media/26FPqAH61DhAnrn3i/giphy.gif' },
];

export interface ToppsPlayerCard {
  id: string;
  name: string;
  position: string;
  team: string;
  projection: string;
  foil: string;
  rarityColor: string;
}

export const SAMPLE_TOPPS_PLAYERS: ToppsPlayerCard[] = [
  { id: 'p1', name: 'Jayson Tatum', position: 'F', team: 'BOS', projection: '24.5 PTS', foil: 'FOIL X1.5', rarityColor: 'border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]' },
  { id: 'p2', name: 'Zach LaVine', position: 'G', team: 'CHI', projection: '19.8 PTS', foil: 'BASE REFRACTOR', rarityColor: 'border-white/20' },
  { id: 'p3', name: 'Giannis Antetokounmpo', position: 'F', team: 'MIL', projection: '28.1 PTS', foil: 'FOIL X1.2', rarityColor: 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.2)]' },
  { id: 'p4', name: 'Tyrese Haliburton', position: 'G', team: 'IND', projection: '22.3 PTS', foil: 'CHROME VINTAGE', rarityColor: 'border-white/20' },
];

export const TeamHomeHubModal: React.FC<TeamHomeHubProps> = ({
  teamName,
  league,
  teamGradient,
  market = MARKET_PRESETS[0],
  isOpen = true,
  onClose,
}) => {
  const currentMarket = market || MARKET_PRESETS[0];
  const [activeTab, setActiveTab] = useState<HubTab>('roster');
  const [selectedJersey, setSelectedJersey] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [rosteredIds, setRosteredIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'RookieFan99', text: `Tuned in from ${currentMarket.name}! Let's get this W!`, time: '6:15 PM' },
    { id: '2', user: 'HoopsKing', gifUrl: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiOkM/giphy.gif', time: '6:16 PM' },
    { id: '3', user: 'ArenaVoice', text: `Live broadcast telemetry active in ${currentMarket.timezone}.`, time: '6:18 PM' },
  ]);

  if (isOpen === false) return null;

  // Derive 3-letter abbreviation
  const teamWords = teamName.trim().split(/\s+/);
  const teamAbbr =
    teamWords.length === 1
      ? teamWords[0].slice(0, 3).toUpperCase()
      : teamWords.map((w) => w[0]).join('').slice(0, 3).toUpperCase();

  // Dynamic jersey kits tailored to the franchise
  const jerseyKits: JerseyKit[] = [
    {
      id: 'kit-association',
      edition: 'Home (Association)',
      year: '2025-26',
      primaryColor: '#FFFFFF',
      secondaryColor: '#10B981',
      accentColor: '#D97706',
      textColor: '#111827',
      description: 'The clean traditional home white uniform honoring championship heritage with tailored breathable AeroSwift mesh.',
      featuredNumber: '0',
      featurePlayer: 'FRANCHISE STAR',
      details: ['Official League Gold Championship Tab', 'Breathable Dri-FIT ADV Knit', 'Heritage Side Stripe Ribbing'],
    },
    {
      id: 'kit-icon',
      edition: 'Away (Icon)',
      year: '2025-26',
      primaryColor: '#007A33',
      secondaryColor: '#FFFFFF',
      accentColor: '#BA9653',
      textColor: '#FFFFFF',
      description: 'The bold, statement away green identity expressing pure road grit and uncompromised athletic presence.',
      featuredNumber: '7',
      featurePlayer: 'WING ENFORCER',
      details: ['High-contrast Road Lettering', 'Sweat-wicking VaporKnit Technology', 'Laser-cut Ventilation Channels'],
    },
    {
      id: 'kit-statement',
      edition: 'Statement (Alternate)',
      year: '2025-26',
      primaryColor: '#111827',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      textColor: '#FFFFFF',
      description: 'Stealth blackout silhouette engineered for high-stakes primetime matchups with metallic gold trim.',
      featuredNumber: '11',
      featurePlayer: 'PLAYMAKER',
      details: ['Reflective 3M Accent Piping', 'Gold Trophy Neck Emblem', 'Subtle Jacquard Weave'],
    },
    {
      id: 'kit-city',
      edition: 'City Edition',
      year: '2025-26',
      primaryColor: '#D97706',
      secondaryColor: '#111827',
      accentColor: '#FBBF24',
      textColor: '#FFFFFF',
      description: 'A tribute to the vibrant metropolitan culture, historic landmarks, and tireless local fans across the city.',
      featuredNumber: '33',
      featurePlayer: 'DEFENDER',
      details: ['City Flag Inset Pattern', 'Skyline Hem Line Art', 'Commemorative Season Monogram'],
    },
  ];

  const currentJersey = jerseyKits[selectedJersey] || jerseyKits[0];

  const handleSendMessage = (e?: React.FormEvent, customGifUrl?: string) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() && !customGifUrl) return;

    sounds.playTap();
    const cleanText = inputMessage.trim() ? filterProfanity(inputMessage.trim()) : undefined;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: `You (${currentMarket.abbrev})`,
      text: cleanText,
      gifUrl: customGifUrl,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setShowGifPicker(false);
  };

  const toggleRoster = (id: string) => {
    sounds.playTap();
    setRosteredIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleDragEnd = (_event: any, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 400) {
      sounds.playTap();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md">
        <div className="absolute inset-0" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          drag="y"
          dragConstraints={{ top: 0 }}
          dragElastic={{ top: 0, bottom: 0.5 }}
          onDragEnd={handleDragEnd}
          className="w-full sm:max-w-2xl bg-[#0f1118] border border-white/20 rounded-t-[36px] sm:rounded-[32px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.95)] max-h-[90vh] flex flex-col relative z-10"
        >
          {/* Drag Handle Bar */}
          <div className="w-full flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-white/40 rounded-full" />
          </div>

          {/* Background Gradient & Watermark Accent */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none transition-all duration-700"
            style={{
              background:
                teamGradient ||
                'linear-gradient(135deg, rgba(245,158,11,0.25) 0%, rgba(15,23,42,0.9) 70%)',
            }}
          />

          {/* Modal Header with Telemetry: {league} HQ • {market.name} Broadcast */}
          <div className="px-6 pt-3 pb-4 flex justify-between items-center relative z-10 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black">
                  {league.toUpperCase()} HQ • {currentMarket.name} Broadcast
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold border border-emerald-500/30">
                  LIVE ARENA
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tight text-white">
                  {teamName}
                </h2>
                <span className="text-xs font-mono font-bold text-amber-400 bg-black/50 px-2 py-0.5 rounded border border-white/10">
                  {teamAbbr}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-xs font-mono text-zinc-300 hover:text-white hover:bg-black/80 transition cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Hub Navigation Tabs with Light Orange Glow Selection Effect */}
          <div className="px-6 pt-3 pb-2 relative z-10">
            <div className="grid grid-cols-5 gap-1.5 p-1 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
              {(['news', 'standings', 'roster', 'jerseys', 'chat'] as const).map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      sounds.playTap();
                      setActiveTab(tab);
                    }}
                    className={`py-2 rounded-xl font-black text-[9.5px] uppercase tracking-wider transition cursor-pointer border flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-black/80 text-amber-300 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                        : 'bg-black/40 text-zinc-400 border-white/10 hover:bg-black/60 hover:text-zinc-200'
                    }`}
                  >
                    {tab === 'chat' ? '💬 Chat' : tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* 1. ROSTER TAB (Default): Topps Authenticated Player Cards */}
            {activeTab === 'roster' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">
                    Topps Authenticated Cards • 2025-26 Series
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    {rosteredIds.length} ACTIVE IN LINEUP
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_TOPPS_PLAYERS.map((player) => {
                    const isRostered = rosteredIds.includes(player.id);
                    return (
                      <div
                        key={player.id}
                        className={`p-4 rounded-3xl bg-[#141620] border ${player.rarityColor} flex flex-col justify-between shadow-xl relative overflow-hidden group`}
                      >
                        {/* Foil Tag Pill */}
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-400/20 border border-amber-400/40 text-[9px] font-mono font-black text-amber-300">
                          {player.foil}
                        </div>

                        {/* Player Header */}
                        <div className="mb-3">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                            Topps Authenticated
                          </span>
                          <h3 className="text-base font-black text-white tracking-tight mt-0.5">
                            {player.name}
                          </h3>
                          <p className="text-xs text-zinc-400 font-mono">
                            {player.position} • {player.team}
                          </p>
                        </div>

                        {/* Projection Meter */}
                        <div className="mb-4 bg-black/40 p-2.5 rounded-2xl border border-white/10 flex justify-between items-center">
                          <span className="text-[10px] font-mono text-zinc-400">Projection:</span>
                          <span className="text-xs font-mono font-black text-emerald-400">
                            {player.projection}
                          </span>
                        </div>

                        {/* Roster Action Button */}
                        <button
                          onClick={() => toggleRoster(player.id)}
                          className={`w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition cursor-pointer active:scale-95 shadow-md flex items-center justify-center gap-1.5 ${
                            isRostered
                              ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                              : 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:brightness-110'
                          }`}
                        >
                          {isRostered ? '✓ ON ROSTER' : 'ROSTER PLAYER'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. STANDINGS TAB: Top Seed with Glow */}
            {activeTab === 'standings' && (
              <div className="p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">
                    Conference Standings
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Broadcast Market: {currentMarket.name}
                  </span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between p-3 rounded-xl bg-white/10 font-bold text-amber-300 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      1. {teamName}
                    </span>
                    <span>Top Seed (.700)</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5 text-zinc-300 border border-white/5">
                    <span>2. Divisional Contender</span>
                    <span>38 - 22 (.633)</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5 text-zinc-400 border border-white/5">
                    <span>3. Wildcard Chase</span>
                    <span>35 - 25 (.583)</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/5 text-zinc-400 border border-white/5">
                    <span>4. Mid-Table Pursuit</span>
                    <span>31 - 29 (.517)</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. NEWS TAB: Local Broadcast Notes & Market Feed */}
            {activeTab === 'news' && (
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-black">
                      MARKET FEED ({currentMarket.name})
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">12 MIN AGO</span>
                  </div>
                  <h3 className="font-bold text-sm text-white">
                    {teamName} Roster Updates & Local Broadcast Notes
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    Local broadcast analysts confirm starter rotations finalized ahead of tip-off in {currentMarket.name}. Medical staff reports zero late-scratch designations.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-black">
                      POSTGAME RECAP
                    </span>
                    <span className="text-[9px] font-mono text-zinc-400">2 HOURS AGO</span>
                  </div>
                  <h3 className="font-bold text-sm text-white">
                    Clutch Fourth-Quarter Run Secures Dominant Victory
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    High pick-and-roll execution and timely perimeter defensive rotations shut down the late fourth-quarter rally in front of a sold-out home crowd.
                  </p>
                </div>
              </div>
            )}

            {/* 4. JERSEYS UNIFORM GALLERY TAB */}
            {activeTab === 'jerseys' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {jerseyKits.map((kit, idx) => (
                    <button
                      key={kit.id}
                      onClick={() => {
                        sounds.playTap();
                        setSelectedJersey(idx);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedJersey === idx
                          ? 'border-amber-400 bg-white/15 shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                          : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: kit.primaryColor }}
                        />
                        <span className="text-[9px] font-mono text-zinc-400">{kit.year}</span>
                      </div>
                      <span className="text-[11px] font-black text-white leading-tight">
                        {kit.edition.split(' ')[0]}
                      </span>
                      <span className="text-[9px] text-zinc-400 truncate">
                        {kit.edition.split(' ')[1] || ''}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="rounded-2xl border border-white/15 bg-black/60 p-4 sm:p-5 backdrop-blur-md shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div
                      className="w-40 h-52 rounded-2xl p-4 flex flex-col justify-between items-center shadow-[0_15px_35px_rgba(0,0,0,0.8)] border border-white/20 shrink-0"
                      style={{
                        backgroundColor: currentJersey.primaryColor,
                        color: currentJersey.textColor,
                      }}
                    >
                      <div className="w-14 h-5 border-b-2 rounded-b-full border-black/20" />
                      <div className="text-center">
                        <span
                          className="text-[11px] font-black tracking-widest uppercase block"
                          style={{
                            color:
                              currentJersey.secondaryColor === '#FFFFFF' &&
                              currentJersey.primaryColor === '#FFFFFF'
                                ? '#111827'
                                : currentJersey.secondaryColor,
                          }}
                        >
                          {teamAbbr}
                        </span>
                        <span className="text-4xl font-black font-mono tracking-tight block">
                          {currentJersey.featuredNumber}
                        </span>
                      </div>
                      <div className="w-full flex justify-between items-center text-[7px] font-mono font-bold opacity-70 border-t border-current/15 pt-1">
                        <span>AUTHENTIC</span>
                        <span>OFFICIAL KIT</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black uppercase text-amber-400">
                          {currentJersey.edition}
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-zinc-300">
                          Official Kit
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white">
                        {teamName} {currentJersey.year}
                      </h4>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {currentJersey.description}
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Swatches:</span>
                        <div className="flex gap-1.5">
                          <div
                            className="w-4 h-4 rounded border border-white/20"
                            style={{ backgroundColor: currentJersey.primaryColor }}
                          />
                          <div
                            className="w-4 h-4 rounded border border-white/20"
                            style={{ backgroundColor: currentJersey.secondaryColor }}
                          />
                          <div
                            className="w-4 h-4 rounded border border-white/20"
                            style={{ backgroundColor: currentJersey.accentColor }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CHAT TAB: Live Broadcast Zone */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-[380px] bg-black/60 rounded-2xl border border-white/15 backdrop-blur-md overflow-hidden shadow-2xl">
                <div className="flex justify-between items-center px-4 py-2.5 bg-white/5 border-b border-white/10 text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-zinc-300 font-bold">
                      🟢 LIVE • {currentMarket.timezone}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setIsMuted(!isMuted);
                    }}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold font-mono transition cursor-pointer flex items-center gap-1 ${
                      isMuted
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-white/10 text-zinc-300 border-white/15 hover:bg-white/20'
                    }`}
                  >
                    {isMuted ? (
                      <>
                        <VolumeX className="w-3 h-3 text-red-400" />
                        <span>🔇 Muted</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-emerald-400" />
                        <span>🔊 Mute Chat</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {isMuted ? (
                    <div className="h-full flex flex-col items-center justify-center text-xs font-mono text-zinc-500 text-center px-6">
                      <VolumeX className="w-8 h-8 text-zinc-600 mb-2" />
                      <p>Chat is currently muted.</p>
                      <button
                        onClick={() => setIsMuted(false)}
                        className="mt-2 text-amber-400 hover:underline font-bold text-[11px]"
                      >
                        Unmute to view live fan discussions
                      </button>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className="flex flex-col text-xs">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-amber-400 font-mono text-[11px]">
                            {msg.user}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-500">{msg.time}</span>
                        </div>
                        {msg.text && (
                          <div className="text-zinc-200 bg-white/10 border border-white/10 p-2.5 rounded-2xl max-w-[85%] self-start shadow-sm leading-relaxed">
                            {msg.text}
                          </div>
                        )}
                        {msg.gifUrl && (
                          <div className="mt-1 max-w-[200px] rounded-2xl overflow-hidden border border-white/20 shadow-md">
                            <img src={msg.gifUrl} alt="fan gif" className="w-full h-auto object-cover" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {showGifPicker && !isMuted && (
                  <div className="p-2.5 bg-black/90 border-t border-white/15 grid grid-cols-4 gap-2">
                    {QUICK_GIFS.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => handleSendMessage(undefined, g.url)}
                        className="p-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition flex flex-col items-center cursor-pointer group"
                      >
                        <img src={g.url} alt={g.title} className="w-full h-12 object-cover rounded-lg mb-1" />
                        <span className="text-[8px] font-mono text-zinc-400 group-hover:text-amber-400 truncate w-full text-center">
                          {g.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {!isMuted && (
                  <form
                    onSubmit={(e) => handleSendMessage(e)}
                    className="p-2.5 bg-black/90 border-t border-white/10 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      placeholder="Type a message (Profanity filtered)..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playTap();
                        setShowGifPicker(!showGifPicker);
                      }}
                      className={`px-2.5 py-2 rounded-xl border text-[10px] font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                        showGifPicker
                          ? 'bg-amber-500 text-black border-amber-400'
                          : 'bg-white/10 text-amber-400 border-white/15 hover:bg-white/20'
                      }`}
                      title="Toggle GIF Drawer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>GIF</span>
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-black text-xs transition cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:bg-amber-400 flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send</span>
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
