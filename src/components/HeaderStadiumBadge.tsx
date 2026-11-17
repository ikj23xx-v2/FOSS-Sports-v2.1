import React from 'react';

interface HeaderStadiumBadgeProps {
  onClick?: () => void;
  liveCount?: number;
}

export const HeaderStadiumBadge: React.FC<HeaderStadiumBadgeProps> = ({ onClick, liveCount = 5 }) => {
  return (
    <button
      onClick={onClick}
      className="foss-stadium-badge relative flex items-center justify-between h-9 px-3 rounded-full overflow-hidden border border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.8),inset_1px_0_4px_rgba(59,130,246,0.6),inset_-1px_0_4px_rgba(239,68,68,0.6)] transition-all active:scale-95 hover:border-white/45 hover:shadow-[0_0_20px_rgba(255,69,58,0.4)] focus:outline-none flex-shrink-0 cursor-pointer group bg-[#090A0F]"
      style={{
        background: 'linear-gradient(90deg, rgba(14,24,42,0.95) 0%, rgba(9,10,15,0.98) 50%, rgba(36,14,20,0.95) 100%)',
      }}
      title="FOSS SPORTS - Games Live Now & Draft Room"
    >
      {/* 1. Curved Panoramic Stadium Visual Background (Option C Aesthetic) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
        {/* Stadium floodlight beams */}
        <div className="absolute -top-3 left-4 w-12 h-10 bg-cyan-400/20 blur-md transform -rotate-12" />
        <div className="absolute -top-3 right-4 w-12 h-10 bg-red-500/20 blur-md transform rotate-12" />
        {/* Subtle curved arena line */}
        <div className="absolute inset-x-2 bottom-1 h-3 border-b border-cyan-400/30 rounded-full" />
      </div>

      {/* 2. Glowing Neon Corner Accents: Cyan/Blue (Left) & Red (Right) */}
      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-cyan-400/50 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-gradient-to-l from-red-500/50 to-transparent pointer-events-none" />

      {/* 3. Top Specular Glass Sheen Highlight Rim */}
      <div className="absolute inset-x-0 top-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

      {/* 4. Left: Neon Red LIVE Capsule Pill (Option C Style) */}
      <div className="relative z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-[9px] font-mono font-black text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.4)] mr-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        <span className="tracking-tight uppercase">LIVE</span>
      </div>

      {/* 5. Right: Metallic 3D Chrome Italic Typography (Option C Style - Never Cut Off) */}
      <div className="relative z-10 flex items-center gap-1 select-none whitespace-nowrap">
        <span className="text-white font-black italic uppercase tracking-tighter text-[11px] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          FOSS
        </span>
        <span className="font-black italic uppercase tracking-tighter text-[11px] text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-400 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          SPORTS
        </span>
      </div>
    </button>
  );
};
