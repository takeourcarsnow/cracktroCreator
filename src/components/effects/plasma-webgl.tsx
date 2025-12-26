'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { PlasmaEffect } from '@/types';
import {
  initWebGL,
  renderWebGL,
  getUniformLocation,
  hexToVec3,
  PLASMA_FRAGMENT_SHADER,
  type WebGLContext,
} from '@/lib/webgl-utils';

interface PlasmaRendererProps {
  effect: PlasmaEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function PlasmaRenderer({
  effect,
  width,
  height,
  isPlaying,
}: PlasmaRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glContextRef = useRef<WebGLContext | null>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    glContextRef.current = initWebGL(canvas, PLASMA_FRAGMENT_SHADER);

    return () => {
      if (glContextRef.current) {
        const { gl } = glContextRef.current;
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = glContextRef.current;
    
    if (!canvas || !ctx) {
      animationRef.current = requestAnimationFrame(draw);
      return;
    }

    const { gl, program } = ctx;

    gl.viewport(0, 0, width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(program);

    // Set uniforms
    const resLoc = getUniformLocation(ctx, 'u_resolution');
    const timeLoc = getUniformLocation(ctx, 'u_time');
    const scaleLoc = getUniformLocation(ctx, 'u_scale');
    const intensityLoc = getUniformLocation(ctx, 'u_intensity');
    const colorCountLoc = getUniformLocation(ctx, 'u_colorCount');

    if (resLoc) gl.uniform2f(resLoc, width, height);
    if (timeLoc) gl.uniform1f(timeLoc, timeRef.current);
    if (scaleLoc) gl.uniform1f(scaleLoc, effect.scale);
    if (intensityLoc) gl.uniform1f(intensityLoc, effect.intensity);
    if (colorCountLoc) gl.uniform1i(colorCountLoc, Math.min(effect.colors.length, 8));

    // Set color array
    for (let i = 0; i < Math.min(effect.colors.length, 8); i++) {
      const colorLoc = getUniformLocation(ctx, `u_colors[${i}]`);
      if (colorLoc) {
        const c = hexToVec3(effect.colors[i]);
        gl.uniform3f(colorLoc, c[0], c[1], c[2]);
      }
    }

    renderWebGL(ctx);

    if (isPlaying) {
      timeRef.current += effect.speed * 0.02;
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
