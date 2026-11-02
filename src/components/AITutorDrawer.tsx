import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { X, Sparkles, Send, Bot, User, Loader2, HelpCircle, Shield, Check, Info } from 'lucide-react';

interface AITutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string;
  contextData?: any;
}

export const AITutorDrawer: React.FC<AITutorDrawerProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  contextData,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: "Hello! I am **Professor Modulo**, your AI Cryptography Tutor at Vidyalankar Institute of Technology. Ask me about modular arithmetic, Feistel networks, Galois Field GF(2⁸), Meet-in-the-Middle attacks, RSA, or how to break ciphers!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shareContext, setShareContext] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Explain the active execution trace step",
    "Why must key 'a' be coprime to 26 in Affine cipher?",
    "How does the Extended Euclidean algorithm find a⁻¹?",
    "What is the Meet-in-the-Middle attack on 2DES?",
    "Why do visual patterns remain visible in ECB mode?",
  ];

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Offline educational fallback when Gemini API key is missing or offline
  const getOfflineFallbackResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('coprime') || q.includes('key a') || q.includes("key 'a'") || q.includes('invalid key')) {
      return `### Why Multiplier 'a' Must Be Coprime to 26:
In the Affine cipher $E(x) = (a \\cdot x + b) \\pmod{26}$, the transformation must be a **bijection (one-to-one and onto)**.
1. If $\\gcd(a, 26) = 1$, then by Bézout's Identity, there exist integers $x, y$ such that:
$$a \\cdot x + 26 \\cdot y = 1 \\implies a \\cdot x \\equiv 1 \\pmod{26}$$
2. The integer $x$ is the unique **modular multiplicative inverse** $a^{-1} \\pmod{26}$.
3. If $\\gcd(a, 26) > 1$ (e.g. $a = 2, 4, 13$), then multiple distinct plaintext letters map to the exact same ciphertext letter, causing collisions and making deterministic decryption impossible!
4. The 12 valid coprime values for $a$ modulo 26 are:
$$\\{1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25\\}$$`;
    }

    if (q.includes('euclidean') || q.includes('inverse')) {
      return `### The Extended Euclidean Algorithm for Modular Inverses:
Given an integer $a$ and modulus $m = 26$, we seek $x = a^{-1} \\pmod{26}$ such that $a \\cdot x \\equiv 1 \\pmod{26}$.
1. **Division Algorithm Chain:**
Divide $m$ by $a$ to get quotient $q_1$ and remainder $r_1$.
Repeat until the remainder is 0. If the last non-zero remainder is 1, then $\\gcd(a, m) = 1$.
2. **Back-Substitution:**
Express $1$ as a linear combination of $a$ and $m$:
$$1 = a \\cdot s + m \\cdot t$$
Taking both sides modulo $m$:
$$1 \\equiv a \\cdot s \\pmod m \\implies a^{-1} \\equiv s \\pmod m$$
If $s < 0$, simply add $m$ to get the positive residue!`;
    }

    if (q.includes('ecb') || q.includes('pattern')) {
      return `### Why Visual Patterns Remain in ECB Mode:
**Electronic Codebook (ECB)** mode encrypts each 128-bit block independently using the exact same symmetric key:
$$C_i = E_K(P_i)$$
- Whenever two blocks of plaintext are identical ($P_i = P_j$), their ciphertext blocks will also be completely identical ($C_i = C_j$).
- In structured files (like bitmap images or database records), large regions of uniform color (like the background) consist of identical blocks.
- As demonstrated in our **ECB Pattern Leakage Lab**, while the individual pixels are mathematically encrypted, the overall shape/contour remains visible!
- **Solution:** Always use authenticated modes like **AES-GCM** with a unique Initialization Vector (IV).`;
    }

    if (q.includes('meet-in-the-middle') || q.includes('2des') || q.includes('mitm')) {
      return `### The Meet-in-the-Middle Attack on 2DES:
2DES attempts to achieve 112-bit security by encrypting twice:
$$C = E_{K2}(E_{K1}(P))$$
The **Meet-in-the-Middle (MITM)** attack breaks this in $2^{57}$ operations rather than $2^{112}$:
1. **Forward Table:** The attacker encrypts known plaintext $P$ under all $2^{56}$ possible values of $K1$ and stores $(E_{K1}(P), K1)$ in a hash table.
2. **Backward Decryption:** The attacker decrypts known ciphertext $C$ under all $2^{56}$ possible values of $K2$: $D_{K2}(C)$.
3. **Collision Detection:** Look for a match where $E_{K1}(P) = D_{K2}(C)$. Any matching pair $(K1, K2)$ is a candidate key pair!
4. **Complexity:** Time $= 2^{56} + 2^{56} = 2^{57}$ operations, with $2^{56}$ memory. This proves that cascading two ciphers does not double the exponent!`;
    }

    return `### Professor Modulo's Cryptographic Guidance:
In modern cybersecurity practice:
- **Confidentiality:** Provided by symmetric stream/block ciphers like AES-GCM (128 or 256 bits).
- **Integrity & Authenticity:** Provided by HMAC-SHA256 or AEAD authentication tags.
- **Key Establishment:** Provided by Ephemeral Elliptic Curve Diffie-Hellman (ECDHE).
- **Non-Repudiation:** Provided by digital signatures using RSA-PSS or Ed25519.
*(Note: Full neural generative responses require a valid GEMINI_API_KEY in .env.local)*`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context: shareContext ? contextData : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reach AI Tutor endpoint');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: data.text || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      // Provide intelligent offline pedagogical fallback
      const fallbackText = getOfflineFallbackResponse(text);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: fallbackText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#141414] border-l border-[#262626] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF3E00]" />

        {/* Drawer Header */}
        <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF3E00] flex items-center justify-center text-white font-bold rounded-lg shadow-md">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-serif-display font-semibold text-sm text-white flex items-center gap-2">
                Professor Modulo
                <span className="px-1.5 py-0.5 text-[9px] bg-[#1A1A1A] text-amber-400 border border-[#333] font-mono-code font-bold uppercase rounded">
                  Gemini AI
                </span>
              </h3>
              <p className="text-[10px] font-mono-code text-zinc-500 uppercase tracking-wider">
                Academic Cryptographer • VIT Lab
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#1C1C1C] transition-colors rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context Sharing Toggle */}
        <div className="px-4 py-2 bg-[#121218] border-b border-[#262626] flex items-center justify-between text-xs font-mono-code">
          <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={shareContext}
              onChange={(e) => setShareContext(e.target.checked)}
              className="accent-[#FF3E00]"
            />
            <span className="text-[11px]">Attach Lab Experiment Context</span>
          </label>
          <span className="text-[10px] text-zinc-500">
            {shareContext ? 'Context Active' : 'Context Paused'}
          </span>
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-7 h-7 flex items-center justify-center shrink-0 font-mono-code text-xs font-bold rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-[#FF3E00] text-white'
                    : 'bg-[#222222] text-[#FF3E00] border border-[#333333]'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[85%] p-3.5 text-xs leading-relaxed font-sans rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-[#FF3E00] text-white'
                    : 'bg-[#0A0A0A] border border-[#262626] text-zinc-200 whitespace-pre-line'
                }`}
              >
                <div>{msg.text}</div>
                <div
                  className={`text-[9px] mt-1.5 text-right font-mono-code ${
                    msg.sender === 'user' ? 'text-amber-200' : 'text-zinc-500'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#FF3E00] p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF3E00]" />
              <span>Professor Modulo is analyzing cryptographic operations...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Questions Starter */}
        <div className="px-4 py-2.5 bg-[#0A0A0A] border-t border-[#262626] overflow-x-auto no-scrollbar flex items-center gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 text-[10px] font-mono-code bg-[#141414] hover:bg-[#1F1F1F] text-zinc-300 border border-[#262626] whitespace-nowrap transition-colors rounded-md"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-[#0A0A0A] border-t border-[#262626] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Professor Modulo anything about crypto..."
            className="flex-1 bg-[#141414] text-white text-xs font-mono-code p-3 border border-[#262626] focus:border-[#FF3E00] outline-none rounded-xl"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-[#FF3E00] hover:bg-[#E03700] disabled:bg-[#222222] text-white transition-colors shrink-0 rounded-xl"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
