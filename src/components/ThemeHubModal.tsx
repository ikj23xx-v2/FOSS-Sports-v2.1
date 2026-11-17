import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Share2,
  Download,
  Upload,
  Check,
  Heart,
  Sliders,
  Copy,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Eye,
  Tv,
} from 'lucide-react';
import { sounds } from '../services/sound';
import { CommunityThemeData, AppCustomization } from '../types';

interface ThemeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  customization: AppCustomization;
  onUpdateCustomization: (updates: Partial<AppCustomization>) => void;
}

export const DEFAULT_COMMUNITY_THEMES: CommunityThemeData[] = [
  {
    id: 'c1',
    name: 'Pure Obsidian Glass',
    author: '@DesignLead',
    bg: '#000000',
    card: '#141416',
    cardBorder: '#2A2A2E',
    accent: '#FFFFFF',
    text: '#FFFFFF',
    text2: '#8E8E93',
    cornerRadius: 18,
    upvotes: 342,
    bannerStyle: 'glass',
  },
  {
    id: 'c2',
    name: 'Cyber Arena',
    author: '@TechBaller',
    bg: '#05050A',
    card: '#0E0E18',
    cardBorder: '#1F1F35',
    accent: '#00F0FF',
    text: '#F0F6FC',
    text2: '#7D8590',
    cornerRadius: 12,
    upvotes: 219,
    bannerStyle: 'gradient',
  },
  {
    id: 'c3',
    name: 'Fenway Heritage',
    author: '@SoxFan67',
    bg: '#040C07',
    card: '#0D1E12',
    cardBorder: '#1C3A24',
    accent: '#30D158',
    text: '#FFFFFF',
    text2: '#7EA887',
    cornerRadius: 16,
    upvotes: 158,
    bannerStyle: 'flat',
  },
  {
    id: 'c4',
    name: 'Kobe 24 Tribute',
    author: '@PurpleGold',
    bg: '#0A0A0C',
    card: '#16121E',
    cardBorder: '#33244D',
    accent: '#FDB927',
    text: '#FFFFFF',
    text2: '#A798BD',
    cornerRadius: 18,
    upvotes: 184,
    bannerStyle: 'gradient',
  },
];

export function themeToShareCode(theme: CommunityThemeData): string {
  const hexToInt = (hex: string) => {
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    const parsed = parseInt(full, 16);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const payload = {
    name: theme.name,
    author: theme.author,
    bg: hexToInt(theme.bg),
    card: hexToInt(theme.card),
    border: hexToInt(theme.cardBorder),
    accent: hexToInt(theme.accent),
    text: hexToInt(theme.text),
    text2: hexToInt(theme.text2),
    r: theme.cornerRadius,
  };
  return btoa(JSON.stringify(payload));
}

export function themeFromShareCode(code: string): CommunityThemeData | null {
  try {
    let raw = code.trim();
    if (raw.startsWith('foss://theme?data=')) {
      raw = decodeURIComponent(raw.replace('foss://theme?data=', ''));
    }
    const jsonStr = atob(raw);
    const json = JSON.parse(jsonStr);
    const intToHex = (num: number) => {
      const hex = (num >>> 0).toString(16).padStart(6, '0').slice(-6);
      return `#${hex.toUpperCase()}`;
    };

    return {
      id: `imported_${Date.now()}`,
      name: json.name || 'Custom Theme',
      author: json.author || 'Community User',
      bg: typeof json.bg === 'number' ? intToHex(json.bg) : (json.bg || '#000000'),
      card: typeof json.card === 'number' ? intToHex(json.card) : (json.card || '#161618'),
      cardBorder: typeof json.border === 'number' ? intToHex(json.border) : (json.border || '#2A2A2E'),
      accent: typeof json.accent === 'number' ? intToHex(json.accent) : (json.accent || '#30D158'),
      text: typeof json.text === 'number' ? intToHex(json.text) : (json.text || '#FFFFFF'),
      text2: typeof json.text2 === 'number' ? intToHex(json.text2) : (json.text2 || '#8E8E93'),
      cornerRadius: Number.isFinite(Number(json.r)) && Number(json.r) >= 0 ? Number(json.r) : 16,
      upvotes: 1,
      bannerStyle: 'glass',
    };
  } catch {
    return null;
  }
}

export const ThemeHubModal: React.FC<ThemeHubModalProps> = ({
  isOpen,
  onClose,
  customization,
  onUpdateCustomization,
}) => {
  const [activeTab, setActiveTab] = useState<'community' | 'creator'>('community');
  const [importCode, setImportCode] = useState('');
  const [communityList, setCommunityList] = useState<CommunityThemeData[]>(() => {
    try {
      const saved = localStorage.getItem('foss_community_themes_saved');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore
    }
    return DEFAULT_COMMUNITY_THEMES;
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Custom Theme Creator State
  const [customDraft, setCustomDraft] = useState<CommunityThemeData>(() => {
    if (customization.customTheme) {
      return customization.customTheme;
    }
    return {
      id: 'draft',
      name: 'My Custom Theme',
      author: '@Me',
      bg: '#000000',
      card: '#161618',
      cardBorder: '#2A2A2E',
      accent: '#30D158',
      text: '#FFFFFF',
      text2: '#8E8E93',
      cornerRadius: 18,
      bannerStyle: 'glass',
    };
  });

  const [publishAuthor, setPublishAuthor] = useState('@SportsFan');
  const [isPublishing, setIsPublishing] = useState(false);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleApplyTheme = (theme: CommunityThemeData) => {
    sounds.playTap();
    onUpdateCustomization({
      themePreset: 'custom',
      accentColor: theme.accent,
      customTheme: theme,
    });
    showToast(`Theme '${theme.name}' applied!`);
  };

  const handleShareTheme = (theme: CommunityThemeData) => {
    sounds.playTap();
    const code = themeToShareCode(theme);
    const shareUrl = `foss://theme?data=${encodeURIComponent(code)}`;
    try {
      navigator.clipboard.writeText(code);
      showToast('Theme code copied to clipboard!');
    } catch {
      showToast('Theme code ready: ' + code.slice(0, 16) + '...');
    }
  };

  const handleImport = () => {
    sounds.playTap();
    if (!importCode.trim()) return;
    const theme = themeFromShareCode(importCode);
    if (theme) {
      handleApplyTheme(theme);
      setCommunityList((prev) => [theme, ...prev.filter((t) => t.id !== theme.id)]);
      setImportCode('');
    } else {
      showToast('Invalid theme code. Please check format.');
    }
  };

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sounds.playTap();
    setCommunityList((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, upvotes: (t.upvotes || 0) + 1 } : t));
      try {
        localStorage.setItem('foss_community_themes_saved', JSON.stringify(updated));
      } catch {
        // Ignore
      }
      return updated;
    });
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playTap();
    const newTheme: CommunityThemeData = {
      ...customDraft,
      id: `theme_${Date.now()}`,
      author: publishAuthor.trim() || '@CommunityUser',
      upvotes: 1,
    };

    const updated = [newTheme, ...communityList];
    setCommunityList(updated);
    try {
      localStorage.setItem('foss_community_themes_saved', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    handleApplyTheme(newTheme);
    setIsPublishing(false);
    setActiveTab('community');
    showToast(`Theme '${newTheme.name}' published to Community!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#161618] border border-[#2A2A2E] rounded-[24px] max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#2A2A2E] flex items-center justify-between bg-black/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-display tracking-tight">
                Theme Studio & Community Hub
              </h2>
              <p className="text-xs text-[#8E8E93]">
                Create custom color schemes, import tokens, or browse community presets
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            aria-label="Close Theme Studio"
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 px-6 pt-3 pb-2 border-b border-[#2A2A2E] bg-neutral-900/40 text-xs font-semibold shrink-0">
          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('community');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'community'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Community Themes ({communityList.length})
          </button>

          <button
            onClick={() => {
              sounds.playTap();
              setActiveTab('creator');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === 'creator'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Create Custom Theme
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: COMMUNITY THEMES HUB */}
          {activeTab === 'community' && (
            <div className="space-y-5">
              {/* Import Bar */}
              <div className="bg-[#1F1F23] border border-[#2A2A2E] rounded-2xl p-3 flex items-center gap-2">
                <input
                  type="text"
                  value={importCode}
                  onChange={(e) => setImportCode(e.target.value)}
                  placeholder="Paste shared theme code or foss://theme?data=..."
                  className="flex-1 bg-black/50 text-white placeholder-[#636366] text-xs font-mono px-3 py-2 rounded-xl border border-[#2A2A2E] focus:outline-none focus:border-white"
                />
                <button
                  onClick={handleImport}
                  className="px-4 py-2 bg-white hover:bg-neutral-200 text-black font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer shadow-sm active:scale-95"
                >
                  Import
                </button>
              </div>

              {/* Community Showcase Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#8E8E93] font-bold">
                    Featured Community Presets
                  </span>
                  <button
                    onClick={() => setActiveTab('creator')}
                    className="text-xs font-bold text-white hover:text-neutral-300 flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create Your Own</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {communityList.map((theme) => {
                    const isActive =
                      customization.themePreset === 'custom' &&
                      customization.customTheme?.name === theme.name;

                    return (
                      <div
                        key={theme.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isActive
                            ? 'border-white ring-1 ring-white bg-[#141416]'
                            : 'border-[#2A2A2E] bg-neutral-900/50 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          {/* Title and Upvote Header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="text-sm font-bold text-white leading-tight">
                                {theme.name}
                              </h3>
                              <p className="text-[11px] text-[#8E8E93] font-mono mt-0.5">
                                by {theme.author}
                              </p>
                            </div>

                            <button
                              onClick={(e) => handleUpvote(theme.id, e)}
                              className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-[#30D158] border border-white/10 transition-all cursor-pointer"
                              title="Upvote this theme"
                            >
                              <span>▲</span>
                              <span>{theme.upvotes || 0}</span>
                            </button>
                          </div>

                          {/* Mini Color Swatch Palette Strip */}
                          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-black/40 border border-[#2A2A2E] mb-3">
                            <span
                              className="w-4 h-4 rounded-full border border-white/20"
                              style={{ backgroundColor: theme.bg }}
                              title="Canvas Background"
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-white/20"
                              style={{ backgroundColor: theme.card }}
                              title="Card Surface"
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-white/20"
                              style={{ backgroundColor: theme.accent }}
                              title="Signal Accent"
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-white/20"
                              style={{ backgroundColor: theme.text }}
                              title="Primary Text"
                            />
                            <span className="text-[10px] font-mono text-[#8E8E93] ml-auto">
                              R: {theme.cornerRadius}px
                            </span>
                          </div>
                        </div>

                        {/* Card Actions: Share Code & Apply */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#2A2A2E]/80">
                          <button
                            onClick={() => handleShareTheme(theme)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </button>

                          <button
                            onClick={() => handleApplyTheme(theme)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
                              isActive
                                ? 'bg-[#30D158] text-black font-extrabold'
                                : 'bg-white text-black hover:bg-neutral-200'
                            }`}
                          >
                            {isActive ? 'Active' : 'Apply'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE CUSTOM THEME (THEME CREATOR) */}
          {activeTab === 'creator' && (
            <div className="space-y-6">
              {/* Live Interactive Mini Preview Card */}
              <div className="p-4 rounded-2xl border border-[#2A2A2E] bg-black/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E93] font-bold">
                    Real-Time Theme Preview
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Interactive
                  </span>
                </div>

                {/* Simulated Canvas & Game Card with Live Custom Tokens */}
                <div
                  className="p-4 rounded-2xl border transition-all"
                  style={{
                    backgroundColor: customDraft.bg,
                    borderColor: customDraft.cardBorder,
                  }}
                >
                  <div
                    className="p-3.5 border transition-all shadow-md"
                    style={{
                      backgroundColor: customDraft.card,
                      borderColor: customDraft.cardBorder,
                      borderRadius: `${customDraft.cornerRadius}px`,
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-black uppercase text-black"
                          style={{ backgroundColor: customDraft.accent }}
                        >
                          LIVE
                        </span>
                        <span
                          className="text-xs font-bold font-mono"
                          style={{ color: customDraft.text2 }}
                        >
                          · 4TH 2:15
                        </span>
                      </div>
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded border"
                        style={{
                          backgroundColor: `${customDraft.accent}15`,
                          borderColor: `${customDraft.accent}40`,
                          color: customDraft.accent,
                        }}
                      >
                        📈 BOS 68%
                      </span>
                    </div>

                    {/* Team Rows */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: customDraft.accent }}
                          />
                          <span
                            className="text-xs font-bold uppercase tracking-tight"
                            style={{ color: customDraft.text }}
                          >
                            BOSTON CELTICS
                          </span>
                        </div>
                        <span
                          className="text-lg font-black font-mono tabular-nums"
                          style={{ color: customDraft.text }}
                        >
                          114
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: customDraft.text2 }}
                          />
                          <span
                            className="text-xs font-bold uppercase tracking-tight"
                            style={{ color: customDraft.text2 }}
                          >
                            LOS ANGELES LAKERS
                          </span>
                        </div>
                        <span
                          className="text-lg font-black font-mono tabular-nums"
                          style={{ color: customDraft.text2 }}
                        >
                          108
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Parameters Sliders & Color Pickers */}
              <div className="space-y-4">
                {/* Theme Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1">
                    Theme Name
                  </label>
                  <input
                    type="text"
                    value={customDraft.name}
                    onChange={(e) => setCustomDraft({ ...customDraft, name: e.target.value })}
                    className="w-full bg-[#1F1F23] text-white text-xs font-bold px-3 py-2 rounded-xl border border-[#2A2A2E] focus:outline-none focus:border-white"
                  />
                </div>

                {/* Color Pickers Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8E8E93] mb-1">
                      Canvas BG
                    </label>
                    <div className="flex items-center gap-2 bg-[#1F1F23] p-1.5 rounded-xl border border-[#2A2A2E]">
                      <input
                        type="color"
                        value={customDraft.bg}
                        onChange={(e) => setCustomDraft({ ...customDraft, bg: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customDraft.bg}
                        onChange={(e) => setCustomDraft({ ...customDraft, bg: e.target.value })}
                        className="w-full bg-transparent text-white text-[11px] font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8E8E93] mb-1">
                      Card Surface
                    </label>
                    <div className="flex items-center gap-2 bg-[#1F1F23] p-1.5 rounded-xl border border-[#2A2A2E]">
                      <input
                        type="color"
                        value={customDraft.card}
                        onChange={(e) => setCustomDraft({ ...customDraft, card: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customDraft.card}
                        onChange={(e) => setCustomDraft({ ...customDraft, card: e.target.value })}
                        className="w-full bg-transparent text-white text-[11px] font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8E8E93] mb-1">
                      Card Border
                    </label>
                    <div className="flex items-center gap-2 bg-[#1F1F23] p-1.5 rounded-xl border border-[#2A2A2E]">
                      <input
                        type="color"
                        value={customDraft.cardBorder}
                        onChange={(e) => setCustomDraft({ ...customDraft, cardBorder: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customDraft.cardBorder}
                        onChange={(e) => setCustomDraft({ ...customDraft, cardBorder: e.target.value })}
                        className="w-full bg-transparent text-white text-[11px] font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8E8E93] mb-1">
                      Signal Accent
                    </label>
                    <div className="flex items-center gap-2 bg-[#1F1F23] p-1.5 rounded-xl border border-[#2A2A2E]">
                      <input
                        type="color"
                        value={customDraft.accent}
                        onChange={(e) => setCustomDraft({ ...customDraft, accent: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customDraft.accent}
                        onChange={(e) => setCustomDraft({ ...customDraft, accent: e.target.value })}
                        className="w-full bg-transparent text-white text-[11px] font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8E8E93] mb-1">
                      Primary Text
                    </label>
                    <div className="flex items-center gap-2 bg-[#1F1F23] p-1.5 rounded-xl border border-[#2A2A2E]">
                      <input
                        type="color"
                        value={customDraft.text}
                        onChange={(e) => setCustomDraft({ ...customDraft, text: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customDraft.text}
                        onChange={(e) => setCustomDraft({ ...customDraft, text: e.target.value })}
                        className="w-full bg-transparent text-white text-[11px] font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8E8E93] mb-1">
                      Secondary Text
                    </label>
                    <div className="flex items-center gap-2 bg-[#1F1F23] p-1.5 rounded-xl border border-[#2A2A2E]">
                      <input
                        type="color"
                        value={customDraft.text2}
                        onChange={(e) => setCustomDraft({ ...customDraft, text2: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={customDraft.text2}
                        onChange={(e) => setCustomDraft({ ...customDraft, text2: e.target.value })}
                        className="w-full bg-transparent text-white text-[11px] font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Corner Radius Geometry Slider */}
                <div className="bg-[#1F1F23] p-3 rounded-2xl border border-[#2A2A2E] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">
                      Corner Curvature Radius: {customDraft.cornerRadius}px
                    </span>
                    <span className="text-[11px] text-[#8E8E93]">
                      {customDraft.cornerRadius <= 4 ? 'Sharp Rectangle' : customDraft.cornerRadius <= 16 ? 'Apple Standard' : 'Liquid Capsule'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {[0, 14, 24].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setCustomDraft({ ...customDraft, cornerRadius: r })}
                        className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border ${
                          customDraft.cornerRadius === r
                            ? 'bg-white text-black border-white'
                            : 'bg-black/50 text-[#8E8E93] border-[#2A2A2E]'
                        }`}
                      >
                        {r}px
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: Apply, Export & Publish */}
                <div className="flex items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleShareTheme(customDraft)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Export Code</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPublishing(true)}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Publish
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyTheme(customDraft)}
                      className="px-5 py-2 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      Apply to App
                    </button>
                  </div>
                </div>

                {/* Publish Form Overlay */}
                {isPublishing && (
                  <form
                    onSubmit={handlePublish}
                    className="p-4 rounded-2xl bg-black/80 border border-white/20 space-y-3 animate-fade-in"
                  >
                    <p className="text-xs font-bold text-white uppercase tracking-wider">
                      Publish Theme to Community Hub
                    </p>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-[#8E8E93] mb-1">
                        Creator Handle
                      </label>
                      <input
                        type="text"
                        value={publishAuthor}
                        onChange={(e) => setPublishAuthor(e.target.value)}
                        placeholder="@YourHandle"
                        className="w-full bg-[#1F1F23] text-white text-xs px-3 py-2 rounded-xl border border-[#2A2A2E]"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPublishing(false)}
                        className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-[#30D158] hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl shadow-sm"
                      >
                        Confirm & Publish
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Toast confirmation */}
        {toastMsg && (
          <div className="absolute inset-x-6 bottom-4 p-3 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center gap-2 shadow-2xl animate-fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
};
