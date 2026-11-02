/**
 * Unified Cryptography Execution Tracing Engine
 * Produces structured AlgorithmTrace and AlgorithmStep objects
 * for all classical, modern, asymmetric, and hashing algorithms.
 */

import {
  AlgorithmStep,
  AlgorithmTrace,
  CipherMethod,
  TransformationStep,
} from '../types';
import {
  CIPHER_METHODS,
  getStepByStepVector,
  modInverse,
} from './affineMath';
import {
  vigenereCipher,
  playfairCipher,
  hillCipher,
  HillMatrixKey,
  getHillDeterminant,
} from './polyMath';
import { processBlockCipher } from './blockCipherMath';
import { processDesBlock, processTwoDes, processThreeDes } from './desMath';
import { processAes } from './aesMath';
import {
  generateEducationalRSA,
  rsaEncrypt,
  rsaDecrypt,
  simulateDiffieHellman,
  ecMultiply,
  DEFAULT_ECC_CURVE,
} from './asymmetricMath';
import { sha256Trace, hmacSha256Trace } from './hashMath';

export interface TraceGenerationParams {
  method: CipherMethod;
  operation: 'encrypt' | 'decrypt';
  text: string;
  keyA?: number;
  keyB?: number;
  vigenereKey?: string;
  playfairKey?: string;
  hillMatrix?: HillMatrixKey;
  blockKey?: string;
  blockIv?: string;
  desKey?: string;
  desKey2?: string;
  desKey3?: string;
  aesKey?: string;
  rsaP?: number;
  rsaQ?: number;
  rsaE?: number;
  rsaCipherValues?: number[];
  dhPrime?: number;
  dhGen?: number;
  dhAlicePriv?: number;
  dhBobPriv?: number;
  eccScalar?: number;
}

export function generateAlgorithmTrace(params: TraceGenerationParams): AlgorithmTrace {
  const startTime = performance.now();
  const info = CIPHER_METHODS[params.method];
  const algorithmName = info?.name || params.method.toUpperCase();

  let steps: AlgorithmStep[] = [];
  let outputResult: unknown = '';

  switch (params.method) {
    case 'caesar_default':
    case 'caesar_custom':
    case 'multiplicative':
    case 'affine': {
      const a = params.keyA ?? (params.method === 'multiplicative' ? 5 : 1);
      const b = params.keyB ?? (params.method === 'caesar_default' ? 3 : 7);
      const vector = getStepByStepVector(params.text, a, b, params.operation);

      steps = vector.map((step: TransformationStep, idx: number) => {
        let mathExp = '';
        if (params.operation === 'encrypt') {
          mathExp = `(${a} · ${step.rawIndex} + ${b}) mod 26 = ${step.calculatedIndex} ➔ ${step.modIndex} ('${step.resultChar}')`;
        } else {
          const invA = modInverse(a, 26);
          mathExp = `${invA} · (${step.rawIndex} - ${b}) mod 26 = ${step.calculatedIndex} ➔ ${step.modIndex} ('${step.resultChar}')`;
        }

        return {
          id: `step-${idx}`,
          index: idx,
          title: `Letter '${step.char}' ➔ '${step.resultChar}'`,
          description: step.isAlphabet
            ? `Transformed character index ${step.rawIndex} using formula ${info.formula}`
            : 'Non-alphabetic character preserved without shift.',
          operation: params.operation,
          input: step.char,
          output: step.resultChar,
          mathematicalExplanation: step.isAlphabet ? mathExp : 'Preserved unchanged.',
          visualData: {
            char: step.char,
            rawIndex: step.rawIndex,
            resultChar: step.resultChar,
            modIndex: step.modIndex,
          },
          highlight: [step.char, step.resultChar],
        };
      });

      outputResult = vector.map((s) => s.resultChar).join('');
      break;
    }

    case 'vigenere': {
      const vKey = (params.vigenereKey || 'SECRET').toUpperCase();
      const res = vigenereCipher(params.text, vKey, params.operation);
      outputResult = res.resultText;

      steps = res.steps.map((s, idx) => ({
        id: `vig-${idx}`,
        index: idx,
        title: `Char '${s.plainChar}' with Key '${s.keyChar}'`,
        description: `Position ${idx}: Plaintext '${s.plainChar}' (${s.plainIndex}) aligned with key '${s.keyChar}' (${s.keyIndex}).`,
        operation: params.operation,
        input: { char: s.plainChar, keyChar: s.keyChar },
        output: s.resultChar,
        mathematicalExplanation:
          params.operation === 'encrypt'
            ? `(${s.plainIndex} + ${s.keyIndex}) mod 26 = ${s.resultIndex} ➔ '${s.resultChar}'`
            : `(${s.plainIndex} - ${s.keyIndex} + 26) mod 26 = ${s.resultIndex} ➔ '${s.resultChar}'`,
        highlight: [s.plainChar, s.keyChar, s.resultChar],
      }));
      break;
    }

    case 'playfair': {
      const pKey = params.playfairKey || 'MONARCHY';
      const res = playfairCipher(params.text, pKey, params.operation);
      outputResult = res.resultText;

      steps = res.steps.map((s, idx) => ({
        id: `pf-${idx}`,
        index: idx,
        title: `Digraph [${s.pair.join('')}] ➔ [${s.resultPair.join('')}] (${s.rule})`,
        description: `Transformation rule: ${s.rule.toUpperCase()}. Row/Col shifts inside 5x5 key matrix.`,
        operation: params.operation,
        input: s.pair.join(''),
        output: s.resultPair.join(''),
        mathematicalExplanation: `Position in Matrix: C1(${s.pos1.row}, ${s.pos1.col}), C2(${s.pos2.row}, ${s.pos2.col}). Rule applied: ${s.rule}.`,
        visualData: { ...s, matrix: res.matrix },
      }));
      break;
    }

    case 'hill': {
      const matrix = params.hillMatrix || { k11: 5, k12: 8, k21: 17, k22: 3 };
      const det = getHillDeterminant(matrix);
      const res = hillCipher(params.text, matrix, params.operation);
      outputResult = res.resultText;

      steps = res.steps.map((s, idx) => ({
        id: `hill-${idx}`,
        index: idx,
        title: `Pair [${s.pair.join('')}] ➔ [${s.resultPair.join('')}]`,
        description: `Vector [${s.vec[0]}, ${s.vec[1]}] multiplied by key matrix mod 26. (det = ${det})`,
        operation: params.operation,
        input: s.pair.join(''),
        output: s.resultPair.join(''),
        mathematicalExplanation: `${s.calc1} | ${s.calc2} ➔ [${s.resVec[0]}, ${s.resVec[1]}] = [${s.resultPair.join('')}]`,
        visualData: s,
      }));
      break;
    }

    case 'des': {
      const hexBlock = (params.text.slice(0, 16) || '0123456789ABCDEF').padEnd(16, '0');
      const hexKey = (params.desKey || '133457799BBCDFF1').padEnd(16, '0');
      const res = processDesBlock(hexBlock, hexKey, params.operation);
      outputResult = res.ciphertextHex;

      steps = res.rounds.map((rs, idx) => ({
        id: `des-round-${idx}`,
        index: idx,
        title: `Round ${rs.round} / 16 (Feistel)`,
        description: `Left half: ${rs.leftHex}, Right half: ${rs.rightHex}. Subkey: ${rs.subkeyHex}`,
        operation: params.operation,
        input: { leftHex: rs.leftHex, rightHex: rs.rightHex },
        output: { sboxOutputHex: rs.sboxOutputHex, pOutputHex: rs.pOutputHex },
        mathematicalExplanation: `L_{i} = R_{i-1}, R_{i} = L_{i-1} ⊕ F(R_{i-1}, K_{i})`,
        visualData: rs,
      }));
      break;
    }

    case '2des': {
      const hexBlock = (params.text.slice(0, 16) || '0123456789ABCDEF').padEnd(16, '0');
      const k1 = (params.desKey || '133457799BBCDFF1').padEnd(16, '0');
      const k2 = (params.desKey2 || '1F1F1F1F1F1F1F1F').padEnd(16, '0');
      const res = processTwoDes(hexBlock, k1, k2, params.operation);
      outputResult = res.fullCipherHex;

      const firstBlock = res.blocks[0];
      const stage1Out = firstBlock?.stage1.outputHex || '';
      const stage2Out = firstBlock?.stage2.outputHex || '';

      steps = [
        {
          id: '2des-stage-1',
          index: 0,
          title: 'Stage 1: DES with Key 1',
          description: `Processed 64-bit block through DES-K1. Intermediate result: ${stage1Out}`,
          operation: params.operation,
          input: hexBlock,
          output: stage1Out,
          mathematicalExplanation: 'Intermediate = DES_K1(P)',
          visualData: { key: k1, intermediate: stage1Out },
        },
        {
          id: '2des-stage-2',
          index: 1,
          title: 'Stage 2: DES with Key 2',
          description: `Processed intermediate block through DES-K2. Final: ${stage2Out}`,
          operation: params.operation,
          input: stage1Out,
          output: stage2Out,
          mathematicalExplanation: 'Final = DES_K2(Intermediate) [Vulnerable to 2^{k+1} MITM attack!]',
          visualData: { key: k2, final: stage2Out },
        },
      ];
      break;
    }

    case '3des': {
      const hexBlock = (params.text.slice(0, 16) || '0123456789ABCDEF').padEnd(16, '0');
      const k1 = (params.desKey || '133457799BBCDFF1').padEnd(16, '0');
      const k2 = (params.desKey2 || '1F1F1F1F1F1F1F1F').padEnd(16, '0');
      const k3 = (params.desKey3 || '3333333333333333').padEnd(16, '0');
      const res = processThreeDes(hexBlock, k1, k2, k3, params.operation);
      outputResult = res.fullCipherHex;

      const fb = res.blocks[0];
      const s1Out = fb?.stage1.outputHex || '';
      const s2Out = fb?.stage2.outputHex || '';
      const s3Out = fb?.stage3.outputHex || '';

      steps = [
        {
          id: '3des-s1',
          index: 0,
          title: 'Stage 1: E_K1 (Encrypt)',
          description: `Encrypted with Key 1: ${s1Out}`,
          operation: 'encrypt',
          input: hexBlock,
          output: s1Out,
          mathematicalExplanation: 'C1 = E_{K1}(P)',
        },
        {
          id: '3des-s2',
          index: 1,
          title: 'Stage 2: D_K2 (Decrypt)',
          description: `Decrypted with Key 2: ${s2Out}`,
          operation: 'decrypt',
          input: s1Out,
          output: s2Out,
          mathematicalExplanation: 'C2 = D_{K2}(C1)',
        },
        {
          id: '3des-s3',
          index: 2,
          title: 'Stage 3: E_K3 (Encrypt)',
          description: `Encrypted with Key 3: ${s3Out}`,
          operation: 'encrypt',
          input: s2Out,
          output: s3Out,
          mathematicalExplanation: 'C3 = E_{K3}(C2) [EDE Architecture]',
        },
      ];
      break;
    }

    case 'aes': {
      const hexKey = (params.aesKey || '2B7E151628AED2A6ABF7158809CF4F3C').padEnd(32, '0');
      const res = processAes(params.text || 'HELLO AES CIPHER', hexKey, 128, params.operation);
      outputResult = res.fullCipherHex;

      const firstAesBlock = res.blocks[0];
      steps = (firstAesBlock?.rounds || []).map((rs, idx) => ({
        id: `aes-round-${idx}`,
        index: idx,
        title: `AES Round ${rs.round} (${rs.round === 0 ? 'Pre-Round' : rs.round === 10 ? 'Final Round' : 'Standard Round'})`,
        description: `SubBytes ➔ ShiftRows ➔ ${rs.round < 10 && rs.round > 0 ? 'MixColumns ➔ ' : ''}AddRoundKey`,
        operation: params.operation,
        input: rs.startState,
        output: rs.afterShiftRows,
        mathematicalExplanation: `Transformed 4x4 byte matrix over GF(2⁸) with irreducible polynomial m(x) = x⁸ + x⁴ + x³ + x + 1.`,
        visualData: rs,
      }));
      break;
    }

    case 'ecb':
    case 'cbc':
    case 'cfb':
    case 'ofb':
    case 'ctr': {
      const key = params.blockKey || 'SECRETK1';
      const iv = params.blockIv || 'INITVEC1';
      const res = processBlockCipher(params.operation, params.method, params.text, key, iv);
      outputResult = res.ciphertextHex;

      steps = res.steps.map((bs, idx) => ({
        id: `block-${idx}`,
        index: idx,
        title: `Block ${bs.blockIndex + 1}: '${bs.plaintextBlock}'`,
        description: bs.explanation,
        operation: params.operation,
        input: bs.plaintextBlock,
        output: bs.ciphertextBlock,
        mathematicalExplanation: `${params.method.toUpperCase()} step: Plain Hex: ${bs.plaintextHex}, Cipher Hex: ${bs.ciphertextHex}`,
        visualData: bs,
      }));
      break;
    }

    case 'rsa': {
      const p = params.rsaP ?? 61;
      const q = params.rsaQ ?? 53;
      const keyGen = generateEducationalRSA(p, q, params.rsaE);

      if (params.operation === 'encrypt') {
        const { cipherValues, steps: rsaSteps } = rsaEncrypt(params.text, keyGen.e, keyGen.n);
        outputResult = cipherValues.join(' ');
        steps = rsaSteps.map((st, idx) => ({
          id: `rsa-${idx}`,
          index: idx,
          title: `RSA Encrypt '${st.char}' (ASCII ${st.ascii}) ➔ ${st.cipherValue}`,
          description: `Public Key: (e = ${keyGen.e}, n = ${keyGen.n})`,
          operation: 'encrypt',
          input: st.char,
          output: st.cipherValue,
          mathematicalExplanation: st.formula,
          visualData: { ...st, n: keyGen.n, e: keyGen.e, d: keyGen.d },
        }));
      } else {
        const vals = params.rsaCipherValues || [100, 200, 300];
        const { text: decrypted, steps: rsaSteps } = rsaDecrypt(vals, keyGen.d, keyGen.n);
        outputResult = decrypted;
        steps = rsaSteps.map((st, idx) => ({
          id: `rsa-dec-${idx}`,
          index: idx,
          title: `RSA Decrypt Cipher ${st.cipherValue} ➔ '${st.decryptedChar}'`,
          description: `Private Key: (d = ${keyGen.d}, n = ${keyGen.n})`,
          operation: 'decrypt',
          input: st.cipherValue,
          output: st.decryptedChar,
          mathematicalExplanation: st.formula,
          visualData: { ...st, n: keyGen.n, d: keyGen.d },
        }));
      }
      break;
    }

    case 'diffie_hellman': {
      const p = params.dhPrime ?? 23;
      const g = params.dhGen ?? 5;
      const a = params.dhAlicePriv ?? 6;
      const b = params.dhBobPriv ?? 15;
      const dh = simulateDiffieHellman(p, g, a, b, true);
      outputResult = `Shared Secret: ${dh.aliceSharedSecret}`;

      steps = [
        {
          id: 'dh-1',
          index: 0,
          title: 'Public Domain Parameters',
          description: `Agreed public prime p = ${p}, generator g = ${g}`,
          operation: 'exchange',
          mathematicalExplanation: `g is a primitive root modulo p.`,
        },
        {
          id: 'dh-2',
          index: 1,
          title: 'Alice Computes Public Key A',
          description: `Alice chooses secret a = ${a}, computes A = g^a mod p = ${dh.alicePublic}`,
          operation: 'exchange',
          mathematicalExplanation: `A = ${g}^${a} mod ${p} = ${dh.alicePublic}`,
          output: dh.alicePublic,
        },
        {
          id: 'dh-3',
          index: 2,
          title: 'Bob Computes Public Key B',
          description: `Bob chooses secret b = ${b}, computes B = g^b mod p = ${dh.bobPublic}`,
          operation: 'exchange',
          mathematicalExplanation: `B = ${g}^${b} mod ${p} = ${dh.bobPublic}`,
          output: dh.bobPublic,
        },
        {
          id: 'dh-4',
          index: 3,
          title: 'Alice Computes Shared Secret S_A',
          description: `S_A = B^a mod p = ${dh.aliceSharedSecret}`,
          operation: 'exchange',
          mathematicalExplanation: `S_A = (${dh.bobPublic})^${a} mod ${p} = ${dh.aliceSharedSecret}`,
          output: dh.aliceSharedSecret,
        },
        {
          id: 'dh-5',
          index: 4,
          title: 'Bob Computes Shared Secret S_B',
          description: `S_B = A^b mod p = ${dh.bobSharedSecret}`,
          operation: 'exchange',
          mathematicalExplanation: `S_B = (${dh.alicePublic})^${b} mod ${p} = ${dh.bobSharedSecret}`,
          output: dh.bobSharedSecret,
        },
      ];
      break;
    }

    case 'sha256': {
      const hashRes = sha256Trace(params.text);
      outputResult = hashRes.finalDigestHex;

      steps = [
        {
          id: 'sha-pad',
          index: 0,
          title: 'Preprocessing & 512-bit Block Padding',
          description: `Input string (${hashRes.binaryLength} bits) padded to ${hashRes.totalBlocks} 512-bit block(s).`,
          operation: 'hash',
          input: params.text,
          output: hashRes.paddedHex.slice(0, 64) + '...',
          mathematicalExplanation: `Appended 1 bit (0x80), 0-bits, and 64-bit length integer. Total length: ${hashRes.totalBlocks * 512} bits.`,
        },
        ...hashRes.roundStepsSample.map((rs, idx) => ({
          id: `sha-round-${rs.round}`,
          index: idx + 1,
          title: `Compression Round ${rs.round} / 64`,
          description: `W[${rs.round}]: ${rs.W_t}, K[${rs.round}]: ${rs.K_t}`,
          operation: 'hash',
          output: rs.a + rs.b + rs.c + rs.d,
          mathematicalExplanation: `T1 = h + Σ1(e) + Ch(e,f,g) + K_t + W_t = ${rs.T1}; T2 = Σ0(a) + Maj(a,b,c) = ${rs.T2}`,
          visualData: rs,
        })),
        {
          id: 'sha-final',
          index: hashRes.roundStepsSample.length + 1,
          title: 'Final 256-bit Digest Assembly',
          description: 'Added compression variables into initial hash vector H[0..7].',
          operation: 'hash',
          output: hashRes.finalDigestHex,
          mathematicalExplanation: 'Concatenated H0 ∥ H1 ∥ H2 ∥ H3 ∥ H4 ∥ H5 ∥ H6 ∥ H7',
        },
      ];
      break;
    }

    case 'hmac': {
      const key = params.blockKey || 'SECRET_KEY_2026';
      const hmacRes = hmacSha256Trace(params.text, key);
      outputResult = hmacRes.hmacDigestHex;

      steps = hmacRes.steps.map((st, idx) => ({
        id: `hmac-${idx}`,
        index: idx,
        title: st.title,
        description: st.description,
        operation: 'hash',
        output: st.data,
        mathematicalExplanation: st.description,
      }));
      break;
    }

    case 'ecc': {
      const k = params.eccScalar ?? 7;
      const curve = DEFAULT_ECC_CURVE;
      const { result: pt, steps: ecSteps } = ecMultiply(k, curve.G, curve);
      outputResult = `Q = ${k} · G = (${pt.x}, ${pt.y})`;

      steps = ecSteps.map((st, idx) => ({
        id: `ecc-${idx}`,
        index: idx,
        title: `ECC Scalar Multiplication Step ${idx + 1}`,
        description: st,
        operation: 'exchange',
        mathematicalExplanation: `Elliptic curve y² ≡ x³ + ${curve.a}x + ${curve.b} (mod ${curve.p})`,
      }));
      break;
    }

    default:
      steps = [];
      outputResult = '';
  }

  const executionTime = performance.now() - startTime;

  return {
    algorithmId: params.method,
    algorithmName,
    operation: params.operation === 'decrypt' ? 'decrypt' : 'encrypt',
    input: params.text,
    output: outputResult,
    steps,
    executionTime,
    parameters: {
      keyA: params.keyA,
      keyB: params.keyB,
      vigenereKey: params.vigenereKey,
      playfairKey: params.playfairKey,
      hillMatrix: params.hillMatrix,
    },
  };
}
