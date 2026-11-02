import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { TourStep, COMPLETE_TOUR_STEPS } from './TourRegistry';
import { TourSpotlight } from './TourSpotlight';
import { TourMascot } from './TourMascot';
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

  // Resolve and wait for target element in DOM with smooth scrolling
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

          // Wait 250ms for smooth scroll settling, then measure
          setTimeout(() => {
            const geom = measureElementGeometry(el);
            setTargetGeometry(geom);
          }, 260);
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(check, 100);
        } else {
          // Graceful fallback: target not in DOM, position robot cleanly at top-right
          setTargetElement(null);
          setTargetGeometry(null);
        }
      };

      check();
    },
    []
  );

  // When step changes, handle navigation if needed and resolve target
  useEffect(() => {
    if (!isActive || !currentStep) return;

    // Reset current target references while switching
    setTargetElement(null);
    setTargetGeometry(null);

    // Route navigation if required
    if (currentStep.route !== activeNav) {
      onNavigate(currentStep.route, currentStep.algorithm);
    }

    // Resolve target element after DOM mount
    const timer = setTimeout(() => {
      resolveTarget(currentStep);
    }, 180);

    return () => clearTimeout(timer);
  }, [isActive, currentStepIndex, currentStep, activeNav, onNavigate, resolveTarget]);

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

    // Periodic safety sync for accordion/tab transitions
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
        onExit();
      } else if (e.key === 'ArrowRight' && !isPaused) {
        handleNext();
      } else if (e.key === 'ArrowLeft' && !isPaused) {
        handlePrev();
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        // Dev toggle Ctrl+D or Cmd+D for tour debug mode
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

  if (!isActive || !currentStep || typeof document === 'undefined') return null;

  // Render via React Portal to document.body to escape transformed container boundaries
  return createPortal(
    <>
      {/* 1. Target Spotlight Ring (Zero global dimming, pure crisp highlight) */}
      <TourSpotlight targetGeometry={targetGeometry} isActive={isActive} />

      {/* 2. Unified Roaming 3D Cyber Mascot with Integrated OLED Mouth Display */}
      <TourMascot
        targetGeometry={targetGeometry}
        isActive={isActive}
        step={currentStep}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
        isPaused={isPaused}
        onNext={handleNext}
        onPrev={handlePrev}
        onExit={onExit}
        onTogglePause={() => setIsPaused(!isPaused)}
        onDemonstrate={handleDemonstration}
        debugMode={debugMode}
        onToggleDebugMode={() => setDebugMode(!debugMode)}
      />
    </>,
    document.body
  );
};
