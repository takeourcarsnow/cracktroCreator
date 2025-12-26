'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { ScrollTextEffect } from '@/types';

interface ScrollTextRendererProps {
  effect: ScrollTextEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function ScrollTextRenderer({
  effect,
  width,
  height,
  isPlaying,
}: ScrollTextRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const positionRef = useRef(width);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    ctx.font = `${effect.fontSize}px ${effect.fontFamily}`;
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(effect.text).width;
    const y = (height * effect.yPosition) / 100;

    if (effect.useGradient && effect.gradientColors.length >= 2) {
      const gradient = ctx.createLinearGradient(
        positionRef.current,
        0,
        positionRef.current + textWidth,
        0
      );
      effect.gradientColors.forEach((color, i) => {
        gradient.addColorStop(i / (effect.gradientColors.length - 1), color);
      });
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = effect.color;
    }

    ctx.fillText(effect.text, positionRef.current, y);

    // Update position
    if (isPlaying) {
      switch (effect.direction) {
        case 'left':
          positionRef.current -= effect.speed;
          if (positionRef.current < -textWidth) {
            positionRef.current = width;
          }
          break;
        case 'right':
          positionRef.current += effect.speed;
          if (positionRef.current > width) {
            positionRef.current = -textWidth;
          }
          break;
      }
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
