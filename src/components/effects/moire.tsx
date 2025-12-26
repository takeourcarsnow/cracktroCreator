'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { BaseEffect } from '@/types';

export interface MoireEffect extends BaseEffect {
  type: 'moire';
  pattern: 'circles' | 'lines' | 'grid';
  spacing: number;
  speed: number;
  colors: string[];
  offsetX: number;
  offsetY: number;
}

interface MoireRendererProps {
  effect: MoireEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function MoireRenderer({
  effect,
  width,
  height,
  isPlaying,
}: MoireRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const time = timeRef.current;
    const centerX = width / 2;
    const centerY = height / 2;
    const offset = Math.sin(time) * effect.offsetX;
    const offsetY = Math.cos(time) * effect.offsetY;

    ctx.lineWidth = 1;

    // Draw first pattern layer
    ctx.strokeStyle = effect.colors[0] || '#FFFFFF';
    ctx.beginPath();
    
    if (effect.pattern === 'circles') {
      for (let r = effect.spacing; r < Math.max(width, height); r += effect.spacing) {
        ctx.moveTo(centerX + r, centerY);
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      }
    } else if (effect.pattern === 'lines') {
      for (let x = 0; x < width; x += effect.spacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
    } else {
      for (let x = 0; x < width; x += effect.spacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += effect.spacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
    }
    ctx.stroke();

    // Draw second pattern layer (offset for moire)
    ctx.strokeStyle = effect.colors[1] || effect.colors[0] || '#FFFFFF';
    ctx.beginPath();
    
    if (effect.pattern === 'circles') {
      for (let r = effect.spacing; r < Math.max(width, height); r += effect.spacing) {
        ctx.moveTo(centerX + offset + r, centerY + offsetY);
        ctx.arc(centerX + offset, centerY + offsetY, r, 0, Math.PI * 2);
      }
    } else if (effect.pattern === 'lines') {
      const angle = Math.sin(time * 0.5) * 0.1;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.translate(-centerX + offset, -centerY);
      for (let x = 0; x < width + 100; x += effect.spacing) {
        ctx.moveTo(x, -50);
        ctx.lineTo(x, height + 50);
      }
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(offset, offsetY);
      for (let x = -effect.spacing; x < width + effect.spacing; x += effect.spacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = -effect.spacing; y < height + effect.spacing; y += effect.spacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.restore();
    }
    ctx.stroke();

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
