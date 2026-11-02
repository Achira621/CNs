export type CipherMode = 'encrypt' | 'decrypt';

export type CipherMethod =
  | 'caesar_default'
  | 'caesar_custom'
  | 'multiplicative'
  | 'affine'
  | 'vigenere'
  | 'playfair'
  | 'hill'
  | 'des'
  | '2des'
  | '3des'
  | 'aes'
  | 'ecb'
  | 'cbc'
  | 'cfb'
  | 'ofb'
  | 'ctr'
  | 'rsa'
  | 'diffie_hellman'
  | 'ecc'
  | 'sha256'
  | 'hmac';

export type CipherCategory = 'monoalphabetic' | 'polyalphabetic' | 'block' | 'modern' | 'asymmetric' | 'hashing';

// Common Execution Trace Architecture
export interface AlgorithmStep {
  id: string;
  index: number;
  title: string;
  description: string;
  operation: string;
  input?: unknown;
  output?: unknown;
  visualData?: unknown;
  mathematicalExplanation?: string;
  highlight?: string[];
  metadata?: Record<string, unknown>;
}

export interface AlgorithmTrace {
  algorithmId: string;
  algorithmName: string;
  operation: 'encrypt' | 'decrypt' | 'analyze' | 'hash' | 'sign' | 'exchange';
  input: unknown;
  output: unknown;
  steps: AlgorithmStep[];
  executionTime?: number;
  parameters?: Record<string, unknown>;
}

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
    interactiveWidget?:
      | 'coprime-checker'
      | 'inverse-calculator'
      | 'equation-solver'
      | 'mini-encoder'
      | 'des-feistel'
      | '2des-mitm'
      | '3des-ede'
      | 'aes-state';
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

// Security Comparison Types
export interface AlgorithmSecurityProfile {
  id: CipherMethod;
  name: string;
  category: CipherCategory;
  inventedYear: string;
  inventors: string;
  keyType: 'symmetric' | 'asymmetric' | 'none (unkeyed)' | 'shared secret';
  standardKeySizes: string;
  effectiveKeyspace: string;
  mathFoundation: string;
  complexity: string;
  primaryUseCases: string[];
  vulnerabilities: string[];
  status: 'Cryptographically Broken' | 'Obsolete' | 'Historically Significant' | 'Educational Only' | 'Modern Standard';
  recommendedAlternative?: string;
  nistStatus: string;
  whyChosenOrDeprecated: string;
}

// Challenge Arena Types
export type ChallengeCategory = 'classical' | 'modular' | 'polyalphabetic' | 'block' | 'asymmetric' | 'hashing';
export type ChallengeDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface CryptographyChallenge {
  id: string;
  title: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  scenario: string;
  cipherTextOrData: string;
  expectedAnswer: string;
  caseSensitive?: boolean;
  hints: [string, string, string]; // Hint 1: Concept, Hint 2: Formula, Hint 3: Specific clue
  points: number;
  algorithmId: CipherMethod;
  explanation: string;
}

export interface ChallengeProgress {
  challengeId: string;
  solved: boolean;
  attempts: number;
  hintsUsed: number;
  scoreEarned: number;
  solvedAt?: string;
}

// Guided CNS Practicals Types
export interface PracticalExperiment {
  expNumber: number;
  title: string;
  aim: string;
  syllabusTopic: string;
  theory: string;
  mathematicalFormula: string;
  procedureSteps: string[];
  defaultInput: string;
  algorithmId: CipherMethod;
  vivaQuestions: {
    question: string;
    answer: string;
  }[];
}

export interface PracticalReportData {
  studentName: string;
  rollNo: string;
  division: string;
  batch: string;
  date: string;
  expNumber: number;
  expTitle: string;
  inputData: string;
  parameters: Record<string, unknown>;
  outputData: string;
  observation: string;
  conclusion: string;
}

// Personal Learning Dashboard & Recommendations
export interface LearningProgressState {
  completedLessons: string[];
  completedPracticals: number[];
  solvedChallenges: Record<string, ChallengeProgress>;
  studiedAlgorithms: CipherMethod[];
  quizScores: Record<string, { score: number; total: number; date: string }>;
  experimentsCount: number;
  totalPoints: number;
  lastActive: string;
}

export interface TopicRecommendation {
  id: string;
  topic: string;
  reason: string;
  targetEnv: 'learn' | 'experiment' | 'attack' | 'apply';
  targetTab?: string;
  actionText: string;
}
