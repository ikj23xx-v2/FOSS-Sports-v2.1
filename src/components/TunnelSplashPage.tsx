import React, { useState } from 'react';

// Added onEnter prop so the parent component knows when to show the main app
export default function SplashPage({ onEnter }: { onEnter?: () => void }) {
  const [isEntering, setIsEntering] = useState(false);

  const handleEnterClick = () => {
    if (isEntering) return;
    
    setIsEntering(true);

    // Play Referee Whistle & Crowd Cheer
    // Using open-source sound URLs for the prototype
    const whistle = new Audio('https://actions.google.com/sounds/v1/sports/referee_whistle.ogg');
    const cheer = new Audio('https://actions.google.com/sounds/v1/sports/football_crowd_cheer.ogg');
    
    whistle.volume = 0.5;
    cheer.volume = 0.4;

    whistle.play().catch(e => console.log("Audio blocked by browser auto-play policy:", e));
    cheer.play().catch(e => console.log("Audio blocked by browser auto-play policy:", e));

    // Wait for the animation to finish before calling onEnter
    setTimeout(() => {
      if (onEnter) onEnter();
    }, 1200); // 1.2 seconds matches the CSS transition duration
  };

  return (
    <div 
      className={`relative min-h-screen bg-[#050505] flex flex-col justify-between overflow-hidden font-sans select-none transition-all duration-[1200ms] cubic-bezier(0.25, 1, 0.5, 1) ${
        isEntering ? 'opacity-0 scale-[1.15] blur-sm' : 'opacity-100 scale-100 blur-none'
      }`}
    >
      
      {/* Background Image / Ambient Underlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-90 scale-105 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(5,5,5,0.4) 0%, rgba(5,5,5,0.75) 60%, rgba(5,5,5,0.95) 100%),
            url('https://images.unsplash.com/photo-1541252260730-0412e8e2108e?q=80&w=1600&auto=format&fit=crop')
          `,
          backgroundPosition: 'center 40%',
        }}
      />

      {/* Atmospheric Vignette and Shadows */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-transparent to-black opacity-80 pointer-events-none"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050505] via-transparent to-black/70 pointer-events-none"></div>

      {/* MAIN TUNNEL VIEW AND STADIUM COMPOSITION */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        
        {/* Gritty Concrete Tunnel Silhouette & Perspectives */}
        <div className="relative w-full h-full max-w-[1440px] mx-auto flex items-center justify-center">
          
          {/* Left Concrete Wall Shadow */}
          <div className="absolute left-0 top-0 bottom-0 w-[28%] bg-gradient-to-r from-black via-[#111]/85 to-transparent border-r border-white/5 opacity-90"></div>
          
          {/* Right Concrete Wall Shadow */}
          <div className="absolute right-0 top-0 bottom-0 w-[28%] bg-gradient-to-l from-black via-[#111]/85 to-transparent border-l border-white/5 opacity-90"></div>
          
          {/* Natural Metal Handrails Overlays */}
          <div className="absolute left-[15%] top-[55%] w-[12%] h-[2px] bg-neutral-800 shadow-[0_1px_3px_rgba(0,0,0,0.8)] opacity-60"></div>
          <div className="absolute right-[15%] top-[55%] w-[12%] h-[2px] bg-neutral-800 shadow-[0_1px_3px_rgba(0,0,0,0.8)] opacity-60"></div>

          {/* Central Bright Archway to Stadium Field & Twilight Sky */}
          <div className={`relative w-[48%] h-[58%] rounded-t-[14rem] overflow-hidden border border-white/5 bg-[#0a0f1d] shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] flex items-end justify-center transition-transform duration-[1200ms] ${isEntering ? 'scale-[1.2] translate-y-4' : 'scale-100'}`}>
            
            {/* Dark Starry Twilight Sky Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/20 via-[#070b19] to-[#04060c]">
              {/* Star Particles */}
              <div className="absolute top-4 left-6 w-[2px] h-[2px] bg-white/40 rounded-full"></div>
              <div className="absolute top-8 left-20 w-[1.5px] h-[1.5px] bg-white/30 rounded-full"></div>
              <div className="absolute top-3 left-40 w-[2px] h-[2px] bg-white/50 rounded-full"></div>
              <div className="absolute top-10 right-24 w-[1px] h-[1px] bg-white/30 rounded-full"></div>
              <div className="absolute top-5 right-8 w-[2px] h-[2px] bg-white/40 rounded-full"></div>
            </div>

            {/* Distant Stadium Seating / Field Horizon */}
            <div className="absolute bottom-0 w-full h-[32%] bg-[#0f1d12]/40 border-t border-[#1b3021]/30 flex items-end">
              <div className="w-full h-[15%] bg-[#122816]/70"></div> {/* Ground/Grass */}
            </div>

            {/* Colossal Off-Center Scoreboard (Partially Visible Right-Center) */}
            <div className="absolute -right-8 bottom-[18%] w-[85%] h-[75%] bg-[#080a0f] border border-white/10 rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between p-5 transform -rotate-1 origin-bottom-right z-10">
              
              {/* Scoreboard Structural Backing Scaffold */}
              <div className="absolute -left-4 top-0 bottom-0 w-4 bg-transparent border-r-2 border-dashed border-neutral-800"></div>

              {/* Scoreboard Inner Content */}
              <div className="relative flex flex-col justify-center items-center h-full text-center">
                
                {/* Brand Typography */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter italic text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                  FOSS <span className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">SPORTS</span>
                </h1>
                
                {/* Scoreboard Metadata */}
                <div className="mt-4 text-[9px] md:text-[11px] font-bold tracking-[0.18em] text-neutral-400 uppercase max-w-xs leading-normal">
                  Live Sports, Interactive Scoreboards<br />& Team/League Hubs
                </div>

              </div>

              {/* Dot-matrix scanline texture overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none mix-blend-overlay"></div>
            </div>

          </div>

        </div>

      </div>

      {/* TOP BAR / BADGE */}
      <div className={`relative z-10 w-full px-8 pt-6 flex justify-between items-center transition-opacity duration-500 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-center gap-2 bg-black/50 border border-white/5 rounded-md px-3.5 py-1.5 backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
          <span className="text-[10px] font-mono tracking-widest text-neutral-300 uppercase">
            FOSS SPORTS V2.0
          </span>
        </div>
      </div>

      {/* ACTION BUTTON (ENTER ARENA) */}
      <div className={`relative z-10 w-full flex flex-col items-center px-6 mb-16 transition-opacity duration-500 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
        <button 
          onClick={handleEnterClick}
          className="relative group w-full max-w-[320px]"
        >
          {/* Subtle Outer Glow */}
          <div className="absolute -inset-1.5 bg-blue-500/10 rounded-full blur-md opacity-70 group-hover:opacity-100 group-hover:bg-blue-500/20 transition-all duration-500"></div>
          
          {/* Button Surface */}
          <div className="relative w-full bg-transparent hover:bg-white/5 border border-white/20 text-white font-bold tracking-[0.2em] uppercase py-3.5 rounded-full text-xs md:text-sm shadow-[0_4px_20px_rgba(0,0,0,0.6)] active:scale-95 transition-all duration-300 flex items-center justify-center backdrop-blur-md cursor-pointer">
            {isEntering ? 'LOADING...' : 'ENTER ARENA'}
          </div>
        </button>
      </div>

      {/* FOOTER */}
      <div className={`relative z-10 w-full px-8 pb-6 transition-opacity duration-500 ${isEntering ? 'opacity-0' : 'opacity-100'}`}>
        <div className="border-t border-white/5 pt-5 flex justify-between items-center w-full">
          <div className="text-[9px] text-neutral-600 font-mono tracking-widest uppercase">
            © 2026 FOSS SPORTS ENGINE
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-[9px] font-bold tracking-widest uppercase">LIVE</span>
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,1)] animate-pulse"></div>
          </div>
        </div>
      </div>

    </div>
  );
}
