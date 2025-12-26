// Effect types for cracktro animations

export type EffectType =
  | 'scrolltext'
  | 'sinewave'
  | 'starfield'
  | 'plasma'
  | 'rasterbars'
  | 'copperbars'
  | 'particles'
  | 'checkerboard'
  | 'logo'
  | 'fire'
  | 'matrix'
  | 'tunnel'
  | 'glitch'
  | 'metaballs'
  | 'dotmatrix'
  | 'rotozoom'
  | 'twister'
  | 'wireframe3d'
  | 'sprite';

export type BlendMode = 
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export interface BaseEffect {
  id: string;
  type: EffectType;
  name: string;
  enabled: boolean;
  zIndex: number;
  opacity: number;
  blendMode: BlendMode;
}

export interface ScrollTextEffect extends BaseEffect {
  type: 'scrolltext';
  text: string;
  speed: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  gradientColors: string[];
  useGradient: boolean;
  direction: 'left' | 'right' | 'up' | 'down';
  yPosition: number;
}

export interface SineWaveEffect extends BaseEffect {
  type: 'sinewave';
  text: string;
  amplitude: number;
  frequency: number;
  speed: number;
  fontSize: number;
  fontFamily: string;
  colors: string[];
  yPosition: number;
}

export interface StarfieldEffect extends BaseEffect {
  type: 'starfield';
  starCount: number;
  speed: number;
  starColor: string;
  maxSize: number;
  depth: number;
}

export interface PlasmaEffect extends BaseEffect {
  type: 'plasma';
  scale: number;
  speed: number;
  colors: string[];
  intensity: number;
}

export interface RasterBarsEffect extends BaseEffect {
  type: 'rasterbars';
  barCount: number;
  barHeight: number;
  speed: number;
  colors: string[];
  amplitude: number;
  spacing: number;
}

export interface CopperBarsEffect extends BaseEffect {
  type: 'copperbars';
  colors: string[];
  barHeight: number;
  speed: number;
  waveAmplitude: number;
}

export interface ParticlesEffect extends BaseEffect {
  type: 'particles';
  particleCount: number;
  speed: number;
  colors: string[];
  maxSize: number;
  shape: 'circle' | 'square' | 'star';
  gravity: number;
  spread: number;
}

export interface CheckerboardEffect extends BaseEffect {
  type: 'checkerboard';
  color1: string;
  color2: string;
  tileSize: number;
  perspective: number;
  scrollSpeed: number;
  yOffset: number;
}

export interface LogoEffect extends BaseEffect {
  type: 'logo';
  text: string;
  fontSize: number;
  fontFamily: string;
  colors: string[];
  bounceAmplitude: number;
  bounceSpeed: number;
  rotationEnabled: boolean;
  rotationSpeed: number;
  scaleEffect: boolean;
  glowEnabled: boolean;
  glowColor: string;
}

export interface FireEffect extends BaseEffect {
  type: 'fire';
  intensity: number;
  speed: number;
  colors: string[];
  height: number;
  spread: number;
}

export interface MatrixEffect extends BaseEffect {
  type: 'matrix';
  fontSize: number;
  speed: number;
  color: string;
  density: number;
  characters: string;
}

export interface TunnelEffect extends BaseEffect {
  type: 'tunnel';
  speed: number;
  ringCount: number;
  colors: string[];
  rotation: number;
  perspective: number;
}

// New Effects

export interface GlitchEffect extends BaseEffect {
  type: 'glitch';
  intensity: number;
  speed: number;
  colorShift: boolean;
  scanlines: boolean;
  noise: number;
  sliceCount: number;
}

export interface MetaballsEffect extends BaseEffect {
  type: 'metaballs';
  ballCount: number;
  speed: number;
  colors: string[];
  threshold: number;
  size: number;
}

export interface DotMatrixEffect extends BaseEffect {
  type: 'dotmatrix';
  text: string;
  dotSize: number;
  gap: number;
  speed: number;
  color: string;
  backgroundColor: string;
  scrollDirection: 'left' | 'right' | 'up' | 'down';
}

export interface RotoZoomEffect extends BaseEffect {
  type: 'rotozoom';
  pattern: 'checkerboard' | 'stripes' | 'dots' | 'custom';
  rotationSpeed: number;
  zoomSpeed: number;
  colors: string[];
  scale: number;
}

export interface TwisterEffect extends BaseEffect {
  type: 'twister';
  barCount: number;
  speed: number;
  colors: string[];
  amplitude: number;
  segments: number;
}

export interface Wireframe3DEffect extends BaseEffect {
  type: 'wireframe3d';
  shape: 'cube' | 'torus' | 'sphere' | 'pyramid';
  rotationSpeedX: number;
  rotationSpeedY: number;
  rotationSpeedZ: number;
  color: string;
  lineWidth: number;
  scale: number;
}

export interface SpriteEffect extends BaseEffect {
  type: 'sprite';
  imageUrl: string;
  width: number;
  height: number;
  x: number;
  y: number;
  animationType: 'none' | 'bounce' | 'float' | 'rotate' | 'pulse';
  animationSpeed: number;
  animationAmplitude: number;
}

export type Effect =
  | ScrollTextEffect
  | SineWaveEffect
  | StarfieldEffect
  | PlasmaEffect
  | RasterBarsEffect
  | CopperBarsEffect
  | ParticlesEffect
  | CheckerboardEffect
  | LogoEffect
  | FireEffect
  | MatrixEffect
  | TunnelEffect
  | GlitchEffect
  | MetaballsEffect
  | DotMatrixEffect
  | RotoZoomEffect
  | TwisterEffect
  | Wireframe3DEffect
  | SpriteEffect;

// Keyframe animation types
export interface Keyframe {
  time: number; // 0-100 percentage of timeline
  properties: Record<string, number | string | boolean>;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export interface EffectAnimation {
  effectId: string;
  keyframes: Keyframe[];
  duration: number; // in seconds
  loop: boolean;
}

// Preset types
export interface EffectPreset {
  id: string;
  name: string;
  effectType: EffectType;
  properties: Partial<Effect>;
  createdAt: Date;
}

// Audio types
export interface AudioSettings {
  enabled: boolean;
  url: string;
  volume: number;
  loop: boolean;
  beatDetection: boolean;
  beatSensitivity: number;
}

export interface Project {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  effects: Effect[];
  animations?: EffectAnimation[];
  audio?: AudioSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditorState {
  project: Project | null;
  selectedEffectId: string | null;
  isPlaying: boolean;
  zoom: number;
  showGrid: boolean;
}
