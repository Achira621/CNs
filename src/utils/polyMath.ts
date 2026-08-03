import { modInverse, isCoprime } from './affineMath';

// ==========================================
// 1. VIGENÈRE CIPHER
// ==========================================

export interface VigenereStep {
  plainChar: string;
  keyChar: string;
  plainIndex: number;
  keyIndex: number;
  resultIndex: number;
  resultChar: string;
}

export function cleanKey(key: string): string {
  const cleaned = key.toUpperCase().replace(/[^A-Z]/g, '');
  return cleaned.length > 0 ? cleaned : 'KEY';
}

export function vigenereCipher(
  text: string,
  keyStr: string,
  mode: 'encrypt' | 'decrypt'
): { resultText: string; steps: VigenereStep[] } {
  const key = cleanKey(keyStr);
  let keyIdx = 0;
  let resultText = '';
  const steps: VigenereStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const upperChar = char.toUpperCase();

    if (upperChar >= 'A' && upperChar <= 'Z') {
      const plainIndex = upperChar.charCodeAt(0) - 65;
      const currentKeyChar = key[keyIdx % key.length];
      const keyIndex = currentKeyChar.charCodeAt(0) - 65;

      let resultIndex: number;
      if (mode === 'encrypt') {
        resultIndex = (plainIndex + keyIndex) % 26;
      } else {
        resultIndex = (plainIndex - keyIndex + 26) % 26;
      }

      const resultChar = String.fromCharCode(65 + resultIndex);
      resultText += char === upperChar ? resultChar : resultChar.toLowerCase();

      steps.push({
        plainChar: upperChar,
        keyChar: currentKeyChar,
        plainIndex,
        keyIndex,
        resultIndex,
        resultChar,
      });

      keyIdx++;
    } else {
      resultText += char;
    }
  }

  return { resultText, steps };
}

// ==========================================
// 2. PLAYFAIR CIPHER (5x5 Matrix)
// ==========================================

export interface PlayfairStep {
  pair: [string, string];
  pos1: { row: number; col: number };
  pos2: { row: number; col: number };
  rule: 'same_row' | 'same_col' | 'rectangle';
  resultPair: [string, string];
}

export function generatePlayfairMatrix(keyStr: string): string[][] {
  const cleanedKey = (keyStr.toUpperCase() + 'ABCDEFGHIKLMNOPQRSTUVWXYZ')
    .replace(/J/g, 'I')
    .replace(/[^A-Z]/g, '');

  const used = new Set<string>();
  const matrix: string[][] = [];
  let currentRow: string[] = [];

  for (let i = 0; i < cleanedKey.length; i++) {
    const char = cleanedKey[i];
    if (!used.has(char)) {
      used.add(char);
      currentRow.push(char);
      if (currentRow.length === 5) {
        matrix.push(currentRow);
        currentRow = [];
      }
    }
  }

  return matrix;
}

export function findCharPosition(matrix: string[][], char: string): { row: number; col: number } {
  const searchChar = char === 'J' ? 'I' : char;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c] === searchChar) {
        return { row: r, col: c };
      }
    }
  }
  return { row: 0, col: 0 };
}

export function preparePlayfairPairs(text: string): [string, string][] {
  const cleaned = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const pairs: [string, string][] = [];

  let i = 0;
  while (i < cleaned.length) {
    const char1 = cleaned[i];
    let char2 = i + 1 < cleaned.length ? cleaned[i + 1] : 'X';

    if (char1 === char2) {
      char2 = 'X';
      i++;
    } else {
      i += 2;
    }
    pairs.push([char1, char2]);
  }

  if (pairs.length > 0 && pairs[pairs.length - 1][1] === undefined) {
    pairs[pairs.length - 1][1] = 'X';
  }

  return pairs;
}

export function playfairCipher(
  text: string,
  keyStr: string,
  mode: 'encrypt' | 'decrypt'
): { resultText: string; matrix: string[][]; steps: PlayfairStep[] } {
  const matrix = generatePlayfairMatrix(keyStr);
  const pairs = preparePlayfairPairs(text);
  const steps: PlayfairStep[] = [];
  let resultText = '';

  const shift = mode === 'encrypt' ? 1 : 4; // +1 mod 5 vs +4 (-1) mod 5

  pairs.forEach(([c1, c2]) => {
    const pos1 = findCharPosition(matrix, c1);
    const pos2 = findCharPosition(matrix, c2);

    let res1: string;
    let res2: string;
    let rule: 'same_row' | 'same_col' | 'rectangle';

    if (pos1.row === pos2.row) {
      rule = 'same_row';
      res1 = matrix[pos1.row][(pos1.col + shift) % 5];
      res2 = matrix[pos2.row][(pos2.col + shift) % 5];
    } else if (pos1.col === pos2.col) {
      rule = 'same_col';
      res1 = matrix[(pos1.row + shift) % 5][pos1.col];
      res2 = matrix[(pos2.row + shift) % 5][pos2.col];
    } else {
      rule = 'rectangle';
      res1 = matrix[pos1.row][pos2.col];
      res2 = matrix[pos2.row][pos1.col];
    }

    resultText += res1 + res2;
    steps.push({
      pair: [c1, c2],
      pos1,
      pos2,
      rule,
      resultPair: [res1, res2],
    });
  });

  return { resultText, matrix, steps };
}

// ==========================================
// 3. HILL CIPHER (2x2 Matrix)
// ==========================================

export interface HillMatrixKey {
  k11: number;
  k12: number;
  k21: number;
  k22: number;
}

export interface HillStep {
  pair: [string, string];
  vec: [number, number];
  calc1: string;
  calc2: string;
  resVec: [number, number];
  resultPair: [string, string];
}

export function getHillDeterminant(key: HillMatrixKey): number {
  const det = key.k11 * key.k22 - key.k12 * key.k21;
  return ((det % 26) + 26) % 26;
}

export function isHillKeyValid(key: HillMatrixKey): boolean {
  const det = getHillDeterminant(key);
  return isCoprime(det, 26);
}

export function getHillInverseMatrix(key: HillMatrixKey): HillMatrixKey | null {
  const det = getHillDeterminant(key);
  if (!isCoprime(det, 26)) return null;

  const detInv = modInverse(det, 26);

  // Adjugate matrix for 2x2 [[a, b], [c, d]] is [[d, -b], [-c, a]]
  const adj11 = ((key.k22 % 26) + 26) % 26;
  const adj12 = (((-key.k12) % 26) + 26) % 26;
  const adj21 = (((-key.k21) % 26) + 26) % 26;
  const adj22 = ((key.k11 % 26) + 26) % 26;

  return {
    k11: (adj11 * detInv) % 26,
    k12: (adj12 * detInv) % 26,
    k21: (adj21 * detInv) % 26,
    k22: (adj22 * detInv) % 26,
  };
}

export function hillCipher(
  text: string,
  key: HillMatrixKey,
  mode: 'encrypt' | 'decrypt'
): { resultText: string; isValidKey: boolean; det: number; steps: HillStep[] } {
  const det = getHillDeterminant(key);
  const isValid = isHillKeyValid(key);

  if (!isValid) {
    return { resultText: 'INVALID KEY (Determinant is not coprime with 26)', isValidKey: false, det, steps: [] };
  }

  let activeKey = key;
  if (mode === 'decrypt') {
    const invKey = getHillInverseMatrix(key);
    if (!invKey) {
      return { resultText: 'INVALID KEY (Inverse Matrix Error)', isValidKey: false, det, steps: [] };
    }
    activeKey = invKey;
  }

  const cleaned = text.toUpperCase().replace(/[^A-Z]/g, '');
  const padded = cleaned.length % 2 !== 0 ? cleaned + 'X' : cleaned;

  let resultText = '';
  const steps: HillStep[] = [];

  for (let i = 0; i < padded.length; i += 2) {
    const c1 = padded[i];
    const c2 = padded[i + 1];

    const v1 = c1.charCodeAt(0) - 65;
    const v2 = c2.charCodeAt(0) - 65;

    const res1 = (activeKey.k11 * v1 + activeKey.k12 * v2) % 26;
    const res2 = (activeKey.k21 * v1 + activeKey.k22 * v2) % 26;

    const resChar1 = String.fromCharCode(65 + res1);
    const resChar2 = String.fromCharCode(65 + res2);

    resultText += resChar1 + resChar2;

    steps.push({
      pair: [c1, c2],
      vec: [v1, v2],
      calc1: `(${activeKey.k11}×${v1} + ${activeKey.k12}×${v2}) mod 26 = ${res1}`,
      calc2: `(${activeKey.k21}×${v1} + ${activeKey.k22}×${v2}) mod 26 = ${res2}`,
      resVec: [res1, res2],
      resultPair: [resChar1, resChar2],
    });
  }

  return { resultText, isValidKey: true, det, steps };
}
