'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { FireEffect } from '@/types';

interface FireRendererProps {
  effect: FireEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function FireRenderer({
  effect,
  width,
  height,
  isPlaying,
}: FireRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireRef = useRef<number[][]>([]);
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

  // Initialize fire array
  useEffect(() => {
    const fireHeight = effect.height;
    fireRef.current = Array.from({ length: fireHeight }, () =>
      Array.from({ length: width }, () => 0)
    );
  }, [width, effect.height]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const fire = fireRef.current;
    const fireHeight = fire.length;

    if (isPlaying) {
      // Set bottom row to random values
      for (let x = 0; x < width; x++) {
        fire[fireHeight - 1][x] = Math.random() * effect.intensity;
      }

      // Propagate fire upward
      for (let y = 0; y < fireHeight - 1; y++) {
        for (let x = 0; x < width; x++) {
          const decay = Math.random() * effect.spread * 0.1;
          const spreadX = Math.floor(Math.random() * 3) - 1;
          const srcX = Math.max(0, Math.min(width - 1, x + spreadX));
          fire[y][x] = Math.max(0, fire[y + 1][srcX] - decay);
        }
      }
    }

    // Draw fire
    const imageData = ctx.createImageData(width, fireHeight);
    const data = imageData.data;
    const colors = effect.colors.map(hexToRgb);

    for (let y = 0; y < fireHeight; y++) {
      for (let x = 0; x < width; x++) {
        const intensity = Math.min(1, fire[y][x]);
        const colorIndex = Math.floor(intensity * (colors.length - 1));
        const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
        const t = (intensity * (colors.length - 1)) % 1;

        const color1 = colors[colorIndex];
        const color2 = colors[nextColorIndex];

        const r = Math.floor(color1.r + (color2.r - color1.r) * t);
        const g = Math.floor(color1.g + (color2.g - color1.g) * t);
        const b = Math.floor(color1.b + (color2.b - color1.b) * t);

        const index = (y * width + x) * 4;
        data[index] = r;
        data[index + 1] = g;
        data[index + 2] = b;
        data[index + 3] = intensity > 0.05 ? 255 : 0;
      }
    }

    ctx.putImageData(imageData, 0, height - fireHeight);

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
