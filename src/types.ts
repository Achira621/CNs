export type CipherMode = 'encrypt' | 'decrypt';

export type CipherMethod =
  | 'caesar_default'
  | 'caesar_custom'
  | 'multiplicative'
  | 'affine'
  | 'vigenere'
  | 'playfair'
  | 'hill'
  | 'ecb'
  | 'cbc'
  | 'cfb'
  | 'ofb'
  | 'ctr';

export type CipherCategory = 'monoalphabetic' | 'polyalphabetic' | 'block';

export interface BlockCipherStep {
  blockIndex: number;
  plaintextBlock: string;
  plaintextHex: string;
  ivOrPrevCipherHex: string;
  xorResultHex: string;
  keystreamHex: string;
  ciphertextHex: string;
  ciphertextBlock: string;
  explanation: string;
}

export interface CipherMethodInfo {
  id: CipherMethod;
  name: string;
  category: CipherCategory;
  formula: string;
  description: string;
  defaultA: number;
  defaultB: number;
  lockA: boolean;
  lockB: boolean;
}

export interface KeyValidation {
  isValid: boolean;
  gcd: number;
  explanation: string;
  suggestedA: number[];
}

export interface TransformationStep {
  char: string;
  isAlphabet: boolean;
  rawIndex?: number;
  calculatedIndex?: number;
  modIndex?: number;
  resultChar: string;
}

export interface EuclideanStep {
  step: number;
  a: number;
  b: number;
  quotient: number;
  remainder: number;
  x: number;
  y: number;
}

export interface BruteForceResult {
  a: number;
  b: number;
  decryptedText: string;
  score: number; // Higher is closer to standard English
  chiSquared: number;
}

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  sections: {
    heading: string;
    content: string;
    interactiveWidget?: 'coprime-checker' | 'inverse-calculator' | 'equation-solver' | 'mini-encoder';
  }[];
  quiz: LessonQuizQuestion[];
}

export interface FrequencyData {
  letter: string;
  count: number;
  percentage: number;
  englishPercentage: number;
}

export interface KnownPlaintextMatch {
  p1: string;
  c1: string;
  p2: string;
  c2: string;
  solvedA?: number;
  solvedB?: number;
  isValid: boolean;
  message: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}
