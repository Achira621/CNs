import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroPage } from './components/HeroPage';
import { MethodSelectionMenu } from './components/MethodSelectionMenu';
import { EncoderDecoderTab } from './components/EncoderDecoderTab';
import { MathVisualizerTab } from './components/MathVisualizerTab';
import { CryptanalysisTab } from './components/CryptanalysisTab';
import { MasterclassLessonsTab } from './components/MasterclassLessonsTab';
import { AITutorDrawer } from './components/AITutorDrawer';
import { PresetsModal } from './components/PresetsModal';
import { KeyCursor } from './components/KeyCursor';
import { CipherMethod } from './types';
import { CIPHER_METHODS, isCoprime } from './utils/affineMath';

export default function App() {
  const [viewMode, setViewMode] = useState<'hero' | 'menu' | 'app'>('hero');
  const [activeTab, setActiveTab] = useState<'studio' | 'math' | 'attack' | 'lessons'>('studio');
  const [cipherMethod, setCipherMethod] = useState<CipherMethod>('affine');
  const [keyA, setKeyA] = useState<number>(5);
  const [keyB, setKeyB] = useState<number>(8);
  const [inputText, setInputText] = useState<string>('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG');
  const [cursorEnabled, setCursorEnabled] = useState<boolean>(true);

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

  // If viewMode is 'hero', show Hero Landing Page
  if (viewMode === 'hero') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-[#FF3E00] selection:text-white relative">
        <KeyCursor enabled={cursorEnabled} />
        <HeroPage onGetIntoApp={() => setViewMode('menu')} />
      </div>
    );
  }

  // If viewMode is 'menu', show Interactive Tree Taxonomy Menu
  if (viewMode === 'menu') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-[#FF3E00] selection:text-white flex flex-col relative">
        <KeyCursor enabled={cursorEnabled} />
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
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
        />
        <MethodSelectionMenu
          currentMethod={cipherMethod}
          onSelectMethod={handleSelectMethodFromMenu}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-[#FF3E00] selection:text-white flex flex-col relative overflow-x-hidden">
      {/* Interactive Key Cursor */}
      <KeyCursor enabled={cursorEnabled} />

      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'studio' && (
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

        {activeTab === 'math' && (
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

        {activeTab === 'attack' && (
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

        {activeTab === 'lessons' && (
          <MasterclassLessonsTab
            onOpenAITutorWithPrompt={handleOpenAITutorWithPrompt}
            onSelectCipherMethod={handleCipherMethodChange}
            onNavigateTab={setActiveTab}
          />
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
          cipherMethod,
          keyA,
          keyB,
          inputText,
          activeTab,
        }}
      />

      {/* Presets Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleSelectPreset}
      />
    </div>
  );
}

