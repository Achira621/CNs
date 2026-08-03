import {
  KeyValidation,
  TransformationStep,
  EuclideanStep,
  BruteForceResult,
  FrequencyData,
  CipherMethod,
  CipherMethodInfo,
} from '../types';

export const CIPHER_METHODS: Record<CipherMethod, CipherMethodInfo> = {
  caesar_default: {
    id: 'caesar_default',
    name: 'Caesar Cipher (Key = 3)',
    formula: 'E(x) = (x + 3) mod 26',
    description: "Julius Caesar's historic shift cipher with fixed key b = 3 and a = 1.",
    defaultA: 1,
    defaultB: 3,
    lockA: true,
    lockB: true,
  },
  caesar_custom: {
    id: 'caesar_custom',
    name: 'Caesar Cipher (Custom Key b)',
    formula: 'E(x) = (x + b) mod 26',
    description: 'Standard shift cipher with multiplier fixed at a = 1 and customizable shift key b.',
    defaultA: 1,
    defaultB: 7,
    lockA: true,
    lockB: false,
  },
  multiplicative: {
    id: 'multiplicative',
    name: 'Multiplicative Cipher',
    formula: 'E(x) = (a · x) mod 26',
    description: 'Pure multiplicative cipher with shift fixed at b = 0 and coprime multiplier key a.',
    defaultA: 5,
    defaultB: 0,
    lockA: false,
    lockB: true,
  },
  affine: {
    id: 'affine',
    name: 'Affine Cipher',
    formula: 'E(x) = (a · x + b) mod 26',
    description: 'Full linear cipher combining multiplicative key a and additive shift key b.',
    defaultA: 5,
    defaultB: 8,
    lockA: false,
    lockB: false,
  },
};

// Standard English Letter Frequencies (%)
export const ENGLISH_FREQUENCIES: Record<string, number> = {
  A: 8.2, B: 1.5, C: 2.8, D: 4.3, E: 12.7, F: 2.2, G: 2.0, H: 6.1,
  I: 7.0, J: 0.15, K: 0.77, L: 4.0, M: 2.4, N: 6.7, O: 7.5, P: 1.9,
  Q: 0.09, R: 6.0, S: 6.3, T: 9.1, U: 2.8, V: 0.98, W: 2.4, X: 0.15,
  Y: 2.0, Z: 0.07,
};

// Common English words for scoring decrypted text
const COMMON_ENGLISH_WORDS = [
  'THE', 'BE', 'TO', 'OF', 'AND', 'IN', 'THAT', 'HAVE', 'IT', 'FOR',
  'NOT', 'ON', 'WITH', 'HE', 'AS', 'YOU', 'DO', 'AT', 'THIS', 'BUT',
  'HIS', 'BY', 'FROM', 'THEY', 'WE', 'SAY', 'HER', 'SHE', 'OR', 'AN',
  'WILL', 'MY', 'ONE', 'ALL', 'WOULD', 'THERE', 'THEIR', 'WHAT', 'SO',
  'UP', 'OUT', 'IF', 'ABOUT', 'WHO', 'GET', 'WHICH', 'GO', 'ME', 'CIPHER',
  'SECRET', 'MESSAGE', 'KEY', 'MATH', 'CODE', 'AFFINE'
];

/**
 * Calculates Greatest Common Divisor using Euclidean Algorithm
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Extended Euclidean Algorithm returning steps and linear combination coefficients
 */
export function extendedGCD(a: number, b: number): {
  gcd: number;
  x: number;
  y: number;
  steps: EuclideanStep[];
} {
  let oldR = a, r = b;
  let oldS = 1, s = 0;
  let oldT = 0, t = 1;

  const steps: EuclideanStep[] = [];
  let stepNum = 1;

  while (r !== 0) {
    const quotient = Math.floor(oldR / r);
    const remainder = oldR % r;

    steps.push({
      step: stepNum++,
      a: oldR,
      b: r,
      quotient,
      remainder,
      x: oldS,
      y: oldT,
    });

    const tempR = r;
    r = remainder;
    oldR = tempR;

    const tempS = s;
    s = oldS - quotient * s;
    oldS = tempS;

    const tempT = t;
    t = oldT - quotient * t;
    oldT = tempT;
  }

  return { gcd: oldR, x: oldS, y: oldT, steps };
}

/**
 * Calculates Modular Multiplicative Inverse of 'a' modulo 'm'
 */
export function modInverse(a: number, m: number = 26): number | null {
  a = ((a % m) + m) % m;
  const res = extendedGCD(a, m);
  if (res.gcd !== 1) return null;
  return ((res.x % m) + m) % m;
}

/**
 * Checks if 'a' and 'm' are coprime
 */
export function isCoprime(a: number, m: number = 26): boolean {
  return gcd(a, m) === 1;
}

/**
 * Returns all valid 'a' key choices coprime to 'm'
 */
export function getValidKeysA(m: number = 26): number[] {
  const result: number[] = [];
  for (let i = 1; i < m; i++) {
    if (gcd(i, m) === 1) {
      result.push(i);
    }
  }
  return result;
}

/**
 * Validates Key A for given alphabet size m
 */
export function validateKeyA(a: number, m: number = 26): KeyValidation {
  const g = gcd(a, m);
  const isValid = g === 1;
  const validList = getValidKeysA(m);

  let explanation = '';
  if (isValid) {
    const inv = modInverse(a, m);
    explanation = `Key 'a' (${a}) is valid! gcd(${a}, ${m}) = 1. Its modular inverse is a⁻¹ = ${inv}.`;
  } else {
    explanation = `Key 'a' (${a}) is INVALID! gcd(${a}, ${m}) = ${g} ≠ 1. Encryption will lose information (multiple letters map to the same ciphertext letter).`;
  }

  // Find nearest valid keys
  const sortedByDiff = [...validList].sort((x, y) => Math.abs(x - a) - Math.abs(y - a));
  const suggestedA = sortedByDiff.slice(0, 3);

  return { isValid, gcd: g, explanation, suggestedA };
}

/**
 * Encrypts a single character
 */
export function encryptChar(
  char: string,
  a: number,
  b: number,
  m: number = 26
): string {
  const code = char.charCodeAt(0);

  // Uppercase A-Z
  if (code >= 65 && code <= 90) {
    const x = code - 65;
    const y = ((a * x + b) % m + m) % m;
    return String.fromCharCode(y + 65);
  }
  // Lowercase a-z
  if (code >= 97 && code <= 122) {
    const x = code - 97;
    const y = ((a * x + b) % m + m) % m;
    return String.fromCharCode(y + 97);
  }

  return char;
}

/**
 * Decrypts a single character
 */
export function decryptChar(
  char: string,
  a: number,
  b: number,
  m: number = 26
): string {
  const aInv = modInverse(a, m);
  if (aInv === null) return char; // Cannot decrypt with invalid key

  const code = char.charCodeAt(0);

  // Uppercase A-Z
  if (code >= 65 && code <= 90) {
    const y = code - 65;
    const x = ((aInv * (y - b)) % m + m) % m;
    return String.fromCharCode(x + 65);
  }
  // Lowercase a-z
  if (code >= 97 && code <= 122) {
    const y = code - 97;
    const x = ((aInv * (y - b)) % m + m) % m;
    return String.fromCharCode(x + 97);
  }

  return char;
}

/**
 * Full Text Encryption
 */
export function encryptText(
  text: string,
  a: number,
  b: number,
  m: number = 26,
  preserveNonAlpha: boolean = true
): string {
  if (!isCoprime(a, m)) return "ERROR: Key 'a' must be coprime to 26!";

  return text
    .split('')
    .map((c) => {
      if (!preserveNonAlpha && !/[a-zA-Z]/.test(c)) return '';
      return encryptChar(c, a, b, m);
    })
    .join('');
}

/**
 * Full Text Decryption
 */
export function decryptText(
  text: string,
  a: number,
  b: number,
  m: number = 26,
  preserveNonAlpha: boolean = true
): string {
  const aInv = modInverse(a, m);
  if (aInv === null) return "ERROR: Key 'a' has no modular inverse (not coprime)!";

  return text
    .split('')
    .map((c) => {
      if (!preserveNonAlpha && !/[a-zA-Z]/.test(c)) return '';
      return decryptChar(c, a, b, m);
    })
    .join('');
}

/**
 * Generates character-by-character calculation steps vector for display
 */
export function getStepByStepVector(
  text: string,
  a: number,
  b: number,
  mode: 'encrypt' | 'decrypt',
  m: number = 26
): TransformationStep[] {
  const aInv = modInverse(a, m);

  return text.split('').map((char) => {
    const isUpper = /[A-Z]/.test(char);
    const isLower = /[a-z]/.test(char);

    if (!isUpper && !isLower) {
      return {
        char,
        isAlphabet: false,
        resultChar: char,
      };
    }

    const baseCode = isUpper ? 65 : 97;
    const rawIdx = char.charCodeAt(0) - baseCode;

    if (mode === 'encrypt') {
      const calcIdx = a * rawIdx + b;
      const modIdx = ((calcIdx % m) + m) % m;
      return {
        char,
        isAlphabet: true,
        rawIndex: rawIdx,
        calculatedIndex: calcIdx,
        modIndex: modIdx,
        resultChar: String.fromCharCode(modIdx + baseCode),
      };
    } else {
      if (aInv === null) {
        return { char, isAlphabet: true, resultChar: '?' };
      }
      const calcIdx = aInv * (rawIdx - b);
      const modIdx = ((calcIdx % m) + m) % m;
      return {
        char,
        isAlphabet: true,
        rawIndex: rawIdx,
        calculatedIndex: calcIdx,
        modIndex: modIdx,
        resultChar: String.fromCharCode(modIdx + baseCode),
      };
    }
  });
}

/**
 * Generates 26-character Alphabet Mapping Table (A..Z -> Output)
 */
export function getAlphabetMappingTable(
  a: number,
  b: number,
  m: number = 26
): { original: string; index: number; mapped: string; mappedIndex: number }[] {
  const result = [];
  for (let i = 0; i < m; i++) {
    const origChar = String.fromCharCode(65 + i);
    const mappedChar = encryptChar(origChar, a, b, m);
    const mappedIdx = mappedChar.charCodeAt(0) - 65;
    result.push({
      original: origChar,
      index: i,
      mapped: mappedChar,
      mappedIndex: mappedIdx,
    });
  }
  return result;
}

/**
 * Letter Frequency Analysis for given text
 */
export function calculateLetterFrequency(text: string): FrequencyData[] {
  const counts: Record<string, number> = {};
  for (let i = 65; i <= 90; i++) {
    counts[String.fromCharCode(i)] = 0;
  }

  let totalAlpha = 0;
  const upper = text.toUpperCase();

  for (const char of upper) {
    if (char >= 'A' && char <= 'Z') {
      counts[char]++;
      totalAlpha++;
    }
  }

  return Object.keys(counts).map((letter) => {
    const count = counts[letter];
    const percentage = totalAlpha > 0 ? (count / totalAlpha) * 100 : 0;
    return {
      letter,
      count,
      percentage: Number(percentage.toFixed(2)),
      englishPercentage: ENGLISH_FREQUENCIES[letter] || 0,
    };
  });
}

/**
 * Brute Force Cryptanalysis - Scans possible keys based on cipher method filter
 */
export function bruteForceDecrypt(
  ciphertext: string,
  m: number = 26,
  methodFilter?: CipherMethod
): BruteForceResult[] {
  let validAs = getValidKeysA(m);
  let bValues = Array.from({ length: m }, (_, i) => i);

  if (methodFilter === 'caesar_default') {
    validAs = [1];
    bValues = [3];
  } else if (methodFilter === 'caesar_custom') {
    validAs = [1];
  } else if (methodFilter === 'multiplicative') {
    bValues = [0];
  }

  const results: BruteForceResult[] = [];

  for (const a of validAs) {
    for (const b of bValues) {
      const decrypted = decryptText(ciphertext, a, b, m);
      
      // Calculate score based on chi-squared and common English words match
      const freqData = calculateLetterFrequency(decrypted);
      let chiSquared = 0;
      freqData.forEach((f) => {
        const expected = f.englishPercentage;
        const observed = f.percentage;
        chiSquared += Math.pow(observed - expected, 2) / (expected + 0.001);
      });

      // Bonus points for common words
      const upperDecrypted = decrypted.toUpperCase();
      let wordBonus = 0;
      COMMON_ENGLISH_WORDS.forEach((word) => {
        if (upperDecrypted.includes(word)) {
          wordBonus += word.length * 15;
        }
      });

      // Score formula: lower chiSquared is better, wordBonus improves score
      const baseScore = Math.max(0, 500 - chiSquared) + wordBonus;

      results.push({
        a,
        b,
        decryptedText: decrypted,
        score: Math.round(baseScore),
        chiSquared: Number(chiSquared.toFixed(2)),
      });
    }
  }

  // Sort descending by score
  return results.sort((r1, r2) => r2.score - r1.score);
}

/**
 * Solves Known Plaintext Attack given two character pairs:
 * p1 -> c1, p2 -> c2
 */
export function solveKnownPlaintext(
  p1: string,
  c1: string,
  p2: string,
  c2: string,
  m: number = 26
): {
  solvedA: number | null;
  solvedB: number | null;
  isValid: boolean;
  message: string;
} {
  const x1 = p1.toUpperCase().charCodeAt(0) - 65;
  const y1 = c1.toUpperCase().charCodeAt(0) - 65;
  const x2 = p2.toUpperCase().charCodeAt(0) - 65;
  const y2 = c2.toUpperCase().charCodeAt(0) - 65;

  if (isNaN(x1) || isNaN(y1) || isNaN(x2) || isNaN(y2)) {
    return {
      solvedA: null,
      solvedB: null,
      isValid: false,
      message: 'Please select valid letters for both pairs.',
    };
  }

  if (x1 === x2) {
    return {
      solvedA: null,
      solvedB: null,
      isValid: false,
      message: 'Plaintext letters must be distinct (x1 ≠ x2).',
    };
  }

  const deltaX = ((x1 - x2) % m + m) % m;
  const deltaY = ((y1 - y2) % m + m) % m;

  const invDeltaX = modInverse(deltaX, m);

  if (invDeltaX === null) {
    return {
      solvedA: null,
      solvedB: null,
      isValid: false,
      message: `Δx = (${x1} - ${x2}) mod 26 = ${deltaX}. ${deltaX} is not coprime to 26, so no unique solution exists for key 'a'.`,
    };
  }

  const solvedA = (deltaY * invDeltaX) % m;
  if (!isCoprime(solvedA, m)) {
    return {
      solvedA,
      solvedB: null,
      isValid: false,
      message: `Calculated key 'a' (${solvedA}) is not coprime to 26! The given pair mapping is mathematically inconsistent.`,
    };
  }

  const solvedB = ((y1 - solvedA * x1) % m + m) % m;

  return {
    solvedA,
    solvedB,
    isValid: true,
    message: `Successfully solved system! Key a = ${solvedA}, Key b = ${solvedB}.`,
  };
}
