import React, { useEffect, useState, useRef } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Zap,
  CheckCircle,
} from 'lucide-react';
import { TourStep } from './TourRegistry';

export type MascotSpeechState =
  | 'closed'
  | 'opening'
  | 'activating'
  | 'speaking'
  | 'closing';

interface TourMascotProps {
  targetElement: HTMLElement | null;
  isActive: boolean;
  step: TourStep;
  currentStepIndex: number;
  totalSteps: number;
  isPaused: boolean;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
  onTogglePause: () => void;
  onDemonstrate?: (action: string) => void;
}

export const TourMascot: React.FC<TourMascotProps> = ({
  targetElement,
  isActive,
  step,
  currentStepIndex,
  totalSteps,
  isPaused,
  onNext,
  onPrev,
  onExit,
  onTogglePause,
  onDemonstrate,
}) => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 100, y: 100 });
  const [speechState, setSpeechState] = useState<MascotSpeechState>('closed');
  const [activeSegment, setActiveSegment] = useState<'what' | 'why' | 'how' | 'tip'>('what');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [blink, setBlink] = useState(false);
  const [eyeShift, setEyeShift] = useState({ x: 0, y: 0 });

  // Blinking eye timer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  // Eye tracking: look towards target element
  useEffect(() => {
    if (!targetElement) {
      setEyeShift({ x: 0, y: 0 });
      return;
    }
    const r = targetElement.getBoundingClientRect();
    const centerX = coords.x + 170;
    const centerY = coords.y + 60;
    const dx = r.left + r.width / 2 - centerX;
    const dy = r.top + r.height / 2 - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    setEyeShift({
      x: Math.max(-6, Math.min(6, (dx / dist) * 6)),
      y: Math.max(-5, Math.min(5, (dy / dist) * 5)),
    });
  }, [coords, targetElement]);

  // Position calculation: smart placement near target without covering it
  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      const mascotW = speechState === 'closed' ? 140 : 350;
      const mascotH = speechState === 'closed' ? 140 : 340;

      if (!targetElement) {
        setCoords({
          x: Math.max(20, window.innerWidth - mascotW - 40),
          y: 90,
        });
        return;
      }

      const rect = targetElement.getBoundingClientRect();
      let targetX = rect.right + 25;
      let targetY = rect.top - 20;

      // If overflows right side, try left side
      if (targetX + mascotW > window.innerWidth - 20) {
        targetX = rect.left - mascotW - 25;
      }

      // If still overflowing on left, place below or above
      if (targetX < 20) {
        targetX = Math.max(20, Math.min(window.innerWidth - mascotW - 20, rect.left));
        targetY = rect.bottom + 25;

        // If below overflows, place above
        if (targetY + mascotH > window.innerHeight - 20) {
          targetY = Math.max(80, rect.top - mascotH - 25);
        }
      }

      // Clamp within viewport
      targetX = Math.max(20, Math.min(window.innerWidth - mascotW - 20, targetX));
      targetY = Math.max(75, Math.min(window.innerHeight - mascotH - 20, targetY));

      setCoords({ x: targetX, y: targetY });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition, { passive: true });
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetElement, isActive, speechState]);

  // Handle step changes: trigger mouth opening and OLED screen activation
  useEffect(() => {
    if (!isActive || !step) return;

    // Reset segment to "what"
    setActiveSegment('what');

    // Sequence: opening -> activating -> speaking
    setSpeechState('opening');
    const timer1 = setTimeout(() => {
      setSpeechState('activating');
      const timer2 = setTimeout(() => {
        setSpeechState('speaking');
      }, 250);
      return () => clearTimeout(timer2);
    }, 250);

    return () => clearTimeout(timer1);
  }, [step, currentStepIndex, isActive]);

  // Typewriter effect for active segment text
  useEffect(() => {
    if (speechState !== 'speaking' && speechState !== 'activating') return;

    let fullText = step.whatItIs;
    if (activeSegment === 'why') fullText = step.whyItExists;
    else if (activeSegment === 'how') fullText = step.howToUse;
    else if (activeSegment === 'tip') fullText = step.quickTip;

    setIsTyping(true);
    setDisplayedText('');

    let charIdx = 0;
    const typingInterval = setInterval(() => {
      charIdx++;
      if (charIdx <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx));
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 14);

    return () => clearInterval(typingInterval);
  }, [activeSegment, step, speechState]);

  // Skip typing on click
  const handleSkipTyping = () => {
    if (isTyping) {
      let fullText = step.whatItIs;
      if (activeSegment === 'why') fullText = step.whyItExists;
      else if (activeSegment === 'how') fullText = step.howToUse;
      else if (activeSegment === 'tip') fullText = step.quickTip;
      setDisplayedText(fullText);
      setIsTyping(false);
    }
  };

  if (!isActive) return null;

  const isMouthOpen = speechState !== 'closed';

  return (
    <div
      className="fixed z-50 pointer-events-auto select-none transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        width: isMouthOpen ? '350px' : '140px',
      }}
    >
      {/* Laser indicator pointing toward target */}
      {targetElement && (
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8855C7] blur-[2px] animate-ping pointer-events-none" />
      )}

      {/* Main Robot Housing Vault */}
      <div className="relative bg-[#141417] border-2 border-[#8855C7] rounded-[28px] shadow-[0_20px_60px_rgba(136,85,199,0.35)] overflow-hidden transition-all duration-500">
        {/* Soft Radial Ambient Aura */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#8855C7]/25 rounded-full blur-2xl pointer-events-none" />

        {/* Outer Bezel Accent Corner Insets */}
        <div className="absolute inset-1.5 border border-white/10 rounded-[22px] pointer-events-none" />

        {/* ========================================================================= */}
        {/* ROBOT UPPER HEAD / FACE SECTION */}
        {/* ========================================================================= */}
        <div className="p-3.5 pb-2 relative z-10 flex flex-col items-center">
          {/* Top Hardware Bezel with Status LED */}
          <div className="w-full flex items-center justify-between text-[9px] font-mono-code text-zinc-400 mb-2 px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse" />
              <span className="text-[#C4B5FD] font-bold">CIPHER-BOT v2.6</span>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-zinc-500">
              <span>OLED COMM</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#8855C7]" />
            </div>
          </div>

          {/* Upper Face Plate with Cute Glowing Eyes */}
          <div className="w-full h-14 bg-[#08080A] border border-[#282830] rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
            {/* Subtle Screen Reflection Glare */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {/* Glowing Eyes Pair */}
            <div className="flex items-center justify-center gap-8 relative z-10">
              {/* Left Eye */}
              <div
                className="w-5 h-5 rounded-full bg-[#B58AE8] border border-[#EDE1FF] shadow-[0_0_12px_#8855C7] relative flex items-center justify-center transition-all duration-150"
                style={{
                  transform: blink ? 'scaleY(0.1)' : `translate(${eyeShift.x}px, ${eyeShift.y}px)`,
                }}
              >
                {!blink && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-1" />
                )}
              </div>

              {/* Center cute forehead indicator */}
              <div className="w-1.5 h-1.5 rounded-full bg-[#8855C7] opacity-60" />

              {/* Right Eye */}
              <div
                className="w-5 h-5 rounded-full bg-[#B58AE8] border border-[#EDE1FF] shadow-[0_0_12px_#8855C7] relative flex items-center justify-center transition-all duration-150"
                style={{
                  transform: blink ? 'scaleY(0.1)' : `translate(${eyeShift.x}px, ${eyeShift.y}px)`,
                }}
              >
                {!blink && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-1" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ROBOT LOWER JAW: THE MECHANICAL OLED MOUTH DISPLAY */}
        {/* ========================================================================= */}
        <div className="px-3.5 pb-3.5 pt-1 relative z-10">
          {/* Mechanical Hinged Mouth Enclosure */}
          <div
            onClick={handleSkipTyping}
            className={`w-full transition-all duration-500 ease-out overflow-hidden relative ${
              isMouthOpen
                ? 'min-h-[220px] bg-[#06050C] border-2 border-[#8855C7] rounded-2xl shadow-[inset_0_0_20px_rgba(136,85,199,0.25)]'
                : 'h-6 bg-[#0E0D18] border border-[#8855C7]/40 rounded-xl flex items-center justify-center'
            }`}
          >
            {/* CLOSED MOUTH: Recessed dark slot with purple indicator bar */}
            {!isMouthOpen ? (
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#8855C7]" />
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#8855C7] to-transparent rounded-full" />
                <span className="w-1 h-1 rounded-full bg-[#8855C7]" />
              </div>
            ) : (
              /* OPEN MOUTH: Integrated OLED Digital Communication Screen */
              <div className="p-3 flex flex-col justify-between h-full space-y-2.5">
                {/* OLED Top Bar: Feature Title & Step */}
                <div className="flex items-start justify-between border-b border-[#2A2346] pb-2">
                  <div className="space-y-0.5 max-w-[240px]">
                    <span className="text-[9px] font-mono-code font-bold uppercase tracking-wider text-[#C4B5FD] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {step.section} · {currentStepIndex + 1}/{totalSteps}
                    </span>
                    <h4 className="text-xs font-mono-code font-bold text-white truncate">
                      {step.title}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onExit();
                    }}
                    title="Close guide"
                    className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* OLED Segment Navigation Tabs (Detail Mode) */}
                <div className="flex items-center gap-1 bg-[#0E0C1C] p-1 rounded-xl border border-[#231F3A]">
                  {[
                    { id: 'what', label: '1. What' },
                    { id: 'why', label: '2. Why' },
                    { id: 'how', label: '3. How To' },
                    { id: 'tip', label: '4. Tip' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSegment(tab.id as any);
                      }}
                      className={`flex-1 py-1 rounded-lg text-[9px] font-mono-code font-bold uppercase transition-all cursor-pointer ${
                        activeSegment === tab.id
                          ? 'bg-[#8855C7] text-white shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* OLED Body Display: Typewriter Text Area */}
                <div className="flex-1 bg-[#0A0914] border border-[#241F38] rounded-xl p-2.5 text-[11px] leading-relaxed font-mono-code text-zinc-200 min-h-[90px] max-h-[110px] overflow-y-auto relative cursor-pointer">
                  {/* CRT scanline overlay effect */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,38,0)_50%,rgba(0,0,0,0.5)_50%)]"
                    style={{ backgroundSize: '100% 4px' }}
                  />

                  <p className="relative z-10 break-words">
                    {displayedText}
                    {isTyping && (
                      <span className="inline-block w-1.5 h-3 bg-[#C4B5FD] ml-0.5 animate-pulse align-middle" />
                    )}
                  </p>
                </div>

                {/* OLED Lower Jaw Micro-Controls */}
                <div className="flex items-center justify-between pt-1 border-t border-[#231F3A]">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                      }}
                      disabled={currentStepIndex === 0}
                      className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-[#1B182E] hover:bg-[#282345] disabled:opacity-30 disabled:cursor-not-allowed text-[10px] font-mono-code font-bold text-zinc-300 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-3 h-3" />
                      <span>Prev</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePause();
                      }}
                      className="p-1 rounded-lg bg-[#1B182E] hover:bg-[#282345] text-[10px] font-mono-code text-zinc-300 transition-colors cursor-pointer"
                      title={isPaused ? 'Resume tour' : 'Pause tour'}
                    >
                      {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {step.demonstrationAction && onDemonstrate && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDemonstrate(step.demonstrationAction!);
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#EDE1FF]/20 hover:bg-[#EDE1FF]/30 border border-[#8855C7] text-[#EDE1FF] text-[10px] font-mono-code font-bold transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>Demo</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-[#8855C7] to-[#7C3AED] hover:from-[#7E4ABE] hover:to-[#6D28D9] text-white text-[10px] font-mono-code font-bold shadow-md shadow-[#8855C7]/30 transition-all active:scale-95 cursor-pointer"
                    >
                      <span>{currentStepIndex === totalSteps - 1 ? 'Finish' : 'Next'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
