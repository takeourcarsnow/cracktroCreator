'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { TwisterEffect } from '@/types';

interface TwisterRendererProps {
  effect: TwisterEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function TwisterRenderer({
  effect,
  width,
  height,
  isPlaying,
}: TwisterRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : 'rgb(255, 0, 255)';
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const time = timeRef.current;
    const centerX = width / 2;
    const barWidth = width / effect.barCount;

    // Draw the twisting bars
    for (let bar = 0; bar < effect.barCount; bar++) {
      const colorIndex = bar % effect.colors.length;
      const color = hexToRgb(effect.colors[colorIndex]);
      
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      // Calculate twisting motion for this bar
      const barPhase = (bar / effect.barCount) * Math.PI * 2;
      const twist = Math.sin(time * effect.speed + barPhase);
      
      ctx.beginPath();
      
      // Draw the twisting column with segments
      for (let seg = 0; seg <= effect.segments; seg++) {
        const y = (seg / effect.segments) * height;
        const segPhase = (seg / effect.segments) * Math.PI * 4;
        const segTwist = Math.sin(time * effect.speed + segPhase + barPhase);
        
        const x = centerX + segTwist * effect.amplitude + (bar - effect.barCount / 2) * barWidth;
        const segWidth = barWidth * (0.5 + 0.5 * Math.cos(segPhase + time * effect.speed));

        if (seg === 0) {
          ctx.moveTo(x - segWidth / 2, y);
        }
        
        // Draw left edge
        ctx.lineTo(x - segWidth / 2, y);
      }

      // Draw right edge going back up
      for (let seg = effect.segments; seg >= 0; seg--) {
        const y = (seg / effect.segments) * height;
        const segPhase = (seg / effect.segments) * Math.PI * 4;
        const segTwist = Math.sin(time * effect.speed + segPhase + barPhase);
        
        const x = centerX + segTwist * effect.amplitude + (bar - effect.barCount / 2) * barWidth;
        const segWidth = barWidth * (0.5 + 0.5 * Math.cos(segPhase + time * effect.speed));

        ctx.lineTo(x + segWidth / 2, y);
      }

      ctx.closePath();
      
      // Create gradient fill
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, hexToRgb(effect.colors[(colorIndex + 1) % effect.colors.length]));
      gradient.addColorStop(1, color);
      
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    if (isPlaying) {
      timeRef.current += 0.03;
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
