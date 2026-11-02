import React, { useEffect, useRef } from 'react';

interface CyberMascotCanvasProps {
  size?: 'mini' | 'sm' | 'md' | 'lg' | 'auto';
  scale?: number;
  hideFloor?: boolean;
  hideOverlays?: boolean;
  className?: string;
}

export const CyberMascotCanvas: React.FC<CyberMascotCanvasProps> = ({
  size = 'md',
  scale: customScale,
  hideFloor = false,
  hideOverlays = false,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 300);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      targetRotY = (x / rect.width) * 0.6;
      targetRotX = -(y / rect.height) * 0.6;
      mouseX = x;
      mouseY = y;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left - rect.width / 2;
        const y = e.touches[0].clientY - rect.top - rect.height / 2;
        targetRotY = (x / rect.width) * 0.8;
        targetRotX = -(y / rect.height) * 0.8;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Smooth rotation lerp
      currentRotX += (targetRotX - currentRotX) * 0.08;
      currentRotY += (targetRotY - currentRotY) * 0.08;

      const centerX = width / 2;
      const centerY = height / 2 - (hideFloor ? 0 : 20) + Math.sin(time * 1.5) * 8; // Gentle floating bobbing

      // Compute scale factor
      let effectiveScale = customScale;
      if (!effectiveScale) {
        if (size === 'mini') effectiveScale = 0.45;
        else if (size === 'sm') effectiveScale = 0.65;
        else if (size === 'md') effectiveScale = 0.85;
        else if (size === 'lg') effectiveScale = 1.0;
        else effectiveScale = 0.8;
      }

      // 1. Render Perspective Ground Grid (if not hidden)
      if (!hideFloor) {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 62, 0, 0.18)';
        ctx.lineWidth = 1;

        const horizonY = height * 0.72;
        const floorBottomY = height;
        const numLines = 14;

        for (let i = 0; i <= numLines; i++) {
          const xProjTop = centerX + (i - numLines / 2) * (width / numLines) * 0.25;
          const xProjBottom = centerX + (i - numLines / 2) * (width / numLines) * 1.8;
          ctx.beginPath();
          ctx.moveTo(xProjTop, horizonY);
          ctx.lineTo(xProjBottom, floorBottomY);
          ctx.stroke();
        }

        // Horizontal perspective grid lines
        for (let j = 1; j <= 8; j++) {
          const ratio = Math.pow(j / 8, 2);
          const y = horizonY + ratio * (floorBottomY - horizonY);
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 2. Render 3D Vault / Cipher Robot Body
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(effectiveScale, effectiveScale);

      // Shadow on floor
      if (!hideFloor) {
        ctx.beginPath();
        ctx.ellipse(0, height * 0.28 / effectiveScale, 90, 24, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
      }

      // Main Outer Frame Box with 3D tilt
      const boxW = 160;
      const boxH = 150;

      // Apply 3D perspective skew
      const tiltX = currentRotY * 30;
      const tiltY = currentRotX * 30;

      ctx.save();
      ctx.translate(tiltX, tiltY);

      // Back glow fill
      const radialGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
      radialGlow.addColorStop(0, 'rgba(136, 85, 199, 0.4)');
      radialGlow.addColorStop(0.5, 'rgba(255, 62, 0, 0.2)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 140, 0, Math.PI * 2);
      ctx.fill();

      // Vault Box Main Shell (Rounded Rect)
      ctx.fillStyle = '#141417';
      ctx.strokeStyle = '#8855C7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 24);
      ctx.fill();
      ctx.stroke();

      // Outer Bezel Accent Corners
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-boxW / 2 + 6, -boxH / 2 + 6, boxW - 12, boxH - 12, 18);
      ctx.stroke();

      // Screen Face Display Plate
      ctx.fillStyle = '#08080A';
      ctx.strokeStyle = '#282830';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-boxW / 2 + 18, -boxH / 2 + 18, boxW - 36, boxH - 60, 16);
      ctx.fill();
      ctx.stroke();

      // Robot Cute Glowing Eyes (Like >/< or OUO cyber face)
      const eyeOffset = 26 + Math.sin(time * 2) * 2;
      const eyeY = -28;

      // Left Eye
      ctx.fillStyle = '#B58AE8';
      ctx.shadowColor = '#8855C7';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(-eyeOffset, eyeY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-eyeOffset + 3, eyeY - 3, 4, 0, Math.PI * 2);
      ctx.fill();

      // Right Eye
      ctx.fillStyle = '#B58AE8';
      ctx.beginPath();
      ctx.arc(eyeOffset, eyeY, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(eyeOffset - 3, eyeY - 3, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // Cute Smile mouth (OUO / >/< style)
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, eyeY + 14, 10, 0.15 * Math.PI, 0.85 * Math.PI, false);
      ctx.stroke();

      // Keyhole / Cipher Dial Slot below screen
      ctx.fillStyle = '#1E1E24';
      ctx.strokeStyle = '#FF3E00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 32, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotating Key slot indicator inside dial
      ctx.save();
      ctx.translate(0, 32);
      ctx.rotate(time * 0.8);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(0, 10);
      ctx.stroke();
      ctx.restore();

      // Side Floating Robot Hands / Wings
      const handOffset = 95 + Math.sin(time * 2.5) * 6;
      ctx.fillStyle = '#1A1A20';
      ctx.strokeStyle = '#8855C7';
      ctx.lineWidth = 2;

      // Left Hand
      ctx.beginPath();
      ctx.roundRect(-handOffset - 22, -15, 22, 40, 10);
      ctx.fill();
      ctx.stroke();

      // Right Hand
      ctx.beginPath();
      ctx.roundRect(handOffset, -15, 22, 40, 10);
      ctx.fill();
      ctx.stroke();

      ctx.restore(); // end tilt
      ctx.restore(); // end translate

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [size, customScale, hideFloor]);

  return (
    <div
      className={`relative flex items-center justify-center pointer-events-auto select-none ${
        size === 'mini'
          ? 'w-24 h-24'
          : size === 'sm'
          ? 'w-48 h-48'
          : size === 'md'
          ? 'w-full h-[280px] sm:h-[320px]'
          : 'w-full h-[360px] sm:h-[450px]'
      } ${className}`}
    >
      {!hideOverlays && (
        <>
          {/* Corner Bracket Frames (┌ ┐ └ ┘) */}
          <div className="absolute top-2 left-3 text-zinc-500 font-mono-code text-sm font-bold select-none pointer-events-none">
            ┌
          </div>
          <div className="absolute top-2 right-3 text-zinc-500 font-mono-code text-sm font-bold select-none pointer-events-none">
            ┐
          </div>
          <div className="absolute bottom-2 left-3 text-zinc-500 font-mono-code text-sm font-bold select-none pointer-events-none">
            └
          </div>
          <div className="absolute bottom-2 right-3 text-zinc-500 font-mono-code text-sm font-bold select-none pointer-events-none">
            ┘
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
