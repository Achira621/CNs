import { Lesson } from '../types';

export const MASTERCLASS_LESSONS: Lesson[] = [
  {
    id: 'intro',
    title: 'Lesson 1: Introduction to Affine Cipher',
    subtitle: 'Learn the fundamentals of mathematical monoalphabetic substitution',
    iconName: 'BookOpen',
    sections: [
      {
        heading: 'What is the Affine Cipher?',
        content: `The **Affine Cipher** is a classical monoalphabetic substitution cipher where each letter in an alphabet is mapped to its numerical equivalent, encrypted using a simple mathematical linear function, and converted back to a letter.

Letters $A..Z$ are mapped to numbers $0..25$:
- $A = 0, B = 1, C = 2, \\dots, Z = 25$

The encryption formula is:
$$E(x) = (a \\cdot x + b) \\pmod{26}$$

Where:
- $x$ is the 0-based index of the plaintext letter
- $a$ is the **multiplicative key** (slope)
- $b$ is the **additive key** (shift)
- $26$ is the length of the English alphabet`,
      },
      {
        heading: 'Connection to Caesar Cipher & Atbash',
        content: `Notice that famous classical ciphers are actually special instances of the Affine Cipher:
1. **Caesar Cipher**: Set $a = 1$. The formula becomes $E(x) = (x + b) \\pmod{26}$.
2. **Atbash Cipher**: Set $a = 25$ and $b = 25$. The formula becomes $E(x) = (25x + 25) \\pmod{26} \\equiv (25 - x) \\pmod{26}$, which reverses the alphabet ($A \\to Z, B \\to Y$).
3. **ROT13**: Caesar cipher with shift $b = 13$ ($a = 1, b = 13$).`,
        interactiveWidget: 'mini-encoder',
      },
    ],
    quiz: [
      {
        id: 'q1_1',
        question: 'What happens in the Affine Cipher formula E(x) = (a*x + b) mod 26 when key a = 1?',
        options: [
          'It becomes the Vigenère Cipher',
          'It becomes the Caesar Cipher',
          'It becomes an invalid cipher',
          'It reverses all letters'
        ],
        correctIndex: 1,
        explanation: 'When a = 1, E(x) simplifies to (1*x + b) mod 26 = (x + b) mod 26, which is exactly the Caesar shift cipher!',
      },
      {
        id: 'q1_2',
        question: 'What numerical index corresponds to the letter "E" in standard 0-indexed alphabet?',
        options: ['4', '5', '3', '6'],
        correctIndex: 0,
        explanation: 'A=0, B=1, C=2, D=3, E=4.',
      },
    ],
  },
  {
    id: 'coprimality',
    title: 'Lesson 2: Coprimality & Valid Keys',
    subtitle: 'Why Key "a" MUST be coprime to 26',
    iconName: 'ShieldAlert',
    sections: [
      {
        heading: 'The Great Coprimality Requirement',
        content: `Unlike key $b$ (which can be any integer from $0$ to $25$), key $a$ **CANNOT** be just any random number!

Key $a$ must be **coprime** to the alphabet size $m$ ($m = 26$). That means:
$$\\gcd(a, 26) = 1$$

Two numbers are coprime if their Greatest Common Divisor is $1$.`,
      },
      {
        heading: 'Why Invalid Keys Break Encryption',
        content: `If $\\gcd(a, 26) \\neq 1$, then key $a$ shares a common divisor with 26 (like $2$ or $13$). 

This causes **collisions**: multiple distinct plaintext letters map to the exact same ciphertext letter! Once information is lost, it is mathematically impossible to decrypt uniquely.

For $m = 26$, there are only **12 valid choices for key $a$**:
$$a \\in \\{1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25\\}$$`,
        interactiveWidget: 'coprime-checker',
      },
    ],
    quiz: [
      {
        id: 'q2_1',
        question: 'Which of the following values for key "a" is INVALID for mod 26?',
        options: ['a = 5', 'a = 7', 'a = 4', 'a = 9'],
        correctIndex: 2,
        explanation: 'gcd(4, 26) = 2 ≠ 1. Because 4 shares factor 2 with 26, key a = 4 is invalid.',
      },
      {
        id: 'q2_2',
        question: 'How many total valid choices for key "a" exist when m = 26?',
        options: ['26', '13', '12', '25'],
        correctIndex: 2,
        explanation: 'There are exactly 12 numbers between 1 and 25 that are coprime to 26 (given by Euler\'s totient function φ(26) = 12).',
      },
    ],
  },
  {
    id: 'decryption',
    title: 'Lesson 3: Decryption & Modular Multiplicative Inverse',
    subtitle: 'Reversing the encryption step using a⁻¹',
    iconName: 'KeyRound',
    sections: [
      {
        heading: 'The Decryption Formula',
        content: `To reverse $y = (a \\cdot x + b) \\pmod{26}$, we must isolate $x$:
$$y - b \\equiv a \\cdot x \\pmod{26}$$

To divide by $a$ in modular arithmetic, we multiply by $a$\'s **modular multiplicative inverse** ($a^{-1}$):
$$D(y) = a^{-1} \\cdot (y - b) \\pmod{26}$$`,
      },
      {
        heading: 'What is a Modular Inverse?',
        content: `The modular inverse $a^{-1}$ is the integer such that:
$$(a \\cdot a^{-1}) \\equiv 1 \\pmod{26}$$

Example:
- If $a = 5$, then $a^{-1} = 21$ because $5 \\times 21 = 105 = 4 \\times 26 + 1 \\equiv 1 \\pmod{26}$.
- If $a = 7$, then $a^{-1} = 15$ because $7 \\times 15 = 105 \\equiv 1 \\pmod{26}$.

We find $a^{-1}$ using the **Extended Euclidean Algorithm**.`,
        interactiveWidget: 'inverse-calculator',
      },
    ],
    quiz: [
      {
        id: 'q3_1',
        question: 'If key a = 3, what is its modular multiplicative inverse a⁻¹ mod 26?',
        options: ['a⁻¹ = 9', 'a⁻¹ = 3', 'a⁻¹ = 15', 'a⁻¹ = 21'],
        correctIndex: 0,
        explanation: '3 * 9 = 27 = 26 + 1 ≡ 1 mod 26. Therefore, the modular inverse of 3 mod 26 is 9.',
      },
      {
        id: 'q3_2',
        question: 'What algorithm is efficiently used to find the modular inverse of two numbers?',
        options: [
          'Dijkstra\'s Algorithm',
          'Extended Euclidean Algorithm',
          'Binary Search Algorithm',
          'Fourier Transform'
        ],
        correctIndex: 1,
        explanation: 'The Extended Euclidean Algorithm computes integers x and y such that a*x + b*y = gcd(a, b), yielding the modular inverse when gcd = 1.',
      },
    ],
  },
  {
    id: 'cryptanalysis',
    title: 'Lesson 4: Cryptanalysis & Breaking the Cipher',
    subtitle: 'How cryptanalysts break Affine Ciphers easily',
    iconName: 'Unlock',
    sections: [
      {
        heading: '1. Brute Force Key Search',
        content: `The Affine Cipher has an extremely small key space:
- 12 valid values for $a$
- 26 possible values for $b$
- Total keys = $12 \\times 26 = 312$ total key pairs!

Computers can check all 312 keys in less than 1 millisecond by scoring the resulting decrypted text against English letter frequencies.`,
      },
      {
        heading: '2. Known-Plaintext Attack',
        content: `Because the Affine Cipher is monoalphabetic, knowing just **TWO plaintext letters** and their corresponding ciphertext letters allows an attacker to set up a system of two linear modular equations:

$$y_1 \\equiv a \\cdot x_1 + b \\pmod{26}$$
$$y_2 \\equiv a \\cdot x_2 + b \\pmod{26}$$

Subtracting equations:
$$y_1 - y_2 \\equiv a \\cdot (x_1 - x_2) \\pmod{26}$$

If $\\gcd(x_1 - x_2, 26) = 1$, we multiply by $(x_1 - x_2)^{-1}$ to find $a$, then calculate $b = y_1 - a \\cdot x_1 \\pmod{26}$. Cipher broken!`,
        interactiveWidget: 'equation-solver',
      },
    ],
    quiz: [
      {
        id: 'q4_1',
        question: 'How many total possible key pairs (a, b) exist for the Affine Cipher on standard English alphabet (m=26)?',
        options: ['676', '312', '52', '1024'],
        correctIndex: 1,
        explanation: 'There are 12 valid coprime choices for a, and 26 choices for b. 12 * 26 = 312 total key pairs.',
      },
      {
        id: 'q4_2',
        question: 'How many known plaintext-ciphertext letter pairs are needed to uniquely solve for keys (a, b)?',
        options: ['1 pair', '2 pairs', '5 pairs', '10 pairs'],
        correctIndex: 1,
        explanation: 'Two distinct letter pairs yield two linear equations in two unknowns (a and b), allowing exact mathematical solution.',
      },
    ],
  },
  {
    id: 'des_feistel',
    title: 'Lesson 5: DES & The Feistel Network Architecture',
    subtitle: '64-bit Block Cipher, 16 Rounds, and S-Box Non-Linearity',
    iconName: 'ShieldAlert',
    sections: [
      {
        heading: 'Feistel Cipher Network Structure',
        content: `The **Data Encryption Standard (DES)** was developed by IBM and standardized by NIST in 1977. It operates on **64-bit plaintext blocks** using a **56-bit secret key** (64 bits with 8 parity bits).

The 64-bit block is split into two 32-bit halves: **Left ($L$)** and **Right ($R$)**.
For each of the 16 rounds:
$$L_i = R_{i-1}$$
$$R_i = L_{i-1} \\oplus F(R_{i-1}, K_i)$$

Where:
- $F(R, K)$ is the Feistel round function
- $K_i$ is the 48-bit subkey derived from the 56-bit key schedule`,
      },
      {
        heading: 'The Feistel F-Function & S-Boxes',
        content: `Inside the $F(R, K)$ function:
1. **Expansion ($E$)**: Expands 32 bits of $R$ into 48 bits.
2. **XOR with Subkey**: $E(R) \\oplus K_i$ (48 bits).
3. **8 S-Boxes ($S_1 \\dots S_8$)**: The **ONLY non-linear** component of DES! Each S-box takes 6 input bits (bits 1 & 6 select row 0-3; bits 2-5 select column 0-15) and outputs 4 bits (48 bits $\\to$ 32 bits).
4. **Permutation ($P$)**: Permutes the 32 bits before XORing with $L$.`,
        interactiveWidget: 'des-feistel',
      },
    ],
    quiz: [
      {
        id: 'q5_1',
        question: 'What is the ONLY non-linear component in the DES encryption algorithm?',
        options: [
          'Initial Permutation (IP)',
          'Expansion Permutation (E)',
          'The 8 Substitution Boxes (S-Boxes)',
          'Permutation P'
        ],
        correctIndex: 2,
        explanation: 'The S-boxes provide confusion and non-linearity. All other operations (IP, FP, E, P, XOR) are purely linear!',
      },
      {
        id: 'q5_2',
        question: 'What is the effective key length of standard DES without parity bits?',
        options: ['64 bits', '56 bits', '128 bits', '48 bits'],
        correctIndex: 1,
        explanation: 'DES keys are 64 bits, but 8 bits are parity check bits, leaving an effective security key length of only 56 bits.',
      },
    ],
  },
  {
    id: 'twodes_mitm',
    title: 'Lesson 6: 2DES & The Meet-in-the-Middle Attack',
    subtitle: 'Why Double Encryption does NOT double security',
    iconName: 'Unlock',
    sections: [
      {
        heading: 'The Cascading Double DES (2DES) Pipeline',
        content: `To overcome the short 56-bit key length of DES, engineers proposed cascading two DES encryptions with two independent 56-bit keys ($K_1, K_2$), totaling **112 bits**:

$$C = E_{K2}(E_{K1}(P))$$

- **Stage 1**: Encrypt plaintext $P$ with $K_1$ to create intermediate block $M = E_{K1}(P)$.
- **Stage 2**: Encrypt intermediate $M$ with $K_2$ to generate ciphertext $C = E_{K2}(M)$.

Intuitively, an attacker would need to brute-force $2^{56} \\times 2^{56} = 2^{112}$ keys. However, **this intuition is fatally flawed!**`,
      },
      {
        heading: 'Diffie & Hellman\'s Meet-in-the-Middle (MITM) Attack',
        content: `In 1977, Whitfield Diffie and Martin Hellman proved that 2DES is vulnerable to a **Meet-in-the-Middle attack**:

Since $C = E_{K2}(E_{K1}(P))$, decrypting both sides with $K_2$ yields:
$$D_{K2}(C) = E_{K1}(P) = M$$

**Attack Procedure:**
1. Given a known pair $(P, C)$, compute $E_{K1}(P)$ for all $2^{56}$ possible values of $K_1$, and store $(M, K_1)$ in a hash table.
2. For each of the $2^{56}$ possible values of $K_2$, compute $D_{K2}(C)$ and check if the result exists in the hash table!
3. If a match is found ($E_{K1}(P) = D_{K2}(C)$), test candidate pair $(K_1, K_2)$ on a second plaintext-ciphertext block.

**Complexity Collapse:**
- Brute Force: $2^{112}$ operations.
- MITM Attack: $2^{56} + 2^{56} = 2^{57}$ operations and $2^{56}$ memory!
2DES provides only **57-bit effective security**, barely more than single DES!`,
        interactiveWidget: '2des-mitm',
      },
    ],
    quiz: [
      {
        id: 'q6_1',
        question: 'What is the time complexity of the Meet-in-the-Middle attack on Double DES?',
        options: ['2¹¹² operations', '2⁵⁷ operations', '2⁶⁴ operations', '2⁸⁰ operations'],
        correctIndex: 1,
        explanation: '2⁵⁶ encryptions to build table + 2⁵⁶ decryptions to match = 2 * 2⁵⁶ = 2⁵⁷ operations.',
      },
      {
        id: 'q6_2',
        question: 'What critical equation enables the Meet-in-the-Middle attack?',
        options: [
          'E_K1(P) = D_K2(C)',
          'E_K1(P) = E_K2(C)',
          'P ⊕ K1 = C ⊕ K2',
          'D_K1(P) = E_K2(C)'
        ],
        correctIndex: 0,
        explanation: 'C = E_K2(E_K1(P)) implies D_K2(C) = E_K1(P). The intermediate state M can be met in the middle from both sides.',
      },
    ],
  },
  {
    id: 'threedes_ede',
    title: 'Lesson 7: 3DES (Triple DES) & EDE Architecture',
    subtitle: 'Triple DES Pipeline, Backward Compatibility, and Sweet32',
    iconName: 'KeyRound',
    sections: [
      {
        heading: 'Why EDE Mode (Encrypt-Decrypt-Encrypt)?',
        content: `Because 2DES was broken by MITM attacks, cryptographers designed **Triple DES (3DES / TDEA)** using 3 stages:

$$C = E_{K3}(D_{K2}(E_{K1}(P)))$$

Notice that Stage 2 uses **Decryption ($D_{K2}$)** instead of Encryption! Why?

**The Brilliant Backward Compatibility Property:**
If an organization wants to communicate with legacy systems using Single DES, they simply set all three keys equal: $K_1 = K_2 = K_3 = K$:
$$C = E_K(D_K(E_K(P))) = E_K(P)$$
The second stage $D_K$ cleanly cancels the first stage $E_K$, seamlessly turning 3DES into Single DES without changing hardware or software pipelines!`,
      },
      {
        heading: 'Keying Options & Sweet32 Attack',
        content: `**3DES Keying Options:**
- **Keying Option 1 (3-Key 3DES)**: $K_1 \\neq K_2 \\neq K_3$ (168-bit key length, 112-bit effective security against MITM).
- **Keying Option 2 (2-Key 3DES)**: $K_1 = K_3 \\neq K_2$ (112-bit key length, 80-bit effective security).
- **Keying Option 3 (Single DES)**: $K_1 = K_2 = K_3$ (56-bit key length).

**Why NIST Deprecated 3DES:**
Although 3-Key 3DES has 112 bits of security against key searches, its **64-bit block size** is vulnerable to the **Sweet32 attack** (birthday paradox creates block collisions after only $2^{32} \\approx 4$ billion blocks / 32 GB of data in CBC mode).`,
        interactiveWidget: '3des-ede',
      },
    ],
    quiz: [
      {
        id: 'q7_1',
        question: 'Why does 3DES use Encrypt-Decrypt-Encrypt (EDE) instead of Encrypt-Encrypt-Encrypt (EEE)?',
        options: [
          'To run faster on microchips',
          'To maintain backward compatibility with Single DES when K1 = K2 = K3',
          'To prevent memory leaks',
          'To double the block size'
        ],
        correctIndex: 1,
        explanation: 'When K1 = K2 = K3, E_K(D_K(E_K(P))) = E_K(P). Decryption in stage 2 cancels stage 1, reverting exactly to single DES.',
      },
      {
        id: 'q7_2',
        question: 'What effective security level does 3-Key 3DES provide against Meet-in-the-Middle attack?',
        options: ['168 bits', '112 bits', '56 bits', '128 bits'],
        correctIndex: 1,
        explanation: 'Due to Meet-in-the-Middle attacks on the 3 stages, 3-Key 3DES has an effective security level of 112 bits (not 168 bits).',
      },
    ],
  },
  {
    id: 'aes_mastery',
    title: 'Lesson 8: AES (Advanced Encryption Standard - Rijndael)',
    subtitle: '128-bit State Matrix, Galois Field GF(2⁸), and 4 Transformation Rounds',
    iconName: 'BookOpen',
    sections: [
      {
        heading: 'Architecture of AES (Rijndael)',
        content: `In 2001, NIST selected the **Rijndael** algorithm as the **Advanced Encryption Standard (AES - FIPS 197)** to replace DES.

Key characteristics:
- **Block Size**: Strictly **128 bits** (16 bytes), represented as a **$4 \\times 4$ State Matrix** of bytes.
- **Key Sizes & Rounds**:
  - AES-128: 128-bit key $\\implies$ **10 rounds**
  - AES-192: 192-bit key $\\implies$ **12 rounds**
  - AES-256: 256-bit key $\\implies$ **14 rounds**
- Non-Feistel Substitution-Permutation Network (SPN): every round transforms the entire 128-bit block in parallel!`,
      },
      {
        heading: 'The 4 Round Transformations',
        content: `Each round (except Round 0 and Final Round) applies 4 mathematical transformations:

1. **SubBytes (Non-linear Confusion)**: Each byte in the state is replaced with its S-Box equivalent (computed by multiplicative inverse in Galois Field $GF(2^8)$ followed by an affine transformation).
2. **ShiftRows (Permutation Diffusion)**: Row 0 shifted 0 bytes, Row 1 shifted 1 byte left, Row 2 shifted 2 bytes left, Row 3 shifted 3 bytes left.
3. **MixColumns (Linear Diffusion over $GF(2^8)$)**: Each column is multiplied by fixed matrix modulo $x^8 + x^4 + x^3 + x + 1$ ($0\\text{x}11B$).
4. **AddRoundKey (Key Injection)**: XORs the 128-bit state with the 128-bit round key.

**Final Round Special Rule:** The final round **OMITS MixColumns**! This design choice ensures encryption and decryption share symmetric hardware layout!`,
        interactiveWidget: 'aes-state',
      },
    ],
    quiz: [
      {
        id: 'q8_1',
        question: 'Which transformation is intentionally OMITTED in the final round of AES encryption?',
        options: ['SubBytes', 'ShiftRows', 'MixColumns', 'AddRoundKey'],
        correctIndex: 2,
        explanation: 'MixColumns is omitted in the final round (Round 10/12/14) to maintain symmetry and efficiency in the decryption pipeline.',
      },
      {
        id: 'q8_2',
        question: 'In AES-128, how many total rounds are executed?',
        options: ['16 rounds', '10 rounds', '12 rounds', '14 rounds'],
        correctIndex: 1,
        explanation: 'AES-128 executes 10 rounds; AES-192 executes 12 rounds; AES-256 executes 14 rounds.',
      },
    ],
  },
];
