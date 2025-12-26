'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { RotoZoomEffect } from '@/types';

interface RotoZoomRendererProps {
  effect: RotoZoomEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function RotoZoomRenderer({
  effect,
  width,
  height,
  isPlaying,
}: RotoZoomRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const time = timeRef.current;
    const rotation = time * effect.rotationSpeed;
    const zoom = 1 + Math.sin(time * effect.zoomSpeed) * 0.5;
    const scale = effect.scale * zoom;

    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);
    const centerX = width / 2;
    const centerY = height / 2;

    const color1 = hexToRgb(effect.colors[0] || '#FF00FF');
    const color2 = hexToRgb(effect.colors[1] || '#000000');

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Transform coordinates
        const dx = x - centerX;
        const dy = y - centerY;
        const tx = (dx * cos - dy * sin) / scale;
        const ty = (dx * sin + dy * cos) / scale;

        let value = 0;

        switch (effect.pattern) {
          case 'checkerboard':
            value = ((Math.floor(tx / 20) + Math.floor(ty / 20)) % 2 === 0) ? 1 : 0;
            break;
          case 'stripes':
            value = (Math.floor(tx / 15) % 2 === 0) ? 1 : 0;
            break;
          case 'dots':
            const dotX = tx % 30;
            const dotY = ty % 30;
            value = (dotX * dotX + dotY * dotY < 100) ? 1 : 0;
            break;
          case 'custom':
            value = (Math.sin(tx / 10) * Math.cos(ty / 10) > 0) ? 1 : 0;
            break;
        }

        const color = value ? color1 : color2;
        const index = (y * width + x) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);

    if (isPlaying) {
      timeRef.current += 0.02;
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
