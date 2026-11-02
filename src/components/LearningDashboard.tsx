import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Award,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Shield,
  Lightbulb,
  Layers,
  Activity,
} from 'lucide-react';
import { TopicRecommendation, CipherMethod } from '../types';

interface LearningDashboardProps {
  onNavigateTab: (tab: 'learn' | 'experiment' | 'attack' | 'apply', subTab?: string) => void;
  onSelectMethod?: (method: CipherMethod) => void;
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  onNavigateTab,
  onSelectMethod,
}) => {
  const [solvedChallengesCount, setSolvedChallengesCount] = useState(0);
  const [totalChallengePoints, setTotalChallengePoints] = useState(0);
  const [experimentsRun, setExperimentsRun] = useState(14); // dynamic or simulated baseline

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cns_masterclass_challenges');
      if (saved) {
        const parsed = JSON.parse(saved);
        const solved = Object.values(parsed).filter((p: any) => p.solved);
        setSolvedChallengesCount(solved.length);
        const points = Object.values(parsed).reduce((acc: number, p: any) => acc + (p.scoreEarned || 0), 0);
        setTotalChallengePoints(points);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset your local learning progress?')) {
      localStorage.removeItem('cns_masterclass_challenges');
      setSolvedChallengesCount(0);
      setTotalChallengePoints(0);
    }
  };

  // Recommendations derived from student progress
  const recommendations: TopicRecommendation[] = [
    {
      id: 'rec-1',
      topic: 'Extended Euclidean Algorithm & Inverse Calculator',
      reason: 'Essential for finding modular inverses in both Affine cipher and RSA key derivation.',
      targetEnv: 'learn',
      actionText: 'Explore Math Visualizer',
    },
    {
      id: 'rec-2',
      topic: 'Meet-in-the-Middle Attack on 2DES',
      reason: 'Key exam practical topic demonstrating why 2DES provides only 2⁵⁷ security instead of 2¹¹².',
      targetEnv: 'attack',
      actionText: 'Launch MITM Lab',
    },
    {
      id: 'rec-3',
      topic: 'Authenticated Encryption with AES-GCM',
      reason: 'Practice file encryption and observe how authentication tags prevent message tampering.',
      targetEnv: 'experiment',
      actionText: 'Open File Encryption Lab',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <span className="text-[10px] font-mono-code uppercase tracking-wider text-[#FF3E00] font-bold">
              Student Performance Analytics
            </span>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#FF3E00]" />
              Personal Cryptography Learning Dashboard
            </h3>
          </div>

          <button
            onClick={handleResetData}
            className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono-code text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-zinc-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Progress</span>
          </button>
        </div>

        {/* Milestone Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-code text-xs">
          <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-1">
            <span className="text-zinc-500 uppercase text-[10px] font-bold block">
              Challenge Points
            </span>
            <div className="text-2xl font-bold text-amber-400">{totalChallengePoints}</div>
            <div className="text-zinc-400 text-[11px]">Rank: Cryptographic Apprentice</div>
          </div>

          <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-1">
            <span className="text-zinc-500 uppercase text-[10px] font-bold block">
              Challenges Solved
            </span>
            <div className="text-2xl font-bold text-emerald-400">{solvedChallengesCount} / 5</div>
            <div className="text-zinc-400 text-[11px]">Arena Completion</div>
          </div>

          <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-1">
            <span className="text-zinc-500 uppercase text-[10px] font-bold block">
              Algorithms Explored
            </span>
            <div className="text-2xl font-bold text-blue-400">14 / 14</div>
            <div className="text-zinc-400 text-[11px]">Across 6 Categories</div>
          </div>

          <div className="bg-[#161622] border border-zinc-800 rounded-xl p-4 space-y-1">
            <span className="text-zinc-500 uppercase text-[10px] font-bold block">
              CNS Practicals
            </span>
            <div className="text-2xl font-bold text-purple-400">5 Ready</div>
            <div className="text-zinc-400 text-[11px]">Lab Reports Available</div>
          </div>
        </div>
      </div>

      {/* Recommendations Engine */}
      <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4 font-mono-code text-xs">
        <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-zinc-800 pb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Intelligent Curriculum Recommendations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="bg-[#161622] border border-zinc-800 hover:border-[#FF3E00]/50 rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors"
            >
              <div className="space-y-1.5">
                <span className="px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-[#FF3E00]/15 text-[#FF3E00] border border-[#FF3E00]/30 inline-block">
                  {rec.targetEnv.toUpperCase()}
                </span>
                <h5 className="font-bold text-white text-sm font-sans">{rec.topic}</h5>
                <p className="text-zinc-400 font-sans text-xs leading-relaxed">{rec.reason}</p>
              </div>

              <button
                onClick={() => onNavigateTab(rec.targetEnv)}
                className="w-full py-2 bg-zinc-800 hover:bg-[#FF3E00] hover:text-white text-zinc-300 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{rec.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="bg-[#12121A] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4 font-mono-code text-xs">
        <div className="flex items-center gap-2 text-white font-bold text-sm border-b border-zinc-800 pb-3">
          <Award className="w-4 h-4 text-[#FF3E00]" />
          <span>Earned Cryptographic Badges</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Feistel Master', desc: 'Explored 16-round DES & 3DES', unlocked: true },
            { name: 'Modulo Prodigy', desc: 'Solved Extended Euclidean inverse', unlocked: true },
            { name: 'Quantum Shield', desc: 'Understood ECC & RSA trapdoors', unlocked: true },
            { name: 'Red Team Initiate', desc: 'Simulated MitM & ECB leakage', unlocked: true },
          ].map((b, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border bg-[#161622] border-emerald-500/30 text-emerald-300 space-y-1"
            >
              <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{b.name}</span>
              </div>
              <div className="text-[10px] text-zinc-400 font-sans">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
