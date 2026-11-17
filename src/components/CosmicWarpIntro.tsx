import React, { useEffect, useRef, useState } from 'react';
import { sounds } from '../services/sound';
import { AppIcon } from './AppIcon';
import { AppIconChoice } from '../types';

interface CosmicWarpIntroProps {
  onFinish: () => void;
  appIcon?: AppIconChoice;
}

interface Star {
  x: number;
  y: number;
  z: number;
  pz: number;
}

export const CosmicWarpIntro: React.FC<CosmicWarpIntroProps> = ({
  onFinish,
  appIcon = 'stadium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // 'fade-in' (0-720ms) -> 'warp' (720-1350ms) -> 'exit'
  const [stage, setStage] = useState<'fade-in' | 'warp' | 'exit'>('fade-in');
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const hasTriggeredWarpRef = useRef<boolean>(false);
  const hasFinishedRef = useRef<boolean>(false);

  const finish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    onFinish();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // 220 3D stars matching Android SpaceWarpView
    const NUM_STARS = 220;
    const stars: Star[] = Array.from({ length: NUM_STARS }, () => {
      const rx = (Math.random() - 0.5) * 2000;
      const ry = (Math.random() - 0.5) * 2000;
      const rz = Math.random() * 1000 + 1;
      return { x: rx, y: ry, z: rz, pz: rz };
    });

    let speed = 3.5;
    let isWarping = false;

    startTimeRef.current = performance.now();

    const triggerHaptic = () => {
      try {
        if (navigator.vibrate) {
          // Double-click haptic impulse matching VibrationEffect.EFFECT_DOUBLE_CLICK
          navigator.vibrate([25, 45, 25]);
        }
        sounds.playTabSwitch();
      } catch {
        // Ignore haptic failures on unsupported browsers
      }
    };

    const render = (now: number) => {
      const elapsed = now - startTimeRef.current;

      // Phase 1 (0ms - 720ms): Logo fades in, stars drift subtly forward
      // Phase 2 (720ms - 1350ms): Cosmic Hyperdrive Warp transition — stars stretch into light-streak lines, emblem scales up 1f -> 8f
      if (elapsed >= 720 && !hasTriggeredWarpRef.current) {
        hasTriggeredWarpRef.current = true;
        isWarping = true;
        setStage('warp');
        triggerHaptic();
      }

      if (elapsed >= 1350) {
        setStage('exit');
        finish();
        return;
      }

      if (isWarping) {
        speed += 1.4;
      }

      // Background rendering: pitch-black with motion trail during warp
      if (isWarping) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
      } else {
        ctx.fillStyle = '#000000';
      }
      ctx.fillRect(0, 0, width, height);

      // Distant glowing nebula haze (subtle indigo/cyan tints)
      const nebula = ctx.createRadialGradient(
        width / 2,
        height / 2,
        15,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.55
      );
      nebula.addColorStop(0, 'rgba(56, 189, 248, 0.09)');
      nebula.addColorStop(0.35, 'rgba(99, 102, 241, 0.05)');
      nebula.addColorStop(0.7, 'rgba(30, 27, 75, 0.02)');
      nebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      ctx.save();
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.z -= speed;

        if (star.z <= 0) {
          star.z = 1000;
          star.pz = 1000;
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
        }

        const focal = 450;
        const sx = (star.x / star.z) * focal + cx;
        const sy = (star.y / star.z) * focal + cy;

        const px = (star.x / star.pz) * focal + cx;
        const py = (star.y / star.pz) * focal + cy;
        star.pz = star.z;

        if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
          const alpha = Math.max(0.18, Math.min(1, 1 - star.z / 1000));
          ctx.globalAlpha = alpha;

          if (isWarping) {
            // Stars stretch into hyperdrive light-streak lines radiating outward
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = Math.min(3.2, 2.5 * (focal / star.z) * 0.4);
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          } else {
            // Circular stars drifting forward
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Keyboard / click bypass: instant exit
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        finish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      onClick={finish}
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden transition-opacity duration-300 ${
        stage === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 1. Deep pitch-black 3D starfield canvas with parallax particles & glowing nebula */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 2. Center Brand Emblem Lockup with Option 3 Stadium-Carbon Emblem & Pulsing Red Live Dot */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-4 will-change-transform ${
          stage === 'warp'
            ? 'transition-all duration-[600ms] [transition-timing-function:cubic-bezier(0.8,0,1,1)] scale-[8] opacity-0 blur-[3px]'
            : 'transition-all duration-[700ms] ease-out scale-100 opacity-100'
        }`}
        style={
          stage === 'fade-in'
            ? {
                animation: 'fossEmblemFadeIn 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
              }
            : undefined
        }
      >
        {/* Option 3 Stadium Monogram Icon */}
        <div className="relative mb-4 group">
          <div className="absolute -inset-5 bg-sky-500/20 rounded-full blur-2xl animate-pulse" />
          <AppIcon
            choice={appIcon}
            size={96}
            className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-[0_12px_36px_rgba(56,189,248,0.45)]"
          />
        </div>

        {/* Wordmark and Live Dot matching SplashActivity.kt */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-[0.05em] text-white font-display drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
            FOSS SPORTS
          </h1>
          <div className="flex items-center justify-center gap-1.5 pt-0.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF453A] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF453A]" />
            </span>
            <span className="text-xs font-bold text-[#FF453A] tracking-wider uppercase">
              LIVE
            </span>
          </div>
        </div>

        {/* Subtitle capsule */}
        <div className="mt-4 flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span className="text-[11px] font-medium text-neutral-300 tracking-wide">
            Apple-Grade Live Scores & Analytics
          </span>
        </div>
      </div>

      {/* Skip Pill Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        className="absolute top-6 right-6 z-20 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 hover:text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 cursor-pointer"
      >
        Skip ✕
      </button>

      {/* Inline keyframe for initial fade-in and scale 0.85 -> 1.0 */}
      <style>{`
        @keyframes fossEmblemFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.85);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};
