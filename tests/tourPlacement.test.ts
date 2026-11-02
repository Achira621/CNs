import { calculateMascotPlacement, TargetGeometry } from '../src/tour/TourPositionController';
import { COMPLETE_TOUR_STEPS } from '../src/tour/TourRegistry';

console.log('================================================================');
console.log('  STARTING TOUR PLACEMENT & LIFECYCLE VERIFICATION SUITE');
console.log('================================================================');

const viewports = [
  { name: 'Large Desktop', vw: 1754, vh: 772 },
  { name: 'Standard Desktop', vw: 1366, vh: 768 },
  { name: 'Laptop / Tablet Landscape', vw: 1280, vh: 720 },
  { name: 'Mobile Portrait', vw: 390, vh: 844 },
];

let totalChecks = 0;
let passedChecks = 0;

for (const vp of viewports) {
  // Mock window innerWidth and innerHeight
  (global as any).window = {
    innerWidth: vp.vw,
    innerHeight: vp.vh,
  };

  console.log(`\nTesting Viewport: ${vp.name} (${vp.vw} × ${vp.vh})`);

  // Test 1: Fallback (No target)
  {
    totalChecks++;
    const res = calculateMascotPlacement(null, true);
    const insideViewport =
      res.x >= 0 &&
      res.x + res.width <= vp.vw &&
      res.y >= 0 &&
      res.y + res.height <= vp.vh;
    if (insideViewport && !res.debugInfo.collisionDetected) {
      passedChecks++;
      console.log(`  ✔ [No Target]: Mascot safely docked at (${res.x}, ${res.y}), size ${res.width}x${res.height}`);
    } else {
      console.error(`  ❌ [No Target]: Placement out of bounds or colliding`, res);
    }
  }

  // Test 2: Dashboard nav button (left edge: x=12, w=220, y=85, h=44)
  {
    totalChecks++;
    const dashboardTarget: TargetGeometry = {
      left: 12,
      top: 85,
      right: 232,
      bottom: 129,
      width: 220,
      height: 44,
      centerX: 122,
      centerY: 107,
    };

    const res = calculateMascotPlacement(dashboardTarget, true, 'right');
    const insideViewport =
      res.x >= 0 &&
      res.x + res.width <= vp.vw &&
      res.y >= 0 &&
      res.y + res.height <= vp.vh;

    // Check that mascot does not overlap the dashboard button
    const overlapsTarget = !(
      res.x + res.width <= dashboardTarget.left ||
      res.x >= dashboardTarget.right ||
      res.y + res.height <= dashboardTarget.top ||
      res.y >= dashboardTarget.bottom
    );

    if (insideViewport && !overlapsTarget) {
      passedChecks++;
      console.log(`  ✔ [Dashboard Nav]: Placed ${res.direction} at (${res.x}, ${res.y}) without target overlap`);
    } else {
      console.error(`  ❌ [Dashboard Nav]: Overlaps target or out of bounds`, { res, dashboardTarget, overlapsTarget });
    }
  }

  // Test 3: Quick Tools card (bottom right area of dashboard)
  {
    totalChecks++;
    const quickToolsTarget: TargetGeometry = {
      left: Math.round(vp.vw * 0.55),
      top: 380,
      right: Math.round(vp.vw * 0.9),
      bottom: 560,
      width: Math.round(vp.vw * 0.35),
      height: 180,
      centerX: Math.round(vp.vw * 0.725),
      centerY: 470,
    };

    const res = calculateMascotPlacement(quickToolsTarget, true, 'auto');
    const insideViewport =
      res.x >= 0 &&
      res.x + res.width <= vp.vw &&
      res.y >= 0 &&
      res.y + res.height <= vp.vh;

    const overlapsTarget = !(
      res.x + res.width <= quickToolsTarget.left ||
      res.x >= quickToolsTarget.right ||
      res.y + res.height <= quickToolsTarget.top ||
      res.y >= quickToolsTarget.bottom
    );

    if (insideViewport && !overlapsTarget) {
      passedChecks++;
      console.log(`  ✔ [Quick Tools]: Placed ${res.direction} at (${res.x}, ${res.y}) without collision`);
    } else {
      console.error(`  ❌ [Quick Tools]: Collision or out of bounds`, { res, overlapsTarget });
    }
  }

  // Test 4: Topbar search button (top right area: x=vw-300, y=16)
  {
    totalChecks++;
    const topbarTarget: TargetGeometry = {
      left: vp.vw - 320,
      top: 14,
      right: vp.vw - 120,
      bottom: 50,
      width: 200,
      height: 36,
      centerX: vp.vw - 220,
      centerY: 32,
    };

    const res = calculateMascotPlacement(topbarTarget, true, 'bottom');
    const insideViewport =
      res.x >= 0 &&
      res.x + res.width <= vp.vw &&
      res.y >= 0 &&
      res.y + res.height <= vp.vh;

    const overlapsTarget = !(
      res.x + res.width <= topbarTarget.left ||
      res.x >= topbarTarget.right ||
      res.y + res.height <= topbarTarget.top ||
      res.y >= topbarTarget.bottom
    );

    if (insideViewport && !overlapsTarget) {
      passedChecks++;
      console.log(`  ✔ [Topbar Search]: Placed ${res.direction} at (${res.x}, ${res.y}) cleanly below target`);
    } else {
      console.error(`  ❌ [Topbar Search]: Collision or out of bounds`, { res, overlapsTarget });
    }
  }
}

console.log(`\n================================================================`);
console.log(`  RESULTS: ${passedChecks}/${totalChecks} TESTS PASSED (${Math.round((passedChecks / totalChecks) * 100)}%)`);
console.log('================================================================\n');

if (passedChecks !== totalChecks) {
  process.exit(1);
}
