import React, { useState } from 'react';
import { Header, AppEnvironmentTab } from './components/Header';
import { HeroPage } from './components/HeroPage';
import { MethodSelectionMenu } from './components/MethodSelectionMenu';
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
import { KeyCursor } from './components/KeyCursor';
import { FluidBackgroundCanvas } from './components/FluidBackgroundCanvas';
import { OmnibarModal } from './components/OmnibarModal';
import { CipherMethod } from './types';
import { CIPHER_METHODS, isCoprime } from './utils/affineMath';
import {
  Lock,
  Calculator,
  ShieldCheck,
  GraduationCap,
  KeyRound,
  FileCheck2,
  Scale,
  Globe2,
  Trophy,
  TrendingUp,
  GitFork,
  BookOpen,
} from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'hero' | 'menu' | 'app'>('hero');
  const [activeEnv, setActiveEnv] = useState<'learn' | 'experiment' | 'attack' | 'apply'>('experiment');
  const [experimentSubTab, setExperimentSubTab] = useState<'studio' | 'asymmetric' | 'file' | 'compare' | 'math'>('studio');
  const [learnSubTab, setLearnSubTab] = useState<'lessons' | 'graph'>('lessons');
  const [applySubTab, setApplySubTab] = useState<'practicals' | 'scenarios' | 'challenges' | 'dashboard'>('practicals');

  const [cipherMethod, setCipherMethod] = useState<CipherMethod>('affine');
  const [keyA, setKeyA] = useState<number>(5);
  const [keyB, setKeyB] = useState<number>(8);
  const [inputText, setInputText] = useState<string>('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG');
  const [cursorEnabled, setCursorEnabled] = useState<boolean>(true);
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

  const handleSelectMethodFromMenu = (method: CipherMethod) => {
    handleCipherMethodChange(method);
    setViewMode('app');
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
        setActiveEnv('experiment');
        setExperimentSubTab(node.targetTab);
      } else if (node.targetTab === 'attack') {
        setActiveEnv('attack');
      } else if (node.targetTab === 'lessons') {
        setActiveEnv('learn');
        setLearnSubTab('lessons');
      }
    }
    setViewMode('app');
  };

  const handleNavTabChange = (tab: AppEnvironmentTab) => {
    if (tab === 'learn' || tab === 'lessons') {
      setActiveEnv('learn');
    } else if (tab === 'experiment' || tab === 'studio') {
      setActiveEnv('experiment');
      setExperimentSubTab('studio');
    } else if (tab === 'math') {
      setActiveEnv('experiment');
      setExperimentSubTab('math');
    } else if (tab === 'attack') {
      setActiveEnv('attack');
    } else if (tab === 'apply') {
      setActiveEnv('apply');
    }
  };

  // If viewMode is 'hero', show Hero Landing Page
  if (viewMode === 'hero') {
    return (
      <div className="min-h-screen bg-[#08080C] text-zinc-100 font-sans selection:bg-[#FF3E00] selection:text-white relative">
        <KeyCursor enabled={cursorEnabled} />
        <HeroPage
          onGetIntoApp={() => setViewMode('app')}
          onOpenMenu={() => setViewMode('menu')}
          onSelectTopicNode={handleSelectGraphNode}
        />
        <OmnibarModal
          isOpen={isOmnibarOpen}
          onClose={() => setIsOmnibarOpen(false)}
          onSelectNode={handleSelectGraphNode}
        />
      </div>
    );
  }

  // If viewMode is 'menu', show Interactive Tree Taxonomy Menu
  if (viewMode === 'menu') {
    return (
      <div className="min-h-screen bg-[#08080C] text-zinc-100 font-sans selection:bg-[#FF3E00] selection:text-white flex flex-col relative">
        <FluidBackgroundCanvas />
        <KeyCursor enabled={cursorEnabled} />
        <Header
          activeTab={activeEnv}
          setActiveTab={handleNavTabChange}
          cipherMethod={cipherMethod}
          onCipherMethodChange={handleCipherMethodChange}
          cursorEnabled={cursorEnabled}
          onToggleCursor={() => setCursorEnabled(!cursorEnabled)}
          onOpenAITutor={() => {
            setAiTutorPrompt('');
            setIsAITutorOpen(true);
          }}
          onOpenPresets={() => setIsPresetsOpen(true)}
          onGoToHero={() => setViewMode('hero')}
          onOpenTreeMenu={() => setViewMode('menu')}
          onOpenOmnibar={() => setIsOmnibarOpen(true)}
        />
        <MethodSelectionMenu
          currentMethod={cipherMethod}
          onSelectMethod={handleSelectMethodFromMenu}
        />
        <OmnibarModal
          isOpen={isOmnibarOpen}
          onClose={() => setIsOmnibarOpen(false)}
          onSelectNode={handleSelectGraphNode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080C] text-zinc-100 font-sans selection:bg-[#FF3E00] selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Dynamic Fluid Background & 3D Shapes */}
      <FluidBackgroundCanvas />

      {/* Zero-Gravity Key Cursor */}
      <KeyCursor enabled={cursorEnabled} />

      {/* Top Header & Navigation */}
      <Header
        activeTab={activeEnv}
        setActiveTab={handleNavTabChange}
        cipherMethod={cipherMethod}
        onCipherMethodChange={handleCipherMethodChange}
        cursorEnabled={cursorEnabled}
        onToggleCursor={() => setCursorEnabled(!cursorEnabled)}
        onOpenAITutor={() => {
          setAiTutorPrompt('');
          setIsAITutorOpen(true);
        }}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onGoToHero={() => setViewMode('hero')}
        onOpenTreeMenu={() => setViewMode('menu')}
        onOpenOmnibar={() => setIsOmnibarOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-6">
        {/* ============================================================ */}
        {/* 1. LEARN ENVIRONMENT */}
        {/* ============================================================ */}
        {activeEnv === 'learn' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121218] border border-[#262626] rounded-2xl p-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLearnSubTab('lessons')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all ${
                    learnSubTab === 'lessons'
                      ? 'bg-[#FF3E00] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Masterclass Lessons & Quizzes</span>
                </button>

                <button
                  onClick={() => setLearnSubTab('graph')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono-code font-bold transition-all ${
                    learnSubTab === 'graph'
                      ? 'bg-[#FF3E00] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  <GitFork className="w-3.5 h-3.5" />
                  <span>Interactive Knowledge Graph</span>
                </button>
              </div>
            </div>

            {learnSubTab === 'lessons' ? (
              <MasterclassLessonsTab
                onOpenAITutorWithPrompt={handleOpenAITutorWithPrompt}
                onSelectCipherMethod={handleCipherMethodChange}
                onNavigateTab={(tab: any) => handleNavTabChange(tab)}
              />
            ) : (
              <div className="bg-[#101016] border border-[#262626] rounded-2xl p-6 shadow-xl">
                <CryptoKnowledgeGraph onSelectNode={handleSelectGraphNode} />
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. EXPERIMENT ENVIRONMENT */}
        {/* ============================================================ */}
        {activeEnv === 'experiment' && (
          <div className="space-y-6">
            {/* Sub-Environment Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121218] border border-[#262626] rounded-2xl p-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'studio', label: 'Cipher Studio & Trace Lab', icon: Lock },
                  { id: 'asymmetric', label: 'Asymmetric & Hash (RSA/DH/SHA/ECC)', icon: KeyRound },
                  { id: 'file', label: 'File Encryption (AES-GCM)', icon: FileCheck2 },
                  { id: 'compare', label: 'Security Comparison Engine', icon: Scale },
                  { id: 'math', label: 'Math Visualizer', icon: Calculator },
                ].map((st) => {
                  const Icon = st.icon;
                  const isActive = experimentSubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setExperimentSubTab(st.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all ${
                        isActive
                          ? 'bg-[#FF3E00] text-white shadow-md shadow-[#FF3E00]/25'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
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
              <AsymmetricHashStudio
                onOpenAITutorWithPrompt={handleOpenAITutorWithPrompt}
              />
            )}

            {experimentSubTab === 'file' && <FileEncryptionLab />}

            {experimentSubTab === 'compare' && <SecurityComparisonEngine />}

            {experimentSubTab === 'math' && (
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
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. ATTACK ENVIRONMENT */}
        {/* ============================================================ */}
        {activeEnv === 'attack' && (
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
        {/* 4. APPLY ENVIRONMENT */}
        {/* ============================================================ */}
        {activeEnv === 'apply' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121218] border border-[#262626] rounded-2xl p-2.5">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'practicals', label: 'Guided CNS Practicals & Report Generator', icon: GraduationCap },
                  { id: 'scenarios', label: 'Real-World Scenarios Simulator', icon: Globe2 },
                  { id: 'challenges', label: 'Cryptography Challenge Arena', icon: Trophy },
                  { id: 'dashboard', label: 'Learning Dashboard', icon: TrendingUp },
                ].map((st) => {
                  const Icon = st.icon;
                  const isActive = applySubTab === st.id;
                  return (
                    <button
                      key={st.id}
                      onClick={() => setApplySubTab(st.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono-code font-bold transition-all ${
                        isActive
                          ? 'bg-[#FF3E00] text-white shadow-md shadow-[#FF3E00]/25'
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {applySubTab === 'practicals' && <GuidedPracticalsTab />}
            {applySubTab === 'scenarios' && <RealWorldScenarios />}
            {applySubTab === 'challenges' && <ChallengeArena />}
            {applySubTab === 'dashboard' && (
              <LearningDashboard
                onNavigateTab={(tab) => handleNavTabChange(tab)}
                onSelectMethod={handleCipherMethodChange}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#262626] bg-[#0A0A0A] py-6 text-xs text-zinc-500 font-mono-code">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-[#FF3E00] animate-pulse" />
            <span className="text-zinc-300 font-bold">Vidyalankar Institute of Technology</span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span>Cybersecurity Practical conducted by Prof. Vinita Bhandiwad</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <span>By:</span>
            <span className="text-white font-bold">Varad Dalvi (24101B0040)</span>
            <span>•</span>
            <span className="text-white font-bold">Omkar Bengali (24101B0043)</span>
            <span>•</span>
            <span className="text-white font-bold">Sumit Surwase (24101B0022)</span>
          </div>
        </div>
      </footer>

      {/* Floating AI Tutor Drawer */}
      <AITutorDrawer
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        initialPrompt={aiTutorPrompt}
        contextData={{
          activeEnv,
          experimentSubTab,
          learnSubTab,
          applySubTab,
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
