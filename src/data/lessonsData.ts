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
];
