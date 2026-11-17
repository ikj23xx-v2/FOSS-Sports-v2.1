import React from 'react';

export const FossSportsAppIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'panoramic' }> = ({ size = 'md' }) => {
  if (size === 'panoramic') {
    return (
      <div className="relative h-10 px-3.5 rounded-full overflow-hidden bg-[#090A0F] border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.8),inset_2px_0_6px_rgba(56,189,248,0.5),inset_-2px_0_6px_rgba(244,63,94,0.5)] flex items-center gap-2 select-none shrink-0">
        {/* Stadium lighting glow */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-cyan-400/40 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-red-500/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

        {/* Live pill */}
        <div className="relative z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-[9px] font-mono font-black text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* 3D Chrome Text */}
        <div className="relative z-10 flex items-center gap-1 whitespace-nowrap">
          <span className="text-white font-black italic uppercase tracking-tighter text-xs drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            FOSS
          </span>
          <span className="font-black italic uppercase tracking-tighter text-xs text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            SPORTS
          </span>
        </div>
      </div>
    );
  }

  const dimensions =
    size === 'sm'
      ? 'w-14 h-14 rounded-2xl p-1.5'
      : size === 'lg'
      ? 'w-32 h-32 rounded-3xl p-3'
      : 'w-20 h-20 rounded-2xl p-2';

  const titleSize =
    size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xl' : 'text-sm';

  return (
    <div
      className={`relative overflow-hidden bg-[#090A0F] border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.85),inset_2px_0_8px_rgba(56,189,248,0.4),inset_-2px_0_8px_rgba(244,63,94,0.4)] flex flex-col items-center justify-between select-none shrink-0 ${dimensions}`}
    >
      {/* Option C Visor Stadium Lights */}
      <div className="absolute inset-0 bg-radial from-slate-800/50 via-[#090a0f] to-black z-0 pointer-events-none" />
      <div className="absolute top-0 left-0 bottom-0 w-3 bg-gradient-to-r from-cyan-400/35 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-3 bg-gradient-to-l from-red-500/35 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

      {/* Top Arena Floodlights */}
      <div className="relative z-10 flex justify-between w-full px-1 pt-0.5">
        <div className="flex gap-[3px] items-center">
          <div className="w-1.5 h-1 bg-cyan-300 rounded-full shadow-[0_0_6px_#38BDF8]" />
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white]" />
        </div>
        <div className="flex gap-[3px] items-center">
          <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white]" />
          <div className="w-1.5 h-1 bg-red-400 rounded-full shadow-[0_0_6px_#F43F5E]" />
        </div>
      </div>

      {/* Center 3D Chrome Typography - Guaranteed Fit With No Clipping */}
      <div className="relative z-10 text-center my-auto flex flex-col items-center justify-center w-full px-1">
        <span className={`font-black italic uppercase tracking-tighter text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight pr-0.5 ${titleSize}`}>
          FOSS
        </span>
        <span className={`font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight pr-1 ${titleSize}`}>
          SPORTS
        </span>
      </div>

      {/* Metallic Arena Pedestal / Live Dot */}
      <div className="relative z-10 w-full max-w-[80%] h-1.5 bg-gradient-to-r from-zinc-700 via-zinc-300 to-zinc-700 rounded-full border border-white/20 shadow-[0_0_6px_rgba(255,255,255,0.3)] mb-0.5 flex items-center justify-center">
        <div className="w-1 h-1 bg-red-500 rounded-full shadow-[0_0_5px_#EF4444] animate-pulse" />
      </div>
    </div>
  );
};
