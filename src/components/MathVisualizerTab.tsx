import React, { useState, useMemo } from 'react';
import {
  extendedGCD,
  modInverse,
  getValidKeysA,
  gcd,
  isCoprime,
  CIPHER_METHODS,
} from '../utils/affineMath';
import {
  generatePlayfairMatrix,
  getHillDeterminant,
  getHillInverseMatrix,
  isHillKeyValid,
  HillMatrixKey,
} from '../utils/polyMath';
import { Calculator, Sparkles, HelpCircle, ArrowRight, Sliders, Layers, Grid, Binary, Shield, Lock, Cpu } from 'lucide-react';
import { CipherMethod } from '../types';
import { gfMul, xtime, AES_SBOX } from '../utils/aesMath';
import { desEncryptHex, desDecryptHex, twoDesEncryptHex, threeDesEncryptHex } from '../utils/desMath';

interface MathVisualizerTabProps {
  cipherMethod?: CipherMethod;
  onCipherMethodChange?: (method: CipherMethod) => void;
  keyA: number;
  setKeyA: (val: number) => void;
  keyB: number;
  setKeyB: (val: number) => void;
  vigenereKey?: string;
  setVigenereKey?: (val: string) => void;
  playfairKey?: string;
  setPlayfairKey?: (val: string) => void;
  hillMatrix?: HillMatrixKey;
  setHillMatrix?: (val: HillMatrixKey) => void;
  onOpenAITutorWithPrompt?: (prompt: string) => void;
}

export const MathVisualizerTab: React.FC<MathVisualizerTabProps> = ({
  cipherMethod = 'affine',
  onCipherMethodChange,
  keyA,
  setKeyA,
  keyB,
  setKeyB,
  vigenereKey = 'SECRET',
  setVigenereKey,
  playfairKey = 'MONARCHY',
  setPlayfairKey,
  hillMatrix = { k11: 5, k12: 8, k21: 17, k22: 3 },
  setHillMatrix,
  onOpenAITutorWithPrompt,
}) => {
  const [hoveredCharIndex, setHoveredCharIndex] = useState<number | null>(null);
  const [selectedTab, setSelectedTab] = useState<'clock' | 'vigenere' | 'playfair' | 'hill' | 'block' | 'euclid' | 'heatmap' | 'twodes' | 'aes'>('clock');

  // 2DES/3DES Math Explorer states
  const [feistelP, setFeistelP] = useState('0123456789ABCDEF');
  const [feistelK1, setFeistelK1] = useState('133457799BBCDFF1');
  const [feistelK2, setFeistelK2] = useState('A1B2C3D4E5F60718');
  const [feistelK3, setFeistelK3] = useState('133457799BBCDFF1');

  // AES GF(2^8) Explorer states
  const [gfByteA, setGfByteA] = useState('57');
  const [gfByteB, setGfByteB] = useState('13');
  const [sboxHoverByte, setSboxHoverByte] = useState<number | null>(0x53);

  const currentMethodInfo = CIPHER_METHODS[cipherMethod] || CIPHER_METHODS.affine;
  const validAs = useMemo(() => getValidKeysA(26), []);
  const euclidRes = useMemo(() => extendedGCD(keyA, 26), [keyA]);
  const aInverse = useMemo(() => modInverse(keyA, 26), [keyA]);

  // Compute 26 positions around circle for Clock Wheel
  const clockNodes = useMemo(() => {
    const nodes = [];
    const radius = 130;
    const centerX = 160;
    const centerY = 160;

    for (let i = 0; i < 26; i++) {
      // Angle starting from top (-90 deg)
      const angle = ((i * 360) / 26 - 90) * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      // Target mapping
      const targetIdx = ((keyA * i + keyB) % 26 + 26) % 26;
      const targetAngle = ((targetIdx * 360) / 26 - 90) * (Math.PI / 180);
      const targetX = centerX + radius * Math.cos(targetAngle);
      const targetY = centerY + radius * Math.sin(targetAngle);

      nodes.push({
        index: i,
        char: String.fromCharCode(65 + i),
        x,
        y,
        targetIdx,
        targetChar: String.fromCharCode(65 + targetIdx),
        targetX,
        targetY,
      });
    }
    return nodes;
  }, [keyA, keyB]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header & Selector */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF3E00] via-amber-400 to-[#FF3E00]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#FF3E00] text-[10px] font-mono-code uppercase tracking-[0.2em] font-bold">
              <Calculator className="w-3.5 h-3.5" />
              <span>MODULE // MODULAR MATHEMATICS LAB ({currentMethodInfo.name.toUpperCase()})</span>
            </div>
            <h2 className="text-2xl font-serif-display font-semibold text-white mt-1">
              Modular Geometry & Euclidean Algorithms
            </h2>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-[#0A0A0A] p-1.5 border border-[#2A2A2A] rounded-full shadow-inner overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedTab('clock')}
              className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                selectedTab === 'clock'
                  ? 'bg-[#FF3E00] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🔄 Clock Wheel
            </button>
            <button
              onClick={() => setSelectedTab('vigenere')}
              className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                selectedTab === 'vigenere'
                  ? 'bg-sky-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📊 Vigenère Tableau
            </button>
            <button
              onClick={() => setSelectedTab('playfair')}
              className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                selectedTab === 'playfair'
                  ? 'bg-purple-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🧩 Playfair Grid
            </button>
            <button
              onClick={() => setSelectedTab('hill')}
              className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                selectedTab === 'hill'
                  ? 'bg-emerald-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🔢 Hill Matrix Algebra
            </button>
            <button
              onClick={() => setSelectedTab('block')}
              className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                selectedTab === 'block'
                  ? 'bg-[#FF3E00] text-white font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ⚡ Block Cipher Modes
            </button>
            <button
              onClick={() => setSelectedTab('twodes')}
              className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                selectedTab === 'twodes'
                  ? 'bg-amber-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🛡️ 2DES/3DES Feistel
            </button>
            <button
              onClick={() => setSelectedTab('aes')}
              className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                selectedTab === 'aes'
                  ? 'bg-cyan-500 text-black font-extrabold shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🔮 AES Galois GF(2⁸)
            </button>
            <button
              onClick={() => setSelectedTab('euclid')}
              className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                selectedTab === 'euclid'
                  ? 'bg-[#FF3E00] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              📐 Euclidean Finder
            </button>
            <button
              onClick={() => setSelectedTab('heatmap')}
              className={`px-3.5 py-1.5 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 whitespace-nowrap ${
                selectedTab === 'heatmap'
                  ? 'bg-[#FF3E00] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              🔥 Mod 26 Matrix
            </button>
          </div>
        </div>

        {/* Method Toggle Pills */}
        {onCipherMethodChange && (
          <div className="mt-4 pt-3 border-t border-[#262626] flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-mono-code uppercase text-zinc-500 shrink-0 flex items-center gap-1">
              <Sliders className="w-3 h-3 text-[#FF3E00]" /> Cipher Mode:
            </span>
            {(Object.keys(CIPHER_METHODS) as CipherMethod[]).map((mKey) => {
              const info = CIPHER_METHODS[mKey];
              const isSelected = cipherMethod === mKey;
              return (
                <button
                  key={mKey}
                  onClick={() => onCipherMethodChange(mKey)}
                  className={`px-3 py-1 text-xs font-mono-code font-bold rounded-xl whitespace-nowrap border transition-all ${
                    isSelected
                      ? 'bg-[#FF3E00] text-white border-[#FF3E00] shadow-sm'
                      : 'bg-[#0A0A0A] text-zinc-400 border-[#262626] hover:text-white hover:border-zinc-500'
                  }`}
                >
                  {info.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Current Key Quick Bar */}
        <div className="mt-4 pt-3 border-t border-[#262626] flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
          <div className="flex items-center gap-4 text-zinc-300">
            <span>
              Key <strong className="text-white">a = {keyA}</strong>
            </span>
            <span className="text-zinc-600">|</span>
            <span>
              Key <strong className="text-amber-400">b = {keyB}</strong>
            </span>
            <span className="text-zinc-600">|</span>
            <span>
              Modular Inverse:{' '}
              {aInverse !== null ? (
                <strong className="text-[#FF3E00]">a⁻¹ = {aInverse}</strong>
              ) : (
                <span className="text-rose-400 font-bold">None (Invalid Key)</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 uppercase text-[10px]">Select key 'a':</span>
            {validAs.map((val) => (
              <button
                key={val}
                onClick={() => setKeyA(val)}
                className={`px-2 py-0.5 text-xs font-mono-code transition-all ${
                  keyA === val
                    ? 'bg-[#FF3E00] text-white font-bold'
                    : 'bg-[#181818] text-zinc-300 border border-[#2A2A2A] hover:border-zinc-500'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SUB-TAB: Vigenère Tableau Matrix */}
      {selectedTab === 'vigenere' && (
        <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-4">
          <div className="border-b border-[#262626] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>VIGENÈRE TABLEAU (TABULA RECTA 26×26)</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Lookup intersection of Plaintext row (A–Z) and Key column (A–Z) to get the Ciphertext character.
              </p>
            </div>
            <div className="px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-xl text-xs font-mono-code font-bold">
              Active Key: {vigenereKey}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div
                className="grid gap-0.5 text-[10px] font-mono-code text-center select-none"
                style={{ gridTemplateColumns: 'repeat(27, minmax(24px, 1fr))' }}
              >
                <div className="p-1 font-bold bg-[#0A0A0A] text-sky-400">P \ K</div>
                {Array.from({ length: 26 }).map((_, cIdx) => (
                  <div key={cIdx} className="p-1 font-bold bg-[#0A0A0A] text-sky-400">
                    {String.fromCharCode(65 + cIdx)}
                  </div>
                ))}

                {Array.from({ length: 26 }).map((_, rIdx) => {
                  const plainChar = String.fromCharCode(65 + rIdx);
                  return (
                    <React.Fragment key={rIdx}>
                      <div className="p-1 font-bold bg-[#0A0A0A] text-amber-400">{plainChar}</div>
                      {Array.from({ length: 26 }).map((_, cIdx) => {
                        const resChar = String.fromCharCode(65 + ((rIdx + cIdx) % 26));
                        return (
                          <div
                            key={cIdx}
                            className="p-1 bg-[#0A0A0A] text-zinc-400 hover:bg-sky-500 hover:text-white hover:font-bold transition-colors"
                          >
                            {resChar}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: Playfair 5x5 Key Matrix */}
      {selectedTab === 'playfair' && (
        <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-6">
          <div className="border-b border-[#262626] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
                <Grid className="w-4 h-4 text-purple-400" />
                <span>PLAYFAIR 5×5 KEY MATRIX GEOMETRY</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Letters are paired into digraphs. Digraph pairs undergo Same Row, Same Column, or Rectangle swap rules.
              </p>
            </div>
            <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-xl text-xs font-mono-code font-bold">
              Key Phrase: {playfairKey}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="bg-[#0A0A0A] p-6 border border-[#262626] rounded-2xl flex flex-col items-center">
              <span className="text-xs font-mono-code text-purple-400 font-bold uppercase mb-4">
                Active 5×5 Polybius Grid
              </span>
              <div className="grid grid-cols-5 gap-2 font-mono-code text-sm font-bold">
                {generatePlayfairMatrix(playfairKey).map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="w-12 h-12 rounded-xl bg-[#141414] border border-[#333] flex items-center justify-center text-white hover:border-purple-500 hover:scale-105 transition-all shadow-md"
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-4 font-mono-code text-xs text-zinc-300">
              <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-2">
                <h4 className="text-purple-400 font-bold uppercase">Rule 1: Same Row</h4>
                <p className="text-zinc-400 font-sans">Shift each letter one position right mod 5 (wrap around).</p>
              </div>
              <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-2">
                <h4 className="text-purple-400 font-bold uppercase">Rule 2: Same Column</h4>
                <p className="text-zinc-400 font-sans">Shift each letter one position down mod 5 (wrap around).</p>
              </div>
              <div className="p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-2">
                <h4 className="text-purple-400 font-bold uppercase">Rule 3: Rectangle Corner Swap</h4>
                <p className="text-zinc-400 font-sans">Swap columns (keep original row, take partner's column).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: Hill Matrix Algebra */}
      {selectedTab === 'hill' && (
        <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-6">
          <div className="border-b border-[#262626] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
                <Binary className="w-4 h-4 text-emerald-400" />
                <span>HILL CIPHER 2×2 LINEAR ALGEBRA VECTOR MATRIX</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Plaintext 2-vectors are multiplied by matrix K mod 26.
              </p>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs font-mono-code font-bold">
              det(K) = {getHillDeterminant(hillMatrix)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-4 font-mono-code">
              <h4 className="text-emerald-400 font-bold uppercase text-xs">Matrix K:</h4>
              <div className="text-lg text-white font-bold bg-[#141414] p-4 border border-[#333] rounded-xl text-center">
                [[{hillMatrix.k11}, {hillMatrix.k12}], [{hillMatrix.k21}, {hillMatrix.k22}]]
              </div>
              <p className="text-xs text-zinc-400">
                Determinant: det(K) = ({hillMatrix.k11}·{hillMatrix.k22} - {hillMatrix.k12}·{hillMatrix.k21}) mod 26 ={' '}
                <strong className="text-emerald-400">{getHillDeterminant(hillMatrix)}</strong>
              </p>
              <p className="text-xs text-zinc-400">
                Key Validity: {isHillKeyValid(hillMatrix) ? '✅ Coprime to 26 (Valid)' : '❌ Not Coprime (Invalid)'}
              </p>
            </div>

            {getHillInverseMatrix(hillMatrix) && (
              <div className="p-5 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-4 font-mono-code">
                <h4 className="text-emerald-400 font-bold uppercase text-xs">Decryption Inverse Matrix K⁻¹:</h4>
                <div className="text-lg text-emerald-300 font-bold bg-[#141414] p-4 border border-[#333] rounded-xl text-center">
                  [[{getHillInverseMatrix(hillMatrix)?.k11}, {getHillInverseMatrix(hillMatrix)?.k12}], [{getHillInverseMatrix(hillMatrix)?.k21}, {getHillInverseMatrix(hillMatrix)?.k22}]]
                </div>
                <p className="text-xs text-zinc-400">
                  Formula: K⁻¹ = det(K)⁻¹ · adj(K) mod 26
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB: Block Cipher Mode Architecture Diagrams */}
      {selectedTab === 'block' && (
        <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-6">
          <div className="border-b border-[#262626] pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-mono-code font-bold text-[#FF3E00] uppercase tracking-[0.15em] flex items-center gap-2">
                <Binary className="w-4 h-4" />
                <span>INTERACTIVE BLOCK CIPHER ARCHITECTURE DIAGRAMS</span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Visual representation of Initialization Vectors (IV), XOR chaining, and feedback loops across all 5 block modes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { id: 'ecb', name: 'ECB Mode', desc: 'Electronic Codebook' },
              { id: 'cbc', name: 'CBC Mode', desc: 'Cipher Block Chaining' },
              { id: 'cfb', name: 'CFB Mode', desc: 'Cipher Feedback' },
              { id: 'ofb', name: 'OFB Mode', desc: 'Output Feedback' },
              { id: 'ctr', name: 'CTR Mode', desc: 'Counter Mode' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => onCipherMethodChange && onCipherMethodChange(m.id as CipherMethod)}
                className={`p-4 rounded-2xl border text-left font-mono-code transition-all ${
                  cipherMethod === m.id
                    ? 'bg-[#1F1F28] border-[#FF3E00] shadow-lg shadow-[#FF3E00]/20'
                    : 'bg-[#0A0A0A] border-[#262626] hover:border-zinc-500'
                }`}
              >
                <div className="text-xs font-bold text-white">{m.name}</div>
                <div className="text-[10px] text-amber-400 font-semibold">{m.desc}</div>
              </button>
            ))}
          </div>

          {/* Interactive Block Diagram SVG */}
          <div className="bg-[#0A0A0A] border border-[#262626] rounded-3xl p-6 flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-between w-full font-mono-code text-xs">
              <span className="text-emerald-400 font-bold uppercase">
                Active Mode Diagram: {cipherMethod.toUpperCase()}
              </span>
              <span className="text-zinc-500 text-[11px]">
                Showing 2 Consecutive Message Blocks (P1 ➔ C1, P2 ➔ C2)
              </span>
            </div>

            <div className="w-full overflow-x-auto py-4">
              <svg viewBox="0 0 640 220" className="w-full max-w-[640px] mx-auto select-none">
                {/* Block 1 */}
                <rect x="40" y="20" width="90" height="35" rx="8" fill="#181820" stroke="#FF3E00" strokeWidth="2" />
                <text x="85" y="42" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono-code">
                  Plaintext P1
                </text>

                {cipherMethod === 'cbc' && (
                  <>
                    <rect x="40" y="80" width="90" height="30" rx="6" fill="#101018" stroke="#00E5FF" strokeWidth="1.5" />
                    <text x="85" y="100" fill="#00E5FF" fontSize="10" textAnchor="middle" className="font-mono-code">
                      IV Vector
                    </text>
                    <line x1="85" y1="55" x2="85" y2="80" stroke="#FF3E00" strokeWidth="2" markerEnd="url(#arrow)" />
                  </>
                )}

                <rect x="40" y="130" width="90" height="40" rx="8" fill="#1C1C28" stroke="#333346" strokeWidth="2" />
                <text x="85" y="154" fill="#FFC107" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono-code">
                  Block Cipher (K)
                </text>

                <line x1="85" y1="170" x2="85" y2="200" stroke="#FF3E00" strokeWidth="2" />
                <rect x="40" y="185" width="90" height="30" rx="8" fill="#FF3E00" />
                <text x="85" y="204" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono-code">
                  Ciphertext C1
                </text>

                {/* Arrow Feedback Connector from C1 to Block 2 in CBC */}
                {cipherMethod === 'cbc' && (
                  <path d="M 130 200 L 220 200 L 220 95 L 360 95" fill="none" stroke="#00E5FF" strokeWidth="2" strokeDasharray="4 4" />
                )}

                {/* Block 2 */}
                <rect x="360" y="20" width="90" height="35" rx="8" fill="#181820" stroke="#FF3E00" strokeWidth="2" />
                <text x="405" y="42" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono-code">
                  Plaintext P2
                </text>

                <rect x="360" y="130" width="90" height="40" rx="8" fill="#1C1C28" stroke="#333346" strokeWidth="2" />
                <text x="405" y="154" fill="#FFC107" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono-code">
                  Block Cipher (K)
                </text>

                <rect x="360" y="185" width="90" height="30" rx="8" fill="#FF3E00" />
                <text x="405" y="204" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle" className="font-mono-code">
                  Ciphertext C2
                </text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: Modular Clock Wheel */}
      {selectedTab === 'clock' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Clock Visualizer SVG */}
          <div className="md:col-span-2 bg-[#141414] border border-[#262626] p-6 shadow-xl flex flex-col items-center justify-center relative min-h-[380px]">
            <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] self-start mb-1">
              26-HOUR MODULAR CLOCK MAP (E(x) = {keyA}x + {keyB} mod 26)
            </h3>
            <p className="text-xs text-zinc-400 font-sans self-start mb-4">
              Hover over any letter node to highlight its geometric transformation vector ray.
            </p>

            <svg viewBox="0 0 320 320" className="w-full max-w-[340px] h-auto select-none">
              {/* Outer Ring Circle */}
              <circle
                cx="160"
                cy="160"
                r="130"
                fill="none"
                stroke="#333333"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Rays Connecting Plaintext x to Ciphertext y */}
              {clockNodes.map((node) => {
                const isHovered =
                  hoveredCharIndex === node.index ||
                  hoveredCharIndex === node.targetIdx;
                return (
                  <line
                    key={`line-${node.index}`}
                    x1={node.x}
                    y1={node.y}
                    x2={node.targetX}
                    y2={node.targetY}
                    stroke={isHovered ? '#FF3E00' : '#444444'}
                    strokeWidth={isHovered ? '3' : '1'}
                    strokeOpacity={isHovered ? '1' : '0.35'}
                    className="transition-all duration-200"
                  />
                );
              })}

              {/* Circular Nodes */}
              {clockNodes.map((node) => {
                const isHovered = hoveredCharIndex === node.index;
                const isTargetOfHovered =
                  hoveredCharIndex !== null &&
                  clockNodes[hoveredCharIndex].targetIdx === node.index;

                return (
                  <g
                    key={`node-${node.index}`}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredCharIndex(node.index)}
                    onMouseLeave={() => setHoveredCharIndex(null)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered || isTargetOfHovered ? '14' : '11'}
                      fill={
                        isHovered
                          ? '#FF3E00'
                          : isTargetOfHovered
                          ? '#D93400'
                          : '#1A1A1A'
                      }
                      stroke={
                        isHovered || isTargetOfHovered ? '#FFFFFF' : '#444444'
                      }
                      strokeWidth="2"
                      className="transition-all duration-200"
                    />
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fill="#F5F5F5"
                      fontSize="10"
                      fontWeight="bold"
                      className="pointer-events-none font-mono-code"
                    >
                      {node.char}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Inspector Tooltip */}
            <div className="mt-4 p-3 bg-[#0A0A0A] border border-[#262626] w-full text-center text-xs font-mono-code">
              {hoveredCharIndex !== null ? (
                <div className="flex items-center justify-center gap-3 text-zinc-200">
                  <span>
                    Plaintext:{' '}
                    <strong className="text-[#FF3E00]">
                      {clockNodes[hoveredCharIndex].char} ({hoveredCharIndex})
                    </strong>
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                  <span>
                    ({keyA} × {hoveredCharIndex} + {keyB}) mod 26 ={' '}
                    {clockNodes[hoveredCharIndex].targetIdx}
                  </span>
                  <ArrowRight className="w-4 h-4 text-zinc-600" />
                  <span>
                    Ciphertext:{' '}
                    <strong className="text-amber-400">
                      {clockNodes[hoveredCharIndex].targetChar} (
                      {clockNodes[hoveredCharIndex].targetIdx})
                    </strong>
                  </span>
                </div>
              ) : (
                <span className="text-zinc-500 font-sans">
                  Hover over any node above to inspect its exact mathematical mapping formula.
                </span>
              )}
            </div>
          </div>

          {/* Clock Explanation Card */}
          <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xl font-serif-display font-semibold text-white mb-2">
                Geometric Insights
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                In modular geometry, multiplying by key <strong className="text-[#FF3E00] font-mono-code">a</strong> acts as a star-like permutation across the 26 points, while adding <strong className="text-amber-400 font-mono-code">b</strong> rotates the resulting pattern around the circle.
              </p>

              <div className="mt-5 space-y-2.5 text-xs bg-[#0A0A0A] p-4 border border-[#262626] font-mono-code">
                <div className="flex justify-between text-zinc-300">
                  <span>Coprime Status</span>
                  <strong className={isCoprime(keyA) ? 'text-emerald-400' : 'text-rose-400'}>
                    {isCoprime(keyA) ? 'YES (BIJECTIVE)' : 'NO (DEGENERATE)'}
                  </strong>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Total Outlets</span>
                  <strong className="text-[#FF3E00]">
                    {new Set(clockNodes.map((n) => n.targetIdx)).size} of 26
                  </strong>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Modular Inverse</span>
                  <strong className="text-amber-400">
                    {aInverse ?? 'N/A'}
                  </strong>
                </div>
              </div>
            </div>

            {onOpenAITutorWithPrompt && (
              <button
                onClick={() =>
                  onOpenAITutorWithPrompt(
                    `How does key 'a' = ${keyA} create a bijective permutation on a circle mod 26? What happens geometrically when a is not coprime?`
                  )
                }
                className="w-full py-2.5 px-3 bg-[#FF3E00] hover:bg-[#E03700] text-white text-xs font-mono-code uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                Ask AI Tutor About Geometric Symmetry
              </button>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Extended Euclidean Algorithm Step Matrix */}
      {selectedTab === 'euclid' && (
        <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-5">
          <div className="border-b border-[#262626] pb-3">
            <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em]">
              EXTENDED EUCLIDEAN ALGORITHM STEPS FOR a = {keyA} MOD 26
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Finds integers x and y satisfying Bézout's identity: <span className="text-[#FF3E00] font-mono-code">{keyA}·x + 26·y = gcd({keyA}, 26)</span>
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code border-collapse">
              <thead>
                <tr className="bg-[#0A0A0A] border-b border-[#262626] text-zinc-500 uppercase text-[10px]">
                  <th className="p-3">Step k</th>
                  <th className="p-3">a</th>
                  <th className="p-3">b</th>
                  <th className="p-3">Quotient</th>
                  <th className="p-3">Remainder</th>
                  <th className="p-3">Coeff x</th>
                  <th className="p-3">Coeff y</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222] text-zinc-300">
                {euclidRes.steps.map((s) => (
                  <tr key={s.step} className="hover:bg-[#1A1A1A]">
                    <td className="p-3 font-bold text-[#FF3E00]">{s.step}</td>
                    <td className="p-3">{s.a}</td>
                    <td className="p-3">{s.b}</td>
                    <td className="p-3 text-zinc-500">{s.quotient}</td>
                    <td className="p-3 font-bold text-amber-300">{s.remainder}</td>
                    <td className="p-3 text-emerald-400 font-bold">{s.x}</td>
                    <td className="p-3 text-zinc-500">{s.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#0A0A0A] border border-[#262626] space-y-2 text-xs font-mono-code">
            <h4 className="font-bold text-white uppercase text-xs">Mathematical Conclusion:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-zinc-300">
              <div>
                <p>
                  1. Greatest Common Divisor:{' '}
                  <strong className={euclidRes.gcd === 1 ? 'text-emerald-400' : 'text-rose-400'}>
                    gcd({keyA}, 26) = {euclidRes.gcd}
                  </strong>
                </p>
                <p className="mt-1">
                  2. Linear Combination:{' '}
                  <span className="text-[#FF3E00]">
                    ({keyA} × {euclidRes.x}) + (26 × {euclidRes.y}) = {euclidRes.gcd}
                  </span>
                </p>
              </div>

              <div>
                <p>
                  3. Raw Coefficient x = <strong className="text-white">{euclidRes.x}</strong>
                </p>
                <p className="mt-1">
                  4. Normalized Modular Inverse:{' '}
                  {aInverse !== null ? (
                    <strong className="text-emerald-400">
                      a⁻¹ = ({euclidRes.x} mod 26 + 26) mod 26 = {aInverse}
                    </strong>
                  ) : (
                    <strong className="text-rose-400">Undefined (gcd ≠ 1)</strong>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Modular Multiplication Heatmap Grid (26 x 26) */}
      {selectedTab === 'heatmap' && (
        <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-4">
          <div className="border-b border-[#262626] pb-3">
            <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em]">
              MODULAR MULTIPLICATION MATRIX (a · x MOD 26)
            </h3>
            <p className="text-xs text-zinc-400 font-sans mt-1">
              Green cells highlight inverse pairs where <span className="text-emerald-400 font-mono-code font-bold">a · x ≡ 1 mod 26</span>. Red row headers mark invalid keys.
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div
                className="grid gap-0.5 text-[10px] font-mono-code text-center select-none"
                style={{ gridTemplateColumns: 'repeat(27, minmax(24px, 1fr))' }}
              >
                {/* Header Row */}
                <div className="p-1 font-bold bg-[#0A0A0A] text-zinc-600">a \ x</div>
                {Array.from({ length: 26 }).map((_, col) => (
                  <div key={col} className="p-1 font-bold bg-[#0A0A0A] text-zinc-400">
                    {col}
                  </div>
                ))}

                {/* Matrix Rows for a = 1..25 */}
                {Array.from({ length: 25 }).map((_, rIdx) => {
                  const rowA = rIdx + 1;
                  const rowCoprime = isCoprime(rowA, 26);
                  const isSelectedA = rowA === keyA;

                  return (
                    <React.Fragment key={rowA}>
                      {/* Row Label (a) */}
                      <button
                        onClick={() => setKeyA(rowA)}
                        className={`p-1 font-bold transition-colors ${
                          isSelectedA
                            ? 'bg-[#FF3E00] text-white font-bold'
                            : rowCoprime
                            ? 'bg-[#0A0A0A] text-zinc-300 hover:bg-[#222222]'
                            : 'bg-rose-950/60 text-rose-400 hover:bg-rose-900/60'
                        }`}
                        title={`Set key a = ${rowA}`}
                      >
                        {rowA}
                      </button>

                      {/* Row Cells (a * x mod 26) */}
                      {Array.from({ length: 26 }).map((_, cIdx) => {
                        const val = (rowA * cIdx) % 26;
                        const isOne = val === 1;

                        return (
                          <div
                            key={cIdx}
                            className={`p-1 transition-all ${
                              isOne
                                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                                : isSelectedA
                                ? 'bg-[#222222] text-[#FF3E00]'
                                : rowCoprime
                                ? 'bg-[#0A0A0A] text-zinc-400 hover:bg-[#1C1C1C]'
                                : 'bg-[#0A0A0A]/40 text-zinc-600'
                            }`}
                          >
                            {val}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* SUB-TAB 4: 2DES & 3DES Feistel Architecture */}
      {selectedTab === 'twodes' && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-6">
            <div className="border-b border-[#262626] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-mono-code font-bold text-amber-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>2DES & 3DES MULTI-STAGE CASCADING PIPELINE</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  Feistel cipher block transforms: 64-bit blocks with 16 Feistel rounds and cascading encryption stages.
                </p>
              </div>
              <span className="text-[10px] font-mono-code px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full font-bold">
                FIPS PUB 46-3 & ANSI X9.52
              </span>
            </div>

            {/* Live Pipeline Parameter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl font-mono-code text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-400 uppercase font-bold">Plaintext (64-bit Hex):</label>
                <input
                  type="text"
                  maxLength={16}
                  value={feistelP}
                  onChange={(e) => setFeistelP(e.target.value.toUpperCase())}
                  className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-white rounded-xl focus:border-amber-400 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-amber-400 uppercase font-bold">Key 1 (64-bit Hex):</label>
                <input
                  type="text"
                  maxLength={16}
                  value={feistelK1}
                  onChange={(e) => setFeistelK1(e.target.value.toUpperCase())}
                  className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-amber-400 rounded-xl focus:border-amber-400 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-sky-400 uppercase font-bold">Key 2 (64-bit Hex):</label>
                <input
                  type="text"
                  maxLength={16}
                  value={feistelK2}
                  onChange={(e) => setFeistelK2(e.target.value.toUpperCase())}
                  className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-sky-400 rounded-xl focus:border-sky-400 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-emerald-400 uppercase font-bold">Key 3 (3DES Stage 3):</label>
                <input
                  type="text"
                  maxLength={16}
                  value={feistelK3}
                  onChange={(e) => setFeistelK3(e.target.value.toUpperCase())}
                  className="w-full bg-[#141414] border border-[#333] px-3 py-1.5 text-emerald-400 rounded-xl focus:border-emerald-400 outline-none"
                />
              </div>
            </div>

            {/* Calculations */}
            {(() => {
              const cleanP = feistelP.padEnd(16, '0').slice(0, 16);
              const cleanK1 = feistelK1.padEnd(16, '0').slice(0, 16);
              const cleanK2 = feistelK2.padEnd(16, '0').slice(0, 16);
              const cleanK3 = feistelK3.padEnd(16, '0').slice(0, 16);

              const singleDes = desEncryptHex(cleanP, cleanK1);
              const twoDesRes = twoDesEncryptHex(cleanP, cleanK1, cleanK2);
              const threeDesRes = threeDesEncryptHex(cleanP, cleanK1, cleanK2, cleanK3);
              const isBackwardCompat = cleanK1 === cleanK2 && cleanK2 === cleanK3;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 2DES Diagram & Equations */}
                  <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-code font-bold text-amber-400 uppercase">
                        2DES CASCADING PIPELINE
                      </span>
                      <span className="text-[10px] font-mono-code text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                        VULNERABLE (MITM)
                      </span>
                    </div>

                    <div className="p-3 bg-[#141414] border border-[#333] rounded-xl text-xs font-mono-code space-y-2">
                      <div className="text-zinc-400">Formula: <span className="text-white font-bold">C = E_K2( E_K1(P) )</span></div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>P (Input):</span>
                        <span className="font-bold text-white">{cleanP}</span>
                      </div>
                      <div className="flex items-center justify-between text-amber-400">
                        <span>Stage 1 M = E_K1(P):</span>
                        <span className="font-bold">{twoDesRes.intermediate}</span>
                      </div>
                      <div className="flex items-center justify-between text-sky-400">
                        <span>Stage 2 C = E_K2(M):</span>
                        <span className="font-bold">{twoDesRes.ciphertext}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl text-xs text-zinc-300 space-y-1">
                      <strong className="text-amber-400 block font-mono-code">Why 2DES does NOT give 112-bit security:</strong>
                      <p className="text-[11px] font-sans leading-relaxed text-zinc-400">
                        An attacker knows (P, C). They compute table of <span className="text-amber-300 font-mono-code">E_K1(P)</span> for all 2⁵⁶ keys K1, and look up matching <span className="text-sky-300 font-mono-code">D_K2(C)</span> for candidate keys K2. Match indicates the correct (K1, K2) pair in only <strong>2⁵⁷ operations</strong> instead of 2¹¹²!
                      </p>
                    </div>
                  </div>

                  {/* 3DES Diagram & Equations */}
                  <div className="bg-[#0A0A0A] border border-[#262626] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-code font-bold text-emerald-400 uppercase">
                        3DES (EDE) PIPELINE
                      </span>
                      <button
                        onClick={() => {
                          setFeistelK2(feistelK1);
                          setFeistelK3(feistelK1);
                        }}
                        className="text-[10px] font-mono-code text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-500/30 transition-colors"
                      >
                        Set K1 = K2 = K3
                      </button>
                    </div>

                    <div className="p-3 bg-[#141414] border border-[#333] rounded-xl text-xs font-mono-code space-y-2">
                      <div className="text-zinc-400">Formula: <span className="text-white font-bold">C = E_K3( D_K2( E_K1(P) ) )</span></div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>Stage 1 E_K1(P):</span>
                        <span className="font-bold text-amber-400">{threeDesRes.stage1}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>Stage 2 D_K2(Stage 1):</span>
                        <span className="font-bold text-sky-400">{threeDesRes.stage2}</span>
                      </div>
                      <div className="flex items-center justify-between text-zinc-300">
                        <span>Stage 3 E_K3(Stage 2):</span>
                        <span className="font-bold text-emerald-400">{threeDesRes.ciphertext}</span>
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl text-xs space-y-1 border ${
                      isBackwardCompat ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-[#141414] border-[#333] text-zinc-300'
                    }`}>
                      <strong className="block font-mono-code">
                        {isBackwardCompat ? '✓ Backward Compatibility Active!' : 'Backward Compatibility Feature (EDE):'}
                      </strong>
                      <p className="text-[11px] font-sans leading-relaxed text-zinc-400">
                        When K1 = K2, Stage 2 Decryption perfectly cancels Stage 1 Encryption: <span className="font-mono-code text-white">D_K1(E_K1(P)) = P</span>. The entire pipeline reduces to standard Single DES: <span className="font-mono-code text-emerald-400">E_K3(P) = {singleDes}</span>!
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: AES Galois Field GF(2^8) and S-Box Matrix */}
      {selectedTab === 'aes' && (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-[#262626] p-6 shadow-xl space-y-6">
            <div className="border-b border-[#262626] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-mono-code font-bold text-cyan-400 uppercase tracking-[0.15em] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>AES GALOIS FIELD GF(2⁸) ARITHMETIC & RIJNDAEL S-BOX</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-sans">
                  Arithmetic modulo irreducible polynomial m(x) = x⁸ + x⁴ + x³ + x + 1 (0x11B) and non-linear S-Box mappings.
                </p>
              </div>
              <span className="text-[10px] font-mono-code px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full font-bold">
                NIST FIPS 197 Standard
              </span>
            </div>

            {/* Interactive GF(2^8) Multiplier */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-[#0A0A0A] border border-[#262626] rounded-2xl p-5 space-y-4">
                <span className="text-xs font-mono-code font-bold text-cyan-400 uppercase block">
                  GF(2⁸) POLYNOMIAL MULTIPLIER
                </span>
                <p className="text-xs text-zinc-400 font-sans">
                  Multiplies two bytes as polynomials in GF(2)[x] modulo x⁸ + x⁴ + x³ + x + 1 using xtime.
                </p>

                <div className="grid grid-cols-2 gap-3 font-mono-code text-xs">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Byte A (Hex):</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={gfByteA}
                      onChange={(e) => setGfByteA(e.target.value.toUpperCase())}
                      className="w-full bg-[#141414] border border-[#333] px-3 py-2 text-cyan-300 font-bold rounded-xl focus:border-cyan-400 outline-none text-center text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase font-bold">Byte B (Hex):</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={gfByteB}
                      onChange={(e) => setGfByteB(e.target.value.toUpperCase())}
                      className="w-full bg-[#141414] border border-[#333] px-3 py-2 text-cyan-300 font-bold rounded-xl focus:border-cyan-400 outline-none text-center text-sm"
                    />
                  </div>
                </div>

                {(() => {
                  const intA = parseInt(gfByteA || '0', 16) & 0xff;
                  const intB = parseInt(gfByteB || '0', 16) & 0xff;
                  const prod = gfMul(intA, intB);
                  const xtimeA = xtime(intA);

                  return (
                    <div className="p-4 bg-[#141414] border border-[#333] rounded-xl font-mono-code text-xs space-y-2">
                      <div className="flex justify-between text-zinc-300">
                        <span>A: 0x{intA.toString(16).padStart(2, '0').toUpperCase()}</span>
                        <span className="text-zinc-500">{intA.toString(2).padStart(8, '0')}₂</span>
                      </div>
                      <div className="flex justify-between text-zinc-300">
                        <span>B: 0x{intB.toString(16).padStart(2, '0').toUpperCase()}</span>
                        <span className="text-zinc-500">{intB.toString(2).padStart(8, '0')}₂</span>
                      </div>
                      <div className="flex justify-between text-amber-400 pt-1 border-t border-[#262626]">
                        <span>xtime(A) = A · 0x02:</span>
                        <span className="font-bold">0x{xtimeA.toString(16).padStart(2, '0').toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between text-cyan-400 font-bold text-sm pt-1 border-t border-[#262626]">
                        <span>A ⊗ B mod 0x11B:</span>
                        <span className="text-white bg-cyan-600/30 px-2 py-0.5 rounded">0x{prod.toString(16).padStart(2, '0').toUpperCase()}</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="text-[11px] text-zinc-400 font-sans leading-relaxed bg-[#141414] p-3 rounded-xl border border-[#222]">
                  <strong className="text-cyan-400 font-mono-code">MixColumns Matrix:</strong>
                  In AES MixColumns, each column is multiplied by the constant matrix with entries <span className="font-mono-code text-white">0x02, 0x03, 0x01, 0x01</span> in GF(2⁸).
                </div>
              </div>

              {/* AES S-Box 16x16 Interactive Matrix */}
              <div className="lg:col-span-2 bg-[#0A0A0A] border border-[#262626] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code font-bold text-cyan-400 uppercase">
                    AES RIJNDAEL S-BOX (16×16 LOOKUP TABLE)
                  </span>
                  {sboxHoverByte !== null && (
                    <span className="text-xs font-mono-code text-white">
                      Byte <strong className="text-amber-400">0x{sboxHoverByte.toString(16).padStart(2, '0').toUpperCase()}</strong> ➔ S-Box = <strong className="text-cyan-400">0x{AES_SBOX[sboxHoverByte].toString(16).padStart(2, '0').toUpperCase()}</strong>
                    </span>
                  )}
                </div>

                <div className="overflow-x-auto">
                  <div
                    className="grid gap-0.5 text-[9px] font-mono-code text-center select-none"
                    style={{ gridTemplateColumns: 'repeat(17, minmax(20px, 1fr))' }}
                  >
                    <div className="p-1 font-bold bg-[#141414] text-zinc-600">y \ x</div>
                    {Array.from({ length: 16 }).map((_, c) => (
                      <div key={c} className="p-1 font-bold bg-[#141414] text-cyan-400">
                        {c.toString(16).toUpperCase()}
                      </div>
                    ))}

                    {Array.from({ length: 16 }).map((_, r) => (
                      <React.Fragment key={r}>
                        <div className="p-1 font-bold bg-[#141414] text-amber-400">
                          {r.toString(16).toUpperCase()}
                        </div>
                        {Array.from({ length: 16 }).map((_, c) => {
                          const byteVal = r * 16 + c;
                          const sboxVal = AES_SBOX[byteVal];
                          const isHovered = sboxHoverByte === byteVal;
                          return (
                            <div
                              key={c}
                              onMouseEnter={() => setSboxHoverByte(byteVal)}
                              className={`p-1 transition-colors cursor-pointer rounded-sm ${
                                isHovered
                                  ? 'bg-cyan-500 text-black font-extrabold shadow-sm'
                                  : 'bg-[#121212] text-zinc-300 hover:bg-[#202020]'
                              }`}
                              title={`Input: 0x${byteVal.toString(16).padStart(2, '0').toUpperCase()} -> SBox: 0x${sboxVal.toString(16).padStart(2, '0').toUpperCase()}`}
                            >
                              {sboxVal.toString(16).padStart(2, '0').toUpperCase()}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-[#141414] border border-[#262626] rounded-xl text-xs text-zinc-400 font-sans leading-relaxed">
                  <strong className="text-white font-mono-code">S-Box Construction:</strong> Each byte is mapped to its multiplicative inverse in <span className="font-mono-code text-cyan-300">GF(2⁸)</span> (with 0 mapped to 0), followed by an affine transformation over <span className="font-mono-code text-cyan-300">GF(2)</span> with constant vector <span className="font-mono-code text-amber-300">0x63</span> to prevent fixed-point and linear attacks.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

