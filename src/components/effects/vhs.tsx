'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { BaseEffect } from '@/types';

export interface VHSEffect extends BaseEffect {
  type: 'vhs';
  scanlineIntensity: number;
  noiseIntensity: number;
  rgbShift: number;
  distortion: number;
  flickering: boolean;
  trackingLines: boolean;
}

interface VHSRendererProps {
  effect: VHSEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function VHSRenderer({
  effect,
  width,
  height,
  isPlaying,
}: VHSRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Scanlines
    if (effect.scanlineIntensity > 0) {
      ctx.fillStyle = `rgba(0, 0, 0, ${effect.scanlineIntensity * 0.3})`;
      for (let y = 0; y < height; y += 2) {
        ctx.fillRect(0, y, width, 1);
      }
    }

    // Static noise
    if (effect.noiseIntensity > 0) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < effect.noiseIntensity * 0.1) {
          const noise = Math.random() * 255;
          data[i] = noise;     // R
          data[i + 1] = noise; // G
          data[i + 2] = noise; // B
          data[i + 3] = effect.noiseIntensity * 100; // A
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
    }

    // RGB shift chromatic aberration
    if (effect.rgbShift > 0) {
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(255, 0, 0, ${effect.rgbShift * 0.1})`;
      ctx.fillRect(-effect.rgbShift, 0, width, height);
      ctx.fillStyle = `rgba(0, 0, 255, ${effect.rgbShift * 0.1})`;
      ctx.fillRect(effect.rgbShift, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
    }

    // Tracking lines (horizontal distortion)
    if (effect.trackingLines && isPlaying) {
      const trackY = (timeRef.current * 100) % height;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, trackY, width, 3);
      ctx.fillRect(0, trackY + 20, width, 2);
    }

    // Flickering
    if (effect.flickering && isPlaying) {
      if (Math.random() > 0.95) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.fillRect(0, 0, width, height);
      }
    }

    // CRT curve vignette
    if (effect.distortion > 0) {
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, `rgba(0, 0, 0, ${effect.distortion * 0.5})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

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
      className="absolute inset-0 pointer-events-none"
      style={{
        opacity: effect.opacity,
        zIndex: effect.zIndex,
        mixBlendMode: effect.blendMode,
      }}
    />
  );
}
