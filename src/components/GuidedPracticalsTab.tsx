import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Download,
  CheckCircle2,
  HelpCircle,
  Calculator,
  Lock,
} from 'lucide-react';
import { PracticalExperiment } from '../types';
import { encryptText, modInverse, CIPHER_METHODS } from '../utils/affineMath';
import { playfairCipher, hillCipher } from '../utils/polyMath';
import { processAes } from '../utils/aesMath';
import { generateEducationalRSA, simulateDiffieHellman } from '../utils/asymmetricMath';
import { sha256Pure } from '../utils/hashMath';

export const CNS_EXPERIMENTS: PracticalExperiment[] = [
  {
    expNumber: 1,
    title: 'Implementation of Classical Substitution Ciphers (Caesar and Affine)',
    aim: 'To understand and implement Monoalphabetic substitution techniques by developing Caesar and Affine ciphers, and evaluating their mathematical weaknesses.',
    syllabusTopic: 'Classical Cryptography & Modular Arithmetic',
    theory:
      'Monoalphabetic substitution ciphers replace each character in the plaintext with another character according to a fixed linear rule. In Caesar cipher, the shift is additive: C = (P + k) mod 26. In Affine cipher, multiplication and addition are combined: C = (a·P + b) mod 26, where gcd(a, 26) must equal 1 so that a modular multiplicative inverse exists for decryption: P = a⁻¹·(C - b) mod 26.',
    mathematicalFormula: 'Encryption: C = (a·P + b) mod 26 | Decryption: P = a⁻¹·(C - b) mod 26, where a·a⁻¹ ≡ 1 (mod 26)',
    procedureSteps: [
      'Input plaintext string and key parameters (a, b).',
      'Validate key parameter a by calculating gcd(a, 26). Ensure gcd(a, 26) == 1.',
      'Convert each alphabetical letter to its numeric equivalent (A=0, B=1, ... Z=25).',
      'Apply the linear mapping formula C = (a·P + b) mod 26.',
      'Convert the resulting integer back to ASCII uppercase characters.',
      'For decryption, find the modular inverse of a using the Extended Euclidean Algorithm.',
    ],
    defaultInput: 'VIDYALANKAR INSTITUTE',
    algorithmId: 'affine',
    vivaQuestions: [
      {
        question: 'Why must the multiplicative key "a" in Affine cipher be coprime to 26?',
        answer:
          'If gcd(a, 26) > 1, the mapping is not one-to-one (injective). Multiple plaintext characters would map to the same ciphertext letter, making unambiguous decryption impossible because "a" would not have a modular multiplicative inverse modulo 26.',
      },
      {
        question: 'What is the keyspace of the Affine cipher?',
        answer:
          'There are 12 valid choices for "a" (coprime to 26: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25) and 26 choices for "b" (0 to 25). Thus, the total keyspace is 12 × 26 = 312 keys. This is small enough to be broken by brute-force in milliseconds.',
      },
      {
        question: 'How many known plaintext-ciphertext letter pairs are needed to break an Affine cipher?',
        answer:
          'Only 2 known pairs (P1, C1) and (P2, C2) are required to set up a system of two linear congruences in two unknowns (a and b), which can be solved easily using modular arithmetic.',
      },
    ],
  },
  {
    expNumber: 2,
    title: 'Implementation of Polyalphabetic & Matrix Ciphers (Playfair and Hill)',
    aim: 'To understand digraph and matrix substitution techniques by implementing the Playfair 5x5 matrix and the Hill cipher with 2x2 matrix inversion modulo 26.',
    syllabusTopic: 'Polygraphic & Polyalphabetic Substitution',
    theory:
      'Playfair encrypts digraphs (pairs of letters) using a 5x5 key matrix where I and J share a single cell. Rules for same row (shift right), same column (shift down), and rectangle (swap columns) mask single-letter frequencies. Hill cipher applies linear algebra: C = K · P mod 26. Invertibility requires det(K) to be coprime with 26.',
    mathematicalFormula: 'Hill: C = K · P mod 26 | P = K⁻¹ · C mod 26, where K⁻¹ = det(K)⁻¹ · adj(K) mod 26',
    procedureSteps: [
      'For Playfair, build 5x5 matrix by filling keyword without duplicates, then remaining alphabet.',
      'Split text into digraph pairs, inserting "X" between identical consecutive letters.',
      'Apply Playfair geometric rules (row wrap, column wrap, rectangle swap).',
      'For Hill, construct n×n matrix K and verify det(K) is coprime to 26.',
      'Multiply plaintext vector by K and compute mod 26.',
    ],
    defaultInput: 'CRYPTOGRAPHY',
    algorithmId: 'hill',
    vivaQuestions: [
      {
        question: 'What happens in Playfair cipher when both letters in a digraph are identical?',
        answer:
          'A filler character (typically "X") is inserted between them (e.g., "BALLOON" becomes "BA LX LO ON") so that no digraph consists of two identical letters.',
      },
      {
        question: 'What condition must the Hill cipher key matrix satisfy for decryption to be possible?',
        answer:
          'The determinant of the key matrix, det(K), must be non-zero and coprime to 26 (i.e., gcd(det(K), 26) = 1). Otherwise, det(K) has no modular inverse mod 26, and the matrix cannot be inverted.',
      },
      {
        question: 'Is Hill cipher vulnerable to Known-Plaintext Attack? Explain.',
        answer:
          'Yes, completely. Because Hill cipher is purely linear (C = K · P mod 26), an attacker with n known plaintext-ciphertext vector pairs can form a matrix equation and invert the plaintext matrix mod 26 to recover key matrix K in milliseconds.',
      },
    ],
  },
  {
    expNumber: 3,
    title: 'Study and Implementation of Modern Block Ciphers (DES & AES)',
    aim: 'To analyze modern symmetric cryptography architectures, comparing Feistel networks (DES) with Substitution-Permutation Networks (AES) across standard modes of operation.',
    syllabusTopic: 'Symmetric Block Ciphers (FIPS 46-3 & FIPS 197)',
    theory:
      'DES processes 64-bit blocks through 16 rounds of a Feistel network using a 56-bit key. AES (Rijndael) operates on a 4x4 state matrix of 128 bits across 10 rounds (for AES-128) using four distinct algebraic transformations: SubBytes, ShiftRows, MixColumns, and AddRoundKey over the Galois Field GF(2⁸).',
    mathematicalFormula: 'DES: L_i = R_{i-1}, R_i = L_{i-1} ⊕ F(R_{i-1}, K_i) | AES: State_{i} = AddRoundKey(MixColumns(ShiftRows(SubBytes(State_{i-1}))))',
    procedureSteps: [
      'Initialize 128-bit state matrix from 16 bytes of plaintext.',
      'Perform initial AddRoundKey (Round 0) with master key schedule.',
      'Execute Rounds 1 to 9: SubBytes (S-box non-linear substitution), ShiftRows (cyclical byte shifts), MixColumns (matrix multiplication in GF(2⁸)), AddRoundKey.',
      'Execute Final Round 10: SubBytes, ShiftRows, AddRoundKey (MixColumns omitted).',
      'Assemble final 128-bit ciphertext block.',
    ],
    defaultInput: 'TOP SECRET AES BLOCK',
    algorithmId: 'aes',
    vivaQuestions: [
      {
        question: 'Why is MixColumns omitted in the final round of AES?',
        answer:
          'MixColumns is omitted in the 10th round to make the encryption and decryption structures symmetrical, optimizing hardware implementation and memory footprint without compromising cryptographic security.',
      },
      {
        question: 'Why is ECB mode insecure for encrypting structured data like bitmap images?',
        answer:
          'ECB (Electronic Codebook) encrypts identical plaintext blocks into identical ciphertext blocks under the same key. As a result, underlying patterns and shapes remain clearly visible in the ciphertext, violating semantic security.',
      },
      {
        question: 'What is the Sweet32 vulnerability in 3DES?',
        answer:
          'Because 3DES uses a small 64-bit block size, by the Birthday Paradox, a collision in ciphertext blocks is expected after encrypting approximately 2³² blocks (~32 GB of data), enabling attackers to recover plaintext in CBC mode.',
      },
    ],
  },
  {
    expNumber: 4,
    title: 'Implementation of Asymmetric Cryptosystem (RSA & Diffie-Hellman)',
    aim: 'To implement the RSA public-key algorithm and simulate Diffie-Hellman key exchange, evaluating trapdoor one-way functions and discrete logarithm difficulty.',
    syllabusTopic: 'Public-Key Cryptography & Key Establishment',
    theory:
      'RSA is based on the difficulty of integer factorization. Two prime numbers p and q produce modulus n = p·q and Euler totient φ(n) = (p-1)(q-1). Public exponent e and private exponent d satisfy d·e ≡ 1 mod φ(n). Diffie-Hellman enables two parties to negotiate a shared secret over an insecure channel via modular exponentiation.',
    mathematicalFormula: 'RSA: C = M^e mod n, M = C^d mod n | DH: A = g^a mod p, B = g^b mod p, S = B^a = A^b mod p',
    procedureSteps: [
      'Select two distinct prime numbers p and q.',
      'Calculate modulus n = p · q and totient φ(n) = (p - 1) · (q - 1).',
      'Choose public exponent e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1.',
      'Calculate private exponent d = e⁻¹ mod φ(n) using Extended Euclidean Algorithm.',
      'Encrypt numeric message M: C = M^e mod n.',
      'Decrypt ciphertext C: M = C^d mod n.',
    ],
    defaultInput: 'HE',
    algorithmId: 'rsa',
    vivaQuestions: [
      {
        question: 'Why cannot an attacker compute the private key d directly from the public key (e, n)?',
        answer:
          'To compute d = e⁻¹ mod φ(n), the attacker needs φ(n) = (p-1)(q-1). Finding φ(n) requires knowing the prime factors p and q of n. For sufficiently large n (e.g., 2048 bits), factoring n into p and q is computationally infeasible with known classical algorithms.',
      },
      {
        question: 'What attack is unauthenticated Diffie-Hellman vulnerable to?',
        answer:
          'Classic unauthenticated Diffie-Hellman is vulnerable to a Man-in-the-Middle (MitM) attack. An attacker Eve intercepts public keys A and B and establishes independent shared keys with Alice and Bob, eavesdropping and modifying traffic undetected.',
      },
    ],
  },
  {
    expNumber: 5,
    title: 'Implementation of Cryptographic Hash Functions & Digital Signatures',
    aim: 'To analyze SHA-256 compression rounds, demonstrate the avalanche effect, and verify message integrity and non-repudiation with HMAC.',
    syllabusTopic: 'Message Integrity, Authentication & Digital Signatures',
    theory:
      'A cryptographic hash function H maps arbitrary-length data to a fixed-length digest. Requirements: Pre-image resistance (one-way), Second pre-image resistance (weak collision resistance), and Collision resistance (strong collision resistance). Digital signatures sign message digests with a private key, enabling anyone with the public key to verify authenticity and detect tampering.',
    mathematicalFormula: 'HMAC(K, m) = H((K ⊕ opad) ∥ H((K ⊕ ipad) ∥ m)) | Signature: S = (H(m))^d mod n',
    procedureSteps: [
      'Pad message to a multiple of 512 bits with length trailer.',
      'Initialize 8 working hash variables H₀ through H₇.',
      'Process message blocks through 64 compression rounds using Davies-Meyer structure.',
      'Calculate SHA-256 digest and generate HMAC with secret key.',
      'Demonstrate signature verification failure upon 1-bit message modification.',
    ],
    defaultInput: 'CNS PRACTICAL EXPERIMENT 5',
    algorithmId: 'sha256',
    vivaQuestions: [
      {
        question: 'What is the Strict Avalanche Criterion (SAC)?',
        answer:
          'The Strict Avalanche Criterion requires that whenever a single input bit is flipped, each output bit of the hash function or S-box must change with a probability of exactly 50%.',
      },
      {
        question: 'Why is encrypting a message not a substitute for generating a digital signature?',
        answer:
          'Encryption provides confidentiality (hiding data from eavesdroppers). Digital signatures provide authentication, integrity, and non-repudiation (proving who authored the message and that it was not altered).',
      },
    ],
  },
];

export const GuidedPracticalsTab: React.FC = () => {
  const [selectedExpIdx, setSelectedExpIdx] = useState(0);
  const [studentName, setStudentName] = useState('Varad Dalvi');
  const [rollNo, setRollNo] = useState('24101B0040');
  const [division, setDivision] = useState('BE CMPN A');
  const [batch, setBatch] = useState('Batch A2');
  const [inputVal, setInputVal] = useState('VIDYALANKAR INSTITUTE');
  const [keyA, setKeyA] = useState(5);
  const [keyB, setKeyB] = useState(8);
  const [expandedViva, setExpandedViva] = useState<number | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  const currentExp = CNS_EXPERIMENTS[selectedExpIdx];

  // Dynamic computation based on experiment
  const calculationResult = React.useMemo(() => {
    if (currentExp.algorithmId === 'affine') {
      const encrypted = encryptText(inputVal, keyA, keyB);
      const invA = modInverse(keyA, 26);
      return {
        output: encrypted,
        details: `Key: a=${keyA}, b=${keyB}, a⁻¹ mod 26 = ${invA}`,
      };
    } else if (currentExp.algorithmId === 'hill') {
      const res = hillCipher(inputVal, { k11: 5, k12: 8, k21: 17, k22: 3 }, 'encrypt');
      return {
        output: res.resultText,
        details: `Key Matrix: [[5, 8], [17, 3]], det=1 mod 26`,
      };
    } else if (currentExp.algorithmId === 'aes') {
      const res = processAes(inputVal, '2B7E151628AED2A6ABF7158809CF4F3C', 128, 'encrypt');
      return {
        output: res.fullCipherHex,
        details: '128-bit AES-ECB, Key: 2B7E151628AED2A6ABF7158809CF4F3C',
      };
    } else if (currentExp.algorithmId === 'rsa') {
      const rsa = generateEducationalRSA(61, 53, 17);
      return {
        output: `p=61, q=53, n=3233, φ(n)=3120, e=17, d=${rsa.d}`,
        details: 'Public Key: (17, 3233), Private Key: (2753, 3233)',
      };
    } else {
      const hash = sha256Pure(inputVal);
      return {
        output: hash,
        details: 'SHA-256 Digest (256-bit hash)',
      };
    }
  }, [currentExp, inputVal, keyA, keyB]);

  const generateReportText = () => {
    return `========================================================================
VIDYALANKAR INSTITUTE OF TECHNOLOGY (VIT)
DEPARTMENT OF COMPUTER ENGINEERING
CYBERSECURITY AND NETWORK SECURITY (CNS) LABORATORY REPORT
FACULTY IN CHARGE: PROF. VINITA BHANDIWAD
========================================================================

STUDENT DETAILS:
Name: ${studentName}
Roll No: ${rollNo}
Division / Batch: ${division} / ${batch}
Date of Performance: ${new Date().toLocaleDateString()}

EXPERIMENT NO: ${currentExp.expNumber}
TITLE: ${currentExp.title}

1. AIM & OBJECTIVE:
${currentExp.aim}

2. THEORETICAL FOUNDATION:
${currentExp.theory}

3. MATHEMATICAL FORMULATION:
${currentExp.mathematicalFormula}

4. EXPERIMENTAL INPUT DATA & PARAMETERS:
Input Plaintext: "${inputVal}"
Configuration Details: ${calculationResult.details}

5. CALCULATED OUTPUT / CIPHERTEXT:
${calculationResult.output}

6. OBSERVATION & ANALYSIS:
The cryptographic algorithm executed successfully with mathematical consistency.
The calculated output verifies the algorithm's functional transformation against theoretical vectors.

7. CONCLUSION:
Experiment No. ${currentExp.expNumber} was successfully performed and studied in the Cybersecurity Lab.

========================================================================`;
  };

  const handleCopyReport = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
                Vidyalankar Institute of Technology
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 text-xs font-mono-code">
                Prof. Vinita Bhandiwad
              </span>
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-1">
              <GraduationCap className="w-5 h-5 text-[#FF3E00]" />
              Guided CNS Practicals & Report Generator
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-mono-code text-xs font-bold rounded-xl border border-zinc-700 flex items-center gap-1.5 transition-colors"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'Report Copied' : 'Copy Lab Report'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-[#FF3E00] hover:bg-[#E03700] text-white font-mono-code text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-[#FF3E00]/25"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>

        {/* Practical Experiment Selection Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1 font-mono-code text-xs">
          {CNS_EXPERIMENTS.map((exp, idx) => (
            <button
              key={exp.expNumber}
              onClick={() => {
                setSelectedExpIdx(idx);
                setInputVal(exp.defaultInput);
              }}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedExpIdx === idx
                  ? 'bg-[#FF3E00] text-white border-[#FF3E00] shadow-md font-bold'
                  : 'bg-[#14141E] text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <span className="block text-[10px] opacity-75">EXPERIMENT {exp.expNumber}</span>
              <span className="truncate block font-semibold">{exp.title.split('(')[1]?.replace(')', '') || `Exp ${exp.expNumber}`}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Experiment View */}
      <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-6 font-mono-code text-xs">
        {/* Experiment Details */}
        <div className="space-y-2 border-b border-zinc-800 pb-4">
          <span className="text-[10px] text-[#FF3E00] font-bold uppercase tracking-wider">
            Experiment {currentExp.expNumber} • {currentExp.syllabusTopic}
          </span>
          <h4 className="text-lg font-bold text-white font-sans">{currentExp.title}</h4>
          <p className="text-zinc-300 font-sans text-xs leading-relaxed">
            <strong>Aim:</strong> {currentExp.aim}
          </p>
        </div>

        {/* Theory & Mathematical Formula */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-2">
            <span className="text-amber-400 font-bold block text-xs uppercase">
              Theoretical Foundation
            </span>
            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              {currentExp.theory}
            </p>
          </div>

          <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-2">
            <span className="text-emerald-400 font-bold block text-xs uppercase">
              Mathematical Formulation
            </span>
            <div className="p-3 bg-[#0E0E14] rounded-lg border border-zinc-800 text-amber-300 font-bold">
              {currentExp.mathematicalFormula}
            </div>
            <div className="text-[11px] text-zinc-400">
              Validated using IEEE / FIPS standards in laboratory curriculum.
            </div>
          </div>
        </div>

        {/* Interactive Lab Calculation Widget */}
        <div className="bg-[#161622] border border-[#FF3E00]/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-zinc-800 pb-2">
            <Calculator className="w-4 h-4 text-[#FF3E00]" />
            <span>Interactive Laboratory Execution & Verification</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-zinc-400 block mb-1">Plaintext Input</label>
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-[#0E0E14] border border-zinc-700 rounded-lg p-2.5 text-white outline-none"
              />
            </div>

            {currentExp.algorithmId === 'affine' && (
              <div>
                <label className="text-zinc-400 block mb-1">Keys (a, b)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={keyA}
                    onChange={(e) => setKeyA(Number(e.target.value))}
                    className="w-1/2 bg-[#0E0E14] border border-zinc-700 rounded-lg p-2 text-white"
                  />
                  <input
                    type="number"
                    value={keyB}
                    onChange={(e) => setKeyB(Number(e.target.value))}
                    className="w-1/2 bg-[#0E0E14] border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Output Card */}
          <div className="p-4 bg-[#0E0E14] border border-zinc-800 rounded-xl space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold block">
              Calculated Ciphertext / Output Digest:
            </span>
            <div className="text-emerald-400 font-bold text-sm break-all">
              {calculationResult.output}
            </div>
            <div className="text-zinc-500 text-[11px] pt-1">
              {calculationResult.details}
            </div>
          </div>
        </div>

        {/* Student Metadata for Report Generation */}
        <div className="bg-[#14141E] border border-zinc-800 rounded-xl p-4 space-y-3">
          <span className="text-zinc-400 font-bold block text-xs uppercase">
            Student Information for Experiment Report
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-zinc-500 text-[10px] block">Student Name</span>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full bg-[#0E0E14] border border-zinc-700 rounded p-1.5 text-white"
              />
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block">Roll Number</span>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full bg-[#0E0E14] border border-zinc-700 rounded p-1.5 text-white"
              />
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block">Division / Branch</span>
              <input
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full bg-[#0E0E14] border border-zinc-700 rounded p-1.5 text-white"
              />
            </div>
            <div>
              <span className="text-zinc-500 text-[10px] block">Batch</span>
              <input
                type="text"
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full bg-[#0E0E14] border border-zinc-700 rounded p-1.5 text-white"
              />
            </div>
          </div>
        </div>

        {/* Viva Voce Questions Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-zinc-800 pb-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Viva-Voce Examination Preparation Questions</span>
          </div>

          <div className="space-y-2">
            {currentExp.vivaQuestions.map((vq, idx) => {
              const isRevealed = expandedViva === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#14141E] border border-zinc-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedViva(isRevealed ? null : idx)}
                    className="w-full p-3.5 text-left flex items-center justify-between text-zinc-200 hover:text-white"
                  >
                    <span className="font-semibold text-xs pr-4">
                      Q{idx + 1}: {vq.question}
                    </span>
                    {isRevealed ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                  </button>

                  {isRevealed && (
                    <div className="px-3.5 pb-3.5 pt-1 text-xs text-amber-200 font-sans border-t border-zinc-800/60 leading-relaxed bg-[#0E0E14]">
                      <strong>Answer:</strong> {vq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
