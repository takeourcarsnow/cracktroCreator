'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { CopperBarsEffect } from '@/types';

interface CopperBarsRendererProps {
  effect: CopperBarsEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function CopperBarsRenderer({
  effect,
  width,
  height,
  isPlaying,
}: CopperBarsRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const barCount = Math.floor(height / effect.barHeight);
    
    for (let i = 0; i < barCount; i++) {
      const y = i * effect.barHeight;
      const waveOffset = Math.sin(timeRef.current + i * 0.1) * effect.waveAmplitude;
      
      // Calculate color based on position and time
      const colorProgress = ((i / barCount) + timeRef.current * 0.1) % 1;
      const colorIndex = Math.floor(colorProgress * effect.colors.length);
      const nextColorIndex = (colorIndex + 1) % effect.colors.length;
      const t = (colorProgress * effect.colors.length) % 1;

      // Interpolate between colors
      const color1 = effect.colors[colorIndex];
      const color2 = effect.colors[nextColorIndex];
      
      ctx.fillStyle = color1;
      ctx.globalAlpha = 1 - t * 0.5;
      ctx.fillRect(0, y, width, effect.barHeight);
      
      ctx.fillStyle = color2;
      ctx.globalAlpha = t * 0.5;
      ctx.fillRect(0, y, width, effect.barHeight);
      
      ctx.globalAlpha = 1;
    }

    if (isPlaying) {
      timeRef.current += effect.speed * 0.03;
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
