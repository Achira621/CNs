import React, { useState } from 'react';
import { MASTERCLASS_LESSONS } from '../data/lessonsData';
import { CipherMethod } from '../types';
import {
  validateKeyA,
  modInverse,
  encryptText,
  solveKnownPlaintext,
} from '../utils/affineMath';
import {
  processDesBlock,
  hexToBitString,
  bitStringToHex,
  twoDesEncryptHex,
  threeDesEncryptHex,
} from '../utils/desMath';
import {
  subBytes,
  shiftRows,
  bytesToState,
  stateToHex,
} from '../utils/aesMath';
import {
  GraduationCap,
  BookOpen,
  ShieldAlert,
  KeyRound,
  Unlock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface MasterclassLessonsTabProps {
  onOpenAITutorWithPrompt?: (prompt: string) => void;
  onSelectCipherMethod?: (method: CipherMethod) => void;
  onNavigateTab?: (tab: 'studio' | 'math' | 'attack' | 'lessons') => void;
}

export const MasterclassLessonsTab: React.FC<MasterclassLessonsTabProps> = ({
  onOpenAITutorWithPrompt,
  onSelectCipherMethod,
  onNavigateTab,
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>('intro');
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, number>>({});

  // Interactive Mini Widgets state
  const [widgetCoprimeA, setWidgetCoprimeA] = useState(5);
  const [widgetInverseA, setWidgetInverseA] = useState(7);
  const [widgetEncoderInput, setWidgetEncoderInput] = useState('CRYPTO');
  const [widgetEncoderA, setWidgetEncoderA] = useState(5);
  const [widgetEncoderB, setWidgetEncoderB] = useState(8);

  // Modern Cipher Widget States
  const [wDesP, setWDesP] = useState('0123456789ABCDEF');
  const [wDesKey, setWDesKey] = useState('133457799BBCDFF1');
  const [w2DesK1, setW2DesK1] = useState('0123456789ABCDEF');
  const [w2DesK2, setW2DesK2] = useState('FEDCBA9876543210');
  const [w3DesK1, setW3DesK1] = useState('133457799BBCDFF1');
  const [w3DesK2, setW3DesK2] = useState('133457799BBCDFF1');
  const [w3DesK3, setW3DesK3] = useState('133457799BBCDFF1');
  const [wAesHex, setWAesHex] = useState('00112233445566778899AABBCCDDEEFF');

  const activeLesson = MASTERCLASS_LESSONS.find((l) => l.id === activeLessonId) || MASTERCLASS_LESSONS[0];

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    setUserQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const getLessonIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4" />;
      case 'KeyRound':
        return <KeyRound className="w-4 h-4" />;
      case 'Unlock':
        return <Unlock className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Lesson Selector */}
      <div className="md:col-span-1 space-y-4">
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-4 shadow-xl">
          <h3 className="text-xs font-mono-code font-bold text-[#FF3E00] uppercase tracking-[0.15em] mb-3 px-1">
            CURRICULUM // MODULES
          </h3>

          <div className="space-y-2">
            {MASTERCLASS_LESSONS.map((lesson, idx) => {
              const isActive = lesson.id === activeLessonId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3.5 transition-all flex items-start gap-3 border rounded-2xl ${
                    isActive
                      ? 'bg-[#FF3E00] text-white border-[#FF3E00] shadow-md shadow-[#FF3E00]/20'
                      : 'bg-[#0A0A0A] text-zinc-300 hover:bg-[#1A1A1A] border-[#262626]'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${
                      isActive ? 'bg-black/20 text-white' : 'bg-[#181818] text-[#FF3E00]'
                    }`}
                  >
                    {getLessonIcon(lesson.iconName)}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono-code uppercase font-bold tracking-wider opacity-80">
                      LESSON 0{idx + 1}
                    </div>
                    <div className="text-xs font-semibold line-clamp-1 font-sans">
                      {lesson.title.replace(/^Lesson \d+: /, '')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Tutor Card */}
        {onOpenAITutorWithPrompt && (
          <div className="bg-[#141414] border border-[#262626] rounded-3xl p-5 text-xs space-y-3">
            <div className="flex items-center gap-2 text-[#FF3E00] font-mono-code font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>ACADEMIC TUTOR</span>
            </div>
            <p className="text-zinc-400 font-sans leading-relaxed">
              Ask Professor Modulo to elaborate on any cryptographic theorem or mathematical step!
            </p>
            <button
              onClick={() =>
                onOpenAITutorWithPrompt(
                  `I am currently studying '${activeLesson.title}'. Can you explain the main mathematical concept behind this in plain terms with a clear example?`
                )
              }
              className="w-full py-2.5 bg-[#FF3E00] hover:bg-[#E03700] text-white font-mono-code text-xs uppercase font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] shadow-md shadow-[#FF3E00]/20"
            >
              Ask AI Tutor
            </button>
          </div>
        )}
      </div>

      {/* Main Lesson Content & Interactive Quiz */}
      <div className="md:col-span-3 space-y-6">
        {/* Lesson Header */}
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-2">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF3E00] via-amber-400 to-[#FF3E00]" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-code uppercase tracking-[0.2em] font-bold text-[#FF3E00]">
              INTERACTIVE MASTERCLASS MODULE
            </span>
          </div>
          <h2 className="text-2xl font-serif-display font-semibold text-white">
            {activeLesson.title}
          </h2>
          <p className="text-xs text-zinc-400 font-sans">{activeLesson.subtitle}</p>
        </div>

        {/* Lesson Sections */}
        <div className="space-y-6">
          {activeLesson.sections.map((sec, sIdx) => (
            <div
              key={sIdx}
              className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl space-y-4"
            >
              <h3 className="text-base font-serif-display font-semibold text-white border-b border-[#262626] pb-3">
                {sec.heading}
              </h3>

              <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line space-y-3 font-sans">
                {sec.content}
              </div>

              {/* Interactive Widget Embeds */}
              {sec.interactiveWidget === 'coprime-checker' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code">
                  <h4 className="text-xs font-bold text-[#FF3E00] uppercase tracking-wider">
                    INTERACTIVE COPRIMALITY CHECKER
                  </h4>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-zinc-400">Test Key 'a':</label>
                    <input
                      type="number"
                      min="1"
                      max="25"
                      value={widgetCoprimeA}
                      onChange={(e) => setWidgetCoprimeA(Number(e.target.value))}
                      className="w-20 bg-[#141414] text-[#FF3E00] font-mono-code font-bold text-center p-2 border border-[#262626] rounded-xl"
                    />
                  </div>
                  {(() => {
                    const val = validateKeyA(widgetCoprimeA, 26);
                    return (
                      <div
                        className={`p-3 text-xs font-mono-code rounded-xl ${
                          val.isValid
                            ? 'bg-[#0A0A0A] text-emerald-400 border border-emerald-800'
                            : 'bg-[#0A0A0A] text-rose-400 border border-rose-800'
                        }`}
                      >
                        {val.explanation}
                      </div>
                    );
                  })()}
                </div>
              )}

              {sec.interactiveWidget === 'inverse-calculator' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    INTERACTIVE MODULAR INVERSE CALCULATOR
                  </h4>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-zinc-400">Key 'a':</label>
                    <input
                      type="number"
                      min="1"
                      max="25"
                      value={widgetInverseA}
                      onChange={(e) => setWidgetInverseA(Number(e.target.value))}
                      className="w-20 bg-[#141414] text-amber-400 font-mono-code font-bold text-center p-2 border border-[#262626] rounded-xl"
                    />
                  </div>
                  {(() => {
                    const inv = modInverse(widgetInverseA, 26);
                    return (
                      <div className="p-3 bg-[#141414] border border-[#262626] rounded-xl text-xs font-mono-code text-zinc-300">
                        {inv !== null ? (
                          <span>
                            a⁻¹ mod 26 = <strong className="text-emerald-400 font-bold">{inv}</strong> (since {widgetInverseA} × {inv} = {widgetInverseA * inv} ≡ 1 mod 26)
                          </span>
                        ) : (
                          <span className="text-rose-400">
                            No inverse exists for key a = {widgetInverseA} because gcd({widgetInverseA}, 26) ≠ 1.
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {sec.interactiveWidget === 'mini-encoder' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code">
                  <h4 className="text-xs font-bold text-[#FF3E00] uppercase tracking-wider">
                    MINI CIPHER TEST BOX
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={widgetEncoderInput}
                      onChange={(e) => setWidgetEncoderInput(e.target.value.toUpperCase())}
                      placeholder="PLAINTEXT..."
                      className="bg-[#141414] text-white font-mono-code text-xs p-2 border border-[#262626] rounded-xl"
                    />
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>a:</span>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={widgetEncoderA}
                        onChange={(e) => setWidgetEncoderA(Number(e.target.value))}
                        className="w-16 bg-[#141414] text-[#FF3E00] font-mono-code text-center p-1.5 border border-[#262626] rounded-xl"
                      />
                      <span>b:</span>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={widgetEncoderB}
                        onChange={(e) => setWidgetEncoderB(Number(e.target.value))}
                        className="w-16 bg-[#141414] text-amber-400 font-mono-code text-center p-1.5 border border-[#262626] rounded-xl"
                      />
                    </div>
                    <div className="p-2 bg-[#141414] border border-[#262626] rounded-xl font-mono-code text-xs text-[#FF3E00] font-bold flex items-center justify-center">
                      {encryptText(widgetEncoderInput, widgetEncoderA, widgetEncoderB, 26)}
                    </div>
                  </div>
                </div>
              )}

              {/* Modern Widget 1: DES Feistel Round 1 Inspector */}
              {sec.interactiveWidget === 'des-feistel' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code text-xs">
                  <h4 className="text-xs font-bold text-[#FF3E00] uppercase tracking-wider">
                    FEISTEL NETWORK ROUND 1 LIVE SPLIT (L₀, R₀ ➔ L₁, R₁)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-zinc-400 uppercase block mb-1">64-bit Plaintext (Hex):</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={wDesP}
                        onChange={(e) => setWDesP(e.target.value.toUpperCase())}
                        className="w-full bg-[#141414] border border-[#333] px-2.5 py-1.5 text-white rounded-xl focus:border-[#FF3E00] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-amber-400 uppercase block mb-1">64-bit Key (Hex):</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={wDesKey}
                        onChange={(e) => setWDesKey(e.target.value.toUpperCase())}
                        className="w-full bg-[#141414] border border-[#333] px-2.5 py-1.5 text-amber-400 rounded-xl focus:border-amber-400 outline-none"
                      />
                    </div>
                  </div>
                  {(() => {
                    const cleanP = wDesP.padEnd(16, '0').slice(0, 16);
                    const cleanK = wDesKey.padEnd(16, '0').slice(0, 16);
                    const pBits = hexToBitString(cleanP, 64);
                    const kBits = hexToBitString(cleanK, 64);
                    const desRes = processDesBlock(pBits, kBits, 'encrypt');
                    const r1 = desRes.rounds[0];
                    return (
                      <div className="p-3 bg-[#141414] border border-[#333] rounded-xl space-y-2">
                        <div className="flex justify-between text-zinc-300">
                          <span>Initial Permutation IP(P):</span>
                          <span className="text-white font-bold">{desRes.initialPermutationHex}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-zinc-400 pt-1 border-t border-[#262626]">
                          <div>L₀: <strong className="text-sky-400">{r1.leftHex}</strong></div>
                          <div>R₀: <strong className="text-amber-400">{r1.rightHex}</strong></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-zinc-400 pt-1 border-t border-[#262626]">
                          <div>L₁ = R₀: <strong className="text-amber-400">{r1.rightHex}</strong></div>
                          <div>R₁ = L₀ ⊕ F(R₀, K₁): <strong className="text-emerald-400">{r1.newRightHex}</strong></div>
                        </div>
                        <div className="text-[10px] text-zinc-500 pt-1 truncate">
                          Final 16-Round DES Ciphertext: <span className="text-[#FF3E00] font-bold">{desRes.ciphertextHex}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Modern Widget 2: 2DES Meet-in-the-Middle Visualizer */}
              {sec.interactiveWidget === '2des-mitm' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code text-xs">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    2DES CASCADING STAGE & MITM BRIDGE (C = E_K2(E_K1(P)))
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-amber-400 uppercase block mb-1">Key 1 (64-bit Hex):</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={w2DesK1}
                        onChange={(e) => setW2DesK1(e.target.value.toUpperCase())}
                        className="w-full bg-[#141414] border border-[#333] px-2.5 py-1.5 text-amber-400 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-sky-400 uppercase block mb-1">Key 2 (64-bit Hex):</label>
                      <input
                        type="text"
                        maxLength={16}
                        value={w2DesK2}
                        onChange={(e) => setW2DesK2(e.target.value.toUpperCase())}
                        className="w-full bg-[#141414] border border-[#333] px-2.5 py-1.5 text-sky-400 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                  {(() => {
                    const cleanP = '0123456789ABCDEF';
                    const res = twoDesEncryptHex(cleanP, w2DesK1.padEnd(16, '0').slice(0, 16), w2DesK2.padEnd(16, '0').slice(0, 16));
                    return (
                      <div className="p-3 bg-[#141414] border border-[#333] rounded-xl space-y-2">
                        <div className="flex justify-between text-zinc-300">
                          <span>Input P:</span>
                          <span className="text-white font-bold">{cleanP}</span>
                        </div>
                        <div className="flex justify-between text-amber-400">
                          <span>Stage 1: M = E_K1(P):</span>
                          <span className="font-bold">{res.intermediate}</span>
                        </div>
                        <div className="flex justify-between text-sky-400">
                          <span>Stage 2: C = E_K2(M):</span>
                          <span className="font-bold">{res.ciphertext}</span>
                        </div>
                        <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded text-[11px] text-rose-300 font-sans leading-relaxed">
                          MITM Vulnerability: Precomputing E_K1(P) in table and looking up D_K2(C) requires only <strong>2⁵⁷ operations</strong> (2 × 2⁵⁶) rather than 2¹¹²!
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Modern Widget 3: 3DES EDE Mode & Backward Compatibility */}
              {sec.interactiveWidget === '3des-ede' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      3DES EDE PIPELINE & BACKWARD COMPATIBILITY
                    </h4>
                    <button
                      onClick={() => {
                        setW3DesK2(w3DesK1);
                        setW3DesK3(w3DesK1);
                      }}
                      className="text-[10px] text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30 transition-colors"
                    >
                      Test K1=K2=K3
                    </button>
                  </div>
                  {(() => {
                    const cleanP = '0123456789ABCDEF';
                    const k1 = w3DesK1.padEnd(16, '0').slice(0, 16);
                    const k2 = w3DesK2.padEnd(16, '0').slice(0, 16);
                    const k3 = w3DesK3.padEnd(16, '0').slice(0, 16);
                    const res = threeDesEncryptHex(cleanP, k1, k2, k3);
                    const isCompat = k1 === k2;
                    return (
                      <div className="p-3 bg-[#141414] border border-[#333] rounded-xl space-y-2">
                        <div className="flex justify-between text-zinc-300">
                          <span>Stage 1 E_K1(P):</span>
                          <span className="text-amber-400 font-bold">{res.stage1}</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Stage 2 D_K2(Stage 1):</span>
                          <span className="text-sky-400 font-bold">{res.stage2}</span>
                        </div>
                        <div className="flex justify-between text-zinc-300">
                          <span>Stage 3 E_K3(Stage 2):</span>
                          <span className="text-emerald-400 font-bold">{res.ciphertext}</span>
                        </div>
                        <div className={`p-2 rounded text-[11px] font-sans leading-relaxed border ${
                          isCompat ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-[#181818] border-[#333] text-zinc-400'
                        }`}>
                          {isCompat ? (
                            <span>✓ <strong>Backward Compatibility Active:</strong> D_K2(E_K1(P)) = P because K1 = K2. The entire 3DES simplifies to single DES with K3!</span>
                          ) : (
                            <span>When K1 ≠ K2, 3DES provides full triple-stage Feistel security with 112-bit effective MITM resistance.</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Modern Widget 4: AES 4x4 State Matrix & SubBytes */}
              {sec.interactiveWidget === 'aes-state' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code text-xs">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    AES 4×4 STATE MATRIX: SUBBYTES & SHIFTROWS DEMO
                  </h4>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase block mb-1">16-Byte Input (32 Hex Digits):</label>
                    <input
                      type="text"
                      maxLength={32}
                      value={wAesHex}
                      onChange={(e) => setWAesHex(e.target.value.toUpperCase())}
                      className="w-full bg-[#141414] border border-[#333] px-2.5 py-1.5 text-cyan-300 rounded-xl outline-none"
                    />
                  </div>
                  {(() => {
                    const cleanHex = wAesHex.padEnd(32, '0').slice(0, 32);
                    const bytes: number[] = [];
                    for (let i = 0; i < 32; i += 2) {
                      bytes.push(parseInt(cleanHex.substring(i, i + 2), 16) || 0);
                    }
                    const state0 = bytesToState(bytes);
                    const stateSub = subBytes(state0);
                    const stateShift = shiftRows(stateSub);
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-[#141414] border border-[#333] rounded-xl space-y-2">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase block">1. Initial State</span>
                          <div className="grid grid-cols-4 gap-1 text-center font-bold text-[11px] text-white">
                            {state0.map((r, ri) =>
                              r.map((c, ci) => (
                                <div key={`${ri}-${ci}`} className="p-1 bg-[#0A0A0A] rounded">
                                  {c.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="p-3 bg-[#141414] border border-[#333] rounded-xl space-y-2">
                          <span className="text-[10px] text-cyan-400 font-bold uppercase block">2. SubBytes (S-Box)</span>
                          <div className="grid grid-cols-4 gap-1 text-center font-bold text-[11px] text-cyan-300">
                            {stateSub.map((r, ri) =>
                              r.map((c, ci) => (
                                <div key={`${ri}-${ci}`} className="p-1 bg-[#0A0A0A] rounded">
                                  {c.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div className="p-3 bg-[#141414] border border-[#333] rounded-xl space-y-2">
                          <span className="text-[10px] text-amber-400 font-bold uppercase block">3. ShiftRows</span>
                          <div className="grid grid-cols-4 gap-1 text-center font-bold text-[11px] text-amber-300">
                            {stateShift.map((r, ri) =>
                              r.map((c, ci) => (
                                <div key={`${ri}-${ci}`} className="p-1 bg-[#0A0A0A] rounded">
                                  {c.toString(16).padStart(2, '0').toUpperCase()}
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Knowledge Check Quiz */}
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <div>
              <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#FF3E00]" />
                KNOWLEDGE CHECK QUIZ
              </h3>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Verify your mathematical understanding of {activeLesson.title}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {activeLesson.quiz.map((q, qIdx) => {
              const selectedOpt = userQuizAnswers[q.id];
              const isSubmitted = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="p-5 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3"
                >
                  <h4 className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
                    QUESTION {qIdx + 1}: {q.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedOpt === oIdx;
                      let btnStyle = 'bg-[#141414] border-[#262626] text-zinc-300 hover:border-zinc-500';

                      if (isSubmitted) {
                        if (oIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(q.id, oIdx)}
                          className={`p-3 border rounded-xl text-xs text-left transition-all font-sans ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div
                      className={`p-3 text-xs flex items-start gap-2 font-mono-code rounded-xl ${
                        isCorrect
                          ? 'bg-[#0A0A0A] text-emerald-400 border border-emerald-800'
                          : 'bg-[#0A0A0A] text-rose-400 border border-rose-800'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="block font-bold uppercase">
                          {isCorrect ? 'Correct Solution' : 'Incorrect Solution'}
                        </strong>
                        <span className="font-sans text-zinc-300">{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

