import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

export interface CardData {
  id: string;
  name: string;
  team: string;
  league: 'NBA' | 'NFL' | 'MLB' | 'NHL';
  position: string;
  projectedPoints: number;
  image: string;
  isFoil: boolean;
  multiplier: number;
  serialNumber?: string; // e.g. "04/25"
}

export const HoloCard: React.FC<{ card: CardData; onSelect?: () => void; isSelected?: boolean }> = ({
  card,
  onSelect,
  isSelected,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for tilt angles
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring physics for smooth snap-back
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [16, -16]), { stiffness: 260, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-16, 16]), { stiffness: 260, damping: 20 });

  // Dynamically position the holographic light reflection
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1000 }} className="select-none flex justify-center">
      <motion.div
        ref={cardRef}
        onClick={onSelect}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ scale: 0.96 }}
        className={`relative w-64 h-96 rounded-2xl overflow-hidden cursor-pointer transition-shadow ${
          card.isFoil
            ? 'border-2 border-amber-400/80 shadow-[0_12px_40px_rgba(245,158,11,0.35)]'
            : 'border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
        } ${isSelected ? 'ring-4 ring-emerald-400' : ''} bg-[#0A0A0E]`}
      >
        {/* Card Background / Texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#181820] via-[#0E0E14] to-[#050508]" />

        {/* Dynamic Holographic Foil Shimmer Layer (Topps Bunt/Chrome Style) */}
        {card.isFoil && (
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-color-dodge z-20 opacity-70"
            style={{
              background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.85) 0%, rgba(255,0,128,0.4) 30%, rgba(0,255,255,0.4) 60%, transparent 80%), repeating-linear-gradient(45deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 2px, transparent 2px, transparent 6px)`,
            }}
          />
        )}

        {/* Prismatic Specular Glare */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-overlay z-30 opacity-60"
          style={{
            background: `linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.6) 50%, transparent 80%)`,
          }}
        />

        {/* Card Content Layout */}
        <div className="relative z-10 flex flex-col justify-between h-full p-4 text-white">
          {/* Header Row: League & Rarity Badges */}
          <div className="flex justify-between items-center">
            <span className="px-2 py-0.5 rounded bg-black/60 border border-white/20 text-[9px] font-black tracking-widest uppercase">
              {card.league}
            </span>
            {card.isFoil && (
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-black text-[9px] font-black uppercase tracking-wider shadow-[0_0_10px_rgba(245,158,11,0.6)]">
                FOIL · {card.multiplier}x PTS
              </span>
            )}
          </div>

          {/* Player Visual Artwork */}
          <div className="flex-1 flex flex-col items-center justify-center my-2">
            <div className="text-7xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] mb-2 select-none">
              {card.image}
            </div>
            {card.serialNumber && (
              <span className="font-mono text-[9px] text-amber-400/90 font-bold tracking-widest bg-black/50 px-2 py-0.5 rounded">
                SERIAL #{card.serialNumber}
              </span>
            )}
          </div>

          {/* Player Info Footer */}
          <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-3">
            <div className="flex justify-between items-end mb-1">
              <div>
                <h3 className="font-black text-sm tracking-tight leading-none uppercase">{card.name}</h3>
                <span className="text-[10px] text-zinc-400 font-semibold">{card.position} · {card.team}</span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-zinc-400 block font-mono">PROJ PTS</span>
                <span className="text-xs font-black text-emerald-400">{card.projectedPoints}</span>
              </div>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
