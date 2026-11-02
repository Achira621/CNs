import React from 'react';
import {
  Home,
  Code2,
  Sigma,
  Crosshair,
  BookOpen,
  Trophy,
  Layers,
  GraduationCap,
  Globe2,
  Box,
} from 'lucide-react';
import { BrandLogo } from '../branding/BrandLogo';

export type NavItemKey =
  | 'dashboard'
  | 'studio'
  | 'math'
  | 'attack'
  | 'lessons'
  | 'challenges'
  | 'algorithms'
  | 'practicals'
  | 'scenarios';

interface AppSidebarProps {
  activeKey: NavItemKey;
  onNavigate: (key: NavItemKey) => void;
  onOpenAlgorithmPicker?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activeKey,
  onNavigate,
}) => {
  const navItems: { key: NavItemKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: Home },
    { key: 'studio', label: 'Cipher Studio', icon: Code2 },
    { key: 'math', label: 'Math Visualizer', icon: Sigma },
    { key: 'attack', label: 'Cryptanalysis', icon: Crosshair },
    { key: 'lessons', label: 'Masterclass', icon: BookOpen },
    { key: 'challenges', label: 'Practice & Quizzes', icon: Trophy },
    { key: 'algorithms', label: 'Algorithm Library', icon: Layers },
    { key: 'practicals', label: 'CNS Practicals', icon: GraduationCap },
    { key: 'scenarios', label: 'Real Scenarios', icon: Globe2 },
  ];

  return (
    <aside className="w-64 bg-[#13121F] border-r border-[#26243A] text-zinc-300 flex flex-col shrink-0 min-h-screen select-none z-30 transition-all">
      {/* Top Branding Header */}
      <div className="p-6 border-b border-[#232135] flex items-center justify-between">
        <BrandLogo
          variant="full"
          lightCanvas={false}
          size={36}
          onClick={() => onNavigate('dashboard')}
        />
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeKey === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all group text-left ${
                isActive
                  ? 'bg-[#25223B] text-white font-semibold shadow-inner border border-[#443C68]/60 relative'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#1B192C]'
              }`}
            >
              {isActive && (
                <div className="absolute left-1 w-1 h-5 rounded-full bg-gradient-to-b from-[#B58AE8] to-[#8855C7]" />
              )}
              <Icon
                className={`w-4 h-4 transition-colors ${
                  isActive ? 'text-[#C4B5FD]' : 'text-zinc-400 group-hover:text-zinc-200'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Academic Credits Badge */}
      <div className="p-4 border-t border-[#232135] bg-[#0E0D17]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#8855C7] to-[#5B21B6] flex items-center justify-center text-white shrink-0 shadow-md">
            <Box className="w-5 h-5 text-white/90" />
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="text-[12px] font-semibold text-zinc-200 truncate">
              VIT Cybersecurity Lab
            </p>
            <p className="text-[10px] font-mono-code text-zinc-400 mt-0.5">
              v2.6.0 · Prof. Bhandiwad
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
