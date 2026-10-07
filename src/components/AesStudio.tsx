import React, { useState } from 'react';
import {
  AesTextResult,
  AesRoundStep,
  stateToBytes,
  AES_SBOX,
} from '../utils/aesMath';
import {
  Cpu,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
  Layers,
  ArrowRight,
  Grid,
  CheckCircle2,
} from 'lucide-react';

interface AesStudioProps {
  aesResult: AesTextResult;
  aesKey: string;
  setAesKey: (val: string) => void;
  aesKeyBits: 128 | 192 | 256;
  setAesKeyBits: (val: 128 | 192 | 256) => void;
  mode: 'encrypt' | 'decrypt';
}

export const AesStudio: React.FC<AesStudioProps> = ({
  aesResult,
  aesKey,
  setAesKey,
  aesKeyBits,
  setAesKeyBits,
  mode,
}) => {
  const [selectedRoundNum, setSelectedRoundNum] = useState<number>(1);
  const [selectedBlockIdx, setSelectedBlockIdx] = useState<number>(0);
  const [activeStepTab, setActiveStepTab] = useState<'subbytes' | 'shiftrows' | 'mixcolumns' | 'roundkey' | 'state'>('subbytes');
  const [inspectedByte, setInspectedByte] = useState<{ r: number; c: number; val: number } | null>({
    r: 0,
    c: 0,
    val: 0x2b,
  });

  const blockResult = aesResult.blocks[selectedBlockIdx] || aesResult.blocks[0];
  const maxRounds = aesKeyBits === 128 ? 10 : aesKeyBits === 192 ? 12 : 14;

  const currentRound: AesRoundStep | undefined = blockResult?.rounds.find(
    (r) => r.round === selectedRoundNum
  ) || blockResult?.rounds[0];

  const renderStateMatrix = (
    matrix: number[][],
    title: string,
    accentColor: string,
    isOmitted?: boolean
  ) => {
    if (isOmitted) {
      return (
        <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl flex flex-col items-center justify-center text-center space-y-2 h-full">
          <span className="text-[10px] font-mono-code uppercase font-bold text-zinc-500">
            {title}
          </span>
          <p className="text-xs font-mono-code text-amber-400 font-semibold">
            [OMITTED IN FINAL ROUND {maxRounds}]
          </p>
          <span className="text-[11px] text-zinc-400 font-sans max-w-[200px]">
            MixColumns is skipped in the last round to maintain symmetry in decryption.
          </span>
        </div>
      );
    }

    return (
      <div className="bg-[#0A0A0A] p-4 border border-[#262626] rounded-2xl flex flex-col items-center justify-between space-y-3">
        <div className="w-full flex items-center justify-between border-b border-[#222] pb-2">
          <span className={`text-[10px] font-mono-code font-bold uppercase tracking-wider ${accentColor}`}>
            {title}
          </span>
          <span className="text-[9px] font-mono-code text-zinc-500">4×4 Bytes</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5 font-mono-code text-xs">
          {matrix.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isSelected =
                inspectedByte?.r === rIdx && inspectedByte?.c === cIdx;
              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => setInspectedByte({ r: rIdx, c: cIdx, val: cell })}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold transition-all border ${
                    isSelected
                      ? 'bg-emerald-500 text-black border-white shadow-lg scale-105'
                      : 'bg-[#141414] text-zinc-200 border-[#2A2A2A] hover:border-emerald-500 hover:text-white'
                  }`}
                  title={`Row ${rIdx}, Col ${cIdx}: 0x${cell.toString(16).padStart(2, '0').toUpperCase()} (${cell})`}
                >
                  {cell.toString(16).padStart(2, '0').toUpperCase()}
                </button>
              );
            })
          )}
        </div>

        <div className="text-[10px] text-zinc-500 font-mono-code">
          Click cell to inspect byte
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Parameter Controls Panel */}
      <div className="bg-[#0A0A0A] p-5 border border-emerald-500/40 rounded-2xl space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-3">
          <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>AES Architecture Parameters (FIPS 197 / Rijndael)</span>
          </label>

          {/* Key Size Selector */}
          <div className="flex items-center gap-1.5 bg-[#141414] p-1 border border-[#333] rounded-xl self-start sm:self-auto">
            <span className="text-[10px] font-mono-code text-zinc-500 uppercase px-2 font-bold">
              Key Size:
            </span>
            {([128, 192, 256] as const).map((bits) => (
              <button
                key={bits}
                onClick={() => {
                  setAesKeyBits(bits);
                  if (selectedRoundNum > (bits === 128 ? 10 : bits === 192 ? 12 : 14)) {
                    setSelectedRoundNum(1);
                  }
                }}
                className={`px-3 py-1 text-xs font-mono-code font-bold rounded-lg transition-all ${
                  aesKeyBits === bits
                    ? 'bg-emerald-500 text-black shadow-sm font-extrabold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {bits}-bit ({bits === 128 ? '10 Rounds' : bits === 192 ? '12 Rounds' : '14 Rounds'})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:col-span-2">
            <label className="text-[10px] font-mono-code text-zinc-400 uppercase font-bold block mb-1">
              Cipher Key ({aesKeyBits}-bit / {aesKeyBits / 4} Hex characters or String)
            </label>
            <input
              type="text"
              value={aesKey}
              onChange={(e) => setAesKey(e.target.value.toUpperCase())}
              placeholder="2B7E151628AED2A6ABF7158809CF4F3C"
              className="w-full bg-[#141414] text-emerald-300 font-mono-code text-xs px-3 py-2 border border-[#333] focus:border-emerald-500 rounded-xl outline-none tracking-wider font-bold uppercase"
            />
          </div>

          <div className="flex flex-col justify-end">
            <button
              onClick={() =>
                setAesKey(
                  aesKeyBits === 128
                    ? '2B7E151628AED2A6ABF7158809CF4F3C'
                    : aesKeyBits === 192
                    ? '8E73B0F7DA0E6452C810F32B809079E562F8EAD2522C6B7B'
                    : '603DEB1015CA71BE2B73AEF0857D77811F352C073B6108D72D9810A30914DFF4'
                )
              }
              className="px-3.5 py-2 bg-[#141414] hover:bg-[#222] border border-[#333] text-zinc-200 text-xs font-mono-code font-bold rounded-xl transition-all"
            >
              Load Official NIST Test Key
            </button>
          </div>
        </div>

        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
          AES organizes 128 bits of data into a <strong>4×4 State Matrix</strong>. In each round, bytes pass through non-linear S-Box substitution (SubBytes), cyclic row shifts (ShiftRows), matrix multiplication in Galois Field GF(2⁸) (MixColumns), and key addition (AddRoundKey).
        </p>
      </div>

      {/* Round Stepper Navigation */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-mono-code font-bold text-lg">
              {selectedRoundNum}
            </div>
            <div>
              <span className="text-[10px] font-mono-code uppercase tracking-[0.15em] text-emerald-400 font-bold block">
                AES ROUND STEPPER (1 OF {maxRounds})
              </span>
              <h3 className="text-lg font-serif-display font-semibold text-white">
                Round {selectedRoundNum} Transformation Pipeline
              </h3>
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRoundNum((prev) => Math.max(1, prev - 1))}
              disabled={selectedRoundNum <= 1}
              className="p-2 bg-[#0A0A0A] hover:bg-[#222] disabled:opacity-40 border border-[#333] rounded-xl text-zinc-200 transition-all"
              title="Previous Round"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Quick Round Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {Array.from({ length: maxRounds }).map((_, idx) => {
                const rNum = idx + 1;
                return (
                  <button
                    key={rNum}
                    onClick={() => setSelectedRoundNum(rNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono-code font-bold transition-all ${
                      selectedRoundNum === rNum
                        ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-extrabold'
                        : 'bg-[#0A0A0A] text-zinc-400 border border-[#2A2A2A] hover:text-white'
                    }`}
                  >
                    {rNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedRoundNum((prev) => Math.min(maxRounds, prev + 1))}
              disabled={selectedRoundNum >= maxRounds}
              className="p-2 bg-[#0A0A0A] hover:bg-[#222] disabled:opacity-40 border border-[#333] rounded-xl text-zinc-200 transition-all"
              title="Next Round"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 State Matrices Side-by-Side: The 4 Transformations */}
        {currentRound && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. SubBytes Matrix */}
              {renderStateMatrix(
                currentRound.afterSubBytes,
                '1. After SubBytes (S-Box)',
                'text-purple-400'
              )}

              {/* 2. ShiftRows Matrix */}
              {renderStateMatrix(
                currentRound.afterShiftRows,
                '2. After ShiftRows',
                'text-sky-400'
              )}

              {/* 3. MixColumns Matrix */}
              {renderStateMatrix(
                currentRound.afterMixColumns || currentRound.afterShiftRows,
                '3. After MixColumns (GF(2⁸))',
                'text-pink-400',
                selectedRoundNum === maxRounds
              )}

              {/* 4. AddRoundKey End State Matrix */}
              {renderStateMatrix(
                currentRound.endState,
                `4. End State (⊕ Round Key ${selectedRoundNum})`,
                'text-emerald-400'
              )}
            </div>

            {/* Transformation Explanation Card */}
            <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono-code text-xs">
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-zinc-300 font-sans leading-relaxed">
                  {currentRound.explanation}
                </span>
              </div>

              {inspectedByte && (
                <div className="px-3.5 py-1.5 bg-[#141414] border border-[#333] rounded-xl text-[11px] text-zinc-300 shrink-0">
                  Inspected Byte [{inspectedByte.r}, {inspectedByte.c}]:{' '}
                  <strong className="text-emerald-400">
                    0x{inspectedByte.val.toString(16).padStart(2, '0').toUpperCase()}
                  </strong>{' '}
                  (Dec: {inspectedByte.val}, Bin: {inspectedByte.val.toString(2).padStart(8, '0')})
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
