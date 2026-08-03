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
import { Calculator, Sparkles, HelpCircle, ArrowRight, Sliders, Layers, Grid, Binary } from 'lucide-react';
import { CipherMethod } from '../types';

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
  const [selectedTab, setSelectedTab] = useState<'clock' | 'vigenere' | 'playfair' | 'hill' | 'euclid' | 'heatmap'>('clock');

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
              <div className="grid grid-cols-27 gap-0.5 text-[10px] font-mono-code text-center select-none">
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
                            className="p-1 bg-[#0A0A0A] text-zinc-400 hover:bg-sky-500 hover:text-black hover:font-bold transition-colors"
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
              <div className="grid grid-cols-27 gap-0.5 text-[10px] font-mono-code text-center select-none">
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
    </div>
  );
};

