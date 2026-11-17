import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onSignUp: (username: string, email: string, password: string) => void;
  onClose?: () => void;
}

export const DreamcastConsoleSplash: React.FC<SplashScreenProps> = ({ onSignUp, onClose }) => {
  const [username, setUsername] = useState('ROOKIE_PLAYA99');
  const [email, setEmail] = useState('email@address.com');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp(username, email, password);
  };

  return (
    <div className="fixed inset-0 z-50 w-full min-h-screen overflow-hidden bg-black flex flex-col justify-between p-6 select-none font-sans text-white">
      
      {/* 1. Multi-Sport Athletes Looping Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-40 scale-105 filter contrast-125 saturate-110"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-basketball-players-in-a-court-41604-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      </div>

      {/* 2. Top Telemetry Header */}
      <div className="relative z-10 flex justify-between items-center pt-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-400 text-[10px] font-mono uppercase tracking-widest backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          FOSS SPORTS OS v2.0
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-mono uppercase tracking-wider backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE FEED ACTIVE
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 flex items-center justify-center text-xs font-bold transition cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 3. Center Vertical Layout for Mobile / Console */}
      <div className="relative z-10 my-auto flex flex-col items-center max-w-md mx-auto w-full px-4 py-6">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] mb-1">
            FOSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">SPORTS</span>
          </h1>
          <p className="text-zinc-400 text-xs font-semibold tracking-wider uppercase">
            ONLINE SPORTS NETWORK
          </p>

          <div className="flex justify-center gap-2 mt-3">
            {['🏀 NBA', '🏈 NFL', '⚾ MLB', '🏒 NHL'].map((league) => (
              <div key={league} className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/15 text-[9px] font-black tracking-wider text-zinc-300">
                {league}
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Sign-Up Card Box */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full bg-[#141418]/90 border border-amber-500/40 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-400 font-black">
                ⚡
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                CREATE PROFILE
              </span>
            </div>
            <span className="text-[9px] font-mono text-zinc-500">SLOT 1</span>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <div className="text-[10px] text-zinc-400 font-mono mb-1">ENTER ROOKIE NAME</div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2.5 text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <div className="text-[10px] text-zinc-400 font-mono mb-1">EMAIL REGISTER</div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <div className="text-[10px] text-zinc-400 font-mono mb-1">PASSWORD</div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 transition cursor-pointer"
            >
              SIGN UP
            </button>
          </form>
        </motion.div>

      </div>

      {/* 4. Bottom Diagnostic Bar */}
      <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-zinc-500 pt-4 border-t border-white/10">
        <span>© 2026 FOSS SPORTS</span>
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-black tracking-widest">LOADING...</span>
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        </div>
      </div>

    </div>
  );
};
