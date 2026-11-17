import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HoloCard, CardData } from './HoloCard';

interface Props {
  league: 'NBA' | 'NFL' | 'MLB' | 'NHL';
  cards: CardData[];
  onComplete: () => void;
}

export const PackOpeningModal: React.FC<Props> = ({ league, cards, onComplete }) => {
  const [packState, setPackState] = useState<'sealed' | 'tearing' | 'opened'>('sealed');
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Trigger ripping vibration sequence
  const handleRipPack = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 20, 60, 30, 100]); // Crinkle & tear haptic pulses
    }
    setPackState('tearing');

    setTimeout(() => {
      setPackState('opened');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([150]); // Climax hit when foil opens
      }
    }, 600);
  };

  const handleNextCard = () => {
    if (activeCardIndex < cards.length - 1) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(30);
      }
      setActiveCardIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl">
      <AnimatePresence mode="wait">
        {packState !== 'opened' ? (
          /* Foil Pack Wrapper */
          <motion.div
            key="pack"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            className="relative w-72 h-[420px] rounded-3xl overflow-hidden border-2 border-white/20 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col justify-between p-6 select-none"
          >
            {/* Foil Wrinkle Reflections */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/20 via-rose-500/10 to-transparent pointer-events-none" />

            {/* Top Pull-Tab Stripper */}
            <motion.div
              animate={packState === 'tearing' ? { x: 300, rotate: 20, opacity: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onClick={handleRipPack}
              className="relative z-20 cursor-pointer bg-gradient-to-r from-red-600 via-amber-500 to-red-600 text-black font-black text-[10px] uppercase tracking-widest text-center py-2.5 rounded-xl border border-white/40 shadow-lg active:scale-95"
            >
              ✂️ SLIDE OR TAP TO RIP PACK
            </motion.div>

            {/* Pack Center Branding */}
            <div className="text-center my-auto relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                2026 EDITION
              </span>
              <h1 className="text-3xl font-black uppercase text-white tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                FOSS {league}
              </h1>
              <span className="text-xs font-bold text-zinc-400 tracking-wider">
                5 PLAYER REWARD PACK
              </span>
            </div>

            <div className="text-center text-[9px] font-mono text-zinc-500 relative z-10">
              CONTAINS 1 GUARANTEED FOIL MULTIPLIER
            </div>
          </motion.div>
        ) : (
          /* Revealed Cards (Flipping through one by one) */
          <motion.div
            key="cards"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="text-center mb-4">
              <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                CARD {activeCardIndex + 1} OF {cards.length}
              </span>
            </div>

            {cards[activeCardIndex] && <HoloCard card={cards[activeCardIndex]} />}

            <button
              onClick={handleNextCard}
              className="mt-6 px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all cursor-pointer"
            >
              {activeCardIndex < cards.length - 1 ? 'Next Card →' : 'Done · Add to Vault'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
