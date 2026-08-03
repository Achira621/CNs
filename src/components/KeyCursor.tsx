import React, { useEffect, useState } from 'react';
import { Key } from 'lucide-react';

interface KeyCursorProps {
  enabled?: boolean;
}

export const KeyCursor: React.FC<KeyCursorProps> = ({ enabled = true }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (enabled) {
      document.body.classList.add('hide-native-cursor');
    } else {
      document.body.classList.remove('hide-native-cursor');
    }

    return () => {
      document.body.classList.remove('hide-native-cursor');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled, isVisible]);

  if (!enabled || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out hidden sm:block"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-2px, -2px) scale(${isClicking ? 0.85 : 1}) rotate(${isClicking ? '-20deg' : '0deg'})`,
      }}
    >
      {/* Floating Key Icon */}
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute w-8 h-8 rounded-full bg-[#FF3E00]/30 blur-sm animate-pulse" />
        
        {/* Key Badge */}
        <div className="relative w-7 h-7 rounded-full bg-[#FF3E00] text-white flex items-center justify-center shadow-lg border border-amber-300/50">
          <Key className="w-4 h-4 stroke-[2.5]" />
        </div>

        {/* Click Spark Ring */}
        {isClicking && (
          <div className="absolute inset-0 w-10 h-10 -m-1.5 rounded-full border-2 border-amber-400 animate-ping opacity-75" />
        )}
      </div>
    </div>
  );
};
