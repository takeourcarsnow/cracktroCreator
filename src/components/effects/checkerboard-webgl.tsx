'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { CheckerboardEffect } from '@/types';
import {
  initWebGL,
  renderWebGL,
  getUniformLocation,
  hexToVec3,
  CHECKERBOARD_FRAGMENT_SHADER,
  type WebGLContext,
} from '@/lib/webgl-utils';

interface CheckerboardRendererProps {
  effect: CheckerboardEffect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export function CheckerboardRenderer({
  effect,
  width,
  height,
  isPlaying,
}: CheckerboardRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glContextRef = useRef<WebGLContext | null>(null);
  const timeRef = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Initialize WebGL
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    glContextRef.current = initWebGL(canvas, CHECKERBOARD_FRAGMENT_SHADER);

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
      // Fallback to simple canvas rendering if WebGL fails
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
    const tileSizeLoc = getUniformLocation(ctx, 'u_tileSize');
    const perspectiveLoc = getUniformLocation(ctx, 'u_perspective');
    const yOffsetLoc = getUniformLocation(ctx, 'u_yOffset');
    const scrollSpeedLoc = getUniformLocation(ctx, 'u_scrollSpeed');
    const color1Loc = getUniformLocation(ctx, 'u_color1');
    const color2Loc = getUniformLocation(ctx, 'u_color2');

    if (resLoc) gl.uniform2f(resLoc, width, height);
    if (timeLoc) gl.uniform1f(timeLoc, timeRef.current);
    if (tileSizeLoc) gl.uniform1f(tileSizeLoc, effect.tileSize);
    if (perspectiveLoc) gl.uniform1f(perspectiveLoc, effect.perspective);
    if (yOffsetLoc) gl.uniform1f(yOffsetLoc, effect.yOffset / 100);
    if (scrollSpeedLoc) gl.uniform1f(scrollSpeedLoc, effect.scrollSpeed);

    const c1 = hexToVec3(effect.color1);
    const c2 = hexToVec3(effect.color2);
    if (color1Loc) gl.uniform3f(color1Loc, c1[0], c1[1], c1[2]);
    if (color2Loc) gl.uniform3f(color2Loc, c2[0], c2[1], c2[2]);

    renderWebGL(ctx);

    if (isPlaying) {
      timeRef.current += 0.016 * effect.scrollSpeed;
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
