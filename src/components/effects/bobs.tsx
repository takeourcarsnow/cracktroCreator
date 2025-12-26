'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { BaseEffect } from '@/types';

export interface BobsEffect extends BaseEffect {
  type: 'bobs';
  bobCount: number;
  speed: number;
  size: number;
  colors: string[];
  pattern: 'circle' | 'wave' | 'lissajous' | 'spiral';
  trailLength: number;
  glowEnabled: boolean;
}

interface Bob {
  x: number;
  y: number;
  phase: number;
  color: string;
}

interface BobsRendererProps {
  effect: BobsEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function BobsRenderer({
  effect,
  width,
  height,
  isPlaying,
}: BobsRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bobsRef = useRef<Bob[]>([]);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Initialize bobs
  useEffect(() => {
    bobsRef.current = Array.from({ length: effect.bobCount }, (_, i) => ({
      x: width / 2,
      y: height / 2,
      phase: (i / effect.bobCount) * Math.PI * 2,
      color: effect.colors[i % effect.colors.length],
    }));
  }, [effect.bobCount, effect.colors, width, height]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Trail effect
    if (effect.trailLength > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${1 - effect.trailLength / 100})`;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }

    const centerX = width / 2;
    const centerY = height / 2;
    const time = timeRef.current;

    bobsRef.current.forEach((bob, i) => {
      const phase = bob.phase + time * effect.speed;
      
      switch (effect.pattern) {
        case 'circle':
          bob.x = centerX + Math.cos(phase) * (width * 0.35);
          bob.y = centerY + Math.sin(phase) * (height * 0.35);
          break;
        case 'wave':
          bob.x = (i / effect.bobCount) * width;
          bob.y = centerY + Math.sin(phase + i * 0.3) * (height * 0.3);
          break;
        case 'lissajous':
          bob.x = centerX + Math.sin(phase * 3) * (width * 0.35);
          bob.y = centerY + Math.sin(phase * 2) * (height * 0.35);
          break;
        case 'spiral':
          const r = (Math.sin(phase * 0.5) + 1) * 0.5 * Math.min(width, height) * 0.4;
          bob.x = centerX + Math.cos(phase * 2) * r;
          bob.y = centerY + Math.sin(phase * 2) * r;
          break;
      }

      // Draw glow
      if (effect.glowEnabled) {
        const gradient = ctx.createRadialGradient(
          bob.x, bob.y, 0,
          bob.x, bob.y, effect.size * 2
        );
        gradient.addColorStop(0, bob.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bob.x, bob.y, effect.size * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw bob
      ctx.fillStyle = bob.color;
      ctx.beginPath();
      ctx.arc(bob.x, bob.y, effect.size, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(
        bob.x - effect.size * 0.3,
        bob.y - effect.size * 0.3,
        effect.size * 0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    if (isPlaying) {
      timeRef.current += 0.05;
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
