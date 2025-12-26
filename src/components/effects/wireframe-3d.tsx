'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { Wireframe3DEffect } from '@/types';

interface Wireframe3DRendererProps {
  effect: Wireframe3DEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Edge {
  from: number;
  to: number;
}

function createCube(): { vertices: Point3D[]; edges: Edge[] } {
  return {
    vertices: [
      { x: -1, y: -1, z: -1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },
      { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 0 },
      { from: 4, to: 5 }, { from: 5, to: 6 }, { from: 6, to: 7 }, { from: 7, to: 4 },
      { from: 0, to: 4 }, { from: 1, to: 5 }, { from: 2, to: 6 }, { from: 3, to: 7 },
    ],
  };
}

function createPyramid(): { vertices: Point3D[]; edges: Edge[] } {
  return {
    vertices: [
      { x: 0, y: -1, z: 0 },
      { x: -1, y: 1, z: -1 },
      { x: 1, y: 1, z: -1 },
      { x: 1, y: 1, z: 1 },
      { x: -1, y: 1, z: 1 },
    ],
    edges: [
      { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 }, { from: 0, to: 4 },
      { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 3, to: 4 }, { from: 4, to: 1 },
    ],
  };
}

function createTorus(rings = 12, segments = 12): { vertices: Point3D[]; edges: Edge[] } {
  const vertices: Point3D[] = [];
  const edges: Edge[] = [];
  const R = 1;
  const r = 0.4;

  for (let i = 0; i < rings; i++) {
    const theta = (i / rings) * Math.PI * 2;
    for (let j = 0; j < segments; j++) {
      const phi = (j / segments) * Math.PI * 2;
      vertices.push({
        x: (R + r * Math.cos(phi)) * Math.cos(theta),
        y: r * Math.sin(phi),
        z: (R + r * Math.cos(phi)) * Math.sin(theta),
      });

      const current = i * segments + j;
      const nextRing = ((i + 1) % rings) * segments + j;
      const nextSeg = i * segments + ((j + 1) % segments);

      edges.push({ from: current, to: nextRing });
      edges.push({ from: current, to: nextSeg });
    }
  }

  return { vertices, edges };
}

function createSphere(rings = 10, segments = 12): { vertices: Point3D[]; edges: Edge[] } {
  const vertices: Point3D[] = [];
  const edges: Edge[] = [];

  for (let i = 0; i <= rings; i++) {
    const theta = (i / rings) * Math.PI;
    for (let j = 0; j < segments; j++) {
      const phi = (j / segments) * Math.PI * 2;
      vertices.push({
        x: Math.sin(theta) * Math.cos(phi),
        y: Math.cos(theta),
        z: Math.sin(theta) * Math.sin(phi),
      });

      if (i < rings) {
        const current = i * segments + j;
        const nextRing = (i + 1) * segments + j;
        const nextSeg = i * segments + ((j + 1) % segments);

        edges.push({ from: current, to: nextRing });
        if (i > 0 && i < rings) {
          edges.push({ from: current, to: nextSeg });
        }
      }
    }
  }

  return { vertices, edges };
}

export function Wireframe3DRenderer({
  effect,
  width,
  height,
  isPlaying,
}: Wireframe3DRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef({ x: 0, y: 0, z: 0 });
  const animationRef = useRef<number | null>(null);

  const getShape = useCallback(() => {
    switch (effect.shape) {
      case 'cube': return createCube();
      case 'pyramid': return createPyramid();
      case 'torus': return createTorus();
      case 'sphere': return createSphere();
      default: return createCube();
    }
  }, [effect.shape]);

  const rotateX = (point: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x,
      y: point.y * cos - point.z * sin,
      z: point.y * sin + point.z * cos,
    };
  };

  const rotateY = (point: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos - point.z * sin,
      y: point.y,
      z: point.x * sin + point.z * cos,
    };
  };

  const rotateZ = (point: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: point.x * cos - point.y * sin,
      y: point.x * sin + point.y * cos,
      z: point.z,
    };
  };

  const project = (point: Point3D): { x: number; y: number } => {
    const distance = 4;
    const z = point.z + distance;
    const scale = effect.scale / z;
    return {
      x: width / 2 + point.x * scale,
      y: height / 2 + point.y * scale,
    };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const { vertices, edges } = getShape();
    const rot = rotationRef.current;

    // Transform vertices
    const transformed = vertices.map((v) => {
      let p = rotateX(v, rot.x);
      p = rotateY(p, rot.y);
      p = rotateZ(p, rot.z);
      return p;
    });

    // Project to 2D
    const projected = transformed.map(project);

    // Draw edges with glow effect
    ctx.strokeStyle = effect.color;
    ctx.lineWidth = effect.lineWidth;
    ctx.lineCap = 'round';
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = 10;

    edges.forEach(({ from, to }) => {
      const p1 = projected[from];
      const p2 = projected[to];

      // Calculate depth for alpha
      const z1 = transformed[from].z;
      const z2 = transformed[to].z;
      const avgZ = (z1 + z2) / 2;
      const alpha = 0.3 + 0.7 * ((avgZ + 2) / 4);

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });

    // Draw vertices as points
    ctx.globalAlpha = 1;
    ctx.fillStyle = effect.color;
    projected.forEach((p, i) => {
      const z = transformed[i].z;
      const size = 2 + 2 * ((z + 2) / 4);
      ctx.beginPath();
      ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.shadowBlur = 0;

    if (isPlaying) {
      rot.x += effect.rotationSpeedX * 0.02;
      rot.y += effect.rotationSpeedY * 0.02;
      rot.z += effect.rotationSpeedZ * 0.02;
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [effect, width, height, isPlaying, getShape, project]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0"
      style={{ 
        opacity: effect.opacity, 
        zIndex: effect.zIndex,
        mixBlendMode: effect.blendMode,
      }}
    />
  );
}
