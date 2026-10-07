import React, { useEffect, useState, useRef } from 'react';
import { Key, Sparkles } from 'lucide-react';

interface KeyCursorProps {
  enabled?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export const KeyCursor: React.FC<KeyCursorProps> = ({ enabled = true }) => {
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const [renderPos, setRenderPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTextTarget, setIsTextTarget] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particles = useRef<Particle[]>([]);
  const nextParticleId = useRef(0);

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

  // Spring physics animation loop & Particle Trail
  useEffect(() => {
    if (!enabled) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const colors = ['#FF3E00', '#00E5FF', '#FFB800', '#00FF9D'];

    const updateLoop = () => {
      // Spring lerp interpolation (Zero-Gravity inertia)
      const lerpFactor = 0.22;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerpFactor;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerpFactor;

      setRenderPos({ x: currentPos.current.x, y: currentPos.current.y });

      // Render Mouse Trail Canvas
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Update & draw particles
          particles.current.forEach((p, idx) => {
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.025;
            p.size *= 0.96;

            if (p.alpha > 0) {
              ctx.save();
              ctx.globalAlpha = p.alpha;
              ctx.fillStyle = p.color;
              ctx.shadowColor = p.color;
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(p.x, p.y, Math.max(1, p.size), 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          });

          particles.current = particles.current.filter((p) => p.alpha > 0);
        }
      }

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Spawn reactive particle trail
      if (Math.random() < 0.6) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        particles.current.push({
          id: nextParticleId.current++,
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3,
          size: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
        });
      }

      // Check magnetic hover over interactive targets
      const target = e.target as HTMLElement | null;
      if (target) {
        const isText =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          !!target.closest('input') ||
          !!target.closest('textarea');
        setIsTextTarget(isText);

        const isInteractive =
          !isText &&
          (target.tagName === 'BUTTON' ||
            target.tagName === 'A' ||
            !!target.closest('button') ||
            !!target.closest('a') ||
            target.classList.contains('cyber-card-glow'));
        setIsHovered(!!isInteractive);
      }
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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled, isVisible]);

  if (!enabled || !isVisible) return null;

  return (
    <>
      {/* Particle Trail Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40 overflow-hidden"
      />

      {/* Main Zero-Gravity Physics Cursor Badge */}
      <div
        className={`fixed pointer-events-none z-50 transition-all duration-100 ease-out hidden sm:block ${
          isTextTarget ? 'opacity-25' : 'opacity-100'
        }`}
        style={{
          left: `${renderPos.x}px`,
          top: `${renderPos.y}px`,
          transform: `translate(-50%, -50%) scale(${
            isTextTarget ? 0.45 : isClicking ? 0.8 : isHovered ? 1.35 : 1
          }) rotate(${isClicking ? '-25deg' : isHovered ? '15deg' : '0deg'})`,
        }}
      >
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Neon Magnet Ring */}
          {!isTextTarget && (
            <div
              className={`absolute rounded-full border transition-all duration-300 ${
                isHovered
                  ? 'w-12 h-12 border-[#00E5FF] bg-[#00E5FF]/10 animate-ping opacity-80'
                  : 'w-8 h-8 border-[#FF3E00]/40 bg-[#FF3E00]/20 blur-[1px]'
              }`}
            />
          )}

          {/* Key Badge */}
          <div
            className={`relative w-8 h-8 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border ${
              isHovered
                ? 'bg-gradient-to-tr from-[#FF3E00] to-amber-400 text-white border-white scale-110 shadow-[#FF3E00]/50'
                : 'bg-[#FF3E00] text-white border-amber-300/60 shadow-[#FF3E00]/30'
            }`}
          >
            <Key className="w-4 h-4 stroke-[2.5]" />
          </div>

          {/* Sparkles icon when hovering interactive buttons */}
          {isHovered && (
            <Sparkles className="absolute -top-2 -right-2 w-3.5 h-3.5 text-amber-300 animate-bounce" />
          )}

          {/* Click Spark Ring */}
          {isClicking && (
            <div className="absolute inset-0 w-12 h-12 -m-2 rounded-full border-2 border-amber-400 animate-ping opacity-90" />
          )}
        </div>
      </div>
    </>
  );
};
