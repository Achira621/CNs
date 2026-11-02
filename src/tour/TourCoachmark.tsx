import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Pause,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Lightbulb,
  Compass,
} from 'lucide-react';
import { TourStep } from './TourRegistry';

interface TourCoachmarkProps {
  step: TourStep;
  currentStepIndex: number;
  totalSteps: number;
  targetElement: HTMLElement | null;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onDemonstrate?: (action: string) => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const TourCoachmark: React.FC<TourCoachmarkProps> = ({
  step,
  currentStepIndex,
  totalSteps,
  targetElement,
  onNext,
  onPrev,
  onExit,
  onDemonstrate,
  isPaused,
  onTogglePause,
}) => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 50, y: 150 });

  useEffect(() => {
    const calculatePosition = () => {
      const cardW = 380;
      const cardH = 430;

      if (!targetElement) {
        // Center fallback
        setCoords({
          x: Math.max(20, (window.innerWidth - cardW) / 2),
          y: Math.max(80, (window.innerHeight - cardH) / 2),
        });
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      let x = rect.right + 20;
      let y = rect.top;

      // Check if right side exceeds window width
      if (x + cardW > window.innerWidth - 20) {
        // Place on left side
        x = rect.left - cardW - 20;
      }

      // If still overflowing on left, place below or above
      if (x < 20) {
        x = Math.max(20, Math.min(window.innerWidth - cardW - 20, rect.left));
        y = rect.bottom + 20;

        // If below overflows, place above
        if (y + cardH > window.innerHeight - 20) {
          y = Math.max(80, rect.top - cardH - 20);
        }
      }

      // Final viewport boundary clamping
      x = Math.max(20, Math.min(window.innerWidth - cardW - 20, x));
      y = Math.max(80, Math.min(window.innerHeight - cardH - 20, y));

      setCoords({ x, y });
    };

    calculatePosition();

    window.addEventListener('resize', calculatePosition, { passive: true });
    window.addEventListener('scroll', calculatePosition, { passive: true });

    return () => {
      window.removeEventListener('resize', calculatePosition);
      window.removeEventListener('scroll', calculatePosition);
    };
  }, [targetElement, step]);

  return (
    <div
      className="fixed z-50 transition-all duration-500 ease-out"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        width: '380px',
      }}
    >
      {/* Coachmark Card (Clean light surface with dark accents & purple glow) */}
      <div className="bg-white/95 backdrop-blur-md border-2 border-[#8855C7] rounded-3xl shadow-[0_20px_50px_rgba(136,85,199,0.25)] p-5 text-zinc-900 space-y-3.5 relative overflow-hidden select-none">
        {/* Top Accent Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8855C7] via-[#B58AE8] to-[#6366F1]" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EDE1FF] text-[#7C3AED] text-[10px] font-mono-code font-bold uppercase tracking-wider">
              {step.section}
            </span>
            <span className="text-[11px] font-mono-code text-zinc-600 font-bold">
              {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onTogglePause}
              title={isPaused ? 'Resume auto tour' : 'Pause tour to explore'}
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onExit}
              title="Exit feature walkthrough"
              className="p-1 rounded-lg hover:bg-rose-50 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature Title */}
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-zinc-950 font-serif-display leading-snug">
            {step.title}
          </h3>
        </div>

        {/* 4 Standardized Structured Sections */}
        <div className="space-y-2 text-xs leading-relaxed max-h-[220px] overflow-y-auto pr-1">
          {/* 1. WHAT IT IS */}
          <div className="bg-[#FAF9FD] border border-[#E9E6F4] rounded-xl p-2.5 space-y-0.5">
            <span className="text-[10px] font-mono-code font-extrabold text-[#7C3AED] uppercase tracking-wider block">
              WHAT IT IS
            </span>
            <p className="text-zinc-700 font-sans">{step.whatItIs}</p>
          </div>

          {/* 2. WHY IT EXISTS */}
          <div className="bg-[#FAF9FD] border border-[#E9E6F4] rounded-xl p-2.5 space-y-0.5">
            <span className="text-[10px] font-mono-code font-extrabold text-blue-600 uppercase tracking-wider block">
              WHY IT EXISTS
            </span>
            <p className="text-zinc-700 font-sans">{step.whyItExists}</p>
          </div>

          {/* 3. HOW TO USE IT */}
          <div className="bg-[#FAF9FD] border border-[#E9E6F4] rounded-xl p-2.5 space-y-0.5">
            <span className="text-[10px] font-mono-code font-extrabold text-emerald-600 uppercase tracking-wider block">
              HOW TO USE IT
            </span>
            <p className="text-zinc-700 font-sans">{step.howToUse}</p>
          </div>

          {/* 4. QUICK TIP */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 space-y-0.5 text-amber-900">
            <div className="flex items-center gap-1.5 text-[10px] font-mono-code font-extrabold text-amber-700 uppercase tracking-wider">
              <Lightbulb className="w-3 h-3 text-amber-600" />
              <span>QUICK TIP</span>
            </div>
            <p className="text-amber-800 font-sans">{step.quickTip}</p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <button
            onClick={onPrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-mono-code font-semibold text-zinc-700 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {/* Optional Demonstration Button */}
          {step.demonstrationAction && onDemonstrate && (
            <button
              onClick={() => onDemonstrate(step.demonstrationAction!)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#EDE1FF] hover:bg-[#DDD6FE] text-[#7C3AED] text-xs font-mono-code font-bold transition-all cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Try Demo</span>
            </button>
          )}

          <button
            onClick={onNext}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#8855C7] hover:bg-[#7844B5] text-white text-xs font-mono-code font-bold shadow-md shadow-[#8855C7]/20 transition-all active:scale-95 cursor-pointer"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
