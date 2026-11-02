export interface TargetGeometry {
  top: number;
  left: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export type PlacementDirection = 'right' | 'left' | 'bottom' | 'top' | 'center';

export interface MascotPlacementDebugInfo {
  viewportWidth: number;
  viewportHeight: number;
  availableRight: number;
  availableLeft: number;
  availableBottom: number;
  availableTop: number;
  chosenPlacement: PlacementDirection;
  collisionDetected: boolean;
  targetRect?: { left: number; top: number; width: number; height: number };
  mascotRect: { left: number; top: number; width: number; height: number };
}

export interface MascotPlacement {
  x: number;
  y: number;
  width: number;
  height: number;
  direction: PlacementDirection;
  targetGeometry: TargetGeometry | null;
  debugInfo: MascotPlacementDebugInfo;
}

export function measureElementGeometry(el: HTMLElement | null): TargetGeometry | null {
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  // Check if element has zero area or is unrendered
  if (rect.width <= 0 && rect.height <= 0) return null;

  return {
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
  };
}

/**
 * Checks if two rectangles overlap
 */
function rectsOverlap(
  r1: { left: number; top: number; right: number; bottom: number },
  r2: { left: number; top: number; right: number; bottom: number }
): boolean {
  return !(
    r1.right <= r2.left ||
    r1.left >= r2.right ||
    r1.bottom <= r2.top ||
    r1.top >= r2.bottom
  );
}

/**
 * Authoritative, collision-aware mascot placement calculator.
 * Strictly avoids covering the target element while keeping the robot in the visible viewport.
 */
export function calculateMascotPlacement(
  targetGeometry: TargetGeometry | null,
  isMouthOpen: boolean,
  preferredPlacement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
): MascotPlacement {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;

  const isMobile = vw < 640;
  const marginX = isMobile ? 12 : 20;
  const marginTop = 75; // reserve space for topbar
  const marginBottom = isMobile ? 12 : 20;
  const gap = isMobile ? 14 : 20;

  // Responsive stable dimensions for desktop vs mobile
  const mascotWidth = isMobile
    ? Math.min(320, Math.max(250, vw - marginX * 2))
    : Math.min(360, Math.max(280, vw - marginX * 2));

  const mascotHeight = isMouthOpen
    ? isMobile
      ? Math.min(240, Math.max(200, vh - marginTop - marginBottom))
      : Math.min(380, Math.max(260, vh - marginTop - marginBottom))
    : 130;

  // Fallback: If no target element exists, place safely at top right
  if (!targetGeometry) {
    const defaultX = Math.max(marginX, vw - mascotWidth - 28);
    const defaultY = marginTop + 12;
    return {
      x: defaultX,
      y: defaultY,
      width: mascotWidth,
      height: mascotHeight,
      direction: 'center',
      targetGeometry: null,
      debugInfo: {
        viewportWidth: vw,
        viewportHeight: vh,
        availableRight: 0,
        availableLeft: 0,
        availableBottom: 0,
        availableTop: 0,
        chosenPlacement: 'center',
        collisionDetected: false,
        mascotRect: { left: defaultX, top: defaultY, width: mascotWidth, height: mascotHeight },
      },
    };
  }

  // Calculate available space in all 4 cardinal directions
  const availableRight = vw - targetGeometry.right - marginX;
  const availableLeft = targetGeometry.left - marginX;
  const availableBottom = vh - targetGeometry.bottom - marginBottom;
  const availableTop = targetGeometry.top - marginTop;

  interface Candidate {
    direction: PlacementDirection;
    x: number;
    y: number;
    score: number;
    collides: boolean;
  }

  const candidates: Candidate[] = [];

  // 1. RIGHT CANDIDATE: Place to the right of target, aligned near top of target
  {
    const candX = targetGeometry.right + gap;
    let candY = targetGeometry.top - 10;
    candY = Math.max(marginTop, Math.min(vh - mascotHeight - marginBottom, candY));

    const candRect = {
      left: candX,
      top: candY,
      right: candX + mascotWidth,
      bottom: candY + mascotHeight,
    };
    const collides =
      candRect.right > vw - marginX ||
      rectsOverlap(candRect, targetGeometry);

    let score = availableRight - mascotWidth;
    if (preferredPlacement === 'right') score += 250;
    if (!collides) score += 350;

    candidates.push({ direction: 'right', x: candX, y: candY, score, collides });
  }

  // 2. LEFT CANDIDATE: Place to the left of target, aligned near top of target
  {
    const candX = targetGeometry.left - gap - mascotWidth;
    let candY = targetGeometry.top - 10;
    candY = Math.max(marginTop, Math.min(vh - mascotHeight - marginBottom, candY));

    const candRect = {
      left: candX,
      top: candY,
      right: candX + mascotWidth,
      bottom: candY + mascotHeight,
    };
    const collides =
      candX < marginX ||
      rectsOverlap(candRect, targetGeometry);

    let score = availableLeft - mascotWidth;
    if (preferredPlacement === 'left') score += 250;
    if (!collides) score += 350;

    candidates.push({ direction: 'left', x: candX, y: candY, score, collides });
  }

  // 3. BOTTOM CANDIDATE: Place below target
  {
    const candY = targetGeometry.bottom + gap;
    let candX = targetGeometry.centerX - mascotWidth / 2;
    candX = Math.max(marginX, Math.min(vw - mascotWidth - marginX, candX));

    const candRect = {
      left: candX,
      top: candY,
      right: candX + mascotWidth,
      bottom: candY + mascotHeight,
    };
    const collides =
      candRect.bottom > vh - marginBottom ||
      rectsOverlap(candRect, targetGeometry);

    let score = availableBottom - mascotHeight;
    if (preferredPlacement === 'bottom') score += 250;
    if (!collides) score += 350;

    candidates.push({ direction: 'bottom', x: candX, y: candY, score, collides });
  }

  // 4. TOP CANDIDATE: Place above target
  {
    const candY = targetGeometry.top - gap - mascotHeight;
    let candX = targetGeometry.centerX - mascotWidth / 2;
    candX = Math.max(marginX, Math.min(vw - mascotWidth - marginX, candX));

    const candRect = {
      left: candX,
      top: candY,
      right: candX + mascotWidth,
      bottom: candY + mascotHeight,
    };
    const collides =
      candY < marginTop ||
      rectsOverlap(candRect, targetGeometry);

    let score = availableTop - mascotHeight;
    if (preferredPlacement === 'top') score += 250;
    if (!collides) score += 350;

    candidates.push({ direction: 'top', x: candX, y: candY, score, collides });
  }

  // Sort candidates by score descending
  candidates.sort((a, b) => b.score - a.score);

  // Pick top candidate
  let chosen = candidates[0];

  // Final clamping to ensure mascot never leaves viewport bounds
  let finalX = Math.max(marginX, Math.min(vw - mascotWidth - marginX, chosen.x));
  let finalY = Math.max(marginTop, Math.min(vh - mascotHeight - marginBottom, chosen.y));

  // If clamping caused overlap with target, nudge along non-constrained axis
  const finalMascotRect = {
    left: finalX,
    top: finalY,
    right: finalX + mascotWidth,
    bottom: finalY + mascotHeight,
  };

  let collision = rectsOverlap(finalMascotRect, targetGeometry);

  if (collision) {
    if (targetGeometry.centerX > vw / 2) {
      finalX = Math.max(marginX, targetGeometry.left - gap - mascotWidth);
    } else {
      finalX = Math.min(vw - mascotWidth - marginX, targetGeometry.right + gap);
    }

    collision = rectsOverlap(
      {
        left: finalX,
        top: finalY,
        right: finalX + mascotWidth,
        bottom: finalY + mascotHeight,
      },
      targetGeometry
    );

    if (collision) {
      if (availableBottom >= mascotHeight + gap) {
        finalY = targetGeometry.bottom + gap;
      } else if (availableTop >= mascotHeight + gap) {
        finalY = targetGeometry.top - gap - mascotHeight;
      }
      finalY = Math.max(marginTop, Math.min(vh - mascotHeight - marginBottom, finalY));
      collision = rectsOverlap(
        {
          left: finalX,
          top: finalY,
          right: finalX + mascotWidth,
          bottom: finalY + mascotHeight,
        },
        targetGeometry
      );
    }
  }

  return {
    x: finalX,
    y: finalY,
    width: mascotWidth,
    height: mascotHeight,
    direction: chosen.direction,
    targetGeometry,
    debugInfo: {
      viewportWidth: vw,
      viewportHeight: vh,
      availableRight,
      availableLeft,
      availableBottom,
      availableTop,
      chosenPlacement: chosen.direction,
      collisionDetected: collision,
      targetRect: {
        left: targetGeometry.left,
        top: targetGeometry.top,
        width: targetGeometry.width,
        height: targetGeometry.height,
      },
      mascotRect: {
        left: finalX,
        top: finalY,
        width: mascotWidth,
        height: mascotHeight,
      },
    },
  };
}
