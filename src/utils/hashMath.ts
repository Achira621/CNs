/**
 * SHA-256 & HMAC Cryptographic Hash Engine
 * Complete educational step-by-step execution trace generation
 * supporting both raw binary byte processing and string messages.
 */

export interface Sha256RoundStep {
  round: number;
  W_t: string;
  K_t: string;
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  f: string;
  g: string;
  h: string;
  T1: string;
  T2: string;
}

export interface Sha256TraceResult {
  message: string;
  binaryLength: number;
  paddedHex: string;
  totalBlocks: number;
  scheduleFirstBlock: string[]; // 64 words
  roundStepsSample: Sha256RoundStep[]; // Selected educational rounds (0, 1, 15, 31, 63)
  finalDigestHex: string;
}

export interface HmacTraceResult {
  message: string;
  key: string;
  normalizedKeyHex: string;
  ipadHex: string;
  opadHex: string;
  innerInputHex: string;
  innerHashHex: string;
  outerInputHex: string;
  hmacDigestHex: string;
  steps: {
    title: string;
    description: string;
    data: string;
  }[];
}

// SHA-256 initial hash values (first 32 bits of fractional parts of square roots of first 8 primes)
const H_INIT = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
];

// SHA-256 round constants (first 32 bits of fractional parts of cube roots of first 64 primes)
const K = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];

function rotr(n: number, b: number): number {
  return (n >>> b) | (n << (32 - b));
}

function ch(x: number, y: number, z: number): number {
  return (x & y) ^ (~x & z);
}

function maj(x: number, y: number, z: number): number {
  return (x & y) ^ (x & z) ^ (y & z);
}

function sigma0(x: number): number {
  return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22);
}

function sigma1(x: number): number {
  return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25);
}

function gamma0(x: number): number {
  return rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3);
}

function gamma1(x: number): number {
  return rotr(x, 17) ^ rotr(x, 19) ^ (x >>> 10);
}

function toHex32(n: number): string {
  return (n >>> 0).toString(16).padStart(8, '0');
}

/**
 * Step-by-step SHA-256 with execution trace
 */
export function sha256Trace(input: string | Uint8Array): Sha256TraceResult {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  const messageLabel = typeof input === 'string' ? input : `[Binary Bytes: ${bytes.length} bytes]`;
  const bitLength = bytes.length * 8;

  // Preprocessing and padding
  const paddingLength = (56 - ((bytes.length + 1) % 64) + 64) % 64;
  const totalLength = bytes.length + 1 + paddingLength + 8;
  const padded = new Uint8Array(totalLength);
  padded.set(bytes);
  padded[bytes.length] = 0x80;

  // Append length in bits as 64-bit big endian
  const view = new DataView(padded.buffer);
  view.setBigUint64(totalLength - 8, BigInt(bitLength), false);

  const paddedHex = Array.from(padded)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const numBlocks = totalLength / 64;
  const H = [...H_INIT];
  const roundStepsSample: Sha256RoundStep[] = [];
  let scheduleFirstBlock: string[] = [];

  for (let blockIdx = 0; blockIdx < numBlocks; blockIdx++) {
    const W = new Uint32Array(64);

    for (let t = 0; t < 16; t++) {
      W[t] = view.getUint32(blockIdx * 64 + t * 4, false);
    }

    for (let t = 16; t < 64; t++) {
      const s0 = gamma0(W[t - 15]);
      const s1 = gamma1(W[t - 2]);
      W[t] = ((W[t - 16] + s0) | 0) + ((W[t - 7] + s1) | 0);
    }

    if (blockIdx === 0) {
      scheduleFirstBlock = Array.from(W).map((w, idx) => `W[${idx}]: ${toHex32(w)}`);
    }

    let [a, b, c, d, e, f, g, h] = H;

    for (let t = 0; t < 64; t++) {
      const T1 = (((h + sigma1(e)) | 0) + ((ch(e, f, g) + K[t]) | 0) + W[t]) | 0;
      const T2 = (sigma0(a) + maj(a, b, c)) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + T1) | 0;
      d = c;
      c = b;
      b = a;
      a = (T1 + T2) | 0;

      if (blockIdx === 0 && [0, 1, 2, 7, 15, 31, 63].includes(t)) {
        roundStepsSample.push({
          round: t,
          W_t: toHex32(W[t]),
          K_t: toHex32(K[t]),
          a: toHex32(a),
          b: toHex32(b),
          c: toHex32(c),
          d: toHex32(d),
          e: toHex32(e),
          f: toHex32(f),
          g: toHex32(g),
          h: toHex32(h),
          T1: toHex32(T1),
          T2: toHex32(T2),
        });
      }
    }

    H[0] = (H[0] + a) | 0;
    H[1] = (H[1] + b) | 0;
    H[2] = (H[2] + c) | 0;
    H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0;
    H[5] = (H[5] + f) | 0;
    H[6] = (H[6] + g) | 0;
    H[7] = (H[7] + h) | 0;
  }

  const finalDigestHex = H.map(toHex32).join('');

  return {
    message: messageLabel,
    binaryLength: bitLength,
    paddedHex,
    totalBlocks: numBlocks,
    scheduleFirstBlock,
    roundStepsSample,
    finalDigestHex,
  };
}

export function sha256Pure(input: string | Uint8Array): string {
  return sha256Trace(input).finalDigestHex;
}

/**
 * Step-by-step HMAC-SHA256 execution trace
 */
export function hmacSha256Trace(message: string, key: string): HmacTraceResult {
  const BLOCK_SIZE = 64;
  const keyBytes = new TextEncoder().encode(key);
  let normalizedKey = new Uint8Array(BLOCK_SIZE);

  if (keyBytes.length > BLOCK_SIZE) {
    const hashed = sha256Trace(keyBytes).finalDigestHex;
    for (let i = 0; i < 32; i++) {
      normalizedKey[i] = parseInt(hashed.substring(i * 2, i * 2 + 2), 16);
    }
  } else {
    normalizedKey.set(keyBytes);
  }

  const kPadInner = new Uint8Array(BLOCK_SIZE);
  const kPadOuter = new Uint8Array(BLOCK_SIZE);
  for (let i = 0; i < BLOCK_SIZE; i++) {
    kPadInner[i] = normalizedKey[i] ^ 0x36;
    kPadOuter[i] = normalizedKey[i] ^ 0x5c;
  }

  const msgBytes = new TextEncoder().encode(message);
  const innerConcat = new Uint8Array(BLOCK_SIZE + msgBytes.length);
  innerConcat.set(kPadInner);
  innerConcat.set(msgBytes, BLOCK_SIZE);

  // Inner hash directly on raw bytes
  const innerHashHex = sha256Trace(innerConcat).finalDigestHex;
  const innerHashBytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    innerHashBytes[i] = parseInt(innerHashHex.substring(i * 2, i * 2 + 2), 16);
  }

  // Outer hash directly on raw bytes
  const outerConcat = new Uint8Array(BLOCK_SIZE + 32);
  outerConcat.set(kPadOuter);
  outerConcat.set(innerHashBytes, BLOCK_SIZE);
  const hmacDigestHex = sha256Trace(outerConcat).finalDigestHex;

  const toHex = (arr: Uint8Array) =>
    Array.from(arr)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

  return {
    message,
    key,
    normalizedKeyHex: toHex(normalizedKey),
    ipadHex: toHex(kPadInner),
    opadHex: toHex(kPadOuter),
    innerInputHex: toHex(innerConcat),
    innerHashHex,
    outerInputHex: toHex(outerConcat),
    hmacDigestHex,
    steps: [
      {
        title: 'Key Normalization (K₀)',
        description:
          'If key length > 64 bytes, hash with SHA-256; if shorter, pad with zeros up to 64 bytes.',
        data: toHex(normalizedKey),
      },
      {
        title: 'Inner Pad XOR (K₀ ⊕ ipad)',
        description: 'XOR normalized key with byte 0x36 repeated 64 times.',
        data: toHex(kPadInner),
      },
      {
        title: 'Inner Hash H((K₀ ⊕ ipad) ∥ m)',
        description: 'Concatenate inner padded key with the input message and compute SHA-256.',
        data: innerHashHex,
      },
      {
        title: 'Outer Pad XOR (K₀ ⊕ opad)',
        description: 'XOR normalized key with byte 0x5C repeated 64 times.',
        data: toHex(kPadOuter),
      },
      {
        title: 'Outer Hash H((K₀ ⊕ opad) ∥ InnerHash)',
        description: 'Concatenate outer padded key with inner hash output and compute final SHA-256 HMAC digest.',
        data: hmacDigestHex,
      },
    ],
  };
}
