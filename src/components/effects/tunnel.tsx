'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { TunnelEffect } from '@/types';

interface TunnelRendererProps {
  effect: TunnelEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function TunnelRenderer({
  effect,
  width,
  height,
  isPlaying,
}: TunnelRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.max(width, height);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(timeRef.current * effect.rotation * 0.01);
    ctx.translate(-centerX, -centerY);

    // Draw rings from back to front
    for (let i = effect.ringCount; i > 0; i--) {
      const progress = (i + timeRef.current * effect.speed * 0.1) % effect.ringCount;
      const radius = (progress / effect.ringCount) * maxRadius;
      const colorIndex = i % effect.colors.length;

      ctx.strokeStyle = effect.colors[colorIndex];
      ctx.lineWidth = Math.max(1, (1 - progress / effect.ringCount) * 10);

      ctx.beginPath();
      
      // Draw polygon ring
      const sides = 6;
      for (let j = 0; j <= sides; j++) {
        const angle = (j / sides) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      ctx.stroke();
    }

    ctx.restore();

    if (isPlaying) {
      timeRef.current += 0.5;
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
