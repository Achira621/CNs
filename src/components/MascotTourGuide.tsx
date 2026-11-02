import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  Compass,
  Trophy,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { CyberMascotCanvas } from './CyberMascotCanvas';
import { NavItemKey } from './layout/AppSidebar';
import { CipherMethod } from '../types';

export interface TourStep {
  id: string;
  missionNumber: number;
  title: string;
  featureBadge: string;
  targetNav: NavItemKey;
  targetAlgorithm?: CipherMethod;
  botDialogue: string;
  highlights: string[];
  proTip: string;
  xpReward: number;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    missionNumber: 1,
    title: 'Mission 01: The Cosmic Command Center',
    featureBadge: 'DASHBOARD // VIT CYBER LAB',
    targetNav: 'dashboard',
    botDialogue:
      'Greetings, Agent! Welcome to the Classical & Modern Cryptography Masterclass. I am your automated Cyber Vault Guide! Look at this sleek White Canvas with high-contrast Dark Laboratory Boxes. This dashboard gives you instant access to 4 cipher categories, live learning progress, and modular math quick tools.',
    highlights: [
      'Top Hero with interactive floating cosmic planetary body',
      '4 Category Portals: Monoalphabetic, Polyalphabetic, Block Ciphers, and Modern Standards',
      'Continue Learning Tracker with live DES completion percentage',
      'Quick Tools for Mod 26, GCD, Matrix, and Frequency Analysis',
    ],
    proTip: 'Clicking any category card will instantly teleport you to its algorithms!',
    xpReward: 50,
  },
  {
    id: 'algorithms',
    missionNumber: 2,
    title: 'Mission 02: 21 Algorithm Library & Dedicated Workbenches',
    featureBadge: 'REPOSITORY // 21 CIPHERS',
    targetNav: 'algorithms',
    botDialogue:
      'Every single cryptographic algorithm now has its own dedicated page! We have 21 classical, modern, asymmetric, and hashing algorithms registered. Each page includes live sliders, key matrices, instant execution traces, and Viva Voce questions for VIT exams!',
    highlights: [
      'Comprehensive library filtering: Mono, Poly, Block, Modern, Asymmetric, Hashing',
      'Individual workbenches with mathematical formulas and security ratings',
      'Built-in step-by-step intermediate execution trace player for every cipher',
      'Vidyalankar Institute of Technology exam viva preparation questions and answers',
    ],
    proTip: 'Use the quick dropdown switcher at the top of any algorithm page to test another cipher instantly.',
    xpReward: 50,
  },
  {
    id: 'studio',
    missionNumber: 3,
    title: 'Mission 03: Cipher Studio & Execution Trace Lab',
    featureBadge: 'STUDIO // INTERACTIVE WORKBENCH',
    targetNav: 'studio',
    targetAlgorithm: 'affine',
    botDialogue:
      'Behold the Cipher Studio! Here you can experiment with Caesar, Multiplicative, Affine, Vigenère, Playfair, and Hill ciphers in real-time. Watch how each letter transforms, inspect coprime validations, and step through internal encryption rounds.',
    highlights: [
      'Interactive key sliders with automatic coprime gcd(a, 26) validation',
      'Live dynamic ciphertext generation with character frequency distribution',
      'Interactive Trace Player with play/pause, step-forward, and mathematical proofs',
      'Instant integration with the AI Tutor to explain specific transformation states',
    ],
    proTip: 'Try selecting the Affine cipher with a=5 and b=8 to see the linear mapping vector in action!',
    xpReward: 50,
  },
  {
    id: 'asymmetric',
    missionNumber: 4,
    title: 'Mission 04: Asymmetric & Hashing Laboratory',
    featureBadge: 'ADVANCED // RSA, DH, ECC, SHA-256',
    targetNav: 'studio',
    botDialogue:
      'Ready for modern public-key cryptography? This lab features educational RSA prime factorization, Diffie-Hellman key exchange simulation, Elliptic Curve scalar multiplication, and standard NIST SHA-256 hash compression rounds!',
    highlights: [
      'RSA Key Generation: Choose primes p & q, calculate totient φ(n), and test trapdoor decryption',
      'Diffie-Hellman Simulator: Watch Alice & Bob establish secrets with MitM eavesdropping alerts',
      'Elliptic Curve visualizer with point addition and scalar doubling',
      'SHA-256 & HMAC-SHA256 live hashing with 64-round step inspection',
    ],
    proTip: 'Change even 1 letter in the SHA-256 input to observe the dramatic 50% Avalanche Effect!',
    xpReward: 50,
  },
  {
    id: 'math',
    missionNumber: 5,
    title: 'Mission 05: Mathematical Foundations & Number Theory',
    featureBadge: 'MATH LAB // DISCRETE MATHEMATICS',
    targetNav: 'math',
    botDialogue:
      'Cryptography is applied number theory! The Math Visualizer lets you see modular arithmetic on a 26-hour clock dial, solve the Extended Euclidean Algorithm step-by-step for modular inverses, and verify 2x2 Hill matrix invertibility.',
    highlights: [
      'Interactive Modulo 26 Clock Geometry: Watch numbers wrap seamlessly around the circular dial',
      'Extended Euclidean Algorithm: Complete step-by-step tabular proof calculating modular inverses',
      'Matrix Invertibility Inspector: Computes determinant det(K) and highlights coprime validity',
      'Coprime Coprocessor: Visualizes greatest common divisors with Euclid’s method',
    ],
    proTip: 'If det(K) shares a common factor with 26, the Hill matrix cannot be inverted and decryption fails!',
    xpReward: 50,
  },
  {
    id: 'attack',
    missionNumber: 6,
    title: 'Mission 06: Cryptanalysis & Attack Simulation Lab',
    featureBadge: 'RED TEAM // BREAKING CIPHERS',
    targetNav: 'attack',
    botDialogue:
      'Time to think like a codebreaker! The Cryptanalysis Lab provides real tools to break classical ciphers without knowing the key. Perform frequency analysis, compute Chi-Squared statistical fit against English, run Kasiski examinations, and execute Meet-in-the-Middle attacks!',
    highlights: [
      'Letter Frequency Analysis with Chi-Squared statistical distance comparison',
      'Kasiski Examination: Finds repeating n-grams to deduce Vigenère keyword lengths',
      'Brute Force Exhaustion: Tests all 26 Caesar shifts or 312 Affine keys in milliseconds',
      'Double DES Meet-in-the-Middle Simulation: Demonstrates why 2DES security drops to 2^57',
    ],
    proTip: 'English plaintext has Chi-Squared scores close to zero; random ciphertexts score above 200!',
    xpReward: 50,
  },
  {
    id: 'lessons',
    missionNumber: 7,
    title: 'Mission 07: Masterclass Curriculum & Knowledge Graph',
    featureBadge: 'ACADEMIC // LESSONS & GRAPH',
    targetNav: 'lessons',
    botDialogue:
      'Need structured theory? The Masterclass Curriculum provides in-depth interactive lessons complete with LaTeX proofs and knowledge checks. You can also switch to the interactive SVG Knowledge Graph to visualize how all cryptographic concepts interconnect!',
    highlights: [
      'Curated lessons on Monoalphabetic, Polyalphabetic, Block Ciphers, and Asymmetric math',
      'Self-grading embedded quizzes with instant explanations and XP tracking',
      'Interactive Force-Directed Knowledge Graph linking ciphers, attacks, and primitives',
      'Direct one-click jumps from knowledge graph nodes straight into live workbenches',
    ],
    proTip: 'Click on any node in the Knowledge Graph to navigate immediately to that concept’s lab!',
    xpReward: 50,
  },
  {
    id: 'challenges',
    missionNumber: 8,
    title: 'Mission 08: Challenge Arena & Learning Analytics',
    featureBadge: 'GAMIFICATION // CTF ARENA & XP',
    targetNav: 'challenges',
    botDialogue:
      'Put your skills to the test in the Cryptography Challenge Arena! Solve 5 real CTF-style challenges, unlock 3-tier hints when you get stuck, and earn rank badges from Novice to Grand Cryptographer. Track your mastery radar on the Learning Dashboard!',
    highlights: [
      '5 Real Capture-the-Flag challenges: Caesar intercepted dispatches, Vigenère keys, and DES attacks',
      'Three-tier hint system: Conceptual nudge, Mathematical clue, and Near-Solution',
      'Interactive Learning Dashboard with radar chart tracking 5 cryptographic competencies',
      'Activity streaks, study time tracking, and achievement badges',
    ],
    proTip: 'Submitting correct flag answers without revealing hints yields maximum XP rewards!',
    xpReward: 50,
  },
  {
    id: 'practicals',
    missionNumber: 9,
    title: 'Mission 09: Guided CNS Practicals & Report Generator',
    featureBadge: 'VIT SYLLABUS // PRACTICAL LABS',
    targetNav: 'practicals',
    botDialogue:
      'Designed specifically for Vidyalankar Institute of Technology (VIT) students under Prof. Vinita Bhandiwad! Run practical assignments step-by-step, answer viva questions, verify calculations, and generate official printable laboratory reports with one click.',
    highlights: [
      'Official practical experiments aligned with the CNS university syllabus',
      'Step-by-step execution guides with input verification and mathematical proofs',
      'Viva Voce preparation questions tailored for external laboratory examinations',
      'Instant PDF / Printable laboratory report generator formatted with student details',
    ],
    proTip: 'Hit "Generate Lab Report" after completing calculations to download your assignment sheet!',
    xpReward: 50,
  },
  {
    id: 'scenarios',
    missionNumber: 10,
    title: 'Mission 10: Real-World Scenarios & Gemini AI Context Tutor',
    featureBadge: 'CYBER DEFENSE // ENTERPRISE & AI',
    targetNav: 'scenarios',
    botDialogue:
      'Congratulations on reaching the final mission! The Real-World Scenarios simulator lets you explore TLS 1.3 handshakes, ransomware payload encryption, and blockchain consensus. Plus, hit Ctrl+K anytime for the Global Omnibar, or click "Ask AI Tutor" for context-aware assistance!',
    highlights: [
      'Real-World Enterprise Scenarios: TLS Handshake, Ransomware Defense, and Blockchain Hashing',
      'Global Omnibar: Press Ctrl+K from anywhere to jump directly to any algorithm or tool',
      'Contextual Gemini AI Tutor: Inspects your exact inputs, keys, and errors to provide tailored guidance',
      'Cosmic Lab Design System: High-contrast dark workbenches on an atmospheric white canvas',
    ],
    proTip: 'You have completed all 10 missions and unlocked the "Certified Masterclass Explorer" honor!',
    xpReward: 100,
  },
];

interface MascotTourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (nav: NavItemKey, algorithm?: CipherMethod) => void;
}

export const MascotTourGuide: React.FC<MascotTourGuideProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoTimerSeconds, setAutoTimerSeconds] = useState(10);
  const [totalXp, setTotalXp] = useState(150);

  const currentStep = TOUR_STEPS[currentStepIndex];

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying || !isOpen) return;

    const interval = setInterval(() => {
      setAutoTimerSeconds((prev) => {
        if (prev <= 1) {
          handleNextStep();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentStepIndex, isOpen]);

  const handleNextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setAutoTimerSeconds(10);
      if (!visitedSteps.has(nextIdx)) {
        setVisitedSteps((prev) => new Set([...prev, nextIdx]));
        setTotalXp((prev) => prev + TOUR_STEPS[nextIdx].xpReward);
      }
      // Teleport user to that section
      onNavigate(TOUR_STEPS[nextIdx].targetNav, TOUR_STEPS[nextIdx].targetAlgorithm);
    } else {
      setIsAutoPlaying(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      setAutoTimerSeconds(10);
      onNavigate(TOUR_STEPS[prevIdx].targetNav, TOUR_STEPS[prevIdx].targetAlgorithm);
    }
  };

  const handleJumpToStep = (index: number) => {
    setCurrentStepIndex(index);
    setAutoTimerSeconds(10);
    if (!visitedSteps.has(index)) {
      setVisitedSteps((prev) => new Set([...prev, index]));
      setTotalXp((prev) => prev + TOUR_STEPS[index].xpReward);
    }
    onNavigate(TOUR_STEPS[index].targetNav, TOUR_STEPS[index].targetAlgorithm);
  };

  const handleTeleportNow = () => {
    onNavigate(currentStep.targetNav, currentStep.targetAlgorithm);
  };

  if (!isOpen) return null;

  // MINIMIZED COMPANION FLOATING BUBBLE (Bottom-Right)
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-bounce">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#13121F] border-2 border-[#8855C7] text-white shadow-2xl hover:scale-105 transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-[#201D35] border border-[#8855C7] flex items-center justify-center relative">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-pulse" />
            <span className="text-xl">🤖</span>
          </div>
          <div className="text-left">
            <p className="text-[11px] font-mono-code font-bold text-[#C4B5FD] uppercase">
              Cipher Bot Guide
            </p>
            <p className="text-xs font-semibold text-white">
              Mission {currentStepIndex + 1}/10 · Resume Tour
            </p>
          </div>
          <Maximize2 className="w-4 h-4 text-zinc-400 group-hover:text-white ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
      {/* Main Tour HUD Box (Black container box on white theme) */}
      <div className="relative w-full max-w-4xl bg-[#13121F] border-2 border-[#8855C7]/70 rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header HUD Bar */}
        <div className="px-6 py-4 border-b border-[#24223A] bg-[#0E0D17] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8855C7]/30 border border-[#8855C7] flex items-center justify-center text-lg shadow-sm">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code font-extrabold text-[#C4B5FD] tracking-wider uppercase">
                  CIPHER-BOT // INTERACTIVE EXPEDITION GUIDE
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] font-mono-code text-zinc-400">
                Vidyalankar Institute of Technology · Interactive Campus Walkthrough
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* XP Badge */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#201D35] border border-[#3E3466] text-xs font-mono-code">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-300 font-bold">{totalXp} XP</span>
              <span className="text-zinc-500">|</span>
              <span className="text-purple-300">Level {Math.floor(totalXp / 100) + 1}</span>
            </div>

            {/* Minimize button */}
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize to floating companion"
              className="p-1.5 rounded-lg bg-[#1C1A2E] hover:bg-[#282542] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              title="Close feature tour"
              className="p-1.5 rounded-lg bg-[#1C1A2E] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mission Stepper Breadcrumb Bar */}
        <div className="px-6 py-2.5 bg-[#171526] border-b border-[#24223A] flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0">
            {TOUR_STEPS.map((s, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isVisited = visitedSteps.has(idx);

              return (
                <button
                  key={s.id}
                  onClick={() => handleJumpToStep(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono-code font-bold flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-[#8855C7] text-white shadow-md shadow-[#8855C7]/50 scale-110'
                      : isVisited
                      ? 'bg-[#292543] text-purple-300 hover:bg-[#342F55]'
                      : 'bg-[#12111E] text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={s.title}
                >
                  {isVisited && !isCurrent ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    idx + 1
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Auto-Play Toggle */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono-code font-semibold transition-all cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                  : 'bg-[#201D35] hover:bg-[#2B2748] text-zinc-300 border border-[#3E3466]'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              <span>{isAutoPlaying ? `Auto (${autoTimerSeconds}s)` : 'Auto Tour'}</span>
            </button>
          </div>
        </div>

        {/* Main Body: 3D Robot Canvas on Left + Narrative Dialogue on Right */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Column: 3D Interactive Cyber Mascot Canvas */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-[#0C0B14] border border-[#232035] rounded-2xl p-4 relative overflow-hidden">
            {/* Ambient Purple Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#8855C7]/20 via-transparent to-transparent pointer-events-none" />

            <div className="w-full h-52 sm:h-64 relative flex items-center justify-center">
              <CyberMascotCanvas size="sm" scale={0.75} hideFloor={true} hideOverlays={true} />
            </div>

            <div className="mt-2 text-center">
              <span className="inline-block px-3 py-1 rounded-full bg-[#8855C7]/20 border border-[#8855C7]/30 text-[#C4B5FD] text-[11px] font-mono-code font-bold">
                CURSOR-TRACKING 3D BOT
              </span>
              <p className="text-[10px] font-mono-code text-zinc-500 mt-1">
                Move your cursor to watch the robot react!
              </p>
            </div>
          </div>

          {/* Right Column: Mission Briefing & Explanation */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#B58AE8]">
                  {currentStep.featureBadge}
                </span>
                <span className="text-xs font-mono-code text-zinc-400">
                  Step {currentStepIndex + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-serif-display font-bold text-white leading-tight">
                {currentStep.title}
              </h3>
            </div>

            {/* Speech Dialogue Box */}
            <div className="bg-[#171526] border border-[#2B2745] rounded-2xl p-4 space-y-2 relative">
              <div className="flex items-center gap-2 text-xs font-mono-code text-[#C4B5FD] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#8855C7] animate-ping" />
                <span>Mascot Transmission:</span>
              </div>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                "{currentStep.botDialogue}"
              </p>
            </div>

            {/* Highlights List */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono-code text-zinc-400 uppercase tracking-wider font-semibold block">
                Key Capabilities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentStep.highlights.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-[#0E0D17] border border-[#211E33] rounded-xl p-2.5 text-xs text-zinc-300"
                  >
                    <span className="text-[#8855C7] font-bold shrink-0">✦</span>
                    <span className="leading-snug">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 font-mono-code flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong className="text-amber-300">Pro Tip: </strong>
                {currentStep.proTip}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="px-6 py-4 border-t border-[#24223A] bg-[#0E0D17] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1C1A2E] hover:bg-[#282542] disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono-code font-semibold transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleTeleportNow}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#292444] hover:bg-[#38315D] border border-[#4B4075] text-[#EDE1FF] text-xs font-mono-code font-bold transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#B58AE8]" />
              <span>Take Me There Now</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono-code text-zinc-400 hidden sm:inline">
              Progress: {Math.round(((currentStepIndex + 1) / TOUR_STEPS.length) * 100)}%
            </span>

            {currentStepIndex < TOUR_STEPS.length - 1 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8855C7] to-[#7C3AED] hover:from-[#7B46BA] hover:to-[#6B21A8] text-white text-xs font-mono-code font-bold shadow-lg shadow-[#8855C7]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Next Mission</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono-code font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-yellow-300" />
                <span>Complete Tour!</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
