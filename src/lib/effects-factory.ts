import { v4 as uuidv4 } from 'uuid';
import type {
  Effect,
  EffectType,
  ScrollTextEffect,
  SineWaveEffect,
  StarfieldEffect,
  PlasmaEffect,
  RasterBarsEffect,
  CopperBarsEffect,
  ParticlesEffect,
  CheckerboardEffect,
  LogoEffect,
  FireEffect,
  MatrixEffect,
  TunnelEffect,
  GlitchEffect,
  MetaballsEffect,
  DotMatrixEffect,
  RotoZoomEffect,
  TwisterEffect,
  Wireframe3DEffect,
  SpriteEffect,
  VHSEffect,
  BobsEffect,
  MoireEffect,
  LensFlareEffect,
  VectorBallsEffect,
} from '@/types';
import { DEFAULT_SCROLL_TEXT, DEFAULT_SINEWAVE_TEXT, MATRIX_CHARACTERS, CRACKTRO_PALETTES } from './constants';

export function createDefaultEffect(type: EffectType): Effect {
  const baseEffect = {
    id: uuidv4(),
    enabled: true,
    zIndex: 0,
    opacity: 1,
    blendMode: 'normal' as const,
  };

  switch (type) {
    case 'scrolltext':
      return {
        ...baseEffect,
        type: 'scrolltext',
        name: 'Scroll Text',
        text: DEFAULT_SCROLL_TEXT,
        speed: 2,
        fontSize: 24,
        fontFamily: '"Press Start 2P", monospace',
        color: '#00FF00',
        gradientColors: ['#FF00FF', '#00FFFF', '#FFFF00'],
        useGradient: true,
        direction: 'left',
        yPosition: 50,
      } as ScrollTextEffect;

    case 'sinewave':
      return {
        ...baseEffect,
        type: 'sinewave',
        name: 'Sine Wave Text',
        text: DEFAULT_SINEWAVE_TEXT,
        amplitude: 30,
        frequency: 0.1,
        speed: 3,
        fontSize: 28,
        fontFamily: '"Press Start 2P", monospace',
        colors: CRACKTRO_PALETTES.neon,
        yPosition: 50,
      } as SineWaveEffect;

    case 'starfield':
      return {
        ...baseEffect,
        type: 'starfield',
        name: 'Starfield',
        starCount: 200,
        speed: 3,
        starColor: '#FFFFFF',
        maxSize: 3,
        depth: 3,
      } as StarfieldEffect;

    case 'plasma':
      return {
        ...baseEffect,
        type: 'plasma',
        name: 'Plasma',
        scale: 4,
        speed: 2,
        colors: CRACKTRO_PALETTES.neon,
        intensity: 1,
      } as PlasmaEffect;

    case 'rasterbars':
      return {
        ...baseEffect,
        type: 'rasterbars',
        name: 'Raster Bars',
        barCount: 8,
        barHeight: 20,
        speed: 2,
        colors: CRACKTRO_PALETTES.neon,
        amplitude: 100,
        spacing: 40,
      } as RasterBarsEffect;

    case 'copperbars':
      return {
        ...baseEffect,
        type: 'copperbars',
        name: 'Copper Bars',
        colors: CRACKTRO_PALETTES.sunset,
        barHeight: 4,
        speed: 1,
        waveAmplitude: 50,
      } as CopperBarsEffect;

    case 'particles':
      return {
        ...baseEffect,
        type: 'particles',
        name: 'Particles',
        particleCount: 100,
        speed: 2,
        colors: CRACKTRO_PALETTES.fire,
        maxSize: 4,
        shape: 'circle',
        gravity: 0.5,
        spread: 100,
      } as ParticlesEffect;

    case 'checkerboard':
      return {
        ...baseEffect,
        type: 'checkerboard',
        name: 'Checkerboard Floor',
        color1: '#FF00FF',
        color2: '#000000',
        tileSize: 40,
        perspective: 400,
        scrollSpeed: 2,
        yOffset: 60,
      } as CheckerboardEffect;

    case 'logo':
      return {
        ...baseEffect,
        type: 'logo',
        name: 'Bouncing Logo',
        text: 'CRACKTRO',
        fontSize: 48,
        fontFamily: '"Press Start 2P", monospace',
        colors: CRACKTRO_PALETTES.neon,
        bounceAmplitude: 20,
        bounceSpeed: 2,
        rotationEnabled: false,
        rotationSpeed: 1,
        scaleEffect: true,
        glowEnabled: true,
        glowColor: '#FF00FF',
      } as LogoEffect;

    case 'fire':
      return {
        ...baseEffect,
        type: 'fire',
        name: 'Fire Effect',
        intensity: 1,
        speed: 3,
        colors: CRACKTRO_PALETTES.fire,
        height: 150,
        spread: 2,
      } as FireEffect;

    case 'matrix':
      return {
        ...baseEffect,
        type: 'matrix',
        name: 'Matrix Rain',
        fontSize: 14,
        speed: 2,
        color: '#00FF00',
        density: 0.95,
        characters: MATRIX_CHARACTERS,
      } as MatrixEffect;

    case 'tunnel':
      return {
        ...baseEffect,
        type: 'tunnel',
        name: 'Tunnel',
        speed: 2,
        ringCount: 20,
        colors: CRACKTRO_PALETTES.cyber,
        rotation: 1,
        perspective: 500,
      } as TunnelEffect;

    case 'glitch':
      return {
        ...baseEffect,
        type: 'glitch',
        name: 'Glitch Effect',
        intensity: 0.5,
        speed: 2,
        colorShift: true,
        scanlines: true,
        noise: 0.3,
        sliceCount: 10,
      } as GlitchEffect;

    case 'metaballs':
      return {
        ...baseEffect,
        type: 'metaballs',
        name: 'Metaballs',
        ballCount: 5,
        speed: 1.5,
        colors: CRACKTRO_PALETTES.neon,
        threshold: 1,
        size: 80,
      } as MetaballsEffect;

    case 'dotmatrix':
      return {
        ...baseEffect,
        type: 'dotmatrix',
        name: 'Dot Matrix',
        text: 'HELLO WORLD',
        dotSize: 4,
        gap: 2,
        speed: 2,
        color: '#00FF00',
        backgroundColor: '#001100',
        scrollDirection: 'left',
      } as DotMatrixEffect;

    case 'rotozoom':
      return {
        ...baseEffect,
        type: 'rotozoom',
        name: 'Rotozoom',
        pattern: 'checkerboard',
        rotationSpeed: 1,
        zoomSpeed: 0.5,
        colors: ['#FF00FF', '#000000'],
        scale: 2,
      } as RotoZoomEffect;

    case 'twister':
      return {
        ...baseEffect,
        type: 'twister',
        name: 'Twister',
        barCount: 16,
        speed: 2,
        colors: CRACKTRO_PALETTES.sunset,
        amplitude: 100,
        segments: 32,
      } as TwisterEffect;

    case 'wireframe3d':
      return {
        ...baseEffect,
        type: 'wireframe3d',
        name: '3D Wireframe',
        shape: 'cube',
        rotationSpeedX: 1,
        rotationSpeedY: 1.5,
        rotationSpeedZ: 0.5,
        color: '#00FFFF',
        lineWidth: 2,
        scale: 100,
      } as Wireframe3DEffect;

    case 'sprite':
      return {
        ...baseEffect,
        type: 'sprite',
        name: 'Sprite',
        imageUrl: '',
        width: 100,
        height: 100,
        x: 50,
        y: 50,
        animationType: 'float',
        animationSpeed: 1,
        animationAmplitude: 20,
      } as SpriteEffect;

    case 'vhs':
      return {
        ...baseEffect,
        type: 'vhs',
        name: 'VHS Effect',
        scanlineIntensity: 0.5,
        noiseIntensity: 0.3,
        rgbShift: 2,
        distortion: 0.3,
        flickering: true,
        trackingLines: true,
      } as VHSEffect;

    case 'bobs':
      return {
        ...baseEffect,
        type: 'bobs',
        name: 'Bouncing Bobs',
        bobCount: 16,
        speed: 2,
        size: 20,
        colors: CRACKTRO_PALETTES.neon,
        pattern: 'circle',
        trailLength: 30,
        glowEnabled: true,
      } as BobsEffect;

    case 'moire':
      return {
        ...baseEffect,
        type: 'moire',
        name: 'Moiré Pattern',
        pattern: 'circles',
        spacing: 15,
        speed: 1,
        colors: ['#FFFFFF', '#FFFFFF'],
        offsetX: 20,
        offsetY: 20,
      } as MoireEffect;

    case 'lensflare':
      return {
        ...baseEffect,
        type: 'lensflare',
        name: 'Lens Flare',
        x: 70,
        y: 30,
        size: 50,
        intensity: 0.8,
        colors: ['#FFD700', '#00FFFF', '#FF00FF', '#FF6600'],
        anamorphic: true,
        ghostCount: 5,
      } as LensFlareEffect;

    case 'vectorballs':
      return {
        ...baseEffect,
        type: 'vectorballs',
        name: 'Vector Balls',
        ballCount: 27,
        size: 15,
        speed: 1,
        rotationX: 1,
        rotationY: 1.5,
        rotationZ: 0.5,
        colors: CRACKTRO_PALETTES.neon,
        formation: 'cube',
        perspective: 400,
      } as VectorBallsEffect;

    default:
      throw new Error(`Unknown effect type: ${type}`);
  }
}

export function duplicateEffect(effect: Effect): Effect {
  return {
    ...effect,
    id: uuidv4(),
    name: `${effect.name} (Copy)`,
  };
}
