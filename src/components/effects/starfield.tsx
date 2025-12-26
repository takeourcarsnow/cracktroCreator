'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { StarfieldEffect } from '@/types';

interface Star {
  x: number;
  y: number;
  z: number;
}

interface StarfieldRendererProps {
  effect: StarfieldEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function StarfieldRenderer({
  effect,
  width,
  height,
  isPlaying,
}: StarfieldRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number | null>(null);

  // Initialize stars
  useEffect(() => {
    starsRef.current = Array.from({ length: effect.starCount }, () => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * 1000,
    }));
  }, [effect.starCount, width, height]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    starsRef.current.forEach((star) => {
      if (isPlaying) {
        star.z -= effect.speed * 5;
        if (star.z <= 0) {
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
          star.z = 1000;
        }
      }

      const x = (star.x / star.z) * 500 + centerX;
      const y = (star.y / star.z) * 500 + centerY;
      const size = Math.max(0.1, (1 - star.z / 1000) * effect.maxSize * effect.depth);
      const brightness = Math.max(0.2, 1 - star.z / 1000);

      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        ctx.beginPath();
        ctx.fillStyle = effect.starColor;
        ctx.globalAlpha = brightness;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.globalAlpha = 1;
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
