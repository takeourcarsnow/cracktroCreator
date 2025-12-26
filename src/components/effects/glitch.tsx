'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { GlitchEffect } from '@/types';

interface GlitchRendererProps {
  effect: GlitchEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function GlitchRenderer({
  effect,
  width,
  height,
  isPlaying,
}: GlitchRendererProps) {
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
    const intensity = effect.intensity;

    // Draw scanlines
    if (effect.scanlines) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 2);
      }
    }

    // Draw noise
    if (effect.noise > 0) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < effect.noise * 0.1) {
          const noise = Math.random() * 255;
          data[i] = noise;
          data[i + 1] = noise;
          data[i + 2] = noise;
          data[i + 3] = Math.random() * 100;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Draw glitch slices
    const sliceHeight = height / effect.sliceCount;
    for (let i = 0; i < effect.sliceCount; i++) {
      if (Math.random() < intensity * 0.3) {
        const y = i * sliceHeight;
        const offsetX = (Math.random() - 0.5) * intensity * 100;
        
        // Color shift effect
        if (effect.colorShift) {
          ctx.fillStyle = `rgba(255, 0, 0, ${intensity * 0.3})`;
          ctx.fillRect(offsetX - 5, y, width, sliceHeight);
          
          ctx.fillStyle = `rgba(0, 255, 255, ${intensity * 0.3})`;
          ctx.fillRect(offsetX + 5, y, width, sliceHeight);
        }

        // White glitch bars
        if (Math.random() < 0.3) {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * intensity})`;
          ctx.fillRect(0, y, width, Math.random() * sliceHeight);
        }
      }
    }

    // Random horizontal offset lines
    for (let i = 0; i < 5 * intensity; i++) {
      if (Math.random() < 0.5) {
        const y = Math.random() * height;
        const h = Math.random() * 10;
        const offsetX = (Math.random() - 0.5) * intensity * 50;
        
        ctx.fillStyle = effect.colorShift 
          ? `rgba(${Math.random() > 0.5 ? '255,0,255' : '0,255,255'}, ${intensity * 0.5})`
          : `rgba(255, 255, 255, ${intensity * 0.5})`;
        ctx.fillRect(offsetX, y, width, h);
      }
    }

    if (isPlaying) {
      timeRef.current += effect.speed * 0.05;
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
