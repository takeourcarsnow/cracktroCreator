'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { DotMatrixEffect } from '@/types';

interface DotMatrixRendererProps {
  effect: DotMatrixEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

// 5x7 dot matrix font
const DOT_FONT: Record<string, number[]> = {
  'A': [0x1F, 0x28, 0x48, 0x28, 0x1F],
  'B': [0x7F, 0x49, 0x49, 0x49, 0x36],
  'C': [0x3E, 0x41, 0x41, 0x41, 0x22],
  'D': [0x7F, 0x41, 0x41, 0x22, 0x1C],
  'E': [0x7F, 0x49, 0x49, 0x49, 0x41],
  'F': [0x7F, 0x48, 0x48, 0x48, 0x40],
  'G': [0x3E, 0x41, 0x49, 0x49, 0x2E],
  'H': [0x7F, 0x08, 0x08, 0x08, 0x7F],
  'I': [0x41, 0x41, 0x7F, 0x41, 0x41],
  'J': [0x02, 0x01, 0x41, 0x7E, 0x40],
  'K': [0x7F, 0x08, 0x14, 0x22, 0x41],
  'L': [0x7F, 0x01, 0x01, 0x01, 0x01],
  'M': [0x7F, 0x20, 0x10, 0x20, 0x7F],
  'N': [0x7F, 0x10, 0x08, 0x04, 0x7F],
  'O': [0x3E, 0x41, 0x41, 0x41, 0x3E],
  'P': [0x7F, 0x48, 0x48, 0x48, 0x30],
  'Q': [0x3E, 0x41, 0x45, 0x42, 0x3D],
  'R': [0x7F, 0x48, 0x4C, 0x4A, 0x31],
  'S': [0x32, 0x49, 0x49, 0x49, 0x26],
  'T': [0x40, 0x40, 0x7F, 0x40, 0x40],
  'U': [0x7E, 0x01, 0x01, 0x01, 0x7E],
  'V': [0x7C, 0x02, 0x01, 0x02, 0x7C],
  'W': [0x7F, 0x02, 0x04, 0x02, 0x7F],
  'X': [0x63, 0x14, 0x08, 0x14, 0x63],
  'Y': [0x60, 0x10, 0x0F, 0x10, 0x60],
  'Z': [0x43, 0x45, 0x49, 0x51, 0x61],
  '0': [0x3E, 0x45, 0x49, 0x51, 0x3E],
  '1': [0x00, 0x21, 0x7F, 0x01, 0x00],
  '2': [0x21, 0x43, 0x45, 0x49, 0x31],
  '3': [0x22, 0x41, 0x49, 0x49, 0x36],
  '4': [0x0C, 0x14, 0x24, 0x7F, 0x04],
  '5': [0x72, 0x51, 0x51, 0x51, 0x4E],
  '6': [0x1E, 0x29, 0x49, 0x49, 0x06],
  '7': [0x40, 0x47, 0x48, 0x50, 0x60],
  '8': [0x36, 0x49, 0x49, 0x49, 0x36],
  '9': [0x30, 0x49, 0x49, 0x4A, 0x3C],
  ' ': [0x00, 0x00, 0x00, 0x00, 0x00],
  '!': [0x00, 0x00, 0x5F, 0x00, 0x00],
  '.': [0x00, 0x01, 0x00, 0x00, 0x00],
  '-': [0x08, 0x08, 0x08, 0x08, 0x08],
};

export function DotMatrixRenderer({
  effect,
  width,
  height,
  isPlaying,
}: DotMatrixRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = effect.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const dotSize = effect.dotSize;
    const gap = effect.gap;
    const cellSize = dotSize + gap;
    const text = effect.text.toUpperCase();

    // Calculate text width in dots
    const charWidth = 5;
    const charGap = 2;
    const totalTextWidth = text.length * (charWidth + charGap) * cellSize;

    // Calculate offset based on scroll direction
    let offsetX = 0;
    let offsetY = 0;

    if (effect.scrollDirection === 'left') {
      offsetX = -offsetRef.current % (totalTextWidth + width);
    } else if (effect.scrollDirection === 'right') {
      offsetX = offsetRef.current % (totalTextWidth + width) - totalTextWidth;
    } else if (effect.scrollDirection === 'up') {
      offsetY = -offsetRef.current % (height + 100);
    } else if (effect.scrollDirection === 'down') {
      offsetY = offsetRef.current % (height + 100) - 100;
    }

    // Draw dots
    ctx.fillStyle = effect.color;
    ctx.shadowColor = effect.color;
    ctx.shadowBlur = dotSize;

    const startY = (height - 7 * cellSize) / 2 + offsetY;
    let currentX = width + offsetX;

    for (const char of text) {
      const charData = DOT_FONT[char] || DOT_FONT[' '];
      
      for (let col = 0; col < 5; col++) {
        const colData = charData[col];
        for (let row = 0; row < 7; row++) {
          if ((colData >> row) & 1) {
            const x = currentX + col * cellSize;
            const y = startY + row * cellSize;

            // Only draw if visible
            if (x > -dotSize && x < width + dotSize) {
              ctx.beginPath();
              ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      currentX += (charWidth + charGap) * cellSize;
    }

    ctx.shadowBlur = 0;

    if (isPlaying) {
      offsetRef.current += effect.speed * 2;
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
