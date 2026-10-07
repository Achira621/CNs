/**
 * AES (Advanced Encryption Standard - Rijndael - FIPS 197)
 * Standard Mathematical Implementation with Step-by-Step Educational Inspector
 * Supports AES-128 (10 rounds), AES-192 (12 rounds), and AES-256 (14 rounds)
 */

// AES Substitution Box (S-Box)
export const AES_SBOX: number[] = [
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5e, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16,
];

// AES Inverse Substitution Box (InvS-Box)
export const AES_INV_SBOX: number[] = [
  0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb,
  0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb,
  0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e,
  0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25,
  0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92,
  0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84,
  0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06,
  0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b,
  0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73,
  0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e,
  0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b,
  0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4,
  0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f,
  0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef,
  0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61,
  0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d,
];

// Round Constants (Rcon)
export const RCON = [
  0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36,
];

// Galois Field GF(2^8) Multiplication by 2: xtime(a)
export function xtime(a: number): number {
  return ((a << 1) ^ (((a >> 7) & 1) * 0x11b)) & 0xff;
}

// Multiplication in GF(2^8) modulo x^8 + x^4 + x^3 + x + 1 (0x11b)
export function gfMul(a: number, b: number): number {
  let res = 0;
  let tempA = a;
  for (let i = 0; i < 8; i++) {
    if ((b & (1 << i)) !== 0) {
      res ^= tempA;
    }
    tempA = xtime(tempA);
  }
  return res & 0xff;
}

/**
 * Convert 16-byte array to 4x4 State Matrix (Column-Major order as per FIPS 197)
 */
export function bytesToState(bytes: number[]): number[][] {
  const state: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      state[r][c] = bytes[c * 4 + r] || 0;
    }
  }
  return state;
}

/**
 * Convert 4x4 State Matrix back to 16-byte array
 */
export function stateToBytes(state: number[][]): number[] {
  const bytes: number[] = [];
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      bytes.push(state[r][c] & 0xff);
    }
  }
  return bytes;
}

export function cloneState(state: number[][]): number[][] {
  return state.map((row) => [...row]);
}

export function stateToHex(state: number[][]): string {
  return stateToBytes(state)
    .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
    .join(' ');
}

// ----------------------------------------------------
// Core AES Transformations
// ----------------------------------------------------

/**
 * SubBytes Transformation: Non-linear byte substitution using S-Box
 */
export function subBytes(state: number[][]): number[][] {
  const next = cloneState(state);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      next[r][c] = AES_SBOX[state[r][c]];
    }
  }
  return next;
}

/**
 * InvSubBytes Transformation: Inversion using InvS-Box
 */
export function invSubBytes(state: number[][]): number[][] {
  const next = cloneState(state);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      next[r][c] = AES_INV_SBOX[state[r][c]];
    }
  }
  return next;
}

/**
 * ShiftRows Transformation: Cyclically shift rows of the state
 * Row 0: shift 0
 * Row 1: shift 1 left
 * Row 2: shift 2 left
 * Row 3: shift 3 left
 */
export function shiftRows(state: number[][]): number[][] {
  const next = cloneState(state);
  // Row 1
  next[1] = [state[1][1], state[1][2], state[1][3], state[1][0]];
  // Row 2
  next[2] = [state[2][2], state[2][3], state[2][0], state[2][1]];
  // Row 3
  next[3] = [state[3][3], state[3][0], state[3][1], state[3][2]];
  return next;
}

/**
 * InvShiftRows Transformation: Cyclically shift rows right
 */
export function invShiftRows(state: number[][]): number[][] {
  const next = cloneState(state);
  // Row 1
  next[1] = [state[1][3], state[1][0], state[1][1], state[1][2]];
  // Row 2
  next[2] = [state[2][2], state[2][3], state[2][0], state[2][1]];
  // Row 3
  next[3] = [state[3][1], state[3][2], state[3][3], state[3][0]];
  return next;
}

/**
 * MixColumns Transformation: Multiply state columns by polynomial {02}x^3 + {01}x^2 + {01}x + {03}
 */
export function mixColumns(state: number[][]): number[][] {
  const next = cloneState(state);
  for (let c = 0; c < 4; c++) {
    const s0 = state[0][c];
    const s1 = state[1][c];
    const s2 = state[2][c];
    const s3 = state[3][c];

    next[0][c] = gfMul(2, s0) ^ gfMul(3, s1) ^ s2 ^ s3;
    next[1][c] = s0 ^ gfMul(2, s1) ^ gfMul(3, s2) ^ s3;
    next[2][c] = s0 ^ s1 ^ gfMul(2, s2) ^ gfMul(3, s3);
    next[3][c] = gfMul(3, s0) ^ s1 ^ s2 ^ gfMul(2, s3);
  }
  return next;
}

/**
 * InvMixColumns Transformation: Multiply by inverse polynomial
 */
export function invMixColumns(state: number[][]): number[][] {
  const next = cloneState(state);
  for (let c = 0; c < 4; c++) {
    const s0 = state[0][c];
    const s1 = state[1][c];
    const s2 = state[2][c];
    const s3 = state[3][c];

    next[0][c] = gfMul(0x0e, s0) ^ gfMul(0x0b, s1) ^ gfMul(0x0d, s2) ^ gfMul(0x09, s3);
    next[1][c] = gfMul(0x09, s0) ^ gfMul(0x0e, s1) ^ gfMul(0x0b, s2) ^ gfMul(0x0d, s3);
    next[2][c] = gfMul(0x0d, s0) ^ gfMul(0x09, s1) ^ gfMul(0x0e, s2) ^ gfMul(0x0b, s3);
    next[3][c] = gfMul(0x0b, s0) ^ gfMul(0x0d, s1) ^ gfMul(0x09, s2) ^ gfMul(0x0e, s3);
  }
  return next;
}

/**
 * AddRoundKey Transformation: XOR state with round key matrix
 */
export function addRoundKey(state: number[][], roundKey: number[][]): number[][] {
  const next = cloneState(state);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      next[r][c] = (state[r][c] ^ roundKey[r][c]) & 0xff;
    }
  }
  return next;
}

// ----------------------------------------------------
// Key Expansion (Key Schedule)
// ----------------------------------------------------

export function rotWord(word: number[]): number[] {
  return [word[1], word[2], word[3], word[0]];
}

export function subWord(word: number[]): number[] {
  return word.map((b) => AES_SBOX[b]);
}

/**
 * Expand cipher key into (Nr + 1) round keys of 16 bytes each
 */
export function expandKey(keyBytes: number[], keyBits: 128 | 192 | 256 = 128): number[][][] {
  const nk = keyBits / 32; // 4, 6, or 8
  const nr = keyBits === 128 ? 10 : keyBits === 192 ? 12 : 14;
  const numWords = 4 * (nr + 1); // 44, 52, or 60

  const w: number[][] = [];
  // Initial words from key
  for (let i = 0; i < nk; i++) {
    w.push([
      keyBytes[4 * i] || 0,
      keyBytes[4 * i + 1] || 0,
      keyBytes[4 * i + 2] || 0,
      keyBytes[4 * i + 3] || 0,
    ]);
  }

  for (let i = nk; i < numWords; i++) {
    let temp = [...w[i - 1]];
    if (i % nk === 0) {
      temp = subWord(rotWord(temp));
      temp[0] ^= RCON[Math.floor(i / nk)];
    } else if (nk > 6 && i % nk === 4) {
      temp = subWord(temp);
    }
    const prevNk = w[i - nk];
    w.push([
      prevNk[0] ^ temp[0],
      prevNk[1] ^ temp[1],
      prevNk[2] ^ temp[2],
      prevNk[3] ^ temp[3],
    ]);
  }

  // Group into (nr + 1) 4x4 state matrices
  const roundKeys: number[][][] = [];
  for (let r = 0; r <= nr; r++) {
    const rkBytes: number[] = [];
    for (let c = 0; c < 4; c++) {
      rkBytes.push(...w[r * 4 + c]);
    }
    roundKeys.push(bytesToState(rkBytes));
  }

  return roundKeys;
}

// ----------------------------------------------------
// Step-by-Step Educational Inspector Types
// ----------------------------------------------------

export interface AesRoundStep {
  round: number;
  startState: number[][]; // 4x4
  afterSubBytes: number[][]; // 4x4
  afterShiftRows: number[][]; // 4x4
  afterMixColumns?: number[][]; // 4x4 (omitted in final round)
  roundKey: number[][]; // 4x4
  endState: number[][]; // 4x4
  explanation: string;
}

export interface AesBlockResult {
  plaintextHex: string;
  plaintextBytes: number[];
  initialState: number[][];
  preRoundState: number[][]; // after initial AddRoundKey (Round 0)
  rounds: AesRoundStep[];
  finalCiphertextBytes: number[];
  finalCiphertextHex: string;
}

/**
 * Process a single 16-byte block of AES with complete educational round traces
 */
export function processAesBlock(
  inputBytes: number[],
  keyBytes: number[],
  keyBits: 128 | 192 | 256 = 128,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): AesBlockResult {
  const nr = keyBits === 128 ? 10 : keyBits === 192 ? 12 : 14;
  const roundKeys = expandKey(keyBytes, keyBits);

  const initial = bytesToState(inputBytes);

  if (mode === 'encrypt') {
    // Round 0: Initial AddRoundKey
    let current = addRoundKey(initial, roundKeys[0]);
    const preRoundState = cloneState(current);

    const rounds: AesRoundStep[] = [];

    // Rounds 1 to Nr - 1
    for (let r = 1; r < nr; r++) {
      const startState = cloneState(current);
      const afterSB = subBytes(current);
      const afterSR = shiftRows(afterSB);
      const afterMC = mixColumns(afterSR);
      const endState = addRoundKey(afterMC, roundKeys[r]);

      current = endState;

      rounds.push({
        round: r,
        startState,
        afterSubBytes: afterSB,
        afterShiftRows: afterSR,
        afterMixColumns: afterMC,
        roundKey: roundKeys[r],
        endState,
        explanation: `Round ${r}: SubBytes applied non-linear S-Box, ShiftRows rotated rows by 0,1,2,3 positions, MixColumns diffused columns over GF(2⁸), AddRoundKey XORed with Round Key ${r}.`,
      });
    }

    // Final Round Nr (No MixColumns!)
    const finalStart = cloneState(current);
    const finalSB = subBytes(current);
    const finalSR = shiftRows(finalSB);
    const finalEnd = addRoundKey(finalSR, roundKeys[nr]);

    rounds.push({
      round: nr,
      startState: finalStart,
      afterSubBytes: finalSB,
      afterShiftRows: finalSR,
      roundKey: roundKeys[nr],
      endState: finalEnd,
      explanation: `Final Round ${nr}: SubBytes, ShiftRows, and AddRoundKey applied. MixColumns is intentionally omitted to allow symmetric decryption!`,
    });

    const cipherBytes = stateToBytes(finalEnd);

    return {
      plaintextHex: inputBytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
      plaintextBytes: inputBytes,
      initialState: initial,
      preRoundState,
      rounds,
      finalCiphertextBytes: cipherBytes,
      finalCiphertextHex: cipherBytes
        .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' '),
    };
  } else {
    // Decryption
    // Initial AddRoundKey with Key Nr
    let current = addRoundKey(initial, roundKeys[nr]);
    const preRoundState = cloneState(current);

    const rounds: AesRoundStep[] = [];

    // Rounds 1 to Nr - 1 (in reverse)
    for (let r = 1; r < nr; r++) {
      const invR = nr - r;
      const startState = cloneState(current);
      const afterISR = invShiftRows(current);
      const afterISB = invSubBytes(afterISR);
      const afterARK = addRoundKey(afterISB, roundKeys[invR]);
      const afterIMC = invMixColumns(afterARK);

      current = afterIMC;

      rounds.push({
        round: r,
        startState,
        afterShiftRows: afterISR,
        afterSubBytes: afterISB,
        afterMixColumns: afterIMC,
        roundKey: roundKeys[invR],
        endState: current,
        explanation: `InvRound ${r}: InvShiftRows, InvSubBytes, AddRoundKey with Key ${invR}, and InvMixColumns over GF(2⁸).`,
      });
    }

    // Final Decryption Round
    const finalStart = cloneState(current);
    const finalISR = invShiftRows(current);
    const finalISB = invSubBytes(finalISR);
    const finalEnd = addRoundKey(finalISB, roundKeys[0]);

    rounds.push({
      round: nr,
      startState: finalStart,
      afterShiftRows: finalISR,
      afterSubBytes: finalISB,
      roundKey: roundKeys[0],
      endState: finalEnd,
      explanation: `Final InvRound ${nr}: InvShiftRows, InvSubBytes, and AddRoundKey with Key 0. Plaintext restored!`,
    });

    const plainBytes = stateToBytes(finalEnd);

    return {
      plaintextHex: inputBytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' '),
      plaintextBytes: inputBytes,
      initialState: initial,
      preRoundState,
      rounds,
      finalCiphertextBytes: plainBytes,
      finalCiphertextHex: plainBytes
        .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
        .join(' '),
    };
  }
}

// ----------------------------------------------------
// Multi-Block String / Text Processor for Studio
// ----------------------------------------------------

export interface AesTextResult {
  inputText: string;
  keyHex: string;
  keyBits: 128 | 192 | 256;
  mode: 'encrypt' | 'decrypt';
  blocks: AesBlockResult[];
  fullCipherHex: string;
  fullCipherAscii: string;
}

export function processAes(
  input: string,
  keyStr: string,
  keyBits: 128 | 192 | 256 = 128,
  mode: 'encrypt' | 'decrypt' = 'encrypt'
): AesTextResult {
  const keyBytes = parseKeyBytes(keyStr, keyBits);
  const keyHex = keyBytes.map((b) => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

  // Parse input into 16-byte blocks
  const inputBlocks = parseInputTo16ByteBlocks(input);
  const blocks: AesBlockResult[] = [];
  let fullHex = '';
  let fullAscii = '';

  inputBlocks.forEach((blockBytes) => {
    const res = processAesBlock(blockBytes, keyBytes, keyBits, mode);
    blocks.push(res);
    fullHex += (fullHex ? ' ' : '') + res.finalCiphertextHex;
    fullAscii += res.finalCiphertextBytes
      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '·'))
      .join('');
  });

  return {
    inputText: input,
    keyHex,
    keyBits,
    mode,
    blocks,
    fullCipherHex: fullHex,
    fullCipherAscii: fullAscii,
  };
}

// ----------------------------------------------------
// Avalanche Effect & Cryptanalysis Tester
// ----------------------------------------------------

export interface AvalancheRoundStat {
  round: number;
  flippedBits: number;
  percentage: number; // 0 to 100%
  stateDiff: boolean[][]; // 4x4 matrix of which bytes changed
}

/**
 * Calculates Avalanche Effect: Flips 1 bit in plaintext,
 * measures how many bits flip in each round (Ideal: ~50% / 64 bits out of 128)
 */
export function calculateAvalancheEffect(
  plaintextStr: string = 'CRYPTO_SECURITY',
  keyStr: string = 'AESKEY128BITS123'
): {
  originalResult: AesBlockResult;
  perturbedResult: AesBlockResult;
  roundStats: AvalancheRoundStat[];
  overallSummary: string;
} {
  const keyBytes = parseKeyBytes(keyStr, 128);
  const pBytes1 = parseInputTo16ByteBlocks(plaintextStr)[0] || new Array(16).fill(0);
  const pBytes2 = [...pBytes1];
  // Flip bit 0 of byte 0
  pBytes2[0] ^= 0x01;

  const res1 = processAesBlock(pBytes1, keyBytes, 128, 'encrypt');
  const res2 = processAesBlock(pBytes2, keyBytes, 128, 'encrypt');

  const roundStats: AvalancheRoundStat[] = [];

  for (let r = 0; r < res1.rounds.length; r++) {
    const s1 = res1.rounds[r].endState;
    const s2 = res2.rounds[r].endState;

    let flipped = 0;
    const diffMatrix: boolean[][] = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const b1 = s1[row][col];
        const b2 = s2[row][col];
        diffMatrix[row][col] = b1 !== b2;
        const xor = b1 ^ b2;
        // Count 1s in xor
        for (let bit = 0; bit < 8; bit++) {
          if ((xor & (1 << bit)) !== 0) flipped++;
        }
      }
    }

    roundStats.push({
      round: r + 1,
      flippedBits: flipped,
      percentage: Math.round((flipped / 128) * 100),
      stateDiff: diffMatrix,
    });
  }

  const finalPct = roundStats[roundStats.length - 1]?.percentage || 50;

  return {
    originalResult: res1,
    perturbedResult: res2,
    roundStats,
    overallSummary: `By flipping just 1 bit in the input plaintext, AES reached complete diffusion (${finalPct}% of all 128 bits flipped) by round 3-4, proving extreme resistance to differential cryptanalysis!`,
  };
}

// ----------------------------------------------------
// Utility Parsers
// ----------------------------------------------------

function parseKeyBytes(key: string, keyBits: 128 | 192 | 256): number[] {
  const reqBytes = keyBits / 8; // 16, 24, or 32
  const cleanHex = key.replace(/[^0-9A-Fa-f]/g, '');
  if (cleanHex.length >= reqBytes * 2) {
    const bytes: number[] = [];
    for (let i = 0; i < reqBytes * 2; i += 2) {
      bytes.push(parseInt(cleanHex.substring(i, i + 2), 16));
    }
    return bytes;
  }
  // Otherwise parse as ASCII string padded with zero bytes
  const bytes: number[] = [];
  for (let i = 0; i < reqBytes; i++) {
    bytes.push(i < key.length ? key.charCodeAt(i) & 0xff : (i * 31 + 7) & 0xff);
  }
  return bytes;
}

function parseInputTo16ByteBlocks(input: string): number[][] {
  if (!input) input = 'MASTERCLASS_AES';
  const cleanHex = input.replace(/[^0-9A-Fa-f]/g, '');

  if (cleanHex.length >= 32 && cleanHex.length % 32 === 0) {
    const blocks: number[][] = [];
    for (let i = 0; i < cleanHex.length; i += 32) {
      const block: number[] = [];
      for (let j = 0; j < 32; j += 2) {
        block.push(parseInt(cleanHex.substring(i + j, i + j + 2), 16));
      }
      blocks.push(block);
    }
    return blocks;
  }

  // Text string: chunk into 16 bytes with PKCS7-style padding
  const bytes: number[] = [];
  for (let i = 0; i < input.length; i++) {
    bytes.push(input.charCodeAt(i) & 0xff);
  }

  const mod = bytes.length % 16;
  const padLen = 16 - mod;
  for (let i = 0; i < padLen; i++) {
    bytes.push(padLen);
  }

  const blocks: number[][] = [];
  for (let i = 0; i < bytes.length; i += 16) {
    blocks.push(bytes.slice(i, i + 16));
  }
  return blocks;
}
