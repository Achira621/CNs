import React, { useState } from 'react';
import {
  TwoDesResult,
  ThreeDesResult,
  DesBlockResult,
  processDesBlock,
  stringToBitString,
  hexToBitString,
} from '../utils/desMath';
import {
  ShieldAlert,
  GitFork,
  Layers,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface TwoDesThreeDesStudioProps {
  method: 'des' | '2des' | '3des';
  twoDesResult?: TwoDesResult | null;
  threeDesResult?: ThreeDesResult | null;
  singleDesResult?: DesBlockResult | null;
  key1: string;
  setKey1: (val: string) => void;
  key2: string;
  setKey2: (val: string) => void;
  key3: string;
  setKey3: (val: string) => void;
  mode: 'encrypt' | 'decrypt';
  onSetCompatibleKeys?: () => void;
}

export const TwoDesThreeDesStudio: React.FC<TwoDesThreeDesStudioProps> = ({
  method,
  twoDesResult,
  threeDesResult,
  singleDesResult,
  key1,
  setKey1,
  key2,
  setKey2,
  key3,
  setKey3,
  mode,
  onSetCompatibleKeys,
}) => {
  const [selectedBlockIdx, setSelectedBlockIdx] = useState(0);
  const [selectedStage, setSelectedStage] = useState<1 | 2 | 3>(1);
  const [expandedRounds, setExpandedRounds] = useState(false);

  const currentTwoDesBlock = twoDesResult?.blocks[selectedBlockIdx] || twoDesResult?.blocks[0];
  const currentThreeDesBlock = threeDesResult?.blocks[selectedBlockIdx] || threeDesResult?.blocks[0];

  const roundsToShow =
    method === 'des'
      ? singleDesResult?.rounds || []
      : method === '2des'
      ? selectedStage === 1
        ? currentTwoDesBlock?.stage1.rounds || []
        : currentTwoDesBlock?.stage2.rounds || []
      : selectedStage === 1
      ? currentThreeDesBlock?.stage1.rounds || []
      : selectedStage === 2
      ? currentThreeDesBlock?.stage2.rounds || []
      : currentThreeDesBlock?.stage3.rounds || [];

  return (
    <div className="space-y-6">
      {/* Parameter Controls Panel */}
      <div className="bg-[#0A0A0A] p-5 border border-amber-500/40 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#262626] pb-3">
          <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-amber-400 flex items-center gap-2">
            {method === 'des' ? (
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            ) : method === '2des' ? (
              <GitFork className="w-4 h-4 text-orange-400" />
            ) : (
              <Layers className="w-4 h-4 text-cyan-400" />
            )}
            <span>
              {method === 'des' && 'DES Parameters (64-bit Block / 56-bit Key)'}
              {method === '2des' && 'Double DES (2DES) Key Pipeline (112-bit Combined Key)'}
              {method === '3des' && 'Triple DES (3DES) EDE Parameters (Keying Options: 112 / 168-bit)'}
            </span>
          </label>

          {method === '3des' && (
            <button
              onClick={onSetCompatibleKeys}
              className="text-[11px] font-mono-code font-bold px-3 py-1 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto"
              title="Set K1 = K2 = K3 to demonstrate backward compatibility with single DES"
            >
              <RefreshCw className="w-3 h-3 text-cyan-400" />
              <span>Test Single DES Compatibility (K1 = K2 = K3)</span>
            </button>
          )}
        </div>

        {/* Key Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-[10px] font-mono-code text-zinc-400 uppercase font-bold block mb-1">
              Secret Key 1 (K₁) [64-bit / 16 Hex chars]
            </label>
            <input
              type="text"
              maxLength={16}
              value={key1}
              onChange={(e) => setKey1(e.target.value.toUpperCase())}
              placeholder="0123456789ABCDEF"
              className="w-full bg-[#141414] text-white font-mono-code text-xs px-3 py-2 border border-[#333] focus:border-amber-500 rounded-xl outline-none tracking-wider font-bold uppercase"
            />
          </div>

          {(method === '2des' || method === '3des') && (
            <div>
              <label className="text-[10px] font-mono-code text-orange-400 uppercase font-bold block mb-1">
                Secret Key 2 (K₂) [64-bit / 16 Hex chars]
              </label>
              <input
                type="text"
                maxLength={16}
                value={key2}
                onChange={(e) => setKey2(e.target.value.toUpperCase())}
                placeholder="FEDCBA9876543210"
                className="w-full bg-[#141414] text-orange-300 font-mono-code text-xs px-3 py-2 border border-[#333] focus:border-orange-500 rounded-xl outline-none tracking-wider font-bold uppercase"
              />
            </div>
          )}

          {method === '3des' && (
            <div>
              <label className="text-[10px] font-mono-code text-cyan-400 uppercase font-bold block mb-1">
                Secret Key 3 (K₃) [64-bit / 16 Hex chars]
              </label>
              <input
                type="text"
                maxLength={16}
                value={key3}
                onChange={(e) => setKey3(e.target.value.toUpperCase())}
                placeholder="0123456789ABCDEF"
                className="w-full bg-[#141414] text-cyan-300 font-mono-code text-xs px-3 py-2 border border-[#333] focus:border-cyan-500 rounded-xl outline-none tracking-wider font-bold uppercase"
              />
            </div>
          )}
        </div>

        {/* Educational Explanations */}
        <div className="text-xs text-zinc-300 font-sans leading-relaxed pt-2">
          {method === 'des' && (
            <p>
              Standard <strong>DES</strong> takes an 8-byte (64-bit) plaintext block, performs Initial Permutation (IP), passes data through <strong>16 Feistel rounds</strong> with 48-bit subkeys generated from the 56-bit key schedule, and finishes with Final Permutation (FP).
            </p>
          )}
          {method === '2des' && (
            <p>
              <strong>2DES</strong> runs two full DES passes: <span className="font-mono-code text-amber-300 font-bold">C = E_K2(E_K1(P))</span>. An intermediate 64-bit state <span className="font-mono-code text-orange-400 font-bold">M = E_K1(P)</span> is formed after Stage 1, which is then fed into Stage 2.
            </p>
          )}
          {method === '3des' && (
            <p>
              <strong>3DES</strong> operates in <strong>EDE mode (Encrypt-Decrypt-Encrypt)</strong>: <span className="font-mono-code text-cyan-300 font-bold">C = E_K3(D_K2(E_K1(P)))</span>. Stage 2 intentionally decrypts with K₂ so that when <span className="font-mono-code text-amber-300">K₁ = K₂ = K₃</span>, decryption in Stage 2 cancels encryption in Stage 1, cleanly reproducing standard Single DES!
            </p>
          )}
        </div>
      </div>

      {/* Multi-Stage Visual Pipeline Diagram */}
      {(method === '2des' || method === '3des') && (
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {method === '2des' ? '2DES CASCADING PIPELINE' : '3DES (EDE) THREE-STAGE PIPELINE'}
              </span>
            </h3>

            {method === '3des' && threeDesResult?.keyingOption && (
              <span className="text-[10px] px-3 py-1 bg-cyan-950/80 text-cyan-300 border border-cyan-800 rounded-full font-mono-code font-bold">
                {threeDesResult.keyingOption}
              </span>
            )}
          </div>

          {/* Interactive Pipeline Stages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center pt-2">
            {/* Stage 1 */}
            <div
              onClick={() => setSelectedStage(1)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedStage === 1
                  ? 'bg-[#1C1A14] border-amber-500 shadow-md shadow-amber-500/20'
                  : 'bg-[#0A0A0A] border-[#262626] hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono-code font-bold uppercase text-amber-400">
                  STAGE 1: {mode === 'encrypt' ? 'ENCRYPT (E_K1)' : 'DECRYPT (D_K2 / D_K3)'}
                </span>
                <span className="text-[9px] font-mono-code text-zinc-500">16 Rounds</span>
              </div>
              <div className="font-mono-code text-xs text-white break-all">
                Key: <strong className="text-amber-400">{key1}</strong>
              </div>
              <div className="mt-2 text-[11px] font-mono-code text-zinc-400 truncate">
                Output: <span className="text-zinc-200">{method === '2des' ? currentTwoDesBlock?.stage1.outputHex : currentThreeDesBlock?.stage1.outputHex}</span>
              </div>
            </div>

            {/* Stage 2 */}
            <div
              onClick={() => setSelectedStage(2)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedStage === 2
                  ? 'bg-[#1C1714] border-orange-500 shadow-md shadow-orange-500/20'
                  : 'bg-[#0A0A0A] border-[#262626] hover:border-zinc-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono-code font-bold uppercase text-orange-400">
                  STAGE 2: {method === '2des' ? (mode === 'encrypt' ? 'ENCRYPT (E_K2)' : 'DECRYPT (D_K1)') : (mode === 'encrypt' ? 'DECRYPT (D_K2)' : 'ENCRYPT (E_K2)')}
                </span>
                <span className="text-[9px] font-mono-code text-zinc-500">16 Rounds</span>
              </div>
              <div className="font-mono-code text-xs text-white break-all">
                Key: <strong className="text-orange-400">{key2}</strong>
              </div>
              <div className="mt-2 text-[11px] font-mono-code text-zinc-400 truncate">
                Output: <span className="text-zinc-200">{method === '2des' ? currentTwoDesBlock?.stage2.outputHex : currentThreeDesBlock?.stage2.outputHex}</span>
              </div>
            </div>

            {/* Stage 3 (3DES only) */}
            {method === '3des' ? (
              <div
                onClick={() => setSelectedStage(3)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedStage === 3
                    ? 'bg-[#141A1C] border-cyan-500 shadow-md shadow-cyan-500/20'
                    : 'bg-[#0A0A0A] border-[#262626] hover:border-zinc-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono-code font-bold uppercase text-cyan-400">
                    STAGE 3: {mode === 'encrypt' ? 'ENCRYPT (E_K3)' : 'DECRYPT (D_K1)'}
                  </span>
                  <span className="text-[9px] font-mono-code text-zinc-500">16 Rounds</span>
                </div>
                <div className="font-mono-code text-xs text-white break-all">
                  Key: <strong className="text-cyan-400">{key3}</strong>
                </div>
                <div className="mt-2 text-[11px] font-mono-code text-zinc-400 truncate">
                  Output: <span className="text-zinc-200">{currentThreeDesBlock?.stage3.outputHex}</span>
                </div>
              </div>
            ) : (
              /* 2DES MITM Warning Badge */
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/80 text-rose-200 space-y-1.5 font-mono-code text-xs">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold uppercase text-[10px]">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>MITM SECURITY RISK</span>
                </div>
                <p className="text-[11px] font-sans text-rose-200 leading-tight">
                  2DES provides only <strong>57-bit effective security</strong> due to Diffie-Hellman Meet-in-the-Middle attack: E_K1(P) = D_K2(C).
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 16 Feistel Rounds Detailed Inspector */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-4">
          <div>
            <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>
                16 FEISTEL ROUNDS INSPECTOR (
                {method === 'des' ? 'SINGLE DES' : `STAGE ${selectedStage}`}
                )
              </span>
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-0.5">
              Breakdown of Left (L), Right (R), 48-bit Subkey (K), S-Box output, and Permutation (P) per round.
            </p>
          </div>

          <button
            onClick={() => setExpandedRounds(!expandedRounds)}
            className="px-3.5 py-1.5 bg-[#0A0A0A] hover:bg-[#222] border border-[#333] text-zinc-200 text-xs font-mono-code font-bold rounded-xl transition-all flex items-center gap-1.5 self-start sm:self-auto"
          >
            {expandedRounds ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{expandedRounds ? 'Collapse Rounds' : 'Expand All 16 Rounds'}</span>
          </button>
        </div>

        {/* Round Summary Cards */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left font-mono-code text-xs">
            <thead>
              <tr className="border-b border-[#262626] text-zinc-500 text-[10px] uppercase">
                <th className="py-2.5 px-3">Round</th>
                <th className="py-2.5 px-3">Left (L_i) [32b]</th>
                <th className="py-2.5 px-3">Right (R_i) [32b]</th>
                <th className="py-2.5 px-3">Round Subkey (K_i) [48b]</th>
                <th className="py-2.5 px-3">S-Box Out [32b]</th>
                <th className="py-2.5 px-3">P-Box Out [32b]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {(expandedRounds ? roundsToShow : roundsToShow.slice(0, 4)).map((r) => (
                <tr key={r.round} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="py-2.5 px-3 font-bold text-amber-400">
                    Round {r.round.toString().padStart(2, '0')}
                  </td>
                  <td className="py-2.5 px-3 text-zinc-200">{r.leftHex}</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-semibold">{r.rightHex}</td>
                  <td className="py-2.5 px-3 text-cyan-300">{r.subkeyHex}</td>
                  <td className="py-2.5 px-3 text-purple-300">{r.sboxOutputHex}</td>
                  <td className="py-2.5 px-3 text-pink-300">{r.pOutputHex}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!expandedRounds && roundsToShow.length > 4 && (
            <div className="py-3 text-center bg-[#0A0A0A] border-t border-[#262626] rounded-b-2xl">
              <button
                onClick={() => setExpandedRounds(true)}
                className="text-xs text-amber-400 hover:text-amber-300 font-mono-code font-bold underline"
              >
                + View remaining 12 Feistel rounds (Rounds 5 to 16)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
