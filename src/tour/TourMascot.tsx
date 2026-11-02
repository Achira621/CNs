import React, { useEffect, useState } from 'react';
import { CyberMascotCanvas } from '../components/CyberMascotCanvas';

interface TourMascotProps {
  targetElement: HTMLElement | null;
  isActive: boolean;
  statusText?: string;
}

export const TourMascot: React.FC<TourMascotProps> = ({
  targetElement,
  isActive,
  statusText = 'Examining Feature',
}) => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      if (!targetElement) {
        // Fallback default position (top right corner)
        setCoords({ x: window.innerWidth - 180, y: 80 });
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      const mascotW = 120;
      const mascotH = 120;

      // Position mascot conveniently near the element:
      // Try to position near the top-left or top-right of the target
      let targetX = rect.left - mascotW - 10;
      let targetY = rect.top - 20;

      // If too close to left edge, place on the right
      if (targetX < 20) {
        targetX = rect.right + 15;
      }

      // If too close to right edge, place above
      if (targetX + mascotW > window.innerWidth - 20) {
        targetX = Math.max(20, rect.left);
        targetY = rect.top - mascotH - 10;
      }

      // Keep within vertical bounds
      if (targetY < 70) targetY = 70;
      if (targetY + mascotH > window.innerHeight - 30) targetY = window.innerHeight - mascotH - 30;

      setIsFlying(true);
      setCoords({ x: targetX, y: targetY });

      const timeout = setTimeout(() => setIsFlying(false), 600);
      return () => clearTimeout(timeout);
    };

    updatePosition();

    window.addEventListener('resize', updatePosition, { passive: true });
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetElement, isActive]);

  if (!isActive) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        transform: isFlying ? 'scale(1.08) rotate(4deg)' : 'scale(1) rotate(0deg)',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Holographic Laser Pointer Dot down towards target */}
        <div className="absolute -bottom-2 w-3 h-3 rounded-full bg-[#8855C7] blur-xs animate-ping" />

        {/* 3D Cyber Mascot Floating Canvas */}
        <div className="w-28 h-28 relative drop-shadow-[0_12px_24px_rgba(136,85,199,0.45)]">
          <CyberMascotCanvas
            size="mini"
            scale={0.52}
            hideFloor={true}
            hideOverlays={true}
          />
        </div>

        {/* Status Bubble under mascot */}
        <div className="mt-1 px-2.5 py-0.5 rounded-full bg-[#13121F]/90 backdrop-blur-md border border-[#8855C7]/70 text-[10px] font-mono-code font-bold text-[#C4B5FD] shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
};
