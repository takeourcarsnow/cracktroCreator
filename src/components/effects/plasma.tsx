'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { PlasmaEffect } from '@/types';

interface PlasmaRendererProps {
  effect: PlasmaEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function PlasmaRenderer({
  effect,
  width,
  height,
  isPlaying,
}: PlasmaRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const scale = effect.scale;
    const colors = effect.colors.map(hexToRgb);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value =
          Math.sin(x / (10 * scale) + timeRef.current) +
          Math.sin(y / (10 * scale) + timeRef.current) +
          Math.sin((x + y) / (10 * scale) + timeRef.current) +
          Math.sin(Math.sqrt(x * x + y * y) / (10 * scale) + timeRef.current);

        const normalizedValue = (value + 4) / 8; // Normalize to 0-1
        const colorIndex = normalizedValue * (colors.length - 1);
        const lowerIndex = Math.floor(colorIndex);
        const upperIndex = Math.min(lowerIndex + 1, colors.length - 1);
        const t = colorIndex - lowerIndex;

        const color1 = colors[lowerIndex];
        const color2 = colors[upperIndex];

        const r = Math.floor(color1.r + (color2.r - color1.r) * t);
        const g = Math.floor(color1.g + (color2.g - color1.g) * t);
        const b = Math.floor(color1.b + (color2.b - color1.b) * t);

        const index = (y * width + x) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = 255 * effect.intensity;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    if (isPlaying) {
      timeRef.current += effect.speed * 0.02;
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
