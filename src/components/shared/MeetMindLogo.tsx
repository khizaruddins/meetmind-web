import React from 'react';

interface MeetMindLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  className?: string;
  glow?: boolean;
}

const sizeMap = {
  xs: { box: 'w-6 h-6 rounded-lg', icon: 16 },
  sm: { box: 'w-8 h-8 rounded-xl', icon: 20 },
  md: { box: 'w-10 h-10 rounded-xl', icon: 24 },
  lg: { box: 'w-12 h-12 rounded-2xl', icon: 30 },
  xl: { box: 'w-16 h-16 rounded-3xl', icon: 40 },
};

export const MeetMindLogo: React.FC<MeetMindLogoProps> = ({
  size = 'sm',
  showText = false,
  subtitle,
  className = '',
  glow = true,
}) => {
  const { box } = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon Badge */}
      <div
        className={`relative flex items-center justify-center ${box} bg-gradient-to-b from-[#181826] to-[#0a0a10] border border-white/10 shadow-lg ${
          glow ? 'shadow-rose-500/20' : ''
        } flex-shrink-0 group-hover:border-rose-500/40 transition-all duration-300 overflow-hidden`}
      >
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 via-transparent to-amber-500/10 pointer-events-none" />

        {/* Vector Mark */}
        <svg
          viewBox="0 0 512 512"
          className="w-[78%] h-[78%] relative z-10 drop-shadow-[0_2px_8px_rgba(244,63,94,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mmlogo-rose-amber" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E11D48" />
              <stop offset="35%" stopColor="#F43F5E" />
              <stop offset="70%" stopColor="#FB7185" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <linearGradient id="mmlogo-accent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#E11D48" />
            </linearGradient>
            <radialGradient id="mmlogo-lens" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#FFE4E6" />
              <stop offset="70%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </radialGradient>
          </defs>

          {/* Outer Arch */}
          <path
            d="M112 368 V216 C112 164 154 132 202 132 C240 132 256 162 256 190"
            stroke="url(#mmlogo-rose-amber)"
            strokeWidth="46"
            strokeLinecap="round"
          />
          <path
            d="M400 368 V216 C400 164 358 132 310 132 C272 132 256 162 256 190"
            stroke="url(#mmlogo-accent)"
            strokeWidth="46"
            strokeLinecap="round"
          />

          {/* Inner Chevron Audio Wave */}
          <path
            d="M192 236 L256 328 L320 236"
            stroke="url(#mmlogo-rose-amber)"
            strokeWidth="44"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Active Recording Core Lens */}
          <circle cx="256" cy="188" r="32" fill="#F43F5E" fillOpacity="0.35" />
          <circle cx="256" cy="188" r="21" fill="#F43F5E" fillOpacity="0.75" />
          <circle cx="256" cy="188" r="14" fill="url(#mmlogo-lens)" />
          <circle cx="256" cy="188" r="6" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typography Label */}
      {showText && (
        <div className="flex flex-col select-none">
          <div className="flex items-center tracking-tight font-heading font-bold text-white leading-none">
            <span className="text-base">Meet</span>
            <span className="text-base bg-gradient-to-r from-rose-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
              Mind
            </span>
          </div>
          {subtitle && (
            <span className="text-[10px] text-zinc-400 font-mono tracking-wide mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
