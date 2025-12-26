'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { BaseEffect } from '@/types';

export interface LensFlareEffect extends BaseEffect {
  type: 'lensflare';
  x: number;
  y: number;
  size: number;
  intensity: number;
  colors: string[];
  anamorphic: boolean;
  ghostCount: number;
}

interface LensFlareRendererProps {
  effect: LensFlareEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function LensFlareRenderer({
  effect,
  width,
  height,
  isPlaying,
}: LensFlareRendererProps) {
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
    const flareX = (effect.x / 100) * width;
    const flareY = (effect.y / 100) * height;
    
    // Pulsing animation
    const pulse = isPlaying ? 1 + Math.sin(timeRef.current * 2) * 0.1 : 1;
    const size = effect.size * pulse;

    // Main flare glow
    const mainGradient = ctx.createRadialGradient(
      flareX, flareY, 0,
      flareX, flareY, size * 2
    );
    mainGradient.addColorStop(0, `rgba(255, 255, 255, ${effect.intensity})`);
    mainGradient.addColorStop(0.2, effect.colors[0] || '#FFD700');
    mainGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    
    ctx.fillStyle = mainGradient;
    ctx.beginPath();
    ctx.arc(flareX, flareY, size * 2, 0, Math.PI * 2);
    ctx.fill();

    // Anamorphic streak
    if (effect.anamorphic) {
      ctx.save();
      const streakGradient = ctx.createLinearGradient(
        flareX - width / 2, flareY,
        flareX + width / 2, flareY
      );
      streakGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      streakGradient.addColorStop(0.4, `rgba(255, 255, 255, ${effect.intensity * 0.3})`);
      streakGradient.addColorStop(0.5, `rgba(255, 255, 255, ${effect.intensity * 0.5})`);
      streakGradient.addColorStop(0.6, `rgba(255, 255, 255, ${effect.intensity * 0.3})`);
      streakGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = streakGradient;
      ctx.fillRect(0, flareY - size / 4, width, size / 2);
      ctx.restore();
    }

    // Ghost flares along the line from center to flare
    const dx = flareX - centerX;
    const dy = flareY - centerY;
    
    for (let i = 0; i < effect.ghostCount; i++) {
      const t = (i + 1) / (effect.ghostCount + 1) * 2 - 0.5;
      const ghostX = centerX + dx * t;
      const ghostY = centerY + dy * t;
      const ghostSize = size * (0.3 + Math.random() * 0.4) * (1 - Math.abs(t - 0.5));
      
      const ghostGradient = ctx.createRadialGradient(
        ghostX, ghostY, 0,
        ghostX, ghostY, ghostSize
      );
      const color = effect.colors[i % effect.colors.length] || '#00FFFF';
      ghostGradient.addColorStop(0, color.replace(')', `, ${effect.intensity * 0.3})`).replace('rgb', 'rgba'));
      ghostGradient.addColorStop(0.5, color.replace(')', `, ${effect.intensity * 0.1})`).replace('rgb', 'rgba'));
      ghostGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = ghostGradient;
      ctx.beginPath();
      ctx.arc(ghostX, ghostY, ghostSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Starburst rays
    ctx.save();
    ctx.translate(flareX, flareY);
    ctx.strokeStyle = `rgba(255, 255, 255, ${effect.intensity * 0.5})`;
    ctx.lineWidth = 1;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + timeRef.current * 0.1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(
        Math.cos(angle) * size * 1.5,
        Math.sin(angle) * size * 1.5
      );
      ctx.stroke();
    }
    ctx.restore();

    if (isPlaying) {
      timeRef.current += 0.016;
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
