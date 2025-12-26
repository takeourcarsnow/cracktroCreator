'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { BaseEffect } from '@/types';

export interface VectorBallsEffect extends BaseEffect {
  type: 'vectorballs';
  ballCount: number;
  size: number;
  speed: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  colors: string[];
  formation: 'cube' | 'sphere' | 'torus' | 'wave';
  perspective: number;
}

interface Ball3D {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface VectorBallsRendererProps {
  effect: VectorBallsEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function VectorBallsRenderer({
  effect,
  width,
  height,
  isPlaying,
}: VectorBallsRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball3D[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Initialize balls based on formation
  useEffect(() => {
    const balls: Ball3D[] = [];
    const n = Math.ceil(Math.cbrt(effect.ballCount));
    
    switch (effect.formation) {
      case 'cube':
        for (let x = 0; x < n; x++) {
          for (let y = 0; y < n; y++) {
            for (let z = 0; z < n; z++) {
              if (balls.length >= effect.ballCount) break;
              balls.push({
                x: (x - n / 2) * 50,
                y: (y - n / 2) * 50,
                z: (z - n / 2) * 50,
                color: effect.colors[balls.length % effect.colors.length],
              });
            }
          }
        }
        break;
      case 'sphere':
        const phi = Math.PI * (3 - Math.sqrt(5));
        for (let i = 0; i < effect.ballCount; i++) {
          const y = 1 - (i / (effect.ballCount - 1)) * 2;
          const radius = Math.sqrt(1 - y * y);
          const theta = phi * i;
          balls.push({
            x: Math.cos(theta) * radius * 100,
            y: y * 100,
            z: Math.sin(theta) * radius * 100,
            color: effect.colors[i % effect.colors.length],
          });
        }
        break;
      case 'torus':
        for (let i = 0; i < effect.ballCount; i++) {
          const u = (i / effect.ballCount) * Math.PI * 2;
          const v = (i * 7 / effect.ballCount) * Math.PI * 2;
          const R = 80;
          const r = 30;
          balls.push({
            x: (R + r * Math.cos(v)) * Math.cos(u),
            y: r * Math.sin(v),
            z: (R + r * Math.cos(v)) * Math.sin(u),
            color: effect.colors[i % effect.colors.length],
          });
        }
        break;
      case 'wave':
        const gridSize = Math.ceil(Math.sqrt(effect.ballCount));
        for (let i = 0; i < effect.ballCount; i++) {
          const gx = i % gridSize;
          const gz = Math.floor(i / gridSize);
          balls.push({
            x: (gx - gridSize / 2) * 40,
            y: 0,
            z: (gz - gridSize / 2) * 40,
            color: effect.colors[i % effect.colors.length],
          });
        }
        break;
    }
    
    ballsRef.current = balls;
  }, [effect.ballCount, effect.formation, effect.colors]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const time = timeRef.current;

    // Rotation angles
    const angleX = time * effect.rotationX * 0.01;
    const angleY = time * effect.rotationY * 0.01;
    const angleZ = time * effect.rotationZ * 0.01;

    // Rotation matrices
    const cosX = Math.cos(angleX), sinX = Math.sin(angleX);
    const cosY = Math.cos(angleY), sinY = Math.sin(angleY);
    const cosZ = Math.cos(angleZ), sinZ = Math.sin(angleZ);

    // Project and sort balls by z
    const projected = ballsRef.current.map((ball, i) => {
      let { x, y, z } = ball;

      // Wave animation for wave formation
      if (effect.formation === 'wave') {
        y = Math.sin(x * 0.05 + time * effect.speed * 0.1) * 30 +
            Math.sin(z * 0.05 + time * effect.speed * 0.1) * 30;
      }

      // Rotate X
      let y1 = y * cosX - z * sinX;
      let z1 = y * sinX + z * cosX;
      
      // Rotate Y
      let x2 = x * cosY + z1 * sinY;
      let z2 = -x * sinY + z1 * cosY;
      
      // Rotate Z
      let x3 = x2 * cosZ - y1 * sinZ;
      let y3 = x2 * sinZ + y1 * cosZ;

      // Perspective projection
      const scale = effect.perspective / (effect.perspective + z2);
      const projX = x3 * scale + centerX;
      const projY = y3 * scale + centerY;

      return {
        x: projX,
        y: projY,
        z: z2,
        scale,
        color: ball.color,
        index: i,
      };
    });

    // Sort by z (far to near)
    projected.sort((a, b) => a.z - b.z);

    // Draw balls
    projected.forEach((ball) => {
      const size = effect.size * ball.scale;
      
      // 3D shaded sphere
      const gradient = ctx.createRadialGradient(
        ball.x - size * 0.3,
        ball.y - size * 0.3,
        0,
        ball.x,
        ball.y,
        size
      );
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.3, ball.color);
      gradient.addColorStop(1, '#000000');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, Math.max(1, size), 0, Math.PI * 2);
      ctx.fill();
    });

    if (isPlaying) {
      timeRef.current += effect.speed * 0.5;
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [effect, width, height, isPlaying]);

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
