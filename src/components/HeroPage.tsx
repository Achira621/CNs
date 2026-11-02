import React from 'react';
import {
  Play,
  BookOpen,
  ArrowRight,
  Landmark,
  Layers,
  Box,
  ShieldCheck,
  Clock,
  Zap,
  Sigma,
  GitCommit,
  Grid,
  BarChart2,
  Lock,
  Calculator,
  Crosshair,
  GraduationCap,
  Sparkles,
  Globe2,
} from 'lucide-react';
import { CosmicPlanet } from './effects/CosmicPlanet';
import { CipherMethod } from '../types';

interface HeroPageProps {
  onOpenCipherStudio: () => void;
  onViewCurriculum: () => void;
  onSelectCategory: (category: string) => void;
  onSelectAlgorithm: (method: CipherMethod) => void;
  onOpenQuickTool: (tool: 'mod26' | 'gcd' | 'matrix' | 'freq') => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({
  onOpenCipherStudio,
  onViewCurriculum,
  onSelectCategory,
  onSelectAlgorithm,
  onOpenQuickTool,
}) => {
  const teamMembers = [
    {
      name: 'Varad Dalvi',
      rollNo: '24101B0040',
      role: 'Lead Cryptographic Architect',
      term: '6 Months',
      badge: 'Team Lead',
      desc: 'Architected the execution engines for Monoalphabetic, Polyalphabetic, DES/AES blocks and Cosmic Lab design system.',
    },
    {
      name: 'Omkar Bengali',
      rollNo: '24101B0043',
      role: 'Modular Math & Frequency Analyst',
      term: '6 Months',
      badge: 'Core Developer',
      desc: 'Engineered the Extended Euclidean Algorithm solver, mod 26 clock geometry, and chi-squared cryptanalysis engine.',
    },
    {
      name: 'Sumit Surwase',
      rollNo: '24101B0022',
      role: 'Security Protocols & Visualizer Dev',
      term: '6 Months',
      badge: 'Core Developer',
      desc: 'Implemented block cipher chaining modes (ECB, CBC, CFB, OFB, CTR) and AI context tutor integration.',
    },
  ];

  return (
    <div className="space-y-10 pb-16 max-w-7xl mx-auto">
      {/* ============================================================ */}
      {/* 1. HERO SECTION (Cosmic White Canvas Composition) */}
      {/* ============================================================ */}
      <section data-tour="dashboard-hero" className="relative pt-6 sm:pt-10 pb-4 overflow-visible">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
          {/* Left Hero Content */}
          <div className="space-y-6 max-w-2xl relative z-10">
            {/* Eyebrow */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-mono-code font-extrabold tracking-[0.25em] text-zinc-800 uppercase">
                  VIT · CYBERSECURITY LAB
                </span>
              </div>
              <div className="w-20 h-0.5 bg-gradient-to-r from-[#8855C7] to-transparent rounded-full" />
            </div>

            {/* Main Headline matching reference */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-medium text-zinc-950 tracking-tight leading-[1.12]">
              Classical Cryptography{' '}
              <span className="block font-serif-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#8855C7] via-[#A855F7] to-[#6366F1]">
                Masterclass
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-600 text-base sm:text-lg leading-relaxed font-sans max-w-xl">
              Explore, implement, and analyze classical and modern ciphers with interactive tools, visualizations, and hands-on practice.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenCipherStudio}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#8855C7] to-[#7C3AED] hover:from-[#7E4ABE] hover:to-[#6D28D9] text-white text-sm font-semibold shadow-lg shadow-[#8855C7]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Open Cipher Studio</span>
              </button>

              <button
                onClick={onViewCurriculum}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-50 border border-zinc-300 text-zinc-800 text-sm font-semibold shadow-xs transition-all hover:border-zinc-400 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-zinc-600" />
                <span>View Curriculum</span>
              </button>
            </div>
          </div>

          {/* Right Hero Artwork: Floating Cosmic Planet */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0 relative">
            <CosmicPlanet size={380} lightCanvas={true} />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FOUR CATEGORY CARDS (High-Contrast Black Boxes) */}
      {/* ============================================================ */}
      <section data-tour="dashboard-categories" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Monoalphabetic */}
        <div
          onClick={() => onSelectCategory('monoalphabetic')}
          className="group relative bg-[#13121F] hover:bg-[#181627] border border-[#24223A] hover:border-amber-500/50 rounded-2xl p-6 text-white shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/80 via-amber-400 to-transparent" />
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-200 transition-colors">
                Monoalphabetic
              </h3>
              <p className="text-xs font-mono-code text-zinc-400 mt-1">
                Caesar, Affine, Substitution
              </p>
            </div>
          </div>
          <div className="pt-4 mt-6 border-t border-[#232135] flex items-center justify-between text-xs text-zinc-400 group-hover:text-amber-300">
            <span>Explore 4 ciphers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Polyalphabetic */}
        <div
          onClick={() => onSelectCategory('polyalphabetic')}
          className="group relative bg-[#13121F] hover:bg-[#181627] border border-[#24223A] hover:border-purple-500/50 rounded-2xl p-6 text-white shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/80 via-purple-400 to-transparent" />
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors">
                Polyalphabetic
              </h3>
              <p className="text-xs font-mono-code text-zinc-400 mt-1">
                Vigenère, Playfair, Hill
              </p>
            </div>
          </div>
          <div className="pt-4 mt-6 border-t border-[#232135] flex items-center justify-between text-xs text-zinc-400 group-hover:text-purple-300">
            <span>Explore 3 ciphers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 3: Block Ciphers */}
        <div
          onClick={() => onSelectCategory('block')}
          className="group relative bg-[#13121F] hover:bg-[#181627] border border-[#24223A] hover:border-blue-500/50 rounded-2xl p-6 text-white shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/80 via-blue-400 to-transparent" />
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                Block Ciphers
              </h3>
              <p className="text-xs font-mono-code text-zinc-400 mt-1">
                DES, 3DES, Modes (ECB, CBC)
              </p>
            </div>
          </div>
          <div className="pt-4 mt-6 border-t border-[#232135] flex items-center justify-between text-xs text-zinc-400 group-hover:text-blue-300">
            <span>Explore 8 ciphers</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 4: Modern Standards */}
        <div
          onClick={() => onSelectCategory('modern')}
          className="group relative bg-[#13121F] hover:bg-[#181627] border border-[#24223A] hover:border-cyan-500/50 rounded-2xl p-6 text-white shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500/80 via-cyan-400 to-transparent" />
          <div className="space-y-4">
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors">
                Modern Standards
              </h3>
              <p className="text-xs font-mono-code text-zinc-400 mt-1">
                AES, RSA, ECC, SHA-256
              </p>
            </div>
          </div>
          <div className="pt-4 mt-6 border-t border-[#232135] flex items-center justify-between text-xs text-zinc-400 group-hover:text-cyan-300">
            <span>Explore 6 standards</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. BOTTOM ROW: CONTINUE LEARNING & QUICK TOOLS */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Continue Learning Card (DES) */}
        <div data-tour="dashboard-continue-learning" className="lg:col-span-7 bg-[#13121F] border border-[#24223A] rounded-2xl p-6 text-white flex flex-col justify-between shadow-md">
          <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400 mb-4">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="uppercase tracking-wider font-semibold">Continue Learning</span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-[#0F0E1B] border border-[#232035] p-4 rounded-xl">
            <div className="flex items-center gap-4 min-w-0">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8855C7] to-[#1E1338] flex items-center justify-center text-white shrink-0 border border-[#3E3466]">
                <Box className="w-6 h-6 text-[#C4B5FD]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-zinc-100 truncate">
                  DES – Data Encryption Standard
                </h4>
                <p className="text-xs text-zinc-400 font-mono-code mt-0.5">
                  16-round Feistel structure & key scheduling
                </p>
                {/* Progress Bar */}
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="w-44 h-1.5 bg-[#25223A] rounded-full overflow-hidden">
                    <div className="w-[72%] h-full bg-gradient-to-r from-[#8855C7] to-[#B58AE8] rounded-full" />
                  </div>
                  <span className="text-[11px] font-mono-code text-zinc-400 font-bold">72%</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectAlgorithm('des')}
              className="w-10 h-10 rounded-full bg-[#8855C7] hover:bg-[#7844B5] text-white flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </button>
          </div>
        </div>

        {/* Quick Tools Grid */}
        <div data-tour="dashboard-quick-tools" className="lg:col-span-5 bg-[#13121F] border border-[#24223A] rounded-2xl p-6 text-white flex flex-col justify-between shadow-md">
          <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400 mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="uppercase tracking-wider font-semibold">Quick Tools</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Tool 1: Mod 26 */}
            <button
              onClick={() => onOpenQuickTool('mod26')}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#1A192C] hover:bg-[#25223D] border border-[#2D2A48] hover:border-[#8855C7] transition-all cursor-pointer group"
            >
              <Sigma className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono-code text-zinc-300 font-semibold">Mod 26</span>
            </button>

            {/* Tool 2: GCD */}
            <button
              onClick={() => onOpenQuickTool('gcd')}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#1A192C] hover:bg-[#25223D] border border-[#2D2A48] hover:border-[#8855C7] transition-all cursor-pointer group"
            >
              <GitCommit className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono-code text-zinc-300 font-semibold">GCD</span>
            </button>

            {/* Tool 3: Matrix */}
            <button
              onClick={() => onOpenQuickTool('matrix')}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#1A192C] hover:bg-[#25223D] border border-[#2D2A48] hover:border-[#8855C7] transition-all cursor-pointer group"
            >
              <Grid className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono-code text-zinc-300 font-semibold">Matrix</span>
            </button>

            {/* Tool 4: Freq Analysis */}
            <button
              onClick={() => onOpenQuickTool('freq')}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-[#1A192C] hover:bg-[#25223D] border border-[#2D2A48] hover:border-[#8855C7] transition-all cursor-pointer group"
            >
              <BarChart2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-mono-code text-zinc-300 font-semibold">Freq. Anal.</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. THE LABORATORY: ONE DESIGN SYSTEM. EVERY ALGORITHM. */}
      {/* ============================================================ */}
      <section data-tour="dashboard-laboratory" className="bg-[#13121F] border border-[#24223A] rounded-3xl p-6 sm:p-10 text-white shadow-xl space-y-6">
        <div className="space-y-2">
          <span className="text-[11px] font-mono-code font-bold uppercase tracking-[0.2em] text-[#B58AE8]">
            THE LABORATORY
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif-display font-bold text-white">
            One design system. Every algorithm.
          </h2>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Consistent dark workbenches, mathematical visualizations, and algorithm-specific experiences across classical, modern, asymmetric, and hashing paradigms.
          </p>
        </div>

        {/* 4 Laboratory Workbenches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div
            onClick={onOpenCipherStudio}
            className="p-5 rounded-2xl bg-[#181729] hover:bg-[#201D36] border border-[#292642] hover:border-[#8855C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono-code text-[#B58AE8] font-bold">01 / 10</span>
              <Lock className="w-4 h-4 text-[#C4B5FD]" />
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-[#EDE1FF]">
              Cipher Studio
            </h4>
            <p className="text-xs text-zinc-400 mt-1 font-mono-code">
              Interactive experiments & live key vector controls
            </p>
          </div>

          <div
            onClick={() => onOpenQuickTool('mod26')}
            className="p-5 rounded-2xl bg-[#181729] hover:bg-[#201D36] border border-[#292642] hover:border-[#8855C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono-code text-[#B58AE8] font-bold">02 / 10</span>
              <Calculator className="w-4 h-4 text-[#C4B5FD]" />
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-[#EDE1FF]">
              Math Laboratory
            </h4>
            <p className="text-xs text-zinc-400 mt-1 font-mono-code">
              Mod 26, GCD, Extended Euclidean & Hill Inverses
            </p>
          </div>

          <div
            onClick={() => onSelectCategory('attack')}
            className="p-5 rounded-2xl bg-[#181729] hover:bg-[#201D36] border border-[#292642] hover:border-[#8855C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono-code text-[#B58AE8] font-bold">03 / 10</span>
              <Crosshair className="w-4 h-4 text-[#C4B5FD]" />
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-[#EDE1FF]">
              Cryptanalysis Lab
            </h4>
            <p className="text-xs text-zinc-400 mt-1 font-mono-code">
              Chi-squared analysis, Kasiski & MITM attacks
            </p>
          </div>

          <div
            onClick={() => onSelectCategory('practicals')}
            className="p-5 rounded-2xl bg-[#181729] hover:bg-[#201D36] border border-[#292642] hover:border-[#8855C7] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono-code text-[#B58AE8] font-bold">04 / 10</span>
              <GraduationCap className="w-4 h-4 text-[#C4B5FD]" />
            </div>
            <h4 className="font-bold text-sm text-white group-hover:text-[#EDE1FF]">
              CNS Guided Practicals
            </h4>
            <p className="text-xs text-zinc-400 mt-1 font-mono-code">
              VIT syllabus experiments & report generation
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. ACADEMIC CREDITS & ENGINEERING TEAM */}
      {/* ============================================================ */}
      <section className="bg-white border border-[#E4E2EE] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
          <div>
            <span className="text-[11px] font-mono-code font-bold uppercase tracking-wider text-[#8855C7]">
              Academic Faculty & Institution
            </span>
            <h3 className="text-xl font-bold text-zinc-900 mt-0.5">
              Vidyalankar Institute of Technology (VIT)
            </h3>
            <p className="text-xs font-mono-code text-zinc-500 mt-0.5">
              Subject: Cybersecurity and Network Security (CNS) · Faculty: Prof. Vinita Bhandiwad
            </p>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono-code font-bold inline-flex items-center gap-1.5 self-start sm:self-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Academic Practical Term Verified</span>
          </div>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-[#13121F] border border-[#24223A] rounded-2xl p-5 text-white space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-[#8855C7]/20 border border-[#8855C7]/30 text-[#C4B5FD] text-[10px] font-mono-code font-bold">
                  {member.badge}
                </span>
                <span className="text-[11px] font-mono-code text-zinc-400">{member.term}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{member.name}</h4>
                <p className="text-xs font-mono-code text-[#B58AE8] mt-0.5">
                  Roll No: {member.rollNo}
                </p>
                <p className="text-[11px] font-mono-code text-zinc-400 mt-0.5">{member.role}</p>
              </div>

              <p className="text-xs text-zinc-400 font-mono-code leading-relaxed pt-2 border-t border-[#232135]">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
