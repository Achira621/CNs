import { generateAlgorithmTrace } from '../src/utils/tracingEngine';
import { generateEducationalRSA, simulateDiffieHellman } from '../src/utils/asymmetricMath';
import { sha256Pure, hmacSha256Trace } from '../src/utils/hashMath';

console.log('--- Testing Cryptography Core & Tracing Engine ---');

// 1. Test Affine Trace
const affineTrace = generateAlgorithmTrace({
  method: 'affine',
  operation: 'encrypt',
  text: 'HELLO',
  keyA: 5,
  keyB: 8,
});
console.log('Affine Trace Output:', affineTrace.output, 'Steps:', affineTrace.steps.length);
if (affineTrace.output !== 'RCLLA') {
  throw new Error(`Expected RCLLA, got ${affineTrace.output}`);
}

// 2. Test Vigenere Trace
const vigTrace = generateAlgorithmTrace({
  method: 'vigenere',
  operation: 'encrypt',
  text: 'ATTACKATDAWN',
  vigenereKey: 'LEMON',
});
console.log('Vigenere Trace Output:', vigTrace.output, 'Steps:', vigTrace.steps.length);

// 3. Test RSA Math
const rsaKey = generateEducationalRSA(61, 53, 17);
console.log('RSA Keys generated:', { n: rsaKey.n, phi: rsaKey.phi, e: rsaKey.e, d: rsaKey.d });
if (rsaKey.n !== 3233 || rsaKey.phi !== 3120 || (rsaKey.e * rsaKey.d) % rsaKey.phi !== 1) {
  throw new Error('RSA key calculation invalid!');
}

const rsaTrace = generateAlgorithmTrace({
  method: 'rsa',
  operation: 'encrypt',
  text: 'HI',
  rsaP: 61,
  rsaQ: 53,
  rsaE: 17,
});
console.log('RSA Trace Output:', rsaTrace.output, 'Steps:', rsaTrace.steps.length);

// 4. Test Diffie-Hellman
const dh = simulateDiffieHellman(23, 5, 6, 15, true);
console.log('DH Exchange:', { AliceSecret: dh.aliceSharedSecret, BobSecret: dh.bobSharedSecret, Match: dh.isMatch });
if (!dh.isMatch || dh.aliceSharedSecret !== 2) {
  throw new Error(`Diffie-Hellman secret mismatch or incorrect: got ${dh.aliceSharedSecret}`);
}

// 5. Test SHA-256
const digest = sha256Pure('abc');
console.log('SHA-256("abc"):', digest);
// Known NIST standard vector: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
if (digest !== 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad') {
  throw new Error(`SHA-256 test vector mismatch: got ${digest}`);
}

// 6. Test HMAC
const hmac = hmacSha256Trace('The quick brown fox jumps over the lazy dog', 'key');
console.log('HMAC-SHA256 output:', hmac.hmacDigestHex);
// Known vector: f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8
if (hmac.hmacDigestHex !== 'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8') {
  throw new Error(`HMAC-SHA256 vector mismatch: got ${hmac.hmacDigestHex}`);
}

console.log('✅ ALL ALGORITHM TESTS PASSED SUCCESSFULLY!');
