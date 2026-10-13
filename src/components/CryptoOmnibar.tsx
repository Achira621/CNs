import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Sparkles, ArrowRight, CornerDownLeft, X, Command } from 'lucide-react';
import { CRYPTO_NODES, GraphNode } from './CryptoKnowledgeGraph';

interface CryptoOmnibarProps {
  onSelectNode: (node: GraphNode) => void;
  onInputChange?: (val: string) => void;
  className?: string;
  autoFocus?: boolean;
}

const PLACEHOLDERS = [
  'AES-256 Rijndael State Matrix',
  'Meet-in-the-Middle Attack on 2DES',
  'Mod 26 Clock Geometry',
  'Playfair 5x5 Digram Matrix',
  'Affine Dual-Key Linear Cipher',
  'Extended Euclidean Inverse Solver',
  'Chi-Squared English Frequency Cracker',
  'CBC Vector Chaining & IV Feedback',
  'Galois Field GF(2⁸) Multiplier',
  'Vigenère Polyalphabetic Table',
];

export const CryptoOmnibar: React.FC<CryptoOmnibarProps> = ({
  onSelectNode,
  onInputChange,
  className = '',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cycle placeholder smoothly when not typing
  useEffect(() => {
    if (query) return;
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [query]);

  // Filter nodes based on query
  const filteredNodes = useMemo(() => {
    if (!query.trim()) {
      return CRYPTO_NODES.slice(0, 6);
    }
    const q = query.toLowerCase().trim();
    return CRYPTO_NODES.filter(
      (n) =>
        n.prettyName.toLowerCase().includes(q) ||
        n.name.toLowerCase().includes(q) ||
        n.categoryLabel.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredNodes]);

  // Handle external clicks
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Global Ctrl+K / Cmd+K focus listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(true);
    setIsTyping(true);
    onInputChange?.(val);
  };

  const handleSelect = (node: GraphNode) => {
    setIsOpen(false);
    setQuery('');
    onInputChange?.('');
    onSelectNode(node);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredNodes.length);
      setIsOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredNodes.length) % filteredNodes.length);
      setIsOpen(true);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredNodes[selectedIndex]) {
        handleSelect(filteredNodes[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-xl mx-auto z-30 ${className}`}>
      {/* Search Input Box */}
      <div
        className={`relative flex items-center bg-[#101017]/95 backdrop-blur-xl border border-[#2b2b38] transition-all duration-200 shadow-2xl ${
          isOpen && filteredNodes.length > 0
            ? 'rounded-t-2xl border-b-[#1c1c24]'
            : 'rounded-2xl hover:border-indigo-500/50 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10'
        }`}
      >
        <div className="pl-4 pr-2 text-zinc-400 flex items-center">
          <Search className="w-5 h-5 text-indigo-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          autoFocus={autoFocus}
          placeholder={`Explore ${PLACEHOLDERS[placeholderIndex]}...`}
          className="w-full bg-transparent py-3.5 sm:py-4 pr-3 text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 outline-none font-sans"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('');
              onInputChange?.('');
              inputRef.current?.focus();
            }}
            className="p-1.5 mr-2 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1 mr-3.5 px-2 py-1 rounded-md bg-[#1a1a24] border border-[#2e2e3e] text-[10px] font-mono text-zinc-400">
          <Command className="w-3 h-3 text-zinc-400" />
          <span>K</span>
        </div>
      </div>

      {/* Autocomplete Dropdown Menu */}
      {isOpen && filteredNodes.length > 0 && (
        <div className="absolute left-0 right-0 top-full bg-[#101017]/95 backdrop-blur-xl border border-t-0 border-[#2b2b38] rounded-b-2xl shadow-2xl overflow-hidden z-40 max-h-80 overflow-y-auto divide-y divide-white/5 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-2 text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase flex items-center justify-between bg-black/20">
            <span>{query ? 'Matching Cryptographic Topics' : 'Suggested Explorations'}</span>
            <span>Use ↑↓ to navigate • ↵ to select</span>
          </div>

          {filteredNodes.map((node, index) => {
            const isSelected = index === selectedIndex;
            return (
              <div
                key={node.id}
                onClick={() => handleSelect(node)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all ${
                  isSelected ? 'bg-indigo-600/20 text-white' : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                    style={{ backgroundColor: node.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm truncate">{node.prettyName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 shrink-0">
                        {node.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 truncate mt-0.5">{node.description}</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      <span>Launch</span>
                      <CornerDownLeft className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
