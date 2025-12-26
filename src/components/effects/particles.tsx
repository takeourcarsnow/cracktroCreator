'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { ParticlesEffect } from '@/types';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
}

interface ParticlesRendererProps {
  effect: ParticlesEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function ParticlesRenderer({
  effect,
  width,
  height,
  isPlaying,
}: ParticlesRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);

  const createParticle = useCallback((): Particle => {
    return {
      x: width / 2 + (Math.random() - 0.5) * effect.spread * 2,
      y: height,
      vx: (Math.random() - 0.5) * effect.speed,
      vy: -Math.random() * effect.speed * 2 - 1,
      size: Math.random() * effect.maxSize + 1,
      color: effect.colors[Math.floor(Math.random() * effect.colors.length)],
      life: 1,
    };
  }, [effect, width, height]);

  useEffect(() => {
    particlesRef.current = Array.from({ length: effect.particleCount }, createParticle);
  }, [effect.particleCount, createParticle]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    particlesRef.current.forEach((particle, index) => {
      if (isPlaying) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += effect.gravity * 0.1;
        particle.life -= 0.005;

        if (particle.life <= 0 || particle.y < 0) {
          particlesRef.current[index] = createParticle();
          return;
        }
      }

      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;

      switch (effect.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'square':
          ctx.fillRect(
            particle.x - particle.size,
            particle.y - particle.size,
            particle.size * 2,
            particle.size * 2
          );
          break;
        case 'star':
          drawStar(ctx, particle.x, particle.y, 5, particle.size * 2, particle.size);
          break;
      }
    });

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(draw);
  }, [effect, width, height, isPlaying, createParticle]);

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

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}
