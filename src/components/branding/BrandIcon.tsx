import React from 'react';

interface BrandIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const BrandIcon: React.FC<BrandIconProps> = ({
  className = 'w-9 h-9',
  size,
  glow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-40 bg-gradient-to-tr from-[#8855C7] via-[#B58AE8] to-[#FF3E00] -z-10"
          aria-hidden="true"
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_8px_rgba(136,85,199,0.4)]"
      >
        <defs>
          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C4B5FD" />
            <stop offset="50%" stopColor="#8855C7" />
            <stop offset="100%" stopColor="#5B21B6" />
          </linearGradient>
          <linearGradient id="planetGrad" x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="40%" stopColor="#8855C7" />
            <stop offset="100%" stopColor="#1E1338" />
          </linearGradient>
          <linearGradient id="ringGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#8855C7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer tilted elliptical orbital path */}
        <ellipse
          cx="50"
          cy="50"
          rx="42"
          ry="18"
          transform="rotate(-28 50 50)"
          stroke="url(#ringGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="90 15 30 10"
        />

        {/* Central Planetary body */}
        <circle cx="50" cy="50" r="22" fill="url(#planetGrad)" />

        {/* Internal cryptographic latitude bands */}
        <ellipse
          cx="50"
          cy="46"
          rx="20"
          ry="7"
          stroke="#EDE1FF"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          fill="none"
        />
        <ellipse
          cx="50"
          cy="54"
          rx="19"
          ry="6"
          stroke="#A855F7"
          strokeWidth="1.5"
          strokeOpacity="0.4"
          fill="none"
        />

        {/* Front half of orbital ring cutting across the planet */}
        <path
          d="M 14 65 C 24 78, 65 65, 86 35"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeOpacity="0.85"
        />

        {/* Focal diamond star in center */}
        <polygon
          points="50,42 52.5,49 59,50 52.5,51 50,58 47.5,51 41,50 47.5,49"
          fill="#FFFFFF"
          className="drop-shadow-[0_0_4px_#FFFFFF]"
        />

        {/* Mini orbiting satellite node */}
        <circle cx="82" cy="33" r="3.5" fill="#C4B5FD" className="drop-shadow-[0_0_6px_#C4B5FD]" />
        <circle cx="18" cy="67" r="2" fill="#E9D5FF" />
      </svg>
    </div>
  );
};
