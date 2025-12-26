'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { CheckerboardEffect } from '@/types';

interface CheckerboardRendererProps {
  effect: CheckerboardEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function CheckerboardRenderer({
  effect,
  width,
  height,
  isPlaying,
}: CheckerboardRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offsetRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const startY = (height * effect.yOffset) / 100;
    const floorHeight = height - startY;
    const horizon = startY;

    // Draw perspective checkerboard
    for (let screenY = horizon; screenY < height; screenY++) {
      const perspectiveScale = (screenY - horizon) / floorHeight;
      const z = (effect.perspective / perspectiveScale) + offsetRef.current;

      for (let screenX = 0; screenX < width; screenX++) {
        const worldX = ((screenX - width / 2) * z) / effect.perspective;
        const tileX = Math.floor(worldX / effect.tileSize);
        const tileZ = Math.floor(z / effect.tileSize);

        const isLight = (tileX + tileZ) % 2 === 0;
        ctx.fillStyle = isLight ? effect.color1 : effect.color2;
        ctx.fillRect(screenX, screenY, 1, 1);
      }
    }

    // Add fade to horizon
    const gradient = ctx.createLinearGradient(0, horizon, 0, horizon + 50);
    gradient.addColorStop(0, 'rgba(0,0,0,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, horizon, width, 50);

    if (isPlaying) {
      offsetRef.current += effect.scrollSpeed;
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
