import React from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
  onContinueGuest: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onSignUp, onLogin, onContinueGuest }) => {
  return (
    <div className="fixed inset-0 z-50 w-full h-screen overflow-hidden bg-black flex flex-col justify-between p-6 select-none font-sans">
      
      {/* 1. Full-Screen Looping Video Background (Dreamcast 2K Sports Vibe) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-50 scale-105 filter contrast-125 saturate-110"
        >
          {/* High-octane sports highlight loop source URL */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-basketball-players-in-a-court-41604-large.mp4" type="video/mp4" />
        </video>

        {/* Cinematic Vignette & Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />
      </div>

      {/* 2. Top Header Branding */}
      <div className="relative z-10 flex justify-between items-center pt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF453A]/20 border border-[#FF453A]/40 text-[#FF453A] text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(255,69,58,0.4)] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#FF453A] animate-ping" />
          EST. 2026 · NEXT-GEN ENGINE
        </div>
      </div>

      {/* 3. Center Hero Branding & Arcade Typography */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center my-auto px-4"
      >
        <span className="text-amber-400 font-black text-xs uppercase tracking-[0.3em] block mb-2 drop-shadow">
          WELCOME TO THE ARENA
        </span>
        <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] mb-3">
          FOSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">SPORTS</span>
        </h1>
        <p className="text-zinc-300 text-xs sm:text-sm font-semibold tracking-wide max-w-xs mx-auto drop-shadow">
          Live Scores, Clutch Probability Waves, and Fantasy Card Mock Drafts.
        </p>
      </motion.div>

      {/* 4. Action Buttons (Sign Up, Log In, Guest) */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        className="relative z-10 max-w-sm mx-auto w-full flex flex-col gap-3 pb-6"
      >
        <button
          onClick={onSignUp}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(245,158,11,0.4)] active:scale-95 transition-all cursor-pointer"
        >
          Create Account & Start Drafting
        </button>

        <button
          onClick={onLogin}
          className="w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-black text-xs uppercase tracking-widest backdrop-blur-md active:scale-95 transition-all shadow-lg cursor-pointer"
        >
          Sign In
        </button>

        <button
          onClick={onContinueGuest}
          className="text-zinc-400 hover:text-white text-[11px] font-bold uppercase tracking-wider text-center pt-2 transition-colors cursor-pointer"
        >
          Continue as Guest →
        </button>
      </motion.div>

    </div>
  );
};
