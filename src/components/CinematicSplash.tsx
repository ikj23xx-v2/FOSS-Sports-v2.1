import React from 'react';
import { motion } from 'framer-motion';
import { FossSportsAppIcon } from './FossSportsAppIcon';

interface CinematicSplashProps {
  onEnter: () => void;
  onClose?: () => void;
}

export const CinematicSplash: React.FC<CinematicSplashProps> = ({ onEnter, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 w-full h-dvh overflow-y-auto overflow-x-hidden bg-[#07080c] flex flex-col items-center justify-between p-4 sm:p-6 select-none font-sans text-white">
      {/* Background Lighting Rig */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex justify-between items-center pt-1 shrink-0">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-mono uppercase tracking-widest backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          CINEMATIC ARENA v2.0
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-zinc-500">SYSTEM READY</span>
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close intro"
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center text-xs font-bold transition cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Center Cinematic Showcase */}
      <div className="relative z-10 flex-1 w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center py-6 px-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55 }}
          className="mb-6 flex items-center justify-center filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
        >
          <FossSportsAppIcon size="lg" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.15 }}
          className="w-full flex flex-col items-center text-center"
        >
          <h1 className="w-full text-center text-4xl sm:text-5xl md:text-6xl font-black italic uppercase tracking-tight leading-none text-white mb-3 drop-shadow-lg">
            <span>FOSS </span>
            <span className="inline-block pr-1.5 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-zinc-200 to-red-500">
              SPORTS
            </span>
          </h1>

          <p className="w-full max-w-md mx-auto text-center text-xs sm:text-sm text-zinc-400 font-medium uppercase tracking-[0.14em] pl-[0.14em] mb-8">
            Live Arena Scores, Fan Chat &amp; Jersey Vault
          </p>

          <button
            onClick={onEnter}
            className="w-full max-w-sm mx-auto flex items-center justify-center py-4 px-6 bg-gradient-to-r from-zinc-200 via-white to-zinc-300 text-black font-black italic text-sm uppercase tracking-[0.14em] pl-[calc(1.5rem+0.14em)] rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-[1.03] active:scale-95 transition cursor-pointer"
          >
            ENTER ARENA
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 w-full max-w-xl mx-auto flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-4 border-t border-white/10 shrink-0">
        <span>© 2026 FOSS SPORTS ENGINE</span>
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-black tracking-widest">LIVE</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
        </div>
      </div>
    </div>
  );
};
