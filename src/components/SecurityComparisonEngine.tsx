import React, { useState } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Scale,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { AlgorithmSecurityProfile, CipherMethod } from '../types';

export const ALGORITHM_PROFILES: Record<string, AlgorithmSecurityProfile> = {
  caesar: {
    id: 'caesar_default',
    name: 'Caesar Cipher',
    category: 'monoalphabetic',
    inventedYear: '~58 BC',
    inventors: 'Julius Caesar',
    keyType: 'symmetric',
    standardKeySizes: 'Single shift key (1-25)',
    effectiveKeyspace: '25 possible keys (5 bits)',
    mathFoundation: 'Modular addition: (x + k) mod 26',
    complexity: 'O(1) per byte',
    primaryUseCases: ['Historical battlefield messages', 'Elementary education', 'ROT13 obfuscation'],
    vulnerabilities: ['Brute-force in 25 tries', 'Direct single-letter frequency analysis'],
    status: 'Cryptographically Broken',
    recommendedAlternative: 'AES-GCM for symmetric encryption',
    nistStatus: 'Unacceptable for any security use',
    whyChosenOrDeprecated: 'Deprecated due to trivial keyspace (25 shifts) easily broken by hand in seconds.',
  },
  affine: {
    id: 'affine',
    name: 'Affine Cipher',
    category: 'monoalphabetic',
    inventedYear: 'Ancient / Modern formalization',
    inventors: 'Classical mathematicians',
    keyType: 'symmetric',
    standardKeySizes: 'Key pair (a, b) where gcd(a,26)=1',
    effectiveKeyspace: '12 × 26 = 312 keys (~8.3 bits)',
    mathFoundation: 'Linear congruences: (ax + b) mod 26',
    complexity: 'O(1) per byte',
    primaryUseCases: ['Teaching modular arithmetic & Extended Euclidean Algorithm'],
    vulnerabilities: ['Exhaustive search (312 keys)', 'Known-plaintext attack with only 2 letters', 'Frequency analysis'],
    status: 'Cryptographically Broken',
    recommendedAlternative: 'AES-256',
    nistStatus: 'Educational only',
    whyChosenOrDeprecated: 'Insecure linear mapping completely exposed by frequency analysis and modular linear equations.',
  },
  vigenere: {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    category: 'polyalphabetic',
    inventedYear: '1553 / 1586',
    inventors: 'Giovan Battista Bellaso / Blaise de Vigenère',
    keyType: 'symmetric',
    standardKeySizes: 'Variable keyword length L',
    effectiveKeyspace: '26^L possible keys',
    mathFoundation: 'Polyalphabetic cyclic shift: (P_i + K_i) mod 26',
    complexity: 'O(1) per byte',
    primaryUseCases: ['Historical diplomacy', 'Teaching periodic cryptanalysis'],
    vulnerabilities: ['Kasiski examination', 'Friedman Index of Coincidence (IoC)', 'Periodicity leakage'],
    status: 'Cryptographically Broken',
    recommendedAlternative: 'One-Time Pad (if perfectly random key used once) or AES',
    nistStatus: 'Broken since 1863 (Babbage / Kasiski)',
    whyChosenOrDeprecated: 'Once considered "le chiffre indéchiffrable", broken by Kasiski examination exploiting keyword repetition.',
  },
  playfair: {
    id: 'playfair',
    name: 'Playfair Cipher',
    category: 'polyalphabetic',
    inventedYear: '1854',
    inventors: 'Charles Wheatstone (promoted by Lord Playfair)',
    keyType: 'symmetric',
    standardKeySizes: '5×5 Matrix (25 letters, I/J combined)',
    effectiveKeyspace: '25! ≈ 1.55 × 10^25 (~83 bits without symmetries)',
    mathFoundation: 'Geometric digraph substitutions on 5×5 grid',
    complexity: 'O(1) per digraph',
    primaryUseCases: ['Boer War & WWI British tactical communications'],
    vulnerabilities: ['Digraph frequency analysis (600 pairs vs 26 single letters)', 'Known plaintext pairs'],
    status: 'Cryptographically Broken',
    recommendedAlternative: 'AES-GCM',
    nistStatus: 'Obsolete since 1914',
    whyChosenOrDeprecated: 'Digraph frequencies still reflect underlying language characteristics, allowing automated cryptanalysis.',
  },
  hill: {
    id: 'hill',
    name: 'Hill Cipher',
    category: 'polyalphabetic',
    inventedYear: '1929',
    inventors: 'Lester S. Hill',
    keyType: 'symmetric',
    standardKeySizes: 'n×n invertible matrix mod 26 (e.g. 2×2, 3×3)',
    effectiveKeyspace: 'GL(2, Z_26) = 157,248 keys (~17.2 bits for 2×2)',
    mathFoundation: 'Linear algebra: C = K · P mod 26 with det(K) coprime to 26',
    complexity: 'O(n²) per n-character vector',
    primaryUseCases: ['Linear algebra & matrix cryptography instruction'],
    vulnerabilities: ['Completely broken by Known-Plaintext Attack using Gaussian elimination mod 26', 'Linearity'],
    status: 'Cryptographically Broken',
    recommendedAlternative: 'AES (which introduces non-linear S-boxes over GF(2⁸))',
    nistStatus: 'Educational only',
    whyChosenOrDeprecated: 'Completely linear! If an attacker knows n plaintext-ciphertext vectors, the entire key matrix is found in milliseconds.',
  },
  des: {
    id: 'des',
    name: 'DES (Data Encryption Standard)',
    category: 'modern',
    inventedYear: '1977',
    inventors: 'IBM & NSA (FIPS PUB 46)',
    keyType: 'symmetric',
    standardKeySizes: '56 bits (64 bits with 8 parity bits)',
    effectiveKeyspace: '2^56 ≈ 7.2 × 10^16 keys',
    mathFoundation: '16-Round Feistel Network, S-Boxes, P-Boxes, Expansion',
    complexity: 'O(1) per 64-bit block',
    primaryUseCases: ['Financial ATM transactions (historically)', 'Legacy hardware'],
    vulnerabilities: ['Brute-force crackable in <24 hours using modern FPGA/ASIC (EFF Deep Crack / Crack.sh)', 'Small 64-bit block size (Sweet32 attack)'],
    status: 'Obsolete',
    recommendedAlternative: 'AES-256',
    nistStatus: 'Withdrawn in 2005 (FIPS 46-3 deprecated)',
    whyChosenOrDeprecated: '56-bit key length is far too small against modern compute clusters; 64-bit blocks suffer collision attacks.',
  },
  '3des': {
    id: '3des',
    name: '3DES (Triple DES / TDEA)',
    category: 'modern',
    inventedYear: '1998',
    inventors: 'ANSI X9.52 / NIST',
    keyType: 'symmetric',
    standardKeySizes: '112 bits (2-key) or 168 bits (3-key)',
    effectiveKeyspace: '2^112 (effective due to meet-in-the-middle on 3-key is 112 bits)',
    mathFoundation: 'Cascade EDE Feistel: C = E_K3(D_K2(E_K1(P)))',
    complexity: 'O(1) per 64-bit block (3× slower than DES)',
    primaryUseCases: ['EMV payment chips', 'Legacy banking systems'],
    vulnerabilities: ['Sweet32 birthday attack on 64-bit blocks after 32GB data', 'Slow software performance'],
    status: 'Obsolete',
    recommendedAlternative: 'AES-GCM (128 or 256-bit)',
    nistStatus: 'Disallowed for new applications by NIST SP 800-131A Rev 2 (Dec 2023 sunset)',
    whyChosenOrDeprecated: 'Deprecated due to vulnerable 64-bit block size enabling Sweet32 collisions and sluggish Feistel performance.',
  },
  aes: {
    id: 'aes',
    name: 'AES (Advanced Encryption Standard / Rijndael)',
    category: 'modern',
    inventedYear: '2001',
    inventors: 'Vincent Rijmen & Joan Daemen (FIPS 197)',
    keyType: 'symmetric',
    standardKeySizes: '128, 192, or 256 bits',
    effectiveKeyspace: '2^128, 2^192, 2^256 keys',
    mathFoundation: 'Substitution-Permutation Network (SPN) over Galois Field GF(2⁸)',
    complexity: 'O(1) per 128-bit block (hardware-accelerated via AES-NI)',
    primaryUseCases: ['Global standard: TLS 1.3, HTTPS, Wi-Fi WPA3, disk encryption (BitLocker, FileVault), VPNs'],
    vulnerabilities: ['No practical analytical breaks exist; vulnerable to cache side-channel attacks if poorly implemented without constant-time logic'],
    status: 'Modern Standard',
    recommendedAlternative: 'Currently the gold standard symmetric cipher',
    nistStatus: 'Active FIPS 197 standard; Approved for Top Secret protection',
    whyChosenOrDeprecated: 'Chosen by NIST in 2001 for exceptional mathematical elegance, diffusion/confusion properties, and hardware efficiency.',
  },
  rsa: {
    id: 'rsa',
    name: 'RSA (Rivest–Shamir–Adleman)',
    category: 'asymmetric',
    inventedYear: '1977',
    inventors: 'Ron Rivest, Adi Shamir, Leonard Adleman',
    keyType: 'asymmetric',
    standardKeySizes: '2048, 3072, 4096 bits (modulus n)',
    effectiveKeyspace: 'Integer factorization trapdoor: n = p · q',
    mathFoundation: 'Euler Totient Theorem & modular exponentiation: C = M^e mod n',
    complexity: 'O(k³) per operation (computationally heavy)',
    primaryUseCases: ['Digital signatures (PKCS#1, PSS)', 'Key encapsulation (OAEP)', 'TLS certificate chains'],
    vulnerabilities: ['Small keys (<2048 bits) factorable', 'Vulnerable to Shor\'s Quantum Algorithm', 'Bleichenbacher padding oracle (if PKCS#1 v1.5 used)'],
    status: 'Modern Standard',
    recommendedAlternative: 'ECDSA / Ed25519 (for faster signatures) or ML-KEM (post-quantum)',
    nistStatus: 'Approved for 2048+ bits; transitioning to Post-Quantum Cryptography (PQC)',
    whyChosenOrDeprecated: 'Foundational public-key system; still widely deployed but being phased out for smaller ECC keys and quantum-safe PQC.',
  },
  diffie_hellman: {
    id: 'diffie_hellman',
    name: 'Diffie-Hellman Key Exchange',
    category: 'asymmetric',
    inventedYear: '1976',
    inventors: 'Whitfield Diffie & Martin Hellman',
    keyType: 'shared secret',
    standardKeySizes: '2048+ bits (FFDHE) or 256+ bits (ECDH)',
    effectiveKeyspace: 'Discrete Logarithm Problem over finite fields or elliptic curve groups',
    mathFoundation: 'g^(ab) = (g^a)^b = (g^b)^a mod p',
    complexity: 'O(k³) modular exponentiation',
    primaryUseCases: ['Ephemeral session key establishment (Forward Secrecy in TLS, SSH, Signal)'],
    vulnerabilities: ['Man-in-the-Middle if unauthenticated', 'Logjam attack on 512/768-bit primes', 'Quantum vulnerable (Shor)'],
    status: 'Modern Standard',
    recommendedAlternative: 'ECDH (Curve25519) or Post-Quantum ML-KEM',
    nistStatus: 'Approved for 2048+ bits (ECDH preferred)',
    whyChosenOrDeprecated: 'Pioneered public-key cryptography; enables Perfect Forward Secrecy (PFS) in modern secure communications.',
  },
  sha256: {
    id: 'sha256',
    name: 'SHA-256',
    category: 'hashing',
    inventedYear: '2001',
    inventors: 'NSA (NIST FIPS 180-4)',
    keyType: 'none (unkeyed)',
    standardKeySizes: '256-bit digest output',
    effectiveKeyspace: 'Preimage resistance: 2^256; Collision resistance: 2^128',
    mathFoundation: 'Merkle–Damgård construction with Davies–Meyer 64-round compression',
    complexity: 'O(n) streaming blocks',
    primaryUseCases: ['Digital signature digests', 'Bitcoin blockchain proof-of-work', 'Software integrity verification (checksums)'],
    vulnerabilities: ['Length-extension attacks (mitigated by using HMAC-SHA256 or SHA-3)'],
    status: 'Modern Standard',
    recommendedAlternative: 'SHA-3 / BLAKE3 for length-extension immunity',
    nistStatus: 'Active FIPS 180-4 standard; globally trusted',
    whyChosenOrDeprecated: 'Robust cryptographic hash with high preimage and collision resistance; no known practical collisions.',
  },
  hmac: {
    id: 'hmac',
    name: 'HMAC (Hash-based MAC)',
    category: 'hashing',
    inventedYear: '1996',
    inventors: 'Mihir Bellare, Ran Canetti, Hugo Krawczyk (RFC 2104)',
    keyType: 'symmetric',
    standardKeySizes: 'Key size matching hash block size (e.g. 256 bits)',
    effectiveKeyspace: 'Equal to underlying hash preimage resistance',
    mathFoundation: 'Nested hash padding: H((K ⊕ opad) ∥ H((K ⊕ ipad) ∥ m))',
    complexity: 'O(n) proportional to message length',
    primaryUseCases: ['API request signing (AWS SigV4, GitHub Webhooks)', 'JWT token signatures (HS256)', 'TLS record integrity'],
    vulnerabilities: ['Timing side channels if verification does not use constant-time comparison (`crypto.timingSafeEqual`)'],
    status: 'Modern Standard',
    recommendedAlternative: 'KMAC (SHA-3 based) or AES-GMAC',
    nistStatus: 'Active FIPS 198-1 standard',
    whyChosenOrDeprecated: 'Mathematically proven secure against length-extension attacks that affect raw unkeyed hash functions.',
  },
  ecc: {
    id: 'ecc',
    name: 'ECC (Elliptic Curve Cryptography)',
    category: 'asymmetric',
    inventedYear: '1985',
    inventors: 'Neal Koblitz & Victor Miller',
    keyType: 'asymmetric',
    standardKeySizes: '256, 384, 521 bits (e.g. P-256, Curve25519)',
    effectiveKeyspace: '256-bit ECC provides equivalent security to 3072-bit RSA!',
    mathFoundation: 'Elliptic Curve Discrete Logarithm Problem (ECDLP) over abelian groups',
    complexity: 'O(k²) scalar point multiplication (much faster than RSA for key generation)',
    primaryUseCases: ['Modern TLS 1.3 key exchange (ECDHE)', 'Digital signatures (ECDSA, Ed25519)', 'Cryptocurrency (Secp256k1)'],
    vulnerabilities: ['Vulnerable to Shor\'s Quantum Algorithm on cryptographically relevant quantum computers; invalid curve attacks if parameters unvalidated'],
    status: 'Modern Standard',
    recommendedAlternative: 'State-of-the-art until Post-Quantum Cryptography transition',
    nistStatus: 'Active NIST FIPS 186-5 standard; Recommended for all new public-key deployments',
    whyChosenOrDeprecated: 'Provides immense cryptographic strength with tiny keys (256-bit vs 3072-bit RSA), dramatically speeding up mobile & web handshakes.',
  },
};

export const SecurityComparisonEngine: React.FC = () => {
  const [selectedAlgoA, setSelectedAlgoA] = useState<string>('aes');
  const [selectedAlgoB, setSelectedAlgoB] = useState<string>('des');
  const [selectedAlgoC, setSelectedAlgoC] = useState<string>('affine');
  const [showThreeWay, setShowThreeWay] = useState<boolean>(false);

  const profileA = ALGORITHM_PROFILES[selectedAlgoA];
  const profileB = ALGORITHM_PROFILES[selectedAlgoB];
  const profileC = ALGORITHM_PROFILES[selectedAlgoC];

  const getStatusBadge = (status: AlgorithmSecurityProfile['status']) => {
    switch (status) {
      case 'Modern Standard':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 w-max">
            <ShieldCheck className="w-3 h-3" />
            <span>Modern Standard</span>
          </span>
        );
      case 'Obsolete':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center gap-1 w-max">
            <AlertTriangle className="w-3 h-3" />
            <span>Obsolete / Deprecated</span>
          </span>
        );
      case 'Cryptographically Broken':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-red-500/15 border border-red-500/30 text-red-400 flex items-center gap-1 w-max">
            <ShieldAlert className="w-3 h-3" />
            <span>Broken</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center gap-1 w-max">
            <Info className="w-3 h-3" />
            <span>{status}</span>
          </span>
        );
    }
  };

  const algorithmKeys = Object.keys(ALGORITHM_PROFILES);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
              Architectural & Cryptographic Analysis
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#FF3E00]" />
              Security Comparison Engine
            </h3>
          </div>

          <label className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 text-xs font-mono-code rounded-xl border border-zinc-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showThreeWay}
              onChange={(e) => setShowThreeWay(e.target.checked)}
              className="accent-[#FF3E00]"
            />
            <span>Enable 3-Way Comparative Matrix</span>
          </label>
        </div>

        <p className="text-zinc-400 text-xs leading-relaxed font-sans">
          Cryptographic security is not a single scalar value. It depends on parameter choice, key management, mathematical trapdoors, implementation hygiene (side-channel resistance), and threat models. Select algorithms below to inspect side-by-side trade-offs.
        </p>

        {/* Algorithm Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3">
            <label className="text-xs font-mono-code text-zinc-400 block mb-1">
              Primary Algorithm (A)
            </label>
            <select
              value={selectedAlgoA}
              onChange={(e) => setSelectedAlgoA(e.target.value)}
              className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg p-2 text-white font-mono-code text-xs outline-none"
            >
              {algorithmKeys.map((key) => (
                <option key={key} value={key}>
                  {ALGORITHM_PROFILES[key].name} ({ALGORITHM_PROFILES[key].category})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3">
            <label className="text-xs font-mono-code text-zinc-400 block mb-1">
              Secondary Algorithm (B)
            </label>
            <select
              value={selectedAlgoB}
              onChange={(e) => setSelectedAlgoB(e.target.value)}
              className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg p-2 text-white font-mono-code text-xs outline-none"
            >
              {algorithmKeys.map((key) => (
                <option key={key} value={key}>
                  {ALGORITHM_PROFILES[key].name} ({ALGORITHM_PROFILES[key].category})
                </option>
              ))}
            </select>
          </div>

          {showThreeWay && (
            <div className="bg-[#161622] border border-zinc-800 rounded-xl p-3">
              <label className="text-xs font-mono-code text-zinc-400 block mb-1">
                Tertiary Algorithm (C)
              </label>
              <select
                value={selectedAlgoC}
                onChange={(e) => setSelectedAlgoC(e.target.value)}
                className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg p-2 text-white font-mono-code text-xs outline-none"
              >
                {algorithmKeys.map((key) => (
                  <option key={key} value={key}>
                    {ALGORITHM_PROFILES[key].name} ({ALGORITHM_PROFILES[key].category})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-[#101016] border border-[#262626] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono-code text-xs">
            <thead>
              <tr className="bg-[#161622] border-b border-zinc-800 text-zinc-400 text-[11px] uppercase">
                <th className="p-4 w-1/4">Evaluation Dimension</th>
                <th className="p-4 text-white font-bold border-l border-zinc-800">
                  {profileA?.name}
                </th>
                <th className="p-4 text-white font-bold border-l border-zinc-800">
                  {profileB?.name}
                </th>
                {showThreeWay && (
                  <th className="p-4 text-white font-bold border-l border-zinc-800">
                    {profileC?.name}
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              <tr>
                <td className="p-4 font-bold text-zinc-400">Security Status</td>
                <td className="p-4 border-l border-zinc-800">{getStatusBadge(profileA?.status)}</td>
                <td className="p-4 border-l border-zinc-800">{getStatusBadge(profileB?.status)}</td>
                {showThreeWay && (
                  <td className="p-4 border-l border-zinc-800">{getStatusBadge(profileC?.status)}</td>
                )}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-400">Category & Key Type</td>
                <td className="p-4 border-l border-zinc-800 text-zinc-200">
                  <div className="capitalize font-bold text-white">{profileA?.category}</div>
                  <div className="text-zinc-500 text-[11px]">{profileA?.keyType}</div>
                </td>
                <td className="p-4 border-l border-zinc-800 text-zinc-200">
                  <div className="capitalize font-bold text-white">{profileB?.category}</div>
                  <div className="text-zinc-500 text-[11px]">{profileB?.keyType}</div>
                </td>
                {showThreeWay && (
                  <td className="p-4 border-l border-zinc-800 text-zinc-200">
                    <div className="capitalize font-bold text-white">{profileC?.category}</div>
                    <div className="text-zinc-500 text-[11px]">{profileC?.keyType}</div>
                  </td>
                )}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-400">Key Size & Effective Keyspace</td>
                <td className="p-4 border-l border-zinc-800 text-zinc-200">
                  <div className="text-white font-bold">{profileA?.standardKeySizes}</div>
                  <div className="text-amber-400 text-[11px] mt-0.5">{profileA?.effectiveKeyspace}</div>
                </td>
                <td className="p-4 border-l border-zinc-800 text-zinc-200">
                  <div className="text-white font-bold">{profileB?.standardKeySizes}</div>
                  <div className="text-amber-400 text-[11px] mt-0.5">{profileB?.effectiveKeyspace}</div>
                </td>
                {showThreeWay && (
                  <td className="p-4 border-l border-zinc-800 text-zinc-200">
                    <div className="text-white font-bold">{profileC?.standardKeySizes}</div>
                    <div className="text-amber-400 text-[11px] mt-0.5">{profileC?.effectiveKeyspace}</div>
                  </td>
                )}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-400">Mathematical Foundation</td>
                <td className="p-4 border-l border-zinc-800 text-zinc-300 text-[11px] leading-relaxed">
                  {profileA?.mathFoundation}
                </td>
                <td className="p-4 border-l border-zinc-800 text-zinc-300 text-[11px] leading-relaxed">
                  {profileB?.mathFoundation}
                </td>
                {showThreeWay && (
                  <td className="p-4 border-l border-zinc-800 text-zinc-300 text-[11px] leading-relaxed">
                    {profileC?.mathFoundation}
                  </td>
                )}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-400">Computational Complexity</td>
                <td className="p-4 border-l border-zinc-800 text-emerald-400 font-bold">
                  {profileA?.complexity}
                </td>
                <td className="p-4 border-l border-zinc-800 text-emerald-400 font-bold">
                  {profileB?.complexity}
                </td>
                {showThreeWay && (
                  <td className="p-4 border-l border-zinc-800 text-emerald-400 font-bold">
                    {profileC?.complexity}
                  </td>
                )}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-400">Known Vulnerabilities & Attacks</td>
                <td className="p-4 border-l border-zinc-800 text-red-300 text-[11px]">
                  <ul className="list-disc pl-4 space-y-1">
                    {profileA?.vulnerabilities.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </td>
                <td className="p-4 border-l border-zinc-800 text-red-300 text-[11px]">
                  <ul className="list-disc pl-4 space-y-1">
                    {profileB?.vulnerabilities.map((v, i) => (
                      <li key={i}>{v}</li>
                    ))}
                  </ul>
                </td>
                {showThreeWay && (
                  <td className="p-4 border-l border-zinc-800 text-red-300 text-[11px]">
                    <ul className="list-disc pl-4 space-y-1">
                      {profileC?.vulnerabilities.map((v, i) => (
                        <li key={i}>{v}</li>
                      ))}
                    </ul>
                  </td>
                )}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-400">NIST / Industry Status</td>
                <td className="p-4 border-l border-zinc-800 text-zinc-300 text-[11px]">
                  {profileA?.nistStatus}
                </td>
                <td className="p-4 border-l border-zinc-800 text-zinc-300 text-[11px]">
                  {profileB?.nistStatus}
                </td>
                {showThreeWay && (
                  <td className="p-4 border-l border-zinc-800 text-zinc-300 text-[11px]">
                    {profileC?.nistStatus}
                  </td>
                )}
              </tr>

              <tr>
                <td className="p-4 font-bold text-zinc-400">Why Chosen or Deprecated</td>
                <td className="p-4 border-l border-zinc-800 text-zinc-400 text-[11px] leading-relaxed">
                  {profileA?.whyChosenOrDeprecated}
                </td>
                <td className="p-4 border-l border-zinc-800 text-zinc-400 text-[11px] leading-relaxed">
                  {profileB?.whyChosenOrDeprecated}
                </td>
                {showThreeWay && (
                  <td className="p-4 border-l border-zinc-800 text-zinc-400 text-[11px] leading-relaxed">
                    {profileC?.whyChosenOrDeprecated}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
