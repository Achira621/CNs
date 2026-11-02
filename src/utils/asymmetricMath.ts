/**
 * Asymmetric Cryptography & Public-Key Mathematics Engine
 * Implements RSA, Diffie-Hellman Key Exchange, and Elliptic Curve Cryptography (ECC)
 * Both educational small-number stepping and WebCrypto standard modes.
 */

export interface RSAKeyGenerationResult {
  p: number;
  q: number;
  n: number;
  phi: number;
  e: number;
  d: number;
  isValid: boolean;
  error?: string;
  steps: {
    title: string;
    description: string;
    formula: string;
    result: string;
  }[];
}

export interface RSAStep {
  char: string;
  ascii: number;
  cipherValue: number;
  decryptedValue?: number;
  decryptedChar?: string;
  formula: string;
}

export interface DiffieHellmanResult {
  p: number;
  g: number;
  alicePrivate: number;
  bobPrivate: number;
  alicePublic: number;
  bobPublic: number;
  aliceSharedSecret: number;
  bobSharedSecret: number;
  isMatch: boolean;
  mitmSimulation?: {
    evePrivate: number;
    evePublicToBob: number;
    evePublicToAlice: number;
    eveAliceShared: number;
    eveBobShared: number;
    compromised: boolean;
  };
}

export interface ECPoint {
  x: number;
  y: number;
  isInfinity?: boolean;
}

export interface ECCurve {
  a: number;
  b: number;
  p: number;
  G: ECPoint;
  order?: number;
}

/**
 * Standard prime checking
 */
export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * Greatest common divisor
 */
export function gcdBigInt(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y > 0n) {
    const temp = y;
    y = x % y;
    x = temp;
  }
  return x;
}

/**
 * Modular inverse using Extended Euclidean Algorithm for BigInt
 */
export function modInverseBigInt(a: bigint, m: bigint): bigint {
  let [oldR, r] = [a, m];
  let [oldS, s] = [1n, 0n];

  while (r !== 0n) {
    const quotient = oldR / r;
    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
  }

  if (oldR !== 1n) {
    throw new Error(`Inverse does not exist for ${a} mod ${m}`);
  }

  return (oldS % m + m) % m;
}

/**
 * Modular exponentiation (base^exp mod mod)
 */
export function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === 1n) return 0n;
  let result = 1n;
  let b = (base % mod + mod) % mod;
  let e = exp;

  while (e > 0n) {
    if (e % 2n === 1n) {
      result = (result * b) % mod;
    }
    b = (b * b) % mod;
    e = e / 2n;
  }
  return result;
}

// ----------------------------------------------------------------------
// RSA IMPLEMENTATION
// ----------------------------------------------------------------------

export function generateEducationalRSA(p: number, q: number, chosenE?: number): RSAKeyGenerationResult {
  const steps: RSAKeyGenerationResult['steps'] = [];

  if (!isPrime(p)) {
    return { p, q, n: 0, phi: 0, e: 0, d: 0, isValid: false, error: `p (${p}) must be a prime number.`, steps };
  }
  if (!isPrime(q)) {
    return { p, q, n: 0, phi: 0, e: 0, d: 0, isValid: false, error: `q (${q}) must be a prime number.`, steps };
  }
  if (p === q) {
    return { p, q, n: 0, phi: 0, e: 0, d: 0, isValid: false, error: `p and q must be distinct primes.`, steps };
  }

  // Step 1: Modulus n
  const n = p * q;
  steps.push({
    title: 'Calculate Modulus n',
    description: 'n is the public modulus used as the modulus for both the public and private keys. Its factorization difficulty guarantees RSA security.',
    formula: 'n = p · q',
    result: `n = ${p} · ${q} = ${n}`,
  });

  // Step 2: Euler Totient phi(n)
  const phi = (p - 1) * (q - 1);
  steps.push({
    title: "Compute Euler's Totient φ(n)",
    description: 'Counts positive integers up to n that are relatively prime to n.',
    formula: 'φ(n) = (p - 1) · (q - 1)',
    result: `φ(${n}) = (${p} - 1) · (${q} - 1) = ${phi}`,
  });

  // Step 3: Public exponent e
  const candidatesE = [3, 5, 7, 17, 65537, 11, 13, 19, 23, 29, 31];
  let e = chosenE || 0;
  if (!e || e <= 1 || e >= phi || gcdBigInt(BigInt(e), BigInt(phi)) !== 1n) {
    const validCandidate = candidatesE.find((cand) => cand < phi && gcdBigInt(BigInt(cand), BigInt(phi)) === 1n);
    e = validCandidate || 3;
  }

  steps.push({
    title: 'Select Public Exponent e',
    description: 'e must be coprime to φ(n), i.e., gcd(e, φ(n)) = 1, and 1 < e < φ(n).',
    formula: 'gcd(e, φ(n)) = 1',
    result: `e = ${e} (gcd(${e}, ${phi}) = 1)`,
  });

  // Step 4: Private exponent d
  let d = 0;
  try {
    d = Number(modInverseBigInt(BigInt(e), BigInt(phi)));
  } catch {
    return { p, q, n, phi, e, d: 0, isValid: false, error: `Failed to compute modular inverse for e=${e} mod ${phi}`, steps };
  }

  steps.push({
    title: 'Derive Private Exponent d',
    description: 'd is the modular multiplicative inverse of e modulo φ(n). This is the secret trapdoor key.',
    formula: 'd · e ≡ 1 (mod φ(n))  ➔  d = e⁻¹ mod φ(n)',
    result: `d = ${d} (since (${d} · ${e}) mod ${phi} = ${(d * e) % phi})`,
  });

  return { p, q, n, phi, e, d, isValid: true, steps };
}

export function rsaEncrypt(text: string, e: number, n: number): { cipherValues: number[]; steps: RSAStep[] } {
  const cipherValues: number[] = [];
  const steps: RSAStep[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const m = char.charCodeAt(0);
    const c = Number(modPow(BigInt(m), BigInt(e), BigInt(n)));
    cipherValues.push(c);
    steps.push({
      char,
      ascii: m,
      cipherValue: c,
      formula: `C = (${m})^${e} mod ${n} = ${c}`,
    });
  }

  return { cipherValues, steps };
}

export function rsaDecrypt(cipherValues: number[], d: number, n: number): { text: string; steps: RSAStep[] } {
  let text = '';
  const steps: RSAStep[] = [];

  for (let i = 0; i < cipherValues.length; i++) {
    const c = cipherValues[i];
    const m = Number(modPow(BigInt(c), BigInt(d), BigInt(n)));
    const char = String.fromCharCode(m);
    text += char;
    steps.push({
      char,
      ascii: m,
      cipherValue: c,
      decryptedValue: m,
      decryptedChar: char,
      formula: `M = (${c})^${d} mod ${n} = ${m} ('${char}')`,
    });
  }

  return { text, steps };
}

// ----------------------------------------------------------------------
// DIFFIE-HELLMAN KEY EXCHANGE
// ----------------------------------------------------------------------

export function simulateDiffieHellman(
  p: number,
  g: number,
  alicePrivate: number,
  bobPrivate: number,
  simulateMitm = false,
  evePrivate = 15
): DiffieHellmanResult {
  const pBig = BigInt(p);
  const gBig = BigInt(g);

  // Alice computes A = g^a mod p
  const alicePublic = Number(modPow(gBig, BigInt(alicePrivate), pBig));

  // Bob computes B = g^b mod p
  const bobPublic = Number(modPow(gBig, BigInt(bobPrivate), pBig));

  // Honest Exchange
  // Alice computes S_A = B^a mod p
  const aliceSharedSecret = Number(modPow(BigInt(bobPublic), BigInt(alicePrivate), pBig));

  // Bob computes S_B = A^b mod p
  const bobSharedSecret = Number(modPow(BigInt(alicePublic), BigInt(bobPrivate), pBig));

  const result: DiffieHellmanResult = {
    p,
    g,
    alicePrivate,
    bobPrivate,
    alicePublic,
    bobPublic,
    aliceSharedSecret,
    bobSharedSecret,
    isMatch: aliceSharedSecret === bobSharedSecret,
  };

  if (simulateMitm) {
    // Eve intercepts and substitutes her own public keys
    const evePublic = Number(modPow(gBig, BigInt(evePrivate), pBig));

    // Alice computes shared key with Eve's public key
    const eveAliceShared = Number(modPow(BigInt(evePublic), BigInt(alicePrivate), pBig));

    // Bob computes shared key with Eve's public key
    const eveBobShared = Number(modPow(BigInt(evePublic), BigInt(bobPrivate), pBig));

    result.mitmSimulation = {
      evePrivate,
      evePublicToBob: evePublic,
      evePublicToAlice: evePublic,
      eveAliceShared,
      eveBobShared,
      compromised: true,
    };
  }

  return result;
}

// ----------------------------------------------------------------------
// ELLIPTIC CURVE CRYPTOGRAPHY (ECC)
// ----------------------------------------------------------------------

// Standard educational curve: y^2 = x^3 + ax + b mod p
// Default parameters: a = 2, b = 3, p = 97, G = (3, 6)
export const DEFAULT_ECC_CURVE: ECCurve = {
  a: 2,
  b: 3,
  p: 97,
  G: { x: 3, y: 6 },
};

/**
 * Checks if a point satisfies y^2 = x^3 + ax + b mod p
 */
export function isPointOnCurve(pt: ECPoint, curve: ECCurve): boolean {
  if (pt.isInfinity) return true;
  const left = (pt.y * pt.y) % curve.p;
  const right = (pt.x * pt.x * pt.x + curve.a * pt.x + curve.b) % curve.p;
  return (left + curve.p) % curve.p === (right + curve.p) % curve.p;
}

/**
 * Modular inverse for integer mod p
 */
function modInv(val: number, mod: number): number {
  val = ((val % mod) + mod) % mod;
  for (let x = 1; x < mod; x++) {
    if ((val * x) % mod === 1) return x;
  }
  throw new Error(`Inverse not found for ${val} mod ${mod}`);
}

/**
 * Point addition P + Q on elliptic curve
 */
export function ecAdd(P: ECPoint, Q: ECPoint, curve: ECCurve): ECPoint {
  if (P.isInfinity) return Q;
  if (Q.isInfinity) return P;

  const { a, p } = curve;

  // If P = -Q (reflection across x-axis), P + Q = O (Point at Infinity)
  if (P.x === Q.x && (P.y !== Q.y || P.y === 0)) {
    return { x: 0, y: 0, isInfinity: true };
  }

  let lambda: number;
  if (P.x === Q.x && P.y === Q.y) {
    // Point Doubling: λ = (3x₁² + a) / (2y₁) mod p
    const num = (3 * P.x * P.x + a) % p;
    const den = (2 * P.y) % p;
    lambda = ((num * modInv(den, p)) % p + p) % p;
  } else {
    // Point Addition: λ = (y₂ - y₁) / (x₂ - x₁) mod p
    const num = (Q.y - P.y) % p;
    const den = (Q.x - P.x) % p;
    lambda = ((num * modInv(den, p)) % p + p) % p;
  }

  // x₃ = λ² - x₁ - x₂ mod p
  const x3 = ((lambda * lambda - P.x - Q.x) % p + p) % p;
  // y₃ = λ(x₁ - x₃) - y₁ mod p
  const y3 = ((lambda * (P.x - x3) - P.y) % p + p) % p;

  return { x: x3, y: y3 };
}

/**
 * Scalar multiplication k · P using Double-and-Add
 */
export function ecMultiply(k: number, P: ECPoint, curve: ECCurve): { result: ECPoint; steps: string[] } {
  const steps: string[] = [];
  let current: ECPoint = { x: 0, y: 0, isInfinity: true };
  let addend = P;
  let scalar = k;

  steps.push(`Computing ${k} · (${P.x}, ${P.y}) via Double-and-Add.`);

  let bitIndex = 0;
  while (scalar > 0) {
    if (scalar & 1) {
      current = ecAdd(current, addend, curve);
      steps.push(
        `Bit ${bitIndex} = 1: Added point ➔ (${current.x}, ${current.y})`
      );
    }
    addend = ecAdd(addend, addend, curve);
    scalar >>= 1;
    bitIndex++;
  }

  return { result: current, steps };
}
