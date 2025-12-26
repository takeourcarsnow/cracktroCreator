'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { MetaballsEffect } from '@/types';

interface MetaballsRendererProps {
  effect: MetaballsEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export function MetaballsRenderer({
  effect,
  width,
  height,
  isPlaying,
}: MetaballsRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animationRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  // Initialize balls
  useEffect(() => {
    if (!initializedRef.current || ballsRef.current.length !== effect.ballCount) {
      ballsRef.current = Array.from({ length: effect.ballCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: effect.size * (0.5 + Math.random() * 0.5),
      }));
      initializedRef.current = true;
    }
  }, [effect.ballCount, effect.size, width, height]);

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

    // Update ball positions
    if (isPlaying) {
      ballsRef.current.forEach((ball) => {
        ball.x += ball.vx * effect.speed;
        ball.y += ball.vy * effect.speed;

        // Bounce off walls
        if (ball.x < 0 || ball.x > width) ball.vx *= -1;
        if (ball.y < 0 || ball.y > height) ball.vy *= -1;

        // Keep in bounds
        ball.x = Math.max(0, Math.min(width, ball.x));
        ball.y = Math.max(0, Math.min(height, ball.y));
      });
    }

    // Render metaballs using marching squares approximation
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    const colors = effect.colors.map(hexToRgb);
    const threshold = effect.threshold;

    // Lower resolution for performance
    const scale = 2;
    
    for (let py = 0; py < height; py += scale) {
      for (let px = 0; px < width; px += scale) {
        let sum = 0;

        // Calculate metaball field value
        for (const ball of ballsRef.current) {
          const dx = px - ball.x;
          const dy = py - ball.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          sum += (ball.radius * ball.radius) / (dist * dist + 1);
        }

        // Apply threshold
        if (sum > threshold) {
          const colorIndex = Math.min(
            Math.floor((sum - threshold) * (colors.length - 1)),
            colors.length - 1
          );
          const color = colors[Math.max(0, colorIndex)];

          // Fill the scaled pixel
          for (let sy = 0; sy < scale && py + sy < height; sy++) {
            for (let sx = 0; sx < scale && px + sx < width; sx++) {
              const index = ((py + sy) * width + (px + sx)) * 4;
              data[index] = color.r;
              data[index + 1] = color.g;
              data[index + 2] = color.b;
              data[index + 3] = Math.min(255, (sum - threshold) * 100);
            }
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

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
