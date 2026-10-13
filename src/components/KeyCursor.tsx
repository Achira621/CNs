import React, { useEffect, useState, useRef } from 'react';

interface KeyCursorProps {
  enabled?: boolean;
}

export const KeyCursor: React.FC<KeyCursorProps> = ({ enabled = true }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isInteractiveOrInput, setIsInteractiveOrInput] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        // Check if cursor is over inputs, textareas, canvas, or contenteditable
        const isInput =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'CANVAS' ||
          !!target.closest('input') ||
          !!target.closest('textarea') ||
          !!target.closest('canvas') ||
          target.isContentEditable;

        setIsInteractiveOrInput(isInput);

        const isButton =
          target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.getAttribute('role') === 'button' ||
          !!target.closest('button') ||
          !!target.closest('a');

        setIsHovered(isButton);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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
      className={`fixed pointer-events-none z-50 transition-opacity duration-150 ease-out hidden sm:block ${
        isInteractiveOrInput ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Sleek, lag-free ambient neon cursor follower */}
      <div className="relative flex items-center justify-center">
        {/* Soft Radial Ambient Aura */}
        <div
          className={`rounded-full transition-all duration-150 ${
            isHovered
              ? 'w-10 h-10 bg-indigo-500/20 border border-indigo-400/50 scale-125'
              : isClicking
              ? 'w-7 h-7 bg-[#FF3E00]/30 border border-amber-400 scale-90'
              : 'w-8 h-8 bg-[#FF3E00]/15 border border-[#FF3E00]/40'
          } blur-[2px]`}
        />

        {/* Crisp Center Precision Dot */}
        <div
          className={`absolute rounded-full transition-transform duration-100 ${
            isHovered
              ? 'w-2 h-2 bg-indigo-300'
              : isClicking
              ? 'w-2.5 h-2.5 bg-amber-300 scale-125'
              : 'w-1.5 h-1.5 bg-[#FF3E00]'
          } shadow-sm shadow-[#FF3E00]`}
        />
      </div>
    </div>
  );
};
