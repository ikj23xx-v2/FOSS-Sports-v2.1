import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DeclutterSettings {
  hideBroadcastBadges: boolean;
  hideConsensusBar: boolean;
  hideTeamRecords: boolean;
  compactHeader: boolean;
  customCss: string;
}

export const DEFAULT_DECLUTTER_SETTINGS: DeclutterSettings = {
  hideBroadcastBadges: false,
  hideConsensusBar: false,
  hideTeamRecords: false,
  compactHeader: false,
  customCss: '',
};

// --- RENAMED "DECLUTTER" BANNER CARD ---
export const DeclutterBannerCard: React.FC<{ onOpenDeclutter: () => void }> = ({ onOpenDeclutter }) => {
  return (
    <div className="w-full max-w-xl mx-auto my-4 p-5 rounded-3xl bg-gradient-to-br from-[#231420] via-[#15161f] to-[#12141c] border border-white/10 shadow-2xl">
      <div className="flex items-start gap-4 mb-4">
        {/* Pink-Orange Gradient Lightning Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-400 to-amber-300 flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(244,114,182,0.35)] shrink-0">
          ⚡
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-lg font-black text-white tracking-tight">Declutter</h3>
            <span className="px-2 py-0.5 rounded-lg bg-pink-500/15 border border-pink-500/40 text-[10px] font-black uppercase tracking-wider text-pink-400">
              NEW
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
            Customize & declutter interface layers (Live Activity, Clutch Meter, Dock labels) or inject raw CSS
          </p>
        </div>
      </div>

      <button
        onClick={onOpenDeclutter}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:brightness-110 active:scale-[0.99] text-black font-black text-xs sm:text-sm uppercase tracking-widest shadow-[0_0_25px_rgba(249,115,22,0.4)] transition cursor-pointer flex items-center justify-center gap-1.5"
      >
        <span>OPEN DECLUTTER</span>
        <span>⚡</span>
      </button>
    </div>
  );
};

// --- DECLUTTER MODAL WITH TOGGLES & RAW CSS INJECTOR ---
export const DeclutterModal: React.FC<{
  isOpen: boolean;
  settings: DeclutterSettings;
  onUpdate: (next: DeclutterSettings) => void;
  onClose: () => void;
}> = ({ isOpen, settings, onUpdate, onClose }) => {
  const [localSettings, setLocalSettings] = useState<DeclutterSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  // Apply raw CSS into document head
  useEffect(() => {
    let styleTag = document.getElementById('foss-declutter-injected-styles') as HTMLStyleElement | null;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'foss-declutter-injected-styles';
      document.head.appendChild(styleTag);
    }

    const rules: string[] = [];
    if (settings.hideBroadcastBadges) {
      rules.push('.foss-broadcast-pill { display: none !important; }');
    }
    if (settings.hideConsensusBar) {
      rules.push('.foss-consensus-bar, .foss-clutch-meter { display: none !important; }');
    }
    if (settings.hideTeamRecords) {
      rules.push('.foss-team-record { display: none !important; }');
    }
    if (settings.customCss) {
      rules.push(settings.customCss);
    }

    styleTag.textContent = rules.join('\n');
  }, [settings]);

  if (!isOpen) return null;

  const toggleKey = (key: keyof Omit<DeclutterSettings, 'customCss'>) => {
    const next = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(next);
  };

  const handleApply = () => {
    onUpdate(localSettings);
    try {
      localStorage.setItem('foss_declutter_settings', JSON.stringify(localSettings));
    } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        className="relative z-10 w-full max-w-md rounded-3xl bg-[#141620] border border-white/15 p-6 shadow-2xl text-white"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-300 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(244,114,182,0.4)]">
              ⚡
            </span>
            <div>
              <h3 className="text-base font-black tracking-tight">Declutter Interface</h3>
              <p className="text-[10px] font-mono text-zinc-400">TOGGLE UI LAYERS & CUSTOM CSS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs text-zinc-300 hover:bg-white/10 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5 mb-4">
          {[
            { key: 'hideBroadcastBadges', label: 'Hide Broadcast TV Badges', desc: 'Removes network pills (TNT, ESPN) from scorecards' },
            { key: 'hideConsensusBar', label: 'Hide Market Consensus Bar', desc: 'Removes implied probability footers from matchups' },
            { key: 'hideTeamRecords', label: 'Hide Team Win-Loss Records', desc: 'Shows only team names and scores for minimal look' },
          ].map((item) => {
            const active = localSettings[item.key as keyof Omit<DeclutterSettings, 'customCss'>];
            return (
              <button
                key={item.key}
                onClick={() => toggleKey(item.key as any)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                  active
                    ? 'bg-black/80 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-white">{item.label}</div>
                  <div className="text-[10px] text-zinc-400">{item.desc}</div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${active ? 'bg-amber-400 text-black' : 'bg-white/10 text-zinc-400'}`}>
                  {active ? 'ON' : 'OFF'}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mb-4">
          <label className="text-[10px] font-mono text-zinc-400 uppercase block mb-1.5">Inject Raw CSS</label>
          <textarea
            rows={2}
            placeholder="/* e.g. .score-card { border-radius: 16px; } */"
            value={localSettings.customCss}
            onChange={(e) => setLocalSettings({ ...localSettings, customCss: e.target.value })}
            className="w-full rounded-xl bg-black/60 border border-white/15 p-2.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          onClick={handleApply}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-[0.99] text-black font-black text-xs uppercase tracking-widest cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.4)]"
        >
          APPLY DECLUTTER
        </button>
      </motion.div>
    </div>
  );
};
