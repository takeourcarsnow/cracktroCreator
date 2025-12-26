'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { SineWaveEffect } from '@/types';

interface SineWaveRendererProps {
  effect: SineWaveEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function SineWaveRenderer({
  effect,
  width,
  height,
  isPlaying,
}: SineWaveRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.font = `${effect.fontSize}px ${effect.fontFamily}`;
    ctx.textBaseline = 'middle';

    const baseY = (height * effect.yPosition) / 100;
    const chars = effect.text.split('');
    let x = width / 2 - (ctx.measureText(effect.text).width / 2);

    chars.forEach((char, i) => {
      const y =
        baseY +
        Math.sin((i * effect.frequency) + offsetRef.current) * effect.amplitude;

      // Rainbow color cycling
      const colorIndex = Math.floor((i + offsetRef.current * 5) % effect.colors.length);
      ctx.fillStyle = effect.colors[Math.abs(colorIndex)];

      ctx.fillText(char, x, y);
      x += ctx.measureText(char).width;
    });

    if (isPlaying) {
      offsetRef.current += effect.speed * 0.05;
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
