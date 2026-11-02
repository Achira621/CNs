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
  Eye,
  Sliders,
} from 'lucide-react';
import { TourStep } from './TourRegistry';
import {
  TargetGeometry,
  calculateMascotPlacement,
  PlacementDirection,
} from './TourPositionController';

export type MascotSpeechState =
  | 'closed'
  | 'opening'
  | 'activating'
  | 'speaking'
  | 'closing';

interface TourMascotProps {
  targetGeometry: TargetGeometry | null;
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
  debugMode?: boolean;
  onToggleDebugMode?: () => void;
}

export const TourMascot: React.FC<TourMascotProps> = ({
  targetGeometry,
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
  debugMode = false,
  onToggleDebugMode,
}) => {
  const [speechState, setSpeechState] = useState<MascotSpeechState>('closed');
  const [activeSegment, setActiveSegment] = useState<'what' | 'why' | 'how' | 'tip'>('what');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [blink, setBlink] = useState(false);
  const [eyeShift, setEyeShift] = useState({ x: 0, y: 0 });

  const isMouthOpen = speechState !== 'closed';

  // Authoritative collision-aware placement calculation
  const placement = calculateMascotPlacement(
    targetGeometry,
    isMouthOpen,
    step.placement
  );

  // Blinking eye timer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 170);
    }, 3600);
    return () => clearInterval(blinkInterval);
  }, []);

  // Eye tracking: look towards target element center
  useEffect(() => {
    if (!targetGeometry) {
      setEyeShift({ x: 0, y: 0 });
      return;
    }
    const robotCenterX = placement.x + placement.width / 2;
    const robotCenterY = placement.y + 60; // approximate eye height
    const dx = targetGeometry.centerX - robotCenterX;
    const dy = targetGeometry.centerY - robotCenterY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    setEyeShift({
      x: Math.max(-6, Math.min(6, (dx / dist) * 6)),
      y: Math.max(-5, Math.min(5, (dy / dist) * 5)),
    });
  }, [targetGeometry, placement.x, placement.y, placement.width]);

  // Step transition sequence: close mouth -> move/land -> open -> activate -> speak
  useEffect(() => {
    if (!isActive || !step) return;

    setActiveSegment('what');

    // Reset to closed traveling state for quick transition
    setSpeechState('closed');

    // Flight arrival delay, then open mouth
    const openTimer = setTimeout(() => {
      setSpeechState('opening');
      const activateTimer = setTimeout(() => {
        setSpeechState('activating');
        const speakTimer = setTimeout(() => {
          setSpeechState('speaking');
        }, 220);
        return () => clearTimeout(speakTimer);
      }, 180);
      return () => clearTimeout(activateTimer);
    }, 380);

    return () => clearTimeout(openTimer);
  }, [step.id, currentStepIndex, isActive]);

  // Typewriter effect for speech display
  useEffect(() => {
    if (speechState !== 'speaking' && speechState !== 'activating') return;

    let fullText = step.whatItIs;
    if (activeSegment === 'why') fullText = step.whyItExists;
    else if (activeSegment === 'how') fullText = step.howToUse;
    else if (activeSegment === 'tip') fullText = step.quickTip;

    setIsTyping(true);
    setDisplayedText('');

    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx++;
      if (charIdx <= fullText.length) {
        setDisplayedText(fullText.slice(0, charIdx));
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 13);

    return () => clearInterval(interval);
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

  const handleNextStep = () => {
    // Initiate closing mouth before moving
    setSpeechState('closing');
    setTimeout(() => {
      onNext();
    }, 160);
  };

  const handlePrevStep = () => {
    setSpeechState('closing');
    setTimeout(() => {
      onPrev();
    }, 160);
  };

  if (!isActive) return null;

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. OPTIONAL DEVELOPMENT DEBUG MODE OVERLAYS */}
      {/* ========================================================================= */}
      {debugMode && (
        <div className="fixed inset-0 pointer-events-none z-[9998]">
          {/* Target Box Outline */}
          {targetGeometry && (
            <div
              className="absolute border-2 border-emerald-400 bg-emerald-400/10 rounded-xl"
              style={{
                left: `${targetGeometry.left}px`,
                top: `${targetGeometry.top}px`,
                width: `${targetGeometry.width}px`,
                height: `${targetGeometry.height}px`,
              }}
            >
              <span className="absolute -top-5 left-0 px-1.5 py-0.5 bg-emerald-500 text-black text-[9px] font-mono-code font-bold rounded">
                TARGET ({Math.round(targetGeometry.width)}x{Math.round(targetGeometry.height)})
              </span>
            </div>
          )}

          {/* Mascot Calculated Bounds */}
          <div
            className="absolute border-2 border-purple-400 border-dashed rounded-3xl"
            style={{
              left: `${placement.x}px`,
              top: `${placement.y}px`,
              width: `${placement.width}px`,
              height: `${placement.height}px`,
            }}
          >
            <span className="absolute -top-5 right-0 px-1.5 py-0.5 bg-purple-600 text-white text-[9px] font-mono-code font-bold rounded">
              POS: {placement.direction.toUpperCase()} | COLLISION:{' '}
              {placement.debugInfo.collisionDetected ? 'FAIL' : 'OK'}
            </span>
          </div>

          {/* Mini Debug Diagnostics HUD */}
          <div className="fixed bottom-3 right-3 bg-zinc-950/90 border border-zinc-700 text-zinc-300 p-3 rounded-2xl text-[10px] font-mono-code shadow-2xl pointer-events-auto space-y-1">
            <div className="flex items-center justify-between gap-4 font-bold text-[#C4B5FD] border-b border-zinc-800 pb-1">
              <span>TOUR POS CONTROLLER</span>
              <button
                onClick={onToggleDebugMode}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div>Viewport: {placement.debugInfo.viewportWidth} × {placement.debugInfo.viewportHeight}</div>
            <div>Placed: <span className="text-amber-400 font-bold">{placement.direction}</span></div>
            <div>Space R/L: {Math.round(placement.debugInfo.availableRight)} / {Math.round(placement.debugInfo.availableLeft)}</div>
            <div>Space B/T: {Math.round(placement.debugInfo.availableBottom)} / {Math.round(placement.debugInfo.availableTop)}</div>
            <div>Mascot: {Math.round(placement.width)} × {Math.round(placement.height)}</div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. THE UNIFIED ROAMING ROBOT & INTEGRATED OLED MOUTH DISPLAY */}
      {/* ========================================================================= */}
      <div
        className="fixed z-[9995] select-none will-change-transform"
        style={{
          transform: `translate3d(${placement.x}px, ${placement.y}px, 0)`,
          width: `${placement.width}px`,
          transition:
            'transform 0.45s cubic-bezier(0.2, 0.9, 0.3, 1), width 0.35s ease, height 0.35s ease',
        }}
      >
        {/* Pointer indicator towards active target */}
        {targetGeometry && (
          <div
            className={`absolute pointer-events-none transition-all duration-300 ${
              placement.direction === 'right'
                ? '-left-3 top-12 w-3 h-3 border-r-2 border-b-2 border-[#8855C7] -rotate-45'
                : placement.direction === 'left'
                ? '-right-3 top-12 w-3 h-3 border-l-2 border-t-2 border-[#8855C7] -rotate-45'
                : placement.direction === 'bottom'
                ? '-top-3 left-1/2 -translate-x-1/2 w-3 h-3 border-t-2 border-l-2 border-[#8855C7] rotate-45'
                : '-bottom-3 left-1/2 -translate-x-1/2 w-3 h-3 border-b-2 border-r-2 border-[#8855C7] rotate-45'
            }`}
          >
            <span className="block w-2 h-2 rounded-full bg-[#8855C7] blur-[1px] animate-ping" />
          </div>
        )}

        {/* Outer Vault Frame */}
        <div className="relative bg-[#12111A] border-2 border-[#8855C7] rounded-[28px] shadow-[0_20px_60px_rgba(136,85,199,0.35),0_0_20px_rgba(136,85,199,0.2)] overflow-hidden transition-all duration-300 pointer-events-auto">
          {/* Subtle Ambient Radial Aura */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#8855C7]/20 rounded-full blur-2xl pointer-events-none" />

          {/* Internal Bezel Accent Inset */}
          <div className="absolute inset-1.5 border border-white/10 rounded-[22px] pointer-events-none" />

          {/* ===================================================================== */}
          {/* ROBOT UPPER HEAD / FACE */}
          {/* ===================================================================== */}
          <div className="p-3 pb-1.5 relative z-10 flex flex-col items-center">
            {/* Top Status Bar with Pulse LED */}
            <div className="w-full flex items-center justify-between text-[9px] font-mono-code text-zinc-400 mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse" />
                <span className="text-[#C4B5FD] font-bold">CIPHER-BOT v2.6</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-zinc-500 font-mono-code">
                  {isMouthOpen ? 'OLED ACTIVE' : 'TRAVELING'}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isMouthOpen ? 'bg-emerald-400 animate-ping' : 'bg-[#8855C7]'
                  }`}
                />
              </div>
            </div>

            {/* Upper Face Plate with Expressive Glowing Eyes */}
            <div className="w-full h-13 bg-[#08080C] border border-[#28253B] rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
              {/* Glass Glare Highlight */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

              {/* Eyes Container */}
              <div className="flex items-center justify-center gap-8 relative z-10">
                {/* Left Eye */}
                <div
                  className="w-4.5 h-4.5 rounded-full bg-[#B58AE8] border border-[#EDE1FF] shadow-[0_0_12px_#8855C7] relative flex items-center justify-center transition-transform duration-100"
                  style={{
                    transform: blink
                      ? 'scaleY(0.1)'
                      : `translate(${eyeShift.x}px, ${eyeShift.y}px)`,
                  }}
                >
                  {!blink && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                  )}
                </div>

                {/* Forehead Micro Indicator */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#8855C7] opacity-60" />

                {/* Right Eye */}
                <div
                  className="w-4.5 h-4.5 rounded-full bg-[#B58AE8] border border-[#EDE1FF] shadow-[0_0_12px_#8855C7] relative flex items-center justify-center transition-transform duration-100"
                  style={{
                    transform: blink
                      ? 'scaleY(0.1)'
                      : `translate(${eyeShift.x}px, ${eyeShift.y}px)`,
                  }}
                >
                  {!blink && (
                    <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* ROBOT LOWER JAW: MECHANICAL OLED MOUTH DISPLAY SCREEN */}
          {/* ===================================================================== */}
          <div className="px-3 pb-3 pt-1 relative z-10">
            <div
              onClick={handleSkipTyping}
              className={`w-full transition-all duration-300 ease-out overflow-hidden relative ${
                isMouthOpen
                  ? 'min-h-[225px] max-h-[300px] bg-[#07060F] border border-[#8855C7]/70 rounded-2xl shadow-[inset_0_0_20px_rgba(136,85,199,0.3)]'
                  : 'h-6 bg-[#0E0D18] border border-[#8855C7]/40 rounded-xl flex items-center justify-center'
              }`}
            >
              {/* CLOSED MOUTH: Metallic slot with purple status slit */}
              {!isMouthOpen ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#8855C7]" />
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#8855C7] to-transparent rounded-full" />
                  <span className="w-1 h-1 rounded-full bg-[#8855C7]" />
                </div>
              ) : (
                /* OPEN MOUTH: Complete OLED Digital Speech Monitor */
                <div className="p-3 flex flex-col justify-between h-full space-y-2">
                  {/* OLED Top Bar: Feature Title & Step Progress */}
                  <div className="flex items-start justify-between border-b border-[#2A2346] pb-1.5">
                    <div className="space-y-0.5 max-w-[250px]">
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
                      title="Exit tour (Esc)"
                      className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* OLED Segment Navigation Tabs */}
                  <div className="flex items-center gap-1 bg-[#0D0B1C] p-1 rounded-xl border border-[#231F3A]">
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

                  {/* OLED Typewriter Display Screen */}
                  <div className="flex-1 bg-[#080712] border border-[#221D38] rounded-xl p-2.5 text-[11px] leading-relaxed font-mono-code text-zinc-200 min-h-[85px] max-h-[110px] overflow-y-auto relative cursor-pointer">
                    {/* CRT scanlines effect */}
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
                          handlePrevStep();
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
                          handleNextStep();
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
    </>
  );
};
