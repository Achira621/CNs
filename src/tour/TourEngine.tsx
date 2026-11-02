import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TourStep, COMPLETE_TOUR_STEPS } from './TourRegistry';
import { TourSpotlight } from './TourSpotlight';
import { TourMascot } from './TourMascot';
import { TourCoachmark } from './TourCoachmark';
import { NavItemKey } from '../components/layout/AppSidebar';
import { CipherMethod } from '../types';

interface TourEngineProps {
  isActive: boolean;
  onExit: () => void;
  onNavigate: (nav: NavItemKey | 'algorithm_page', algorithm?: CipherMethod) => void;
  activeNav: NavItemKey | 'algorithm_page';
  initialSteps?: TourStep[];
  onDemonstrateSample?: () => void;
}

export const TourEngine: React.FC<TourEngineProps> = ({
  isActive,
  onExit,
  onNavigate,
  activeNav,
  initialSteps,
  onDemonstrateSample,
}) => {
  const steps = initialSteps && initialSteps.length > 0 ? initialSteps : COMPLETE_TOUR_STEPS;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const currentStep = steps[currentStepIndex] || steps[0];

  // Resolve and wait for target element in DOM
  const resolveTarget = useCallback((step: TourStep) => {
    let attempts = 0;
    const maxAttempts = 30; // 3 seconds total

    const check = () => {
      const el = document.querySelector(`[data-tour="${step.targetId}"]`) as HTMLElement | null;

      if (el) {
        setTargetElement(el);
        // Scroll target into view
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(check, 100);
      } else {
        // Fallback: target not found, keep guide active without spotlight
        setTargetElement(null);
      }
    };

    check();
  }, []);

  // When step changes, handle navigation if needed and resolve target
  useEffect(() => {
    if (!isActive || !currentStep) return;

    // Check if route change is needed
    if (currentStep.route !== activeNav) {
      onNavigate(currentStep.route, currentStep.algorithm);
    }

    // Resolve target element after navigation has started
    const timer = setTimeout(() => {
      resolveTarget(currentStep);
    }, 150);

    return () => clearTimeout(timer);
  }, [isActive, currentStepIndex, currentStep, activeNav, onNavigate, resolveTarget]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'ArrowRight' && !isPaused) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isPaused) {
        handlePrev();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isPaused, currentStepIndex, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onExit();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleDemonstration = (action: string) => {
    if (action === 'type-sample' && onDemonstrateSample) {
      onDemonstrateSample();
    }
  };

  if (!isActive || !currentStep) return null;

  return (
    <>
      {/* 1. Target Spotlight Ring */}
      <TourSpotlight targetElement={targetElement} isActive={isActive} />

      {/* 2. Roaming 3D Cyber Mascot */}
      <TourMascot
        targetElement={targetElement}
        isActive={isActive}
        statusText={isPaused ? 'Tour Paused' : 'Inspecting Feature'}
      />

      {/* 3. Contextual Explanation Coachmark Card */}
      <TourCoachmark
        step={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        targetElement={targetElement}
        onNext={handleNext}
        onPrev={handlePrev}
        onExit={onExit}
        onDemonstrate={handleDemonstration}
        isPaused={isPaused}
        onTogglePause={() => setIsPaused(!isPaused)}
      />
    </>
  );
};
