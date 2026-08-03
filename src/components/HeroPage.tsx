import React from 'react';
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
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface HeroPageProps {
  onGetIntoApp: () => void;
}

export const HeroPage: React.FC<HeroPageProps> = ({ onGetIntoApp }) => {
  const teamMembers = [
    {
      name: 'Varad Dalvi',
      rollNo: '24101B0040',
      role: 'Lead Cryptographic Architect',
      badge: 'Team Lead',
      avatarGradient: 'from-orange-500 to-amber-600',
    },
    {
      name: 'Omkar Bengali',
      rollNo: '24101B0043',
      role: 'Modular Math & Frequency Analyst',
      badge: 'Core Developer',
      avatarGradient: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Sumit Surwase',
      rollNo: '24101B0022',
      role: 'Security Protocols & Visualizer Dev',
      badge: 'Core Developer',
      avatarGradient: 'from-red-500 to-amber-500',
    },
  ];

  const features = [
    {
      icon: Lock,
      title: 'Interactive Cipher Studio',
      desc: 'Encrypt & decrypt using Caesar, Multiplicative, and Affine ciphers with live key-vector transformations.',
    },
    {
      icon: Calculator,
      title: 'Modular Mathematics Lab',
      desc: 'Visualize Mod 26 clock geometry, Extended Euclidean Algorithm, and coprimality heatmaps.',
    },
    {
      icon: ShieldCheck,
      title: 'Cryptanalysis Attack Engine',
      desc: 'Real-time brute force scanner & known-plaintext linear system solver to break ciphers.',
    },
    {
      icon: GraduationCap,
      title: 'Guided Masterclass',
      desc: 'Step-by-step interactive theory lessons, live calculators, and knowledge quizzes.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans relative overflow-hidden flex flex-col justify-between">
      {/* Background Decorative Grids & Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f15_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f15_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF3E00]/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Banner Ticker / Sliding Marquee Animation */}
      <div className="bg-[#141414] border-b border-[#262626] py-2.5 overflow-hidden relative shadow-lg">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 font-mono-code text-xs text-zinc-300">
          {Array.from({ length: 4 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
                <span className="text-[#FF3E00] font-bold">VIDYALANKAR INSTITUTE OF TECHNOLOGY</span>
              </span>
              <span className="text-zinc-500">•</span>
              <span>CYBERSECURITY PRACTICAL</span>
              <span className="text-zinc-500">•</span>
              <span className="text-amber-400 font-semibold">CONDUCTED BY PROF. VINITA BHANDIWAD</span>
              <span className="text-zinc-500">•</span>
              <span className="text-white font-bold">PROJECT BY: VARAD DALVI (24101B0040)</span>
              <span className="text-zinc-500">|</span>
              <span className="text-white font-bold">OMKAR BENGALI (24101B0043)</span>
              <span className="text-zinc-500">|</span>
              <span className="text-white font-bold">SUMIT SURWASE (24101B0022)</span>
              <span className="text-zinc-500">•</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Hero Section Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 my-auto">
        {/* Header Institution Pill */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#181818] border border-[#333333] rounded-full text-xs font-mono-code shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
            <Building2 className="w-4 h-4 text-[#FF3E00]" />
            <span className="text-zinc-300 font-semibold">
              VIDYALANKAR INSTITUTE OF TECHNOLOGY
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-[#FF3E00] font-bold">CYBERSECURITY PRACTICAL</span>
          </div>

          {/* Main Title */}
          <div className="max-w-4xl space-y-4">
            <h1 className="text-4xl sm:text-6xl font-serif-display font-semibold text-white tracking-tight leading-[1.1]">
              Classical Cryptography & <br />
              <span className="bg-gradient-to-r from-[#FF3E00] via-amber-400 to-[#FF3E00] bg-clip-text text-transparent italic">
                Modular Mathematics Lab
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-sans leading-relaxed">
              An interactive academic suite exploring Caesar, Multiplicative, and Affine ciphers, Modular Geometry, frequency cryptanalysis, and step-by-step modular algebra.
            </p>
          </div>

          {/* Faculty Guidance Highlight Card */}
          <div className="flex items-center gap-3 px-5 py-3 bg-[#141414] border border-[#262626] rounded-2xl shadow-xl font-mono-code text-xs text-zinc-300">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">
                PRACTICAL CONDUCTED BY
              </span>
              <span className="text-white font-bold text-sm">Prof. Vinita Bhandiwad</span>
            </div>
          </div>

          {/* Call To Action Button (Get Into The App) */}
          <div className="pt-4">
            <button
              onClick={onGetIntoApp}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#FF3E00] hover:bg-[#E03700] text-white text-base font-mono-code font-bold uppercase tracking-wider rounded-2xl shadow-2xl shadow-[#FF3E00]/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <KeyRound className="w-5 h-5 text-amber-200" />
              <span>Get Into The App</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1.5" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF3E00] to-amber-500 blur-lg opacity-30 group-hover:opacity-70 transition duration-300 -z-10" />
            </button>
          </div>
        </div>

        {/* Student Team Credits Grid */}
        <div className="mt-16 space-y-4">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <h2 className="text-xs font-mono-code font-bold text-[#FF3E00] uppercase tracking-[0.2em] flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>PROJECT DEVELOPED BY (STUDENT TEAM)</span>
            </h2>
            <span className="text-xs font-mono-code text-zinc-500">DEPARTMENT OF CYBERSECURITY</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="bg-[#141414] border border-[#262626] rounded-3xl p-5 shadow-xl hover:border-[#FF3E00]/60 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between space-y-4"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF3E00]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1C1C1C] to-[#282828] border border-[#3A3A3A] flex items-center justify-center font-mono-code font-bold text-[#FF3E00] shadow-md group-hover:scale-110 transition-transform">
                    {member.name.charAt(0)}
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-mono-code font-bold uppercase tracking-wider bg-[#FF3E00]/10 text-[#FF3E00] border border-[#FF3E00]/20 rounded-full">
                    {member.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-serif-display font-semibold text-white group-hover:text-[#FF3E00] transition-colors">
                    {member.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 font-mono-code text-xs text-amber-400 font-bold">
                    <span>ROLL NO:</span>
                    <span className="px-2 py-0.5 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white">
                      {member.rollNo}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-zinc-400 font-sans">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Cards */}
        <div className="mt-14 space-y-4">
          <div className="border-b border-[#262626] pb-3">
            <h2 className="text-xs font-mono-code font-bold text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>PRACTICAL MODULES INCLUDED</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat, fIdx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={fIdx}
                  className="bg-[#121212] border border-[#222222] rounded-2xl p-4 space-y-2 hover:bg-[#181818] transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#1C1C1C] border border-[#333] flex items-center justify-center text-[#FF3E00]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Reverse Marquee Ticker */}
      <div className="bg-[#141414] border-t border-[#262626] py-2 overflow-hidden relative">
        <div className="animate-marquee-reverse whitespace-nowrap flex items-center gap-8 font-mono-code text-[11px] text-zinc-400">
          {Array.from({ length: 4 }).map((_, idx) => (
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
