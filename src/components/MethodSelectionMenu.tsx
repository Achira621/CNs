import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  Binary,
  Grid,
  Layers,
  ArrowRight,
  Sparkles,
  GitFork,
  Cpu,
  Lock,
  ChevronRight,
} from 'lucide-react';
import { CipherMethod, CipherCategory } from '../types';

interface MethodSelectionMenuProps {
  onSelectMethod: (method: CipherMethod) => void;
  currentMethod: CipherMethod;
}

interface MethodCardInfo {
  id: CipherMethod;
  name: string;
  category: CipherCategory;
  tagline: string;
  formula: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  borderHover: string;
}

export const METHOD_CARDS: MethodCardInfo[] = [
  // Monoalphabetic
  {
    id: 'caesar_default',
    name: 'Caesar Cipher',
    category: 'monoalphabetic',
    tagline: 'Fixed Shift Substitution',
    formula: 'C = (P + 3) mod 26',
    description: 'Classic shift cipher using a fixed offset of 3 positions in the alphabet.',
    icon: Lock,
    gradient: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    borderHover: 'hover:border-amber-500/60 hover:shadow-amber-500/10',
  },
  {
    id: 'multiplicative',
    name: 'Multiplicative Cipher',
    category: 'monoalphabetic',
    tagline: 'Modular Multiplication',
    formula: 'C = (P × a) mod 26',
    description: 'Encrypts letters by multiplying plaintext index with key scalar a (coprime to 26).',
    icon: Cpu,
    gradient: 'from-orange-500/20 to-red-500/20 text-orange-400',
    borderHover: 'hover:border-orange-500/60 hover:shadow-orange-500/10',
  },
  {
    id: 'affine',
    name: 'Affine Cipher',
    category: 'monoalphabetic',
    tagline: 'Linear Algebraic Substitution',
    formula: 'C = (aP + b) mod 26',
    description: 'Combines multiplicative and additive key vectors (a, b) for modular linear mapping.',
    icon: KeyRound,
    gradient: 'from-[#FF3E00]/20 to-amber-500/20 text-[#FF3E00]',
    borderHover: 'hover:border-[#FF3E00]/60 hover:shadow-[#FF3E00]/10',
  },
  // Polyalphabetic
  {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    category: 'polyalphabetic',
    tagline: 'Keyword Polyalphabetic Shift',
    formula: 'Cᵢ = (Pᵢ + Kᵢ) mod 26',
    description: 'Uses a repeating keyword to shift each plaintext character by a unique alphabetic offset.',
    icon: Layers,
    gradient: 'from-sky-500/20 to-indigo-500/20 text-sky-400',
    borderHover: 'hover:border-sky-500/60 hover:shadow-sky-500/10',
  },
  {
    id: 'playfair',
    name: 'Playfair Cipher',
    category: 'polyalphabetic',
    tagline: 'Digraph 5×5 Matrix Cipher',
    formula: 'Rule: Row / Col / Rectangle',
    description: 'Encrypts letter pairs (digraphs) using a 5×5 key grid matrix and geometric rules.',
    icon: Grid,
    gradient: 'from-purple-500/20 to-pink-500/20 text-purple-400',
    borderHover: 'hover:border-purple-500/60 hover:shadow-purple-500/10',
  },
  {
    id: 'hill',
    name: 'Hill Cipher',
    category: 'polyalphabetic',
    tagline: 'Linear Algebra Matrix Cipher',
    formula: 'C = (K · P) mod 26',
    description: 'Block cipher multiplying plaintext letter vectors by a 2×2 key matrix modulo 26.',
    icon: Binary,
    gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    borderHover: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
  },
  // Block Ciphers
  {
    id: 'ecb',
    name: 'ECB (Electronic Codebook)',
    category: 'block',
    tagline: 'Direct Block Encryption',
    formula: 'Cᵢ = E_K(Pᵢ)',
    description: 'Encrypts each plaintext block independently. Identical plaintext blocks produce identical ciphertext blocks.',
    icon: Binary,
    gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    borderHover: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
  },
  {
    id: 'cbc',
    name: 'CBC (Cipher Block Chaining)',
    category: 'block',
    tagline: 'Chained Block XOR with IV',
    formula: 'Cᵢ = E_K(Pᵢ ⊕ Cᵢ₋₁)',
    description: 'XORs each plaintext block with previous ciphertext block (or IV for block 1) before encryption.',
    icon: Layers,
    gradient: 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
    borderHover: 'hover:border-cyan-500/60 hover:shadow-cyan-500/10',
  },
  {
    id: 'cfb',
    name: 'CFB (Cipher Feedback)',
    category: 'block',
    tagline: 'Self-Synchronizing Stream Mode',
    formula: 'Cᵢ = Pᵢ ⊕ E_K(Cᵢ₋₁)',
    description: 'Enciphered previous ciphertext block forms keystream XORed with plaintext block.',
    icon: Cpu,
    gradient: 'from-indigo-500/20 to-violet-500/20 text-indigo-400',
    borderHover: 'hover:border-indigo-500/60 hover:shadow-indigo-500/10',
  },
  {
    id: 'ofb',
    name: 'OFB (Output Feedback)',
    category: 'block',
    tagline: 'Synchronous Keystream Mode',
    formula: 'Oᵢ = E_K(Oᵢ₋₁), Cᵢ = Pᵢ ⊕ Oᵢ',
    description: 'Generates independent keystream by repeatedly encrypting IV vector.',
    icon: GitFork,
    gradient: 'from-purple-500/20 to-fuchsia-500/20 text-purple-400',
    borderHover: 'hover:border-purple-500/60 hover:shadow-purple-500/10',
  },
  {
    id: 'ctr',
    name: 'CTR (Counter Mode)',
    category: 'block',
    tagline: 'Parallelizable Counter Stream',
    formula: 'Oᵢ = E_K(Nonce ∥ i), Cᵢ = Pᵢ ⊕ Oᵢ',
    description: 'Encrypts successive counter values to produce keystream. Fully parallelizable.',
    icon: Sparkles,
    gradient: 'from-pink-500/20 to-rose-500/20 text-pink-400',
    borderHover: 'hover:border-pink-500/60 hover:shadow-pink-500/10',
  },
  // Modern Standards
  {
    id: 'des',
    name: 'Single DES (FIPS 46-3)',
    category: 'modern',
    tagline: '16-Round Feistel Network',
    formula: 'C = IP⁻¹(R₁₆ ∥ L₁₆)',
    description: 'NIST block cipher standard using 64-bit blocks, 16 Feistel rounds, 8 non-linear S-Boxes, and 56-bit effective key.',
    icon: Lock,
    gradient: 'from-amber-500/20 to-orange-500/20 text-amber-400',
    borderHover: 'hover:border-amber-500/60 hover:shadow-amber-500/10',
  },
  {
    id: '2des',
    name: 'Double DES (2DES)',
    category: 'modern',
    tagline: 'Cascading Stage & MITM Vulnerability',
    formula: 'C = E_K2(E_K1(P))',
    description: 'Two sequential DES encryptions with two 56-bit keys (112 bits). Vulnerable to Meet-in-the-Middle attack (2⁵⁷ steps).',
    icon: ShieldCheck,
    gradient: 'from-rose-500/20 to-amber-500/20 text-rose-400',
    borderHover: 'hover:border-rose-500/60 hover:shadow-rose-500/10',
  },
  {
    id: '3des',
    name: 'Triple DES (3DES / TDEA)',
    category: 'modern',
    tagline: 'EDE Pipeline & Legacy Compatibility',
    formula: 'C = E_K3(D_K2(E_K1(P)))',
    description: 'Encrypt-Decrypt-Encrypt pipeline providing 112-bit effective MITM security with backward compatibility when K1=K2=K3.',
    icon: KeyRound,
    gradient: 'from-emerald-500/20 to-teal-500/20 text-emerald-400',
    borderHover: 'hover:border-emerald-500/60 hover:shadow-emerald-500/10',
  },
  {
    id: 'aes',
    name: 'AES (Rijndael FIPS 197)',
    category: 'modern',
    tagline: 'Galois Field SPN Architecture',
    formula: 'State = (SubBytes ∘ ShiftRows ∘ MixColumns ∘ AddRoundKey)¹⁰',
    description: 'Standard 128-bit block cipher with 10/12/14 rounds operating over GF(2⁸) 4×4 state matrices with 128/192/256-bit keys.',
    icon: Cpu,
    gradient: 'from-cyan-500/20 to-blue-500/20 text-cyan-400',
    borderHover: 'hover:border-cyan-500/60 hover:shadow-cyan-500/10',
  },
];

export const MethodSelectionMenu: React.FC<MethodSelectionMenuProps> = ({
  onSelectMethod,
  currentMethod,
}) => {
  const [activeBranch, setActiveBranch] = useState<'all' | 'monoalphabetic' | 'polyalphabetic' | 'block' | 'modern'>('all');

  const monoMethods = METHOD_CARDS.filter((m) => m.category === 'monoalphabetic');
  const polyMethods = METHOD_CARDS.filter((m) => m.category === 'polyalphabetic');
  const blockMethods = METHOD_CARDS.filter((m) => m.category === 'block');
  const modernMethods = METHOD_CARDS.filter((m) => m.category === 'modern');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-[#FF3E00]/10 via-purple-500/10 to-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Header section */}
      <div className="max-w-6xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#181818] border border-[#333] rounded-full text-xs font-mono-code text-amber-400 shadow-md">
          <GitFork className="w-4 h-4 text-[#FF3E00]" />
          <span>CIPHER TAXONOMY ARCHITECTURE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-display font-bold tracking-tight text-white">
          Cryptography Cipher Taxonomy Tree
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-sans leading-relaxed">
          Explore Classical Monoalphabetic & Polyalphabetic ciphers, Block Modes, and Modern Standards (DES, 2DES, 3DES, AES).
        </p>

        {/* Branch Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setActiveBranch('all')}
            className={`px-4 py-2 text-xs font-mono-code font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeBranch === 'all'
                ? 'bg-[#FF3E00] text-white shadow-lg shadow-[#FF3E00]/25'
                : 'bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]'
            }`}
          >
            All Methods (15)
          </button>
          <button
            onClick={() => setActiveBranch('modern')}
            className={`px-4 py-2 text-xs font-mono-code font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeBranch === 'modern'
                ? 'bg-cyan-500 text-black font-extrabold shadow-lg shadow-cyan-500/25'
                : 'bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]'
            }`}
          >
            Modern Standards (4)
          </button>
          <button
            onClick={() => setActiveBranch('monoalphabetic')}
            className={`px-4 py-2 text-xs font-mono-code font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeBranch === 'monoalphabetic'
                ? 'bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/25'
                : 'bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]'
            }`}
          >
            Monoalphabetic (3)
          </button>
          <button
            onClick={() => setActiveBranch('polyalphabetic')}
            className={`px-4 py-2 text-xs font-mono-code font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeBranch === 'polyalphabetic'
                ? 'bg-sky-500 text-black font-extrabold shadow-lg shadow-sky-500/25'
                : 'bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]'
            }`}
          >
            Polyalphabetic (3)
          </button>
          <button
            onClick={() => setActiveBranch('block')}
            className={`px-4 py-2 text-xs font-mono-code font-bold uppercase tracking-wider rounded-xl transition-all ${
              activeBranch === 'block'
                ? 'bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/25'
                : 'bg-[#141414] text-zinc-400 hover:text-white border border-[#262626]'
            }`}
          >
            Block Modes (5)
          </button>
        </div>
      </div>

      {/* Main Visual Hierarchy Tree */}
      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* ROOT NODE: Substitution Cipher */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF3E00] via-purple-500 to-sky-500 rounded-[1.5rem] blur opacity-40 group-hover:opacity-75 transition duration-500" />
            <div className="relative px-8 py-5 bg-[#141414] border border-[#333] rounded-[1.4rem] shadow-2xl flex items-center gap-4">
              {/* Squircle Badge */}
              <div className="w-12 h-12 rounded-[1.1rem] bg-gradient-to-br from-[#FF3E00]/30 via-amber-500/20 to-purple-500/30 border border-[#FF3E00]/40 flex items-center justify-center text-[#FF3E00] shadow-md shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-[#FF3E00] block">
                  TAXONOMY ROOT NODE
                </span>
                <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-white">
                  Substitution Ciphers
                </h2>
                <p className="text-xs text-zinc-400 font-sans">
                  Replacing plaintext units with ciphertext units based on defined key mappings
                </p>
              </div>
            </div>
          </div>

          {/* Central Vertical Stem Line */}
          <div className="w-0.5 h-10 bg-gradient-to-b from-[#FF3E00]/60 via-purple-500/60 to-zinc-700 my-1" />
        </div>

        {/* BRANCH LEVEL 1: Monoalphabetic vs Polyalphabetic */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* BRANCH 1: MONOALPHABETIC CIPHERS */}
          {(activeBranch === 'all' || activeBranch === 'monoalphabetic') && (
            <div className="bg-[#111111] border border-[#242424] rounded-3xl p-6 shadow-2xl relative space-y-6">
              {/* Branch Header Node */}
              <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div className="flex items-center gap-3">
                  {/* Squircle Badge */}
                  <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-md">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-amber-400 block">
                      PRIMARY BRANCH 01
                    </span>
                    <h3 className="text-lg font-serif-display font-bold text-white">
                      Monoalphabetic Ciphers
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[11px] font-mono-code font-bold">
                  Single Mapping Rule
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Each letter in the plaintext is mapped to a single, fixed ciphertext character throughout the entire message.
              </p>

              {/* Leaves Grid */}
              <div className="grid grid-cols-1 gap-4">
                {monoMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = currentMethod === method.id;

                  return (
                    <div
                      key={method.id}
                      onClick={() => onSelectMethod(method.id)}
                      className={`group relative bg-[#161616] border ${
                        isSelected
                          ? 'border-[#FF3E00] shadow-lg shadow-[#FF3E00]/20 bg-[#1C1A1A]'
                          : 'border-[#282828]'
                      } ${method.borderHover} rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.01]`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Squircle Icon Badge */}
                          <div
                            className={`w-11 h-11 rounded-[1.1rem] bg-gradient-to-br ${method.gradient} border border-white/10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-serif-display font-bold text-white group-hover:text-[#FF3E00] transition-colors">
                                {method.name}
                              </h4>
                              {isSelected && (
                                <span className="px-2 py-0.5 bg-[#FF3E00] text-white text-[9px] font-mono-code font-bold uppercase rounded-md">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-amber-400/90 font-mono-code font-semibold block">
                              {method.tagline}
                            </span>
                          </div>
                        </div>

                        {/* Math Formula Tag */}
                        <div className="px-2.5 py-1 bg-[#0A0A0A] border border-[#2D2D2D] rounded-xl text-[11px] font-mono-code text-zinc-300 font-bold shrink-0">
                          {method.formula}
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-zinc-400 font-sans leading-relaxed">
                        {method.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between text-xs font-mono-code font-bold text-zinc-400 group-hover:text-white">
                        <span>Launch Studio</span>
                        <ArrowRight className="w-4 h-4 text-[#FF3E00] transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BRANCH 2: POLYALPHABETIC CIPHERS */}
          {(activeBranch === 'all' || activeBranch === 'polyalphabetic') && (
            <div className="bg-[#111111] border border-[#242424] rounded-3xl p-6 shadow-2xl relative space-y-6">
              {/* Branch Header Node */}
              <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div className="flex items-center gap-3">
                  {/* Squircle Badge */}
                  <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-md">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-sky-400 block">
                      PRIMARY BRANCH 02
                    </span>
                    <h3 className="text-lg font-serif-display font-bold text-white">
                      Polyalphabetic Ciphers
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 rounded-full text-[11px] font-mono-code font-bold">
                  Dynamic Multi-Mapping
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Uses multiple substitution alphabets or key matrices across the message to thwart simple frequency cryptanalysis.
              </p>

              {/* Leaves Grid */}
              <div className="grid grid-cols-1 gap-4">
                {polyMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = currentMethod === method.id;

                  return (
                    <div
                      key={method.id}
                      onClick={() => onSelectMethod(method.id)}
                      className={`group relative bg-[#161616] border ${
                        isSelected
                          ? 'border-sky-500 shadow-lg shadow-sky-500/20 bg-[#171B22]'
                          : 'border-[#282828]'
                      } ${method.borderHover} rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.01]`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {/* Squircle Icon Badge */}
                          <div
                            className={`w-11 h-11 rounded-[1.1rem] bg-gradient-to-br ${method.gradient} border border-white/10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-serif-display font-bold text-white group-hover:text-sky-400 transition-colors">
                                {method.name}
                              </h4>
                              {isSelected && (
                                <span className="px-2 py-0.5 bg-sky-500 text-black text-[9px] font-mono-code font-bold uppercase rounded-md">
                                  ACTIVE
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-sky-400/90 font-mono-code font-semibold block">
                              {method.tagline}
                            </span>
                          </div>
                        </div>

                        {/* Math Formula Tag */}
                        <div className="px-2.5 py-1 bg-[#0A0A0A] border border-[#2D2D2D] rounded-xl text-[11px] font-mono-code text-zinc-300 font-bold shrink-0">
                          {method.formula}
                        </div>
                      </div>

                      <p className="mt-3 text-xs text-zinc-400 font-sans leading-relaxed">
                        {method.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between text-xs font-mono-code font-bold text-zinc-400 group-hover:text-white">
                        <span>Launch Studio</span>
                        <ArrowRight className="w-4 h-4 text-sky-400 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BRANCH 3: BLOCK CIPHERS */}
          {(activeBranch === 'all' || activeBranch === 'block') && (
            <div className="bg-[#111111] border border-[#242424] rounded-3xl p-6 shadow-2xl relative space-y-6 lg:col-span-2">
              {/* Branch Header Node */}
              <div className="flex items-center justify-between border-b border-[#222] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[1rem] bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-md">
                    <Binary className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-emerald-400 block">
                      PRIMARY BRANCH 03
                    </span>
                    <h3 className="text-lg font-serif-display font-bold text-white">
                      Block Cipher Modes (ECB, CBC, CFB, OFB, CTR)
                    </h3>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[11px] font-mono-code font-bold">
                  Fixed-Length Block Operations
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Processes data in fixed-size blocks using feedback loops, initialization vectors (IV), XOR streaming, and counter values.
              </p>

              {/* Leaves Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blockMethods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = currentMethod === method.id;

                  return (
                    <div
                      key={method.id}
                      onClick={() => onSelectMethod(method.id)}
                      className={`group relative bg-[#161616] border ${
                        isSelected
                          ? 'border-emerald-500 shadow-lg shadow-emerald-500/20 bg-[#141C18]'
                          : 'border-[#282828]'
                      } ${method.borderHover} rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-[1rem] bg-gradient-to-br ${method.gradient} border border-white/10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-serif-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                                  {method.name}
                                </h4>
                                {isSelected && (
                                  <span className="px-2 py-0.5 bg-emerald-500 text-black text-[9px] font-mono-code font-bold uppercase rounded-md">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-emerald-400/90 font-mono-code font-semibold block">
                                {method.tagline}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 inline-block px-2.5 py-1 bg-[#0A0A0A] border border-[#2D2D2D] rounded-xl text-[11px] font-mono-code text-zinc-300 font-bold">
                          {method.formula}
                        </div>

                        <p className="mt-3 text-xs text-zinc-400 font-sans leading-relaxed">
                          {method.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between text-xs font-mono-code font-bold text-zinc-400 group-hover:text-white">
                        <span>Launch Block Studio</span>
                        <ArrowRight className="w-4 h-4 text-emerald-400 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* BRANCH 4: Modern Standards (DES, 2DES, 3DES, AES) */}
          {(activeBranch === 'all' || activeBranch === 'modern') && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-serif-display font-bold text-white flex items-center gap-2">
                    Modern Block Cipher Standards
                    <span className="text-xs font-mono-code px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold">
                      Branch: Modern (4)
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-sans">
                    FIPS certified standards: Feistel networks, Meet-in-the-Middle resistance, EDE pipelines, and Rijndael Galois Field arithmetic.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {modernMethods.map((method) => {
                  const Icon = method.icon;
                  const isCurrent = currentMethod === method.id;

                  return (
                    <div
                      key={method.id}
                      onClick={() => onSelectMethod(method.id)}
                      className={`group relative bg-[#141414] border rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isCurrent
                          ? 'border-cyan-500 shadow-xl shadow-cyan-500/10 scale-[1.02]'
                          : `border-[#262626] ${method.borderHover}`
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${method.gradient}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-base font-serif-display font-bold text-white group-hover:text-cyan-400 transition-colors">
                                  {method.name}
                                </h4>
                                {isCurrent && (
                                  <span className="px-2 py-0.5 text-[9px] font-mono-code font-bold uppercase rounded bg-cyan-500 text-black">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-cyan-400 font-mono-code font-semibold block">
                                {method.tagline}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 inline-block px-2.5 py-1 bg-[#0A0A0A] border border-[#2D2D2D] rounded-xl text-[11px] font-mono-code text-zinc-300 font-bold">
                          {method.formula}
                        </div>

                        <p className="mt-3 text-xs text-zinc-400 font-sans leading-relaxed">
                          {method.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between text-xs font-mono-code font-bold text-zinc-400 group-hover:text-white">
                        <span>Launch Cipher Studio</span>
                        <ArrowRight className="w-4 h-4 text-cyan-400 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
