'use client';

import { memo } from 'react';
import type { Effect } from '@/types';
import {
  ScrollTextRenderer,
  SineWaveRenderer,
  StarfieldRenderer,
  PlasmaRenderer,
  RasterBarsRenderer,
  CopperBarsRenderer,
  ParticlesRenderer,
  CheckerboardRenderer,
  LogoRenderer,
  FireRenderer,
  MatrixRenderer,
  TunnelRenderer,
  GlitchRenderer,
  MetaballsRenderer,
  DotMatrixRenderer,
  RotoZoomRenderer,
  TwisterRenderer,
  Wireframe3DRenderer,
  SpriteRenderer,
} from '@/components/effects';

interface EffectRendererProps {
  effect: Effect;
  width: number;
  height: number;
  isPlaying: boolean;
}

export const EffectRenderer = memo(function EffectRenderer({
  effect,
  width,
  height,
  isPlaying,
}: EffectRendererProps) {
  if (!effect.enabled) return null;

  const commonProps = { width, height, isPlaying };

  switch (effect.type) {
    case 'scrolltext':
      return <ScrollTextRenderer effect={effect} {...commonProps} />;
    case 'sinewave':
      return <SineWaveRenderer effect={effect} {...commonProps} />;
    case 'starfield':
      return <StarfieldRenderer effect={effect} {...commonProps} />;
    case 'plasma':
      return <PlasmaRenderer effect={effect} {...commonProps} />;
    case 'rasterbars':
      return <RasterBarsRenderer effect={effect} {...commonProps} />;
    case 'copperbars':
      return <CopperBarsRenderer effect={effect} {...commonProps} />;
    case 'particles':
      return <ParticlesRenderer effect={effect} {...commonProps} />;
    case 'checkerboard':
      return <CheckerboardRenderer effect={effect} {...commonProps} />;
    case 'logo':
      return <LogoRenderer effect={effect} {...commonProps} />;
    case 'fire':
      return <FireRenderer effect={effect} {...commonProps} />;
    case 'matrix':
      return <MatrixRenderer effect={effect} {...commonProps} />;
    case 'tunnel':
      return <TunnelRenderer effect={effect} {...commonProps} />;
    case 'glitch':
      return <GlitchRenderer effect={effect} {...commonProps} />;
    case 'metaballs':
      return <MetaballsRenderer effect={effect} {...commonProps} />;
    case 'dotmatrix':
      return <DotMatrixRenderer effect={effect} {...commonProps} />;
    case 'rotozoom':
      return <RotoZoomRenderer effect={effect} {...commonProps} />;
    case 'twister':
      return <TwisterRenderer effect={effect} {...commonProps} />;
    case 'wireframe3d':
      return <Wireframe3DRenderer effect={effect} {...commonProps} />;
    case 'sprite':
      return <SpriteRenderer effect={effect} {...commonProps} />;
    default:
      return null;
  }
});
