import React, { useState } from 'react';
import { MASTERCLASS_LESSONS } from '../data/lessonsData';
import { CipherMethod } from '../types';
import {
  validateKeyA,
  modInverse,
  encryptText,
  solveKnownPlaintext,
} from '../utils/affineMath';
import {
  GraduationCap,
  BookOpen,
  ShieldAlert,
  KeyRound,
  Unlock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface MasterclassLessonsTabProps {
  onOpenAITutorWithPrompt?: (prompt: string) => void;
  onSelectCipherMethod?: (method: CipherMethod) => void;
  onNavigateTab?: (tab: 'studio' | 'math' | 'attack' | 'lessons') => void;
}

export const MasterclassLessonsTab: React.FC<MasterclassLessonsTabProps> = ({
  onOpenAITutorWithPrompt,
  onSelectCipherMethod,
  onNavigateTab,
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>('intro');
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<string, number>>({});

  // Interactive Mini Widgets state
  const [widgetCoprimeA, setWidgetCoprimeA] = useState(5);
  const [widgetInverseA, setWidgetInverseA] = useState(7);
  const [widgetEncoderInput, setWidgetEncoderInput] = useState('CRYPTO');
  const [widgetEncoderA, setWidgetEncoderA] = useState(5);
  const [widgetEncoderB, setWidgetEncoderB] = useState(8);

  const activeLesson = MASTERCLASS_LESSONS.find((l) => l.id === activeLessonId) || MASTERCLASS_LESSONS[0];

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    setUserQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const getLessonIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-4 h-4" />;
      case 'KeyRound':
        return <KeyRound className="w-4 h-4" />;
      case 'Unlock':
        return <Unlock className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar Lesson Selector */}
      <div className="md:col-span-1 space-y-4">
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-4 shadow-xl">
          <h3 className="text-xs font-mono-code font-bold text-[#FF3E00] uppercase tracking-[0.15em] mb-3 px-1">
            CURRICULUM // MODULES
          </h3>

          <div className="space-y-2">
            {MASTERCLASS_LESSONS.map((lesson, idx) => {
              const isActive = lesson.id === activeLessonId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3.5 transition-all flex items-start gap-3 border rounded-2xl ${
                    isActive
                      ? 'bg-[#FF3E00] text-white border-[#FF3E00] shadow-md shadow-[#FF3E00]/20'
                      : 'bg-[#0A0A0A] text-zinc-300 hover:bg-[#1A1A1A] border-[#262626]'
                  }`}
                >
                  <div
                    className={`p-2 rounded-xl ${
                      isActive ? 'bg-black/20 text-white' : 'bg-[#181818] text-[#FF3E00]'
                    }`}
                  >
                    {getLessonIcon(lesson.iconName)}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono-code uppercase font-bold tracking-wider opacity-80">
                      LESSON 0{idx + 1}
                    </div>
                    <div className="text-xs font-semibold line-clamp-1 font-sans">
                      {lesson.title.replace(/^Lesson \d+: /, '')}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Tutor Card */}
        {onOpenAITutorWithPrompt && (
          <div className="bg-[#141414] border border-[#262626] rounded-3xl p-5 text-xs space-y-3">
            <div className="flex items-center gap-2 text-[#FF3E00] font-mono-code font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>ACADEMIC TUTOR</span>
            </div>
            <p className="text-zinc-400 font-sans leading-relaxed">
              Ask Professor Modulo to elaborate on any cryptographic theorem or mathematical step!
            </p>
            <button
              onClick={() =>
                onOpenAITutorWithPrompt(
                  `I am currently studying '${activeLesson.title}'. Can you explain the main mathematical concept behind this in plain terms with a clear example?`
                )
              }
              className="w-full py-2.5 bg-[#FF3E00] hover:bg-[#E03700] text-white font-mono-code text-xs uppercase font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02] shadow-md shadow-[#FF3E00]/20"
            >
              Ask AI Tutor
            </button>
          </div>
        )}
      </div>

      {/* Main Lesson Content & Interactive Quiz */}
      <div className="md:col-span-3 space-y-6">
        {/* Lesson Header */}
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-2">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#FF3E00] via-amber-400 to-[#FF3E00]" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono-code uppercase tracking-[0.2em] font-bold text-[#FF3E00]">
              INTERACTIVE MASTERCLASS MODULE
            </span>
          </div>
          <h2 className="text-2xl font-serif-display font-semibold text-white">
            {activeLesson.title}
          </h2>
          <p className="text-xs text-zinc-400 font-sans">{activeLesson.subtitle}</p>
        </div>

        {/* Lesson Sections */}
        <div className="space-y-6">
          {activeLesson.sections.map((sec, sIdx) => (
            <div
              key={sIdx}
              className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl space-y-4"
            >
              <h3 className="text-base font-serif-display font-semibold text-white border-b border-[#262626] pb-3">
                {sec.heading}
              </h3>

              <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line space-y-3 font-sans">
                {sec.content}
              </div>

              {/* Interactive Widget Embeds */}
              {sec.interactiveWidget === 'coprime-checker' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code">
                  <h4 className="text-xs font-bold text-[#FF3E00] uppercase tracking-wider">
                    INTERACTIVE COPRIMALITY CHECKER
                  </h4>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-zinc-400">Test Key 'a':</label>
                    <input
                      type="number"
                      min="1"
                      max="25"
                      value={widgetCoprimeA}
                      onChange={(e) => setWidgetCoprimeA(Number(e.target.value))}
                      className="w-20 bg-[#141414] text-[#FF3E00] font-mono-code font-bold text-center p-2 border border-[#262626] rounded-xl"
                    />
                  </div>
                  {(() => {
                    const val = validateKeyA(widgetCoprimeA, 26);
                    return (
                      <div
                        className={`p-3 text-xs font-mono-code rounded-xl ${
                          val.isValid
                            ? 'bg-[#0A0A0A] text-emerald-400 border border-emerald-800'
                            : 'bg-[#0A0A0A] text-rose-400 border border-rose-800'
                        }`}
                      >
                        {val.explanation}
                      </div>
                    );
                  })()}
                </div>
              )}

              {sec.interactiveWidget === 'inverse-calculator' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    INTERACTIVE MODULAR INVERSE CALCULATOR
                  </h4>
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-zinc-400">Key 'a':</label>
                    <input
                      type="number"
                      min="1"
                      max="25"
                      value={widgetInverseA}
                      onChange={(e) => setWidgetInverseA(Number(e.target.value))}
                      className="w-20 bg-[#141414] text-amber-400 font-mono-code font-bold text-center p-2 border border-[#262626] rounded-xl"
                    />
                  </div>
                  {(() => {
                    const inv = modInverse(widgetInverseA, 26);
                    return (
                      <div className="p-3 bg-[#141414] border border-[#262626] rounded-xl text-xs font-mono-code text-zinc-300">
                        {inv !== null ? (
                          <span>
                            a⁻¹ mod 26 = <strong className="text-emerald-400 font-bold">{inv}</strong> (since {widgetInverseA} × {inv} = {widgetInverseA * inv} ≡ 1 mod 26)
                          </span>
                        ) : (
                          <span className="text-rose-400">
                            No inverse exists for key a = {widgetInverseA} because gcd({widgetInverseA}, 26) ≠ 1.
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {sec.interactiveWidget === 'mini-encoder' && (
                <div className="mt-4 p-4 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3 font-mono-code">
                  <h4 className="text-xs font-bold text-[#FF3E00] uppercase tracking-wider">
                    MINI CIPHER TEST BOX
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={widgetEncoderInput}
                      onChange={(e) => setWidgetEncoderInput(e.target.value.toUpperCase())}
                      placeholder="PLAINTEXT..."
                      className="bg-[#141414] text-white font-mono-code text-xs p-2 border border-[#262626] rounded-xl"
                    />
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>a:</span>
                      <input
                        type="number"
                        min="1"
                        max="25"
                        value={widgetEncoderA}
                        onChange={(e) => setWidgetEncoderA(Number(e.target.value))}
                        className="w-16 bg-[#141414] text-[#FF3E00] font-mono-code text-center p-1.5 border border-[#262626] rounded-xl"
                      />
                      <span>b:</span>
                      <input
                        type="number"
                        min="0"
                        max="25"
                        value={widgetEncoderB}
                        onChange={(e) => setWidgetEncoderB(Number(e.target.value))}
                        className="w-16 bg-[#141414] text-amber-400 font-mono-code text-center p-1.5 border border-[#262626] rounded-xl"
                      />
                    </div>
                    <div className="p-2 bg-[#141414] border border-[#262626] rounded-xl font-mono-code text-xs text-[#FF3E00] font-bold flex items-center justify-center">
                      {encryptText(widgetEncoderInput, widgetEncoderA, widgetEncoderB, 26)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Knowledge Check Quiz */}
        <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#262626] pb-4">
            <div>
              <h3 className="text-xs font-mono-code font-bold text-white uppercase tracking-[0.15em] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#FF3E00]" />
                KNOWLEDGE CHECK QUIZ
              </h3>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Verify your mathematical understanding of {activeLesson.title}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {activeLesson.quiz.map((q, qIdx) => {
              const selectedOpt = userQuizAnswers[q.id];
              const isSubmitted = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="p-5 bg-[#0A0A0A] border border-[#262626] rounded-2xl space-y-3"
                >
                  <h4 className="text-xs font-mono-code font-bold text-white uppercase tracking-wider">
                    QUESTION {qIdx + 1}: {q.question}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = selectedOpt === oIdx;
                      let btnStyle = 'bg-[#141414] border-[#262626] text-zinc-300 hover:border-zinc-500';

                      if (isSubmitted) {
                        if (oIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
                        }
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizOption(q.id, oIdx)}
                          className={`p-3 border rounded-xl text-xs text-left transition-all font-sans ${btnStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {isSubmitted && (
                    <div
                      className={`p-3 text-xs flex items-start gap-2 font-mono-code rounded-xl ${
                        isCorrect
                          ? 'bg-[#0A0A0A] text-emerald-400 border border-emerald-800'
                          : 'bg-[#0A0A0A] text-rose-400 border border-rose-800'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <strong className="block font-bold uppercase">
                          {isCorrect ? 'Correct Solution' : 'Incorrect Solution'}
                        </strong>
                        <span className="font-sans text-zinc-300">{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

