import React from 'react';
import { X, Key, Lock, Sparkles } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (a: number, b: number, sampleText: string) => void;
}

export const PRESETS_LIST = [
  {
    name: 'Caesar Cipher (Shift +3)',
    description: 'Special case of Affine Cipher where a = 1 and b = 3.',
    a: 1,
    b: 3,
    sampleText: 'VENI VIDI VICI',
  },
  {
    name: 'ROT13 Cipher',
    description: 'Symmetric Caesar shift by 13 positions (a = 1, b = 13).',
    a: 1,
    b: 13,
    sampleText: 'HELLO WORLD FROM AFFINE CIPHER',
  },
  {
    name: 'Atbash Cipher (Reversed Alphabet)',
    description: 'Reverses the alphabet (A➔Z, B➔Y) with a = 25 and b = 25.',
    a: 25,
    b: 25,
    sampleText: 'SECRET ATBASH MESSAGE',
  },
  {
    name: 'Standard Affine Cipher (a=5, b=8)',
    description: 'Classic example of multi-letter affine mapping.',
    a: 5,
    b: 8,
    sampleText: 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG',
  },
  {
    name: 'Historical Cryptogram (a=7, b=10)',
    description: 'Intercepted cipher message for breaking in Cryptanalysis tab.',
    a: 7,
    b: 10,
    sampleText: 'IOLT BWWXGU ROBUGT L BWWX',
  },
  {
    name: 'Modular Masterclass Challenge (a=11, b=15)',
    description: 'High multiplicative key challenge for modular inverse practice.',
    a: 11,
    b: 15,
    sampleText: 'MODULAR ARITHMETIC IS THE BACKBONE OF MODERN CRYPTOGRAPHY',
  },
];

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#141414] border border-[#262626] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#FF3E00]" />

        <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#0A0A0A]">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-[#FF3E00]" />
            <h3 className="font-serif-display font-semibold text-sm text-white">
              Cipher Presets & Historical Samples
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-[#1C1C1C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {PRESETS_LIST.map((p, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-[#0A0A0A] border border-[#262626] hover:border-[#FF3E00] transition-all flex items-center justify-between gap-3 group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif-display font-semibold text-xs text-white group-hover:text-[#FF3E00] transition-colors">
                    {p.name}
                  </h4>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 bg-[#181818] text-[#FF3E00] border border-[#333333] font-bold">
                    a={p.a}, b={p.b}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 font-sans">{p.description}</p>
                <div className="text-[10px] font-mono-code text-zinc-300 mt-1.5 bg-[#141414] p-1.5 border border-[#262626] truncate">
                  "{p.sampleText}"
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPreset(p.a, p.b, p.sampleText);
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-[#FF3E00] hover:bg-[#E03700] text-white font-mono-code font-bold text-xs uppercase shrink-0 transition-colors shadow-sm"
              >
                Load
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

