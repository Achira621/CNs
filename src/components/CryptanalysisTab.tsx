import React, { useState, useMemo } from 'react';
import {
  calculateLetterFrequency,
  bruteForceDecrypt,
  solveKnownPlaintext,
  ENGLISH_FREQUENCIES,
  CIPHER_METHODS,
} from '../utils/affineMath';
import { ShieldCheck, Search, Key, Sparkles, Check, Zap, HelpCircle, Sliders, Binary, Activity, Target, Flame, Play } from 'lucide-react';
import { CipherMethod } from '../types';
import { simulateMeetInTheMiddle } from '../utils/desMath';
import { calculateAvalancheEffect } from '../utils/aesMath';

interface CryptanalysisTabProps {
  cipherMethod?: CipherMethod;
  onCipherMethodChange?: (method: CipherMethod) => void;
  inputText: string;
  setInputText: (text: string) => void;
  setKeyA: (a: number) => void;
  setKeyB: (b: number) => void;
  onOpenAITutorWithPrompt?: (prompt: string) => void;
}

export const CryptanalysisTab: React.FC<CryptanalysisTabProps> = ({
  cipherMethod = 'affine' as CipherMethod,
  onCipherMethodChange,
  inputText,
  setInputText,
  setKeyA,
  setKeyB,
  onOpenAITutorWithPrompt,
}) => {
  const [cipherInput, setCipherInput] = useState<string>(
    inputText || 'IOLT BWWXGU ROBUGT L BWWX'
  );

  // Known Plaintext Attack inputs
  const [kpP1, setKpP1] = useState('T');
  const [kpC1, setKpC1] = useState('X');
  const [kpP2, setKpP2] = useState('E');
  const [kpC2, setKpC2] = useState('Q');

  const [appliedKeyMsg, setAppliedKeyMsg] = useState<string | null>(null);

  // 2DES Meet-in-the-Middle State
  const [mitmPlaintext, setMitmPlaintext] = useState('ABCDEFGH');
  const [mitmK1Suffix, setMitmK1Suffix] = useState(0x4a);
  const [mitmK2Suffix, setMitmK2Suffix] = useState(0xb2);
  const [mitmSearchBits, setMitmSearchBits] = useState(8);
  const [mitmResult, setMitmResult] = useState(() =>
    simulateMeetInTheMiddle('ABCDEFGH', 0x4a, 0xb2, 8)
  );

  // AES Avalanche State
  const [avalanchePlaintext, setAvalanchePlaintext] = useState('CRYPTO_SECURITY');
  const [avalancheKey, setAvalancheKey] = useState('AESKEY128BITS123');
  const avalancheRes = useMemo(
    () => calculateAvalancheEffect(avalanchePlaintext, avalancheKey),
    [avalanchePlaintext, avalancheKey]
  );

  const runMitmSimulation = () => {
    const res = simulateMeetInTheMiddle(
      mitmPlaintext || 'ABCDEFGH',
      mitmK1Suffix,
      mitmK2Suffix,
      mitmSearchBits
    );
    setMitmResult(res);
  };

  // Frequency analysis calculation
  const freqData = useMemo(() => calculateLetterFrequency(cipherInput), [cipherInput]);

  // Brute force results filtered by current cipher method
  const bruteForceResults = useMemo(() => {
    if (!cipherInput.trim()) return [];
    return bruteForceDecrypt(cipherInput, 26, cipherMethod).slice(0, 15); // Top candidates
  }, [cipherInput, cipherMethod]);

  // Known plaintext calculation
  const knownPlaintextRes = useMemo(() => {
    return solveKnownPlaintext(kpP1, kpC1, kpP2, kpC2, 26);
  }, [kpP1, kpC1, kpP2, kpC2]);

  const handleApplyKey = (a: number, b: number) => {
    if (a === 1 && b === 3 && onCipherMethodChange) {
      onCipherMethodChange('caesar_default');
    } else if (a === 1 && onCipherMethodChange) {
      onCipherMethodChange('caesar_custom');
    } else if (b === 0 && onCipherMethodChange) {
      onCipherMethodChange('multiplicative');
    } else if (onCipherMethodChange) {
      onCipherMethodChange('affine');
    }
    setKeyA(a);
    setKeyB(b);
    setAppliedKeyMsg(`Applied Key pair: a = ${a}, b = ${b}`);
    setTimeout(() => setAppliedKeyMsg(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF3E00] via-amber-400 to-[#FF3E00]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#FF3E00] text-[10px] font-mono-code uppercase tracking-[0.2em] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MODULE // CRYPTANALYSIS & ATTACK LAB</span>
            </div>
            <h2 className="text-2xl font-serif-display font-semibold text-white mt-1">
              Cipher Breaking & Frequency Analysis
            </h2>
          </div>

          {appliedKeyMsg && (
            <div className="px-4 py-2 bg-[#FF3E00]/10 border border-[#FF3E00]/30 rounded-2xl text-[#FF3E00] text-xs font-mono-code font-bold uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4 text-[#FF3E00]" />
              {appliedKeyMsg}
            </div>
          )}
        </div>

        {/* Method Filter Toggle Bar */}
        {onCipherMethodChange && (
          <div className="mt-4 pt-3 border-t border-[#262626] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono-code uppercase text-zinc-500 shrink-0 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-[#FF3E00]" /> Attack Scope:
            </span>
            {(Object.keys(CIPHER_METHODS) as CipherMethod[]).map((mKey) => {
              const info = CIPHER_METHODS[mKey];
              const isSelected = cipherMethod === mKey;
              return (
                <button
                  key={mKey}
                  onClick={() => onCipherMethodChange(mKey)}
                  className={`px-3 py-1.5 text-xs font-mono-code font-bold rounded-xl whitespace-nowrap border transition-all ${
                    isSelected
                      ? 'bg-[#FF3E00] text-white border-[#FF3E00] shadow-md shadow-[#FF3E00]/20'
                      : 'bg-[#0A0A0A] text-zinc-400 border-[#262626] hover:text-white hover:border-zinc-500'
                  }`}
                >
                  {info.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Input Text box for Cryptanalysis */}
        <div className="mt-5 space-y-2">
          <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-zinc-300 flex items-center justify-between">
            <span>Target Ciphertext to Analyze</span>
            <button
              onClick={() => setCipherInput('IOLT BWWXGU ROBUGT L BWWX')}
              className="text-[#FF3E00] hover:underline text-xs normal-case font-semibold"
            >
              Load Sample Secret
            </button>
          </label>
          <textarea
            value={cipherInput}
            onChange={(e) => setCipherInput(e.target.value)}
            placeholder="ENTER CIPHERTEXT TO BREAK..."
            className="w-full h-24 bg-[#0A0A0A] font-mono-code text-sm text-[#FF3E00] p-4 border border-[#262626] focus:border-[#FF3E00] rounded-2xl outline-none resize-none transition-all"
          />
        </div>
      </div>

      {/* Grid: Brute Force Scanner & Known-Plaintext Solver */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 1: Brute-Force Scanner (Top Candidates) */}
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#FF3E00]" />
              <span>BRUTE FORCE SCANNER ({CIPHER_METHODS[cipherMethod].name.toUpperCase()})</span>
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono-code">
              {cipherMethod === 'caesar_default'
                ? '1 KEY'
                : cipherMethod === 'caesar_custom'
                ? '26 KEYS'
                : cipherMethod === 'multiplicative'
                ? '12 KEYS'
                : '312 KEYS'}
            </span>
          </div>

          <p className="text-xs text-zinc-400 font-sans">
            Scans valid key combinations for <strong>{CIPHER_METHODS[cipherMethod].name}</strong> in real time and ranks results using letter frequency analysis.
          </p>

          <div className="overflow-y-auto max-h-[360px] space-y-2.5 pr-1">
            {bruteForceResults.map((item, index) => (
              <div
                key={`${item.a}-${item.b}`}
                className={`p-4 border rounded-2xl transition-all ${
                  index === 0
                    ? 'bg-[#1C1C1C] border-[#FF3E00] shadow-md shadow-[#FF3E00]/10'
                    : 'bg-[#0A0A0A] border-[#262626] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-mono-code">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                        index === 0
                          ? 'bg-[#FF3E00] text-white'
                          : 'bg-[#222222] text-zinc-400'
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-white">
                      a = {item.a}, b = {item.b}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      (Score: {item.score})
                    </span>
                  </div>

                  <button
                    onClick={() => handleApplyKey(item.a, item.b)}
                    className="px-3.5 py-1.5 bg-[#FF3E00] hover:bg-[#E03700] text-white text-xs font-mono-code uppercase font-bold rounded-xl flex items-center gap-1 transition-all hover:scale-105"
                  >
                    <Key className="w-3 h-3" /> Apply
                  </button>
                </div>

                <div className="text-xs font-mono-code text-zinc-200 bg-[#0A0A0A] p-2.5 border border-[#262626] rounded-xl break-words">
                  {item.decryptedText}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Known-Plaintext Attack Solver */}
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="border-b border-[#262626] pb-3 mb-3">
              <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>KNOWN-PLAINTEXT ATTACK SOLVER</span>
              </h3>
            </div>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              When two corresponding letter pairs are known (e.g., <span className="font-mono-code text-[#FF3E00]">'T'➔'X'</span> and <span className="font-mono-code text-[#FF3E00]">'E'➔'Q'</span>), solve the modular linear equations directly without brute force search.
            </p>

            {/* Inputs for 2 Pairs */}
            <div className="grid grid-cols-2 gap-4 my-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl">
              {/* Pair 1 */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono-code font-bold text-[#FF3E00] uppercase">Pair 1</span>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1">
                    <label className="text-[9px] font-mono-code text-zinc-500 block uppercase">Plaintext 1</label>
                    <input
                      type="text"
                      maxLength={1}
                      value={kpP1}
                      onChange={(e) => setKpP1(e.target.value.toUpperCase())}
                      className="w-full bg-[#141414] text-white font-mono-code text-center font-bold p-2 border border-[#262626] focus:border-[#FF3E00] rounded-xl"
                    />
                  </div>
                  <span className="text-zinc-600 mt-3">➔</span>
                  <div className="flex-1">
                    <label className="text-[9px] font-mono-code text-zinc-500 block uppercase">Ciphertext 1</label>
                    <input
                      type="text"
                      maxLength={1}
                      value={kpC1}
                      onChange={(e) => setKpC1(e.target.value.toUpperCase())}
                      className="w-full bg-[#141414] text-[#FF3E00] font-mono-code text-center font-bold p-2 border border-[#262626] focus:border-[#FF3E00] rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Pair 2 */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono-code font-bold text-amber-400 uppercase">Pair 2</span>
                <div className="flex items-center gap-2 text-xs">
                  <div className="flex-1">
                    <label className="text-[9px] font-mono-code text-zinc-500 block uppercase">Plaintext 2</label>
                    <input
                      type="text"
                      maxLength={1}
                      value={kpP2}
                      onChange={(e) => setKpP2(e.target.value.toUpperCase())}
                      className="w-full bg-[#141414] text-white font-mono-code text-center font-bold p-2 border border-[#262626] focus:border-[#FF3E00] rounded-xl"
                    />
                  </div>
                  <span className="text-zinc-600 mt-3">➔</span>
                  <div className="flex-1">
                    <label className="text-[9px] font-mono-code text-zinc-500 block uppercase">Ciphertext 2</label>
                    <input
                      type="text"
                      maxLength={1}
                      value={kpC2}
                      onChange={(e) => setKpC2(e.target.value.toUpperCase())}
                      className="w-full bg-[#141414] text-[#FF3E00] font-mono-code text-center font-bold p-2 border border-[#262626] focus:border-[#FF3E00] rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Box */}
            <div
              className={`p-4 border rounded-2xl text-xs space-y-2 font-mono-code transition-all ${
                knownPlaintextRes.isValid
                  ? 'bg-[#0A0A0A] border-[#FF3E00] text-zinc-200 shadow-lg shadow-[#FF3E00]/10'
                  : 'bg-[#0A0A0A] border-[#262626] text-zinc-400'
              }`}
            >
              <h4 className="font-bold text-xs uppercase flex items-center justify-between text-white">
                <span>Solution Output</span>
                {knownPlaintextRes.isValid && (
                  <span className="text-[10px] px-2.5 py-0.5 bg-[#FF3E00] text-white font-mono-code font-bold rounded-full">
                    VALID SOLUTION
                  </span>
                )}
              </h4>

              <p className="font-sans text-xs text-zinc-300">{knownPlaintextRes.message}</p>

              {knownPlaintextRes.isValid && (
                <div className="pt-2 flex items-center justify-between border-t border-[#262626]">
                  <div className="text-xs">
                    Key Solution: <strong className="text-[#FF3E00]">a = {knownPlaintextRes.solvedA}</strong>,{' '}
                    <strong className="text-amber-400">b = {knownPlaintextRes.solvedB}</strong>
                  </div>

                  <button
                    onClick={() =>
                      handleApplyKey(
                        knownPlaintextRes.solvedA!,
                        knownPlaintextRes.solvedB!
                      )
                    }
                    className="px-3.5 py-1.5 bg-[#FF3E00] hover:bg-[#E03700] text-white font-bold text-xs uppercase rounded-xl transition-all hover:scale-105"
                  >
                    Apply Key
                  </button>
                </div>
              )}
            </div>
          </div>

          {onOpenAITutorWithPrompt && (
            <button
              onClick={() =>
                onOpenAITutorWithPrompt(
                  `Explain how to solve the linear system for Affine Cipher when given '${kpP1}'➔'${kpC1}' and '${kpP2}'➔'${kpC2}'. Show step-by-step modular algebra.`
                )
              }
              className="w-full py-2.5 px-3 bg-[#FF3E00] hover:bg-[#E03700] text-white text-xs font-mono-code uppercase tracking-wider font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-[#FF3E00]/20 hover:scale-[1.01]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              Ask AI Tutor to Explain Linear System Solution
            </button>
          )}
        </div>
      </div>

      {/* SECTION 3: Letter Frequency Distribution Bar Chart */}
      <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em]">
            CIPHERTEXT FREQUENCY ANALYSIS VS STANDARD ENGLISH
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono-code">
            <span className="flex items-center gap-1.5 text-[#FF3E00]">
              <span className="w-3 h-3 bg-[#FF3E00] inline-block" /> Ciphertext %
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <span className="w-3 h-3 bg-[#333333] inline-block" /> Standard English %
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div
            className="grid gap-1 h-36 items-end pt-4 pb-2 border-b border-[#262626] min-w-[500px]"
            style={{ gridTemplateColumns: 'repeat(26, minmax(0, 1fr))' }}
          >
            {freqData.map((item) => (
              <div key={item.letter} className="flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-[#0A0A0A] border border-[#333] px-2 py-1 text-[10px] font-mono-code whitespace-nowrap z-10 transition-opacity pointer-events-none text-white">
                  {item.letter}: {item.percentage}% (English: {item.englishPercentage}%)
                </div>

                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  {/* Ciphertext Bar */}
                  <div
                    style={{ height: `${Math.min(100, item.percentage * 6)}%` }}
                    className="w-1.5 bg-[#FF3E00] transition-all group-hover:bg-[#FF602E]"
                  />
                  {/* Standard English Bar */}
                  <div
                    style={{ height: `${Math.min(100, item.englishPercentage * 6)}%` }}
                    className="w-1.5 bg-[#333333] transition-all group-hover:bg-[#555555]"
                  />
                </div>

                <span className="text-[10px] font-mono-code text-zinc-400 mt-1 font-bold">
                  {item.letter}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: 2DES Meet-in-the-Middle (MITM) Attack Simulator */}
      <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#262626] pb-3 gap-2">
          <div>
            <h3 className="text-xs font-mono-code font-bold text-amber-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-400" />
              <span>2DES MEET-IN-THE-MIDDLE (MITM) ATTACK ENGINE</span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              Diffie & Hellman's time-space trade-off reducing 2DES complexity from <span className="text-rose-400 font-mono-code">2¹¹²</span> down to <span className="text-amber-400 font-mono-code">2⁵⁷</span> operations.
            </p>
          </div>
          <button
            onClick={runMitmSimulation}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono-code font-bold uppercase rounded-xl flex items-center gap-2 transition-all self-start sm:self-auto"
          >
            <Play className="w-3.5 h-3.5 fill-black" /> Run MITM Collision Search
          </button>
        </div>

        {/* MITM Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl font-mono-code text-xs">
          <div>
            <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Plaintext Block (P):</label>
            <input
              type="text"
              maxLength={8}
              value={mitmPlaintext}
              onChange={(e) => setMitmPlaintext(e.target.value.toUpperCase())}
              className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-white rounded-xl focus:border-amber-400 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-amber-400 uppercase font-bold block mb-1">Secret K1 Suffix (Hex):</label>
            <input
              type="text"
              value={mitmK1Suffix.toString(16).toUpperCase()}
              onChange={(e) => setMitmK1Suffix(parseInt(e.target.value || '0', 16) & 0xff)}
              className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-amber-400 rounded-xl focus:border-amber-400 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-sky-400 uppercase font-bold block mb-1">Secret K2 Suffix (Hex):</label>
            <input
              type="text"
              value={mitmK2Suffix.toString(16).toUpperCase()}
              onChange={(e) => setMitmK2Suffix(parseInt(e.target.value || '0', 16) & 0xff)}
              className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-sky-400 rounded-xl focus:border-sky-400 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Key Search Bits:</label>
            <select
              value={mitmSearchBits}
              onChange={(e) => setMitmSearchBits(Number(e.target.value))}
              className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-white rounded-xl focus:border-amber-400 outline-none"
            >
              <option value={8}>8-bit Space (256 candidate keys)</option>
              <option value={10}>10-bit Space (1024 candidate keys)</option>
            </select>
          </div>
        </div>

        {/* MITM Results Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl font-mono-code text-xs space-y-3">
            <span className="text-amber-400 font-bold uppercase block">Attack Statistics & Proof</span>
            <div className="space-y-1.5 text-zinc-300">
              <div className="flex justify-between">
                <span>Known Plaintext (Hex):</span>
                <span className="text-white">{mitmResult.knownPlaintextHex}</span>
              </div>
              <div className="flex justify-between">
                <span>Known Ciphertext (Hex):</span>
                <span className="text-white">{mitmResult.knownCiphertextHex}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Precomputed Forward States:</span>
                <span className="font-bold">{mitmResult.spaceSize}</span>
              </div>
              <div className="flex justify-between text-sky-400">
                <span>Backward Lookups Tested:</span>
                <span className="font-bold">{mitmResult.stepsSearched}</span>
              </div>
              <div className="flex justify-between text-emerald-400 pt-2 border-t border-[#262626]">
                <span>Total MITM Operations:</span>
                <span className="font-bold">{mitmResult.spaceSize + mitmResult.stepsSearched}</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Equivalent Brute Force Steps:</span>
                <span className="font-bold">{mitmResult.spaceSize * mitmResult.spaceSize}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl font-mono-code text-xs space-y-3">
            <span className="text-emerald-400 font-bold uppercase block">
              Recovered Key Pairs ({mitmResult.tableMatches.length} Matches Found)
            </span>
            <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
              {mitmResult.tableMatches.map((m, idx) => (
                <div key={idx} className="p-2.5 bg-[#141414] border border-[#333] rounded-xl space-y-1">
                  <div className="flex justify-between text-amber-300">
                    <span>K1: {m.key1}</span>
                    <span className="text-zinc-500">#{idx + 1}</span>
                  </div>
                  <div className="flex justify-between text-sky-300">
                    <span>K2: {m.key2}</span>
                    <span className="text-emerald-400 font-bold">MATCH</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    Collision M: {m.intermediateHex}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-zinc-300">
          <p className="font-sans leading-relaxed text-[11px] text-zinc-400">
            {mitmResult.explanation} For full 56-bit DES keys, brute force takes <strong className="text-white">2¹¹² operations</strong> (astronomical), but MITM solves it in <strong className="text-amber-400">2 × 2⁵⁶ = 2⁵⁷ operations</strong> with 2⁵⁶ table storage!
          </p>
        </div>
      </div>

      {/* SECTION 5: AES Strict Avalanche Criterion (SAC) & Round Diffusion Analyzer */}
      <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#262626] pb-3 gap-2">
          <div>
            <h3 className="text-xs font-mono-code font-bold text-cyan-400 uppercase tracking-[0.15em] flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>AES STRICT AVALANCHE CRITERION (SAC) DIFFUSION LAB</span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              Measures how a single bit alteration in input propagates across all 128 state bits across AES rounds.
            </p>
          </div>
          <span className="text-[10px] font-mono-code px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full font-bold">
            Target SAC: ~50% (64 / 128 Bits)
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl font-mono-code text-xs">
          <div>
            <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Plaintext Block (P):</label>
            <input
              type="text"
              value={avalanchePlaintext}
              onChange={(e) => setAvalanchePlaintext(e.target.value)}
              className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-white rounded-xl focus:border-cyan-400 outline-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-cyan-400 uppercase font-bold block mb-1">AES Key (128-bit):</label>
            <input
              type="text"
              value={avalancheKey}
              onChange={(e) => setAvalancheKey(e.target.value)}
              className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-cyan-400 rounded-xl focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        {/* Round by Round Diffusion Chart */}
        <div className="space-y-3 font-mono-code text-xs">
          <div className="grid grid-cols-10 gap-2 items-end h-40 pt-4 pb-2 border-b border-[#262626]">
            {avalancheRes.roundStats.map((st) => (
              <div key={st.round} className="flex flex-col items-center h-full justify-end group relative">
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-[#0A0A0A] border border-[#333] px-2 py-1 text-[10px] font-mono-code whitespace-nowrap z-10 transition-opacity pointer-events-none text-white">
                  Round {st.round}: {st.flippedBits} bits ({st.percentage}%)
                </div>
                <div
                  style={{ height: `${st.percentage}%` }}
                  className={`w-full rounded-t transition-all ${
                    st.percentage >= 45 && st.percentage <= 55
                      ? 'bg-cyan-400 group-hover:bg-cyan-300'
                      : 'bg-indigo-500 group-hover:bg-indigo-400'
                  }`}
                />
                <span className="text-[10px] text-zinc-400 mt-1 font-bold">R{st.round}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Round 1 (Initial SubBytes + ShiftRows)</span>
            <span className="text-cyan-400 font-bold">50% SAC Golden Standard</span>
            <span>Round 10 (Full Ciphertext Output)</span>
          </div>
        </div>

        {/* Sweet32 & Avalanche Educational Note */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-xs space-y-1 font-sans">
            <strong className="text-cyan-400 font-mono-code block">AES Avalanche Guarantee:</strong>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              {avalancheRes.overallSummary} Because MixColumns provides maximum branch number 5 across columns, 1 bit changes spread to all 16 bytes in just two rounds.
            </p>
          </div>

          <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-xs space-y-1 font-sans">
            <strong className="text-rose-400 font-mono-code block">Sweet32 Collision Attack (3DES Limitation):</strong>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              3DES uses 64-bit blocks. By the Birthday Paradox, identical ciphertext blocks collide after encrypting only 2³² blocks (~32 GB or 4 GB in HTTPS sessions), leaking plaintext cookies. AES uses <strong>128-bit blocks</strong>, making collision attacks mathematically impossible (requiring 2⁶⁴ blocks = billions of terabytes).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

