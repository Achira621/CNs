import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Calculator,
  GraduationCap,
  Sparkles,
  ArrowRight,
  User,
  Building2,
  Award,
  KeyRound,
  Zap,
  Binary,
  Layers,
  ChevronRight,
  Cpu,
  Compass,
  LayoutGrid,
} from 'lucide-react';
import { CyberMascotCanvas } from './CyberMascotCanvas';
import { CryptoKnowledgeGraph, GraphNode } from './CryptoKnowledgeGraph';
import { CryptoOmnibar } from './CryptoOmnibar';

interface HeroPageProps {
  onGetIntoApp: () => void;
  onOpenMenu: () => void;
  onSelectTopicNode?: (node: GraphNode) => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({ onGetIntoApp, onOpenMenu, onSelectTopicNode }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroMode, setHeroMode] = useState<'graph' | 'curriculum'>('graph');
  const [graphFilter, setGraphFilter] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.round((window.scrollY / totalHeight) * 100));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teamMembers = [
    {
      name: 'Varad Dalvi',
      rollNo: '24101B0040',
      role: 'Lead Cryptographic Architect',
      duration: 'Practical Term: 6 Months',
      badge: 'Team Lead',
      review:
        'Architected the Monoalphabetic, Polyalphabetic, and Block Cipher execution engines. Designed interactive modular visualizers.',
    },
    {
      name: 'Omkar Bengali',
      rollNo: '24101B0043',
      role: 'Modular Math & Frequency Analyst',
      duration: 'Practical Term: 6 Months',
      badge: 'Core Developer',
      review:
        'Implemented the Extended Euclidean Algorithm solver, Mod 26 clock geometry, and chi-squared frequency analysis engine.',
    },
    {
      name: 'Sumit Surwase',
      rollNo: '24101B0022',
      role: 'Security Protocols & Visualizer Dev',
      duration: 'Practical Term: 6 Months',
      badge: 'Core Developer',
      review:
        'Built the Block Cipher mode state diagrams (ECB, CBC, CFB, OFB, CTR) and AI Tutor context drawer integration.',
    },
  ];

  const features = [
    {
      icon: Lock,
      title: 'Substitution Studio',
      tagline: 'Mono & Polyalphabetic',
      desc: 'Encrypt & decrypt using Caesar, Multiplicative, Affine, Vigenère, Playfair, and Hill ciphers with live key vectors.',
      cta: 'Explore Studio',
    },
    {
      icon: Cpu,
      title: '2DES, 3DES & AES',
      tagline: 'Modern FIPS Standards',
      desc: 'Step-by-step 2DES cascading pipeline, MITM attack simulation, 3DES EDE mode, and 128/192/256-bit AES Rijndael state matrix.',
      cta: 'Explore Modern Ciphers',
    },
    {
      icon: Binary,
      title: 'Block Cipher Modes',
      tagline: 'ECB, CBC, CFB, OFB, CTR',
      desc: 'Interactive step-by-step XOR vector chaining, IV feedback loops, and parallel counter keystream generators.',
      cta: 'Explore Block Modes',
    },
    {
      icon: Calculator,
      title: 'Modular Mathematics',
      tagline: 'Algebra & Geometry',
      desc: 'Visualize Mod 26 clock geometry, coprimality heatmaps, Galois Field GF(2⁸) multipliers, and AES S-Box matrices.',
      cta: 'Launch Math Lab',
    },
    {
      icon: ShieldCheck,
      title: 'Cryptanalysis Engine',
      tagline: 'Brute Force, MITM & SAC',
      desc: 'Real-time chi-squared English frequency analysis, 2DES Meet-in-the-Middle cracker, and AES Strict Avalanche Criterion.',
      cta: 'Launch Attack Engine',
    },
  ];

  const loadingStatuses = [
    'Initializing block cipher matrix... OUO',
    'Charging key vector generators... >/<',
    'Loading modular mod 26 clock... +_+',
    'Preparing student practical review... O_O',
    'Verifying Vercel edge runtime... >_<',
  ];

  const quickPills = [
    'AES-256 Rijndael',
    'Meet-in-the-Middle',
    'Playfair Matrix',
    'Mod 26 Clock',
    'Affine Cipher',
    'CBC Chaining',
  ];

  const handleSelectNode = (node: GraphNode) => {
    if (onSelectTopicNode) {
      onSelectTopicNode(node);
    } else {
      onGetIntoApp();
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-zinc-100 font-sans relative overflow-x-hidden flex flex-col justify-between selection:bg-[#FF3E00] selection:text-white">
      {/* Top Banner Status Marquee */}
      <div className="bg-black border-b border-[#262626] py-2 overflow-hidden relative shadow-md z-30">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-mono-code text-xs text-zinc-200">
          {Array.from({ length: 3 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
                <span className="text-[#FF3E00] font-bold">VIDYALANKAR INSTITUTE OF TECHNOLOGY</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-amber-400 font-semibold">CYBERSECURITY PRACTICAL</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300 font-medium">PROF. VINITA BHANDIWAD</span>
              <span className="text-zinc-600">•</span>
              {loadingStatuses.map((st, stIdx) => (
                <span key={stIdx} className="text-zinc-200 font-mono-code flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">[STATUS]</span>
                  <span>{st}</span>
                  <span className="text-zinc-600">•</span>
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Floating Mode Toggle (Graph Universe vs Curriculum Cards) */}
      <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 bg-[#121218]/90 backdrop-blur-xl border border-[#2b2b3a] p-1.5 rounded-full shadow-2xl flex items-center gap-1.5">
        <button
          onClick={() => setHeroMode('graph')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
            heroMode === 'graph'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Knowledge Graph</span>
        </button>
        <button
          onClick={() => setHeroMode('curriculum')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all ${
            heroMode === 'curriculum'
              ? 'bg-[#FF3E00] text-white shadow-md shadow-[#FF3E00]/30'
              : 'text-zinc-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Curriculum Cards</span>
        </button>
      </div>

      {/* Side Vertical Navigation (Desktop) */}
      <div className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-6 bg-[#141414]/90 backdrop-blur-md border border-[#262626] p-3 rounded-full shadow-xl">
        <span className="text-[10px] font-mono-code font-bold text-[#FF3E00] -rotate-90 py-2 tracking-widest uppercase">
          NAV
        </span>
        <div className="w-4 h-[1px] bg-[#262626]" />
        <button
          onClick={onGetIntoApp}
          title="Enter Cipher Studio"
          className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#FF3E00] transition-colors flex items-center justify-center text-white text-xs font-mono-code font-bold"
        >
          01
        </button>
        <button
          onClick={onOpenMenu}
          title="Taxonomy Menu"
          className="w-8 h-8 rounded-full bg-[#181818] hover:bg-[#FF3E00] transition-colors flex items-center justify-center text-white text-xs font-mono-code font-bold"
        >
          02
        </button>
      </div>

      {/* Right Vertical Scroll Progress Meter */}
      {heroMode === 'curriculum' && (
        <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 bg-[#141414]/90 backdrop-blur-md border border-[#262626] py-4 px-2.5 rounded-full shadow-xl font-mono-code text-[11px] text-zinc-300">
          <span className="text-[#FF3E00] font-bold">{scrollProgress}%</span>
          <div className="w-1.5 h-20 bg-[#222222] rounded-full relative overflow-hidden">
            <div
              className="w-full bg-gradient-to-b from-[#FF3E00] to-amber-500 transition-all duration-150 rounded-full"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* MAIN VIEW: Knowledge Graph Universe (Learn-Anything Inspired Mode) */}
      {heroMode === 'graph' ? (
        <div className="relative flex-1 w-full h-[calc(100vh-80px)] overflow-hidden flex flex-col justify-center items-center">
          {/* Interactive Canvas Physics Graph in the background */}
          <div className="absolute inset-0 z-0">
            <CryptoKnowledgeGraph
              onNodeSelect={handleSelectNode}
              filterQuery={graphFilter}
              className="w-full h-full"
            />
          </div>

          {/* Centered Hero & Search UI Overlay (Modeled on Learn Anything) */}
          <div className="relative z-20 w-full max-w-2xl px-4 text-center pointer-events-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#14141a]/90 border border-[#2c2c3d] rounded-full text-xs font-mono text-zinc-300 mb-4 shadow-xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Interactive Cryptographic Knowledge Graph</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-serif-display font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-md">
              I want to explore
            </h1>

            {/* Omnibar Input */}
            <div className="mb-4">
              <CryptoOmnibar
                onSelectNode={handleSelectNode}
                onInputChange={setGraphFilter}
                className="w-full"
              />
            </div>

            {/* Topic Suggestion Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="text-xs font-mono text-zinc-500">Quick topics:</span>
              {quickPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => setGraphFilter(pill)}
                  className="px-3 py-1 rounded-full text-xs font-mono bg-[#14141c]/80 hover:bg-indigo-600/20 border border-[#262638] hover:border-indigo-500/40 text-zinc-300 hover:text-white transition-all backdrop-blur-sm"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-center gap-3 pt-6">
              <button
                onClick={onGetIntoApp}
                className="group inline-flex items-center gap-2 px-6 py-3 bg-[#FF3E00] hover:bg-[#E03700] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF3E00]/20 transition-all hover:scale-105 active:scale-95"
              >
                <KeyRound className="w-4 h-4 text-amber-200" />
                <span>Open Full Studio</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => setHeroMode('curriculum')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-[#14141c]/90 hover:bg-[#1f1f2e] border border-[#2c2c3d] text-zinc-300 hover:text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all hover:scale-105"
              >
                <span>Curriculum Review</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* CURRICULUM MODE: Structured Course & Team Review Cards */
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 my-auto w-full">
          {/* Top Institution Pill */}
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#141414] border border-[#262626] rounded-full text-xs font-mono-code shadow-md">
              <Building2 className="w-4 h-4 text-[#FF3E00]" />
              <span className="text-zinc-200 font-semibold">VIDYALANKAR INSTITUTE OF TECHNOLOGY</span>
              <span className="text-zinc-600">|</span>
              <span className="text-[#FF3E00] font-bold">CYBERSECURITY PRACTICAL</span>
            </div>

            {/* Hero Main Grid Layout (Text + Interactive 3D Mascot Canvas) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full pt-4">
              {/* Left Content Column */}
              <div className="lg:col-span-7 text-center lg:text-left space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3E00]/10 border border-[#FF3E00]/30 rounded-lg text-[11px] font-mono-code text-[#FF3E00] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MONO, POLY, BLOCK & MODERN STANDARDS (15 CIPHERS)</span>
                  </div>

                  <h1 className="text-4xl sm:text-6xl font-serif-display font-extrabold text-white tracking-tight leading-[1.1]">
                    Classical Cryptography & <br />
                    <span className="bg-gradient-to-r from-[#FF3E00] via-amber-500 to-emerald-400 bg-clip-text text-transparent italic">
                      Block Cipher Studio
                    </span>
                  </h1>
                </div>

                <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Master classical ciphers (Caesar, Affine, Vigenère, Playfair, Hill), complete block modes (ECB, CBC, CFB, OFB, CTR), and modern industry standards including **Single DES, 2DES, 3DES (EDE)**, and **AES (Rijndael FIPS 197)**.
                </p>

                {/* Faculty Guidance Card */}
                <div className="inline-flex items-center gap-3 px-4 py-3 bg-[#141414] border border-[#262626] rounded-2xl shadow-md font-mono-code text-xs text-zinc-300">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
                      PRACTICAL CONDUCTED BY
                    </span>
                    <span className="text-white font-bold text-sm">Prof. Vinita Bhandiwad</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <button
                    onClick={onGetIntoApp}
                    className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#FF3E00] hover:bg-[#E03700] text-white text-sm font-mono-code font-bold uppercase tracking-wider rounded-2xl shadow-xl shadow-[#FF3E00]/20 transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    <KeyRound className="w-5 h-5 text-amber-200 group-hover:text-white" />
                    <span>Enter Cipher Studio</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </button>

                  <button
                    onClick={() => setHeroMode('graph')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-200 text-sm font-mono-code font-bold uppercase tracking-wider rounded-2xl transition-all hover:scale-105 shadow-sm"
                  >
                    <Compass className="w-4 h-4 text-indigo-400" />
                    <span>Knowledge Universe</span>
                  </button>
                </div>
              </div>

              {/* Right Interactive 3D Mascot Canvas Column */}
              <div className="lg:col-span-5 relative">
                <div className="bg-[#141414] border border-[#262626] rounded-3xl p-2 shadow-2xl relative overflow-hidden cyber-frame-border">
                  <div className="absolute top-3 left-4 right-4 flex items-center justify-between font-mono-code text-[10px] text-zinc-500 z-10 pointer-events-none">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      LIVE 3D VAULT
                    </span>
                    <span>DRAG TO TILT</span>
                  </div>
                  <CyberMascotCanvas />
                </div>
              </div>
            </div>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h2 className="text-xs font-mono-code font-bold text-[#FF3E00] uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF3E00]" />
                <span>INCLUDED PRACTICAL MODULES</span>
              </h2>
              <span className="text-xs font-mono-code text-zinc-500">15 CIPHER ALGORITHMS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {features.map((feat, fIdx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={fIdx}
                    onClick={onGetIntoApp}
                    className="bg-[#141414] border border-[#262626] rounded-2xl p-5 space-y-3 hover:border-[#FF3E00]/60 transition-all duration-300 cyber-card-glow cursor-pointer group flex flex-col justify-between shadow-xl"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] border border-[#262626] flex items-center justify-center text-[#FF3E00] group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono-code text-[#FF3E00] font-bold uppercase tracking-wider block">
                          {feat.tagline}
                        </span>
                        <h4 className="text-base font-serif-display font-bold text-white group-hover:text-[#FF3E00] transition-colors">
                          {feat.title}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {feat.desc}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-xs font-mono-code text-zinc-400 group-hover:text-white font-bold">
                      <span>{feat.cta}</span>
                      <ArrowRight className="w-4 h-4 text-[#FF3E00] transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Practical Portfolio Review Cards */}
          <div className="mt-16 space-y-6">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h2 className="text-xs font-mono-code font-bold text-[#FF3E00] uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>PROJECT DEVELOPED BY (STUDENT TEAM REVIEW)</span>
              </h2>
              <span className="text-xs font-mono-code text-zinc-500">VIT CYBERSECURITY DEPT</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl hover:border-[#FF3E00]/60 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] text-white border border-[#262626] flex items-center justify-center font-mono-code font-bold shadow-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-base font-serif-display font-bold text-white group-hover:text-[#FF3E00] transition-colors">
                          {member.name}
                        </h3>
                        <span className="text-[11px] font-mono-code text-[#FF3E00] font-bold block">
                          ROLL: {member.rollNo}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-[10px] font-mono-code font-bold uppercase tracking-wider bg-[#FF3E00]/10 text-[#FF3E00] border border-[#FF3E00]/20 rounded-full">
                      {member.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-[11px] font-mono-code text-zinc-500 block">
                      {member.duration}
                    </span>
                    <p className="text-xs text-zinc-300 font-sans leading-relaxed bg-[#0A0A0A] p-3 rounded-xl border border-[#262626]">
                      "{member.review}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Reverse Marquee Ticker */}
      <div className="bg-black border-t border-[#262626] py-2 overflow-hidden relative z-30">
        <div className="animate-marquee-reverse whitespace-nowrap flex items-center gap-8 font-mono-code text-[11px] text-zinc-300">
          {Array.from({ length: 3 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="text-amber-400 font-bold">VIDYALANKAR INSTITUTE OF TECHNOLOGY</span>
              <span>•</span>
              <span className="text-[#FF3E00]">CYBERSECURITY PRACTICAL</span>
              <span>•</span>
              <span>CONDUCTED BY PROF. VINITA BHANDIWAD</span>
              <span>•</span>
              <span className="text-white">VARAD DALVI (24101B0040)</span>
              <span>|</span>
              <span className="text-white">OMKAR BENGALI (24101B0043)</span>
              <span>|</span>
              <span className="text-white">SUMIT SURWASE (24101B0022)</span>
              <span>•</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
