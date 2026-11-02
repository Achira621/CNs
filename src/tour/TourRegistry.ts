import { NavItemKey } from '../components/layout/AppSidebar';
import { CipherMethod } from '../types';

export interface TourStep {
  id: string;
  title: string;
  section: string;
  route: NavItemKey | 'algorithm_page';
  algorithm?: CipherMethod;
  targetId: string; // querySelector `[data-tour="${targetId}"]`
  whatItIs: string;
  whyItExists: string;
  howToUse: string;
  quickTip: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  demonstrationAction?: 'type-sample' | 'encrypt' | 'switch-subtab' | 'open-ai';
}

export const TOUR_SECTIONS = [
  { id: 'dashboard', label: 'Command Center & Dashboard', route: 'dashboard' as const },
  { id: 'studio', label: 'Cipher Studio & Tracing Engine', route: 'studio' as const },
  { id: 'algorithms', label: '21 Algorithm Workbenches', route: 'algorithms' as const },
  { id: 'math', label: 'Mathematical Foundations Lab', route: 'math' as const },
  { id: 'attack', label: 'Cryptanalysis & Attack Suite', route: 'attack' as const },
  { id: 'lessons', label: 'Masterclass Lessons & Graph', route: 'lessons' as const },
  { id: 'challenges', label: 'Challenge Arena & Analytics', route: 'challenges' as const },
  { id: 'practicals', label: 'CNS Guided Practicals', route: 'practicals' as const },
  { id: 'scenarios', label: 'Real-World Cyber Scenarios', route: 'scenarios' as const },
];

export const COMPLETE_TOUR_STEPS: TourStep[] = [
  // =========================================================================
  // SECTION 1: DASHBOARD & GLOBAL NAVIGATION
  // =========================================================================
  {
    id: 'sidebar-nav',
    title: 'Dashboard Navigation',
    section: 'Global Navigation',
    route: 'dashboard',
    targetId: 'nav-item-dashboard',
    whatItIs: 'The Dashboard button in the unified navigation sidebar provides instant access to your central learning hub.',
    whyItExists: 'Allows seamless teleportation across classical studios, mathematical visualizers, attack suites, lessons, and practicals without losing your cryptographic state.',
    howToUse: 'Click the Dashboard tab or any sidebar item. Active lavender indicators show your current laboratory position.',
    quickTip: 'You can use number shortcuts or click the orbital brand logo at the top anytime to return to the Dashboard.',
    placement: 'right',
  },
  {
    id: 'topbar-search',
    title: 'Global Omnibar & Shortcut Palette',
    section: 'Command Center',
    route: 'dashboard',
    targetId: 'topbar-search',
    whatItIs: 'An intelligent global search bar and command palette indexed across all 21 ciphers, attacks, math tools, and syllabus lessons.',
    whyItExists: 'Instantly search and jump to any cipher formula, concept, or practical experiment without hunting through menus.',
    howToUse: 'Click this search bar or press Ctrl + K (or Cmd + K on macOS) anywhere in the application to summon the modal.',
    quickTip: 'Type "Euclid" or "DES" in the search bar to jump straight to their interactive mathematical engines!',
    placement: 'bottom',
  },
  {
    id: 'topbar-ai-tutor',
    title: 'Context-Aware Gemini AI Tutor',
    section: 'Command Center',
    route: 'dashboard',
    targetId: 'topbar-ai-tutor',
    whatItIs: 'A Google Gemini-powered cryptography mentor integrated directly into the application context.',
    whyItExists: 'Traditional calculators don\'t explain why an encryption fails or how modular arithmetic works; this tutor inspects your live key parameters and provides tailored pedagogical guidance.',
    howToUse: 'Click "Ask AI Tutor" anytime to slide open the context drawer, or use the "Explain" buttons inside workbenches.',
    quickTip: 'The tutor knows your active cipher, key values, and current input text, so you never have to re-type your problem!',
    placement: 'bottom',
  },
  {
    id: 'dashboard-hero',
    title: 'Cosmic Lab Hero & Academic Attribution',
    section: 'Dashboard',
    route: 'dashboard',
    targetId: 'dashboard-hero',
    whatItIs: 'The introductory hero composition presenting the academic context: Vidyalankar Institute of Technology (VIT) CNS practical project under Prof. Vinita Bhandiwad.',
    whyItExists: 'Establishes the educational mission: combining mathematical foundations, laboratory experimentation, and cybersecurity practice on a clean white canvas.',
    howToUse: 'Click "Open Cipher Studio" to launch the substitution workbench or "View Curriculum" to start guided lessons.',
    quickTip: 'Observe the 3D-styled gas giant planet in the top-right corner; it reflects the Cosmic Lab design identity.',
    placement: 'bottom',
  },
  {
    id: 'dashboard-categories',
    title: 'Four Cryptographic Paradigm Portals',
    section: 'Dashboard',
    route: 'dashboard',
    targetId: 'dashboard-categories',
    whatItIs: 'High-contrast dark container cards grouping algorithms into four historical and mathematical families.',
    whyItExists: 'Helps students understand the evolution from simple monoalphabetic substitution to modern post-quantum and block cipher standards.',
    howToUse: 'Click any category card to instantly filter and launch its respective workbenches: Monoalphabetic, Polyalphabetic, Block Ciphers, or Modern Standards.',
    quickTip: 'Each card features an individual colored glow accent (Amber, Purple, Blue, Cyan) indicating its security level.',
    placement: 'top',
  },
  {
    id: 'dashboard-continue-learning',
    title: 'Continue Learning Progress Tracker',
    section: 'Dashboard',
    route: 'dashboard',
    targetId: 'dashboard-continue-learning',
    whatItIs: 'A persistent course tracker keeping tabs on your active practical experiment and curriculum progress.',
    whyItExists: 'Prevents losing your place during multi-session laboratory practicals.',
    howToUse: 'Click the circular purple Play button to jump straight into your current experiment (such as DES Feistel rounds).',
    quickTip: 'Your progress is saved locally in your browser so you can resume anytime without creating an account.',
    placement: 'top',
  },
  {
    id: 'dashboard-quick-tools',
    title: 'Number Theory Quick Tools',
    section: 'Dashboard',
    route: 'dashboard',
    targetId: 'dashboard-quick-tools',
    whatItIs: 'Fast-access calculators for Mod 26 clock arithmetic, Greatest Common Divisors (GCD), 2x2 Matrix determinants, and Frequency Analysis.',
    whyItExists: 'Provides instant scratchpad calculations without leaving your main workflow.',
    howToUse: 'Click any tool icon to open the mathematical visualizer initialized for that operation.',
    quickTip: 'Use the GCD tool to verify coprime conditions before picking keys for Affine and Multiplicative ciphers!',
    placement: 'top',
  },
  {
    id: 'dashboard-laboratory',
    title: 'The Laboratory: One Design System',
    section: 'Dashboard',
    route: 'dashboard',
    targetId: 'dashboard-laboratory',
    whatItIs: 'Direct launchpads into the four core experimental environments: Cipher Studio, Math Laboratory, Cryptanalysis Lab, and CNS Practicals.',
    whyItExists: 'Ensures consistent dark workbench containers, mathematical formulas, and algorithm-specific experiences across all paradigms.',
    howToUse: 'Click any of the four laboratory cards to open its dedicated workbench.',
    quickTip: 'Notice how every workbench maintains the same high-contrast dark box layout on the atmospheric white canvas.',
    placement: 'top',
  },

  // =========================================================================
  // SECTION 2: CIPHER STUDIO & EXECUTION TRACE
  // =========================================================================
  {
    id: 'studio-plaintext-input',
    title: 'Plaintext & Ciphertext Input Vector',
    section: 'Cipher Studio',
    route: 'studio',
    targetId: 'studio-plaintext-input',
    whatItIs: 'The primary text area where you supply plaintext messages to encrypt or ciphertext messages to decrypt.',
    whyItExists: 'Algorithms require input vectors to transform. The studio supports arbitrary text with live non-alphabetic filtering and spacing preservation.',
    howToUse: 'Type or paste any message into the field. Toggle between Encrypt and Decrypt modes at the top-right of the box.',
    quickTip: 'Try typing a phrase with repeated letters (like "BALLOON") to see how monoalphabetic ciphers preserve letter patterns while polyalphabetic ciphers hide them!',
    placement: 'bottom',
    demonstrationAction: 'type-sample',
  },
  {
    id: 'studio-key-controls',
    title: 'Interactive Key Configuration & Coprime Validator',
    section: 'Cipher Studio',
    route: 'studio',
    targetId: 'studio-key-controls',
    whatItIs: 'Interactive parameter controls tailored to the selected cipher: range sliders for slope a and shift b, keywords for Vigenère and Playfair, or 2x2 matrices for Hill.',
    whyItExists: 'In modular ciphers, invalid keys produce non-invertible transformations. The validator checks gcd(a, 26) = 1 in real-time.',
    howToUse: 'Drag the sliders or enter text. The indicator will turn green if the key is mathematically valid, or red with a guidance message if invalid.',
    quickTip: 'Only 12 integers in 1..25 are coprime to 26: {1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25}. The slider automatically indicates valid choices!',
    placement: 'left',
  },
  {
    id: 'studio-output',
    title: 'Live Ciphertext Output & Statistics',
    section: 'Cipher Studio',
    route: 'studio',
    targetId: 'studio-output',
    whatItIs: 'The real-time computed output display with one-click copy, character entropy calculation, and alphabet distribution.',
    whyItExists: 'Provides immediate feedback for every keystroke and key slider adjustment without requiring manual page reloads.',
    howToUse: 'Inspect the transformed output. Click the "Copy Output" button to copy the ciphertext to your clipboard for cryptanalysis experiments.',
    quickTip: 'You can copy this ciphertext, switch to the Cryptanalysis tab, and attempt to crack your own key using frequency analysis!',
    placement: 'top',
  },
  {
    id: 'studio-trace-player',
    title: 'Step-by-Step Intermediate Execution Trace Player',
    section: 'Cipher Studio',
    route: 'studio',
    targetId: 'studio-trace-player',
    whatItIs: 'An educational step-by-step debugger that records and visualizes every internal transformation: character index lookups, modular multiplication, shift additions, Feistel rounds, and S-box substitutions.',
    whyItExists: 'Moves the tool beyond a simple "black box calculator" so students can trace the exact mathematical mechanics step-by-step.',
    howToUse: 'Use the media controls: Play to watch automatic animation, Step Forward/Back to inspect specific characters, or jump to any step in the scrubber.',
    quickTip: 'Each step displays the exact algebraic formula: e.g. (5 × 19 + 8) mod 26 = 103 mod 26 = 25 (\'Z\')!',
    placement: 'top',
  },

  // =========================================================================
  // SECTION 3: 21 ALGORITHM LIBRARY & DEDICATED PAGES
  // =========================================================================
  {
    id: 'algorithms-library',
    title: '21 Algorithm Repository',
    section: 'Algorithm Library',
    route: 'algorithms',
    targetId: 'algorithms-library',
    whatItIs: 'A comprehensive catalog registering all 21 ciphers: Classical (Caesar, Multiplicative, Affine, Vigenère, Playfair, Hill), Block (DES, 2DES, 3DES, AES), Modes (ECB, CBC, CFB, OFB, CTR), and Modern Asymmetric/Hash (RSA, Diffie-Hellman, ECC, SHA-256, HMAC).',
    whyItExists: 'Ensures every algorithm in the university syllabus has its own dedicated URL, route, and full laboratory experience.',
    howToUse: 'Filter by category using the top pills or search by name. Click "Launch" on any card to open its dedicated page.',
    quickTip: 'Each card displays its official NIST/FIPS security status (Broken, Deprecated, Legacy Secure, Current Standard) and nominal key space.',
    placement: 'top',
  },
  {
    id: 'algorithm-workbench',
    title: 'Dedicated Algorithm Workbench Template',
    section: 'Algorithm Pages',
    route: 'algorithm_page',
    algorithm: 'caesar_default',
    targetId: 'algorithm-workbench',
    whatItIs: 'The unified dark workbench template providing algorithm-specific key controls, live encryption, and built-in execution traces for the selected cipher.',
    whyItExists: 'Applies "One design system. Every algorithm." so students experience the exact same high-caliber workbench whether inspecting Caesar or AES.',
    howToUse: 'Switch between Encrypt and Decrypt, adjust algorithm keys, and observe the live mathematical output.',
    quickTip: 'Use the "Switch Algorithm" dropdown in the top-right breadcrumb bar to switch between any of the 21 ciphers without leaving the workbench!',
    placement: 'top',
  },
  {
    id: 'algorithm-theory-tab',
    title: 'Mathematics, Proofs & Theoretical Depth',
    section: 'Algorithm Pages',
    route: 'algorithm_page',
    algorithm: 'caesar_default',
    targetId: 'algorithm-theory-tab',
    whatItIs: 'Deep academic tabs containing formal LaTeX equations, step-by-step execution algorithms, and cryptographic security proofs.',
    whyItExists: 'Bridges theoretical classroom lectures with practical implementation code.',
    howToUse: 'Click the "Mathematics & Theory" tab inside the workbench to view formal definitions, truth tables, and complexity analysis.',
    quickTip: 'Formulas use standard KaTeX formatting matching textbooks like Stallings and Forouzan.',
    placement: 'top',
  },
  {
    id: 'algorithm-viva-tab',
    title: 'VIT Syllabus Viva Voce Q&A Preparation',
    section: 'Algorithm Pages',
    route: 'algorithm_page',
    algorithm: 'caesar_default',
    targetId: 'algorithm-viva-tab',
    whatItIs: 'Curated examination oral questions and model answers designed specifically for university external viva examinations.',
    whyItExists: 'Empowers students to ace their practical term viva evaluations with tested conceptual questions.',
    howToUse: 'Click the "Viva Voce Q&A" tab to review high-frequency exam questions with highlighted key answers.',
    quickTip: 'Review questions on key spaces, invertibility conditions, and why certain ciphers were deprecated.',
    placement: 'top',
  },

  // =========================================================================
  // SECTION 4: MATHEMATICAL VISUALIZER
  // =========================================================================
  {
    id: 'math-mod26-clock',
    title: 'Modulo 26 Circular Clock Geometry',
    section: 'Math Visualizer',
    route: 'math',
    targetId: 'math-mod26-clock',
    whatItIs: 'An interactive circular dial visualizing residues 0 through 25 along a 26-position clock face.',
    whyItExists: 'Modular arithmetic is often abstract for students; seeing numbers wrap continuously around a clock makes modular addition and multiplication intuitive.',
    howToUse: 'Change the input value or key offset to watch the vector rotate around the clock face, illustrating congruence modulo 26.',
    quickTip: 'Notice how adding 26 or any multiple of 26 brings you back to the exact same point on the dial: a ≡ (a + 26k) mod 26!',
    placement: 'top',
  },
  {
    id: 'math-extended-euclid',
    title: 'Extended Euclidean Algorithm Step Table',
    section: 'Math Visualizer',
    route: 'math',
    targetId: 'math-extended-euclid',
    whatItIs: 'A complete step-by-step tabular proof solving Bezout\'s identity: a·x + 26·y = gcd(a, 26) to compute the modular multiplicative inverse.',
    whyItExists: 'Required in university exams to prove that a multiplicative or affine key has a valid decryption inverse.',
    howToUse: 'Select any multiplier a. The table dynamically calculates quotient q, remainder r, and back-substitution coefficients x and y.',
    quickTip: 'When gcd = 1, coefficient x (adjusted to positive residue mod 26) is the exact modular inverse a^-1 used for decryption!',
    placement: 'top',
  },

  // =========================================================================
  // SECTION 5: CRYPTANALYSIS & ATTACK LAB
  // =========================================================================
  {
    id: 'attack-frequency',
    title: 'Letter Frequency & Chi-Squared Scoring',
    section: 'Cryptanalysis Lab',
    route: 'attack',
    targetId: 'attack-frequency',
    whatItIs: 'A statistical frequency engine comparing the ciphertext\'s letter distribution against standard English frequencies (ETAOIN SHRDLU).',
    whyItExists: 'Monoalphabetic ciphers do not alter frequency distributions; this chart allows attackers to identify the most frequent characters and break the key.',
    howToUse: 'Inspect the dual-bar chart. Lower Chi-Squared scores indicate a closer match to natural English language.',
    quickTip: 'English plaintext produces Chi-Squared values close to 0; encrypted random text produces values exceeding 200.',
    placement: 'top',
  },
  {
    id: 'attack-tools',
    title: 'Automated Attack Engines: Kasiski & Brute Force',
    section: 'Cryptanalysis Lab',
    route: 'attack',
    targetId: 'attack-tools',
    whatItIs: 'Tools implementing Kasiski examination to find repeating n-grams for Vigenère keyword deduction, and exhaustive brute force search.',
    whyItExists: 'Demonstrates to students that classical ciphers provide zero computational security against modern automated cryptanalysis.',
    howToUse: 'Run the brute force test on any Caesar or Affine ciphertext to generate all 26 or 312 candidate plaintexts in milliseconds.',
    quickTip: 'Kasiski examination deduces the keyword length m by computing the greatest common divisor of distances between duplicate words!',
    placement: 'top',
  },

  // =========================================================================
  // SECTION 6: MASTERCLASS CURRICULUM & KNOWLEDGE GRAPH
  // =========================================================================
  {
    id: 'lessons-curriculum',
    title: 'Curriculum Lessons & Embedded Quizzes',
    section: 'Masterclass',
    route: 'lessons',
    targetId: 'lessons-curriculum',
    whatItIs: 'Comprehensive chapters covering historical cryptography, mathematical foundations, modern standards, and ethical cybersecurity.',
    whyItExists: 'Provides structured textbook-quality learning paired with interactive widgets and self-grading quizzes.',
    howToUse: 'Click through chapters on the left, read the explanations, interact with embedded mini-widgets, and answer the quizzes.',
    quickTip: 'Each quiz provides instant mathematical explanations for both correct and incorrect choices!',
    placement: 'top',
  },
  {
    id: 'lessons-knowledge-graph',
    title: 'Interactive Force-Directed Knowledge Graph',
    section: 'Masterclass',
    route: 'lessons',
    targetId: 'lessons-knowledge-graph',
    whatItIs: 'An interactive SVG force-directed knowledge graph mapping relationships between ciphers, attacks, mathematical theorems, and modern algorithms.',
    whyItExists: 'Visualizes how foundational monoalphabetic substitution connects to modern Feistel networks and trapdoor permutations.',
    howToUse: 'Click "Knowledge Graph" at the top of the tab. Drag nodes to explore connections, and click any node to teleport to its lab.',
    quickTip: 'Notice the edges connecting Affine Cipher to Modular Arithmetic and Caesar Cipher!',
    placement: 'top',
  },

  // =========================================================================
  // SECTION 7: CHALLENGE ARENA & LEARNING ANALYTICS
  // =========================================================================
  {
    id: 'challenges-arena',
    title: 'Capture-the-Flag (CTF) Challenge Arena',
    section: 'Practice & Quizzes',
    route: 'challenges',
    targetId: 'challenges-arena',
    whatItIs: 'A collection of real cryptographic challenge missions featuring intercepted Roman military messages, secret diplomatic cables, and broken DES keys.',
    whyItExists: 'Reinforces learning through problem-solving and active recall rather than passive reading.',
    howToUse: 'Select a challenge, read the intercepted scenario, decrypt the secret flag using the tools, and submit your answer.',
    quickTip: 'If you get stuck, unlock the 3-tier hints: Tier 1 (Concept), Tier 2 (Mathematical Clue), and Tier 3 (Near Solution)!',
    placement: 'top',
  },

  // =========================================================================
  // SECTION 8: GUIDED CNS PRACTICALS & REPORT GENERATOR
  // =========================================================================
  {
    id: 'practicals-experiments',
    title: 'Guided CNS Practicals & Lab Report Generator',
    section: 'CNS Practicals',
    route: 'practicals',
    targetId: 'practicals-experiments',
    whatItIs: 'Complete university laboratory experiments aligned with the Vidyalankar Institute of Technology Cybersecurity & Network Security syllabus.',
    whyItExists: 'Students can conduct syllabus practicals, verify intermediate calculations, answer viva questions, and generate official formatted PDF/Print lab reports with their student credentials.',
    howToUse: 'Choose an experiment (e.g. Practical 1: Classical Substitution or Practical 2: DES Implementation). Fill in parameters and click "Generate Lab Report".',
    quickTip: 'The generated report includes your student name, roll number, objective, mathematical formulas, observations, and conclusions ready for university submission!',
    placement: 'top',
  },

  // =========================================================================
  // SECTION 9: REAL-WORLD SCENARIOS
  // =========================================================================
  {
    id: 'scenarios-simulations',
    title: 'Enterprise Real-World Cybersecurity Scenarios',
    section: 'Real Scenarios',
    route: 'scenarios',
    targetId: 'scenarios-simulations',
    whatItIs: 'Simulations demonstrating how cryptographic primitives operate in modern cybersecurity: TLS 1.3 handshakes, ransomware defense, and blockchain transactions.',
    whyItExists: 'Shows students the practical real-world relevance of algorithms beyond classical mathematics.',
    howToUse: 'Step through the animated handshake and payload sequence to observe how symmetric, asymmetric, and hash algorithms work together.',
    quickTip: 'Notice how TLS uses Asymmetric crypto (ECDHE/RSA) to exchange a shared key, then switches to Symmetric crypto (AES-GCM) for fast payload encryption!',
    placement: 'top',
  },
];
