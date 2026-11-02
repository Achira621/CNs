import React, { useEffect, useState } from 'react';

interface TourSpotlightProps {
  targetElement: HTMLElement | null;
  isActive: boolean;
}

export const TourSpotlight: React.FC<TourSpotlightProps> = ({ targetElement, isActive }) => {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!isActive || !targetElement) {
      setRect(null);
      return;
    }

    const updateRect = () => {
      const r = targetElement.getBoundingClientRect();
      setRect(r);
    };

    updateRect();

    // Listen to window scroll and resize
    window.addEventListener('resize', updateRect, { passive: true });
    window.addEventListener('scroll', updateRect, { passive: true });

    // Periodic check in case of layout changes or animations
    const interval = setInterval(updateRect, 300);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
      clearInterval(interval);
    };
  }, [targetElement, isActive]);

  if (!isActive || !rect) return null;

  // Add slight padding around the target
  const padding = 8;
  const top = Math.max(0, rect.top - padding);
  const left = Math.max(0, rect.left - padding);
  const width = rect.width + padding * 2;
  const height = rect.height + padding * 2;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Subtle global ambient dimming (non-blocking) */}
      <div className="absolute inset-0 bg-black/15 transition-opacity duration-500" />

      {/* Spotlight Halo Box on the Target Element */}
      <div
        className="absolute rounded-2xl transition-all duration-500 ease-out pointer-events-none"
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
          border: '2px solid #8855C7',
          boxShadow: '0 0 0 4px rgba(136, 85, 199, 0.25), 0 0 35px rgba(136, 85, 199, 0.4), inset 0 0 15px rgba(136, 85, 199, 0.1)',
        }}
      >
        {/* Pulsing Corner Brackets */}
        <span className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#EDE1FF] rounded-tl-sm" />
        <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#EDE1FF] rounded-tr-sm" />
        <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#EDE1FF] rounded-bl-sm" />
        <span className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#EDE1FF] rounded-br-sm" />

        {/* Live scanning line */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-30">
          <div className="w-full h-1/2 bg-gradient-to-b from-[#8855C7]/30 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
};
