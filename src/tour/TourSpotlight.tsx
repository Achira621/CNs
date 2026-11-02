import React from 'react';
import { TargetGeometry } from './TourPositionController';

interface TourSpotlightProps {
  targetGeometry: TargetGeometry | null;
  isActive: boolean;
}

export const TourSpotlight: React.FC<TourSpotlightProps> = ({ targetGeometry, isActive }) => {
  if (!isActive || !targetGeometry) return null;

  // Add a balanced 6px padding around the target element
  const padding = 6;
  const top = Math.max(4, targetGeometry.top - padding);
  const left = Math.max(4, targetGeometry.left - padding);
  const width = targetGeometry.width + padding * 2;
  const height = targetGeometry.height + padding * 2;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden">
      {/* NO full page dimming: website background and colors remain 100% crisp and readable */}

      {/* Spotlight Halo Box on the Target Element */}
      <div
        className="absolute rounded-2xl transition-all duration-300 ease-out pointer-events-none"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: '2px solid #8855C7',
          boxShadow:
            '0 0 0 3px rgba(136, 85, 199, 0.25), 0 0 25px rgba(136, 85, 199, 0.35), inset 0 0 12px rgba(136, 85, 199, 0.1)',
        }}
      >
        {/* Pulsing Corner Brackets */}
        <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#EDE1FF] rounded-tl-sm shadow-[0_0_8px_#8855C7]" />
        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#EDE1FF] rounded-tr-sm shadow-[0_0_8px_#8855C7]" />
        <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#EDE1FF] rounded-bl-sm shadow-[0_0_8px_#8855C7]" />
        <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#EDE1FF] rounded-br-sm shadow-[0_0_8px_#8855C7]" />

        {/* Live scanning line */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-25">
          <div className="w-full h-1/2 bg-gradient-to-b from-[#8855C7]/40 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};
