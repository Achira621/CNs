import React, { useState } from 'react';
import {
  Building2,
  MessageSquare,
  FileCheck2,
  Globe2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  FileSignature,
  Server,
  User,
} from 'lucide-react';
import { sha256Pure } from '../utils/hashMath';

export const RealWorldScenarios: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<'banking' | 'messaging' | 'signing' | 'tls'>('banking');

  // Scenario A: Online Banking States
  const [bankingStep, setBankingStep] = useState(0);
  const [bankingAmount, setBankingAmount] = useState('5000');
  const [bankingMitmActive, setBankingMitmActive] = useState(false);

  // Scenario B: Secure Messaging States
  const [messagingStep, setMessagingStep] = useState(0);
  const [msgAliceText, setMsgAliceText] = useState('Meet at the library at 5 PM.');
  const [msgTamper, setMsgTamper] = useState(false);

  // Scenario C: Digital Document Signing States
  const [docContent, setDocContent] = useState(
    'LEGAL CONTRACT: The undersigned parties agree that Payment of $25,000 shall be issued on October 1st, 2026.'
  );
  const [docTampered, setDocTampered] = useState(false);
  const originalDigest = React.useMemo(() => sha256Pure(docContent), [docContent]);
  const currentDocContent = docTampered ? docContent.replace('$25,000', '$250,000') : docContent;
  const currentDigest = React.useMemo(() => sha256Pure(currentDocContent), [currentDocContent]);
  const isSignatureValid = originalDigest === currentDigest;

  // Scenario D: TLS 1.3 Simulator States
  const [tlsStep, setTlsStep] = useState(0);

  return (
    <div className="space-y-6">
      {/* Header Selector */}
      <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
              Applied Cryptographic Systems
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-[#FF3E00]" />
              Real-World Cryptography Scenario Simulator
            </h3>
          </div>
          <span className="px-3 py-1 bg-[#1A1A24] text-zinc-300 text-xs font-mono-code rounded-lg border border-zinc-700">
            Interactive Decision Environment
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1 font-mono-code text-xs">
          {[
            { id: 'banking', label: '1. Online Banking', icon: Building2 },
            { id: 'messaging', label: '2. E2E Secure Messaging', icon: MessageSquare },
            { id: 'signing', label: '3. Digital Document Signing', icon: FileCheck2 },
            { id: 'tls', label: '4. TLS 1.3 Handshake', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScenario === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveScenario(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                  isActive
                    ? 'bg-[#FF3E00] text-white shadow-md shadow-[#FF3E00]/25'
                    : 'bg-[#161622] text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* SCENARIO A: ONLINE BANKING */}
      {/* ----------------------------------------------------------------- */}
      {activeScenario === 'banking' && (
        <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6 font-mono-code text-xs">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase">Scenario A</span>
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                Online Banking Fund Transfer Protocol
              </h4>
            </div>
            <button
              onClick={() => {
                setBankingStep(0);
                setBankingMitmActive(false);
              }}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
            {[
              { idx: 0, title: '1. TLS Handshake & Cert', desc: 'Verify Bank Identity' },
              { idx: 1, title: '2. Session Key Derivation', desc: 'AES-256-GCM Established' },
              { idx: 2, title: '3. Signed Transfer Request', desc: 'Customer Signs Digest' },
              { idx: 3, title: '4. Bank Execution & MAC', desc: 'Authenticity Confirmed' },
            ].map((st) => (
              <div
                key={st.idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  bankingStep === st.idx
                    ? 'bg-[#FF3E00]/15 border-[#FF3E00] text-white font-bold'
                    : bankingStep > st.idx
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-[#181824] border-zinc-800 text-zinc-500'
                }`}
              >
                <div className="text-xs">{st.title}</div>
                <div className="text-[10px] text-zinc-400 mt-1">{st.desc}</div>
              </div>
            ))}
          </div>

          {/* Interactive Steps Box */}
          <div className="bg-[#161622] border border-zinc-800 rounded-xl p-5 space-y-4">
            {bankingStep === 0 && (
              <div className="space-y-3">
                <h5 className="text-white font-bold text-sm">Step 1: Certificate Verification</h5>
                <p className="text-zinc-300 leading-relaxed font-sans">
                  The client browser connects to <code>https://bank.secure.vit.edu</code>. The server sends its X.509 Digital Certificate containing its public key signed by an accredited Root Certificate Authority (CA).
                </p>
                <div className="p-3 bg-[#0E0E14] border border-zinc-800 rounded-lg text-emerald-400">
                  ✔ Valid CA signature chain: Root CA ➔ Intermediate CA ➔ Bank Identity. Domain matches.
                </div>
                <button
                  onClick={() => setBankingStep(1)}
                  className="px-4 py-2 bg-[#FF3E00] hover:bg-[#E03700] text-white font-bold rounded-lg"
                >
                  Verify Certificate & Proceed to Key Exchange ➔
                </button>
              </div>
            )}

            {bankingStep === 1 && (
              <div className="space-y-3">
                <h5 className="text-white font-bold text-sm">Step 2: Ephemeral Key Exchange (ECDHE)</h5>
                <p className="text-zinc-300 leading-relaxed font-sans">
                  Client and server perform Elliptic Curve Diffie-Hellman Ephemeral (ECDHE) to derive a shared symmetric session secret (AES-256-GCM). This guarantees <strong>Perfect Forward Secrecy (PFS)</strong>: even if the bank's long-term private key is stolen years later, past sessions cannot be decrypted.
                </p>
                <div className="p-3 bg-[#0E0E14] border border-zinc-800 rounded-lg text-zinc-300">
                  Shared Session Key Established: <code>0x8F4C2A91... [256 bits]</code>
                </div>
                <button
                  onClick={() => setBankingStep(2)}
                  className="px-4 py-2 bg-[#FF3E00] hover:bg-[#E03700] text-white font-bold rounded-lg"
                >
                  Prepare Transfer Payload ➔
                </button>
              </div>
            )}

            {bankingStep === 2 && (
              <div className="space-y-3">
                <h5 className="text-white font-bold text-sm">Step 3: Transaction Signature & Tamper Check</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-zinc-400 block mb-1">Transfer Amount ($)</label>
                    <input
                      type="text"
                      value={bankingAmount}
                      onChange={(e) => setBankingAmount(e.target.value)}
                      className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg cursor-pointer text-red-300">
                      <input
                        type="checkbox"
                        checked={bankingMitmActive}
                        onChange={(e) => setBankingMitmActive(e.target.checked)}
                        className="accent-red-500"
                      />
                      <span>Simulate Man-in-the-Middle Payload Modification ($500,000)</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={() => setBankingStep(3)}
                  className="px-4 py-2 bg-[#FF3E00] hover:bg-[#E03700] text-white font-bold rounded-lg"
                >
                  Sign Payload & Submit to Bank ➔
                </button>
              </div>
            )}

            {bankingStep === 3 && (
              <div className="space-y-3">
                <h5 className="text-white font-bold text-sm">Step 4: Bank Validation & Execution</h5>
                {bankingMitmActive ? (
                  <div className="p-4 bg-red-500/10 border border-red-500/40 rounded-xl text-red-300 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>TRANSACTION REJECTED: Cryptographic MAC Verification Failed!</span>
                    </div>
                    <p className="text-zinc-300 font-sans text-xs">
                      The attacker modified the payload from ${bankingAmount} to $500,000. However, because AES-GCM uses an authenticated 128-bit authentication tag, the bank's decryption engine detected payload tampering and immediately terminated the session.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-emerald-300 space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>TRANSACTION APPROVED: Transfer of ${bankingAmount} Executed!</span>
                    </div>
                    <p className="text-zinc-300 font-sans text-xs">
                      Confidentiality (AES-256), Integrity & Authenticity (GCM Tag), and Non-Repudiation (Digital Signature) all verified with 100% mathematical certainty.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => setBankingStep(0)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg"
                >
                  Run Another Transaction Experiment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* SCENARIO B: SECURE MESSAGING */}
      {/* ----------------------------------------------------------------- */}
      {activeScenario === 'messaging' && (
        <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6 font-mono-code text-xs">
          <div className="border-b border-zinc-800 pb-4">
            <span className="text-[10px] text-blue-400 font-bold uppercase">Scenario B</span>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              End-to-End Encrypted (E2EE) Chat Protocol (Alice ➔ Bob)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#161622] border border-blue-500/30 rounded-xl p-5 space-y-3">
              <span className="text-blue-400 font-bold block text-sm">Alice (Sender)</span>
              <div>
                <label className="text-zinc-400 block mb-1">Type Plaintext Message</label>
                <input
                  type="text"
                  value={msgAliceText}
                  onChange={(e) => setMsgAliceText(e.target.value)}
                  className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>
              <div className="p-3 bg-[#0C0C12] rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Ciphertext in Transit (over untrusted network):</span>
                <span className="text-emerald-400 truncate block font-bold">
                  {sha256Pure(msgAliceText + 'SALT_SECRET').slice(0, 32)}... [AES-GCM]
                </span>
              </div>
            </div>

            <div className="bg-[#161622] border border-purple-500/30 rounded-xl p-5 space-y-3">
              <span className="text-purple-400 font-bold block text-sm">Bob (Recipient)</span>
              <label className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded-lg cursor-pointer text-red-300">
                <input
                  type="checkbox"
                  checked={msgTamper}
                  onChange={(e) => setMsgTamper(e.target.checked)}
                  className="accent-red-500"
                />
                <span>Eve Modifies Message in Flight</span>
              </label>

              <div className="p-3 bg-[#0C0C12] rounded-lg border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Decrypted by Bob:</span>
                {msgTamper ? (
                  <span className="text-red-400 font-bold">
                    ⚠️ AUTHENTICATION ERROR: Message was modified in transit. Bob's app silently rejects the frame.
                  </span>
                ) : (
                  <span className="text-white font-bold">"{msgAliceText}"</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* SCENARIO C: DIGITAL DOCUMENT SIGNING */}
      {/* ----------------------------------------------------------------- */}
      {activeScenario === 'signing' && (
        <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6 font-mono-code text-xs">
          <div className="border-b border-zinc-800 pb-4">
            <span className="text-[10px] text-emerald-400 font-bold uppercase">Scenario C</span>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-emerald-400" />
              Digital Document Signing & Integrity Verification
            </h4>
          </div>

          <div className="space-y-3">
            <label className="text-zinc-400 block">Contract / Document Content</label>
            <textarea
              rows={3}
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              className="w-full bg-[#161622] border border-zinc-700 rounded-xl p-3 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#14141E] border border-zinc-800 rounded-xl p-4 space-y-1.5">
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                Original SHA-256 Digest (Signed with Signer's Private Key)
              </span>
              <div className="text-emerald-400 font-bold break-all">{originalDigest}</div>
            </div>

            <div className="bg-[#14141E] border border-zinc-800 rounded-xl p-4 space-y-1.5">
              <span className="text-zinc-500 text-[10px] uppercase font-bold block">
                Recipient Re-calculated Digest on Received Document
              </span>
              <div className={`font-bold break-all ${isSignatureValid ? 'text-emerald-400' : 'text-red-400'}`}>
                {currentDigest}
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl cursor-pointer text-amber-200">
            <input
              type="checkbox"
              checked={docTampered}
              onChange={(e) => setDocTampered(e.target.checked)}
              className="accent-amber-500"
            />
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Simulate Adversary Modifying Contract ($25,000 ➔ $250,000)
            </span>
          </label>

          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              isSignatureValid
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/10 border-red-500/40 text-red-300'
            }`}
          >
            {isSignatureValid ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block text-sm">Digital Signature VALID</span>
                  <span>Document has not been modified since the signer applied their private key.</span>
                </div>
              </>
            ) : (
              <>
                <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <span className="font-bold block text-sm">SIGNATURE INVALID / TAMPER DETECTED!</span>
                  <span>
                    The document digest no longer matches the decrypted signature. The contract is voided.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* SCENARIO D: TLS 1.3 HANDSHAKE */}
      {/* ----------------------------------------------------------------- */}
      {activeScenario === 'tls' && (
        <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6 font-mono-code text-xs">
          <div className="border-b border-zinc-800 pb-4">
            <span className="text-[10px] text-purple-400 font-bold uppercase">Scenario D</span>
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-400" />
              TLS 1.3 Handshake Protocol (1-RTT)
            </h4>
          </div>

          <div className="space-y-4">
            {[
              {
                step: 0,
                sender: 'Client ➔ Server',
                name: 'ClientHello',
                desc: 'Sends supported cipher suites (TLS_AES_256_GCM_SHA384), Client Random, and KeyShare (ECDHE public key parameter).',
              },
              {
                step: 1,
                sender: 'Server ➔ Client',
                name: 'ServerHello + KeyShare',
                desc: 'Selects cipher suite and generates Server ECDHE KeyShare. Both parties immediately calculate the Handshake Secret!',
              },
              {
                step: 2,
                sender: 'Server ➔ Client (Encrypted!)',
                name: 'EncryptedExtensions + Certificate + CertVerify + Finished',
                desc: 'Server sends its X.509 Certificate and signs the handshake transcript. Sent fully encrypted under handshake keys!',
              },
              {
                step: 3,
                sender: 'Client ➔ Server (Encrypted!)',
                name: 'Finished',
                desc: 'Client confirms transcript HMAC and switches to Application Traffic Keys. 1 Round-Trip Time (1-RTT) complete!',
              },
            ].map((st) => (
              <div
                key={st.step}
                className={`p-4 rounded-xl border transition-all ${
                  tlsStep >= st.step
                    ? 'bg-[#181824] border-purple-500/40 text-white'
                    : 'bg-[#101016] border-zinc-800 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-purple-400 font-bold">{st.sender}</span>
                  <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] text-zinc-300 font-bold">
                    {st.name}
                  </span>
                </div>
                <p className="text-zinc-300 text-xs font-sans">{st.desc}</p>
              </div>
            ))}

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setTlsStep((prev) => Math.min(prev + 1, 3))}
                disabled={tlsStep >= 3}
                className="px-4 py-2.5 bg-[#FF3E00] hover:bg-[#E03700] disabled:opacity-40 text-white font-bold rounded-xl"
              >
                Advance Handshake Step ➔
              </button>
              <button
                onClick={() => setTlsStep(0)}
                className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-xl"
              >
                Reset Handshake
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
