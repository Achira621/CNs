import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CipherMethod } from '../types';

export interface GraphNode {
  id: string;
  name: string;
  prettyName: string;
  category: 'mono' | 'poly' | 'block' | 'modern' | 'modes' | 'math' | 'attack' | 'lessons';
  categoryLabel: string;
  color: string;
  targetMethod?: CipherMethod;
  targetTab?: 'studio' | 'math' | 'attack' | 'lessons';
  description: string;
  mass: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isDragging?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
  strength: number;
}

export const CRYPTO_NODES: GraphNode[] = [
  // Monoalphabetic
  {
    id: 'caesar_default',
    name: 'caesar_default',
    prettyName: 'Caesar Cipher',
    category: 'mono',
    categoryLabel: 'Monoalphabetic',
    color: '#38bdf8', // Sky 400
    targetMethod: 'caesar_default',
    targetTab: 'studio',
    description: 'Classical shift cipher (C = (P + 3) mod 26).',
    mass: 14,
    x: -240,
    y: -140,
    vx: 0,
    vy: 0,
  },
  {
    id: 'caesar_custom',
    name: 'caesar_custom',
    prettyName: 'Custom Caesar',
    category: 'mono',
    categoryLabel: 'Monoalphabetic',
    color: '#0284c7', // Sky 600
    targetMethod: 'caesar_custom',
    targetTab: 'studio',
    description: 'Arbitrary shift cipher with key k in [0, 25].',
    mass: 12,
    x: -320,
    y: -90,
    vx: 0,
    vy: 0,
  },
  {
    id: 'multiplicative',
    name: 'multiplicative',
    prettyName: 'Multiplicative Cipher',
    category: 'mono',
    categoryLabel: 'Monoalphabetic',
    color: '#818cf8', // Indigo 400
    targetMethod: 'multiplicative',
    targetTab: 'studio',
    description: 'Modular decimation cipher C = (a * P) mod 26 where gcd(a,26) = 1.',
    mass: 13,
    x: -260,
    y: -30,
    vx: 0,
    vy: 0,
  },
  {
    id: 'affine',
    name: 'affine',
    prettyName: 'Affine Cipher',
    category: 'mono',
    categoryLabel: 'Monoalphabetic',
    color: '#a855f7', // Purple 500
    targetMethod: 'affine',
    targetTab: 'studio',
    description: 'Dual-key linear transformation C = (a*P + b) mod 26.',
    mass: 17,
    x: -180,
    y: -70,
    vx: 0,
    vy: 0,
  },

  // Polyalphabetic
  {
    id: 'vigenere',
    name: 'vigenere',
    prettyName: 'Vigenère Cipher',
    category: 'poly',
    categoryLabel: 'Polyalphabetic',
    color: '#ec4899', // Pink 500
    targetMethod: 'vigenere',
    targetTab: 'studio',
    description: 'Periodic polyalphabetic table substitution via key phrase.',
    mass: 16,
    x: -120,
    y: 120,
    vx: 0,
    vy: 0,
  },
  {
    id: 'playfair',
    name: 'playfair',
    prettyName: 'Playfair Matrix',
    category: 'poly',
    categoryLabel: 'Polyalphabetic',
    color: '#f43f5e', // Rose 500
    targetMethod: 'playfair',
    targetTab: 'studio',
    description: '5x5 digram matrix substitution cipher with omit-J rule.',
    mass: 15,
    x: -200,
    y: 190,
    vx: 0,
    vy: 0,
  },
  {
    id: 'hill',
    name: 'hill',
    prettyName: 'Hill Cipher',
    category: 'poly',
    categoryLabel: 'Polyalphabetic',
    color: '#fb7185', // Rose 400
    targetMethod: 'hill',
    targetTab: 'studio',
    description: 'Polygraphic matrix vector transformation via invertible mod 26 matrix.',
    mass: 16,
    x: -40,
    y: 180,
    vx: 0,
    vy: 0,
  },

  // Modern FIPS & Block Ciphers
  {
    id: 'des',
    name: 'des',
    prettyName: 'Single DES',
    category: 'modern',
    categoryLabel: 'Modern Standards',
    color: '#f97316', // Orange 500
    targetMethod: 'des',
    targetTab: 'studio',
    description: 'Data Encryption Standard 64-bit Feistel network with 16 rounds.',
    mass: 16,
    x: 140,
    y: -140,
    vx: 0,
    vy: 0,
  },
  {
    id: '2des',
    name: '2des',
    prettyName: 'Double DES (2DES)',
    category: 'modern',
    categoryLabel: 'Modern Standards',
    color: '#ea580c', // Orange 600
    targetMethod: '2des',
    targetTab: 'studio',
    description: 'Cascaded 2-key DES vulnerable to Meet-in-the-Middle attack.',
    mass: 15,
    x: 230,
    y: -90,
    vx: 0,
    vy: 0,
  },
  {
    id: '3des',
    name: '3des',
    prettyName: 'Triple DES (3DES EDE)',
    category: 'modern',
    categoryLabel: 'Modern Standards',
    color: '#c2410c', // Orange 700
    targetMethod: '3des',
    targetTab: 'studio',
    description: 'Encrypt-Decrypt-Encrypt 3-key standard mitigating MITM.',
    mass: 15,
    x: 320,
    y: -60,
    vx: 0,
    vy: 0,
  },
  {
    id: 'aes',
    name: 'aes',
    prettyName: 'AES (Rijndael)',
    category: 'modern',
    categoryLabel: 'Modern Standards',
    color: '#10b981', // Emerald 500
    targetMethod: 'aes',
    targetTab: 'studio',
    description: 'FIPS 197 standard 128/192/256-bit substitution-permutation network.',
    mass: 20,
    x: 180,
    y: 40,
    vx: 0,
    vy: 0,
  },

  // Block Modes
  {
    id: 'ecb',
    name: 'ecb',
    prettyName: 'ECB Mode',
    category: 'modes',
    categoryLabel: 'Block Cipher Modes',
    color: '#eab308', // Yellow 500
    targetMethod: 'ecb',
    targetTab: 'studio',
    description: 'Electronic Codebook - deterministic independent block encryption.',
    mass: 13,
    x: 270,
    y: 110,
    vx: 0,
    vy: 0,
  },
  {
    id: 'cbc',
    name: 'cbc',
    prettyName: 'CBC Mode',
    category: 'modes',
    categoryLabel: 'Block Cipher Modes',
    color: '#ca8a04', // Yellow 600
    targetMethod: 'cbc',
    targetTab: 'studio',
    description: 'Cipher Block Chaining with Initialization Vector (IV) XOR chaining.',
    mass: 15,
    x: 320,
    y: 180,
    vx: 0,
    vy: 0,
  },
  {
    id: 'cfb',
    name: 'cfb',
    prettyName: 'CFB Mode',
    category: 'modes',
    categoryLabel: 'Block Cipher Modes',
    color: '#a16207', // Yellow 700
    targetMethod: 'cfb',
    targetTab: 'studio',
    description: 'Cipher Feedback stream cipher emulation.',
    mass: 12,
    x: 260,
    y: 250,
    vx: 0,
    vy: 0,
  },
  {
    id: 'ofb',
    name: 'ofb',
    prettyName: 'OFB Mode',
    category: 'modes',
    categoryLabel: 'Block Cipher Modes',
    color: '#854d0e', // Yellow 800
    targetMethod: 'ofb',
    targetTab: 'studio',
    description: 'Output Feedback keystream generator without error propagation.',
    mass: 12,
    x: 170,
    y: 270,
    vx: 0,
    vy: 0,
  },
  {
    id: 'ctr',
    name: 'ctr',
    prettyName: 'CTR Mode',
    category: 'modes',
    categoryLabel: 'Block Cipher Modes',
    color: '#65a30d', // Lime 600
    targetMethod: 'ctr',
    targetTab: 'studio',
    description: 'Counter mode parallel keystream encryption without chaining.',
    mass: 14,
    x: 90,
    y: 220,
    vx: 0,
    vy: 0,
  },

  // Mathematical Foundations
  {
    id: 'mod26_clock',
    name: 'mod26_clock',
    prettyName: 'Mod 26 Clock Geometry',
    category: 'math',
    categoryLabel: 'Modular Math',
    color: '#06b6d4', // Cyan 500
    targetTab: 'math',
    description: 'Interactive circular geometry of modular arithmetic modulo 26.',
    mass: 16,
    x: -60,
    y: -180,
    vx: 0,
    vy: 0,
  },
  {
    id: 'euclidean',
    name: 'euclidean',
    prettyName: 'Extended Euclidean Lab',
    category: 'math',
    categoryLabel: 'Modular Math',
    color: '#0891b2', // Cyan 600
    targetTab: 'math',
    description: 'Bezout identity & modular multiplicative inverse solver.',
    mass: 15,
    x: -140,
    y: -230,
    vx: 0,
    vy: 0,
  },
  {
    id: 'galois_field',
    name: 'galois_field',
    prettyName: 'Galois Field GF(2⁸)',
    category: 'math',
    categoryLabel: 'Modular Math',
    color: '#0e7490', // Cyan 700
    targetTab: 'math',
    description: 'Irreducible polynomial multiplication m(x) = x⁸+x⁴+x³+x+1.',
    mass: 15,
    x: 80,
    y: -260,
    vx: 0,
    vy: 0,
  },

  // Attack & Cryptanalysis Labs
  {
    id: 'freq_analysis',
    name: 'freq_analysis',
    prettyName: 'Chi-Squared Analysis',
    category: 'attack',
    categoryLabel: 'Cryptanalysis',
    color: '#ef4444', // Red 500
    targetTab: 'attack',
    description: 'Statistical English letter frequency cracking engine.',
    mass: 15,
    x: -330,
    y: 40,
    vx: 0,
    vy: 0,
  },
  {
    id: 'mitm_attack',
    name: 'mitm_attack',
    prettyName: '2DES MITM Cracker',
    category: 'attack',
    categoryLabel: 'Cryptanalysis',
    color: '#dc2626', // Red 600
    targetTab: 'attack',
    description: 'Time-memory tradeoff reduction from 2¹¹² to 2⁵⁷ work factor.',
    mass: 16,
    x: 280,
    y: -190,
    vx: 0,
    vy: 0,
  },
  {
    id: 'sac_avalanche',
    name: 'sac_avalanche',
    prettyName: 'Strict Avalanche (SAC)',
    category: 'attack',
    categoryLabel: 'Cryptanalysis',
    color: '#b91c1c', // Red 700
    targetTab: 'attack',
    description: 'Single-bit flip diffusion measurement targeting 50% change.',
    mass: 15,
    x: 230,
    y: -10,
    vx: 0,
    vy: 0,
  },

  // Masterclass Lessons & AI Tutor
  {
    id: 'masterclass_lessons',
    name: 'masterclass_lessons',
    prettyName: 'Masterclass Lessons',
    category: 'lessons',
    categoryLabel: 'Curriculum',
    color: '#6366f1', // Indigo 500
    targetTab: 'lessons',
    description: 'Comprehensive practical notes, syllabus questions, and quizzes.',
    mass: 17,
    x: 0,
    y: 310,
    vx: 0,
    vy: 0,
  },
];

export const CRYPTO_EDGES: GraphEdge[] = [
  // Monoalphabetic relationships
  { source: 'caesar_default', target: 'caesar_custom', strength: 0.05 },
  { source: 'caesar_custom', target: 'affine', strength: 0.05 },
  { source: 'multiplicative', target: 'affine', strength: 0.06 },
  { source: 'affine', target: 'mod26_clock', strength: 0.04 },
  { source: 'affine', target: 'euclidean', strength: 0.05 },
  { source: 'affine', target: 'freq_analysis', strength: 0.04 },
  { source: 'caesar_default', target: 'freq_analysis', strength: 0.04 },

  // Polyalphabetic relationships
  { source: 'vigenere', target: 'playfair', strength: 0.04 },
  { source: 'vigenere', target: 'hill', strength: 0.04 },
  { source: 'vigenere', target: 'caesar_default', strength: 0.03 },
  { source: 'hill', target: 'mod26_clock', strength: 0.03 },

  // Block ciphers & DES to 3DES
  { source: 'des', target: '2des', strength: 0.06 },
  { source: '2des', target: '3des', strength: 0.06 },
  { source: '2des', target: 'mitm_attack', strength: 0.06 },
  { source: 'des', target: 'ecb', strength: 0.04 },

  // AES relationships
  { source: 'aes', target: 'galois_field', strength: 0.05 },
  { source: 'aes', target: 'sac_avalanche', strength: 0.05 },
  { source: 'aes', target: 'ecb', strength: 0.04 },
  { source: 'aes', target: 'cbc', strength: 0.04 },
  { source: 'aes', target: 'ctr', strength: 0.04 },

  // Block modes
  { source: 'ecb', target: 'cbc', strength: 0.04 },
  { source: 'cbc', target: 'cfb', strength: 0.04 },
  { source: 'cfb', target: 'ofb', strength: 0.04 },
  { source: 'ofb', target: 'ctr', strength: 0.04 },

  // Central hub links to masterclass
  { source: 'masterclass_lessons', target: 'affine', strength: 0.02 },
  { source: 'masterclass_lessons', target: 'aes', strength: 0.02 },
  { source: 'masterclass_lessons', target: 'vigenere', strength: 0.02 },
  { source: 'masterclass_lessons', target: 'mod26_clock', strength: 0.02 },
];

interface CryptoKnowledgeGraphProps {
  onNodeSelect: (node: GraphNode) => void;
  filterQuery?: string;
  className?: string;
}

export const CryptoKnowledgeGraph: React.FC<CryptoKnowledgeGraphProps> = ({
  onNodeSelect,
  filterQuery = '',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nodesRef = useRef<GraphNode[]>(
    CRYPTO_NODES.map((n) => ({ ...n, x: n.x + (Math.random() - 0.5) * 20, y: n.y + (Math.random() - 0.5) * 20 }))
  );
  const edgesRef = useRef<GraphEdge[]>(CRYPTO_EDGES);

  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const hoveredNodeRef = useRef<GraphNode | null>(null);

  // Pan & zoom state
  const cameraRef = useRef<{ x: number; y: number; scale: number }>({ x: 0, y: 0, scale: 1.15 });
  const isPanningRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const draggedNodeRef = useRef<GraphNode | null>(null);

  // Filter matching lookup
  const matchSet = React.useMemo(() => {
    if (!filterQuery || !filterQuery.trim()) return null;
    const q = filterQuery.toLowerCase().trim();
    const set = new Set<string>();
    for (const node of nodesRef.current) {
      if (
        node.prettyName.toLowerCase().includes(q) ||
        node.name.toLowerCase().includes(q) ||
        node.categoryLabel.toLowerCase().includes(q) ||
        node.description.toLowerCase().includes(q)
      ) {
        set.add(node.id);
      }
    }
    return set;
  }, [filterQuery]);

  // Handle Resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  // Coordinate transforms
  const screenToWorld = useCallback((sx: number, sy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const { x: camX, y: camY, scale } = cameraRef.current;
    return {
      x: (sx - rect.left - cx - camX) / scale,
      y: (sy - rect.top - cy - camY) / scale,
    };
  }, []);

  // Physics & Render Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      const nodes = nodesRef.current;
      const edges = edgesRef.current;
      const nodeMap = new Map<string, GraphNode>(nodes.map((n) => [n.id, n]));

      // 1. Force Simulation Steps
      // Spring forces
      for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) continue;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetDist = 140;
        const force = (dist - targetDist) * edge.strength;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        if (!source.isDragging) {
          source.vx += fx / source.mass;
          source.vy += fy / source.mass;
        }
        if (!target.isDragging) {
          target.vx -= fx / target.mass;
          target.vy -= fy / target.mass;
        }
      }

      // Repulsion between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);

          if (dist < 320) {
            const repel = (3000 / distSq);
            const rx = (dx / dist) * repel;
            const ry = (dy / dist) * repel;

            if (!a.isDragging) {
              a.vx -= rx / a.mass;
              a.vy -= ry / a.mass;
            }
            if (!b.isDragging) {
              b.vx += rx / b.mass;
              b.vy += ry / b.mass;
            }
          }
        }
      }

      // Center exclusion bubble (push nodes away from hero title and search omnibar)
      const centerRepelRadiusX = 350;
      const centerRepelRadiusY = 190;

      for (const node of nodes) {
        if (!node.isDragging) {
          // Normalized elliptical distance from center (0,0)
          const nx = node.x / centerRepelRadiusX;
          const ny = node.y / centerRepelRadiusY;
          const ellDist = Math.sqrt(nx * nx + ny * ny);

          if (ellDist < 1.0 && ellDist > 0.001) {
            // Forcefully push nodes OUTWARD away from the hero card and search omnibar
            const pushFactor = (1.0 - ellDist) * 38;
            node.vx += (nx / ellDist) * pushFactor;
            node.vy += (ny / ellDist) * pushFactor;
          } else {
            // Gentle boundary containment pull towards orbit
            node.vx -= (node.x * 0.0025);
            node.vy -= (node.y * 0.0025);
          }

          // Friction damping
          node.vx *= 0.88;
          node.vy *= 0.88;

          node.x += node.vx * dt * 60;
          node.y += node.vy * dt * 60;
        }
      }

      // 2. Rendering
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Camera Transform
      const { x: camX, y: camY, scale } = cameraRef.current;
      ctx.translate(width / 2 + camX, height / 2 + camY);
      ctx.scale(scale, scale);

      // Draw subtle background grid dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      const gridSize = 60;
      const startX = Math.floor((-width / 2 - camX) / scale / gridSize) * gridSize;
      const endX = Math.ceil((width / 2 - camX) / scale / gridSize) * gridSize;
      const startY = Math.floor((-height / 2 - camY) / scale / gridSize) * gridSize;
      const endY = Math.ceil((height / 2 - camY) / scale / gridSize) * gridSize;
      for (let gx = startX; gx < endX; gx += gridSize) {
        for (let gy = startY; gy < endY; gy += gridSize) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const activeHover = hoveredNodeRef.current;

      // Draw Edges
      for (const edge of edges) {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) continue;

        const isConnectedToHover =
          activeHover && (activeHover.id === source.id || activeHover.id === target.id);
        const isMatch =
          !matchSet || (matchSet.has(source.id) && matchSet.has(target.id));

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (isConnectedToHover) {
          ctx.strokeStyle = 'rgba(129, 140, 248, 0.7)'; // Indigo glow
          ctx.lineWidth = 2.2;
        } else if (matchSet && !isMatch) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
          ctx.lineWidth = 0.8;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1.2;
        }
        ctx.stroke();
      }

      // Draw Nodes
      for (const node of nodes) {
        const isHovered = activeHover?.id === node.id;
        const isMatch = !matchSet || matchSet.has(node.id);
        const baseRadius = node.mass * 0.9;
        const radius = isHovered ? baseRadius * 1.25 : baseRadius;

        const alpha = matchSet && !isMatch ? 0.2 : 1.0;

        // Outer glow
        ctx.save();
        ctx.globalAlpha = alpha;

        if (isHovered || (matchSet && isMatch)) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 8, 0, Math.PI * 2);
          ctx.fillStyle = isHovered ? 'rgba(129, 140, 248, 0.25)' : `${node.color}33`;
          ctx.fill();
        }

        // Main node bubble
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#141419';
        ctx.fill();
        ctx.lineWidth = isHovered ? 2.5 : 1.5;
        ctx.strokeStyle = isHovered ? '#818cf8' : node.color;
        ctx.stroke();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Label
        ctx.font = `${isHovered ? '600 13px' : '500 12px'} Inter, ui-sans-serif, system-ui`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Background pill behind label for contrast
        const labelText = node.prettyName;
        const textMetrics = ctx.measureText(labelText);
        const labelY = node.y + radius + 5;

        ctx.fillStyle = 'rgba(12, 12, 16, 0.85)';
        ctx.beginPath();
        ctx.roundRect(
          node.x - textMetrics.width / 2 - 5,
          labelY - 1,
          textMetrics.width + 10,
          17,
          4
        );
        ctx.fill();

        ctx.fillStyle = isHovered
          ? '#ffffff'
          : isMatch
          ? '#e4e4e7'
          : '#71717a';
        ctx.fillText(labelText, node.x, labelY);

        ctx.restore();
      }

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [matchSet]);

  // Pointer Interaction Events
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = screenToWorld(e.clientX, e.clientY);

    // Check if clicked on a node
    for (const node of nodesRef.current) {
      const dx = node.x - x;
      const dy = node.y - y;
      const hitRadius = node.mass * 1.3;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        node.isDragging = true;
        draggedNodeRef.current = node;
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        return;
      }
    }

    // Otherwise, initiate panning
    isPanningRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = screenToWorld(e.clientX, e.clientY);

    if (draggedNodeRef.current) {
      draggedNodeRef.current.x = x;
      draggedNodeRef.current.y = y;
      draggedNodeRef.current.vx = 0;
      draggedNodeRef.current.vy = 0;
      return;
    }

    if (isPanningRef.current) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      cameraRef.current.x += dx;
      cameraRef.current.y += dy;
      return;
    }

    // Hover detection
    let found: GraphNode | null = null;
    for (const node of nodesRef.current) {
      const dx = node.x - x;
      const dy = node.y - y;
      const hitRadius = node.mass * 1.3;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        found = node;
        break;
      }
    }

    if (found !== hoveredNodeRef.current) {
      hoveredNodeRef.current = found;
      setHoveredNode(found);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (draggedNodeRef.current) {
      draggedNodeRef.current.isDragging = false;
      draggedNodeRef.current = null;
    }
    isPanningRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = screenToWorld(e.clientX, e.clientY);
    for (const node of nodesRef.current) {
      const dx = node.x - x;
      const dy = node.y - y;
      const hitRadius = node.mass * 1.3;
      if (dx * dx + dy * dy <= hitRadius * hitRadius) {
        onNodeSelect(node);
        return;
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newScale = Math.min(Math.max(cameraRef.current.scale * zoomFactor, 0.4), 3.0);
    cameraRef.current.scale = newScale;
  };

  const resetCamera = () => {
    cameraRef.current = { x: 0, y: 0, scale: 1.15 };
  };

  const zoomIn = () => {
    cameraRef.current.scale = Math.min(cameraRef.current.scale * 1.25, 3.0);
  };

  const zoomOut = () => {
    cameraRef.current.scale = Math.max(cameraRef.current.scale * 0.8, 0.4);
  };

  return (
    <div className={`relative w-full h-full select-none overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        onWheel={handleWheel}
        className="w-full h-full block cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Hover Info Tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-6 left-6 z-20 pointer-events-none max-w-sm bg-[#121218]/90 backdrop-blur-md border border-[#2b2b36] p-3.5 rounded-2xl shadow-2xl transition-all duration-200">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: hoveredNode.color }}
            />
            <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase">
              {hoveredNode.categoryLabel}
            </span>
          </div>
          <h4 className="text-white font-bold text-base mb-1">{hoveredNode.prettyName}</h4>
          <p className="text-zinc-300 text-xs leading-relaxed mb-2.5">{hoveredNode.description}</p>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">
            <span>Click node to launch studio</span>
            <span>→</span>
          </div>
        </div>
      )}

      {/* Floating Canvas Controls (Zoom in, Zoom out, Reset Center) */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 bg-[#121218]/80 backdrop-blur-md border border-[#262630] p-1.5 rounded-xl shadow-lg">
        <button
          onClick={zoomIn}
          title="Zoom in"
          className="w-8 h-8 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center font-mono font-bold text-sm transition-colors"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          title="Zoom out"
          className="w-8 h-8 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center font-mono font-bold text-sm transition-colors"
        >
          −
        </button>
        <div className="w-[1px] h-4 bg-zinc-700" />
        <button
          onClick={resetCamera}
          title="Center graph"
          className="px-2.5 h-8 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center font-mono text-xs transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};
