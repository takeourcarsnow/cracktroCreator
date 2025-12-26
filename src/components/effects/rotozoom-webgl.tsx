'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { RotoZoomEffect } from '@/types';
import {
  initWebGL,
  renderWebGL,
  getUniformLocation,
  hexToVec3,
  ROTOZOOM_FRAGMENT_SHADER,
  type WebGLContext,
} from '@/lib/webgl-utils';

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
  const glContextRef = useRef<WebGLContext | null>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    glContextRef.current = initWebGL(canvas, ROTOZOOM_FRAGMENT_SHADER);

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
    gl.useProgram(program);

    // Set uniforms
    const resLoc = getUniformLocation(ctx, 'u_resolution');
    const timeLoc = getUniformLocation(ctx, 'u_time');
    const rotSpeedLoc = getUniformLocation(ctx, 'u_rotationSpeed');
    const zoomSpeedLoc = getUniformLocation(ctx, 'u_zoomSpeed');
    const scaleLoc = getUniformLocation(ctx, 'u_scale');
    const patternLoc = getUniformLocation(ctx, 'u_pattern');
    const color1Loc = getUniformLocation(ctx, 'u_color1');
    const color2Loc = getUniformLocation(ctx, 'u_color2');

    if (resLoc) gl.uniform2f(resLoc, width, height);
    if (timeLoc) gl.uniform1f(timeLoc, timeRef.current);
    if (rotSpeedLoc) gl.uniform1f(rotSpeedLoc, effect.rotationSpeed);
    if (zoomSpeedLoc) gl.uniform1f(zoomSpeedLoc, effect.zoomSpeed);
    if (scaleLoc) gl.uniform1f(scaleLoc, effect.scale);
    
    const patternMap: Record<string, number> = {
      checkerboard: 0,
      stripes: 1,
      dots: 2,
      custom: 3,
    };
    if (patternLoc) gl.uniform1i(patternLoc, patternMap[effect.pattern] || 0);

    const c1 = hexToVec3(effect.colors[0] || '#FF00FF');
    const c2 = hexToVec3(effect.colors[1] || '#000000');
    if (color1Loc) gl.uniform3f(color1Loc, c1[0], c1[1], c1[2]);
    if (color2Loc) gl.uniform3f(color2Loc, c2[0], c2[1], c2[2]);

    renderWebGL(ctx);

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
