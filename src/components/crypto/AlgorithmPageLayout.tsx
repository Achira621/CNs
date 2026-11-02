import React, { useState, useMemo } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  Calculator,
  BookOpen,
  ArrowRight,
  Sparkles,
  Play,
  RotateCcw,
  Copy,
  Check,
  ChevronRight,
  Info,
  Flame,
  HelpCircle,
  Binary,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import { CipherMethod } from '../../types';
import { ALGORITHM_CATALOG, AlgorithmMetadata } from './AlgorithmCatalog';
import { generateAlgorithmTrace } from '../../utils/tracingEngine';
import { InteractiveTracePlayer } from '../InteractiveTracePlayer';
import { isCoprime, modInverse } from '../../utils/affineMath';
import { getHillDeterminant } from '../../utils/polyMath';

interface AlgorithmPageLayoutProps {
  method: CipherMethod;
  onSelectMethod: (method: CipherMethod) => void;
  onOpenAITutorWithPrompt: (prompt: string) => void;
  onBackToDashboard: () => void;
}

export const AlgorithmPageLayout: React.FC<AlgorithmPageLayoutProps> = ({
  method,
  onSelectMethod,
  onOpenAITutorWithPrompt,
  onBackToDashboard,
}) => {
  const meta: AlgorithmMetadata = ALGORITHM_CATALOG[method] || ALGORITHM_CATALOG.affine;

  // Active inner tab
  const [activeTab, setActiveTab] = useState<'workbench' | 'theory' | 'weaknesses' | 'viva'>('workbench');

  // Interactive controls state
  const [operation, setOperation] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState(meta.samplePlaintext);
  const [copied, setCopied] = useState(false);

  // Key parameters
  const [keyA, setKeyA] = useState(5);
  const [keyB, setKeyB] = useState(8);
  const [vigenereKey, setVigenereKey] = useState('SECRET');
  const [playfairKey, setPlayfairKey] = useState('MONARCHY');
  const [hillMatrix, setHillMatrix] = useState({ k11: 5, k12: 8, k21: 17, k22: 3 });
  const [desKey, setDesKey] = useState('133457799BBCDFF1');
  const [aesKey, setAesKey] = useState('2B7E151628AED2A6ABF7158809CF4F3C');
  const [blockIv, setBlockIv] = useState('0000000000000000');
  const [rsaP, setRsaP] = useState(61);
  const [rsaQ, setRsaQ] = useState(53);
  const [rsaE, setRsaE] = useState(17);
  const [dhPrime, setDhPrime] = useState(23);
  const [dhGen, setDhGen] = useState(5);
  const [dhAlicePriv, setDhAlicePriv] = useState(6);
  const [dhBobPriv, setDhBobPriv] = useState(15);
  const [hmacSecret, setHmacSecret] = useState('vit-cns-secret-key');

  // Compute live trace
  const trace = useMemo(() => {
    try {
      return generateAlgorithmTrace({
        method,
        operation,
        text: inputText,
        keyA,
        keyB,
        vigenereKey,
        playfairKey,
        hillMatrix,
        desKey,
        aesKey,
        blockIv,
        rsaP,
        rsaQ,
        rsaE,
        dhPrime,
        dhGen,
        dhAlicePriv,
        dhBobPriv,
        hmacKey: hmacSecret,
      } as any);
    } catch (e: any) {
      return {
        algorithmId: method,
        algorithmName: meta.name,
        operation,
        input: inputText,
        output: 'Error computing algorithm trace: ' + (e?.message || 'Check inputs'),
        steps: [],
      };
    }
  }, [
    method,
    operation,
    inputText,
    keyA,
    keyB,
    vigenereKey,
    playfairKey,
    hillMatrix,
    desKey,
    aesKey,
    blockIv,
    rsaP,
    rsaQ,
    rsaE,
    dhPrime,
    dhGen,
    dhAlicePriv,
    dhBobPriv,
    hmacSecret,
    meta.name,
  ]);

  const resultOutput = typeof trace.output === 'string' ? trace.output : JSON.stringify(trace.output, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(resultOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskTutor = () => {
    const prompt = `I am experimenting with the ${meta.name} algorithm (${meta.categoryLabel}). Formula: ${meta.formula}. Input is "${inputText}". Can you explain the internal mathematical mechanics, vulnerabilities, and how this is applied in modern cybersecurity?`;
    onOpenAITutorWithPrompt(prompt);
  };

  // Check Hill Determinant
  const hillDet = useMemo(() => getHillDeterminant(hillMatrix), [hillMatrix]);
  const hillInvertible = useMemo(() => isCoprime(hillDet, 26), [hillDet]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation Breadcrumb & Back */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-600">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-zinc-400 hover:text-zinc-900 shadow-2xs transition-all font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <span>/</span>
          <span className="uppercase text-[#8855C7] font-bold">{meta.categoryLabel}</span>
          <span>/</span>
          <span className="text-zinc-900 font-bold">{meta.name}</span>
        </div>

        {/* Algorithm quick dropdown switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono-code text-zinc-500 hidden sm:inline">Switch Algorithm:</span>
          <select
            value={method}
            onChange={(e) => onSelectMethod(e.target.value as CipherMethod)}
            aria-label="Select Cryptographic Algorithm"
            className="text-xs font-mono-code font-semibold px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-800 shadow-2xs focus:outline-none focus:border-[#8855C7] cursor-pointer"
          >
            {Object.values(ALGORITHM_CATALOG).map((alg) => (
              <option key={alg.id} value={alg.id}>
                {alg.name} ({alg.categoryLabel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="bg-white border border-[#E4E2EE] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Subtle decorative purple glow */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br from-[#EDE1FF]/50 to-transparent -z-10 blur-2xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono-code font-bold uppercase tracking-wider bg-[#EDE1FF] text-[#7C3AED]">
                {meta.categoryLabel}
              </span>
              <span
                className="px-3 py-1 rounded-full text-[11px] font-mono-code font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: meta.securityColor }}
              >
                {meta.securityRating}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono-code text-zinc-600 bg-zinc-100 border border-zinc-200">
                Key Space: {meta.keySpace}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-mono-code text-zinc-600 bg-zinc-100 border border-zinc-200">
                Complexity: {meta.complexity}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif-display font-bold text-zinc-900 tracking-tight">
              {meta.name}
            </h1>

            <p className="text-zinc-600 text-sm leading-relaxed">
              {meta.shortDesc} {meta.historicalContext}
            </p>

            {/* Formula pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-mono-code text-xs text-zinc-800">
              <span className="text-zinc-400 font-bold">FORMULA:</span>
              <span className="font-bold text-[#7C3AED]">{meta.formula}</span>
            </div>
          </div>

          {/* Quick AI & Practice triggers */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={handleAskTutor}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#8855C7] hover:bg-[#7844B5] text-white text-xs font-mono-code font-bold shadow-md shadow-[#8855C7]/20 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Ask AI Tutor</span>
            </button>
            <button
              onClick={() => setActiveTab('theory')}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-zinc-300 hover:border-zinc-400 text-zinc-700 text-xs font-mono-code font-semibold transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-zinc-500" />
              <span>Theory & Proofs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dark Laboratory Container ("One design system. Every algorithm.") */}
      <div data-tour="algorithm-workbench" className="bg-[#13121F] border border-[#27253D] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Navigation Tabs inside the Dark Container */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242238] pb-5 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'workbench', label: 'Interactive Workbench & Trace Engine', icon: Calculator },
              { id: 'theory', label: 'Mathematics & Theory', icon: BookOpen, tourId: 'algorithm-theory-tab' },
              { id: 'weaknesses', label: 'Vulnerabilities & Cryptanalysis', icon: ShieldAlert, tourId: 'algorithm-weaknesses-tab' },
              { id: 'viva', label: 'Viva Voce Q&A', icon: HelpCircle, tourId: 'algorithm-viva-tab' },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  data-tour={t.tourId}
                  onClick={() => setActiveTab(t.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono-code font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#292543] text-white border border-[#48406B] shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1C1A2E]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B58AE8]' : 'text-zinc-400'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Academic Badge */}
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono-code text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>VIT CNS Interactive Engine</span>
          </div>
        </div>

        {/* TAB 1: WORKBENCH & TRACE */}
        {activeTab === 'workbench' && (
          <div className="space-y-6">
            {/* Top Toolbar: Operation & Key Configuration */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#181728] border border-[#2B2844] rounded-2xl p-5">
              {/* Left Column: Operation Mode & Text Input */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono-code text-zinc-400 uppercase tracking-wider font-semibold">
                    1. Input Vector ({operation})
                  </label>
                  <div className="flex items-center gap-1 bg-[#100F1C] p-1 rounded-xl border border-[#2D2947]">
                    <button
                      onClick={() => setOperation('encrypt')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono-code font-bold transition-all cursor-pointer ${
                        operation === 'encrypt'
                          ? 'bg-[#8855C7] text-white shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Encrypt
                    </button>
                    <button
                      onClick={() => setOperation('decrypt')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono-code font-bold transition-all cursor-pointer ${
                        operation === 'decrypt'
                          ? 'bg-[#8855C7] text-white shadow-xs'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Decrypt
                    </button>
                  </div>
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-xl p-3.5 text-zinc-200 font-mono-code text-xs focus:outline-none focus:border-[#8855C7] resize-none"
                  placeholder="Enter input text..."
                />
              </div>

              {/* Right Column: Algorithm-Specific Key Controls */}
              <div className="lg:col-span-5 space-y-4 border-t lg:border-t-0 lg:border-l border-[#282542] lg:pl-6 pt-4 lg:pt-0">
                <label className="text-xs font-mono-code text-zinc-400 uppercase tracking-wider font-semibold block">
                  2. Key Parameters
                </label>

                {/* Caesar / Multiplicative / Affine Keys */}
                {(method === 'caesar_default' || method === 'caesar_custom' || method === 'multiplicative' || method === 'affine') && (
                  <div className="space-y-3">
                    {method !== 'caesar_default' && method !== 'caesar_custom' && (
                      <div>
                        <div className="flex justify-between text-xs font-mono-code text-zinc-300 mb-1">
                          <span>Multiplier Key a: {keyA}</span>
                          <span className={isCoprime(keyA, 26) ? 'text-emerald-400' : 'text-rose-400'}>
                            {isCoprime(keyA, 26) ? 'gcd(a,26)=1 (Valid)' : 'Invalid: gcd!=1'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="25"
                          step="1"
                          value={keyA}
                          onChange={(e) => setKeyA(parseInt(e.target.value))}
                          className="w-full accent-[#8855C7]"
                        />
                      </div>
                    )}

                    {method !== 'multiplicative' && (
                      <div>
                        <div className="flex justify-between text-xs font-mono-code text-zinc-300 mb-1">
                          <span>Shift Offset b: {keyB}</span>
                          <span>(mod 26)</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="25"
                          step="1"
                          value={keyB}
                          disabled={method === 'caesar_default'}
                          onChange={(e) => setKeyB(parseInt(e.target.value))}
                          className="w-full accent-[#8855C7] disabled:opacity-50"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Vigenere Key */}
                {method === 'vigenere' && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono-code text-zinc-300">Keyword (Repeated):</span>
                    <input
                      type="text"
                      value={vigenereKey}
                      onChange={(e) => setVigenereKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-xl px-3 py-2 text-xs font-mono-code text-white uppercase focus:outline-none focus:border-[#8855C7]"
                    />
                  </div>
                )}

                {/* Playfair Key */}
                {method === 'playfair' && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono-code text-zinc-300">5x5 Matrix Keyword:</span>
                    <input
                      type="text"
                      value={playfairKey}
                      onChange={(e) => setPlayfairKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                      className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-xl px-3 py-2 text-xs font-mono-code text-white uppercase focus:outline-none focus:border-[#8855C7]"
                    />
                  </div>
                )}

                {/* Hill Matrix Keys */}
                {method === 'hill' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono-code">
                      <span className="text-zinc-300">2x2 Matrix K:</span>
                      <span className={hillInvertible ? 'text-emerald-400' : 'text-rose-400'}>
                        det={hillDet} ({hillInvertible ? 'Invertible' : 'Non-invertible'})
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={hillMatrix.k11}
                        onChange={(e) => setHillMatrix({ ...hillMatrix, k11: parseInt(e.target.value) || 0 })}
                        className="bg-[#0F0E1B] border border-[#2C2946] rounded-lg p-2 text-xs font-mono-code text-center text-white"
                        placeholder="k11"
                      />
                      <input
                        type="number"
                        value={hillMatrix.k12}
                        onChange={(e) => setHillMatrix({ ...hillMatrix, k12: parseInt(e.target.value) || 0 })}
                        className="bg-[#0F0E1B] border border-[#2C2946] rounded-lg p-2 text-xs font-mono-code text-center text-white"
                        placeholder="k12"
                      />
                      <input
                        type="number"
                        value={hillMatrix.k21}
                        onChange={(e) => setHillMatrix({ ...hillMatrix, k21: parseInt(e.target.value) || 0 })}
                        className="bg-[#0F0E1B] border border-[#2C2946] rounded-lg p-2 text-xs font-mono-code text-center text-white"
                        placeholder="k21"
                      />
                      <input
                        type="number"
                        value={hillMatrix.k22}
                        onChange={(e) => setHillMatrix({ ...hillMatrix, k22: parseInt(e.target.value) || 0 })}
                        className="bg-[#0F0E1B] border border-[#2C2946] rounded-lg p-2 text-xs font-mono-code text-center text-white"
                        placeholder="k22"
                      />
                    </div>
                  </div>
                )}

                {/* DES / 2DES / 3DES / Modes */}
                {(method === 'des' || method === '2des' || method === '3des' || method === 'ecb' || method === 'cbc' || method === 'cfb' || method === 'ofb' || method === 'ctr') && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono-code text-zinc-300">Hexadecimal Key (64-bit):</span>
                    <input
                      type="text"
                      value={desKey}
                      onChange={(e) => setDesKey(e.target.value.toUpperCase())}
                      className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-xl px-3 py-2 text-xs font-mono-code text-white uppercase focus:outline-none focus:border-[#8855C7]"
                    />
                    {method !== 'ecb' && (
                      <div>
                        <span className="text-xs font-mono-code text-zinc-300">Initialization Vector (IV):</span>
                        <input
                          type="text"
                          value={blockIv}
                          onChange={(e) => setBlockIv(e.target.value.toUpperCase())}
                          className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-xl px-3 py-2 text-xs font-mono-code text-white uppercase focus:outline-none focus:border-[#8855C7] mt-1"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* AES Key */}
                {method === 'aes' && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono-code text-zinc-300">128-bit Key Hex (32 hex characters):</span>
                    <input
                      type="text"
                      value={aesKey}
                      onChange={(e) => setAesKey(e.target.value.toUpperCase())}
                      className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-xl px-3 py-2 text-xs font-mono-code text-white uppercase focus:outline-none focus:border-[#8855C7]"
                    />
                  </div>
                )}

                {/* RSA Controls */}
                {method === 'rsa' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-[10px] font-mono-code text-zinc-400">Prime p:</span>
                        <input
                          type="number"
                          value={rsaP}
                          onChange={(e) => setRsaP(parseInt(e.target.value) || 3)}
                          className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-lg p-1.5 text-xs font-mono-code text-center text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-zinc-400">Prime q:</span>
                        <input
                          type="number"
                          value={rsaQ}
                          onChange={(e) => setRsaQ(parseInt(e.target.value) || 5)}
                          className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-lg p-1.5 text-xs font-mono-code text-center text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-zinc-400">Public e:</span>
                        <input
                          type="number"
                          value={rsaE}
                          onChange={(e) => setRsaE(parseInt(e.target.value) || 17)}
                          className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-lg p-1.5 text-xs font-mono-code text-center text-white"
                        />
                      </div>
                    </div>
                    <p className="text-[10px] font-mono-code text-zinc-400">
                      Modulus n = {rsaP * rsaQ}, φ(n) = {(rsaP - 1) * (rsaQ - 1)}
                    </p>
                  </div>
                )}

                {/* Diffie-Hellman */}
                {method === 'diffie_hellman' && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] font-mono-code text-zinc-400">Prime p:</span>
                        <input
                          type="number"
                          value={dhPrime}
                          onChange={(e) => setDhPrime(parseInt(e.target.value) || 23)}
                          className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-lg p-1.5 text-xs font-mono-code text-center text-white"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-zinc-400">Generator g:</span>
                        <input
                          type="number"
                          value={dhGen}
                          onChange={(e) => setDhGen(parseInt(e.target.value) || 5)}
                          className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-lg p-1.5 text-xs font-mono-code text-center text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* HMAC */}
                {method === 'hmac' && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono-code text-zinc-300">Shared Secret Key:</span>
                    <input
                      type="text"
                      value={hmacSecret}
                      onChange={(e) => setHmacSecret(e.target.value)}
                      className="w-full bg-[#0F0E1B] border border-[#2C2946] rounded-xl px-3 py-2 text-xs font-mono-code text-white focus:outline-none focus:border-[#8855C7]"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Output Display Card */}
            <div className="bg-[#181728] border border-[#2B2844] rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono-code text-zinc-400 uppercase tracking-wider font-semibold">
                  3. Resulting Output ({operation === 'encrypt' ? 'Ciphertext' : 'Plaintext'})
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#24223A] hover:bg-[#322F4F] text-xs font-mono-code text-zinc-300 transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Output'}</span>
                </button>
              </div>

              <div className="bg-[#0C0B16] border border-[#272440] rounded-xl p-4 font-mono-code text-sm text-emerald-400 break-all select-all">
                {resultOutput || '(No output produced)'}
              </div>
            </div>

            {/* Embedded Interactive Trace Player */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-mono-code font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                  <Binary className="w-4 h-4 text-[#8855C7]" />
                  <span>Step-By-Step Execution Trace</span>
                </h3>
                <span className="text-xs font-mono-code text-zinc-400">
                  {trace.steps.length} internal steps recorded
                </span>
              </div>

              <InteractiveTracePlayer
                trace={trace}
                onSelectStep={(step) => {
                  // User can inspect specific step
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 2: MATHEMATICS & THEORY */}
        {activeTab === 'theory' && (
          <div className="space-y-6">
            <div className="bg-[#181728] border border-[#2B2844] rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-serif-display font-bold text-white">Mathematical Foundations</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{meta.theory.overview}</p>

              <div className="p-4 rounded-xl bg-[#0F0E1B] border border-[#2B2844] font-mono-code text-sm text-[#B58AE8]">
                {meta.theory.mathematicalFormula}
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono-code text-zinc-400 uppercase tracking-wider font-semibold">
                  Execution Algorithm Steps:
                </h4>
                <ol className="space-y-2 list-decimal list-inside text-sm text-zinc-300 font-mono-code">
                  {meta.theory.steps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-[#1C182F] border border-[#3E3466] text-xs font-mono-code text-zinc-300">
                <span className="text-[#C4B5FD] font-bold">Security Analysis: </span>
                {meta.theory.securityNotes}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VULNERABILITIES & ATTACKS */}
        {activeTab === 'weaknesses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meta.vulnerabilities.map((vuln, idx) => (
                <div key={idx} className="bg-[#181728] border border-[#2B2844] rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm font-mono-code">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{vuln.title}</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed font-mono-code">
                    {vuln.description}
                  </p>
                  <div className="p-3 rounded-lg bg-[#221727] border border-[#442340] text-xs font-mono-code text-amber-200">
                    <span className="font-bold text-amber-400">Mitigation: </span>
                    {vuln.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VIVA VOCE Q&A */}
        {activeTab === 'viva' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-mono-code font-bold text-zinc-200 uppercase tracking-wider">
                Vidyalankar Institute of Technology · Viva Voce Preparation
              </h3>
              <span className="text-xs font-mono-code text-zinc-400">Subject: CNS</span>
            </div>

            {meta.vivaQuestions.map((q, idx) => (
              <div key={idx} className="bg-[#181728] border border-[#2B2844] rounded-2xl p-5 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-[#8855C7]/30 text-[#C4B5FD] font-mono-code text-xs font-bold shrink-0">
                    Q{idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-white leading-snug">{q.question}</h4>
                </div>
                <div className="ml-8 text-xs font-mono-code text-zinc-300 leading-relaxed bg-[#100F1C] p-3 rounded-xl border border-[#24223A]">
                  <span className="text-emerald-400 font-bold">Answer: </span>
                  {q.answer}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
