import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
  Info,
  Maximize2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AlgorithmTrace, AlgorithmStep } from '../types';

interface InteractiveTracePlayerProps {
  trace: AlgorithmTrace;
  onAskAITutorAboutStep?: (step: AlgorithmStep, trace: AlgorithmTrace) => void;
}

export const InteractiveTracePlayer: React.FC<InteractiveTracePlayerProps> = ({
  trace,
  onAskAITutorAboutStep,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1); // 0.5x, 1x, 2x, 4x
  const [copied, setCopied] = useState(false);
  const [showFullTrace, setShowFullTrace] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSteps = trace.steps.length;

  // Reset to 0 when trace changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [trace.algorithmId, trace.operation, trace.input]);

  // Handle auto-advance when playing
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(300, 1500 / speed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, totalSteps]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const currentStep = trace.steps[currentStepIndex];

  const handleCopyStepOutput = () => {
    if (!currentStep) return;
    const val = typeof currentStep.output === 'object'
      ? JSON.stringify(currentStep.output, null, 2)
      : String(currentStep.output || '');
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!trace.steps || trace.steps.length === 0) {
    return (
      <div className="bg-[#101014] border border-[#262626] rounded-2xl p-6 text-center text-zinc-400 font-mono-code text-sm">
        No execution trace available for this algorithm state.
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D12] border border-[#262626] rounded-2xl shadow-xl overflow-hidden font-sans">
      {/* Player Header Banner */}
      <div className="bg-black/80 px-5 py-3.5 border-b border-[#262626] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF3E00] animate-pulse" />
          <h3 className="font-mono-code font-bold text-xs uppercase tracking-wider text-white">
            Execution Trace Laboratory
          </h3>
          <span className="text-zinc-600">|</span>
          <span className="text-[11px] font-mono-code text-zinc-400">
            {trace.algorithmName} ({trace.operation.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-code">
          <span className="text-zinc-400">Step</span>
          <span className="px-2 py-0.5 bg-[#1F1F28] border border-[#333344] text-[#FF3E00] font-bold rounded">
            {currentStepIndex + 1}
          </span>
          <span className="text-zinc-500">of {totalSteps}</span>
        </div>
      </div>

      {/* Step Scrubber Slider */}
      <div className="px-5 pt-4 pb-2 bg-[#121218]">
        <div className="relative w-full">
          <input
            type="range"
            min={0}
            max={totalSteps - 1}
            value={currentStepIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIndex(Number(e.target.value));
            }}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF3E00]"
          />
          <div className="flex justify-between text-[10px] font-mono-code text-zinc-500 mt-1">
            <span>Start</span>
            <span>Progress: {Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%</span>
            <span>Final</span>
          </div>
        </div>
      </div>

      {/* Active Step Visual Showcase Card */}
      {currentStep && (
        <div className="p-5 space-y-4">
          <div className="bg-[#181822] border border-[#2D2D3E] rounded-xl p-4.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono-code uppercase font-bold bg-[#FF3E00]/15 text-[#FF3E00] border border-[#FF3E00]/30 rounded">
                  {currentStep.operation}
                </span>
                <h4 className="text-white font-semibold text-sm sm:text-base">
                  {currentStep.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyStepOutput}
                  className="px-2.5 py-1 text-[11px] font-mono-code text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-md border border-zinc-700 flex items-center gap-1.5 transition-colors"
                  title="Copy intermediate output to clipboard"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                {onAskAITutorAboutStep && (
                  <button
                    onClick={() => onAskAITutorAboutStep(currentStep, trace)}
                    className="px-2.5 py-1 text-[11px] font-mono-code text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 rounded-md border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                    title="Ask AI Tutor for in-depth explanation of this step"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Explain with AI</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
              {currentStep.description}
            </p>

            {/* Mathematical Formula / Execution Logic */}
            {currentStep.mathematicalExplanation && (
              <div className="bg-[#0E0E14] border border-[#252536] rounded-lg p-3 font-mono-code text-xs text-amber-300 overflow-x-auto">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1 font-bold">
                  Mathematical Transformation
                </div>
                <div>{currentStep.mathematicalExplanation}</div>
              </div>
            )}

            {/* Input / Output Inspection Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-[#12121A] border border-zinc-800 rounded-lg p-2.5 font-mono-code text-xs">
                <span className="text-[10px] uppercase text-zinc-500 block mb-0.5">Input</span>
                <span className="text-zinc-200 break-all">
                  {typeof currentStep.input === 'object'
                    ? JSON.stringify(currentStep.input)
                    : String(currentStep.input ?? 'N/A')}
                </span>
              </div>
              <div className="bg-[#12121A] border border-zinc-800 rounded-lg p-2.5 font-mono-code text-xs">
                <span className="text-[10px] uppercase text-zinc-500 block mb-0.5">Output State</span>
                <span className="text-emerald-400 font-bold break-all">
                  {typeof currentStep.output === 'object'
                    ? JSON.stringify(currentStep.output)
                    : String(currentStep.output ?? 'N/A')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control Bar: Play / Pause / Step / Speed */}
      <div className="bg-[#0A0A0F] px-5 py-3.5 border-t border-[#262626] flex flex-wrap items-center justify-between gap-3">
        {/* Playback Navigation Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="p-2 text-zinc-400 hover:text-white bg-[#161622] hover:bg-zinc-700 rounded-lg border border-[#2E2E3E] transition-colors"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-2 text-zinc-400 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-400 bg-[#161622] hover:bg-zinc-700 rounded-lg border border-[#2E2E3E] transition-colors"
            title="Previous Step"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3.5 py-2 text-white font-mono-code text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-[#FF3E00] hover:bg-[#E03700] shadow-[#FF3E00]/30'
            }`}
            title={isPlaying ? 'Pause Auto-Play' : 'Play Step-by-Step Animation'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Play</span>
              </>
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 text-zinc-400 hover:text-white disabled:opacity-40 disabled:hover:text-zinc-400 bg-[#161622] hover:bg-zinc-700 rounded-lg border border-[#2E2E3E] transition-colors"
            title="Next Step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 font-mono-code text-xs">
          <span className="text-zinc-500 text-[11px] mr-1">Speed:</span>
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors ${
                speed === s
                  ? 'bg-[#FF3E00] text-white border-[#FF3E00]'
                  : 'bg-[#14141E] text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Full Trace Toggle */}
        <button
          onClick={() => setShowFullTrace(!showFullTrace)}
          className="text-xs font-mono-code text-zinc-400 hover:text-white flex items-center gap-1 py-1"
        >
          <span>{showFullTrace ? 'Hide All Steps' : 'View All Steps Table'}</span>
          {showFullTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Step Table View */}
      {showFullTrace && (
        <div className="border-t border-zinc-800 bg-[#0E0E14] p-4 max-h-72 overflow-y-auto font-mono-code text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-[10px] uppercase">
                <th className="py-1.5 px-2">#</th>
                <th className="py-1.5 px-2">Title</th>
                <th className="py-1.5 px-2">Input</th>
                <th className="py-1.5 px-2">Output</th>
                <th className="py-1.5 px-2">Formula / Description</th>
              </tr>
            </thead>
            <tbody>
              {trace.steps.map((st, i) => (
                <tr
                  key={st.id}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(i);
                  }}
                  className={`border-b border-zinc-900/60 cursor-pointer transition-colors ${
                    i === currentStepIndex
                      ? 'bg-[#FF3E00]/15 text-white font-bold'
                      : 'text-zinc-300 hover:bg-zinc-800/40'
                  }`}
                >
                  <td className="py-1.5 px-2 text-zinc-500">{i + 1}</td>
                  <td className="py-1.5 px-2">{st.title}</td>
                  <td className="py-1.5 px-2 text-zinc-400">
                    {typeof st.input === 'object' ? JSON.stringify(st.input) : String(st.input ?? '')}
                  </td>
                  <td className="py-1.5 px-2 text-emerald-400 font-bold">
                    {typeof st.output === 'object' ? JSON.stringify(st.output) : String(st.output ?? '')}
                  </td>
                  <td className="py-1.5 px-2 text-zinc-400 text-[11px] truncate max-w-xs">
                    {st.mathematicalExplanation || st.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
