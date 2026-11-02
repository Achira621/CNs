import React, { useState, useMemo } from 'react';
import {
  KeyRound,
  ShieldAlert,
  ShieldCheck,
  Binary,
  Hash,
  ArrowRightLeft,
  Sparkles,
  Info,
  Layers,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
} from 'lucide-react';
import {
  generateEducationalRSA,
  rsaEncrypt,
  rsaDecrypt,
  simulateDiffieHellman,
  ecMultiply,
  DEFAULT_ECC_CURVE,
} from '../utils/asymmetricMath';
import { sha256Trace, hmacSha256Trace, sha256Pure } from '../utils/hashMath';
import { InteractiveTracePlayer } from './InteractiveTracePlayer';
import { generateAlgorithmTrace } from '../utils/tracingEngine';
import { AlgorithmStep, AlgorithmTrace } from '../types';

interface AsymmetricHashStudioProps {
  onOpenAITutorWithPrompt?: (prompt: string) => void;
}

export const AsymmetricHashStudio: React.FC<AsymmetricHashStudioProps> = ({
  onOpenAITutorWithPrompt,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'rsa' | 'dh' | 'sha' | 'hmac' | 'ecc'>('rsa');

  // RSA States
  const [rsaP, setRsaP] = useState<number>(61);
  const [rsaQ, setRsaQ] = useState<number>(53);
  const [rsaE, setRsaE] = useState<number>(17);
  const [rsaPlaintext, setRsaPlaintext] = useState<string>('HI VIT');
  const [webCryptoStatus, setWebCryptoStatus] = useState<string>('');

  // Diffie-Hellman States
  const [dhPrime, setDhPrime] = useState<number>(23);
  const [dhGen, setDhGen] = useState<number>(5);
  const [dhAlicePriv, setDhAlicePriv] = useState<number>(6);
  const [dhBobPriv, setDhBobPriv] = useState<number>(15);
  const [dhSimulateMitm, setDhSimulateMitm] = useState<boolean>(false);
  const [dhEvePriv, setDhEvePriv] = useState<number>(8);

  // SHA-256 & Avalanche States
  const [shaInput, setShaInput] = useState<string>('Vidyalankar CNS Lab 2026');
  const [shaCompareInput, setShaCompareInput] = useState<string>('Vidyalankar CNS Lab 2027');

  // HMAC States
  const [hmacMsg, setHmacMsg] = useState<string>('Transfer $50,000 to Account #8492');
  const [hmacKey, setHmacKey] = useState<string>('SuperSecretHmacKey@2026');
  const [hmacTamper, setHmacTamper] = useState<boolean>(false);

  // ECC States
  const [eccScalar, setEccScalar] = useState<number>(7);

  // RSA Calculations
  const rsaKeyGen = useMemo(() => {
    return generateEducationalRSA(rsaP, rsaQ, rsaE);
  }, [rsaP, rsaQ, rsaE]);

  const rsaEncryption = useMemo(() => {
    if (!rsaKeyGen.isValid) return { cipherValues: [], steps: [] };
    return rsaEncrypt(rsaPlaintext, rsaKeyGen.e, rsaKeyGen.n);
  }, [rsaPlaintext, rsaKeyGen]);

  const rsaDecryption = useMemo(() => {
    if (!rsaKeyGen.isValid || rsaEncryption.cipherValues.length === 0) return { text: '', steps: [] };
    return rsaDecrypt(rsaEncryption.cipherValues, rsaKeyGen.d, rsaKeyGen.n);
  }, [rsaEncryption, rsaKeyGen]);

  // Real Web Crypto RSA Demo
  const handleRunWebCryptoRsa = async () => {
    try {
      setWebCryptoStatus('Generating 2048-bit RSA-OAEP key pair with window.crypto.subtle...');
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]), // 65537
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
      );

      const enc = new TextEncoder().encode(rsaPlaintext);
      const cipherBuf = await window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        keyPair.publicKey,
        enc
      );

      const decBuf = await window.crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        keyPair.privateKey,
        cipherBuf
      );

      const restored = new TextDecoder().decode(decBuf);
      const cipherHex = Array.from(new Uint8Array(cipherBuf))
        .slice(0, 16)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

      setWebCryptoStatus(
        `✅ Success! 2048-bit RSA-OAEP Encrypted (${cipherBuf.byteLength} bytes). Sample Hex: ${cipherHex}... Decrypted: "${restored}"`
      );
    } catch (err: any) {
      setWebCryptoStatus(`❌ WebCrypto Error: ${err.message}`);
    }
  };

  // Diffie-Hellman Calculations
  const dhResult = useMemo(() => {
    return simulateDiffieHellman(
      dhPrime,
      dhGen,
      dhAlicePriv,
      dhBobPriv,
      dhSimulateMitm,
      dhEvePriv
    );
  }, [dhPrime, dhGen, dhAlicePriv, dhBobPriv, dhSimulateMitm, dhEvePriv]);

  // SHA-256 Calculations & Avalanche
  const shaTraceResult = useMemo(() => {
    return sha256Trace(shaInput);
  }, [shaInput]);

  const avalancheStats = useMemo(() => {
    const hash1 = sha256Pure(shaInput);
    const hash2 = sha256Pure(shaCompareInput);

    let flippedBits = 0;
    for (let i = 0; i < 64; i++) {
      const n1 = parseInt(hash1[i] || '0', 16);
      const n2 = parseInt(hash2[i] || '0', 16);
      const xor = n1 ^ n2;
      flippedBits += (xor & 1) + ((xor >> 1) & 1) + ((xor >> 2) & 1) + ((xor >> 3) & 1);
    }

    const percentage = ((flippedBits / 256) * 100).toFixed(1);
    return { hash1, hash2, flippedBits, percentage };
  }, [shaInput, shaCompareInput]);

  // HMAC Calculations
  const hmacInputText = hmacTamper ? hmacMsg.replace('50,000', '950,000') : hmacMsg;
  const hmacTrace = useMemo(() => {
    return hmacSha256Trace(hmacInputText, hmacKey);
  }, [hmacInputText, hmacKey]);

  // ECC Calculations
  const eccResult = useMemo(() => {
    return ecMultiply(eccScalar, DEFAULT_ECC_CURVE.G, DEFAULT_ECC_CURVE);
  }, [eccScalar]);

  // Execution Traces for Trace Player
  const currentTrace: AlgorithmTrace = useMemo(() => {
    if (activeSubTab === 'rsa') {
      return generateAlgorithmTrace({
        method: 'rsa',
        operation: 'encrypt',
        text: rsaPlaintext,
        rsaP,
        rsaQ,
        rsaE,
      });
    } else if (activeSubTab === 'dh') {
      return generateAlgorithmTrace({
        method: 'diffie_hellman',
        operation: 'encrypt',
        text: 'Diffie-Hellman',
        dhPrime,
        dhGen,
        dhAlicePriv,
        dhBobPriv,
      });
    } else if (activeSubTab === 'sha') {
      return generateAlgorithmTrace({
        method: 'sha256',
        operation: 'encrypt',
        text: shaInput,
      });
    } else if (activeSubTab === 'hmac') {
      return generateAlgorithmTrace({
        method: 'hmac',
        operation: 'encrypt',
        text: hmacInputText,
        blockKey: hmacKey,
      });
    } else {
      return generateAlgorithmTrace({
        method: 'ecc',
        operation: 'encrypt',
        text: 'ECC',
        eccScalar,
      });
    }
  }, [activeSubTab, rsaPlaintext, rsaP, rsaQ, rsaE, dhPrime, dhGen, dhAlicePriv, dhBobPriv, shaInput, hmacInputText, hmacKey, eccScalar]);

  const handleAskAITutor = (step: AlgorithmStep, tr: AlgorithmTrace) => {
    if (onOpenAITutorWithPrompt) {
      const prompt = `I am analyzing ${tr.algorithmName} in the Asymmetric & Hash Laboratory. Can you explain step #${step.index + 1}: "${step.title}"?\nDetails: ${step.description}\nMath: ${step.mathematicalExplanation}`;
      onOpenAITutorWithPrompt(prompt);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#14141A] border border-[#262626] rounded-2xl shadow-md">
        {[
          { id: 'rsa', label: 'RSA Public-Key', icon: KeyRound },
          { id: 'dh', label: 'Diffie-Hellman & MitM', icon: ArrowRightLeft },
          { id: 'sha', label: 'SHA-256 & Avalanche', icon: Hash },
          { id: 'hmac', label: 'HMAC Message Auth', icon: ShieldCheck },
          { id: 'ecc', label: 'ECC Elliptic Curves', icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono-code text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#FF3E00] text-white shadow-md shadow-[#FF3E00]/25'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. RSA TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'rsa' && (
        <div className="space-y-6">
          <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
                  Asymmetric Trapdoor Function
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-[#FF3E00]" />
                  RSA (Rivest–Shamir–Adleman) Laboratory
                </h3>
              </div>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono-code rounded-lg">
                FIPS / Educational Mode
              </span>
            </div>

            {/* Parameter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3.5">
                <label className="text-xs font-mono-code text-zinc-400 block mb-1">
                  Prime p (Educational)
                </label>
                <input
                  type="number"
                  value={rsaP}
                  onChange={(e) => setRsaP(Number(e.target.value))}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-code text-sm focus:border-[#FF3E00] outline-none"
                />
              </div>

              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3.5">
                <label className="text-xs font-mono-code text-zinc-400 block mb-1">
                  Prime q (Educational)
                </label>
                <input
                  type="number"
                  value={rsaQ}
                  onChange={(e) => setRsaQ(Number(e.target.value))}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-code text-sm focus:border-[#FF3E00] outline-none"
                />
              </div>

              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3.5">
                <label className="text-xs font-mono-code text-zinc-400 block mb-1">
                  Public Exponent e
                </label>
                <input
                  type="number"
                  value={rsaE}
                  onChange={(e) => setRsaE(Number(e.target.value))}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-code text-sm focus:border-[#FF3E00] outline-none"
                />
              </div>

              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3.5">
                <label className="text-xs font-mono-code text-zinc-400 block mb-1">
                  Plaintext Message
                </label>
                <input
                  type="text"
                  value={rsaPlaintext}
                  onChange={(e) => setRsaPlaintext(e.target.value)}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-code text-sm focus:border-[#FF3E00] outline-none"
                />
              </div>
            </div>

            {/* Key Derivation Cards */}
            {rsaKeyGen.isValid ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono-code text-xs">
                <div className="bg-[#14141E] border border-emerald-500/30 rounded-xl p-4 space-y-1.5">
                  <span className="text-emerald-400 font-bold block text-[11px] uppercase">
                    Public Key (e, n)
                  </span>
                  <div className="text-white text-base font-bold">
                    ({rsaKeyGen.e}, {rsaKeyGen.n})
                  </div>
                  <div className="text-zinc-400 text-[11px]">
                    Shareable with the public. Used to encrypt messages.
                  </div>
                </div>

                <div className="bg-[#14141E] border border-amber-500/30 rounded-xl p-4 space-y-1.5">
                  <span className="text-amber-400 font-bold block text-[11px] uppercase">
                    Private Trapdoor Key (d, n)
                  </span>
                  <div className="text-white text-base font-bold">
                    ({rsaKeyGen.d}, {rsaKeyGen.n})
                  </div>
                  <div className="text-zinc-400 text-[11px]">
                    Secret! Derived via d = e⁻¹ mod φ(n).
                  </div>
                </div>

                <div className="bg-[#14141E] border border-zinc-800 rounded-xl p-4 space-y-1.5">
                  <span className="text-zinc-400 font-bold block text-[11px] uppercase">
                    Euler's Totient φ(n)
                  </span>
                  <div className="text-white text-base font-bold">{rsaKeyGen.phi}</div>
                  <div className="text-zinc-400 text-[11px]">
                    ({rsaP} - 1) · ({rsaQ} - 1)
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 font-mono-code text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{rsaKeyGen.error}</span>
              </div>
            )}

            {/* Results Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-code text-xs">
              <div className="bg-[#14141F] border border-zinc-800 rounded-xl p-4 space-y-2">
                <span className="text-zinc-400 uppercase text-[10px] block">
                  Encrypted Ciphertext Numbers (C = M^e mod n)
                </span>
                <div className="p-3 bg-[#0C0C12] rounded-lg text-emerald-400 font-bold break-all">
                  {rsaEncryption.cipherValues.join(' ')}
                </div>
              </div>

              <div className="bg-[#14141F] border border-zinc-800 rounded-xl p-4 space-y-2">
                <span className="text-zinc-400 uppercase text-[10px] block">
                  Decrypted Restored Text (M = C^d mod n)
                </span>
                <div className="p-3 bg-[#0C0C12] rounded-lg text-white font-bold break-all">
                  {rsaDecryption.text}
                </div>
              </div>
            </div>

            {/* WebCrypto Comparison Section */}
            <div className="pt-2 border-t border-zinc-800/80">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Production Mode: Web Crypto API (2048-bit RSA-OAEP)
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Compare small educational primes with real production 2048-bit RSA-OAEP.
                  </p>
                </div>
                <button
                  onClick={handleRunWebCryptoRsa}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono-code text-xs font-bold rounded-xl border border-zinc-700 transition-colors"
                >
                  Generate 2048-bit RSA Key & Encrypt
                </button>
              </div>

              {webCryptoStatus && (
                <div className="p-3 bg-[#0A0A0F] border border-zinc-800 rounded-lg font-mono-code text-xs text-zinc-300">
                  {webCryptoStatus}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Step-by-Step Trace */}
          <InteractiveTracePlayer trace={currentTrace} onAskAITutorAboutStep={handleAskAITutor} />
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. DIFFIE-HELLMAN TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'dh' && (
        <div className="space-y-6">
          <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
                  Discrete Logarithm Problem
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-[#FF3E00]" />
                  Diffie-Hellman Key Exchange & MitM Attack Simulator
                </h3>
              </div>

              <label className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono-code rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={dhSimulateMitm}
                  onChange={(e) => setDhSimulateMitm(e.target.checked)}
                  className="accent-red-500"
                />
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Simulate Eve MitM Attack</span>
              </label>
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3.5">
                <label className="text-xs font-mono-code text-zinc-400 block mb-1">
                  Public Prime p
                </label>
                <input
                  type="number"
                  value={dhPrime}
                  onChange={(e) => setDhPrime(Number(e.target.value))}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-code text-sm outline-none"
                />
              </div>

              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3.5">
                <label className="text-xs font-mono-code text-zinc-400 block mb-1">
                  Public Generator g
                </label>
                <input
                  type="number"
                  value={dhGen}
                  onChange={(e) => setDhGen(Number(e.target.value))}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-code text-sm outline-none"
                />
              </div>

              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3.5">
                <label className="text-xs font-mono-code text-zinc-400 block mb-1">
                  Alice Secret a
                </label>
                <input
                  type="number"
                  value={dhAlicePriv}
                  onChange={(e) => setDhAlicePriv(Number(e.target.value))}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-code text-sm outline-none"
                />
              </div>

              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3.5">
                <label className="text-xs font-mono-code text-zinc-400 block mb-1">
                  Bob Secret b
                </label>
                <input
                  type="number"
                  value={dhBobPriv}
                  onChange={(e) => setDhBobPriv(Number(e.target.value))}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono-code text-sm outline-none"
                />
              </div>
            </div>

            {/* Alice vs Bob Exchange Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Alice Box */}
              <div className="bg-[#14141E] border border-blue-500/30 rounded-2xl p-5 space-y-3 font-mono-code text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-blue-400 font-bold text-sm">Alice (Sender)</span>
                  <span className="text-zinc-500">Secret: a = {dhAlicePriv}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-400">Public Key A = g^a mod p:</div>
                  <div className="text-lg font-bold text-white">
                    {dhGen}^{dhAlicePriv} mod {dhPrime} ={' '}
                    <span className="text-blue-400">{dhResult.alicePublic}</span>
                  </div>
                </div>
                <div className="space-y-1 pt-2 border-t border-zinc-800/60">
                  <div className="text-zinc-400">Calculated Shared Secret S_A:</div>
                  <div className="text-xl font-bold text-emerald-400">
                    S_A = {dhResult.aliceSharedSecret}
                  </div>
                </div>
              </div>

              {/* Bob Box */}
              <div className="bg-[#14141E] border border-purple-500/30 rounded-2xl p-5 space-y-3 font-mono-code text-xs">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-purple-400 font-bold text-sm">Bob (Receiver)</span>
                  <span className="text-zinc-500">Secret: b = {dhBobPriv}</span>
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-400">Public Key B = g^b mod p:</div>
                  <div className="text-lg font-bold text-white">
                    {dhGen}^{dhBobPriv} mod {dhPrime} ={' '}
                    <span className="text-purple-400">{dhResult.bobPublic}</span>
                  </div>
                </div>
                <div className="space-y-1 pt-2 border-t border-zinc-800/60">
                  <div className="text-zinc-400">Calculated Shared Secret S_B:</div>
                  <div className="text-xl font-bold text-emerald-400">
                    S_B = {dhResult.bobSharedSecret}
                  </div>
                </div>
              </div>
            </div>

            {/* MitM Demonstration Warning */}
            {dhSimulateMitm && dhResult.mitmSimulation && (
              <div className="bg-red-500/10 border border-red-500/40 rounded-2xl p-5 space-y-3 font-mono-code text-xs text-red-200">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>MAN-IN-THE-MIDDLE ATTACK ACTIVE: EVE HAS COMPROMISED KEY EXCHANGE!</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Because classic Diffie-Hellman does not authenticate the parties, Eve intercepts Alice's public key A and replaces it with her own public key, and does the same to Bob.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-[#181014] border border-red-500/30 p-3 rounded-lg">
                    <span className="text-zinc-400 block mb-1">Eve-Alice Shared Key:</span>
                    <span className="text-amber-400 font-bold text-base">
                      {dhResult.mitmSimulation.eveAliceShared}
                    </span>
                  </div>
                  <div className="bg-[#181014] border border-red-500/30 p-3 rounded-lg">
                    <span className="text-zinc-400 block mb-1">Eve-Bob Shared Key:</span>
                    <span className="text-amber-400 font-bold text-base">
                      {dhResult.mitmSimulation.eveBobShared}
                    </span>
                  </div>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  <strong>Defensive Lesson:</strong> This demonstrates why unauthenticated Diffie-Hellman cannot provide confidentiality against an active attacker. Modern systems require digital certificates (TLS/PKI) or pre-shared authentication.
                </p>
              </div>
            )}
          </div>

          <InteractiveTracePlayer trace={currentTrace} onAskAITutorAboutStep={handleAskAITutor} />
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. SHA-256 TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'sha' && (
        <div className="space-y-6">
          <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
                  NIST FIPS 180-4 Cryptographic Hash
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Hash className="w-5 h-5 text-[#FF3E00]" />
                  SHA-256 Compression & Avalanche Effect Studio
                </h3>
              </div>
            </div>

            {/* Input & Output */}
            <div className="space-y-3 font-mono-code text-xs">
              <label className="text-zinc-400 block">Input String</label>
              <input
                type="text"
                value={shaInput}
                onChange={(e) => setShaInput(e.target.value)}
                className="w-full bg-[#161622] border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#FF3E00]"
              />

              <div className="bg-[#0C0C12] border border-zinc-800 rounded-xl p-4 space-y-1.5">
                <span className="text-zinc-500 uppercase text-[10px] block font-bold">
                  SHA-256 Digest (256 bits / 64 hex characters)
                </span>
                <div className="text-emerald-400 font-bold text-sm sm:text-base break-all">
                  {shaTraceResult.finalDigestHex}
                </div>
              </div>
            </div>

            {/* Avalanche Effect Interactive Demonstration */}
            <div className="bg-[#14141E] border border-zinc-800 rounded-2xl p-5 space-y-4 font-mono-code text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm border-b border-zinc-800 pb-2">
                <Activity className="w-4 h-4" />
                <span>Avalanche Effect Experiment (Strict Avalanche Criterion)</span>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed">
                A strong cryptographic hash function must exhibit the avalanche effect: changing even a single bit in the input must cause an unpredictable change of approximately 50% of the output bits.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-zinc-500 block mb-1">Message A</span>
                  <input
                    type="text"
                    value={shaInput}
                    onChange={(e) => setShaInput(e.target.value)}
                    className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg p-2 text-white"
                  />
                  <div className="text-zinc-400 text-[11px] truncate mt-1">
                    Hash: {avalancheStats.hash1}
                  </div>
                </div>

                <div>
                  <span className="text-zinc-500 block mb-1">Message B (1-character difference)</span>
                  <input
                    type="text"
                    value={shaCompareInput}
                    onChange={(e) => setShaCompareInput(e.target.value)}
                    className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg p-2 text-white"
                  />
                  <div className="text-zinc-400 text-[11px] truncate mt-1">
                    Hash: {avalancheStats.hash2}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#0A0A0F] border border-zinc-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">
                    Flipped Output Bits
                  </span>
                  <div className="text-xl font-bold text-amber-400">
                    {avalancheStats.flippedBits} / 256 bits ({avalancheStats.percentage}%)
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-zinc-500 block text-[10px] uppercase font-bold">
                    Ideal Avalanche
                  </span>
                  <div className="text-sm font-bold text-emerald-400">~128 bits (50%)</div>
                </div>
              </div>
            </div>
          </div>

          <InteractiveTracePlayer trace={currentTrace} onAskAITutorAboutStep={handleAskAITutor} />
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. HMAC TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'hmac' && (
        <div className="space-y-6">
          <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
                  RFC 2104 Keyed-Hash Message Authentication
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#FF3E00]" />
                  HMAC (Hash-based Message Authentication Code)
                </h3>
              </div>

              <label className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono-code rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={hmacTamper}
                  onChange={(e) => setHmacTamper(e.target.checked)}
                  className="accent-amber-500"
                />
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Simulate Man-in-the-Middle Message Tampering</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-code text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Message Content</label>
                <input
                  type="text"
                  value={hmacMsg}
                  onChange={(e) => setHmacMsg(e.target.value)}
                  className="w-full bg-[#161622] border border-zinc-700 rounded-xl p-3 text-white outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Secret Key (K)</label>
                <input
                  type="text"
                  value={hmacKey}
                  onChange={(e) => setHmacKey(e.target.value)}
                  className="w-full bg-[#161622] border border-zinc-700 rounded-xl p-3 text-white outline-none"
                />
              </div>
            </div>

            {/* Inner / Outer Padding Diagram */}
            <div className="bg-[#14141E] border border-zinc-800 rounded-xl p-4 font-mono-code text-xs space-y-2">
              <div className="text-zinc-400 text-[11px]">
                HMAC(K, m) = H((K ⊕ opad) ∥ H((K ⊕ ipad) ∥ m))
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 bg-[#0C0C12] rounded border border-zinc-800">
                  <span className="text-zinc-500 block">Inner Pad (ipad = 0x36):</span>
                  <span className="text-zinc-300 truncate block">{hmacTrace.ipadHex.slice(0, 32)}...</span>
                </div>
                <div className="p-2.5 bg-[#0C0C12] rounded border border-zinc-800">
                  <span className="text-zinc-500 block">Outer Pad (opad = 0x5C):</span>
                  <span className="text-zinc-300 truncate block">{hmacTrace.opadHex.slice(0, 32)}...</span>
                </div>
              </div>
            </div>

            {/* Final HMAC Tag */}
            <div className="p-4 bg-[#0A0A0F] border border-zinc-800 rounded-xl font-mono-code text-xs space-y-2">
              <span className="text-zinc-500 uppercase text-[10px] font-bold block">
                Calculated HMAC-SHA256 Authentication Tag
              </span>
              <div className="text-base sm:text-lg font-bold text-emerald-400 break-all">
                {hmacTrace.hmacDigestHex}
              </div>
              {hmacTamper && (
                <div className="text-red-400 text-xs flex items-center gap-1.5 mt-1">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    Tampered input detected! Recipient recalculating HMAC will produce a mismatch, rejecting the unauthorized transfer.
                  </span>
                </div>
              )}
            </div>
          </div>

          <InteractiveTracePlayer trace={currentTrace} onAskAITutorAboutStep={handleAskAITutor} />
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. ECC TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === 'ecc' && (
        <div className="space-y-6">
          <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
                  Algebraic Geometry over Finite Fields
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#FF3E00]" />
                  Elliptic Curve Cryptography (ECC) Point Multiplier
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-code text-xs">
              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-2">
                <span className="text-zinc-400 uppercase text-[10px] block">
                  Weierstrass Curve Parameters
                </span>
                <div className="text-white text-sm font-bold">
                  y² ≡ x³ + {DEFAULT_ECC_CURVE.a}x + {DEFAULT_ECC_CURVE.b} (mod {DEFAULT_ECC_CURVE.p})
                </div>
                <div className="text-zinc-400 text-[11px]">
                  Generator Point G = ({DEFAULT_ECC_CURVE.G.x}, {DEFAULT_ECC_CURVE.G.y})
                </div>
              </div>

              <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-2">
                <label className="text-zinc-400 uppercase text-[10px] block">
                  Private Key Scalar d (or k)
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={eccScalar}
                  onChange={(e) => setEccScalar(Number(e.target.value))}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg p-2.5 text-white outline-none"
                />
                <div className="text-emerald-400 text-sm font-bold pt-1">
                  Public Key Point Q = {eccScalar} · G = ({eccResult.result.x}, {eccResult.result.y})
                </div>
              </div>
            </div>
          </div>

          <InteractiveTracePlayer trace={currentTrace} onAskAITutorAboutStep={handleAskAITutor} />
        </div>
      )}
    </div>
  );
};
