'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { LogoEffect } from '@/types';

interface LogoRendererProps {
  effect: LogoEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function LogoRenderer({
  effect,
  width,
  height,
  isPlaying,
}: LogoRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.save();

    // Calculate position with bounce
    const bounceY = Math.sin(timeRef.current * effect.bounceSpeed) * effect.bounceAmplitude;
    const centerX = width / 2;
    const centerY = height / 2 + bounceY;

    ctx.translate(centerX, centerY);

    // Scale effect
    if (effect.scaleEffect) {
      const scale = 1 + Math.sin(timeRef.current * 2) * 0.1;
      ctx.scale(scale, scale);
    }

    // Rotation
    if (effect.rotationEnabled) {
      ctx.rotate(timeRef.current * effect.rotationSpeed * 0.1);
    }

    ctx.font = `${effect.fontSize}px ${effect.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Glow effect
    if (effect.glowEnabled) {
      ctx.shadowColor = effect.glowColor;
      ctx.shadowBlur = 30;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Draw with gradient
    if (effect.colors.length > 1) {
      const textWidth = ctx.measureText(effect.text).width;
      const gradient = ctx.createLinearGradient(-textWidth / 2, 0, textWidth / 2, 0);
      effect.colors.forEach((color, i) => {
        const offset = (i / (effect.colors.length - 1) + timeRef.current * 0.1) % 1;
        gradient.addColorStop(offset, color);
      });
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = effect.colors[0] || '#FFFFFF';
    }

    // Draw multiple passes for extra glow
    if (effect.glowEnabled) {
      for (let i = 0; i < 3; i++) {
        ctx.fillText(effect.text, 0, 0);
      }
    } else {
      ctx.fillText(effect.text, 0, 0);
    }

    ctx.restore();

    if (isPlaying) {
      timeRef.current += 0.05;
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
