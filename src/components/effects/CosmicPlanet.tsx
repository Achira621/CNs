import React from 'react';

interface CosmicPlanetProps {
  className?: string;
  size?: number;
  lightCanvas?: boolean;
}

export const CosmicPlanet: React.FC<CosmicPlanetProps> = ({
  className = '',
  size = 320,
  lightCanvas = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient background glow */}
      <div
        className={`absolute inset-0 rounded-full blur-3xl opacity-50 ${
          lightCanvas
            ? 'bg-gradient-to-tr from-[#D8B4FE]/60 via-[#E9D5FF]/40 to-transparent'
            : 'bg-gradient-to-tr from-[#8855C7]/40 via-[#3B0764]/30 to-transparent'
        }`}
        style={{ transform: 'scale(1.2)' }}
      />

      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_20px_40px_rgba(136,85,199,0.25)]"
      >
        <defs>
          {/* Planet Body Gradient */}
          <radialGradient
            id="planetSpherical"
            cx="35%"
            cy="30%"
            r="65%"
            fx="30%"
            fy="25%"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="15%" stopColor="#EDE9FE" />
            <stop offset="35%" stopColor="#C4B5FD" />
            <stop offset="65%" stopColor="#8B5CF6" />
            <stop offset="90%" stopColor="#4C1D95" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </radialGradient>

          {/* Planetary Ring Gradient */}
          <linearGradient id="ringGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DDD6FE" stopOpacity="0.2" />
            <stop offset="25%" stopColor="#C4B5FD" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#8B5CF6" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#EDE9FE" stopOpacity="0.2" />
          </linearGradient>

          {/* Mask to clip stripes inside the sphere */}
          <clipPath id="planetClip">
            <circle cx="200" cy="200" r="115" />
          </clipPath>
        </defs>

        {/* Back section of the ring (behind the planet) */}
        <ellipse
          cx="200"
          cy="200"
          rx="185"
          ry="65"
          transform="rotate(-24 200 200)"
          stroke="url(#ringGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="450 700"
          strokeDashoffset="180"
          className="opacity-70"
        />

        {/* Inner thin back ring */}
        <ellipse
          cx="200"
          cy="200"
          rx="155"
          ry="54"
          transform="rotate(-24 200 200)"
          stroke="#EDE9FE"
          strokeWidth="2.5"
          strokeOpacity="0.5"
          strokeDasharray="300 500"
          strokeDashoffset="120"
        />

        {/* Planet Sphere */}
        <g clipPath="url(#planetClip)">
          {/* Base Sphere */}
          <circle cx="200" cy="200" r="115" fill="url(#planetSpherical)" />

          {/* Swirling marble bands matching reference screenshot */}
          <path
            d="M 60 160 C 130 130, 260 210, 340 180 C 320 220, 240 240, 180 220 C 120 200, 80 180, 60 160 Z"
            fill="#7C3AED"
            opacity="0.45"
          />
          <path
            d="M 65 195 C 130 170, 240 250, 335 220 C 315 255, 250 270, 185 250 C 125 230, 85 210, 65 195 Z"
            fill="#A78BFA"
            opacity="0.6"
          />
          <path
            d="M 75 230 C 145 210, 230 280, 325 255 C 310 280, 240 305, 180 290 C 130 275, 90 250, 75 230 Z"
            fill="#5B21B6"
            opacity="0.5"
          />
          <path
            d="M 90 130 C 150 110, 250 160, 310 140 C 300 165, 230 185, 170 170 C 120 155, 95 140, 90 130 Z"
            fill="#DDD6FE"
            opacity="0.55"
          />

          {/* Smooth highlight crest */}
          <ellipse
            cx="175"
            cy="135"
            rx="75"
            ry="45"
            fill="#FFFFFF"
            opacity="0.25"
            transform="rotate(-20 175 135)"
          />

          {/* Shadow crescent across bottom right */}
          <circle
            cx="225"
            cy="225"
            r="115"
            fill="#0F0A1E"
            opacity="0.4"
            style={{ mixBlendMode: 'multiply' }}
          />
        </g>

        {/* Front section of the tilted orbital ring (in front of planet) */}
        <ellipse
          cx="200"
          cy="200"
          rx="185"
          ry="65"
          transform="rotate(-24 200 200)"
          stroke="url(#ringGradient)"
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray="480 650"
          strokeDashoffset="-90"
        />

        {/* Thin front specular edge */}
        <ellipse
          cx="200"
          cy="200"
          rx="186"
          ry="65"
          transform="rotate(-24 200 200)"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="280 850"
          strokeDashoffset="-160"
          className="opacity-90 drop-shadow-[0_0_8px_#FFFFFF]"
        />

        {/* Orbiting star spark */}
        <circle cx="340" cy="130" r="3.5" fill="#FFFFFF" className="drop-shadow-[0_0_6px_#C4B5FD]" />
        <circle cx="70" cy="285" r="2.5" fill="#8B5CF6" className="drop-shadow-[0_0_4px_#8B5CF6]" />
      </svg>
    </div>
  );
};
