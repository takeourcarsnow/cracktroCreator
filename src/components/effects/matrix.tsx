'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { MatrixEffect } from '@/types';

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
}

interface MatrixRendererProps {
  effect: MatrixEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function MatrixRenderer({
  effect,
  width,
  height,
  isPlaying,
}: MatrixRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<Column[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const columnCount = Math.floor(width / effect.fontSize);
    columnsRef.current = Array.from({ length: columnCount }, (_, i) => ({
      x: i * effect.fontSize,
      y: Math.random() * height,
      speed: Math.random() * effect.speed + 1,
      chars: Array.from({ length: 30 }, () =>
        effect.characters.charAt(Math.floor(Math.random() * effect.characters.length))
      ),
    }));
  }, [width, height, effect.fontSize, effect.speed, effect.characters]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${effect.fontSize}px monospace`;

    columnsRef.current.forEach((column) => {
      const charCount = column.chars.length;

      for (let i = 0; i < charCount; i++) {
        const y = column.y - i * effect.fontSize;
        if (y < 0 || y > height) continue;

        // First character is brightest
        if (i === 0) {
          ctx.fillStyle = '#FFFFFF';
        } else {
          const opacity = Math.max(0.1, 1 - i / charCount);
          ctx.fillStyle = effect.color;
          ctx.globalAlpha = opacity;
        }

        // Randomly change characters
        if (Math.random() > effect.density) {
          column.chars[i] = effect.characters.charAt(
            Math.floor(Math.random() * effect.characters.length)
          );
        }

        ctx.fillText(column.chars[i], column.x, y);
        ctx.globalAlpha = 1;
      }

      if (isPlaying) {
        column.y += column.speed * effect.speed;
        if (column.y > height + charCount * effect.fontSize) {
          column.y = 0;
          column.speed = Math.random() * effect.speed + 1;
        }
      }
    });

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
