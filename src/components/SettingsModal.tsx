import React, { useState } from 'react';
import {
  X,
  Palette,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Star,
  CheckCircle,
  ShieldCheck,
  Sliders,
  Eye,
  Type,
  Music,
  Maximize2,
  Radio,
  Play,
  MessageSquarePlus,
  User,
  Smartphone,
} from 'lucide-react';
import { sounds } from '../services/sound';
import { AppCustomization, ThemePreset, CardDensity, RadiusStyle, SoundPackType, AppIconChoice, HeaderBadgeStyle } from '../types';
import { AppIcon } from './AppIcon';
import { SportFeedbackModal } from './SportFeedbackModal';
import { ThemeHubModal } from './ThemeHubModal';
import { UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSimulator: boolean;
  onToggleSimulator: () => void;
  refreshInterval: number;
  onSetRefreshInterval: (seconds: number) => void;
  favorites: string[];
  onToggleFavorite: (teamId: string) => void;
  customization: AppCustomization;
  onUpdateCustomization: (updates: Partial<AppCustomization>) => void;
  onPreviewWarp?: () => void;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
  onOpenArcBoost?: () => void;
  onOpenApkModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isSimulator,
  onToggleSimulator,
  refreshInterval,
  onSetRefreshInterval,
  favorites,
  onToggleFavorite,
  customization,
  onUpdateCustomization,
  onPreviewWarp,
  currentUser,
  onOpenProfile,
  onOpenArcBoost,
  onOpenApkModal,
}) => {
  const [activeTab, setActiveTab] = useState<'themes' | 'display' | 'audio' | 'teams'>('themes');
  const [updaterStatus, setUpdaterStatus] = useState<string | null>(null);
  const [isSportFeedbackOpen, setIsSportFeedbackOpen] = useState<boolean>(false);
  const [isThemeHubOpen, setIsThemeHubOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCheckUpdates = () => {
    sounds.playTap();
    setUpdaterStatus('Checking GitHub Releases API...');
    setTimeout(() => {
      setUpdaterStatus('FOSS Sports v1.0.0 is up to date! GitHub Actions compiles new APKs on release tags.');
    }, 1200);
  };

  const themePresets: Array<{ id: ThemePreset; name: string; desc: string; bg: string; card: string; border: string; accent: string }> = [
    {
      id: 'oled',
      name: 'OLED Pitch Black',
      desc: 'True pitch black canvas from C.kt with #161618 elevated cards',
      bg: '#000000',
      card: '#161618',
      border: '#2A2A2E',
      accent: '#FFFFFF',
    },
    {
      id: 'midnight',
      name: 'Midnight Navy',
      desc: 'Deep oceanic blue slate with electric sapphire accents',
      bg: '#070B14',
      card: '#0E1626',
      border: '#1B2B48',
      accent: '#38BDF8',
    },
    {
      id: 'carbon',
      name: 'Carbon Charcoal',
      desc: 'Matte dark titanium with crisp neutral surfaces',
      bg: '#121214',
      card: '#1A1A1E',
      border: '#2D2D34',
      accent: '#E4E4E7',
    },
    {
      id: 'stadium',
      name: 'Stadium Turf',
      desc: 'Deep nighttime pitch dark green with neon emerald signals',
      bg: '#07130A',
      card: '#0D2214',
      border: '#1B3F27',
      accent: '#30D158',
    },
    {
      id: 'retro',
      name: 'Scoreboard Amber',
      desc: 'Classic vintage arena scoreboard with warm phosphor glow',
      bg: '#0C0A06',
      card: '#18140C',
      border: '#322A1A',
      accent: '#FFD60A',
    },
    {
      id: 'light',
      name: 'Apple Daylight',
      desc: 'Clean high-contrast daylight mode with pure white cards',
      bg: '#F2F2F7',
      card: '#FFFFFF',
      border: '#E5E5EA',
      accent: '#000000',
    },
    {
      id: 'team',
      name: 'Team Dynamic',
      desc: 'Adopts ambient color accents from your #1 favorite team',
      bg: '#000000',
      card: '#141416',
      border: '#282830',
      accent: '#007A33',
    },
    {
      id: 'custom',
      name: customization.customTheme?.name ? `Custom: ${customization.customTheme.name}` : 'Community Custom',
      desc: customization.customTheme ? `By ${customization.customTheme.author} • Click to adjust in Studio` : 'Build your own palette or import community share codes',
      bg: customization.customTheme?.bg || '#000000',
      card: customization.customTheme?.card || '#141416',
      border: customization.customTheme?.cardBorder || '#2A2A2E',
      accent: customization.customTheme?.accent || '#30D158',
    },
  ];

  const accentColors = [
    { label: 'White', color: '#FFFFFF' },
    { label: 'Live Red', color: '#FF453A' },
    { label: 'Emerald', color: '#30D158' },
    { label: 'Sky Blue', color: '#0A84FF' },
    { label: 'Sunset Orange', color: '#FF9F0A' },
    { label: 'Amber', color: '#FFD60A' },
    { label: 'Electric Purple', color: '#BF5AF2' },
  ];

  const popularTeams = [
    { id: 'bos-celtics', name: 'Boston Celtics', league: 'NBA', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/bos.png', color: '#007A33' },
    { id: 'lal-lakers', name: 'Los Angeles Lakers', league: 'NBA', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/lal.png', color: '#552583' },
    { id: 'gsw-warriors', name: 'Golden State Warriors', league: 'NBA', logo: 'https://a.espncdn.com/i/teamlogos/nba/500/gsw.png', color: '#1D428A' },
    { id: 'kc-chiefs', name: 'Kansas City Chiefs', league: 'NFL', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png', color: '#E31837' },
    { id: 'phi-eagles', name: 'Philadelphia Eagles', league: 'NFL', logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png', color: '#004C54' },
    { id: 'ny-yankees', name: 'New York Yankees', league: 'MLB', logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png', color: '#003087' },
    { id: 'ars-arsenal', name: 'Arsenal', league: 'EPL', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/359.png', color: '#EF0107' },
    { id: 'mci-mancity', name: 'Manchester City', league: 'EPL', logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/382.png', color: '#6CABDD' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl bg-[#161618] border border-[#2A2A2E] rounded-[24px] max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#2A2A2E] flex items-center justify-between shrink-0 bg-black/30">
          <div>
            <h2 className="text-lg font-bold text-white font-display">
              Themes & Customization
            </h2>
            <p className="text-xs text-neutral-400">
              Configure C.kt palettes, typography, sound packs, and card layout
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            aria-label="Close settings"
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-[#2A2A2E] bg-neutral-900/40 text-xs font-semibold shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('themes');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'themes'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Appearance & Themes
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('display');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'display'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Layout & Spoilers
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('audio');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'audio'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            Audio & Live Testing
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('teams');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'teams'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            My Teams ({favorites.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Account & Security Banner */}
          {onOpenProfile && (
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-white/[0.08] border border-white/15 flex items-center justify-center font-bold text-white text-sm shrink-0">
                  {currentUser ? currentUser.displayName.slice(0, 2).toUpperCase() : <User className="w-5 h-5 text-zinc-400" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white truncate">{currentUser ? currentUser.displayName : 'Guest User'}</p>
                    {currentUser?.is2FAEnabled && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                        SMS 2FA
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 truncate">
                    {currentUser?.phoneNumber ? `Linked: ${currentUser.phoneNumber}` : 'Sign in with Phone & SMS 2FA to sync across devices'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playTap();
                  onClose();
                  onOpenProfile();
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-neutral-200 transition cursor-pointer shrink-0 shadow-sm"
              >
                {currentUser ? 'Manage Account' : 'Sign In'}
              </button>
            </div>
          )}

          {/* TAB 1: THEMES & ACCENTS */}
          {activeTab === 'themes' && (
            <div className="space-y-6">
              {/* Community Theme Studio & Share Hub Entry Card */}
              <div className="p-4 bg-gradient-to-r from-emerald-950/40 via-neutral-900/60 to-purple-950/30 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">Theme Studio & Community Hub</p>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        NEW
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Browse shared presets, import share codes, or design custom hex palettes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  <button
                    onClick={() => {
                      sounds.playTap();
                      setIsThemeHubOpen(true);
                    }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 text-center"
                  >
                    Open Theme Studio
                  </button>
                </div>
              </div>

              {/* Arc Boosts & Visual Zapper Entry Card */}
              {onOpenArcBoost && (
                <div className="p-4 bg-gradient-to-r from-pink-950/40 via-amber-950/30 to-cyan-950/30 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 text-black flex items-center justify-center shrink-0 font-black shadow-[0_0_15px_rgba(244,63,94,0.4)] text-base">
                      ⚡
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">Arc Boosts & Zapper</p>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                          NEW
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400">
                        Customize & zap interface layers (Live Activity, Clutch Meter, Dock labels) or inject raw CSS
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => {
                        sounds.playTap();
                        onClose();
                        onOpenArcBoost();
                      }}
                      className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-black rounded-xl text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 text-center uppercase tracking-wider"
                    >
                      Open Zapper ⚡
                    </button>
                  </div>
                </div>
              )}

              {/* Palette Preset Selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Color Palette (C.kt Tokens)
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    Active: {customization.themePreset.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {themePresets.map((preset) => {
                    const isSelected = customization.themePreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          sounds.playTabSwitch();
                          onUpdateCustomization({ themePreset: preset.id });
                        }}
                        className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-white ring-1 ring-white bg-neutral-900/90'
                            : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-sm font-bold text-white">
                            {preset.name}
                          </span>
                          <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 border border-neutral-800">
                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.bg }} />
                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.card }} />
                            <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.accent }} />
                          </div>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug">
                          {preset.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Accent Color Picker */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                      Interface Signal Accent (C.ACCENT)
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      Tint active pills, live indicators, and highlight edges
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {accentColors.map((acc) => {
                    const isCurrent = customization.accentColor === acc.color;
                    return (
                      <button
                        key={acc.color}
                        onClick={() => {
                          sounds.playTap();
                          onUpdateCustomization({ accentColor: acc.color });
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-white text-black font-bold border-white'
                            : 'bg-black/50 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: acc.color }} />
                        <span>{acc.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Corner Radius Selector */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    Corner Curvature: C.r(base)
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Adjusts the Apple rounded rectangle curvature
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-neutral-800">
                  {(['sharp', 'standard', 'round'] as RadiusStyle[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        sounds.playTap();
                        onUpdateCustomization({ radiusStyle: r });
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                        customization.radiusStyle === r
                          ? 'bg-white text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Header Brand Badge Style Selector */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        Header Brand Badge
                      </p>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        INTERCHANGEABLE
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Select your preferred top bar insignia and status indicator
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 pt-1">
                  {[
                    {
                      id: 'dual_fs' as HeaderBadgeStyle,
                      label: 'Option B (Dual Gradient)',
                      desc: 'Team color gradient with live red dot',
                      preview: (
                        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-red-500 border border-white/30 flex items-center justify-center shadow-[0_2px_8px_rgba(29,78,216,0.4)]">
                          <span className="text-[10px] font-black text-white">FS</span>
                          <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-[#FF453A] ring-1 ring-black animate-pulse" />
                        </div>
                      ),
                    },
                    {
                      id: 'trophy' as HeaderBadgeStyle,
                      label: 'Option A (Trophy)',
                      desc: 'Stadium squircle with emerald trophy',
                      preview: (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#27272a] to-[#09090b] border border-white/20 flex items-center justify-center">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#30d158" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                            <path d="M4 22h16"></path>
                            <path d="M10 14.66V17"></path>
                            <path d="M14 14.66V17"></path>
                            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      id: 'scoreboard' as HeaderBadgeStyle,
                      label: 'Micro Scoreboard',
                      desc: '10 - 7 amber digital scoreboard readout',
                      preview: (
                        <div className="flex items-center bg-gradient-to-br from-[#1c1c1e] to-[#0a0a0c] border border-white/25 rounded-lg px-2 py-1 gap-1">
                          <span className="font-mono font-black text-[10px] text-[#ff9f0a]">10</span>
                          <span className="text-[8px] text-zinc-500">-</span>
                          <span className="font-mono font-black text-[10px] text-white">7</span>
                        </div>
                      ),
                    },
                    {
                      id: 'live_ring' as HeaderBadgeStyle,
                      label: 'Pulsing Live Ring',
                      desc: 'Dark FS with pulsing red radar ring',
                      preview: (
                        <div className="relative w-8 h-8 rounded-xl bg-gradient-to-b from-[#202024] to-[#0d0d0f] border-2 border-[#FF453A]/80 flex items-center justify-center shadow-[0_0_8px_rgba(255,69,58,0.5)]">
                          <span className="text-[10px] font-black text-white">FS</span>
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FF453A]" />
                        </div>
                      ),
                    },
                  ].map((style) => {
                    const isSelected = (customization.headerBadgeStyle || 'dual_fs') === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => {
                          sounds.playTap();
                          onUpdateCustomization({ headerBadgeStyle: style.id });
                        }}
                        className={`p-3 rounded-2xl flex flex-col items-center text-center gap-2 border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black font-bold border-white shadow-md'
                            : 'bg-black/50 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center justify-center h-9">{style.preview}</div>
                        <div>
                          <p className="text-xs font-bold leading-tight">{style.label}</p>
                          <p className={`text-[10px] mt-0.5 line-clamp-2 ${isSelected ? 'text-neutral-700' : 'text-neutral-500'}`}>
                            {style.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* App Launcher Icon Switcher */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        App Launcher Icon Switcher
                      </p>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                        IconManager.kt
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Changes the app launcher icon on your Android home screen and browser tab
                    </p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {[
                    {
                      id: 'stadium' as AppIconChoice,
                      title: 'Option 3: Stadium Carbon (Default)',
                      tag: 'DEFAULT LAUNCHER',
                      tagColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                      desc: 'Carbon mesh pattern & floodlight stadium glow paired with bold white FOSS SPORTS logotype and signature red live dot.',
                    },
                    {
                      id: 'cosmic' as AppIconChoice,
                      title: 'Option 1: Deep Cosmic Metallic',
                      tag: 'SPACE CHROME',
                      tagColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
                      desc: 'Deep pitch titanium with specular chrome refraction, cosmic violet-cyan aura, and glowing red jewel indicator.',
                    },
                    {
                      id: 'minimal' as AppIconChoice,
                      title: 'Option 2: Minimalist OLED Glass Glyph',
                      tag: 'OLED GLASS',
                      tagColor: 'bg-white/10 text-neutral-200 border-white/20',
                      desc: 'Pure pitch black background with frosted obsidian glass tile, clean athletic ring geometry, and emerald status dot.',
                    },
                  ].map((option) => {
                    const isSelected = (customization.appIcon || 'stadium') === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => {
                          sounds.playTabSwitch();
                          onUpdateCustomization({ appIcon: option.id });
                        }}
                        className={`w-full p-3 rounded-2xl text-left border transition-all cursor-pointer flex items-center gap-3.5 ${
                          isSelected
                            ? 'border-white ring-1 ring-white bg-neutral-900/90 shadow-lg'
                            : 'border-neutral-800 bg-neutral-900/40 hover:bg-neutral-900/70 hover:border-neutral-700'
                        }`}
                      >
                        <AppIcon choice={option.id} size={48} className="w-12 h-12 shrink-0 drop-shadow-md" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-xs font-bold text-white">
                              {option.title}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${option.tagColor}`}>
                              {option.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                            {option.desc}
                          </p>
                        </div>
                        <div className="w-5 h-5 rounded-full border border-neutral-700 flex items-center justify-center shrink-0">
                          {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cosmic Warp Intro Settings & Preview */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                        Cosmic Warp Intro
                      </p>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold border ${
                        customization.cosmicWarpIntro
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                      }`}>
                        {customization.cosmicWarpIntro ? 'ON' : 'OFF'}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        SplashActivity.kt
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      1.4s 3D outer space starfield hyperdrive warp cold start animation
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-300">
                      {customization.cosmicWarpIntro ? 'On' : 'Off'}
                    </span>
                    <button
                      onClick={() => {
                        sounds.playTap();
                        onUpdateCustomization({ cosmicWarpIntro: !customization.cosmicWarpIntro });
                      }}
                      aria-label="Toggle Cosmic Warp Intro"
                      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                        customization.cosmicWarpIntro ? 'bg-white' : 'bg-neutral-800'
                      }`}
                    >
                      <span
                        className={`block w-5 h-5 rounded-full transition-transform ${
                          customization.cosmicWarpIntro ? 'bg-black translate-x-6' : 'bg-neutral-500 translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {onPreviewWarp && (
                  <button
                    onClick={() => {
                      sounds.playTabSwitch();
                      onClose();
                      setTimeout(() => {
                        onPreviewWarp();
                      }, 100);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />
                    <span>Preview Cosmic Warp Intro Now</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: DISPLAY, LAYOUT & SPOILERS */}
          {activeTab === 'display' && (
            <div className="space-y-4">
              {/* Card Density */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Card Density</p>
                  <p className="text-xs text-neutral-400">
                    Compact shows tighter lists; Expanded includes period-by-period linescores
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-neutral-800">
                  {(['compact', 'standard', 'expanded'] as CardDensity[]).map((d) => (
                    <button
                      key={d}
                      onClick={() => {
                        sounds.playTap();
                        onUpdateCustomization({ cardDensity: d });
                      }}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                        customization.cardDensity === d
                          ? 'bg-white text-black font-bold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* UpperHeadings: C.upperHeadings */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Uppercase Typography (C.upperHeadings)</p>
                  <p className="text-xs text-neutral-400">
                    Render team names and category titles in bold all-caps
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playTap();
                    onUpdateCustomization({ upperHeadings: !customization.upperHeadings });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    customization.upperHeadings ? 'bg-white' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full transition-transform ${
                      customization.upperHeadings ? 'bg-black translate-x-6' : 'bg-neutral-500 translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Scores Spoiler Shield */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Spoiler Protection (Hide Scores)</p>
                  <p className="text-xs text-neutral-400">
                    Conceal final & live scores until tapped — great for DVR tape delay
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playTap();
                    onUpdateCustomization({ hideScoresSpoiler: !customization.hideScoresSpoiler });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    customization.hideScoresSpoiler ? 'bg-white' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full transition-transform ${
                      customization.hideScoresSpoiler ? 'bg-black translate-x-6' : 'bg-neutral-500 translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Odds & Prediction Markets Section */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">Odds & Prediction Markets</p>
                      <span className="text-[10px] font-bold text-[#30D158] bg-[#30D158]/10 border border-[#30D158]/30 px-1.5 py-0.5 rounded">
                        AGGREGATED CONSENSUS
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Show aggregated market consensus & implied win percentages in Game Details
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playTap();
                      onUpdateCustomization({
                        showMarketConsensus: customization.showMarketConsensus === false ? true : false,
                      });
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      customization.showMarketConsensus !== false ? 'bg-white' : 'bg-neutral-800'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full transition-transform ${
                        customization.showMarketConsensus !== false ? 'bg-black translate-x-6' : 'bg-neutral-500 translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Aggregation Provider Checkboxes / Toggles */}
                {customization.showMarketConsensus !== false && (
                  <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                    <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                      Active Data Providers
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Kalshi', 'Polymarket', 'DraftKings', 'FanDuel'].map((provider) => {
                        const currentProviders = customization.marketProviders || [
                          'Kalshi',
                          'Polymarket',
                          'DraftKings',
                          'FanDuel',
                        ];
                        const isEnabled = currentProviders.includes(provider);

                        return (
                          <button
                            key={provider}
                            onClick={() => {
                              sounds.playTap();
                              const updated = isEnabled
                                ? currentProviders.filter((p) => p !== provider)
                                : [...currentProviders, provider];
                              onUpdateCustomization({ marketProviders: updated });
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                              isEnabled
                                ? 'bg-white/10 border-white/30 text-white'
                                : 'bg-black/30 border-neutral-800 text-neutral-500 hover:text-neutral-300'
                            }`}
                          >
                            <span>{provider}</span>
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isEnabled ? 'bg-[#30D158] shadow-[0_0_6px_#30D158]' : 'bg-neutral-700'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>


              {/* Show Situation & Last Play */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Show In-Game Situations & Plays</p>
                  <p className="text-xs text-neutral-400">
                    Down & distance, count/outs, and latest scoring drive footnotes
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playTap();
                    onUpdateCustomization({ showSituations: !customization.showSituations });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    customization.showSituations ? 'bg-white' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full transition-transform ${
                      customization.showSituations ? 'bg-black translate-x-6' : 'bg-neutral-500 translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Breaking News Ticker Toggle */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Display News Ticker</p>
                  <p className="text-xs text-neutral-400">
                    Show top headlines marquee bar below league selector
                  </p>
                </div>

                <button
                  onClick={() => {
                    sounds.playTap();
                    onUpdateCustomization({ showTicker: !customization.showTicker });
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                    customization.showTicker ? 'bg-white' : 'bg-neutral-800'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full transition-transform ${
                      customization.showTicker ? 'bg-black translate-x-6' : 'bg-neutral-500 translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO & SIMULATION */}
          {activeTab === 'audio' && (
            <div className="space-y-4">
              {/* Sound Pack Selection */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Music className="w-4 h-4 text-white" />
                    <div>
                      <p className="text-sm font-semibold text-white">Audio & Sound Pack</p>
                      <p className="text-xs text-neutral-400">Synthesized audio cues when games score or tabs change</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'apple', label: 'Apple Subtle', desc: 'Clicks & double bell' },
                    { id: 'stadium', label: 'Stadium', desc: 'Whistle & organ chord' },
                    { id: 'arcade', label: '8-Bit Retro', desc: 'Arcade chimes' },
                    { id: 'silent', label: 'Silent', desc: 'Haptic vibrate only' },
                  ].map((sp) => {
                    const isSelected = customization.soundPack === sp.id;
                    return (
                      <button
                        key={sp.id}
                        onClick={() => {
                          sounds.setSoundPack(sp.id as SoundPackType);
                          onUpdateCustomization({ soundPack: sp.id as SoundPackType });
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white text-black font-bold border-white'
                            : 'bg-black/50 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                        }`}
                      >
                        <p className="text-xs font-bold leading-tight">{sp.label}</p>
                        <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-neutral-700' : 'text-neutral-500'}`}>
                          {sp.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Live Test Mode */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Interactive Live Test Mode</p>
                      <p className="text-xs text-neutral-400">Simulates live clocks, real-time score updates & haptics</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playTap();
                      onToggleSimulator();
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      isSimulator ? 'bg-amber-400' : 'bg-neutral-800'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full transition-transform ${
                        isSimulator ? 'bg-black translate-x-6' : 'bg-neutral-500 translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Live Polling Interval */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Live ESPN Refresh Rate</p>
                  <p className="text-xs text-neutral-400">Interval for fetching real scoreboard endpoints</p>
                </div>

                <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-neutral-800">
                  {[10, 15, 30].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => {
                        sounds.playTap();
                        onSetRefreshInterval(sec);
                      }}
                      className={`px-3 py-1 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                        refreshInterval === sec
                          ? 'bg-white text-black'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* League Anthem Audio Fanfares & Jingles */}
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">League Anthem Audio Fanfares</p>
                      <p className="text-xs text-neutral-400">Synthesized acoustic chord progressions when switching league tabs</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const next = !(customization.leagueJinglesEnabled !== false);
                      sounds.playTap();
                      onUpdateCustomization({ leagueJinglesEnabled: next });
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      customization.leagueJinglesEnabled !== false ? 'bg-purple-500' : 'bg-neutral-800'
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                        customization.leagueJinglesEnabled !== false ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {/* Soundboard Preview Test Chips */}
                <div className="pt-1">
                  <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">
                    Tap to test synthesized acoustic fanfares:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'nba', label: '🏀 NBA Synth' },
                      { id: 'nfl', label: '🏈 NFL Brass' },
                      { id: 'mlb', label: '⚾ MLB Organ' },
                      { id: 'nhl', label: '🏒 NHL Horn' },
                      { id: 'f1', label: '🏎️ F1 Engine' },
                      { id: 'epl', label: '⚽ EPL Chime' },
                      { id: 'all', label: '✨ All Leagues' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => sounds.playLeagueJingle(item.id)}
                        className="px-2.5 py-2 rounded-xl bg-black/60 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 active:scale-95 transition cursor-pointer text-center"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MY TEAMS */}
          {activeTab === 'teams' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-bold text-white">Followed Teams ({favorites.length})</h3>
                  <p className="text-xs text-neutral-400">Follow teams to customize your "My Teams" home feed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {popularTeams.map((team) => {
                  const isFav = favorites.includes(team.id);
                  return (
                    <button
                      key={team.id}
                      onClick={() => {
                        sounds.playTap();
                        onToggleFavorite(team.id);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        isFav
                          ? 'bg-neutral-800 border-neutral-600 text-white'
                          : 'bg-black/40 border-neutral-800/80 text-neutral-400 hover:text-white hover:border-neutral-700'
                      }`}
                    >
                      <img
                        src={team.logo}
                        alt={team.name}
                        className="w-6 h-6 object-contain shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate leading-tight">
                          {team.name}
                        </p>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {team.league}
                        </span>
                      </div>
                      <div className="w-5 h-5 flex items-center justify-center shrink-0">
                        <Star
                          className={`w-4 h-4 ${
                            isFav ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Request a Sport or League Section */}
          <div className="p-4 bg-gradient-to-r from-blue-950/30 via-indigo-950/20 to-neutral-900/60 rounded-2xl border border-indigo-900/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                <MessageSquarePlus className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">Request a Sport or League</p>
                <p className="text-xs text-neutral-400 truncate">Vote for UFC, NASCAR, PGA Tour, Tennis, Cricket & more</p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playTap();
                setIsSportFeedbackOpen(true);
              }}
              className="px-3.5 py-2 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
            >
              Vote & Request
            </button>
          </div>

          {/* Install on Android / APK Builder */}
          {onOpenApkModal && (
            <div className="p-4 bg-gradient-to-r from-emerald-950/35 via-neutral-900/70 to-black rounded-2xl border border-emerald-500/25 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">Install on Android / Download APK</p>
                  <p className="text-xs text-neutral-400 truncate">WebAPK install for Moto Razr Fold or Kotlin APK builder ZIP</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playTap();
                  onClose();
                  onOpenApkModal();
                }}
                className="px-3.5 py-2 bg-[#30D158] hover:bg-emerald-400 text-black rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
              >
                Open Hub
              </button>
            </div>
          )}

          {/* APK In-App Updater & Build Version */}
          <div className="p-4 bg-black/40 rounded-2xl border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">FOSS Sports Android v1.0.0</p>
                <p className="text-[11px] text-neutral-400">Open-source, no trackers, zero ads</p>
              </div>
            </div>

            <button
              onClick={handleCheckUpdates}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Check Updates
            </button>
          </div>

          {updaterStatus && (
            <p className="text-xs text-center text-neutral-400 font-mono animate-fade-in">
              {updaterStatus}
            </p>
          )}
        </div>
      </div>

      {/* Interactive Sports Request & Feedback Dialog */}
      <SportFeedbackModal
        isOpen={isSportFeedbackOpen}
        onClose={() => setIsSportFeedbackOpen(false)}
      />

      {/* Community Themes & Custom Theme Studio Hub */}
      <ThemeHubModal
        isOpen={isThemeHubOpen}
        onClose={() => setIsThemeHubOpen(false)}
        customization={customization}
        onUpdateCustomization={onUpdateCustomization}
      />
    </div>
  );
};
