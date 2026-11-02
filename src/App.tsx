import React, { useState, useEffect } from 'react';
import { AppSidebar, NavItemKey } from './components/layout/AppSidebar';
import { AppTopbar } from './components/layout/AppTopbar';
import { CosmicBackground } from './components/effects/CosmicBackground';
import { HeroPage } from './components/HeroPage';
import { AlgorithmPageLayout } from './components/crypto/AlgorithmPageLayout';
import { AlgorithmLibrary } from './components/crypto/AlgorithmLibrary';
import { EncoderDecoderTab } from './components/EncoderDecoderTab';
import { MathVisualizerTab } from './components/MathVisualizerTab';
import { CryptanalysisTab } from './components/CryptanalysisTab';
import { MasterclassLessonsTab } from './components/MasterclassLessonsTab';
import { AsymmetricHashStudio } from './components/AsymmetricHashStudio';
import { FileEncryptionLab } from './components/FileEncryptionLab';
import { SecurityComparisonEngine } from './components/SecurityComparisonEngine';
import { RealWorldScenarios } from './components/RealWorldScenarios';
import { GuidedPracticalsTab } from './components/GuidedPracticalsTab';
import { ChallengeArena } from './components/ChallengeArena';
import { LearningDashboard } from './components/LearningDashboard';
import { CryptoKnowledgeGraph, GraphNode } from './components/CryptoKnowledgeGraph';
import { AITutorDrawer } from './components/AITutorDrawer';
import { PresetsModal } from './components/PresetsModal';
import { OmnibarModal } from './components/OmnibarModal';
import { CipherMethod } from './types';
import { isCoprime } from './utils/affineMath';
import {
  Lock,
  Calculator,
  KeyRound,
  FileCheck2,
  Scale,
  GitFork,
  BookOpen,
  Trophy,
  TrendingUp,
} from 'lucide-react';

export default function App() {
  const [activeNav, setActiveNav] = useState<NavItemKey | 'algorithm_page'>('dashboard');
  const [experimentSubTab, setExperimentSubTab] = useState<'studio' | 'asymmetric' | 'file' | 'compare' | 'math'>('studio');
  const [learnSubTab, setLearnSubTab] = useState<'lessons' | 'graph'>('lessons');
  const [challengeSubTab, setChallengeSubTab] = useState<'arena' | 'dashboard'>('arena');

  const [cipherMethod, setCipherMethod] = useState<CipherMethod>('affine');
  const [keyA, setKeyA] = useState<number>(5);
  const [keyB, setKeyB] = useState<number>(8);
  const [inputText, setInputText] = useState<string>('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG');
  const [isOmnibarOpen, setIsOmnibarOpen] = useState<boolean>(false);

  // Polyalphabetic specific states
  const [vigenereKey, setVigenereKey] = useState<string>('SECRET');
  const [playfairKey, setPlayfairKey] = useState<string>('MONARCHY');
  const [hillMatrix, setHillMatrix] = useState<{ k11: number; k12: number; k21: number; k22: number }>({
    k11: 5,
    k12: 8,
    k21: 17,
    k22: 3,
  });

  // AI Tutor drawer state
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [aiTutorPrompt, setAiTutorPrompt] = useState<string>('');

  // Presets modal state
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);

  // Keyboard shortcut for Cmd/Ctrl + K Omnibar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOmnibarOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCipherMethodChange = (newMethod: CipherMethod) => {
    setCipherMethod(newMethod);
    if (newMethod === 'caesar_default') {
      setKeyA(1);
      setKeyB(3);
    } else if (newMethod === 'caesar_custom') {
      setKeyA(1);
      if (keyB === 0) setKeyB(7);
    } else if (newMethod === 'multiplicative') {
      if (!isCoprime(keyA, 26)) setKeyA(5);
      setKeyB(0);
    } else if (newMethod === 'affine') {
      if (!isCoprime(keyA, 26)) setKeyA(5);
    }
  };

  const handleSelectAlgorithm = (method: CipherMethod) => {
    handleCipherMethodChange(method);
    setActiveNav('algorithm_page');
  };

  const handleOpenAITutorWithPrompt = (prompt: string) => {
    setAiTutorPrompt(prompt);
    setIsAITutorOpen(true);
  };

  const handleSelectPreset = (a: number, b: number, sampleText: string) => {
    if (a === 1 && b === 3) {
      setCipherMethod('caesar_default');
    } else if (a === 1) {
      setCipherMethod('caesar_custom');
    } else if (b === 0) {
      setCipherMethod('multiplicative');
    } else {
      setCipherMethod('affine');
    }
    setKeyA(a);
    setKeyB(b);
    setInputText(sampleText);
  };

  const handleSelectGraphNode = (node: GraphNode) => {
    if (node.targetMethod) {
      handleCipherMethodChange(node.targetMethod);
    }
    if (node.targetTab) {
      if (node.targetTab === 'studio' || node.targetTab === 'math') {
        setActiveNav(node.targetTab as any);
      } else if (node.targetTab === 'attack') {
        setActiveNav('attack');
      } else if (node.targetTab === 'lessons') {
        setActiveNav('lessons');
        setLearnSubTab('lessons');
      }
    } else {
      setActiveNav('algorithm_page');
    }
    setIsOmnibarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F9F9FC] text-zinc-900 font-sans flex antialiased selection:bg-[#8855C7] selection:text-white relative">
      {/* Cosmic White Canvas Atmospheric Background */}
      <CosmicBackground lightCanvas={true} />

      {/* Global Vertical Left Navigation Sidebar */}
      <AppSidebar
        activeKey={activeNav as NavItemKey}
        onNavigate={(key) => setActiveNav(key)}
        onOpenAlgorithmPicker={() => setActiveNav('algorithms')}
      />

      {/* Right Main Application Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navigation Bar with Search & Profile */}
        <AppTopbar
          onOpenSearch={() => setIsOmnibarOpen(true)}
          onOpenAITutor={() => {
            setAiTutorPrompt('');
            setIsAITutorOpen(true);
          }}
          notificationCount={1}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {/* ============================================================ */}
          {/* 1. DASHBOARD VIEW (Cosmic Lab Hero) */}
          {/* ============================================================ */}
          {activeNav === 'dashboard' && (
            <HeroPage
              onOpenCipherStudio={() => setActiveNav('studio')}
              onViewCurriculum={() => setActiveNav('lessons')}
              onSelectCategory={(cat) => {
                if (cat === 'monoalphabetic') handleSelectAlgorithm('affine');
                else if (cat === 'polyalphabetic') handleSelectAlgorithm('vigenere');
                else if (cat === 'block') handleSelectAlgorithm('des');
                else if (cat === 'modern') handleSelectAlgorithm('aes');
                else if (cat === 'attack') setActiveNav('attack');
                else if (cat === 'practicals') setActiveNav('practicals');
                else setActiveNav('algorithms');
              }}
              onSelectAlgorithm={handleSelectAlgorithm}
              onOpenQuickTool={(tool) => {
                setActiveNav('math');
              }}
            />
          )}

          {/* ============================================================ */}
          {/* 2. DEDICATED INDIVIDUAL ALGORITHM PAGE */}
          {/* ============================================================ */}
          {activeNav === 'algorithm_page' && (
            <AlgorithmPageLayout
              method={cipherMethod}
              onSelectMethod={(m) => setCipherMethod(m)}
              onOpenAITutorWithPrompt={handleOpenAITutorWithPrompt}
              onBackToDashboard={() => setActiveNav('dashboard')}
            />
          )}

          {/* ============================================================ */}
          {/* 3. ALGORITHM REPOSITORY & CATALOG */}
          {/* ============================================================ */}
          {activeNav === 'algorithms' && (
            <AlgorithmLibrary onSelectAlgorithm={handleSelectAlgorithm} />
          )}

          {/* ============================================================ */}
          {/* 4. CIPHER STUDIO & LAB SUITE */}
          {/* ============================================================ */}
          {activeNav === 'studio' && (
            <div className="space-y-6">
              {/* Secondary Subtab switcher in dark container */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#13121F] border border-[#24223A] rounded-2xl p-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'studio', label: 'Classical Cipher Studio', icon: Lock },
                    { id: 'asymmetric', label: 'Asymmetric & Hash (RSA/DH/SHA/ECC)', icon: KeyRound },
                    { id: 'file', label: 'File Encryption (AES-GCM)', icon: FileCheck2 },
                    { id: 'compare', label: 'Security Comparison Engine', icon: Scale },
                  ].map((st) => {
                    const Icon = st.icon;
                    const isActive = experimentSubTab === st.id;
                    return (
                      <button
                        key={st.id}
                        onClick={() => setExperimentSubTab(st.id as any)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#8855C7] text-white shadow-md'
                            : 'text-zinc-400 hover:text-white hover:bg-[#201D35]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {experimentSubTab === 'studio' && (
                <EncoderDecoderTab
                  cipherMethod={cipherMethod}
                  onCipherMethodChange={handleCipherMethodChange}
                  keyA={keyA}
                  setKeyA={setKeyA}
                  keyB={keyB}
                  setKeyB={setKeyB}
                  vigenereKey={vigenereKey}
                  setVigenereKey={setVigenereKey}
                  playfairKey={playfairKey}
                  setPlayfairKey={setPlayfairKey}
                  hillMatrix={hillMatrix}
                  setHillMatrix={setHillMatrix}
                  inputText={inputText}
                  setInputText={setInputText}
                  onOpenAITutorWithPrompt={handleOpenAITutorWithPrompt}
                />
              )}

              {experimentSubTab === 'asymmetric' && (
                <AsymmetricHashStudio onOpenAITutorWithPrompt={handleOpenAITutorWithPrompt} />
              )}

              {experimentSubTab === 'file' && <FileEncryptionLab />}

              {experimentSubTab === 'compare' && <SecurityComparisonEngine />}
            </div>
          )}

          {/* ============================================================ */}
          {/* 5. MATH VISUALIZER */}
          {/* ============================================================ */}
          {activeNav === 'math' && (
            <MathVisualizerTab
              cipherMethod={cipherMethod}
              onCipherMethodChange={handleCipherMethodChange}
              keyA={keyA}
              setKeyA={setKeyA}
              keyB={keyB}
              setKeyB={setKeyB}
              vigenereKey={vigenereKey}
              setVigenereKey={setVigenereKey}
              playfairKey={playfairKey}
              setPlayfairKey={setPlayfairKey}
              hillMatrix={hillMatrix}
              setHillMatrix={setHillMatrix}
              onOpenAITutorWithPrompt={handleOpenAITutorWithPrompt}
            />
          )}

          {/* ============================================================ */}
          {/* 6. CRYPTANALYSIS LAB */}
          {/* ============================================================ */}
          {activeNav === 'attack' && (
            <CryptanalysisTab
              cipherMethod={cipherMethod}
              onCipherMethodChange={handleCipherMethodChange}
              inputText={inputText}
              setInputText={setInputText}
              setKeyA={setKeyA}
              setKeyB={setKeyB}
              onOpenAITutorWithPrompt={handleOpenAITutorWithPrompt}
            />
          )}

          {/* ============================================================ */}
          {/* 7. MASTERCLASS LESSONS & KNOWLEDGE GRAPH */}
          {/* ============================================================ */}
          {activeNav === 'lessons' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#13121F] border border-[#24223A] rounded-2xl p-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLearnSubTab('lessons')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer ${
                      learnSubTab === 'lessons'
                        ? 'bg-[#8855C7] text-white shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-[#201D35]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Masterclass Curriculum</span>
                  </button>

                  <button
                    onClick={() => setLearnSubTab('graph')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer ${
                      learnSubTab === 'graph'
                        ? 'bg-[#8855C7] text-white shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-[#201D35]'
                    }`}
                  >
                    <GitFork className="w-3.5 h-3.5" />
                    <span>Knowledge Graph</span>
                  </button>
                </div>
              </div>

              {learnSubTab === 'lessons' ? (
                <MasterclassLessonsTab
                  onOpenAITutorWithPrompt={handleOpenAITutorWithPrompt}
                  onSelectCipherMethod={handleCipherMethodChange}
                  onNavigateTab={(tab) => {
                    if (tab === 'studio' || tab === 'math') setActiveNav(tab);
                    else if (tab === 'attack') setActiveNav('attack');
                  }}
                />
              ) : (
                <div className="bg-[#13121F] border border-[#24223A] rounded-2xl p-6 shadow-xl">
                  <CryptoKnowledgeGraph onSelectNode={handleSelectGraphNode} />
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 8. PRACTICE, QUIZZES & LEARNING DASHBOARD */}
          {/* ============================================================ */}
          {activeNav === 'challenges' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#13121F] border border-[#24223A] rounded-2xl p-2.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChallengeSubTab('arena')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer ${
                      challengeSubTab === 'arena'
                        ? 'bg-[#8855C7] text-white shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-[#201D35]'
                    }`}
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Cryptography Challenge Arena</span>
                  </button>

                  <button
                    onClick={() => setChallengeSubTab('dashboard')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all cursor-pointer ${
                      challengeSubTab === 'dashboard'
                        ? 'bg-[#8855C7] text-white shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-[#201D35]'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Learning Progress & Analytics</span>
                  </button>
                </div>
              </div>

              {challengeSubTab === 'arena' ? (
                <ChallengeArena />
              ) : (
                <LearningDashboard
                  onNavigateTab={(tab) => {
                    if (tab === 'studio' || tab === 'math' || tab === 'attack' || tab === 'lessons') {
                      setActiveNav(tab);
                    }
                  }}
                  onSelectMethod={handleSelectAlgorithm}
                />
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* 9. CNS GUIDED PRACTICALS & LAB REPORT GENERATOR */}
          {/* ============================================================ */}
          {activeNav === 'practicals' && <GuidedPracticalsTab />}

          {/* ============================================================ */}
          {/* 10. REAL-WORLD SCENARIOS SIMULATOR */}
          {/* ============================================================ */}
          {activeNav === 'scenarios' && <RealWorldScenarios />}
        </main>

        {/* Global Academic Footer */}
        <footer className="border-t border-[#E7E5F0] bg-white/90 backdrop-blur-md py-6 text-xs text-zinc-600 font-mono-code mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <span className="w-2 h-2 rounded-full bg-[#8855C7] animate-pulse" />
              <span className="text-zinc-900 font-bold">Vidyalankar Institute of Technology</span>
              <span className="hidden sm:inline text-zinc-400">•</span>
              <span>Cybersecurity Practical conducted by Prof. Vinita Bhandiwad</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-zinc-600 text-[11px]">
              <span>By:</span>
              <span className="text-zinc-900 font-bold">Varad Dalvi (24101B0040)</span>
              <span>•</span>
              <span className="text-zinc-900 font-bold">Omkar Bengali (24101B0043)</span>
              <span>•</span>
              <span className="text-zinc-900 font-bold">Sumit Surwase (24101B0022)</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        initialPrompt={aiTutorPrompt}
        contextData={{
          activeNav,
          cipherMethod,
          keyA,
          keyB,
          vigenereKey,
          playfairKey,
          hillMatrix,
          inputText,
        }}
      />

      {/* Presets Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />

      {/* Global Cmd+K Omnibar Modal */}
      <OmnibarModal
        isOpen={isOmnibarOpen}
        onClose={() => setIsOmnibarOpen(false)}
        onSelectNode={handleSelectGraphNode}
      />
    </div>
  );
}
