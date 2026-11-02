import React, { useState, useMemo } from 'react';
import {
  Search,
  Key,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  BarChart3,
  HelpCircle,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { ENGLISH_FREQUENCIES } from '../utils/affineMath';
import { vigenereCipher } from '../utils/polyMath';

export const VigenereCryptanalysisLab: React.FC = () => {
  const [ciphertext, setCiphertext] = useState<string>(
    'LXFOPVEFRNHR LXFOPVEFRNHR LXFOPVEFRNHR'
  );
  const [testedKeyLength, setTestedKeyLength] = useState<number>(5);

  const cleanText = useMemo(() => {
    return ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  }, [ciphertext]);

  // 1. Index of Coincidence (IoC)
  const ioc = useMemo(() => {
    const N = cleanText.length;
    if (N <= 1) return 0;
    const counts: Record<string, number> = {};
    for (const ch of cleanText) {
      counts[ch] = (counts[ch] || 0) + 1;
    }
    let sum = 0;
    for (const ch in counts) {
      const c = counts[ch];
      sum += c * (c - 1);
    }
    return sum / (N * (N - 1));
  }, [cleanText]);

  // 2. Kasiski Examination for 3-grams
  const kasiskiData = useMemo(() => {
    const minLen = 3;
    const ngrams: Record<string, number[]> = {};
    for (let i = 0; i <= cleanText.length - minLen; i++) {
      const gram = cleanText.substring(i, i + minLen);
      if (!ngrams[gram]) ngrams[gram] = [];
      ngrams[gram].push(i);
    }

    const repeatingGrams: { gram: string; positions: number[]; distances: number[] }[] = [];
    for (const gram in ngrams) {
      const pos = ngrams[gram];
      if (pos.length > 1) {
        const dists: number[] = [];
        for (let j = 1; j < pos.length; j++) {
          dists.push(pos[j] - pos[j - 1]);
        }
        repeatingGrams.push({ gram, positions: pos, distances: dists });
      }
    }

    // Factor common distances
    const factorsCount: Record<number, number> = {};
    repeatingGrams.forEach((item) => {
      item.distances.forEach((d) => {
        for (let f = 2; f <= 15; f++) {
          if (d % f === 0) {
            factorsCount[f] = (factorsCount[f] || 0) + 1;
          }
        }
      });
    });

    const topFactors = Object.entries(factorsCount)
      .map(([factor, count]) => ({ factor: Number(factor), count }))
      .sort((a, b) => b.count - a.count);

    return { repeatingGrams, topFactors };
  }, [cleanText]);

  // 3. Best Candidate Keyword derivation for selected key length
  const candidateKeyword = useMemo(() => {
    if (testedKeyLength <= 0 || cleanText.length < testedKeyLength) return '';
    let keyword = '';

    for (let col = 0; col < testedKeyLength; col++) {
      // Extract sub-ciphertext for this key position
      const subChars: string[] = [];
      for (let i = col; i < cleanText.length; i += testedKeyLength) {
        subChars.push(cleanText[i]);
      }

      // Find shift (0-25) that minimizes Chi-Squared against English
      let bestShift = 0;
      let minChi = Infinity;

      for (let shift = 0; shift < 26; shift++) {
        const counts: Record<string, number> = {};
        subChars.forEach((ch) => {
          const decryptedIndex = (ch.charCodeAt(0) - 65 - shift + 26) % 26;
          const plainChar = String.fromCharCode(65 + decryptedIndex);
          counts[plainChar] = (counts[plainChar] || 0) + 1;
        });

        let chi = 0;
        for (let c = 0; c < 26; c++) {
          const letter = String.fromCharCode(65 + c);
          const observed = counts[letter] || 0;
          const expected = (ENGLISH_FREQUENCIES[letter] / 100) * subChars.length;
          chi += Math.pow(observed - expected, 2) / (expected || 1);
        }

        if (chi < minChi) {
          minChi = chi;
          bestShift = shift;
        }
      }

      keyword += String.fromCharCode(65 + bestShift);
    }

    return keyword;
  }, [cleanText, testedKeyLength]);

  // Decryption preview using derived keyword
  const decryptedPreview = useMemo(() => {
    if (!candidateKeyword) return '';
    return vigenereCipher(cleanText, candidateKeyword, 'decrypt').resultText;
  }, [cleanText, candidateKeyword]);

  return (
    <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6 font-mono-code text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] text-[#FF3E00] font-bold uppercase tracking-wider">
            Periodic Cryptanalysis & Kasiski Examination
          </span>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-[#FF3E00]" />
            Vigenère Cryptanalysis Laboratory
          </h4>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-zinc-400 block">Ciphertext to Analyze</label>
        <textarea
          rows={3}
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
          className="w-full bg-[#161622] border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-[#FF3E00]"
        />
      </div>

      {/* Metric Cards: IoC & Kasiski */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Index of Coincidence Card */}
        <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-amber-400 font-bold uppercase text-[11px]">
              Index of Coincidence (IoC)
            </span>
            <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300 font-bold">
              Ic = {ioc.toFixed(4)}
            </span>
          </div>
          <p className="text-zinc-300 font-sans text-xs leading-relaxed">
            Standard English: <strong>~0.0667</strong> | Uniform Random: <strong>~0.0385</strong>.
          </p>
          <div className="text-[11px] text-zinc-400 font-sans">
            {ioc > 0.058
              ? '✔ High IoC suggests a monoalphabetic cipher or short key length!'
              : '✔ Low IoC indicates a polyalphabetic cipher with key length > 3.'}
          </div>
        </div>

        {/* Kasiski Common Factors */}
        <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-2">
          <span className="text-emerald-400 font-bold uppercase text-[11px] block">
            Kasiski Repeating N-Grams & Factors
          </span>
          {kasiskiData.topFactors.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {kasiskiData.topFactors.slice(0, 5).map((f) => (
                <button
                  key={f.factor}
                  onClick={() => setTestedKeyLength(f.factor)}
                  className={`px-3 py-1 rounded-lg border font-bold transition-all ${
                    testedKeyLength === f.factor
                      ? 'bg-[#FF3E00] text-white border-[#FF3E00]'
                      : 'bg-[#0E0E14] text-zinc-300 border-zinc-700 hover:text-white'
                  }`}
                >
                  Length {f.factor} ({f.count} hits)
                </button>
              ))}
            </div>
          ) : (
            <div className="text-zinc-500 font-sans text-xs">
              No repeating 3-grams found. Try entering a longer sample text.
            </div>
          )}
        </div>
      </div>

      {/* Recovered Keyword & Decryption Output */}
      <div className="bg-[#161622] border border-emerald-500/30 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-2">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-bold text-sm">Automated Plaintext Recovery</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400">Key Length:</span>
            <input
              type="number"
              min={1}
              max={20}
              value={testedKeyLength}
              onChange={(e) => setTestedKeyLength(Number(e.target.value))}
              className="w-16 bg-[#0E0E14] border border-zinc-700 rounded p-1 text-center text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-[#0E0E14] rounded-xl border border-zinc-800 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold block">
              Estimated Keyword:
            </span>
            <span className="text-amber-400 font-bold text-base tracking-widest">
              {candidateKeyword || 'N/A'}
            </span>
          </div>

          <div className="p-3 bg-[#0E0E14] rounded-xl border border-zinc-800 space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold block">
              Recovered Plaintext:
            </span>
            <span className="text-emerald-400 font-bold text-sm break-all">
              {decryptedPreview || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
