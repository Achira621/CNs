import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  Zap,
  HelpCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
} from 'lucide-react';
import { CryptographyChallenge, ChallengeProgress } from '../types';

export const INITIAL_CHALLENGES: CryptographyChallenge[] = [
  {
    id: 'chall-1',
    title: 'The Roman Messenger (Caesar Cipher)',
    difficulty: 'beginner',
    category: 'classical',
    scenario:
      'A captured courier holds an urgent military command encrypted with an unknown shift key: "KHOOR ZRUOG". Decode the secret plaintext.',
    cipherTextOrData: 'KHOOR ZRUOG',
    expectedAnswer: 'HELLO WORLD',
    caseSensitive: false,
    hints: [
      'Julius Caesar traditionally used a fixed shift between 1 and 25.',
      'Check the difference between "K" and "H" in the alphabet: K (10) - H (7) = 3.',
      'Shift each letter backwards by 3 positions (or forwards by 23).',
    ],
    points: 100,
    algorithmId: 'caesar_default',
    explanation:
      'Because Caesar cipher has only 25 possible shift keys, brute-force search over all 25 shifts easily reveals "HELLO WORLD" at shift k = 3.',
  },
  {
    id: 'chall-2',
    title: 'The Affine Intercept (Modular Recovery)',
    difficulty: 'intermediate',
    category: 'modular',
    scenario:
      'An Affine cipher was used with key pair (a=5, b=8). An intercepted message reads: "RCLLA". What was the original plaintext?',
    cipherTextOrData: 'RCLLA',
    expectedAnswer: 'HELLO',
    caseSensitive: false,
    hints: [
      'To decrypt Affine cipher, you need the modular inverse of multiplier a = 5 modulo 26.',
      'Find a⁻¹: 5 · a⁻¹ ≡ 1 (mod 26). Since 5 · 21 = 105 = 4 · 26 + 1, a⁻¹ = 21.',
      'Apply formula P = 21 · (C - 8) mod 26 for each letter.',
    ],
    points: 200,
    algorithmId: 'affine',
    explanation:
      'Using the modular inverse 5⁻¹ mod 26 = 21, each letter is inverted via P = 21 · (C - 8) mod 26, successfully decrypting "RCLLA" to "HELLO".',
  },
  {
    id: 'chall-3',
    title: 'The Keyword of Vigenère',
    difficulty: 'intermediate',
    category: 'polyalphabetic',
    scenario:
      'You intercepted the ciphertext "LXFOPVEFRNHR" and obtained intelligence that the keyword used was "LEMON". Decrypt the tactical order.',
    cipherTextOrData: 'LXFOPVEFRNHR',
    expectedAnswer: 'ATTACKATDAWN',
    caseSensitive: false,
    hints: [
      'Align the keyword "LEMONLEMONLE" over the 12 letters of ciphertext.',
      'Subtract the key index from the cipher index modulo 26: P_i = (C_i - K_i + 26) mod 26.',
      'First letter: L (11) - L (11) = 0 = "A". Second letter: X (23) - E (4) = 19 = "T".',
    ],
    points: 250,
    algorithmId: 'vigenere',
    explanation:
      'Vigenère reverses easily when the keyword is known by calculating (C_i - K_i) mod 26, recovering "ATTACKATDAWN".',
  },
  {
    id: 'chall-4',
    title: 'RSA Trapdoor Factorization',
    difficulty: 'advanced',
    category: 'asymmetric',
    scenario:
      'An educational RSA system published public key (e = 17, n = 3233). You factor n into primes p = 61 and q = 53. What is the private decryption key d?',
    cipherTextOrData: 'n = 3233, e = 17, p = 61, q = 53',
    expectedAnswer: '2753',
    caseSensitive: false,
    hints: [
      'First compute Euler totient φ(n) = (p - 1) · (q - 1).',
      'φ(3233) = (61 - 1) · (53 - 1) = 60 · 52 = 3120.',
      'Compute modular inverse: d = 17⁻¹ mod 3120 using Extended Euclidean Algorithm.',
    ],
    points: 350,
    algorithmId: 'rsa',
    explanation:
      'Extended Euclidean Algorithm solves 17 · d + 3120 · y = 1, yielding d = 2753. This illustrates why RSA relies entirely on the intractability of factoring large moduli.',
  },
  {
    id: 'chall-5',
    title: 'Hash Collision & Digest Identification',
    difficulty: 'beginner',
    category: 'hashing',
    scenario:
      'What is the standard bit length of an SHA-256 cryptographic digest?',
    cipherTextOrData: 'Algorithm: SHA-256 (Secure Hash Algorithm 2)',
    expectedAnswer: '256',
    caseSensitive: false,
    hints: [
      'The number in the name SHA-256 represents its output size in bits.',
      'It outputs 32 bytes or 64 hexadecimal characters.',
      '32 bytes × 8 bits/byte = ?',
    ],
    points: 100,
    algorithmId: 'sha256',
    explanation:
      'SHA-256 produces a 256-bit (32-byte) digest, providing 2¹²⁸ security against collision attacks (Birthday Paradox).',
  },
];

export const ChallengeArena: React.FC = () => {
  const [selectedChallId, setSelectedChallId] = useState<string>('chall-1');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [hintLevel, setHintLevel] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [progress, setProgress] = useState<Record<string, ChallengeProgress>>({});

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cns_masterclass_challenges');
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveProgress = (updated: Record<string, ChallengeProgress>) => {
    setProgress(updated);
    try {
      localStorage.setItem('cns_masterclass_challenges', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const currentChall = INITIAL_CHALLENGES.find((c) => c.id === selectedChallId) || INITIAL_CHALLENGES[0];
  const challProgress = progress[currentChall.id];

  const totalPoints = (Object.values(progress) as ChallengeProgress[]).reduce(
    (acc, p) => acc + (p?.scoreEarned || 0),
    0
  );
  const solvedCount = (Object.values(progress) as ChallengeProgress[]).filter(
    (p) => p?.solved
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    const cleanUser = currentChall.caseSensitive
      ? userAnswer.trim()
      : userAnswer.trim().toUpperCase();
    const cleanExpected = currentChall.caseSensitive
      ? currentChall.expectedAnswer.trim()
      : currentChall.expectedAnswer.trim().toUpperCase();

    if (cleanUser === cleanExpected) {
      // Calculate score based on hints used (100% - 15% per hint)
      const penalty = hintLevel * 0.15;
      const earned = Math.round(currentChall.points * (1 - penalty));

      const updated = {
        ...progress,
        [currentChall.id]: {
          challengeId: currentChall.id,
          solved: true,
          attempts: (challProgress?.attempts || 0) + 1,
          hintsUsed: Math.max(hintLevel, challProgress?.hintsUsed || 0),
          scoreEarned: Math.max(earned, challProgress?.scoreEarned || 0),
          solvedAt: new Date().toISOString(),
        },
      };
      saveProgress(updated);
      setFeedback({
        isCorrect: true,
        message: `🎉 Correct Answer! You earned ${earned} points!`,
      });
    } else {
      const updated = {
        ...progress,
        [currentChall.id]: {
          challengeId: currentChall.id,
          solved: challProgress?.solved || false,
          attempts: (challProgress?.attempts || 0) + 1,
          hintsUsed: Math.max(hintLevel, challProgress?.hintsUsed || 0),
          scoreEarned: challProgress?.scoreEarned || 0,
        },
      };
      saveProgress(updated);
      setFeedback({
        isCorrect: false,
        message: 'Incorrect answer. Review the hints or try calculating the transformation again!',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
              Competitive Practical Testing
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Cryptography Challenge Arena
            </h3>
          </div>

          <div className="flex items-center gap-4 font-mono-code text-xs">
            <div className="bg-[#181824] border border-zinc-800 px-3.5 py-1.5 rounded-xl">
              <span className="text-zinc-400">Total Score:</span>{' '}
              <span className="text-amber-400 font-bold">{totalPoints} PTS</span>
            </div>
            <div className="bg-[#181824] border border-zinc-800 px-3.5 py-1.5 rounded-xl">
              <span className="text-zinc-400">Solved:</span>{' '}
              <span className="text-emerald-400 font-bold">
                {solvedCount} / {INITIAL_CHALLENGES.length}
              </span>
            </div>
          </div>
        </div>

        {/* Challenge Selection List */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 font-mono-code text-xs pt-1">
          {INITIAL_CHALLENGES.map((chall) => {
            const isSolved = progress[chall.id]?.solved;
            const isSelected = selectedChallId === chall.id;
            return (
              <button
                key={chall.id}
                onClick={() => {
                  setSelectedChallId(chall.id);
                  setUserAnswer('');
                  setHintLevel(0);
                  setFeedback(null);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#FF3E00] text-white border-[#FF3E00] shadow-md font-bold'
                    : isSolved
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-[#14141E] text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold opacity-75">{chall.category}</span>
                  {isSolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <div className="truncate font-semibold">{chall.title}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{chall.points} PTS</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Challenge Box */}
      <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6 font-mono-code text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-[#FF3E00]/15 text-[#FF3E00] border border-[#FF3E00]/30">
                {currentChall.difficulty}
              </span>
              <span className="text-zinc-500">|</span>
              <span className="text-zinc-400 text-[11px] uppercase">{currentChall.category}</span>
            </div>
            <h4 className="text-lg font-bold text-white font-sans">{currentChall.title}</h4>
          </div>

          <div className="text-right">
            <span className="text-amber-400 font-bold text-base">{currentChall.points} PTS</span>
          </div>
        </div>

        {/* Problem Statement & Evidence */}
        <div className="space-y-3">
          <p className="text-zinc-200 text-sm leading-relaxed font-sans">{currentChall.scenario}</p>
          <div className="p-4 bg-[#0E0E14] border border-zinc-800 rounded-xl space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold block">
              Intercepted Cryptographic Material:
            </span>
            <div className="text-emerald-400 font-bold text-sm sm:text-base break-all">
              {currentChall.cipherTextOrData}
            </div>
          </div>
        </div>

        {/* Hints Progression */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-[11px] font-bold uppercase flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Progressive Hint System (3 Levels)</span>
            </span>
            {hintLevel < 3 && (
              <button
                onClick={() => setHintLevel((prev) => Math.min(prev + 1, 3))}
                className="text-[11px] text-amber-400 hover:text-amber-300 underline"
              >
                Reveal Hint {hintLevel + 1} (-15% score)
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {currentChall.hints.map((hint, idx) => {
              if (idx >= hintLevel) return null;
              return (
                <div
                  key={idx}
                  className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs font-sans"
                >
                  <strong>Hint {idx + 1}:</strong> {hint}
                </div>
              );
            })}
          </div>
        </div>

        {/* Answer Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2 border-t border-zinc-800">
          <label className="text-zinc-400 block">Submit Plaintext / Recovered Secret</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your recovered plaintext or key here..."
              className="flex-1 bg-[#161622] border border-zinc-700 rounded-xl px-4 py-2.5 text-white outline-none focus:border-[#FF3E00]"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FF3E00] hover:bg-[#E03700] text-white font-bold rounded-xl shadow-md transition-colors"
            >
              Verify Solution
            </button>
          </div>
        </form>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              feedback.isCorrect
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/10 border-red-500/40 text-red-300'
            }`}
          >
            {feedback.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span className="font-semibold text-xs">{feedback.message}</span>
          </div>
        )}

        {/* Solution Explanation (Displayed once solved) */}
        {challProgress?.solved && (
          <div className="p-4 bg-[#14141E] border border-emerald-500/30 rounded-xl space-y-2">
            <span className="text-emerald-400 font-bold block text-xs uppercase">
              Cryptanalysis Solution Breakdown
            </span>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              {currentChall.explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
