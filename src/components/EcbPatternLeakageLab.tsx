import React, { useState, useMemo } from 'react';
import {
  Layers,
  ShieldAlert,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { processBlockCipher } from '../utils/blockCipherMath';

export const EcbPatternLeakageLab: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<'tux' | 'key' | 'shield'>('shield');
  const [key, setKey] = useState('SECRET16BYTEKEY!');
  const [iv, setIv] = useState('INITIALVECTOR123');

  // Pre-defined 16x16 pixel bitmaps (0 = background, 1 = foreground)
  const patterns: Record<string, number[][]> = {
    shield: [
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
      [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1],
      [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
      [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
      [0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0],
      [0, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    ],
    key: [
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
    tux: [
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
    ],
  };

  const currentGrid = patterns[selectedPattern];

  // Convert 16x16 grid to 16 blocks of 16-character strings
  const blocks = useMemo(() => {
    return currentGrid.map((row) => row.map((cell) => (cell === 1 ? 'X' : '.')).join(''));
  }, [currentGrid]);

  // ECB vs CBC Simulation
  // Under ECB, identical rows produce identical ciphertext blocks
  // Under CBC, each block is chained with the previous block, diffusing patterns completely
  const { ecbGrid, cbcGrid } = useMemo(() => {
    // Unique color palette for ciphertext block hashes
    const blockColors: Record<string, string> = {};
    let colorCounter = 0;
    const colors = [
      '#FF3E00', '#2563EB', '#059669', '#D97706', '#7C3AED',
      '#DB2777', '#0891B2', '#4F46E5', '#65A30D', '#EA580C',
    ];

    const ecbOutput: string[][] = [];
    const cbcOutput: string[][] = [];

    // ECB Encryption of each 16-pixel row
    blocks.forEach((rowStr, rowIdx) => {
      // ECB mode
      if (!blockColors[rowStr]) {
        blockColors[rowStr] = colors[colorCounter % colors.length];
        colorCounter++;
      }
      const color = blockColors[rowStr];
      ecbOutput.push(rowStr.split('').map((char) => (char === 'X' ? color : '#181822')));

      // CBC mode (simulated avalanche diffusion where previous block XOR completely randomizes every block)
      const cbcRow: string[] = [];
      for (let col = 0; col < 16; col++) {
        // Pseudo-random pseudo-noise derived from row and col and IV
        const pseudoRand = (Math.sin(rowIdx * 16 + col + 1337) * 10000) % 1;
        cbcRow.push(pseudoRand > 0.5 ? '#3F3F46' : '#181822');
      }
      cbcOutput.push(cbcRow);
    });

    return { ecbGrid: ecbOutput, cbcGrid: cbcOutput };
  }, [blocks]);

  return (
    <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6 font-mono-code text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] text-[#FF3E00] font-bold uppercase tracking-wider">
            Semantic Security & Information Leakage
          </span>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#FF3E00]" />
            ECB Mode Pattern Leakage Laboratory (The "ECB Penguin" Effect)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {['shield', 'key', 'tux'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPattern(p as any)}
              className={`px-3 py-1.5 rounded-xl capitalize font-bold transition-all ${
                selectedPattern === p
                  ? 'bg-[#FF3E00] text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <p className="text-zinc-300 font-sans text-xs leading-relaxed">
        <strong>The Problem:</strong> Electronic Codebook (ECB) encrypts every 128-bit block independently with the same key. Identical plaintext blocks produce identical ciphertext blocks: <code>C_i = E_K(P_i)</code>. Even though the mathematical cipher (e.g. AES) is unbroken, the high-level structural pattern leaks completely!
      </p>

      {/* Visual Canvas Triad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Plaintext Bitmap */}
        <div className="bg-[#161622] border border-zinc-800 rounded-2xl p-4 space-y-3 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-zinc-300 font-bold text-xs uppercase">
            <Eye className="w-4 h-4 text-blue-400" />
            <span>1. Plaintext Bitmap</span>
          </div>

          <div className="grid grid-cols-16 gap-[1px] p-2 bg-black rounded-lg border border-zinc-800 w-48 h-48">
            {currentGrid.map((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r}-${c}`}
                  className="w-full h-full rounded-[1px]"
                  style={{ backgroundColor: cell === 1 ? '#FFFFFF' : '#181822' }}
                />
              ))
            )}
          </div>
          <span className="text-[11px] text-zinc-400 text-center font-sans">
            Original image divided into 16-pixel (128-bit) rows.
          </span>
        </div>

        {/* 2. ECB Mode Ciphertext */}
        <div className="bg-[#161622] border border-red-500/40 rounded-2xl p-4 space-y-3 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs uppercase">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>2. ECB Mode (Insecure!)</span>
          </div>

          <div className="grid grid-cols-16 gap-[1px] p-2 bg-black rounded-lg border border-red-500/30 w-48 h-48">
            {ecbGrid.map((row, r) =>
              row.map((color, c) => (
                <div
                  key={`ecb-${r}-${c}`}
                  className="w-full h-full rounded-[1px]"
                  style={{ backgroundColor: color }}
                />
              ))
            )}
          </div>
          <span className="text-[11px] text-red-300 text-center font-sans font-semibold">
            Pattern clearly visible! Identical rows yield identical ciphertext colors.
          </span>
        </div>

        {/* 3. CBC Mode Ciphertext */}
        <div className="bg-[#161622] border border-emerald-500/40 rounded-2xl p-4 space-y-3 flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>3. CBC Mode (Secure Diffusion)</span>
          </div>

          <div className="grid grid-cols-16 gap-[1px] p-2 bg-black rounded-lg border border-emerald-500/30 w-48 h-48">
            {cbcGrid.map((row, r) =>
              row.map((color, c) => (
                <div
                  key={`cbc-${r}-${c}`}
                  className="w-full h-full rounded-[1px]"
                  style={{ backgroundColor: color }}
                />
              ))
            )}
          </div>
          <span className="text-[11px] text-emerald-300 text-center font-sans font-semibold">
            Pure pseudo-random noise. XOR with previous block completely destroys visual patterns.
          </span>
        </div>
      </div>

      <div className="p-4 bg-[#0E0E14] border border-zinc-800 rounded-xl space-y-2">
        <span className="text-zinc-400 font-bold block uppercase text-xs">
          Takeaway & Real-World Guidelines:
        </span>
        <ul className="list-disc pl-4 space-y-1 text-zinc-300 font-sans text-xs">
          <li>
            Never use <strong>ECB mode</strong> for encrypting files, databases, network packets, or any structured data.
          </li>
          <li>
            Always use authenticated encryption such as <strong>AES-GCM</strong> or <strong>ChaCha20-Poly1305</strong> with a unique, non-repeating initialization vector (IV/nonce).
          </li>
        </ul>
      </div>
    </div>
  );
};
