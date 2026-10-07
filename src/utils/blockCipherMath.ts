import { BlockCipherStep } from '../types';

/**
 * Convert string to ASCII byte array
 */
export function stringToBytes(str: string): number[] {
  const bytes: number[] = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
}

/**
 * Convert byte array to string
 */
export function bytesToString(bytes: number[]): string {
  return String.fromCharCode(...bytes);
}

/**
 * Convert byte array to space-separated hex representation
 */
export function bytesToHex(bytes: number[]): string {
  return bytes.map(b => (b & 0xff).toString(16).padStart(2, '0').toUpperCase()).join(' ');
}

/**
 * Parse Hex string (e.g. "4F 82 A1" or "4F82A1") into byte array
 */
export function hexToBytes(hex: string): number[] {
  const clean = hex.replace(/[^0-9A-Fa-f]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    bytes.push(parseInt(clean.substring(i, i + 2), 16));
  }
  return bytes;
}

/**
 * Check if string is formatted as Hex bytes
 */
export function isHexString(str: string): boolean {
  const trimmed = str.trim();
  if (!trimmed) return false;
  return /^([0-9A-Fa-f]{2}\s*)+$/.test(trimmed);
}

/**
 * Simple key derivation / expansion function for demo block ciphers
 * Creates a deterministic key block of length `blockSize` from key string
 */
export function deriveBlockKey(key: string, blockSize: number): number[] {
  const keyBytes = stringToBytes(key.length > 0 ? key : 'KEY');
  const result: number[] = [];
  for (let i = 0; i < blockSize; i++) {
    result.push((keyBytes[i % keyBytes.length] ^ ((i * 37 + 13) % 256)) & 0xff);
  }
  return result;
}

/**
 * Pseudo-random F-function block encryption step
 * Performs exact 8-bit circular left rotation (ROL8 by 3) + XOR key substitution
 */
export function blockEncryptF(block: number[], keyBytes: number[]): number[] {
  return block.map((b, i) => {
    const k = keyBytes[i % keyBytes.length];
    const byteVal = b & 0xff;
    // ROL8 by 3 bits
    const rot = ((byteVal << 3) & 0xff) | (byteVal >> 5);
    return rot ^ k;
  });
}

/**
 * Decrypts a block encrypted with blockEncryptF
 * Performs XOR key substitution + exact 8-bit circular right rotation (ROR8 by 3)
 */
export function blockDecryptF(block: number[], keyBytes: number[]): number[] {
  return block.map((b, i) => {
    const k = keyBytes[i % keyBytes.length];
    const unxor = (b & 0xff) ^ k;
    // ROR8 by 3 bits
    const rot = (unxor >> 3) | ((unxor << 5) & 0xff);
    return rot & 0xff;
  });
}

/**
 * Helper to Pad string to multiple of blockSize
 */
export function padPlaintext(text: string, blockSize: number): string {
  const mod = text.length % blockSize;
  if (mod === 0) return text;
  const padLen = blockSize - mod;
  return text + ' '.repeat(padLen);
}

export interface BlockCipherResult {
  ciphertext: string;
  ciphertextHex: string;
  steps: BlockCipherStep[];
}

/**
 * Master Block Cipher Execution Engine
 */
export function processBlockCipher(
  mode: 'encrypt' | 'decrypt',
  method: 'ecb' | 'cbc' | 'cfb' | 'ofb' | 'ctr',
  input: string,
  keyStr: string,
  ivStr: string,
  nonceVal: number = 100,
  blockSize: number = 4
): BlockCipherResult {
  const keyBytes = deriveBlockKey(keyStr, blockSize);
  const ivBytes = deriveBlockKey(ivStr.length > 0 ? ivStr : 'INITVEC', blockSize);

  if (mode === 'encrypt') {
    const padded = padPlaintext(input, blockSize);
    const numBlocks = Math.max(1, Math.ceil(padded.length / blockSize));
    const steps: BlockCipherStep[] = [];
    let fullCipherBytes: number[] = [];

    let prevCipherBlock = [...ivBytes];
    let prevFeedbackBlock = [...ivBytes];

    for (let i = 0; i < numBlocks; i++) {
      const blockStr = padded.slice(i * blockSize, (i + 1) * blockSize);
      const pBytes = stringToBytes(blockStr);
      let cBytes: number[] = [];
      let explanation = '';
      let ivOrPrevHex = '';
      let xorHex = '';
      let keystreamHex = '';

      if (method === 'ecb') {
        // C_i = E_K(P_i)
        cBytes = blockEncryptF(pBytes, keyBytes);
        ivOrPrevHex = 'N/A (Independent Block)';
        xorHex = 'N/A';
        keystreamHex = bytesToHex(keyBytes);
        explanation = `ECB: Block ${i + 1} enciphered directly with Key.`;
      } else if (method === 'cbc') {
        // C_i = E_K(P_i XOR C_{i-1})
        ivOrPrevHex = bytesToHex(prevCipherBlock);
        const xored = pBytes.map((pb, idx) => pb ^ prevCipherBlock[idx]);
        xorHex = bytesToHex(xored);
        cBytes = blockEncryptF(xored, keyBytes);
        prevCipherBlock = [...cBytes];
        keystreamHex = bytesToHex(keyBytes);
        explanation = `CBC: Plaintext ${i + 1} XORed with ${i === 0 ? 'IV' : `C_${i}`} then enciphered.`;
      } else if (method === 'cfb') {
        // C_i = P_i XOR E_K(C_{i-1})
        ivOrPrevHex = bytesToHex(prevCipherBlock);
        const keystream = blockEncryptF(prevCipherBlock, keyBytes);
        keystreamHex = bytesToHex(keystream);
        cBytes = pBytes.map((pb, idx) => pb ^ keystream[idx]);
        prevCipherBlock = [...cBytes];
        xorHex = bytesToHex(pBytes);
        explanation = `CFB: ${i === 0 ? 'IV' : `C_${i}`} enciphered to form keystream, XORed with Plaintext.`;
      } else if (method === 'ofb') {
        // O_i = E_K(O_{i-1}), C_i = P_i XOR O_i
        ivOrPrevHex = bytesToHex(prevFeedbackBlock);
        const nextFeedback = blockEncryptF(prevFeedbackBlock, keyBytes);
        prevFeedbackBlock = [...nextFeedback];
        keystreamHex = bytesToHex(nextFeedback);
        cBytes = pBytes.map((pb, idx) => pb ^ nextFeedback[idx]);
        xorHex = bytesToHex(pBytes);
        explanation = `OFB: Keystream generated independently from ${i === 0 ? 'IV' : `O_${i}`}, XORed with Plaintext.`;
      } else if (method === 'ctr') {
        // O_i = E_K(Nonce || i), C_i = P_i XOR O_i
        const counterBlock = Array.from({ length: blockSize }, (_, idx) => (nonceVal + i + idx * 7) % 256);
        ivOrPrevHex = `Nonce+Count (${nonceVal + i})`;
        const keystream = blockEncryptF(counterBlock, keyBytes);
        keystreamHex = bytesToHex(keystream);
        cBytes = pBytes.map((pb, idx) => pb ^ keystream[idx]);
        xorHex = bytesToHex(pBytes);
        explanation = `CTR: Counter value (${nonceVal + i}) enciphered with Key to form stream, XORed with Plaintext.`;
      }

      fullCipherBytes.push(...cBytes);

      steps.push({
        blockIndex: i + 1,
        plaintextBlock: blockStr,
        plaintextHex: bytesToHex(pBytes),
        ivOrPrevCipherHex: ivOrPrevHex,
        xorResultHex: xorHex,
        keystreamHex: keystreamHex,
        ciphertextHex: bytesToHex(cBytes),
        ciphertextBlock: bytesToString(cBytes),
        explanation,
      });
    }

    return {
      ciphertext: bytesToHex(fullCipherBytes),
      ciphertextHex: bytesToHex(fullCipherBytes),
      steps,
    };
  } else {
    // Decryption mode
    let cBytesFull: number[] = [];
    if (isHexString(input)) {
      cBytesFull = hexToBytes(input);
    } else {
      cBytesFull = stringToBytes(input);
    }

    if (cBytesFull.length === 0) {
      cBytesFull = [32, 32, 32, 32];
    }

    const numBlocks = Math.max(1, Math.ceil(cBytesFull.length / blockSize));
    const steps: BlockCipherStep[] = [];
    let fullPlainBytes: number[] = [];

    let prevCipherBlock = [...ivBytes];
    let prevFeedbackBlock = [...ivBytes];

    for (let i = 0; i < numBlocks; i++) {
      const cBlockBytes = cBytesFull.slice(i * blockSize, (i + 1) * blockSize);
      // Fill missing bytes if short
      while (cBlockBytes.length < blockSize) cBlockBytes.push(32);

      let pBytes: number[] = [];
      let explanation = '';
      let ivOrPrevHex = '';
      let xorHex = '';
      let keystreamHex = '';

      if (method === 'ecb') {
        pBytes = blockDecryptF(cBlockBytes, keyBytes);
        ivOrPrevHex = 'N/A';
        xorHex = 'N/A';
        keystreamHex = bytesToHex(keyBytes);
        explanation = `ECB: Block ${i + 1} deciphered directly with Key.`;
      } else if (method === 'cbc') {
        ivOrPrevHex = bytesToHex(prevCipherBlock);
        const decVal = blockDecryptF(cBlockBytes, keyBytes);
        pBytes = decVal.map((db, idx) => db ^ prevCipherBlock[idx]);
        prevCipherBlock = [...cBlockBytes];
        xorHex = bytesToHex(decVal);
        keystreamHex = bytesToHex(keyBytes);
        explanation = `CBC: Ciphertext deciphered then XORed with ${i === 0 ? 'IV' : `C_${i}`}.`;
      } else if (method === 'cfb') {
        ivOrPrevHex = bytesToHex(prevCipherBlock);
        const keystream = blockEncryptF(prevCipherBlock, keyBytes);
        keystreamHex = bytesToHex(keystream);
        pBytes = cBlockBytes.map((cb, idx) => cb ^ keystream[idx]);
        prevCipherBlock = [...cBlockBytes];
        xorHex = bytesToHex(cBlockBytes);
        explanation = `CFB: ${i === 0 ? 'IV' : `C_${i}`} enciphered to recreate keystream, XORed with Ciphertext.`;
      } else if (method === 'ofb') {
        ivOrPrevHex = bytesToHex(prevFeedbackBlock);
        const nextFeedback = blockEncryptF(prevFeedbackBlock, keyBytes);
        prevFeedbackBlock = [...nextFeedback];
        keystreamHex = bytesToHex(nextFeedback);
        pBytes = cBlockBytes.map((cb, idx) => cb ^ nextFeedback[idx]);
        xorHex = bytesToHex(cBlockBytes);
        explanation = `OFB: Keystream regenerated from ${i === 0 ? 'IV' : `O_${i}`}, XORed with Ciphertext.`;
      } else if (method === 'ctr') {
        const counterBlock = Array.from({ length: blockSize }, (_, idx) => (nonceVal + i + idx * 7) % 256);
        ivOrPrevHex = `Nonce+Count (${nonceVal + i})`;
        const keystream = blockEncryptF(counterBlock, keyBytes);
        keystreamHex = bytesToHex(keystream);
        pBytes = cBlockBytes.map((cb, idx) => cb ^ keystream[idx]);
        xorHex = bytesToHex(cBlockBytes);
        explanation = `CTR: Counter enciphered with Key, XORed with Ciphertext.`;
      }

      fullPlainBytes.push(...pBytes);

      steps.push({
        blockIndex: i + 1,
        plaintextBlock: bytesToString(pBytes),
        plaintextHex: bytesToHex(pBytes),
        ivOrPrevCipherHex: ivOrPrevHex,
        xorResultHex: xorHex,
        keystreamHex,
        ciphertextHex: bytesToHex(cBlockBytes),
        ciphertextBlock: bytesToString(cBlockBytes),
        explanation,
      });
    }

    const decryptedStr = bytesToString(fullPlainBytes);

    return {
      ciphertext: decryptedStr,
      ciphertextHex: bytesToHex(fullPlainBytes),
      steps,
    };
  }
}
