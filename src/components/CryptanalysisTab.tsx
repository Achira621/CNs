import React, { useState, useMemo } from 'react';
import {
  calculateLetterFrequency,
  bruteForceDecrypt,
  solveKnownPlaintext,
  ENGLISH_FREQUENCIES,
  CIPHER_METHODS,
} from '../utils/affineMath';
import { ShieldCheck, Search, Key, Sparkles, Check, Zap, HelpCircle, Sliders } from 'lucide-react';
import { CipherMethod } from '../types';

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

        <div className="grid grid-cols-13 sm:grid-cols-26 gap-1 h-36 items-end pt-4 pb-2 border-b border-[#262626]">
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
  );
};

