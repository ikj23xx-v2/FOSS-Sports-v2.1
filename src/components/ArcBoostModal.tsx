import React, { useState } from 'react';
import { BOOSTABLE_ELEMENTS, useBoostSettings } from '../hooks/useBoostSettings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ArcBoostModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { hiddenIds, toggleElement, customCSS, setCustomCSS, resetAll } = useBoostSettings();
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl select-none font-sans">
      <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#1E1C24] via-[#121217] to-[#0A0A0D] border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden text-white">
        
        {/* Arc-Style Rainbow Accent Top Bar */}
        <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-amber-400 via-emerald-400 to-cyan-500" />

        {/* Header */}
        <div className="p-5 pb-3 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-xs font-black shadow-[0_0_12px_rgba(244,63,94,0.5)]">
              ⚡
            </span>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tight flex items-center gap-1.5">
                Arc Boosts & Zapper
              </h2>
              <span className="text-[10px] text-zinc-400 font-mono">Customize & hide interface layers</span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center text-xs font-bold transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher (Visual Zap vs CSS Code) */}
        <div className="flex p-2 bg-black/40 border-b border-white/10 gap-1 text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('visual')}
            className={`flex-1 py-1.5 rounded-xl transition cursor-pointer ${
              activeTab === 'visual'
                ? 'bg-white/15 text-white shadow'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Visual Zapper
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-1.5 rounded-xl transition font-mono cursor-pointer ${
              activeTab === 'code'
                ? 'bg-white/15 text-white shadow'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            &lt;style&gt; Raw CSS
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'visual' ? (
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1">
                Active DOM Elements ({hiddenIds.length} Hidden)
              </span>

              {BOOSTABLE_ELEMENTS.map((el) => {
                const isHidden = hiddenIds.includes(el.id);
                return (
                  <div
                    key={el.id}
                    onClick={() => toggleElement(el.id)}
                    className={`group flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isHidden
                        ? 'bg-rose-500/10 border-rose-500/30'
                        : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-black tracking-tight">{el.name}</span>
                        <code className="text-[9px] px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-cyan-400 font-mono">
                          {el.selector}
                        </code>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-snug">{el.description}</p>
                    </div>

                    {/* Zap Status Pill */}
                    <div
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition ${
                        isHidden
                          ? 'bg-rose-500 text-black shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                          : 'bg-white/10 text-zinc-400 group-hover:text-white'
                      }`}
                    >
                      {isHidden ? '⚡ ZAPPED' : 'VISIBLE'}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                Inject Custom CSS Rules
              </span>
              <p className="text-[10px] text-zinc-400 mb-2">
                Rules apply live across all scorecards, league pages, and banners.
              </p>
              <textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                placeholder={`.foss-clutch-meter {\n  opacity: 0.5;\n  filter: grayscale(1);\n}`}
                rows={7}
                className="w-full bg-black/60 border border-white/15 rounded-2xl p-3 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-400 transition"
                spellCheck={false}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center">
          <button
            onClick={resetAll}
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition cursor-pointer"
          >
            Apply Changes
          </button>
        </div>

      </div>
    </div>
  );
};
