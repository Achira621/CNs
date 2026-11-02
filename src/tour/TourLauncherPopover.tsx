import React from 'react';
import {
  Compass,
  MapPin,
  RotateCcw,
  Play,
  Layers,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { TOUR_SECTIONS, TourStep } from './TourRegistry';
import { NavItemKey } from '../components/layout/AppSidebar';

interface TourLauncherPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: NavItemKey | 'algorithm_page';
  onStartFullTour: () => void;
  onStartPageTour: () => void;
  onSelectSection: (sectionId: string) => void;
  hasResumePoint: boolean;
  onResumeTour: () => void;
}

export const TourLauncherPopover: React.FC<TourLauncherPopoverProps> = ({
  isOpen,
  onClose,
  activeNav,
  onStartFullTour,
  onStartPageTour,
  onSelectSection,
  hasResumePoint,
  onResumeTour,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-18 sm:pr-8 bg-black/20 backdrop-blur-xs">
      <div className="w-80 bg-white border border-[#E4E2EE] rounded-3xl shadow-2xl p-5 text-zinc-900 space-y-4 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8855C7] to-[#B58AE8] flex items-center justify-center text-white shadow-sm text-sm">
              🤖
            </div>
            <div>
              <h4 className="text-xs font-mono-code font-bold text-zinc-950 uppercase tracking-wider">
                Cipher Bot Guide
              </h4>
              <p className="text-[10px] font-mono-code text-[#7C3AED]">
                Interactive Roaming Mascot
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Launch Options */}
        <div className="space-y-2">
          {hasResumePoint && (
            <button
              onClick={() => {
                onResumeTour();
                onClose();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#EDE1FF] hover:bg-[#E2D2FF] text-[#7C3AED] text-xs font-mono-code font-bold transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <RotateCcw className="w-4 h-4" />
                <span>Resume Walkthrough</span>
              </div>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}

          <button
            onClick={() => {
              onStartFullTour();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-[#13121F] hover:bg-[#1E1B2E] text-white text-xs font-mono-code font-bold transition-all cursor-pointer group shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[#C4B5FD]" />
              <span>Explore Entire Application</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => {
              onStartPageTour();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono-code font-semibold transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-purple-600" />
              <span>Tour Current Page Only</span>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Direct Section Jumps */}
        <div className="space-y-2 pt-2 border-t border-zinc-100">
          <span className="text-[10px] font-mono-code text-zinc-600 font-bold uppercase tracking-wider block">
            Jump to Section:
          </span>
          <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto pr-1">
            {TOUR_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  onSelectSection(sec.id);
                  onClose();
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] font-mono-code text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="truncate">{sec.label}</span>
                <span className="text-zinc-400 text-[10px]">→</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
