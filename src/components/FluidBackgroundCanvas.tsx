import React, { useEffect, useRef } from 'react';

export const FluidBackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
    };
    window.addEventListener('resize', handleResize);

    // Mouse tracking
    const mouse = {
      x: -1000,
      y: -1000,
      vx: 0,
      vy: 0,
      lastX: -1000,
      lastY: -1000,
      radius: 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.vx = e.clientX - mouse.lastX;
      mouse.vy = e.clientY - mouse.lastY;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.lastX = e.clientX;
      mouse.lastY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Fluid Grid Nodes
    interface GridNode {
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    let gridNodes: GridNode[] = [];
    const spacing = 45;

    const initGrid = () => {
      gridNodes = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const baseX = c * spacing;
          const baseY = r * spacing;
          gridNodes.push({
            baseX,
            baseY,
            x: baseX,
            y: baseY,
            vx: 0,
            vy: 0,
          });
        }
      }
    };
    initGrid();

    // Floating Zero-Gravity 3D Wireframe Shapes (Cube, Octahedron, Ring)
    interface FloatingShape {
      x: number;
      y: number;
      z: number;
      size: number;
      rx: number;
      ry: number;
      rz: number;
      drx: number;
      dry: number;
      drz: number;
      type: 'cube' | 'octahedron' | 'torus';
      color: string;
      floatPhase: number;
      floatSpeed: number;
    }

    const shapes: FloatingShape[] = [
      {
        x: width * 0.15,
        y: height * 0.25,
        z: 0,
        size: 55,
        rx: 0.2,
        ry: 0.4,
        rz: 0.1,
        drx: 0.008,
        dry: 0.012,
        drz: 0.005,
        type: 'cube',
        color: '#FF3E00',
        floatPhase: 0,
        floatSpeed: 0.02,
      },
      {
        x: width * 0.82,
        y: height * 0.35,
        z: 0,
        size: 65,
        rx: 0.5,
        ry: 0.1,
        rz: 0.3,
        drx: 0.01,
        dry: 0.006,
        drz: 0.014,
        type: 'octahedron',
        color: '#00E5FF',
        floatPhase: 1.5,
        floatSpeed: 0.015,
      },
      {
        x: width * 0.75,
        y: height * 0.75,
        z: 0,
        size: 50,
        rx: 0.1,
        ry: 0.8,
        rz: 0.4,
        drx: 0.006,
        dry: 0.015,
        drz: 0.008,
        type: 'torus',
        color: '#FFB800',
        floatPhase: 3.0,
        floatSpeed: 0.018,
      },
      {
        x: width * 0.22,
        y: height * 0.8,
        z: 0,
        size: 45,
        rx: 0.7,
        ry: 0.3,
        rz: 0.2,
        drx: 0.012,
        dry: 0.008,
        drz: 0.01,
        type: 'cube',
        color: '#00FF9D',
        floatPhase: 4.5,
        floatSpeed: 0.022,
      },
    ];

    // Helper: 3D point rotation & projection
    const rotate3D = (
      px: number,
      py: number,
      pz: number,
      rx: number,
      ry: number,
      rz: number
    ) => {
      // Rotate X
      let y1 = py * Math.cos(rx) - pz * Math.sin(rx);
      let z1 = py * Math.sin(rx) + pz * Math.cos(rx);
      // Rotate Y
      let x2 = px * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -px * Math.sin(ry) + z1 * Math.cos(ry);
      // Rotate Z
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      return { x: x3, y: y3, z: z2 };
    };

    // Draw 3D shape wireframe
    const drawShape = (shape: FloatingShape) => {
      shape.floatPhase += shape.floatSpeed;
      const floatY = Math.sin(shape.floatPhase) * 18;
      const curX = shape.x;
      const curY = shape.y + floatY;

      shape.rx += shape.drx;
      shape.ry += shape.dry;
      shape.rz += shape.drz;

      ctx.save();
      ctx.translate(curX, curY);
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = 1.4;
      ctx.shadowColor = shape.color;
      ctx.shadowBlur = 12;

      if (shape.type === 'cube') {
        const s = shape.size / 2;
        const vertices = [
          { x: -s, y: -s, z: -s },
          { x: s, y: -s, z: -s },
          { x: s, y: s, z: -s },
          { x: -s, y: s, z: -s },
          { x: -s, y: -s, z: s },
          { x: s, y: -s, z: s },
          { x: s, y: s, z: s },
          { x: -s, y: s, z: s },
        ].map((v) => rotate3D(v.x, v.y, v.z, shape.rx, shape.ry, shape.rz));

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ];

        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(vertices[i].x, vertices[i].y);
          ctx.lineTo(vertices[j].x, vertices[j].y);
          ctx.stroke();
        });
      } else if (shape.type === 'octahedron') {
        const s = shape.size / 1.5;
        const vertices = [
          { x: 0, y: -s, z: 0 },
          { x: s, y: 0, z: 0 },
          { x: 0, y: 0, z: s },
          { x: -s, y: 0, z: 0 },
          { x: 0, y: 0, z: -s },
          { x: 0, y: s, z: 0 },
        ].map((v) => rotate3D(v.x, v.y, v.z, shape.rx, shape.ry, shape.rz));

        const edges = [
          [0, 1], [0, 2], [0, 3], [0, 4],
          [5, 1], [5, 2], [5, 3], [5, 4],
          [1, 2], [2, 3], [3, 4], [4, 1],
        ];

        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(vertices[i].x, vertices[i].y);
          ctx.lineTo(vertices[j].x, vertices[j].y);
          ctx.stroke();
        });
      } else if (shape.type === 'torus') {
        const segs = 12;
        const radius = shape.size / 1.6;
        for (let i = 0; i < segs; i++) {
          const angle = (i * Math.PI * 2) / segs;
          const p = rotate3D(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius,
            0,
            shape.rx,
            shape.ry,
            shape.rz
          );
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = shape.color;
          ctx.fill();
        }
      }

      ctx.restore();
    };

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Background ambient gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        100,
        width / 2,
        height / 2,
        width * 0.7
      );
      bgGrad.addColorStop(0, '#08080C');
      bgGrad.addColorStop(1, '#040406');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Update & Draw Fluid Grid Nodes
      ctx.fillStyle = 'rgba(255, 62, 0, 0.15)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;

      for (let i = 0; i < gridNodes.length; i++) {
        const node = gridNodes[i];

        // Fluid repulsion from mouse
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
          const force = (1 - dist / mouse.radius) * 12;
          const angle = Math.atan2(dy, dx);
          node.vx += Math.cos(angle) * force + mouse.vx * 0.1;
          node.vy += Math.sin(angle) * force + mouse.vy * 0.1;
        }

        // Spring tension return to base position
        const springDx = node.baseX - node.x;
        const springDy = node.baseY - node.y;
        node.vx += springDx * 0.05;
        node.vy += springDy * 0.05;

        // Damping
        node.vx *= 0.85;
        node.vy *= 0.85;

        node.x += node.vx;
        node.y += node.vy;

        // Draw node point
        const disFromBase = Math.hypot(node.x - node.baseX, node.y - node.baseY);
        if (disFromBase > 2) {
          ctx.fillStyle = `rgba(255, 62, 0, ${Math.min(0.8, disFromBase / 15)})`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 2 + Math.min(2, disFromBase / 8), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.fillRect(node.x - 0.5, node.y - 0.5, 1.5, 1.5);
        }
      }

      // Draw Floating Zero-Gravity 3D Shapes
      shapes.forEach(drawShape);

      // Decaying mouse velocity
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
};
