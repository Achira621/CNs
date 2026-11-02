import React, { useEffect, useRef } from 'react';

interface CosmicBackgroundProps {
  lightCanvas?: boolean;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ lightCanvas = true }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system: subtle floating dust motes
    const particleCount = lightCanvas ? 35 : 55;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.35 - 0.05,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render floating particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = lightCanvas
          ? `rgba(136, 85, 199, ${p.alpha * 0.6})`
          : `rgba(196, 181, 253, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [lightCanvas]);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Light Canvas Base with subtle gradient */}
      <div
        className={`absolute inset-0 ${
          lightCanvas
            ? 'bg-[#F9F9FC]'
            : 'bg-[#0B0B12]'
        }`}
      />

      {/* Atmospheric radial glows */}
      {lightCanvas ? (
        <>
          {/* Top-Right cosmic purple glow */}
          <div
            className="absolute -top-32 -right-32 w-[650px] h-[650px] rounded-full blur-[140px] opacity-45 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.28) 0%, rgba(136,85,199,0.12) 50%, transparent 75%)',
            }}
          />
          {/* Subtle bottom-left warmth */}
          <div
            className="absolute -bottom-32 -left-32 w-[600px] h-[600px] rounded-full blur-[160px] opacity-25 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(255,62,0,0.15) 0%, rgba(168,85,247,0.08) 50%, transparent 75%)',
            }}
          />
          {/* Center ambient softness */}
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[160px] opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(196,181,253,0.3) 0%, transparent 70%)',
            }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-[160px] opacity-35"
            style={{
              background: 'radial-gradient(circle, rgba(136,85,199,0.45) 0%, rgba(76,29,149,0.2) 60%, transparent 80%)',
            }}
          />
        </>
      )}

      {/* Decorative cosmic orbital trajectories in SVG */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="82%"
          cy="22%"
          rx="450"
          ry="190"
          transform="rotate(-20 1200 200)"
          stroke={lightCanvas ? '#D8B4FE' : '#4C1D95'}
          strokeWidth="1"
          strokeDasharray="4 8"
          fill="none"
          opacity={lightCanvas ? 0.45 : 0.25}
        />
        <ellipse
          cx="82%"
          cy="22%"
          rx="680"
          ry="280"
          transform="rotate(-20 1200 200)"
          stroke={lightCanvas ? '#C084FC' : '#5B21B6'}
          strokeWidth="0.8"
          strokeDasharray="2 12"
          fill="none"
          opacity={lightCanvas ? 0.35 : 0.2}
        />
      </svg>

      {/* Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
