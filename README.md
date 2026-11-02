# Classical & Modern Cryptography Masterclass
## Interactive Cryptography Education & Cybersecurity Laboratory Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)

---

### Academic & Institutional Context
* **Institution**: Vidyalankar Institute of Technology (VIT), Mumbai
* **Course**: Cybersecurity & Network Security (CNS)
* **Academic Term**: Practical Laboratory Curriculum
* **Faculty in Charge**: **Prof. Vinita Bhandiwad**
* **Engineering Credits**:
  * **Varad Dalvi** (`24101B0040`) — *Lead Cryptographic Architect*
  * **Omkar Bengali** (`24101B0043`) — *Modular Math & Frequency Analyst*
  * **Sumit Surwase** (`24101B0022`) — *Security Protocols & Visualizer Dev*

---

## 1. Project Overview
The **Classical & Modern Cryptography Masterclass** transforms classical cryptography learning from a passive textbook calculator into an **interactive cyber range, algorithm tracing laboratory, and practical assessment environment**.

Students can:
1. Trace algorithm transformations step-by-step with interactive scrub controls (Play, Pause, Step Next/Prev, Speed).
2. Experiment with symmetric block ciphers (DES, 2DES, 3DES, AES-128/192/256) and modes (ECB, CBC, CFB, OFB, CTR).
3. Investigate mathematical foundations (Modulo 26 geometry, Extended Euclidean inverse algorithm, Bézout identity, Euler's totient).
4. Perform controlled cryptanalysis (Brute-force cracking, frequency analysis, Vigenère Kasiski examination, Index of Coincidence, Known-Plaintext, 2DES Meet-in-the-Middle).
5. Visualize the "ECB Penguin" semantic leakage effect on structured bitmaps compared to CBC diffusion.
6. Explore public-key cryptography (RSA trapdoor factorization, Diffie-Hellman unauthenticated key exchange with Man-in-the-Middle simulator, Elliptic Curve point doubling and scalar multiplication).
7. Inspect cryptographic hashing (SHA-256 64-round compression schedules, Strict Avalanche Criterion testing, HMAC message authentication).
8. Encrypt local files with production **AES-256-GCM** using the browser's hardware-accelerated Web Crypto API with tamper detection.
9. Simulate real-world cybersecurity protocols (Online Banking, E2EE Messaging, Digital Document Signing & Tampering, TLS 1.3 1-RTT Handshake).
10. Complete guided CNS practical experiments (Exp 1 through Exp 5) and generate formatted university lab reports.
11. Solve tiered cryptographic challenges with 3-level hints and point scoring.
12. Interact with **Professor Modulo**, a context-aware Gemini AI Cryptography Tutor with automatic offline fallback.

---

## 2. Four Core Environments Architecture

The platform organizes cryptographic learning into four interconnected environments:

```
                            ┌────────────────────────┐
                            │    MASTER NAVIGATION   │
                            └───────────┬────────────┘
         ┌──────────────────┬───────────┴───────────┬──────────────────┐
         │                  │                       │                  │
   ┌─────▼─────┐     ┌──────▼──────┐         ┌──────▼──────┐    ┌──────▼──────┐
   │   LEARN   │     │ EXPERIMENT  │         │   ATTACK    │    │    APPLY    │
   └─────┬─────┘     └──────┬──────┘         └──────┬──────┘    └──────┬──────┘
         │                  │                       │                  │
 ├─ Masterclass Lessons     ├─ Cipher Studio & Traces├─ Brute-Force      ├─ CNS Practicals
 ├─ Interactive Quizzes     ├─ Asymmetric & Hashing  ├─ Frequency (Chi²) ├─ Lab Report Gen
 └─ Knowledge Graph         ├─ File Lab (AES-GCM)   ├─ Vigenère Kasiski ├─ Real Scenarios
                            ├─ Security Comparison   ├─ ECB Leakage Demo ├─ Challenge Arena
                            └─ Math Visualizers      └─ Red vs Blue Team └─ Dashboard
```

---

## 3. Implemented Cryptographic Algorithms

| Category | Algorithms Implemented | Mathematical Foundation | Educational Tracing |
| :--- | :--- | :--- | :--- |
| **Monoalphabetic** | Caesar (Default + Custom), Multiplicative, Affine | $E(x) = (ax + b) \pmod{26}$, $\gcd(a, 26) = 1$ | Full Step-by-Step |
| **Polyalphabetic** | Vigenère, Playfair (5x5 matrix), Hill ($2\times 2$) | Digraph matrix shifts, $C = K \cdot P \pmod{26}$ | Full Step-by-Step |
| **Block & Modern** | DES, 2DES, 3DES (EDE), AES-128/192/256 | Feistel 16-round, GF($2^8$) SubBytes/MixColumns | Round-by-Round |
| **Block Modes** | ECB, CBC, CFB, OFB, CTR | Vector chaining, IV/Nonce feedback, XOR streams | Block-by-Block |
| **Asymmetric** | RSA, Diffie-Hellman, ECC (Weierstrass) | Integer factorization, Discrete Log, Point Addition | Trapdoor / Key Steps |
| **Hashing & MAC** | SHA-256 (64-round), HMAC-SHA256 | Davies–Meyer compression, $K \oplus ipad / opad$ | 64 Compression Rounds |
| **File Protection** | AES-256-GCM | Web Crypto API, PBKDF2 (100k rounds), 96-bit IV | Authenticated AEAD |

---

## 4. Security Model: Educational vs. Production Cryptography

> [!IMPORTANT]
> **Clear Boundary Between Educational and Security Modes:**
> * **Educational Mode**: Ciphers like Caesar, Affine, Playfair, Hill, DES, 2DES, and ECB mode are **cryptographically broken or obsolete**. They are implemented purely to teach underlying mathematics, cryptanalysis, and Feistel/SPN network structures.
> * **Security Mode**: Production features (such as the File Encryption Laboratory) strictly enforce **AES-256-GCM** using `window.crypto.subtle` with cryptographically random salts, nonces, and 128-bit authentication tags. Tampering with even 1 byte causes instant authentication rejection (`OperationError`).

---

## 5. Technology Stack
* **Frontend**: React 19 (`react`, `react-dom`), TypeScript 5.8, Vite 6, Tailwind CSS v4, Motion (`motion`), Lucide React icons
* **Server**: Express.js with `tsx` development runtime and `esbuild` production bundler
* **AI Engine**: Google Gemini API via `@google/genai` (with intelligent offline pedagogical fallbacks)
* **Graphics & Visuals**: HTML5 Canvas, SVG vectors, Zero-gravity physics KeyCursor

---

## 6. Setup & Execution Instructions

### Prerequisites
* Node.js v18.0.0 or higher
* npm v9.0.0 or higher

### Installation
```bash
# Clone repository
git clone <repository-url>
cd classical-cryptography-masterclass

# Install dependencies
npm install
```

### Environment Variables
Configure your Gemini API key in `.env.local` for full AI tutor generative responses:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```
*(Note: If no API key is provided, the platform automatically activates Professor Modulo's built-in offline mathematical fallback engine).*

### Running the Application
```bash
# Start development server with hot module reloading
npm run dev

# Open browser at http://localhost:3000
```

### Running the Comprehensive Test Suite
```bash
# Run unit & mathematical test suite
npm test
```

### Production Build & Verification
```bash
# Typecheck with TypeScript
npm run lint

# Build production bundle with Vite & esbuild
npm run build

# Start production server
npm start
```
