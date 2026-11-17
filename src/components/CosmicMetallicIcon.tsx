import React from 'react';

interface CosmicMetallicIconProps {
  className?: string;
  size?: number;
}

export const CosmicMetallicIcon: React.FC<CosmicMetallicIconProps> = ({
  className = 'w-9 h-9',
  size = 36,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] ${className}`}
    >
      <defs>
        {/* Continuous iOS squircle curvature clip */}
        <clipPath id="squircleClip">
          <path d="M 0,50 C 0,14 14,0 50,0 C 86,0 100,14 100,50 C 100,86 86,100 50,100 C 14,100 0,86 0,50 Z" />
        </clipPath>

        {/* Cosmic Obsidian Metallic Brushed Titanium Gradient */}
        <linearGradient id="metallicBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1E24" />
          <stop offset="25%" stopColor="#121215" />
          <stop offset="50%" stopColor="#08080A" />
          <stop offset="75%" stopColor="#141418" />
          <stop offset="100%" stopColor="#040405" />
        </linearGradient>

        {/* Deep Space Cosmic Radial Glow */}
        <radialGradient id="cosmicGlow" cx="45%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* Specular Edge Highlight Refraction (1px top-left to bottom-right light ray) */}
        <linearGradient id="specularBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>

        {/* Chrome Metallic Emblem Gradient */}
        <linearGradient id="chromeMark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="70%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Top Glare Light Flare */}
        <linearGradient id="topGlare" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g clipPath="url(#squircleClip)">
        {/* Obsidian Base Canvas */}
        <rect width="100" height="100" fill="url(#metallicBody)" />

        {/* Cosmic Nebula Aura */}
        <rect width="100" height="100" fill="url(#cosmicGlow)" />

        {/* Subtle Horizontal Brushed Steel Scanlines */}
        <line x1="0" y1="20" x2="100" y2="20" stroke="#FFFFFF" strokeOpacity="0.03" strokeWidth="1" />
        <line x1="0" y1="40" x2="100" y2="40" stroke="#FFFFFF" strokeOpacity="0.03" strokeWidth="1" />
        <line x1="0" y1="60" x2="100" y2="60" stroke="#FFFFFF" strokeOpacity="0.03" strokeWidth="1" />
        <line x1="0" y1="80" x2="100" y2="80" stroke="#FFFFFF" strokeOpacity="0.03" strokeWidth="1" />

        {/* Top Specular Glare Arc */}
        <ellipse cx="50" cy="18" rx="42" ry="16" fill="url(#topGlare)" />

        {/* Dynamic Athletic Orbital Geometry & Stadium Silhouette */}
        {/* Outer Orbit Arc */}
        <path
          d="M 24 58 C 22 40, 36 24, 62 24 C 74 24, 82 30, 80 40 C 78 52, 60 76, 38 76 C 28 76, 25 70, 24 58 Z"
          stroke="url(#chromeMark)"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="90 15"
        />

        {/* Center Metallic Sports "S" Prism Monogram */}
        <path
          d="M 64 34 L 42 34 C 36 34, 32 38, 32 44 C 32 50, 36 53, 44 55 L 56 57 C 64 59, 68 62, 68 68 C 68 74, 64 78, 58 78 L 34 78"
          stroke="url(#chromeMark)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Apple Live Red Signal Indicator Jewel */}
        <circle cx="72" cy="28" r="4.5" fill="#FF453A" />
        <circle cx="72" cy="28" r="7" stroke="#FF453A" strokeWidth="1" strokeOpacity="0.5" />

        {/* 1px Inset Specular Glass Edge Refraction Border */}
        <path
          d="M 0,50 C 0,14 14,0 50,0 C 86,0 100,14 100,50 C 100,86 86,100 50,100 C 14,100 0,86 0,50 Z"
          fill="none"
          stroke="url(#specularBorder)"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
