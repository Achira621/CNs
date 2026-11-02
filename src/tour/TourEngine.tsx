import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TourStep, COMPLETE_TOUR_STEPS } from './TourRegistry';
import { TourSpotlight } from './TourSpotlight';
import { TourMascot, TourLifecycleState } from './TourMascot';
import {
  TargetGeometry,
  measureElementGeometry,
} from './TourPositionController';
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
  const [targetGeometry, setTargetGeometry] = useState<TargetGeometry | null>(null);
  const [lifecycleState, setLifecycleState] = useState<TourLifecycleState>('initializing');
  const [isPaused, setIsPaused] = useState(false);
  const [debugMode, setDebugMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('tourDebug') === 'true' || localStorage.getItem('tour_debug') === 'true';
    }
    return false;
  });

  const currentStep = steps[currentStepIndex] || steps[0];
  const targetElementRef = useRef<HTMLElement | null>(null);
  targetElementRef.current = targetElement;

  // Single authoritative geometry updater
  const updateGeometry = useCallback(() => {
    if (!targetElementRef.current) {
      setTargetGeometry(null);
      return;
    }
    const geom = measureElementGeometry(targetElementRef.current);
    setTargetGeometry(geom);
  }, []);

  // Update geometry with requestAnimationFrame throttling
  const rafRef = useRef<number | null>(null);
  const scheduleGeometryUpdate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      updateGeometry();
    });
  }, [updateGeometry]);

  // Target element resolution with scroll settling
  const resolveTarget = useCallback(
    (step: TourStep) => {
      let attempts = 0;
      const maxAttempts = 25; // 2.5s maximum lookup

      const check = () => {
        const el = document.querySelector(`[data-tour="${step.targetId}"]`) as HTMLElement | null;

        if (el) {
          setTargetElement(el);
          // Scroll target gently into view if needed
          el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

          // Wait for smooth scroll settling, then measure and transition to ready
          setTimeout(() => {
            const geom = measureElementGeometry(el);
            setTargetGeometry(geom);
            setLifecycleState('entering');
            setTimeout(() => {
              setLifecycleState('ready');
            }, 180);
          }, 240);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(check, 100);
        } else {
          // Fallback: target element not found in DOM, place mascot at default header position safely
          setTargetElement(null);
          setTargetGeometry(null);
          setLifecycleState('ready');
        }
      };

      check();
    },
    []
  );

  // When step changes, handle navigation if needed and resolve target
  useEffect(() => {
    if (!isActive || !currentStep) {
      setLifecycleState('initializing');
      setTargetGeometry(null);
      setTargetElement(null);
      return;
    }

    setLifecycleState('travelling');
    setTargetGeometry(null);
    setTargetElement(null);

    // Route navigation if required
    if (currentStep.route !== activeNav) {
      onNavigate(currentStep.route, currentStep.algorithm);
    }

    // Resolve target element after DOM mount
    const timer = setTimeout(() => {
      resolveTarget(currentStep);
    }, 180);

    return () => clearTimeout(timer);
  }, [isActive, currentStepIndex, currentStep?.id, activeNav, onNavigate, resolveTarget]);

  // Reactive listeners: ResizeObserver + scroll + resize
  useEffect(() => {
    if (!isActive) return;

    window.addEventListener('resize', scheduleGeometryUpdate, { passive: true });
    window.addEventListener('scroll', scheduleGeometryUpdate, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (targetElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        scheduleGeometryUpdate();
      });
      resizeObserver.observe(targetElement);
    }

    const interval = setInterval(scheduleGeometryUpdate, 400);

    return () => {
      window.removeEventListener('resize', scheduleGeometryUpdate);
      window.removeEventListener('scroll', scheduleGeometryUpdate);
      if (resizeObserver) resizeObserver.disconnect();
      clearInterval(interval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isActive, targetElement, scheduleGeometryUpdate]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSafeExit();
      } else if (e.key === 'ArrowRight' && !isPaused) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isPaused) {
        handlePrev();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setDebugMode((d) => !d);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, isPaused, currentStepIndex, steps.length]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleSafeExit();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSafeExit = () => {
    setLifecycleState('exiting');
    setTargetGeometry(null);
    setTargetElement(null);
    onExit();
  };

  const handleDemonstration = (action: string) => {
    if (action === 'type-sample' && onDemonstrateSample) {
      onDemonstrateSample();
    }
  };

  if (!isActive || !currentStep || typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* 1. Target Spotlight Ring (Zero global dimming, pure crisp highlight, only active when mascot ready) */}
      <TourSpotlight
        targetGeometry={targetGeometry}
        isActive={isActive}
        isMascotReady={lifecycleState === 'ready'}
      />

      {/* 2. Unified Roaming 3D Cyber Mascot with Integrated OLED Mouth Display */}
      <TourMascot
        targetGeometry={targetGeometry}
        isActive={isActive}
        step={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPaused={isPaused}
        lifecycleState={lifecycleState}
        onNext={handleNext}
        onPrev={handlePrev}
        onExit={handleSafeExit}
        onTogglePause={() => setIsPaused(!isPaused)}
        onDemonstrate={handleDemonstration}
        debugMode={debugMode}
        onToggleDebugMode={() => setDebugMode(!debugMode)}
      />
    </>,
    document.body
  );
};
