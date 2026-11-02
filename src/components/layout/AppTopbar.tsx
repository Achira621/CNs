import React from 'react';
import { Search, Bell, Sparkles, Command, Bot } from 'lucide-react';

interface AppTopbarProps {
  onOpenSearch: () => void;
  onOpenAITutor: () => void;
  onOpenMascotTour: () => void;
  notificationCount?: number;
}

export const AppTopbar: React.FC<AppTopbarProps> = ({
  onOpenSearch,
  onOpenAITutor,
  onOpenMascotTour,
  notificationCount = 1,
}) => {
  return (
    <header className="h-16 px-6 border-b border-[#E7E5F0] bg-white/75 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      {/* Global Omnibar Search Trigger */}
      <div className="flex-1 max-w-xl">
        <button
          data-tour="topbar-search"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-2 bg-[#F3F2F8] hover:bg-[#EBE9F4] text-zinc-500 rounded-xl text-xs border border-[#E2DFED] transition-all group shadow-xs cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#8855C7] transition-colors" />
            <span className="font-normal text-zinc-500 group-hover:text-zinc-700">
              Search ciphers, concepts, attacks...
            </span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-zinc-200 text-[10px] font-mono-code font-bold text-zinc-500 shadow-2xs">
            <Command className="w-3 h-3 text-zinc-400" />
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3 ml-4">
        {/* Light Canvas Pill Badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDE9FE] border border-[#DDD6FE] text-[#7C3AED] text-[10px] font-mono-code font-bold tracking-wider uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
          <span>LIGHT CANVAS</span>
        </div>

        {/* AI Tutor Button */}
        <button
          data-tour="topbar-ai-tutor"
          onClick={onOpenAITutor}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8855C7] to-[#7C3AED] text-white text-xs font-semibold hover:opacity-95 shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span className="hidden md:inline">Ask AI Tutor</span>
        </button>

        {/* Notifications Icon with dot */}
        <div className="relative">
          <button
            title="Recent laboratory activity"
            className="w-9 h-9 rounded-xl bg-[#F3F2F8] hover:bg-[#EBE9F4] border border-[#E2DFED] flex items-center justify-center text-zinc-600 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#8855C7] border-2 border-white rounded-full" />
          )}
        </div>

        {/* Replaced VD button with the Cyber Mascot Bot Tour Launcher */}
        <button
          data-tour="topbar-mascot-launcher"
          onClick={onOpenMascotTour}
          title="Launch Interactive Mascot Tour: Explore Every Feature!"
          className="group relative flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#13121F] hover:bg-[#1E1B2E] border-2 border-[#8855C7] hover:border-[#A855F7] text-white shadow-md hover:shadow-lg hover:shadow-[#8855C7]/30 transition-all hover:scale-105 active:scale-95 cursor-pointer select-none"
        >
          {/* Animated pulsing online ping */}
          <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 shadow-[0_0_8px_#34D399] animate-pulse" />

          {/* Mini Robot Head Icon */}
          <div className="w-6 h-6 rounded-lg bg-[#27223D] border border-[#8855C7]/60 flex items-center justify-center text-sm">
            🤖
          </div>

          <div className="flex flex-col text-left leading-none">
            <span className="text-[10px] font-mono-code font-extrabold text-[#C4B5FD] uppercase tracking-wider group-hover:text-white">
              BOT TOUR
            </span>
            <span className="text-[9px] font-mono-code text-zinc-400 group-hover:text-[#B58AE8]">
              Guide
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
