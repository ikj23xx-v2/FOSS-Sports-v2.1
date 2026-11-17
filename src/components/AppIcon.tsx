import React from 'react';
import { AppIconChoice } from '../types';

interface AppIconProps {
  choice?: AppIconChoice;
  className?: string;
  size?: number;
}

export function getAppIconSvg(choice: AppIconChoice = 'stadium'): string {
  if (choice === 'cosmic') {
    return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <clipPath id='s'><path d='M0,50C0,14 14,0 50,0C86,0 100,14 100,50C100,86 86,100 50,100C14,100 0,86 0,50Z'/></clipPath>
      <g clip-path='url(%23s)'>
        <rect width='100' height='100' fill='%23121215'/>
        <circle cx='45' cy='35' r='50' fill='%233B82F6' opacity='0.3'/>
        <circle cx='72' cy='28' r='5' fill='%23FF453A'/>
        <path d='M24 58 C22 40,36 24,62 24 C74 24,82 30,80 40 C78 52,60 76,38 76 C28 76,25 70,24 58 Z' stroke='%23FFFFFF' stroke-width='4.5' fill='none'/>
        <path d='M64 34 L42 34 C36 34,32 38,32 44 C32 50,36 53,44 55 L56 57 C64 59,68 62,68 68 C68 74,64 78,58 78 L34 78' stroke='%23FFFFFF' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/>
        <path d='M0,50C0,14 14,0 50,0C86,0 100,14 100,50C100,86 86,100 50,100C14,100 0,86 0,50Z' fill='none' stroke='white' stroke-width='2' stroke-opacity='0.6'/>
      </g>
    </svg>`;
  }

  if (choice === 'minimal') {
    return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <clipPath id='s'><path d='M0,50C0,14 14,0 50,0C86,0 100,14 100,50C100,86 86,100 50,100C14,100 0,86 0,50Z'/></clipPath>
      <g clip-path='url(%23s)'>
        <rect width='100' height='100' fill='%23000000'/>
        <rect x='16' y='16' width='68' height='68' rx='20' fill='%231F1F24' fill-opacity='0.6' stroke='%23FFFFFF' stroke-width='1.5' stroke-opacity='0.3'/>
        <circle cx='50' cy='50' r='18' stroke='%23FFFFFF' stroke-width='5' fill='none'/>
        <circle cx='70' cy='30' r='4.5' fill='%2330D158'/>
        <path d='M0,50C0,14 14,0 50,0C86,0 100,14 100,50C100,86 86,100 50,100C14,100 0,86 0,50Z' fill='none' stroke='white' stroke-width='1.5' stroke-opacity='0.4'/>
      </g>
    </svg>`;
  }

  // Option 3: Stadium Carbon (Default) - Carbon Mesh & Floodlight Stadium + bold white FOSS SPORTS logotype + signature red live status dot
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <clipPath id='s'><path d='M0,50C0,14 14,0 50,0C86,0 100,14 100,50C100,86 86,100 50,100C14,100 0,86 0,50Z'/></clipPath>
    <g clip-path='url(%23s)'>
      <rect width='100' height='100' fill='%230D0D10'/>
      <pattern id='m' width='8' height='8' patternUnits='userSpaceOnUse'>
        <rect width='8' height='8' fill='%23111116'/>
        <circle cx='2' cy='2' r='1' fill='%2322222A'/>
        <circle cx='6' cy='6' r='1' fill='%2322222A'/>
      </pattern>
      <rect width='100' height='100' fill='url(%23m)'/>
      <circle cx='50' cy='25' r='55' fill='%2338BDF8' opacity='0.18'/>
      <ellipse cx='50' cy='50' rx='36' ry='22' stroke='%2338BDF8' stroke-width='2' stroke-opacity='0.35' fill='none'/>
      <line x1='50' y1='28' x2='50' y2='72' stroke='%2338BDF8' stroke-width='2' stroke-opacity='0.35'/>
      <text x='50' y='52' font-family='sans-serif' font-weight='900' font-size='15' fill='%23FFFFFF' text-anchor='middle' letter-spacing='-0.5'>FOSS</text>
      <text x='50' y='65' font-family='sans-serif' font-weight='800' font-size='10' fill='%23E2E8F0' text-anchor='middle' letter-spacing='1.5'>SPORTS</text>
      <circle cx='76' cy='24' r='4.5' fill='%23FF453A'/>
      <circle cx='76' cy='24' r='7' stroke='%23FF453A' stroke-width='1' stroke-opacity='0.6' fill='none'/>
      <path d='M0,50C0,14 14,0 50,0C86,0 100,14 100,50C100,86 86,100 50,100C14,100 0,86 0,50Z' fill='none' stroke='white' stroke-width='2' stroke-opacity='0.6'/>
    </g>
  </svg>`;
}

export function getAppIconDataUrl(choice: AppIconChoice = 'stadium'): string {
  const svg = getAppIconSvg(choice).replace(/\n\s*/g, '');
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const AppIcon: React.FC<AppIconProps> = ({
  choice = 'stadium',
  className = 'w-9 h-9',
  size = 36,
}) => {
  if (choice === 'cosmic') {
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
          <clipPath id="squircleCosmic">
            <path d="M 0,50 C 0,14 14,0 50,0 C 86,0 100,14 100,50 C 100,86 86,100 50,100 C 14,100 0,86 0,50 Z" />
          </clipPath>
          <linearGradient id="cosmicMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E1E24" />
            <stop offset="50%" stopColor="#0A0A0E" />
            <stop offset="100%" stopColor="#020204" />
          </linearGradient>
          <radialGradient id="cosmicAura" cx="45%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#8B5CF6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="cosmicBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E2E8F0" />
            <stop offset="55%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>
        <g clipPath="url(#squircleCosmic)">
          <rect width="100" height="100" fill="url(#cosmicMetal)" />
          <rect width="100" height="100" fill="url(#cosmicAura)" />
          <path
            d="M 24 58 C 22 40, 36 24, 62 24 C 74 24, 82 30, 80 40 C 78 52, 60 76, 38 76 C 28 76, 25 70, 24 58 Z"
            stroke="url(#chrome)"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 64 34 L 42 34 C 36 34, 32 38, 32 44 C 32 50, 36 53, 44 55 L 56 57 C 64 59, 68 62, 68 68 C 68 74, 64 78, 58 78 L 34 78"
            stroke="url(#chrome)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="72" cy="28" r="4.5" fill="#FF453A" />
          <circle cx="72" cy="28" r="7" stroke="#FF453A" strokeWidth="1" strokeOpacity="0.5" />
          <path
            d="M 0,50 C 0,14 14,0 50,0 C 86,0 100,14 100,50 C 100,86 86,100 50,100 C 14,100 0,86 0,50 Z"
            fill="none"
            stroke="url(#cosmicBorder)"
            strokeWidth="2"
          />
        </g>
      </svg>
    );
  }

  if (choice === 'minimal') {
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
          <clipPath id="squircleMinimal">
            <path d="M 0,50 C 0,14 14,0 50,0 C 86,0 100,14 100,50 C 100,86 86,100 50,100 C 14,100 0,86 0,50 Z" />
          </clipPath>
          <linearGradient id="minimalBorder" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <g clipPath="url(#squircleMinimal)">
          <rect width="100" height="100" fill="#000000" />
          {/* Frosted Obsidian Glass Tile */}
          <rect
            x="14"
            y="14"
            width="72"
            height="72"
            rx="22"
            fill="#1E1E22"
            fillOpacity="0.65"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />
          {/* Modern Minimal Athletic Geometry */}
          <circle cx="50" cy="50" r="18" stroke="#FFFFFF" strokeWidth="5" fill="none" />
          <path d="M 50 32 L 50 68" stroke="#FFFFFF" strokeWidth="3" strokeOpacity="0.6" />
          {/* Emerald Win Jewel */}
          <circle cx="70" cy="30" r="4.5" fill="#30D158" />
          <circle cx="70" cy="30" r="7" stroke="#30D158" strokeWidth="1" strokeOpacity="0.5" />
          <path
            d="M 0,50 C 0,14 14,0 50,0 C 86,0 100,14 100,50 C 100,86 86,100 50,100 C 14,100 0,86 0,50 Z"
            fill="none"
            stroke="url(#minimalBorder)"
            strokeWidth="2"
          />
        </g>
      </svg>
    );
  }

  // Option 3: Stadium Carbon (Default)
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
        <clipPath id="squircleStadium">
          <path d="M 0,50 C 0,14 14,0 50,0 C 86,0 100,14 100,50 C 100,86 86,100 50,100 C 14,100 0,86 0,50 Z" />
        </clipPath>
        <pattern id="carbonMesh" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#0E0E12" />
          <circle cx="2" cy="2" r="1" fill="#22222B" />
          <circle cx="6" cy="6" r="1" fill="#22222B" />
        </pattern>
        <radialGradient id="floodlight" cx="50%" cy="20%" r="75%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.32" />
          <stop offset="40%" stopColor="#0EA5E9" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stadiumEdge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <g clipPath="url(#squircleStadium)">
        {/* Carbon Mesh Background */}
        <rect width="100" height="100" fill="url(#carbonMesh)" />

        {/* Floodlight Stadium Illumination Glow */}
        <rect width="100" height="100" fill="url(#floodlight)" />

        {/* Stadium Field Lines Geometry */}
        <ellipse cx="50" cy="50" rx="36" ry="22" stroke="#38BDF8" strokeWidth="2" strokeOpacity="0.4" fill="none" />
        <line x1="50" y1="28" x2="50" y2="72" stroke="#38BDF8" strokeWidth="2" strokeOpacity="0.4" />
        <circle cx="50" cy="50" r="5" stroke="#38BDF8" strokeWidth="1.5" strokeOpacity="0.5" fill="none" />

        {/* Bold White FOSS SPORTS Logotype */}
        <text
          x="50"
          y="52"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="15"
          fill="#FFFFFF"
          textAnchor="middle"
          letterSpacing="-0.5"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
        >
          FOSS
        </text>
        <text
          x="50"
          y="65"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="9.5"
          fill="#E2E8F0"
          textAnchor="middle"
          letterSpacing="1.8"
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
        >
          SPORTS
        </text>

        {/* Signature Live Red Status Dot */}
        <circle cx="76" cy="24" r="4.5" fill="#FF453A" />
        <circle cx="76" cy="24" r="7.5" stroke="#FF453A" strokeWidth="1" strokeOpacity="0.6" fill="none" />

        {/* Specular Edge Refraction Highlight Border */}
        <path
          d="M 0,50 C 0,14 14,0 50,0 C 86,0 100,14 100,50 C 100,86 86,100 50,100 C 14,100 0,86 0,50 Z"
          fill="none"
          stroke="url(#stadiumEdge)"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
