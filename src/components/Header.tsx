import React from 'react';
import {
  Lock,
  Calculator,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  KeyRound,
  Key,
  Home,
  Building2,
  GitFork,
} from 'lucide-react';
import { CipherMethod } from '../types';

interface HeaderProps {
  activeTab: 'studio' | 'math' | 'attack' | 'lessons';
  setActiveTab: (tab: 'studio' | 'math' | 'attack' | 'lessons') => void;
  cipherMethod?: CipherMethod;
  onCipherMethodChange?: (method: CipherMethod) => void;
  cursorEnabled?: boolean;
  onToggleCursor?: () => void;
  onOpenAITutor: () => void;
  onOpenPresets: () => void;
  onGoToHero?: () => void;
  onOpenTreeMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  cipherMethod = 'affine',
  onCipherMethodChange,
  cursorEnabled = true,
  onToggleCursor,
  onOpenAITutor,
  onOpenPresets,
  onGoToHero,
  onOpenTreeMenu,
}) => {
  const navItems = [
    { id: 'studio', label: 'Cipher Studio', icon: Lock },
    { id: 'math', label: 'Math Visualizer', icon: Calculator },
    { id: 'attack', label: 'Cryptanalysis', icon: ShieldCheck },
    { id: 'lessons', label: 'Guided Masterclass', icon: GraduationCap },
  ] as const;

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0E]/90 backdrop-blur-xl border-b border-[#262626] text-zinc-100 shadow-xl">
      {/* Sliding Marquee Animation Header Ticker */}
      <div
        onClick={onGoToHero}
        className="bg-black border-b border-[#262626] py-1.5 overflow-hidden relative cursor-pointer hover:bg-zinc-900 transition-colors group"
        title="Click to view Project Credits & Hero Landing Page"
      >
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-mono-code text-[11px] text-zinc-200">
          {Array.from({ length: 4 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-1.5 font-bold text-[#FF3E00]">
                <Building2 className="w-3 h-3 text-amber-400" />
                VIDYALANKAR INSTITUTE OF TECHNOLOGY
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">CYBERSECURITY PRACTICAL</span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-300 font-semibold">
                CONDUCTED BY PROF. VINITA BHANDIWAD
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-white font-bold">
                PROJECT BY: VARAD DALVI (24101B0040)
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-white font-bold">
                OMKAR BENGALI (24101B0043)
              </span>
              <span className="text-zinc-600">|</span>
              <span className="text-white font-bold">
                SUMIT SURWASE (24101B0022)
              </span>
              <span className="text-zinc-600">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo & Editorial Title */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={onGoToHero}
              className="w-11 h-11 bg-[#141414] text-white border border-[#262626] rounded-[1.1rem] flex items-center justify-center shadow-md hover:bg-[#FF3E00] transition-colors group"
              title="Return to Hero Welcome Page"
            >
              <KeyRound className="w-5 h-5 stroke-[2.2] group-hover:rotate-12 transition-transform text-[#FF3E00] group-hover:text-white" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-code uppercase tracking-[0.2em] text-[#FF3E00] font-bold">
                  VIDYALANKAR TECH
                </span>
                <span className="text-zinc-600">|</span>
                <span className="px-2 py-0.5 text-[9px] font-mono-code font-bold uppercase tracking-wider bg-[#FF3E00]/10 text-[#FF3E00] border border-[#FF3E00]/30 rounded-full">
                  CYBERSECURITY LAB
                </span>
              </div>
              <h1 className="font-serif-display font-semibold text-lg sm:text-xl tracking-tight text-white leading-tight flex items-center gap-2">
                Classical Cryptography <span className="italic font-normal text-zinc-400">Masterclass</span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs - Rounded Pill Design */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#141414] p-1.5 border border-[#262626] rounded-full shadow-inner">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-mono-code uppercase tracking-wider font-bold rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-[#FF3E00] text-white shadow-md shadow-[#FF3E00]/20'
                      : 'text-zinc-400 hover:text-white hover:bg-[#1F1F1F]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Cipher Tree Menu Launcher */}
            {onOpenTreeMenu && (
              <button
                onClick={onOpenTreeMenu}
                className="px-3.5 py-2 text-xs font-mono-code uppercase tracking-wider font-bold bg-[#141414] hover:bg-[#FF3E00] hover:text-white text-[#FF3E00] border border-[#FF3E00]/40 rounded-[0.9rem] transition-all flex items-center gap-1.5 shadow-sm"
                title="Open Interactive Cipher Taxonomy Tree Menu"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cipher Tree</span>
              </button>
            )}

            {/* Hero Page Link */}
            {onGoToHero && (
              <button
                onClick={onGoToHero}
                className="px-3 py-2 text-xs font-mono-code uppercase tracking-wider font-bold bg-[#141414] hover:bg-[#222222] text-zinc-300 border border-[#262626] rounded-[0.9rem] transition-all flex items-center gap-1.5"
                title="View Hero & Project Credits"
              >
                <Home className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Hero</span>
              </button>
            )}

            {/* Key Cursor Toggle */}
            {onToggleCursor && (
              <button
                onClick={onToggleCursor}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-[0.9rem] text-xs font-mono-code font-bold border transition-all ${
                  cursorEnabled
                    ? 'bg-[#141414] text-amber-400 border-amber-500/40 shadow-sm'
                    : 'bg-[#141414] text-zinc-500 border-[#262626] hover:text-zinc-300'
                }`}
                title="Toggle custom Key cursor"
              >
                <Key className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase">Cursor</span>
              </button>
            )}

            <button
              onClick={onOpenPresets}
              className="px-3.5 py-2 text-xs font-mono-code uppercase tracking-wider font-bold bg-[#141414] hover:bg-[#222222] text-zinc-300 border border-[#262626] rounded-[0.9rem] transition-all"
            >
              Presets
            </button>

            <button
              onClick={onOpenAITutor}
              className="px-4 py-2 text-xs font-mono-code uppercase tracking-wider font-bold bg-[#FF3E00] hover:bg-[#E03700] text-white rounded-[0.9rem] transition-all flex items-center gap-2 shadow-md shadow-[#FF3E00]/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Navigation Tabs */}
        <div className="lg:hidden flex items-center justify-between gap-1 pb-3 overflow-x-auto no-scrollbar border-t border-[#262626] pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono-code uppercase tracking-wider font-bold whitespace-nowrap rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#FF3E00] text-white shadow-md'
                    : 'text-zinc-400 hover:bg-[#141414]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};



