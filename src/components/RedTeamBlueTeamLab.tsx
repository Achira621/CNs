import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Flame,
  Zap,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Server,
  Lock,
} from 'lucide-react';

interface SimulationScenario {
  id: string;
  title: string;
  flawedSystem: string;
  redObjective: string;
  redAttackVector: string;
  blueDefenses: {
    id: string;
    title: string;
    isOptimal: boolean;
    explanation: string;
  }[];
}

const RED_BLUE_SCENARIOS: SimulationScenario[] = [
  {
    id: 'des-keyspace',
    title: 'Exhaustive Search on Small Keyspace (DES 56-bit)',
    flawedSystem: 'Legacy financial backend encrypting wire messages using single DES (56-bit key).',
    redObjective: 'Recover secret encryption key by running parallel FPGA brute-force search over 2⁵⁶ keys.',
    redAttackVector: 'Custom FPGA cluster (similar to EFF Deep Crack / Crack.sh) executing 2⁵⁶ DES trials in under 24 hours.',
    blueDefenses: [
      {
        id: '2des',
        title: 'Upgrade to 2DES (Double DES)',
        isOptimal: false,
        explanation: 'Sub-optimal: 2DES is vulnerable to the Meet-in-the-Middle attack, yielding only 2⁵⁷ effective security with 2⁵⁶ memory!',
      },
      {
        id: 'aes256',
        title: 'Upgrade to AES-256-GCM',
        isOptimal: true,
        explanation: 'Optimal: AES-256 keyspace (2²⁵⁶) is physically impossible to brute-force with all the compute and energy in the known universe.',
      },
      {
        id: 'caesar',
        title: 'Add Caesar shift before DES',
        isOptimal: false,
        explanation: 'Flawed: Adds only 25 operations of obfuscation (security through obscurity) with zero cryptographic strength.',
      },
    ],
  },
  {
    id: 'ecb-leakage',
    title: 'Pattern Leakage in Database Field Encryption (ECB Mode)',
    flawedSystem: 'Cloud medical database encrypting high-resolution diagnostic scans using AES in ECB mode.',
    redObjective: 'Identify tumor shapes and patient identity without cracking the AES key.',
    redAttackVector: 'Passive eavesdropping: observing that identical 16-byte pixel blocks produce identical ciphertext blocks.',
    blueDefenses: [
      {
        id: 'gcm',
        title: 'Switch to AES-256-GCM with unique random 96-bit IV per scan',
        isOptimal: true,
        explanation: 'Optimal: GCM mode diffuses block dependencies and provides cryptographic authenticity, preventing both pattern leakage and tampering.',
      },
      {
        id: 'compress',
        title: 'Compress image before ECB encryption',
        isOptimal: false,
        explanation: 'Flawed: Compression before unauthenticated encryption can expose compression oracle vulnerabilities (CRIME/BREACH).',
      },
      {
        id: 'longer-key',
        title: 'Increase AES key length from 128 to 256 bits while keeping ECB',
        isOptimal: false,
        explanation: 'Flawed: Key length does not fix mode flaws. ECB with a 256-bit key still leaks identical blocks identically!',
      },
    ],
  },
  {
    id: 'mitm-dh',
    title: 'Man-in-the-Middle on Unauthenticated Key Exchange',
    flawedSystem: 'IoT telemetry channel using Diffie-Hellman key exchange without certificates or pre-shared keys.',
    redObjective: 'Actively intercept public keys A and B, injecting Eve\'s keys to read all traffic.',
    redAttackVector: 'ARP spoofing on the local subnet to intercept Diffie-Hellman public key values.',
    blueDefenses: [
      {
        id: 'pki',
        title: 'Deploy X.509 PKI Certificates and Sign KeyShares (TLS 1.3 / ECDHE)',
        isOptimal: true,
        explanation: 'Optimal: Cryptographic authentication via digital certificates binds each party to their public key, preventing MitM.',
      },
      {
        id: 'larger-prime',
        title: 'Increase Diffie-Hellman prime p to 4096 bits without authentication',
        isOptimal: false,
        explanation: 'Flawed: A larger prime prevents discrete log computation, but Eve does not need to compute discrete logs to perform a MitM attack!',
      },
      {
        id: 'hash-secret',
        title: 'Hash the shared secret with SHA-256',
        isOptimal: false,
        explanation: 'Flawed: Eve establishes two independent shared secrets anyway; hashing them does not prevent Eve from decrypting and re-encrypting.',
      },
    ],
  },
];

export const RedTeamBlueTeamLab: React.FC = () => {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState(0);
  const [selectedDefenseId, setSelectedDefenseId] = useState<string | null>(null);
  const [simulationRun, setSimulationRun] = useState(false);

  const scenario = RED_BLUE_SCENARIOS[selectedScenarioIdx];
  const chosenDefense = scenario.blueDefenses.find((d) => d.id === selectedDefenseId);

  const handleRunSimulation = () => {
    if (!selectedDefenseId) return;
    setSimulationRun(true);
  };

  const handleReset = () => {
    setSelectedDefenseId(null);
    setSimulationRun(false);
  };

  return (
    <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6 font-mono-code text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[10px] text-[#FF3E00] font-bold uppercase tracking-wider">
            Attack & Defense Simulation Arena
          </span>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF3E00]" />
            Red Team vs Blue Team Security Laboratory
          </h4>
        </div>

        <div className="flex gap-2">
          {RED_BLUE_SCENARIOS.map((sc, i) => (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenarioIdx(i);
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedScenarioIdx === i
                  ? 'bg-[#FF3E00] text-white shadow-md'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Scenario {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-[#161622] border border-zinc-800 rounded-xl space-y-2">
        <span className="text-zinc-400 font-bold block uppercase text-xs">
          Vulnerable Target Architecture:
        </span>
        <h5 className="text-white font-bold text-sm font-sans">{scenario.title}</h5>
        <p className="text-zinc-300 font-sans text-xs leading-relaxed">{scenario.flawedSystem}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Red Team Column */}
        <div className="bg-[#181014] border border-red-500/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-red-400 font-bold text-sm border-b border-red-500/20 pb-2">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            <span>Red Team (Adversary Strategy)</span>
          </div>

          <div className="space-y-1.5 font-sans">
            <span className="text-zinc-400 text-xs font-bold font-mono-code uppercase block">
              Attacker Objective:
            </span>
            <p className="text-zinc-300 text-xs">{scenario.redObjective}</p>
          </div>

          <div className="space-y-1.5 font-sans">
            <span className="text-zinc-400 text-xs font-bold font-mono-code uppercase block">
              Exploitation Vector:
            </span>
            <p className="text-zinc-300 text-xs">{scenario.redAttackVector}</p>
          </div>
        </div>

        {/* Blue Team Column */}
        <div className="bg-[#10141A] border border-blue-500/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm border-b border-blue-500/20 pb-2">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            <span>Blue Team (Defense Selection)</span>
          </div>

          <div className="space-y-2">
            <span className="text-zinc-400 text-xs font-bold font-mono-code uppercase block">
              Choose Defensive Remediation:
            </span>
            {scenario.blueDefenses.map((def) => {
              const isSelected = selectedDefenseId === def.id;
              return (
                <button
                  key={def.id}
                  onClick={() => {
                    setSelectedDefenseId(def.id);
                    setSimulationRun(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500 text-white font-bold shadow-md'
                      : 'bg-[#14141E] border-zinc-800 text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <div className="font-semibold text-xs">{def.title}</div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={!selectedDefenseId}
            className="w-full py-2.5 bg-[#FF3E00] hover:bg-[#E03700] disabled:opacity-40 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>Simulate Engagement Outcome</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Engagement Outcome Box */}
      {simulationRun && chosenDefense && (
        <div
          className={`p-5 rounded-2xl border space-y-3 ${
            chosenDefense.isOptimal
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/10 border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {chosenDefense.isOptimal ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>ENGAGEMENT OUTCOME: BLUE TEAM VICTORY! ATTACK NEUTRALIZED</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span>ENGAGEMENT OUTCOME: RED TEAM COMPROMISE! DEFENSE INSUFFICIENT</span>
              </>
            )}
          </div>

          <p className="text-zinc-200 font-sans text-xs leading-relaxed">
            {chosenDefense.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
