'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import type { SpriteEffect } from '@/types';

interface SpriteRendererProps {
  effect: SpriteEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function SpriteRenderer({
  effect,
  width,
  height,
  isPlaying,
}: SpriteRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image
  useEffect(() => {
    if (!effect.imageUrl) {
      setImageLoaded(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageLoaded(false);
    };
    img.src = effect.imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [effect.imageUrl]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const time = timeRef.current;
    let x = (effect.x / 100) * width;
    let y = (effect.y / 100) * height;
    let rotation = 0;
    let scale = 1;

    // Apply animation
    switch (effect.animationType) {
      case 'bounce':
        y += Math.abs(Math.sin(time * effect.animationSpeed)) * effect.animationAmplitude;
        break;
      case 'float':
        y += Math.sin(time * effect.animationSpeed) * effect.animationAmplitude;
        x += Math.cos(time * effect.animationSpeed * 0.5) * effect.animationAmplitude * 0.5;
        break;
      case 'rotate':
        rotation = time * effect.animationSpeed;
        break;
      case 'pulse':
        scale = 1 + Math.sin(time * effect.animationSpeed) * 0.2;
        break;
    }

    // Draw sprite or placeholder
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);

    if (imageLoaded && imageRef.current) {
      ctx.drawImage(
        imageRef.current,
        -effect.width / 2,
        -effect.height / 2,
        effect.width,
        effect.height
      );
    } else {
      // Draw placeholder
      ctx.fillStyle = '#FF00FF';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.fillRect(-effect.width / 2, -effect.height / 2, effect.width, effect.height);
      ctx.strokeRect(-effect.width / 2, -effect.height / 2, effect.width, effect.height);
      
      // Draw X
      ctx.beginPath();
      ctx.moveTo(-effect.width / 2, -effect.height / 2);
      ctx.lineTo(effect.width / 2, effect.height / 2);
      ctx.moveTo(effect.width / 2, -effect.height / 2);
      ctx.lineTo(-effect.width / 2, effect.height / 2);
      ctx.stroke();

      // Draw text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SPRITE', 0, 0);
    }

    ctx.restore();

    if (isPlaying) {
      timeRef.current += 0.05;
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [effect, width, height, isPlaying, imageLoaded]);

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
