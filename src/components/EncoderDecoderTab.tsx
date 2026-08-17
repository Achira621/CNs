import React, { useState, useMemo } from 'react';
import {
  encryptText,
  decryptText,
  validateKeyA,
  modInverse,
  getAlphabetMappingTable,
  getStepByStepVector,
  getValidKeysA,
  CIPHER_METHODS,
} from '../utils/affineMath';
import {
  vigenereCipher,
  playfairCipher,
  hillCipher,
  generatePlayfairMatrix,
  getHillDeterminant,
  isHillKeyValid,
  getHillInverseMatrix,
  HillMatrixKey,
} from '../utils/polyMath';
import { processBlockCipher, BlockCipherResult } from '../utils/blockCipherMath';
import {
  ArrowRightLeft,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  Lock,
  LockKeyhole,
  Layers,
  Grid,
  Binary,
} from 'lucide-react';
import { CipherMethod } from '../types';

interface EncoderDecoderTabProps {
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
  inputText: string;
  setInputText: (text: string) => void;
  onOpenAITutorWithPrompt?: (prompt: string) => void;
}

export const EncoderDecoderTab: React.FC<EncoderDecoderTabProps> = ({
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
  inputText,
  setInputText,
  onOpenAITutorWithPrompt,
}) => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [copied, setCopied] = useState(false);
  const [showStepVector, setShowStepVector] = useState(true);
  const [preserveSpaces, setPreserveSpaces] = useState(true);

  // Block cipher states
  const [blockKey, setBlockKey] = useState('CYBERKEY');
  const [blockIv, setBlockIv] = useState('INITVEC1');
  const [blockNonce, setBlockNonce] = useState(100);
  const [blockSize, setBlockSize] = useState(4);

  const currentMethodInfo = CIPHER_METHODS[cipherMethod] || CIPHER_METHODS.affine;

  // Key validation
  const keyValidation = useMemo(() => validateKeyA(keyA, 26), [keyA]);
  const aInverse = useMemo(() => modInverse(keyA, 26), [keyA]);
  const validAs = useMemo(() => getValidKeysA(26), []);

  // Compute block cipher result dynamically
  const blockResult: BlockCipherResult | null = useMemo(() => {
    if (['ecb', 'cbc', 'cfb', 'ofb', 'ctr'].includes(cipherMethod)) {
      return processBlockCipher(
        mode,
        cipherMethod as 'ecb' | 'cbc' | 'cfb' | 'ofb' | 'ctr',
        inputText,
        blockKey,
        blockIv,
        blockNonce,
        blockSize
      );
    }
    return null;
  }, [cipherMethod, mode, inputText, blockKey, blockIv, blockNonce, blockSize]);

  // Compute output text dynamically
  const outputText = useMemo(() => {
    if (['ecb', 'cbc', 'cfb', 'ofb', 'ctr'].includes(cipherMethod) && blockResult) {
      return blockResult.ciphertext;
    }
    if (cipherMethod === 'vigenere') {
      return vigenereCipher(inputText, vigenereKey, mode).resultText;
    }
    if (cipherMethod === 'playfair') {
      return playfairCipher(inputText, playfairKey, mode).resultText;
    }
    if (cipherMethod === 'hill') {
      return hillCipher(inputText, hillMatrix, mode).resultText;
    }

    if (!keyValidation.isValid) {
      return `[ERROR: Key 'a' (${keyA}) is not coprime to 26! Please select a valid key 'a' like 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, or 25.]`;
    }
    if (mode === 'encrypt') {
      return encryptText(inputText, keyA, keyB, 26, preserveSpaces);
    } else {
      return decryptText(inputText, keyA, keyB, 26, preserveSpaces);
    }
  }, [
    cipherMethod,
    inputText,
    keyA,
    keyB,
    vigenereKey,
    playfairKey,
    hillMatrix,
    blockResult,
    mode,
    keyValidation.isValid,
    preserveSpaces,
  ]);

  // Compute character mapping table (A..Z)
  const mappingTable = useMemo(() => {
    return getAlphabetMappingTable(keyA, keyB, 26);
  }, [keyA, keyB]);

  // Compute step vector for input text
  const stepVector = useMemo(() => {
    if (!keyValidation.isValid) return [];
    return getStepByStepVector(inputText.slice(0, 30), keyA, keyB, mode, 26);
  }, [inputText, keyA, keyB, mode, keyValidation.isValid]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    setInputText(outputText.startsWith('[ERROR') ? '' : outputText);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Method Selection Bar */}
      {onCipherMethodChange && (
        <div className="bg-white border border-zinc-300 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono-code uppercase tracking-[0.15em] text-[#FF3E00] font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              SELECT CIPHER ALGORITHM
            </span>
            <span className="text-xs font-mono-code text-zinc-600 font-semibold px-3 py-1 bg-zinc-100 border border-zinc-300 rounded-full">
              {currentMethodInfo.formula}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(Object.keys(CIPHER_METHODS) as CipherMethod[]).map((methodKey) => {
              const mInfo = CIPHER_METHODS[methodKey];
              const isSelected = cipherMethod === methodKey;
              return (
                <button
                  key={methodKey}
                  onClick={() => onCipherMethodChange(methodKey)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-300 relative flex flex-col justify-between hover:scale-[1.02] ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-zinc-50 border-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-[#FF3E00] animate-ping" />
                  )}
                  <div>
                    <h4 className={`font-serif-display font-semibold text-sm ${isSelected ? 'text-white' : 'text-black'}`}>
                      {mInfo.name}
                    </h4>
                    <p className={`text-[11px] font-mono-code font-bold mt-1 ${isSelected ? 'text-amber-400' : 'text-[#FF3E00]'}`}>
                      {mInfo.formula}
                    </p>
                  </div>
                  <p className={`text-[11px] font-sans mt-2 line-clamp-2 ${isSelected ? 'text-zinc-300' : 'text-zinc-600'}`}>
                    {mInfo.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Top Banner & Control Panel */}
      <div className="bg-white border border-zinc-300 rounded-3xl p-6 shadow-md relative overflow-hidden space-y-6">
        {/* Accent top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF3E00] via-amber-500 to-[#FF3E00]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-[#FF3E00] flex items-center justify-center font-mono-code font-bold text-lg shadow-sm">
              🔑
            </div>
            <div>
              <span className="text-[10px] font-mono-code uppercase tracking-[0.2em] text-[#FF3E00] font-bold block">
                CRYPTO STUDIO PIPELINE
              </span>
              <h2 className="text-xl font-serif-display font-semibold text-black flex items-center gap-2">
                {currentMethodInfo.name}{' '}
                <span className="text-xs font-mono-code font-normal text-zinc-500">
                  (Category: {currentMethodInfo.category.toUpperCase()})
                </span>
              </h2>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 border border-zinc-200 rounded-full self-start md:self-auto">
            <button
              onClick={() => setMode('encrypt')}
              className={`px-5 py-2 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 ${
                mode === 'encrypt'
                  ? 'bg-black text-white shadow-md'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              🔒 Encrypt E(x)
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`px-5 py-2 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 ${
                mode === 'decrypt'
                  ? 'bg-black text-white shadow-md'
                  : 'text-zinc-600 hover:text-black'
              }`}
            >
              🔓 Decrypt D(y)
            </button>
          </div>
        </div>

        {/* Conditional Key Controls based on Cipher Method */}
        {['ecb', 'cbc', 'cfb', 'ofb', 'ctr'].includes(cipherMethod) && (
          <div className="bg-[#0A0A0A] p-5 border border-emerald-500/40 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-2">
                <Binary className="w-4 h-4" />
                <span>Block Cipher Mode Parameters ({cipherMethod.toUpperCase()})</span>
              </label>
              <span className="text-xs font-mono-code font-bold text-white bg-[#141414] px-3 py-1 border border-[#333] rounded-xl">
                Block Size: {blockSize} Bytes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-mono-code text-zinc-400 uppercase font-bold block mb-1">
                  Secret Key String
                </label>
                <input
                  type="text"
                  value={blockKey}
                  onChange={(e) => setBlockKey(e.target.value)}
                  placeholder="KEY..."
                  className="w-full bg-[#141414] text-white font-mono-code text-xs px-3 py-2 border border-[#333] focus:border-emerald-500 rounded-xl outline-none"
                />
              </div>

              {['cbc', 'cfb', 'ofb'].includes(cipherMethod) && (
                <div>
                  <label className="text-[10px] font-mono-code text-cyan-400 uppercase font-bold block mb-1">
                    Initialization Vector (IV)
                  </label>
                  <input
                    type="text"
                    value={blockIv}
                    onChange={(e) => setBlockIv(e.target.value)}
                    placeholder="IV VECTOR..."
                    className="w-full bg-[#141414] text-white font-mono-code text-xs px-3 py-2 border border-[#333] focus:border-cyan-500 rounded-xl outline-none"
                  />
                </div>
              )}

              {cipherMethod === 'ctr' && (
                <div>
                  <label className="text-[10px] font-mono-code text-pink-400 uppercase font-bold block mb-1">
                    Initial Counter (Nonce)
                  </label>
                  <input
                    type="number"
                    value={blockNonce}
                    onChange={(e) => setBlockNonce(Number(e.target.value))}
                    className="w-full bg-[#141414] text-white font-mono-code text-xs px-3 py-2 border border-[#333] focus:border-pink-500 rounded-xl outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono-code text-zinc-400 uppercase font-bold block mb-1">
                  Block Size (Bytes)
                </label>
                <select
                  value={blockSize}
                  onChange={(e) => setBlockSize(Number(e.target.value))}
                  className="w-full bg-[#141414] text-white font-mono-code text-xs px-3 py-2 border border-[#333] focus:border-emerald-500 rounded-xl outline-none"
                >
                  <option value={4}>4 Bytes (32-bit)</option>
                  <option value={8}>8 Bytes (64-bit)</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-sans">
              {cipherMethod === 'ecb' && 'ECB enciphers blocks independently. Same plaintext blocks output identical ciphertext blocks.'}
              {cipherMethod === 'cbc' && 'CBC XORs plaintext block with previous ciphertext block (or IV for block 1) before enciphering.'}
              {cipherMethod === 'cfb' && 'CFB enciphers previous ciphertext block to produce keystream XORed with plaintext block.'}
              {cipherMethod === 'ofb' && 'OFB generates independent keystream by encrypting IV repeatedly.'}
              {cipherMethod === 'ctr' && 'CTR enciphers incremental counter values to generate parallel keystream.'}
            </p>
          </div>
        )}

        {cipherMethod === 'vigenere' && (
          <div className="bg-[#0A0A0A] p-5 border border-sky-500/40 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-sky-400 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Vigenère Secret Keyword</span>
              </label>
              <span className="text-xs font-mono-code font-bold text-white bg-[#141414] px-3 py-1 border border-[#333] rounded-xl">
                Length: {vigenereKey.length}
              </span>
            </div>

            <input
              type="text"
              value={vigenereKey}
              onChange={(e) => setVigenereKey && setVigenereKey(e.target.value.toUpperCase())}
              placeholder="ENTER KEYWORD (E.G. SECRET)..."
              className="w-full bg-[#141414] text-white font-mono-code text-base px-4 py-3 border border-[#333] focus:border-sky-500 rounded-xl outline-none uppercase tracking-wider"
            />
            <p className="text-xs text-zinc-400 font-sans">
              The keyword repeats across the length of the message to shift each character individually.
            </p>
          </div>
        )}

        {cipherMethod === 'playfair' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0A0A] p-5 border border-purple-500/40 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-purple-400 flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  <span>Playfair Key Phrase</span>
                </label>
              </div>

              <input
                type="text"
                value={playfairKey}
                onChange={(e) => setPlayfairKey && setPlayfairKey(e.target.value.toUpperCase())}
                placeholder="ENTER KEY PHRASE..."
                className="w-full bg-[#141414] text-white font-mono-code text-base px-4 py-3 border border-[#333] focus:border-purple-500 rounded-xl outline-none uppercase tracking-wider"
              />
              <p className="text-xs text-zinc-400 font-sans">
                Generates a 5×5 key grid (merging I and J into one cell) to encrypt letter digraphs.
              </p>
            </div>

            {/* 5x5 Matrix Preview */}
            <div className="bg-[#0A0A0A] p-4 border border-[#262626] rounded-2xl flex flex-col items-center justify-center">
              <span className="text-[10px] font-mono-code text-purple-400 font-bold uppercase mb-2">
                5×5 Playfair Key Grid
              </span>
              <div className="grid grid-cols-5 gap-1.5 font-mono-code text-xs text-center font-bold">
                {generatePlayfairMatrix(playfairKey).map((row, rIdx) =>
                  row.map((cell, cIdx) => (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className="w-8 h-8 rounded-lg bg-[#141414] border border-[#333] flex items-center justify-center text-white hover:border-purple-500 transition-colors"
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {cipherMethod === 'hill' && (
          <div className="bg-[#0A0A0A] p-5 border border-emerald-500/40 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-emerald-400 flex items-center gap-2">
                <Binary className="w-4 h-4" />
                <span>Hill Cipher 2×2 Key Matrix</span>
              </label>

              {isHillKeyValid(hillMatrix) ? (
                <span className="text-[10px] px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-mono-code font-bold">
                  VALID KEY (det = {getHillDeterminant(hillMatrix)})
                </span>
              ) : (
                <span className="text-[10px] px-3 py-1 bg-rose-950 text-rose-400 border border-rose-800 rounded-full font-mono-code font-bold">
                  INVALID KEY (det = {getHillDeterminant(hillMatrix)} not coprime to 26)
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Matrix Input Cells */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#141414] border border-[#333] rounded-2xl font-mono-code">
                <div>
                  <span className="text-[9px] text-zinc-500 block">k11</span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={hillMatrix.k11}
                    onChange={(e) =>
                      setHillMatrix &&
                      setHillMatrix({ ...hillMatrix, k11: (Number(e.target.value) % 26 + 26) % 26 })
                    }
                    className="w-16 h-10 bg-[#0A0A0A] text-white text-center font-bold border border-[#333] focus:border-emerald-500 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">k12</span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={hillMatrix.k12}
                    onChange={(e) =>
                      setHillMatrix &&
                      setHillMatrix({ ...hillMatrix, k12: (Number(e.target.value) % 26 + 26) % 26 })
                    }
                    className="w-16 h-10 bg-[#0A0A0A] text-white text-center font-bold border border-[#333] focus:border-emerald-500 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">k21</span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={hillMatrix.k21}
                    onChange={(e) =>
                      setHillMatrix &&
                      setHillMatrix({ ...hillMatrix, k21: (Number(e.target.value) % 26 + 26) % 26 })
                    }
                    className="w-16 h-10 bg-[#0A0A0A] text-white text-center font-bold border border-[#333] focus:border-emerald-500 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 block">k22</span>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={hillMatrix.k22}
                    onChange={(e) =>
                      setHillMatrix &&
                      setHillMatrix({ ...hillMatrix, k22: (Number(e.target.value) % 26 + 26) % 26 })
                    }
                    className="w-16 h-10 bg-[#0A0A0A] text-white text-center font-bold border border-[#333] focus:border-emerald-500 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1 font-mono-code text-xs text-zinc-400">
                <p>
                  Matrix K = [[{hillMatrix.k11}, {hillMatrix.k12}], [{hillMatrix.k21}, {hillMatrix.k22}]]
                </p>
                <p>
                  Determinant det(K) = ({hillMatrix.k11}×{hillMatrix.k22} - {hillMatrix.k12}×{hillMatrix.k21}) mod 26 ={' '}
                  <strong className="text-emerald-400">{getHillDeterminant(hillMatrix)}</strong>
                </p>
                {getHillInverseMatrix(hillMatrix) && (
                  <p className="text-emerald-300">
                    Inverse K⁻¹ = [[{getHillInverseMatrix(hillMatrix)?.k11},{' '}
                    {getHillInverseMatrix(hillMatrix)?.k12}], [{getHillInverseMatrix(hillMatrix)?.k21},{' '}
                    {getHillInverseMatrix(hillMatrix)?.k22}]] mod 26
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Monoalphabetic Key Controls */}
        {['caesar_default', 'caesar_custom', 'multiplicative', 'affine'].includes(cipherMethod) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Key A Selector */}
            <div
              className={`space-y-3 bg-[#0A0A0A] p-5 border border-[#262626] rounded-2xl relative transition-all ${
                currentMethodInfo.lockA ? 'opacity-80' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-zinc-300 flex items-center gap-2">
                  <span>Multiplicative Key (a)</span>
                  {currentMethodInfo.lockA ? (
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full flex items-center gap-1 font-mono-code">
                      <Lock className="w-3 h-3" /> FIXED
                    </span>
                  ) : keyValidation.isValid ? (
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full flex items-center gap-1 font-mono-code">
                      <CheckCircle2 className="w-3 h-3" /> COPRIME
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 bg-rose-950 text-rose-400 border border-rose-800 rounded-full flex items-center gap-1 font-mono-code">
                      <AlertTriangle className="w-3 h-3" /> INVALID
                    </span>
                  )}
                </label>
                <span className="text-base font-mono-code font-bold text-[#FF3E00] bg-[#141414] px-3 py-1 border border-[#262626] rounded-xl">
                  a = {keyA}
                </span>
              </div>

              {/* Quick Valid Key Pills */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-mono-code uppercase text-zinc-500 mr-1">Valid 'a':</span>
                {validAs.map((val) => (
                  <button
                    key={val}
                    disabled={currentMethodInfo.lockA}
                    onClick={() => setKeyA(val)}
                    className={`px-2.5 py-1 text-xs font-mono-code font-bold rounded-lg transition-all ${
                      keyA === val
                        ? 'bg-[#FF3E00] text-white border border-[#FF3E00] shadow-sm'
                        : 'bg-[#181818] text-zinc-300 border border-[#2A2A2A] hover:border-zinc-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              <input
                type="range"
                min="1"
                max="25"
                step="1"
                disabled={currentMethodInfo.lockA}
                value={keyA}
                onChange={(e) => setKeyA(Number(e.target.value))}
                className="w-full accent-[#FF3E00] bg-[#1A1A1A] rounded-lg cursor-pointer h-2 border border-[#333] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Key B Slider */}
            <div
              className={`space-y-3 bg-[#0A0A0A] p-5 border border-[#262626] rounded-2xl relative transition-all ${
                currentMethodInfo.lockB ? 'opacity-80' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-zinc-300 flex items-center gap-2">
                  <span>Additive Shift Key (b)</span>
                  {currentMethodInfo.lockB && (
                    <span className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-full flex items-center gap-1 font-mono-code">
                      <LockKeyhole className="w-3 h-3" /> FIXED
                    </span>
                  )}
                </label>
                <span className="text-base font-mono-code font-bold text-amber-400 bg-[#141414] px-3 py-1 border border-[#262626] rounded-xl">
                  b = {keyB}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="25"
                step="1"
                disabled={currentMethodInfo.lockB}
                value={keyB}
                onChange={(e) => setKeyB(Number(e.target.value))}
                className="w-full accent-amber-500 bg-[#1A1A1A] rounded-lg cursor-pointer h-2 border border-[#333] disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {/* Validation Warning Box if Invalid Key A */}
        {!keyValidation.isValid && (
          <div className="mt-5 p-4 bg-rose-950/60 border border-rose-800 rounded-2xl text-rose-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono-code uppercase font-bold text-xs text-rose-100">
                  CRITICAL WARNING: Key a = {keyA} is not coprime to 26
                </h4>
                <p className="text-xs text-rose-300 mt-1 font-sans">
                  gcd({keyA}, 26) = {keyValidation.gcd}. Multiple letters map to identical ciphertext letters!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 font-mono-code text-xs">
              <span className="text-rose-300">Quick Fix:</span>
              {keyValidation.suggestedA.map((sug) => (
                <button
                  key={sug}
                  onClick={() => setKeyA(sug)}
                  className="px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white font-bold border border-rose-600 rounded-lg"
                >
                  a = {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Math Summary Line */}
        <div className="mt-5 p-3.5 bg-[#0A0A0A] border border-[#262626] rounded-2xl text-zinc-300 text-xs flex flex-wrap items-center justify-between gap-3 font-mono-code">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 text-[#FF3E00]" />
            <span>
              Active Formula: <strong className="text-white">{currentMethodInfo.name}</strong> ➔{' '}
              <span className="text-[#FF3E00] font-bold">
                {['ecb', 'cbc', 'cfb', 'ofb', 'ctr'].includes(cipherMethod)
                  ? currentMethodInfo.formula
                  : cipherMethod === 'vigenere'
                  ? `C_i = (P_i + K_i) mod 26 [Key: "${vigenereKey}"]`
                  : cipherMethod === 'playfair'
                  ? `5×5 Digraph Grid [Key: "${playfairKey}"]`
                  : cipherMethod === 'hill'
                  ? `C = K · P mod 26`
                  : keyA === 1
                  ? `E(x) = (x + ${keyB}) mod 26`
                  : keyB === 0
                  ? `E(x) = (${keyA}x) mod 26`
                  : `E(x) = (${keyA}x + ${keyB}) mod 26`}
              </span>
            </span>
            {!['ecb', 'cbc', 'cfb', 'ofb', 'ctr', 'vigenere', 'playfair', 'hill'].includes(cipherMethod) && (
              <>
                <span className="text-zinc-600">|</span>
                <span>
                  Inverse Key: <strong className="text-amber-400">a⁻¹ = {aInverse}</strong>
                </span>
              </>
            )}
          </div>
          {onOpenAITutorWithPrompt && (
            <button
              onClick={() =>
                onOpenAITutorWithPrompt(
                  `Can you explain the cryptography principles of ${currentMethodInfo.name}? Formula: ${currentMethodInfo.formula}.`
                )
              }
              className="text-xs text-[#FF3E00] hover:underline flex items-center gap-1.5 font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Ask AI Tutor about Formula
            </button>
          )}
        </div>
      </div>

      {/* Main Text Input / Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Text Area */}
        <div className="bg-white border border-zinc-300 rounded-3xl p-6 shadow-md flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-zinc-900 flex items-center gap-2">
              <span>{mode === 'encrypt' ? 'Plaintext Input' : 'Ciphertext Input'}</span>
              <span className="text-zinc-500 font-normal">
                ({inputText.length} chars)
              </span>
            </label>

            <button
              onClick={handleClear}
              className="px-3 py-1 text-zinc-700 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-xl text-xs font-mono-code uppercase tracking-wider flex items-center gap-1 transition-colors"
              title="Clear input"
            >
              <RotateCcw className="w-3 h-3" /> Clear
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'encrypt'
                ? 'TYPE MESSAGE TO ENCRYPT...'
                : 'ENTER CIPHERTEXT TO DECRYPT...'
            }
            className="w-full h-48 bg-zinc-50 text-black font-mono-code text-sm p-4 border border-zinc-300 focus:border-[#FF3E00] rounded-2xl outline-none resize-none transition-all"
          />

          <div className="flex items-center justify-between mt-3 text-xs text-zinc-600 font-mono-code">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preserveSpaces}
                onChange={(e) => setPreserveSpaces(e.target.checked)}
                className="accent-[#FF3E00] bg-zinc-100 border-zinc-300 rounded"
              />
              <span>Preserve spaces & punctuation</span>
            </label>

            <span className="text-zinc-500 text-[11px]">
              Letters transformed, punctuation preserved
            </span>
          </div>
        </div>

        {/* Output Text Area */}
        <div className="bg-white border border-zinc-300 rounded-3xl p-6 shadow-md flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-mono-code uppercase tracking-wider font-bold text-zinc-900 flex items-center gap-2">
              <span>{mode === 'encrypt' ? 'Ciphertext Result' : 'Plaintext Result'}</span>
            </label>

            <div className="flex items-center gap-2 font-mono-code">
              <button
                onClick={handleSwap}
                className="px-3.5 py-1.5 text-zinc-800 hover:text-black bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-xl text-xs uppercase flex items-center gap-1.5 transition-colors font-bold"
                title="Swap Input & Output"
              >
                <ArrowRightLeft className="w-3 h-3" /> Swap
              </button>
              <button
                onClick={handleCopy}
                disabled={!outputText || outputText.startsWith('[ERROR')}
                className="px-3.5 py-1.5 text-white bg-black hover:bg-[#FF3E00] disabled:bg-zinc-200 disabled:text-zinc-400 text-xs font-bold uppercase rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="w-full h-48 bg-zinc-900 text-[#FF3E00] font-mono-code text-sm p-4 border border-zinc-800 rounded-2xl overflow-y-auto whitespace-pre-wrap break-words select-all">
            {outputText || (
              <span className="text-zinc-500 italic font-sans text-xs">
                Output generated in real time...
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-zinc-600 font-mono-code">
            <span>
              {['ecb', 'cbc', 'cfb', 'ofb', 'ctr'].includes(cipherMethod) ? (
                <>
                  Mode: <strong className="text-emerald-600 uppercase font-bold">{cipherMethod.toUpperCase()}</strong> | Key: <strong className="text-zinc-900">"{blockKey}"</strong>
                  {['cbc', 'cfb', 'ofb'].includes(cipherMethod) && <> | IV: <strong className="text-cyan-600">"{blockIv}"</strong></>}
                  {cipherMethod === 'ctr' && <> | Nonce: <strong className="text-pink-600">{blockNonce}</strong></>}
                </>
              ) : cipherMethod === 'vigenere' ? (
                <>Keyword: <strong className="text-sky-600">"{vigenereKey}"</strong></>
              ) : cipherMethod === 'playfair' ? (
                <>Key Phrase: <strong className="text-purple-600">"{playfairKey}"</strong></>
              ) : cipherMethod === 'hill' ? (
                <>Matrix det(K): <strong className="text-emerald-600">{getHillDeterminant(hillMatrix)}</strong></>
              ) : (
                <>Keys: <strong className="text-zinc-900">a={keyA}, b={keyB}</strong></>
              )}
            </span>
            <span>
              Action: <strong className="text-black uppercase">{mode}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Monoalphabetic Transformation Map Grid */}
      {['caesar_default', 'caesar_custom', 'multiplicative', 'affine'].includes(cipherMethod) && (
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
              <span>ALPHABET TRANSFORMATION MATRIX (MOD 26)</span>
              <span className="text-zinc-500 font-normal lowercase">
                (Plaintext ➔ Ciphertext)
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-13 gap-2 pt-1">
            {mappingTable.map((item) => (
              <div
                key={item.original}
                className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-2.5 text-center transition-all hover:border-[#FF3E00] hover:scale-105 group"
              >
                <div className="text-xs font-mono-code font-bold text-zinc-400 group-hover:text-white">
                  {item.original}
                  <span className="text-[9px] text-zinc-600 ml-0.5">({item.index})</span>
                </div>
                <div className="text-[10px] text-zinc-600 my-0.5">↓</div>
                <div className="text-xs font-mono-code font-bold text-[#FF3E00]">
                  {item.mapped}
                  <span className="text-[9px] text-zinc-600 ml-0.5">({item.mappedIndex})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Block Cipher Step-by-Step Block Vector */}
      {['ecb', 'cbc', 'cfb', 'ofb', 'ctr'].includes(cipherMethod) && blockResult && (
        <div className="bg-[#141414] border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div>
              <h3 className="text-xs font-mono-code font-bold text-emerald-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <span>BLOCK CIPHER VECTOR PIPELINE ({cipherMethod.toUpperCase()})</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-normal border border-emerald-500/30 rounded-full">
                  {blockResult.steps.length} Blocks ({blockSize * 8}-bit)
                </span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                Hex vectors & IV/Keystream feedback transformations for each block.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono-code text-zinc-300 border-collapse">
              <thead>
                <tr className="bg-[#0A0A0A] border-b border-[#262626] text-zinc-500 uppercase text-[10px]">
                  <th className="p-3">Block #</th>
                  <th className="p-3">Plaintext (Text & Hex)</th>
                  <th className="p-3">IV / Prev Cipher / Nonce</th>
                  <th className="p-3">Keystream Hex</th>
                  <th className="p-3">Ciphertext (Hex & Text)</th>
                  <th className="p-3">Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {blockResult.steps.map((step) => (
                  <tr key={step.blockIndex} className="hover:bg-[#1A1A1E] transition-colors">
                    <td className="p-3 font-bold text-emerald-400">Block {step.blockIndex}</td>
                    <td className="p-3">
                      <span className="text-white font-bold">"{step.plaintextBlock}"</span>
                      <span className="block text-[10px] text-zinc-500">{step.plaintextHex}</span>
                    </td>
                    <td className="p-3 text-cyan-300 font-bold">{step.ivOrPrevCipherHex}</td>
                    <td className="p-3 text-amber-300">{step.keystreamHex}</td>
                    <td className="p-3">
                      <span className="text-[#FF3E00] font-bold">{step.ciphertextHex}</span>
                      <span className="block text-[10px] text-zinc-400">"{step.ciphertextBlock}"</span>
                    </td>
                    <td className="p-3 text-zinc-400 text-[11px] font-sans">{step.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Step-by-Step Character Calculation Pipeline Vector */}
      {inputText.length > 0 && keyValidation.isValid && !['ecb', 'cbc', 'cfb', 'ofb', 'ctr'].includes(cipherMethod) && (
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div>
              <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
                <span>STEP-BY-STEP CALCULATION PIPELINE</span>
                <span className="text-[10px] px-2 py-0.5 bg-[#FF3E00]/10 text-[#FF3E00] font-normal border border-[#FF3E00]/30 rounded-full">
                  First {Math.min(30, inputText.length)} chars
                </span>
              </h3>
              <p className="text-xs text-zinc-400 font-sans mt-1">
                {mode === 'encrypt'
                  ? `Formula: x ➔ (${keyA} · x + ${keyB}) ➔ mod 26 ➔ result char`
                  : `Formula: y ➔ ${aInverse} · (y - ${keyB}) ➔ mod 26 ➔ result char`}
              </p>
            </div>

            <button
              onClick={() => setShowStepVector(!showStepVector)}
              className="text-xs font-mono-code text-zinc-400 hover:text-white uppercase flex items-center gap-1"
            >
              {showStepVector ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showStepVector ? 'Collapse' : 'Expand'}
            </button>
          </div>

          {showStepVector && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code text-zinc-300 border-collapse">
                <thead>
                  <tr className="bg-[#0A0A0A] border-b border-[#262626] text-zinc-500 uppercase text-[10px]">
                    <th className="p-3">Input</th>
                    <th className="p-3">Index</th>
                    <th className="p-3">Calculation</th>
                    <th className="p-3">Modulo 26</th>
                    <th className="p-3">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {stepVector.map((step, idx) => (
                    <tr
                      key={idx}
                      className={
                        step.isAlphabet
                          ? 'hover:bg-[#1A1A1A] transition-colors'
                          : 'text-zinc-600 italic bg-[#0A0A0A]/40'
                      }
                    >
                      <td className="p-3 font-bold text-white">{step.char}</td>
                      <td className="p-3 text-zinc-500">
                        {step.isAlphabet ? step.rawIndex : '—'}
                      </td>
                      <td className="p-3 text-amber-300">
                        {step.isAlphabet
                          ? mode === 'encrypt'
                            ? `${keyA} × ${step.rawIndex} + ${keyB} = ${step.calculatedIndex}`
                            : `${aInverse} × (${step.rawIndex} - ${keyB}) = ${step.calculatedIndex}`
                          : 'Passed through unchanged'}
                      </td>
                      <td className="p-3 text-zinc-300 font-bold">
                        {step.isAlphabet ? step.modIndex : '—'}
                      </td>
                      <td className="p-3 font-bold text-[#FF3E00] text-sm">
                        {step.resultChar}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


