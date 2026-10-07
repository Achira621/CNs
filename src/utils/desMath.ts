/**
 * DES (Data Encryption Standard), 2DES (Double DES), and 3DES (Triple DES)
 * Standard Mathematical Implementation with Step-by-Step Educational Inspector
 * Conforming to FIPS PUB 46-3
 */

// Initial Permutation (IP) - 64 bits (1-indexed)
const IP_TABLE = [
  58, 50, 42, 34, 26, 18, 10, 2,
  60, 52, 44, 36, 28, 20, 12, 4,
  62, 54, 46, 38, 30, 22, 14, 6,
  64, 56, 48, 40, 32, 24, 16, 8,
  57, 49, 41, 33, 25, 17, 9, 1,
  59, 51, 43, 35, 27, 19, 11, 3,
  61, 53, 45, 37, 29, 21, 13, 5,
  63, 55, 47, 39, 31, 23, 15, 7,
];

// Final Permutation (IP⁻¹ / FP) - 64 bits (1-indexed)
const FP_TABLE = [
  40, 8, 48, 16, 56, 24, 64, 32,
  39, 7, 47, 15, 55, 23, 63, 31,
  38, 6, 46, 14, 54, 22, 62, 30,
  37, 5, 45, 13, 53, 21, 61, 29,
  36, 4, 44, 12, 52, 20, 60, 28,
  35, 3, 43, 11, 51, 19, 59, 27,
  34, 2, 42, 10, 50, 18, 58, 26,
  33, 1, 41, 9, 49, 17, 57, 25,
];

// Expansion Permutation (E) - 32 bits to 48 bits (1-indexed)
const E_TABLE = [
  32, 1, 2, 3, 4, 5,
  4, 5, 6, 7, 8, 9,
  8, 9, 10, 11, 12, 13,
  12, 13, 14, 15, 16, 17,
  16, 17, 18, 19, 20, 21,
  20, 21, 22, 23, 24, 25,
  24, 25, 26, 27, 28, 29,
  28, 29, 30, 31, 32, 1,
];

// Permutation (P) - 32 bits to 32 bits (1-indexed)
const P_TABLE = [
  16, 7, 20, 21,
  29, 12, 28, 17,
  1, 15, 23, 26,
  5, 18, 31, 10,
  2, 8, 24, 14,
  32, 27, 3, 9,
  19, 13, 30, 6,
  22, 11, 4, 25,
];

// Permuted Choice 1 (PC-1) - 64 bits to 56 bits
const PC1_TABLE = [
  57, 49, 41, 33, 25, 17, 9,
  1, 58, 50, 42, 34, 26, 18,
  10, 2, 59, 51, 43, 35, 27,
  19, 11, 3, 60, 52, 44, 36,
  63, 55, 47, 39, 31, 23, 15,
  7, 62, 54, 46, 38, 30, 22,
  14, 6, 61, 53, 45, 37, 29,
  21, 13, 5, 28, 20, 12, 4,
];

// Permuted Choice 2 (PC-2) - 56 bits to 48 bits
const PC2_TABLE = [
  14, 17, 11, 24, 1, 5,
  3, 28, 15, 6, 21, 10,
  23, 19, 12, 4, 26, 8,
  16, 7, 27, 20, 13, 2,
  41, 52, 31, 37, 47, 55,
  30, 40, 51, 45, 33, 48,
  44, 49, 39, 56, 34, 53,
  46, 42, 50, 36, 29, 32,
];

// Key Schedule Left Shifts for each round (1 to 16)
const ROUND_SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// 8 DES S-Boxes (each 4x16 numbers, total 64 values)
const S_BOXES: number[][][] = [
  // S1
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
  ],
  // S2
  [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
  ],
  // S3
  [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
  ],
  // S4
  [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
  ],
  // S5
  [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
  ],
  // S6
  [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
  ],
  // S7
  [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
  ],
  // S8
  [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
  ],
];

// Helper: Convert string / hex to binary string (64 bits)
export function hexToBitString(hex: string, targetLength: number = 64): string {
  const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
  let bits = '';
  for (let i = 0; i < cleanHex.length; i++) {
    const val = parseInt(cleanHex[i], 16);
    bits += val.toString(2).padStart(4, '0');
  }
  return bits.padEnd(targetLength, '0').slice(0, targetLength);
}

export function bitStringToHex(bits: string): string {
  let hex = '';
  for (let i = 0; i < bits.length; i += 4) {
    const chunk = bits.slice(i, i + 4).padEnd(4, '0');
    hex += parseInt(chunk, 2).toString(16).toUpperCase();
  }
  return hex;
}

export function stringToBitString(str: string, targetLength: number = 64): string {
  let bits = '';
  for (let i = 0; i < str.length; i++) {
    bits += str.charCodeAt(i).toString(2).padStart(8, '0');
  }
  return bits.padEnd(targetLength, '0').slice(0, targetLength);
}

export function bitStringToAscii(bits: string): string {
  let ascii = '';
  for (let i = 0; i < bits.length; i += 8) {
    const byte = bits.slice(i, i + 8);
    const code = parseInt(byte, 2);
    ascii += code >= 32 && code <= 126 ? String.fromCharCode(code) : '·';
  }
  return ascii;
}

// Permute bit string according to table (1-indexed)
function permute(bits: string, table: number[]): string {
  let out = '';
  for (let i = 0; i < table.length; i++) {
    out += bits[table[i] - 1];
  }
  return out;
}

// Left circular shift of bit string
function leftShift(bits: string, count: number): string {
  return bits.slice(count) + bits.slice(0, count);
}

// XOR two equal length bit strings
function xorBits(a: string, b: string): string {
  let res = '';
  for (let i = 0; i < a.length; i++) {
    res += a[i] === b[i] ? '0' : '1';
  }
  return res;
}

/**
 * Generate 16 48-bit Round Subkeys from 64-bit key
 */
export function generateDesSubkeys(key64Bits: string): string[] {
  // Apply PC-1 to reduce 64 bits to 56 bits
  const permuted56 = permute(key64Bits, PC1_TABLE);
  let c = permuted56.slice(0, 28);
  let d = permuted56.slice(28, 56);

  const subkeys: string[] = [];
  for (let r = 0; r < 16; r++) {
    const shift = ROUND_SHIFTS[r];
    c = leftShift(c, shift);
    d = leftShift(d, shift);
    // Combine and apply PC-2 to produce 48-bit subkey
    const combined = c + d;
    subkeys.push(permute(combined, PC2_TABLE));
  }
  return subkeys;
}

export interface DesRoundStep {
  round: number;
  leftBits: string;
  rightBits: string;
  leftHex: string;
  rightHex: string;
  subkeyHex: string; // 48-bit (12 hex digits)
  expandedHex: string; // 48-bit
  xorResultHex: string; // 48-bit
  sboxOutputHex: string; // 32-bit (8 hex digits)
  pOutputHex: string; // 32-bit
  newRightHex: string;
  explanation: string;
}

export interface DesBlockResult {
  plaintextHex: string;
  initialPermutationHex: string;
  rounds: DesRoundStep[];
  preFinalHex: string; // 32-bit R16 + L16 before FP
  ciphertextHex: string;
  ciphertextAscii: string;
}

/**
 * Single 64-bit Block DES Encryption / Decryption with detailed 16-round trace
 */
export function processDesBlock(
  block64Bits: string,
  key64Bits: string,
  mode: 'encrypt' | 'decrypt'
): DesBlockResult {
  // Generate 16 subkeys
  let subkeys = generateDesSubkeys(key64Bits);
  if (mode === 'decrypt') {
    subkeys = [...subkeys].reverse(); // In decryption, subkeys are applied K16 down to K1
  }

  // 1. Initial Permutation (IP)
  const ipBits = permute(block64Bits, IP_TABLE);
  let l = ipBits.slice(0, 32);
  let r = ipBits.slice(32, 64);

  const rounds: DesRoundStep[] = [];

  // 2. 16 Feistel Rounds
  for (let round = 1; round <= 16; round++) {
    const prevL = l;
    const prevR = r;
    const subkey = subkeys[round - 1];

    // Feistel Function F(R, K):
    // 2a. Expansion Permutation E: 32 -> 48 bits
    const expanded = permute(prevR, E_TABLE);

    // 2b. XOR with Subkey: 48 bits
    const xored = xorBits(expanded, subkey);

    // 2c. 8 S-Boxes: 48 bits (8 x 6) -> 32 bits (8 x 4)
    let sboxOut = '';
    for (let s = 0; s < 8; s++) {
      const chunk = xored.slice(s * 6, (s + 1) * 6);
      const row = parseInt(chunk[0] + chunk[5], 2);
      const col = parseInt(chunk.slice(1, 5), 2);
      const val = S_BOXES[s][row][col];
      sboxOut += val.toString(2).padStart(4, '0');
    }

    // 2d. Permutation P: 32 -> 32 bits
    const pOut = permute(sboxOut, P_TABLE);

    // 2e. Next L and R: L_i = R_{i-1}, R_i = L_{i-1} XOR F(R_{i-1}, K_i)
    l = prevR;
    r = xorBits(prevL, pOut);

    rounds.push({
      round,
      leftBits: l,
      rightBits: r,
      leftHex: bitStringToHex(l),
      rightHex: bitStringToHex(r),
      subkeyHex: bitStringToHex(subkey),
      expandedHex: bitStringToHex(expanded),
      xorResultHex: bitStringToHex(xored),
      sboxOutputHex: bitStringToHex(sboxOut),
      pOutputHex: bitStringToHex(pOut),
      newRightHex: bitStringToHex(r),
      explanation: `Round ${round}: F-function expanded R to 48-bit, XORed with subkey K${round}, substituted via 8 S-boxes, permuted P, and XORed with L.`,
    });
  }

  // 3. Pre-output 32-bit swap: R16 || L16
  const preFinal = r + l;

  // 4. Final Permutation (IP⁻¹ / FP)
  const cipherBits = permute(preFinal, FP_TABLE);

  return {
    plaintextHex: bitStringToHex(block64Bits),
    initialPermutationHex: bitStringToHex(ipBits),
    rounds,
    preFinalHex: bitStringToHex(preFinal),
    ciphertextHex: bitStringToHex(cipherBits),
    ciphertextAscii: bitStringToAscii(cipherBits),
  };
}

// ----------------------------------------------------
// 2DES (Double DES) Pipeline Engine
// ----------------------------------------------------

export interface TwoDesBlockResult {
  blockIndex: number;
  plaintextHex: string;
  plaintextAscii: string;
  stage1: {
    keyHex: string;
    action: 'encrypt' | 'decrypt';
    outputHex: string; // Intermediate state M = E_K1(P) or D_K2(C)
    outputAscii: string;
    rounds: DesRoundStep[];
  };
  stage2: {
    keyHex: string;
    action: 'encrypt' | 'decrypt';
    outputHex: string; // Final ciphertext C = E_K2(M) or plaintext P = D_K1(M)
    outputAscii: string;
    rounds: DesRoundStep[];
  };
  finalOutputHex: string;
  finalOutputAscii: string;
}

export interface TwoDesResult {
  inputText: string;
  key1Hex: string;
  key2Hex: string;
  mode: 'encrypt' | 'decrypt';
  blocks: TwoDesBlockResult[];
  fullCipherHex: string;
  fullCipherAscii: string;
  mitmComplexity: {
    bruteForce: string; // "2¹¹² operations"
    meetInTheMiddle: string; // "2⁵⁷ operations + 2⁵⁶ memory"
    ratio: string; // "2⁵⁵ times faster!"
  };
}

/**
 * Execute 2DES (Double DES) on arbitrary text input
 * Encrypt: C = E_K2(E_K1(P))
 * Decrypt: P = D_K1(D_K2(C))
 */
export function processTwoDes(
  input: string,
  key1: string,
  key2: string,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): TwoDesResult {
  // Derive 64-bit keys from string / hex
  const k1Bits = formatKeyTo64Bits(key1 || 'KEY1DES1');
  const k2Bits = formatKeyTo64Bits(key2 || 'KEY2DES2');

  const k1Hex = bitStringToHex(k1Bits);
  const k2Hex = bitStringToHex(k2Bits);

  // Divide input into 8-byte (64-bit) blocks with PKCS7 / space padding
  const paddedBlocks = padTo8ByteBlocks(input);
  const blocksResult: TwoDesBlockResult[] = [];
  let fullHex = '';
  let fullAscii = '';

  paddedBlocks.forEach((block64Bits, idx) => {
    if (mode === 'encrypt') {
      // Stage 1: Encrypt with K1 -> Intermediate M
      const stage1Res = processDesBlock(block64Bits, k1Bits, 'encrypt');
      const mBits = hexToBitString(stage1Res.ciphertextHex, 64);

      // Stage 2: Encrypt intermediate M with K2 -> Final Ciphertext C
      const stage2Res = processDesBlock(mBits, k2Bits, 'encrypt');
      const cBits = hexToBitString(stage2Res.ciphertextHex, 64);

      blocksResult.push({
        blockIndex: idx + 1,
        plaintextHex: bitStringToHex(block64Bits),
        plaintextAscii: bitStringToAscii(block64Bits),
        stage1: {
          keyHex: k1Hex,
          action: 'encrypt',
          outputHex: stage1Res.ciphertextHex,
          outputAscii: stage1Res.ciphertextAscii,
          rounds: stage1Res.rounds,
        },
        stage2: {
          keyHex: k2Hex,
          action: 'encrypt',
          outputHex: stage2Res.ciphertextHex,
          outputAscii: stage2Res.ciphertextAscii,
          rounds: stage2Res.rounds,
        },
        finalOutputHex: stage2Res.ciphertextHex,
        finalOutputAscii: stage2Res.ciphertextAscii,
      });

      fullHex += (idx > 0 ? ' ' : '') + stage2Res.ciphertextHex;
      fullAscii += stage2Res.ciphertextAscii;
    } else {
      // Decrypt: P = D_K1(D_K2(C))
      // Stage 1: Decrypt with K2 -> Intermediate M
      const stage1Res = processDesBlock(block64Bits, k2Bits, 'decrypt');
      const mBits = hexToBitString(stage1Res.ciphertextHex, 64);

      // Stage 2: Decrypt intermediate M with K1 -> Plaintext P
      const stage2Res = processDesBlock(mBits, k1Bits, 'decrypt');

      blocksResult.push({
        blockIndex: idx + 1,
        plaintextHex: bitStringToHex(block64Bits),
        plaintextAscii: bitStringToAscii(block64Bits),
        stage1: {
          keyHex: k2Hex,
          action: 'decrypt',
          outputHex: stage1Res.ciphertextHex,
          outputAscii: stage1Res.ciphertextAscii,
          rounds: stage1Res.rounds,
        },
        stage2: {
          keyHex: k1Hex,
          action: 'decrypt',
          outputHex: stage2Res.ciphertextHex,
          outputAscii: stage2Res.ciphertextAscii,
          rounds: stage2Res.rounds,
        },
        finalOutputHex: stage2Res.ciphertextHex,
        finalOutputAscii: stage2Res.ciphertextAscii,
      });

      fullHex += (idx > 0 ? ' ' : '') + stage2Res.ciphertextHex;
      fullAscii += stage2Res.ciphertextAscii;
    }
  });

  return {
    inputText: input,
    key1Hex: k1Hex,
    key2Hex: k2Hex,
    mode,
    blocks: blocksResult,
    fullCipherHex: fullHex,
    fullCipherAscii: fullAscii,
    mitmComplexity: {
      bruteForce: '2¹¹² Operations (Naïve Key Exhaustion)',
      meetInTheMiddle: '2⁵⁷ Operations + 2⁵⁶ Memory (Diffie-Hellman MITM)',
      ratio: '33,554,432× Faster than Brute Force!',
    },
  };
}

// ----------------------------------------------------
// 3DES (Triple DES / TDEA) Pipeline Engine
// ----------------------------------------------------

export interface ThreeDesBlockResult {
  blockIndex: number;
  plaintextHex: string;
  plaintextAscii: string;
  stage1: {
    name: 'Stage 1: E(K1)';
    keyHex: string;
    action: 'encrypt' | 'decrypt';
    outputHex: string;
    outputAscii: string;
    rounds: DesRoundStep[];
  };
  stage2: {
    name: 'Stage 2: D(K2)';
    keyHex: string;
    action: 'decrypt' | 'encrypt';
    outputHex: string;
    outputAscii: string;
    rounds: DesRoundStep[];
  };
  stage3: {
    name: 'Stage 3: E(K3)';
    keyHex: string;
    action: 'encrypt' | 'decrypt';
    outputHex: string;
    outputAscii: string;
    rounds: DesRoundStep[];
  };
  isBackwardCompatible: boolean;
  finalOutputHex: string;
  finalOutputAscii: string;
}

export interface ThreeDesResult {
  inputText: string;
  key1Hex: string;
  key2Hex: string;
  key3Hex: string;
  keyingOption: '3-Key (168-bit)' | '2-Key (112-bit)' | 'Single DES Compatible (56-bit)';
  mode: 'encrypt' | 'decrypt';
  blocks: ThreeDesBlockResult[];
  fullCipherHex: string;
  fullCipherAscii: string;
  effectiveSecurityBits: number;
}

/**
 * Execute 3DES (Triple DES - EDE Mode)
 * Encrypt: C = E_K3(D_K2(E_K1(P)))
 * Decrypt: P = D_K1(E_K2(D_K3(C)))
 */
export function processThreeDes(
  input: string,
  key1: string,
  key2: string,
  key3: string,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): ThreeDesResult {
  const k1Bits = formatKeyTo64Bits(key1 || 'KEY1DES1');
  const k2Bits = formatKeyTo64Bits(key2 || 'KEY2DES2');
  const k3Bits = formatKeyTo64Bits(key3 || key1 || 'KEY3DES3');

  const k1Hex = bitStringToHex(k1Bits);
  const k2Hex = bitStringToHex(k2Bits);
  const k3Hex = bitStringToHex(k3Bits);

  const isBackward = k1Hex === k2Hex && k2Hex === k3Hex;
  const isTwoKey = k1Hex === k3Hex && k1Hex !== k2Hex;

  const keyingOption = isBackward
    ? 'Single DES Compatible (56-bit)'
    : isTwoKey
    ? '2-Key (112-bit)'
    : '3-Key (168-bit)';

  const paddedBlocks = padTo8ByteBlocks(input);
  const blocksResult: ThreeDesBlockResult[] = [];
  let fullHex = '';
  let fullAscii = '';

  paddedBlocks.forEach((block64Bits, idx) => {
    if (mode === 'encrypt') {
      // 1. Encrypt with K1
      const stage1 = processDesBlock(block64Bits, k1Bits, 'encrypt');
      const s1Bits = hexToBitString(stage1.ciphertextHex, 64);

      // 2. Decrypt with K2
      const stage2 = processDesBlock(s1Bits, k2Bits, 'decrypt');
      const s2Bits = hexToBitString(stage2.ciphertextHex, 64);

      // 3. Encrypt with K3
      const stage3 = processDesBlock(s2Bits, k3Bits, 'encrypt');

      blocksResult.push({
        blockIndex: idx + 1,
        plaintextHex: bitStringToHex(block64Bits),
        plaintextAscii: bitStringToAscii(block64Bits),
        stage1: {
          name: 'Stage 1: E(K1)',
          keyHex: k1Hex,
          action: 'encrypt',
          outputHex: stage1.ciphertextHex,
          outputAscii: stage1.ciphertextAscii,
          rounds: stage1.rounds,
        },
        stage2: {
          name: 'Stage 2: D(K2)',
          keyHex: k2Hex,
          action: 'decrypt',
          outputHex: stage2.ciphertextHex,
          outputAscii: stage2.ciphertextAscii,
          rounds: stage2.rounds,
        },
        stage3: {
          name: 'Stage 3: E(K3)',
          keyHex: k3Hex,
          action: 'encrypt',
          outputHex: stage3.ciphertextHex,
          outputAscii: stage3.ciphertextAscii,
          rounds: stage3.rounds,
        },
        isBackwardCompatible: isBackward,
        finalOutputHex: stage3.ciphertextHex,
        finalOutputAscii: stage3.ciphertextAscii,
      });

      fullHex += (idx > 0 ? ' ' : '') + stage3.ciphertextHex;
      fullAscii += stage3.ciphertextAscii;
    } else {
      // Decrypt: P = D_K1(E_K2(D_K3(C)))
      // 1. Decrypt with K3
      const stage1 = processDesBlock(block64Bits, k3Bits, 'decrypt');
      const s1Bits = hexToBitString(stage1.ciphertextHex, 64);

      // 2. Encrypt with K2
      const stage2 = processDesBlock(s1Bits, k2Bits, 'encrypt');
      const s2Bits = hexToBitString(stage2.ciphertextHex, 64);

      // 3. Decrypt with K1
      const stage3 = processDesBlock(s2Bits, k1Bits, 'decrypt');

      blocksResult.push({
        blockIndex: idx + 1,
        plaintextHex: bitStringToHex(block64Bits),
        plaintextAscii: bitStringToAscii(block64Bits),
        stage1: {
          name: 'Stage 1: E(K1)',
          keyHex: k3Hex,
          action: 'decrypt',
          outputHex: stage1.ciphertextHex,
          outputAscii: stage1.ciphertextAscii,
          rounds: stage1.rounds,
        },
        stage2: {
          name: 'Stage 2: D(K2)',
          keyHex: k2Hex,
          action: 'encrypt',
          outputHex: stage2.ciphertextHex,
          outputAscii: stage2.ciphertextAscii,
          rounds: stage2.rounds,
        },
        stage3: {
          name: 'Stage 3: E(K3)',
          keyHex: k1Hex,
          action: 'decrypt',
          outputHex: stage3.ciphertextHex,
          outputAscii: stage3.ciphertextAscii,
          rounds: stage3.rounds,
        },
        isBackwardCompatible: isBackward,
        finalOutputHex: stage3.ciphertextHex,
        finalOutputAscii: stage3.ciphertextAscii,
      });

      fullHex += (idx > 0 ? ' ' : '') + stage3.ciphertextHex;
      fullAscii += stage3.ciphertextAscii;
    }
  });

  return {
    inputText: input,
    key1Hex: k1Hex,
    key2Hex: k2Hex,
    key3Hex: k3Hex,
    keyingOption,
    mode,
    blocks: blocksResult,
    fullCipherHex: fullHex,
    fullCipherAscii: fullAscii,
    effectiveSecurityBits: isBackward ? 56 : isTwoKey ? 112 : 112, // 3-key 3DES has 112-bit security due to MITM
  };
}

// ----------------------------------------------------
// Meet-in-the-Middle (MITM) Interactive Attack Simulator
// ----------------------------------------------------

export interface MitmSimulationStep {
  candidateKey: string;
  forwardValueHex?: string;
  backwardValueHex?: string;
  isMatch?: boolean;
}

export interface MitmSimulationResult {
  knownPlaintextHex: string;
  knownCiphertextHex: string;
  actualKey1: string;
  actualKey2: string;
  spaceSize: number;
  tableMatches: { key1: string; key2: string; intermediateHex: string }[];
  stepsSearched: number;
  explanation: string;
}

/**
 * Educational MITM simulation over small toy key space (e.g. 12-bit / 16-bit key search)
 * Demonstrates the exact hash-table lookup principle:
 * E_K1(P) = D_K2(C)
 */
export function simulateMeetInTheMiddle(
  plaintextStr: string = 'ABCDEFGH',
  secretK1Suffix: number = 0x4A,
  secretK2Suffix: number = 0xB2,
  searchKeyBits: number = 8 // Demo with 8-bit key search (256 keys)
): MitmSimulationResult {
  const pBits = stringToBitString(plaintextStr, 64);
  const pHex = bitStringToHex(pBits);

  // Construct secret keys with base prefix and variable suffix
  const basePrefix = '0123456789AB';
  const k1Hex = basePrefix + secretK1Suffix.toString(16).padStart(4, '0').toUpperCase();
  const k2Hex = basePrefix + secretK2Suffix.toString(16).padStart(4, '0').toUpperCase();

  const k1Bits = hexToBitString(k1Hex, 64);
  const k2Bits = hexToBitString(k2Hex, 64);

  // Compute actual Ciphertext: C = E_K2(E_K1(P))
  const stage1 = processDesBlock(pBits, k1Bits, 'encrypt');
  const stage2 = processDesBlock(hexToBitString(stage1.ciphertextHex, 64), k2Bits, 'encrypt');
  const cHex = stage2.ciphertextHex;
  const cBits = hexToBitString(cHex, 64);

  // MITM Step 1: Precompute forward table E_K1(P) for all candidate K1
  const maxKeys = 1 << searchKeyBits;
  const forwardTable = new Map<string, string>(); // intermediateHex -> k1Candidate

  for (let k1 = 0; k1 < maxKeys; k1++) {
    const candHex = basePrefix + k1.toString(16).padStart(4, '0').toUpperCase();
    const candBits = hexToBitString(candHex, 64);
    const enc = processDesBlock(pBits, candBits, 'encrypt');
    forwardTable.set(enc.ciphertextHex, candHex);
  }

  // MITM Step 2: Decrypt C with candidate K2 and look for collisions in table
  const matches: { key1: string; key2: string; intermediateHex: string }[] = [];
  let stepsSearched = 0;

  for (let k2 = 0; k2 < maxKeys; k2++) {
    stepsSearched++;
    const candK2Hex = basePrefix + k2.toString(16).padStart(4, '0').toUpperCase();
    const candK2Bits = hexToBitString(candK2Hex, 64);
    const dec = processDesBlock(cBits, candK2Bits, 'decrypt');

    if (forwardTable.has(dec.ciphertextHex)) {
      const matchedK1 = forwardTable.get(dec.ciphertextHex)!;
      matches.push({
        key1: matchedK1,
        key2: candK2Hex,
        intermediateHex: dec.ciphertextHex,
      });
    }
  }

  return {
    knownPlaintextHex: pHex,
    knownCiphertextHex: cHex,
    actualKey1: k1Hex,
    actualKey2: k2Hex,
    spaceSize: maxKeys,
    tableMatches: matches,
    stepsSearched,
    explanation: `Meet-in-the-Middle exploited E_{K1}(P) = D_{K2}(C). Rather than testing ${maxKeys} × ${maxKeys} = ${
      maxKeys * maxKeys
    } combinations (Brute Force), MITM solved it in ${maxKeys} table insertions + ${maxKeys} decryptions = ${
      maxKeys * 2
    } operations!`,
  };
}

// ----------------------------------------------------
// Utility Helpers
// ----------------------------------------------------

function formatKeyTo64Bits(key: string): string {
  // If hex string of length 16
  const cleanHex = key.replace(/[^0-9A-Fa-f]/g, '');
  if (cleanHex.length >= 16) {
    return hexToBitString(cleanHex.slice(0, 16), 64);
  }
  // Otherwise parse as ASCII string
  return stringToBitString(key.padEnd(8, '0'), 64);
}

function padTo8ByteBlocks(input: string): string[] {
  if (!input) input = 'CYBERSEC';
  const blocks: string[] = [];
  // If input is hex string like "0123456789ABCDEF..."
  const cleanHex = input.replace(/[^0-9A-Fa-f]/g, '');
  if (cleanHex.length >= 16 && cleanHex.length % 16 === 0) {
    for (let i = 0; i < cleanHex.length; i += 16) {
      blocks.push(hexToBitString(cleanHex.slice(i, i + 16), 64));
    }
    return blocks;
  }

  // Otherwise handle as text with 8-byte chunking
  for (let i = 0; i < input.length; i += 8) {
    const chunk = input.slice(i, i + 8).padEnd(8, ' ');
    blocks.push(stringToBitString(chunk, 64));
  }
  return blocks;
}

export function desEncryptHex(plainHex: string, keyHex: string): string {
  const pBits = hexToBitString(plainHex.padEnd(16, '0').slice(0, 16), 64);
  const kBits = hexToBitString(keyHex.padEnd(16, '0').slice(0, 16), 64);
  return processDesBlock(pBits, kBits, 'encrypt').ciphertextHex;
}

export function desDecryptHex(cipherHex: string, keyHex: string): string {
  const cBits = hexToBitString(cipherHex.padEnd(16, '0').slice(0, 16), 64);
  const kBits = hexToBitString(keyHex.padEnd(16, '0').slice(0, 16), 64);
  return processDesBlock(cBits, kBits, 'decrypt').ciphertextHex;
}

export function twoDesEncryptHex(
  plainHex: string,
  k1Hex: string,
  k2Hex: string
): { intermediate: string; ciphertext: string } {
  const m = desEncryptHex(plainHex, k1Hex);
  const c = desEncryptHex(m, k2Hex);
  return { intermediate: m, ciphertext: c };
}

export function threeDesEncryptHex(
  plainHex: string,
  k1Hex: string,
  k2Hex: string,
  k3Hex: string
): { stage1: string; stage2: string; ciphertext: string } {
  const s1 = desEncryptHex(plainHex, k1Hex);
  const s2 = desDecryptHex(s1, k2Hex);
  const c = desEncryptHex(s2, k3Hex);
  return { stage1: s1, stage2: s2, ciphertext: c };
}

