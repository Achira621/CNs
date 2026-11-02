import { CipherMethod, CipherCategory } from '../../types';

export interface AlgorithmMetadata {
  id: CipherMethod;
  name: string;
  category: CipherCategory;
  categoryLabel: string;
  formula: string;
  shortDesc: string;
  historicalContext: string;
  securityRating: 'Broken' | 'Deprecated' | 'Legacy Secure' | 'Current Standard';
  securityColor: string;
  keySpace: string;
  complexity: string;
  samplePlaintext: string;
  sampleKey?: string;
  theory: {
    overview: string;
    steps: string[];
    mathematicalFormula: string;
    securityNotes: string;
  };
  vulnerabilities: {
    title: string;
    description: string;
    mitigation: string;
  }[];
  vivaQuestions: {
    question: string;
    answer: string;
  }[];
}

export const ALGORITHM_CATALOG: Record<CipherMethod, AlgorithmMetadata> = {
  caesar_default: {
    id: 'caesar_default',
    name: 'Caesar Cipher (Shift 3)',
    category: 'monoalphabetic',
    categoryLabel: 'Monoalphabetic',
    formula: 'C = (P + 3) \\pmod{26}',
    shortDesc: 'Classical Roman military substitution cipher with fixed 3-character shift.',
    historicalContext: 'Used by Julius Caesar in 58 BC to protect military dispatches across Gaul.',
    securityRating: 'Broken',
    securityColor: '#EF4444',
    keySpace: '1 key (Trivial)',
    complexity: 'O(N)',
    samplePlaintext: 'RETREAT TO THE NORTH BRIDGE AT DAWN',
    theory: {
      overview: 'Every alphabetical character in plaintext is shifted forward by exactly 3 positions modulo 26.',
      steps: [
        'Map each plaintext character A-Z to integer 0-25.',
        'Compute C = (P + 3) mod 26.',
        'Map the resulting integer back to the ciphertext alphabet.',
      ],
      mathematicalFormula: 'E(x) = (x + 3) \\pmod{26}, \\quad D(y) = (y - 3 + 26) \\pmod{26}',
      securityNotes: 'Completely insecure. Zero key entropy because the shift value is constant.',
    },
    vulnerabilities: [
      {
        title: 'Trivial Direct Reversal',
        description: 'Anyone who knows the cipher is Caesar can decrypt by simply shifting -3.',
        mitigation: 'Use modern cryptographic algorithms such as AES.',
      },
    ],
    vivaQuestions: [
      {
        question: 'What is the key space of the standard Caesar cipher?',
        answer: 'The standard Caesar cipher has a key space of size 1 (shift k = 3). If generalized to any shift k in 0..25, the key space is only 25 usable keys (excluding k=0).',
      },
      {
        question: 'Why does Caesar cipher fail to protect against letter frequency analysis?',
        answer: 'Because it is a monoalphabetic cipher, the frequency distribution of characters is preserved 1:1, meaning E maps predictably to H.',
      },
    ],
  },
  caesar_custom: {
    id: 'caesar_custom',
    name: 'Generalized Caesar Shift',
    category: 'monoalphabetic',
    categoryLabel: 'Monoalphabetic',
    formula: 'C = (P + k) \\pmod{26}',
    shortDesc: 'Additive shift substitution with variable key parameter k between 1 and 25.',
    historicalContext: 'Generalized additive shift cipher formalised during the Renaissance.',
    securityRating: 'Broken',
    securityColor: '#EF4444',
    keySpace: '25 usable keys',
    complexity: 'O(N)',
    samplePlaintext: 'MEET ME BEHIND THE CYBER LAB AT MIDNIGHT',
    theory: {
      overview: 'Shifts each letter forward by k steps along the circular ring of 26 letters.',
      steps: [
        'Select secret integer shift key k in {1, 2, ..., 25}.',
        'Add k to each letter index modulo 26.',
        'Decrypt using reverse shift (y - k) mod 26.',
      ],
      mathematicalFormula: 'C = (P + k) \\pmod{26}, \\quad P = (C - k) \\pmod{26}',
      securityNotes: 'Vulnerable to brute-force exhaustion in under 1 millisecond on any computer.',
    },
    vulnerabilities: [
      {
        title: 'Exhaustive Key Search (Brute Force)',
        description: 'An attacker only needs to test 25 shifts to reveal plain English text.',
        mitigation: 'Use ciphers with key spaces >= 2^128.',
      },
    ],
    vivaQuestions: [
      {
        question: 'How many brute force attempts are required to break a generalized Caesar cipher in the worst case?',
        answer: 'Maximum 25 attempts, since mod 26 yields only 26 residues, and shift 0 does not alter the plaintext.',
      },
    ],
  },
  multiplicative: {
    id: 'multiplicative',
    name: 'Multiplicative Cipher',
    category: 'monoalphabetic',
    categoryLabel: 'Monoalphabetic',
    formula: 'C = (a \\cdot P) \\pmod{26}',
    shortDesc: 'Monoalphabetic cipher using modular multiplication with coprime multiplier a.',
    historicalContext: 'Early modular arithmetic cipher leading towards affine transformations.',
    securityRating: 'Broken',
    securityColor: '#EF4444',
    keySpace: '12 valid keys (coprime to 26)',
    complexity: 'O(N)',
    samplePlaintext: 'CRYPTOGRAPHY AND NETWORK SECURITY VIT LAB',
    theory: {
      overview: 'Multiplies letter positions by key a. For decryption to exist, gcd(a, 26) must be 1.',
      steps: [
        'Validate key a such that gcd(a, 26) = 1.',
        'Compute C = (a * P) mod 26.',
        'Find modular multiplicative inverse a^-1 via Extended Euclidean Algorithm.',
        'Decrypt via P = (a^-1 * C) mod 26.',
      ],
      mathematicalFormula: 'C = (a \\cdot P) \\pmod{26}, \\quad a^{-1} \\cdot a \\equiv 1 \\pmod{26}',
      securityNotes: 'Even smaller key space than Caesar cipher (only 12 valid coprime keys).',
    },
    vulnerabilities: [
      {
        title: 'Zero Mapping Preservation',
        description: 'Letter A (index 0) always maps to A (0 * a mod 26 = 0) regardless of the key.',
        mitigation: 'Introduce an additive shift offset (leading to the Affine cipher).',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why must gcd(a, 26) = 1 in the multiplicative cipher?',
        answer: 'If gcd(a, 26) != 1, two distinct plaintext characters will collide and map to the same ciphertext letter, making unique decryption mathematically impossible.',
      },
    ],
  },
  affine: {
    id: 'affine',
    name: 'Affine Cipher',
    category: 'monoalphabetic',
    categoryLabel: 'Monoalphabetic',
    formula: 'C = (a \\cdot P + b) \\pmod{26}',
    shortDesc: 'Combines multiplicative and additive operations under modulo 26.',
    historicalContext: 'The canonical algebraic monoalphabetic cipher taught in university cryptography courses.',
    securityRating: 'Broken',
    securityColor: '#EF4444',
    keySpace: '312 keys (12 * 26)',
    complexity: 'O(N)',
    samplePlaintext: 'THE EXPANDED AFFINE ALGORITHM EMBEDS LINEAR ALGEBRA',
    theory: {
      overview: 'Applies a linear transformation y = ax + b mod 26 to each alphabetical index.',
      steps: [
        'Verify gcd(a, 26) = 1.',
        'Encrypt: C = (a * P + b) mod 26.',
        'Calculate a^-1 using Extended Euclidean Algorithm.',
        'Decrypt: P = a^-1 * (C - b) mod 26.',
      ],
      mathematicalFormula: 'E(x) = (ax + b) \\pmod{26}, \\quad D(y) = a^{-1}(y - b) \\pmod{26}',
      securityNotes: 'Key space is 12 * 26 = 312 keys. Easily cracked by testing 2 known plaintext letters.',
    },
    vulnerabilities: [
      {
        title: 'Known-Plaintext Attack',
        description: 'Knowing two plaintext-ciphertext letter pairs yields a system of 2 linear equations mod 26.',
        mitigation: 'Use polyalphabetic or modern symmetric ciphers.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Given ciphertext letters corresponding to E and T, how can an attacker solve for keys a and b?',
        answer: 'Set up equations: C1 = 4a + b mod 26 and C2 = 19a + b mod 26. Subtracting gives (C2 - C1) = 15a mod 26. Multiply by 15^-1 mod 26 = 7 to find a, then substitute back to find b.',
      },
    ],
  },
  vigenere: {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    category: 'polyalphabetic',
    categoryLabel: 'Polyalphabetic',
    formula: 'C_i = (P_i + K_{i \\pmod m}) \\pmod{26}',
    shortDesc: 'Polyalphabetic substitution using a cyclic keyword and Tabula Recta.',
    historicalContext: 'Published in 1586 by Blaise de Vigenère; hailed for 3 centuries as "le chiffre indéchiffrable".',
    securityRating: 'Broken',
    securityColor: '#EF4444',
    keySpace: '26^m where m is key length',
    complexity: 'O(N)',
    samplePlaintext: 'ATTACK THE COMMAND CENTER AT DAWN WITH CIPHER KEYS',
    sampleKey: 'CRYPTO',
    theory: {
      overview: 'Uses different Caesar shifts for successive letters based on a repeating keyword.',
      steps: [
        'Repeat secret keyword to match the length of the plaintext.',
        'For each index i, shift P[i] by K[i mod m] mod 26.',
        'Decryption subtracts the key letter: (C[i] - K[i mod m]) mod 26.',
      ],
      mathematicalFormula: 'C_i = (P_i + K_i) \\pmod{26}, \\quad P_i = (C_i - K_i + 26) \\pmod{26}',
      securityNotes: 'Broken by Friedrich Kasiski in 1863 using periodic repeated sequence examination.',
    },
    vulnerabilities: [
      {
        title: 'Kasiski Examination & Index of Coincidence',
        description: 'Finds key length m by computing GCD of distances between repeated n-grams.',
        mitigation: 'Use a random non-repeating key of equal length to message (One-Time Pad).',
      },
    ],
    vivaQuestions: [
      {
        question: 'What is the purpose of Kasiski examination?',
        answer: 'To deduce the length m of the repeating keyword by finding distances between identical ciphertext n-grams and computing their greatest common divisors.',
      },
    ],
  },
  playfair: {
    id: 'playfair',
    name: 'Playfair Cipher',
    category: 'polyalphabetic',
    categoryLabel: 'Polyalphabetic',
    formula: '5 \\times 5 \\text{ Digraph Geometric Matrix Rules}',
    shortDesc: 'First practical digraph substitution cipher operating on 2-letter blocks.',
    historicalContext: 'Invented by Charles Wheatstone in 1854, popularized by Lord Playfair for British tactical communications.',
    securityRating: 'Broken',
    securityColor: '#EF4444',
    keySpace: '25! ≈ 1.55 × 10^25',
    complexity: 'O(N)',
    samplePlaintext: 'HIDE THE GOLD IN THE SECRET CAVE',
    sampleKey: 'MONARCHY',
    theory: {
      overview: 'Arranges letters into a 5x5 key matrix (merging I and J). Encrypts digraphs using row, column, and rectangle rules.',
      steps: [
        'Generate 5x5 matrix from keyword with duplicate removal.',
        'Split plaintext into letter pairs (inserting X between identical letters).',
        'Same row: shift right; Same column: shift down; Rectangle: swap column corners.',
      ],
      mathematicalFormula: '\\text{Rectangle rule: } (r_1, c_1), (r_2, c_2) \\to (r_1, c_2), (r_2, c_1)',
      securityNotes: 'Breaks single-letter frequency analysis, but vulnerable to digraph frequency analysis.',
    },
    vulnerabilities: [
      {
        title: 'Digraph Frequency Profiling',
        description: 'Analyzing the 600 possible digraphs matches frequent pairs like TH, HE, IN.',
        mitigation: 'Modern block ciphers with large diffusion block sizes (128-bit).',
      },
    ],
    vivaQuestions: [
      {
        question: 'How does Playfair handle duplicate letters appearing together in a digraph (e.g. "EE")?',
        answer: 'An insertion character (typically "X" or "Q") is inserted between them (e.g., "EX" "EX") to prevent encrypting a single letter with itself.',
      },
    ],
  },
  hill: {
    id: 'hill',
    name: 'Hill Cipher (Matrix 2x2)',
    category: 'polyalphabetic',
    categoryLabel: 'Polyalphabetic',
    formula: '\\mathbf{C} = (\\mathbf{K} \\cdot \\mathbf{P}) \\pmod{26}',
    shortDesc: 'Polygraphic cipher applying linear algebra vector-matrix multiplication mod 26.',
    historicalContext: 'Invented by Lester S. Hill in 1929, the first polygraphic cipher to encrypt 3+ symbols simultaneously.',
    securityRating: 'Broken',
    securityColor: '#EF4444',
    keySpace: 'Invertible 2x2 matrices mod 26 (157,248 keys)',
    complexity: 'O(N)',
    samplePlaintext: 'HELP ME TEST THE HILL MATRIX MULTIPLICATION',
    sampleKey: 'K=[5, 8; 17, 3]',
    theory: {
      overview: 'Transforms vectors of plaintext characters by multiplying by an invertible square matrix K modulo 26.',
      steps: [
        'Form invertible key matrix K with det(K) coprime to 26.',
        'Multiply 2x1 plaintext column vectors by K modulo 26.',
        'Decrypt by multiplying by K^-1 = det(K)^-1 * adj(K) mod 26.',
      ],
      mathematicalFormula: '\\mathbf{C} = \\mathbf{K} \\cdot \\mathbf{P} \\pmod{26}, \\quad \\mathbf{P} = \\mathbf{K}^{-1} \\cdot \\mathbf{C} \\pmod{26}',
      securityNotes: 'Completely vulnerable to known-plaintext attack because linear transformations preserve algebraic structure.',
    },
    vulnerabilities: [
      {
        title: 'Linear Known-Plaintext Attack',
        description: 'Given 2 independent plaintext-ciphertext vector pairs, the key matrix is found via matrix inversion.',
        mitigation: 'Introduce non-linear layers (S-Boxes) as done in DES and AES.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Under what condition is a 2x2 Hill cipher key matrix invertible mod 26?',
        answer: 'The determinant d = (k11*k22 - k12*k21) mod 26 must be non-zero and coprime to 26, meaning gcd(d, 26) = 1.',
      },
    ],
  },
  des: {
    id: 'des',
    name: 'DES (Data Encryption Standard)',
    category: 'block',
    categoryLabel: 'Block Cipher',
    formula: '16 \\text{ Feistel Rounds, } 64\\text{-bit block, } 56\\text{-bit key}',
    shortDesc: 'Pioneering Feistel network symmetric block cipher adopted by NIST in 1977.',
    historicalContext: 'Developed by IBM based on Lucifer; standardized as FIPS PUB 46-3.',
    securityRating: 'Deprecated',
    securityColor: '#F59E0B',
    keySpace: '2^56 ≈ 7.2 × 10^16 keys',
    complexity: 'O(Rounds × BlockSize)',
    samplePlaintext: 'SECURITY CNS VIT',
    theory: {
      overview: 'Processes 64-bit plaintext blocks through Initial Permutation, 16 Feistel rounds with 8 non-linear S-boxes, and Final Permutation.',
      steps: [
        'Apply Initial Permutation (IP) to 64-bit block.',
        'Split into 32-bit halves L and R.',
        'Execute 16 rounds: L_{i} = R_{i-1}, R_{i} = L_{i-1} ⊕ F(R_{i-1}, K_i).',
        'Invert with Final Permutation (FP = IP^-1).',
      ],
      mathematicalFormula: 'L_i = R_{i-1}, \\quad R_i = L_{i-1} \\oplus f(R_{i-1}, K_i)',
      securityNotes: '56-bit key space broken by EFF "Deep Crack" in 1998 in 56 hours. Deprecated by NIST in 2005.',
    },
    vulnerabilities: [
      {
        title: 'Brute Force Key Exhaustion',
        description: '2^56 keys can be searched in seconds using modern cloud GPU clusters or specialized ASICs.',
        mitigation: 'Upgrade to AES-128, AES-256, or Triple DES.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why does DES only have 56 effective key bits when key input is 64 bits?',
        answer: 'Every 8th bit (bits 8, 16, 24, 32, 40, 48, 56, 64) is discarded as a parity check bit during Permuted Choice 1 (PC-1).',
      },
    ],
  },
  '2des': {
    id: '2des',
    name: '2DES (Double DES)',
    category: 'block',
    categoryLabel: 'Block Cipher',
    formula: 'C = E_{K2}(E_{K1}(P)), \\quad 112\\text{-bit key}',
    shortDesc: 'Cascaded double encryption with two independent 56-bit keys.',
    historicalContext: 'Proposed as an intuitive attempt to double DES security from 56 to 112 bits.',
    securityRating: 'Broken',
    securityColor: '#EF4444',
    keySpace: '2^112 nominal, reduced to 2^57 by MITM',
    complexity: 'O(2^56) time and memory via MITM',
    samplePlaintext: 'DOUBLE ENCRYPTION VULNERABILITY LAB',
    theory: {
      overview: 'Encrypts plaintext with K1, then encrypts intermediate ciphertext with K2.',
      steps: [
        'Encrypt intermediate: M = DES_Enc(P, K1).',
        'Encrypt final: C = DES_Enc(M, K2).',
        'Targeted by Meet-in-the-Middle: Forward table lookup on E(P, K1) matched with D(C, K2).',
      ],
      mathematicalFormula: 'C = E_{K_2}(E_{K_1}(P)) \\iff D_{K_2}(C) = E_{K_1}(P)',
      securityNotes: 'Vulnerable to Meet-in-the-Middle attack, reducing effective security to only 57 bits.',
    },
    vulnerabilities: [
      {
        title: 'Meet-in-the-Middle (MitM) Attack',
        description: 'Precomputing 2^56 encryption states allows discovering both keys in 2^57 operations rather than 2^112.',
        mitigation: 'Use Triple DES (3DES) in EDE mode with 3 keys.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Explain the Meet-in-the-Middle attack on Double DES.',
        answer: 'Since E_K1(P) = D_K2(C), an attacker computes all 2^56 possible intermediate values E_K1(P) and stores them in a hash table, then iterates through 2^56 possible K2 values computing D_K2(C) looking for collisions.',
      },
    ],
  },
  '3des': {
    id: '3des',
    name: '3DES (Triple DES EDE)',
    category: 'block',
    categoryLabel: 'Block Cipher',
    formula: 'C = E_{K3}(D_{K2}(E_{K1}(P))), \\quad 168\\text{-bit key}',
    shortDesc: 'Three-stage Encrypt-Decrypt-Encrypt sequence resisting meet-in-the-middle attacks.',
    historicalContext: 'Specified in ANSI X9.52 and FIPS 46-3 to protect banking and financial networks.',
    securityRating: 'Legacy Secure',
    securityColor: '#3B82F6',
    keySpace: '2^168 nominal (112-bit effective security)',
    complexity: 'O(3 × DES)',
    samplePlaintext: 'FINANCIAL TRANSACTION WIRE TRANSFER 2026',
    theory: {
      overview: 'Executes Encrypt(K1) -> Decrypt(K2) -> Encrypt(K3). If K1=K2=K3, it provides backward compatibility with single DES.',
      steps: [
        'Stage 1: Encrypt with K1.',
        'Stage 2: Decrypt intermediate with K2.',
        'Stage 3: Encrypt intermediate with K3.',
      ],
      mathematicalFormula: 'C = E_{K_3}(D_{K_2}(E_{K_1}(P)))',
      securityNotes: 'Effective security is 112 bits due to MITM. Vulnerable to Sweet32 attack on 64-bit blocks.',
    },
    vulnerabilities: [
      {
        title: 'Sweet32 Birthday Attack',
        description: '64-bit block size experiences block collisions after 2^32 blocks (32 GB) of data.',
        mitigation: 'Transition to AES with 128-bit block size.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why does 3DES use Encrypt-Decrypt-Encrypt (EDE) instead of Encrypt-Encrypt-Encrypt (EEE)?',
        answer: 'EDE provides backwards compatibility: setting K1 = K2 = K3 simplifies to standard single DES, since E_K(D_K(E_K(P))) = E_K(P).',
      },
    ],
  },
  aes: {
    id: 'aes',
    name: 'AES (Advanced Encryption Standard)',
    category: 'modern',
    categoryLabel: 'Modern Standards',
    formula: '128\\text{-bit block, 10/12/14 rounds (SubBytes, ShiftRows, MixColumns, AddRoundKey)}',
    shortDesc: 'Global symmetric standard based on the Rijndael substitution-permutation network.',
    historicalContext: 'Selected by NIST in 2001 after a 5-year public cryptographic competition.',
    securityRating: 'Current Standard',
    securityColor: '#10B981',
    keySpace: '2^128, 2^192, or 2^256 keys',
    complexity: 'O(Rounds × 128-bit state)',
    samplePlaintext: 'TOP SECRET CRYPTOGRAPHIC COMMUNICATIONS LAB VIT',
    theory: {
      overview: 'Operates on a 4x4 column-major byte matrix (State). Each round applies SubBytes, ShiftRows, MixColumns (except final), and AddRoundKey.',
      steps: [
        'Initial Round: AddRoundKey.',
        'Main Rounds (9/11/13): SubBytes -> ShiftRows -> MixColumns -> AddRoundKey.',
        'Final Round: SubBytes -> ShiftRows -> AddRoundKey.',
      ],
      mathematicalFormula: '\\text{State} = \\text{AddRoundKey}(\\text{MixColumns}(\\text{ShiftRows}(\\text{SubBytes}(\\text{State}))))',
      securityNotes: 'Resilient against all known mathematical cryptanalysis; industry standard worldwide.',
    },
    vulnerabilities: [
      {
        title: 'Side-Channel Timing / Cache Attacks',
        description: 'Improper software implementations with S-Box table lookups leak key timing information.',
        mitigation: 'Use hardware AES-NI instructions or constant-time code.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why is MixColumns omitted in the final round of AES?',
        answer: 'Omission of MixColumns in the final round makes the encryption and decryption architectures symmetric and simplifies hardware implementation without reducing algebraic security.',
      },
    ],
  },
  ecb: {
    id: 'ecb',
    name: 'ECB (Electronic Codebook)',
    category: 'block',
    categoryLabel: 'Block Cipher Mode',
    formula: 'C_i = E_K(P_i)',
    shortDesc: 'Simplest mode where each block is encrypted independently with identical key.',
    historicalContext: 'Defined in FIPS 81; famous for the "Tux Penguin" visual leakage demonstration.',
    securityRating: 'Broken',
    securityColor: '#EF4444',
    keySpace: 'Dependent on underlying block cipher',
    complexity: 'O(N) (Highly parallelizable)',
    samplePlaintext: 'AAAABBBBCCCCAAAABBBBCCCCAAAABBBB',
    theory: {
      overview: 'Divides data into fixed 64/128-bit blocks and encrypts each independently without chaining or random vectors.',
      steps: [
        'Split plaintext into 16-byte blocks P1, P2, ...',
        'Encrypt each block independently: C_i = E(P_i, K).',
        'Concatenate output blocks.',
      ],
      mathematicalFormula: 'C_i = E_K(P_i), \\quad P_i = D_K(C_i)',
      securityNotes: 'Critical flaw: Identical plaintext blocks produce identical ciphertext blocks.',
    },
    vulnerabilities: [
      {
        title: 'Deterministic Pattern Leakage',
        description: 'Structural patterns, bitmaps, and repeated tokens remain visible in ciphertext.',
        mitigation: 'Never use ECB for messages longer than one block. Use CBC, CTR, or GCM.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why should ECB mode never be used to encrypt images or structured documents?',
        answer: 'Because identical blocks encrypt to identical ciphertext blocks, preserving visual outlines, headers, and repeated data structures.',
      },
    ],
  },
  cbc: {
    id: 'cbc',
    name: 'CBC (Cipher Block Chaining)',
    category: 'block',
    categoryLabel: 'Block Cipher Mode',
    formula: 'C_i = E_K(P_i \\oplus C_{i-1}), \\quad C_0 = \\text{IV}',
    shortDesc: 'Chains blocks by XORing each plaintext block with the previous ciphertext block.',
    historicalContext: 'Invented by IBM in 1976 to prevent pattern leakage in banking PIN verification.',
    securityRating: 'Legacy Secure',
    securityColor: '#3B82F6',
    keySpace: 'Dependent on underlying block cipher',
    complexity: 'O(N) (Sequential encryption, parallel decryption)',
    samplePlaintext: 'SECURE FINANCIAL TRANSACTION RECORD CBC MODE',
    theory: {
      overview: 'Uses an unpredictable Initialization Vector (IV) and XOR feedback loop so identical plaintext blocks yield completely different ciphertext.',
      steps: [
        'Generate cryptographic random IV of block size.',
        'C1 = E(P1 ⊕ IV, K).',
        'C_i = E(P_i ⊕ C_{i-1}, K).',
        'Decrypt: P_i = D(C_i, K) ⊕ C_{i-1}.',
      ],
      mathematicalFormula: 'C_i = E_K(P_i \\oplus C_{i-1}), \\quad P_i = D_K(C_i) \\oplus C_{i-1}',
      securityNotes: 'Sequential during encryption. Vulnerable to padding oracle attacks if authentication is absent.',
    },
    vulnerabilities: [
      {
        title: 'Padding Oracle Attacks (e.g. POODLE)',
        description: 'Manipulating ciphertext bytes while observing server padding errors allows full plaintext recovery.',
        mitigation: 'Use Authenticated Encryption (AEAD) like AES-GCM.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why can CBC decryption be parallelized while encryption cannot?',
        answer: 'Decryption only requires C_i and C_{i-1}, which are already known in advance. Encryption requires C_{i-1} as output of the previous round before block i can be processed.',
      },
    ],
  },
  cfb: {
    id: 'cfb',
    name: 'CFB (Cipher Feedback Mode)',
    category: 'block',
    categoryLabel: 'Block Cipher Mode',
    formula: 'C_i = P_i \\oplus E_K(C_{i-1}), \\quad C_0 = \\text{IV}',
    shortDesc: 'Converts block cipher into a self-synchronizing stream cipher.',
    historicalContext: 'Standardized in SP 800-38A for streaming applications where padding is undesirable.',
    securityRating: 'Legacy Secure',
    securityColor: '#3B82F6',
    keySpace: 'Dependent on underlying block cipher',
    complexity: 'O(N)',
    samplePlaintext: 'STREAM TRANSMISSION PACKET PAYLOAD DATA',
    theory: {
      overview: 'Encrypts the previous ciphertext block to produce a keystream, then XORs it with plaintext.',
      steps: [
        'Encrypt IV to get first keystream block.',
        'XOR with plaintext: C_i = P_i ⊕ E(C_{i-1}, K).',
        'Next round encrypts C_i as feedback.',
      ],
      mathematicalFormula: 'C_i = P_i \\oplus E_K(C_{i-1}), \\quad P_i = C_i \\oplus E_K(C_{i-1})',
      securityNotes: 'Block cipher encryption function is used for both encryption and decryption.',
    },
    vulnerabilities: [
      {
        title: 'Error Propagation',
        description: 'A 1-bit error in ciphertext corrupts the corresponding plaintext byte and the entire subsequent block.',
        mitigation: 'Implement packet integrity verification before decryption.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Does CFB mode require padding to match block sizes?',
        answer: 'No, CFB functions as a stream cipher where the keystream can be truncated to match the exact byte length of the plaintext.',
      },
    ],
  },
  ofb: {
    id: 'ofb',
    name: 'OFB (Output Feedback Mode)',
    category: 'block',
    categoryLabel: 'Block Cipher Mode',
    formula: 'O_i = E_K(O_{i-1}), \\quad C_i = P_i \\oplus O_i',
    shortDesc: 'Generates synchronous keystream independent of plaintext and ciphertext.',
    historicalContext: 'Designed for noisy communication channels like satellite and radio telemetry.',
    securityRating: 'Legacy Secure',
    securityColor: '#3B82F6',
    keySpace: 'Dependent on underlying block cipher',
    complexity: 'O(N)',
    samplePlaintext: 'SATELLITE TELEMETRY DATA TRANSMISSION',
    theory: {
      overview: 'Repeatedly encrypts the IV to generate an independent continuous keystream.',
      steps: [
        'O_0 = IV.',
        'O_i = E(O_{i-1}, K).',
        'C_i = P_i ⊕ O_i.',
      ],
      mathematicalFormula: 'O_i = E_K(O_{i-1}), \\quad C_i = P_i \\oplus O_i',
      securityNotes: 'Bit errors in transmission do not propagate beyond the corrupted bit.',
    },
    vulnerabilities: [
      {
        title: 'Keystream Reuse Vulnerability',
        description: 'Reusing an IV with the same key generates identical keystreams, allowing XOR cryptanalysis: C1 ⊕ C2 = P1 ⊕ P2.',
        mitigation: 'Ensure IVs are strictly unique (nonces).',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why does a transmission bit error not propagate in OFB mode?',
        answer: 'Because the feedback loop is driven strictly by cipher output O_i and is completely detached from the transmitted ciphertext C_i.',
      },
    ],
  },
  ctr: {
    id: 'ctr',
    name: 'CTR (Counter Mode)',
    category: 'block',
    categoryLabel: 'Block Cipher Mode',
    formula: 'C_i = P_i \\oplus E_K(\\text{Nonce} \\parallel i)',
    shortDesc: 'High-performance parallel stream cipher encrypting sequential counter values.',
    historicalContext: 'Introduced by Whitfield Diffie and Martin Hellman in 1979; foundation of modern GCM.',
    securityRating: 'Current Standard',
    securityColor: '#10B981',
    keySpace: 'Dependent on underlying block cipher',
    complexity: 'O(N) (Fully parallelizable & random access)',
    samplePlaintext: 'HIGH SPEED FIBER OPTIC GIGABIT STREAM',
    theory: {
      overview: 'Encrypts successive counter values to produce a keystream that is XORed with plaintext.',
      steps: [
        'Combine Nonce and Counter value i.',
        'Encrypt counter block: K_i = E(Nonce || i, Key).',
        'XOR with plaintext: C_i = P_i ⊕ K_i.',
      ],
      mathematicalFormula: 'C_i = P_i \\oplus E_K(\\text{Nonce} \\parallel i), \\quad P_i = C_i \\oplus E_K(\\text{Nonce} \\parallel i)',
      securityNotes: 'Enables random access read/write and extreme hardware throughput. Requires unique counter values.',
    },
    vulnerabilities: [
      {
        title: 'Counter Reuse',
        description: 'If (Nonce, Counter) pair repeats under same key, confidentiality is compromised.',
        mitigation: 'Use 96-bit random nonce with 32-bit counter.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why is CTR mode preferred for SSD and cloud disk encryption?',
        answer: 'Because CTR supports random access: any block i can be decrypted directly by computing E_K(Nonce || i) without decrypting previous blocks.',
      },
    ],
  },
  rsa: {
    id: 'rsa',
    name: 'RSA Public Key Cryptosystem',
    category: 'asymmetric',
    categoryLabel: 'Asymmetric Cryptography',
    formula: 'C = M^e \\pmod n, \\quad M = C^d \\pmod n',
    shortDesc: 'Trapdoor one-way permutation based on the prime factorization difficulty.',
    historicalContext: 'Invented in 1977 by Ron Rivest, Adi Shamir, and Leonard Adleman at MIT.',
    securityRating: 'Current Standard',
    securityColor: '#10B981',
    keySpace: '2048 to 4096-bit modulus',
    complexity: 'O(k^3) modular exponentiation',
    samplePlaintext: 'VIT CYBERSECURITY LAB',
    theory: {
      overview: 'Uses public key (e, n) for encryption and private key (d, n) for decryption based on Euler\'s Totient Theorem.',
      steps: [
        'Select distinct primes p and q; calculate n = p * q.',
        'Compute Euler totient φ(n) = (p-1)(q-1).',
        'Choose e coprime to φ(n); calculate private key d = e^-1 mod φ(n).',
        'Encrypt C = M^e mod n; Decrypt M = C^d mod n.',
      ],
      mathematicalFormula: 'C \\equiv M^e \\pmod n, \\quad M \\equiv C^d \\equiv M^{ed} \\equiv M \\pmod n',
      securityNotes: 'Requires minimum 2048-bit keys for post-2030 security.',
    },
    vulnerabilities: [
      {
        title: 'Factorization via Quantum Shor\'s Algorithm',
        description: 'Polynomial time quantum factorization of modulus n breaks RSA.',
        mitigation: 'Transition to Post-Quantum Cryptography (PQC) standards such as ML-KEM.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why is e = 65537 commonly chosen in practical RSA implementations?',
        answer: '65537 is 2^16 + 1 (Fermat prime F4). Its binary representation contains only two 1s, enabling fast modular exponentiation with only 17 multiplications.',
      },
    ],
  },
  diffie_hellman: {
    id: 'diffie_hellman',
    name: 'Diffie-Hellman Key Exchange',
    category: 'asymmetric',
    categoryLabel: 'Asymmetric Cryptography',
    formula: 'K = B^a \\pmod p = A^b \\pmod p',
    shortDesc: 'Groundbreaking protocol enabling two parties to establish a shared secret over insecure channel.',
    historicalContext: 'Published in 1976 by Whitfield Diffie and Martin Hellman; established public-key cryptography.',
    securityRating: 'Current Standard',
    securityColor: '#10B981',
    keySpace: '2048-bit prime modulus or 256-bit elliptic curves',
    complexity: 'O(log p) exponentiation',
    samplePlaintext: 'SHARED SECRET ESTABLISHMENT',
    theory: {
      overview: 'Alice and Bob compute private secrets a, b and exchange public values A = g^a mod p and B = g^b mod p.',
      steps: [
        'Agree on public prime p and generator g.',
        'Alice computes A = g^a mod p; Bob computes B = g^b mod p.',
        'Shared secret: Alice computes B^a mod p; Bob computes A^b mod p.',
      ],
      mathematicalFormula: 'K = (g^b)^a \\equiv g^{ab} \\equiv (g^a)^b \\pmod p',
      securityNotes: 'Security relies on the Discrete Logarithm Problem (DLP). Insecure against active MitM if unauthenticated.',
    },
    vulnerabilities: [
      {
        title: 'Man-in-the-Middle (MitM) Interception',
        description: 'An attacker intercepts and substitutes public keys A and B with their own values.',
        mitigation: 'Authenticate public keys using digital certificates (PKI/TLS).',
      },
    ],
    vivaQuestions: [
      {
        question: 'What mathematical hardness problem underpins classic Diffie-Hellman security?',
        answer: 'The Discrete Logarithm Problem (DLP): given g, p, and g^a mod p, it is computationally infeasible to determine secret exponent a for sufficiently large primes.',
      },
    ],
  },
  sha256: {
    id: 'sha256',
    name: 'SHA-256 Cryptographic Hash',
    category: 'hashing',
    categoryLabel: 'Cryptographic Hashing',
    formula: 'H(M) \\to \\{0, 1\\}^{256}, \\quad 64 \\text{ compression rounds}',
    shortDesc: 'NIST SHA-2 standard producing a deterministic 256-bit collision-resistant digest.',
    historicalContext: 'Designed by the NSA and published by NIST in 2001 in FIPS PUB 180-4.',
    securityRating: 'Current Standard',
    securityColor: '#10B981',
    keySpace: '2^256 digest space',
    complexity: 'O(N blocks)',
    samplePlaintext: 'The quick brown fox jumps over the lazy dog',
    theory: {
      overview: 'Processes 512-bit message blocks through Merkle-Damgård construction with 64 rounds of non-linear logic functions (Ch, Maj, Σ0, Σ1).',
      steps: [
        'Pad message with bit 1, zeros, and 64-bit length descriptor.',
        'Initialize 8 32-bit state words from fractional square roots of first 8 primes.',
        'Expand 16 words into 64-word schedule W.',
        'Execute 64 rounds updating working variables a-h.',
      ],
      mathematicalFormula: 'T_1 = h + \\Sigma_1(e) + \\text{Ch}(e, f, g) + K_t + W_t, \\quad T_2 = \\Sigma_0(a) + \\text{Maj}(a, b, c)',
      securityNotes: 'Resilient against preimage, second preimage, and collision attacks (2^128 birthday bound).',
    },
    vulnerabilities: [
      {
        title: 'Length Extension Attack',
        description: 'Because of Merkle-Damgård structure, knowing H(secret || msg) allows appending data without knowing the secret.',
        mitigation: 'Use HMAC-SHA256 or SHA-3 for message authentication.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Explain the Avalanche Effect in SHA-256.',
        answer: 'The Avalanche Effect requires that changing even a single bit in the input message flips approximately 50% of the bits in the resulting hash digest, ensuring unpredictability.',
      },
    ],
  },
  hmac: {
    id: 'hmac',
    name: 'HMAC-SHA256 Message Authentication',
    category: 'hashing',
    categoryLabel: 'Message Authentication',
    formula: '\\text{HMAC}(K, M) = H((K \\oplus \\text{opad}) \\parallel H((K \\oplus \\text{ipad}) \\parallel M))',
    shortDesc: 'Keyed-hash message authentication code guaranteeing integrity and authenticity.',
    historicalContext: 'Published in 1996 by Mihir Bellare, Ran Canetti, and Hugo Krawczyk; standardized in RFC 2104.',
    securityRating: 'Current Standard',
    securityColor: '#10B981',
    keySpace: 'Dependent on secret key length (typically 256 bits)',
    complexity: 'O(N blocks)',
    samplePlaintext: 'API_REQUEST: TRANSFER $50000 TO ACCOUNT 8841',
    sampleKey: 'vit-super-secret-hmac-key-2026',
    theory: {
      overview: 'Uses two nested hash applications with inner and outer padding constants (0x36 and 0x5C) to defeat length extension attacks.',
      steps: [
        'If key length > block size (64 bytes), hash key; if shorter, pad with zeros.',
        'Compute inner key: K_inner = K ⊕ ipad (0x36 repeated).',
        'Compute outer key: K_outer = K ⊕ opad (0x5C repeated).',
        'HMAC = H(K_outer || H(K_inner || M)).',
      ],
      mathematicalFormula: '\\text{HMAC}(K, m) = H\\Big((K \\oplus \\text{opad}) \\;\\parallel\\; H\\big((K \\oplus \\text{ipad}) \\;\\parallel\\; m\\big)\\Big)',
      securityNotes: 'Provably secure as long as underlying hash compression function exhibits pseudorandom properties.',
    },
    vulnerabilities: [
      {
        title: 'Timing Side-Channel Comparison',
        description: 'Using variable-time string comparison (memcmp) reveals matching prefix byte counts.',
        mitigation: 'Always verify HMACs using constant-time comparison algorithms.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Why cannot simple hash concatenation H(Key || Message) be used instead of HMAC?',
        answer: 'Because Merkle-Damgård hashes are vulnerable to Length Extension Attacks: an attacker can append data and calculate a valid hash without knowing Key.',
      },
    ],
  },
  ecc: {
    id: 'ecc',
    name: 'ECC (Elliptic Curve Cryptography)',
    category: 'asymmetric',
    categoryLabel: 'Asymmetric Cryptography',
    formula: 'y^2 \\equiv x^3 + ax + b \\pmod p, \\quad Q = d \\cdot G',
    shortDesc: 'Next-generation asymmetric cryptography providing RSA-equivalent security with tiny key sizes.',
    historicalContext: 'Proposed independently by Neal Koblitz and Victor S. Miller in 1985.',
    securityRating: 'Current Standard',
    securityColor: '#10B981',
    keySpace: '256-bit curve achieves security equivalent to RSA 3072-bit',
    complexity: 'O(log d) scalar point multiplication',
    samplePlaintext: 'ELLIPTIC CURVE POINT MULTIPLICATION',
    theory: {
      overview: 'Calculates point addition and doubling on an algebraic curve over a finite field. Scalar multiplication Q = d * G is easy, but finding d given Q and G is computationally infeasible (ECDLP).',
      steps: [
        'Choose curve equation y^2 = x^3 + ax + b mod p and base generator point G.',
        'Select private key integer d in range [1, n-1].',
        'Compute public key point Q = d * G via double-and-add algorithm.',
        'Shared secrets computed via ECDH: K = d_A * Q_B = d_B * Q_A.',
      ],
      mathematicalFormula: 'y^2 = x^3 + ax + b \\pmod p, \\quad \\text{Point Addition: } P + Q = R',
      securityNotes: 'Standardized curves include NIST P-256 and Curve25519. Provides massive speed and bandwidth advantages over RSA.',
    },
    vulnerabilities: [
      {
        title: 'Biased Nonce in ECDSA Signatures',
        description: 'Leaking even a few bits of the per-signature nonce k allows lattice attacks to extract private key d.',
        mitigation: 'Use deterministic nonces via RFC 6979 or Ed25519.',
      },
    ],
    vivaQuestions: [
      {
        question: 'Compare ECC 256-bit security with RSA 2048-bit security.',
        answer: 'ECC 256-bit provides approximately 128 bits of symmetric security, which is equivalent to or exceeds RSA 3072-bit, while using roughly 1/12th the key size and significantly less CPU power.',
      },
    ],
  },
};
