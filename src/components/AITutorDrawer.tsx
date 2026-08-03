import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { X, Sparkles, Send, Bot, User, Loader2, HelpCircle } from 'lucide-react';

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
      text: "Hello! I am **Professor Modulo**, your AI Cryptography Tutor. Ask me anything about the Affine Cipher, modular arithmetic, coprimality, or how to break ciphers!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "Why must key 'a' be coprime to 26?",
    "How does the Extended Euclidean algorithm find a⁻¹?",
    "What is a Known-Plaintext Attack on Affine cipher?",
    "Show an example of encrypting 'MATH' with a=5, b=8.",
  ];

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

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
          context: contextData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: data.text || 'No response',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'tutor',
          text: `⚠️ Error: ${err.message || 'Could not connect to AI Tutor. Check GEMINI_API_KEY.'}`,
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
            <div className="w-8 h-8 bg-[#FF3E00] flex items-center justify-center text-white font-bold">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-serif-display font-semibold text-sm text-white flex items-center gap-2">
                Professor Modulo
                <span className="px-1.5 py-0.5 text-[9px] bg-[#1A1A1A] text-amber-400 border border-[#333] font-mono-code font-bold uppercase">
                  Gemini AI
                </span>
              </h3>
              <p className="text-[10px] font-mono-code text-zinc-500 uppercase tracking-wider">Academic Cryptographer</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#1C1C1C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
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
                className={`w-7 h-7 flex items-center justify-center shrink-0 font-mono-code text-xs font-bold ${
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
                className={`max-w-[85%] p-3.5 text-xs leading-relaxed font-sans ${
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
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#FF3E00] p-3 bg-[#0A0A0A] border border-[#262626]">
              <Loader2 className="w-4 h-4 animate-spin text-[#FF3E00]" />
              <span>Professor Modulo is computing response...</span>
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
              className="px-2.5 py-1 text-[10px] font-mono-code bg-[#141414] hover:bg-[#1F1F1F] text-zinc-300 border border-[#262626] whitespace-nowrap transition-colors"
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
            placeholder="ASK PROFESSOR MODULO..."
            className="flex-1 bg-[#141414] text-white text-xs font-mono-code p-3 border border-[#262626] focus:border-[#FF3E00] outline-none"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-[#FF3E00] hover:bg-[#E03700] disabled:bg-[#222222] text-white transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

