'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { RasterBarsEffect } from '@/types';

interface RasterBarsRendererProps {
  effect: RasterBarsEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function RasterBarsRenderer({
  effect,
  width,
  height,
  isPlaying,
}: RasterBarsRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < effect.barCount; i++) {
      const baseY = (height / 2) + (i - effect.barCount / 2) * effect.spacing;
      const y = baseY + Math.sin(timeRef.current + i * 0.5) * effect.amplitude;

      const gradient = ctx.createLinearGradient(0, y, 0, y + effect.barHeight);
      const colorIndex = i % effect.colors.length;
      const nextColorIndex = (i + 1) % effect.colors.length;

      gradient.addColorStop(0, effect.colors[colorIndex]);
      gradient.addColorStop(0.5, effect.colors[nextColorIndex]);
      gradient.addColorStop(1, effect.colors[colorIndex]);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, y, width, effect.barHeight);

      // Add glow effect
      ctx.shadowColor = effect.colors[colorIndex];
      ctx.shadowBlur = 20;
    }

    ctx.shadowBlur = 0;

    if (isPlaying) {
      timeRef.current += effect.speed * 0.05;
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
