import { CRACKTRO_PALETTES } from './constants';
import type { EffectType } from '@/types';

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  effects: {
    type: EffectType;
    overrides?: Record<string, unknown>;
  }[];
  backgroundColor: string;
}

export const TEMPLATES: Template[] = [
  {
    id: 'classic-cracktro',
    name: 'Classic Cracktro',
    description: 'Traditional demoscene intro with starfield, scrolling text, and bouncing logo',
    effects: [
      { type: 'starfield', overrides: { starCount: 200, speed: 2 } },
      { type: 'scrolltext', overrides: { yPosition: 85 } },
      { type: 'logo', overrides: { text: 'LEGEND', glowEnabled: true } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'plasma-dream',
    name: 'Plasma Dream',
    description: 'Psychedelic plasma effect with copper bars',
    effects: [
      { type: 'plasma', overrides: { colors: CRACKTRO_PALETTES.neon } },
      { type: 'copperbars', overrides: { opacity: 0.5 } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'retro-fire',
    name: 'Retro Fire',
    description: 'Fire effect with 3D checkerboard floor and sine wave text',
    effects: [
      { type: 'checkerboard', overrides: { color1: '#8B00FF', color2: '#000000' } },
      { type: 'fire', overrides: { height: 200 } },
      { type: 'sinewave', overrides: { yPosition: 30 } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'matrix-world',
    name: 'Matrix World',
    description: 'Digital rain effect with glowing logo',
    effects: [
      { type: 'matrix', overrides: { color: '#00FF00' } },
      { type: 'logo', overrides: { text: 'HACKED', colors: ['#00FF00', '#00FF00'], glowEnabled: true, glowColor: '#00FF00' } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'tunnel-vision',
    name: 'Tunnel Vision',
    description: 'Zooming tunnel effect with raster bars',
    effects: [
      { type: 'tunnel', overrides: { speed: 3 } },
      { type: 'rasterbars', overrides: { opacity: 0.6, barCount: 5 } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'particle-show',
    name: 'Particle Show',
    description: 'Colorful particle fountain with sine wave text',
    effects: [
      { type: 'particles', overrides: { particleCount: 150, colors: CRACKTRO_PALETTES.fire } },
      { type: 'sinewave', overrides: { yPosition: 25, text: 'PARTICLE MAGIC' } },
    ],
    backgroundColor: '#0a0a0a',
  },
  {
    id: 'amiga-style',
    name: 'Amiga Style',
    description: 'Classic Amiga copper bars with checkerboard',
    effects: [
      { type: 'checkerboard', overrides: { yOffset: 70 } },
      { type: 'copperbars', overrides: { colors: CRACKTRO_PALETTES.amiga } },
      { type: 'scrolltext', overrides: { yPosition: 15, text: 'AMIGA FOREVER... GREETINGS TO ALL OLDSCHOOL HACKERS!' } },
    ],
    backgroundColor: '#000022',
  },
  {
    id: 'cyber-punk',
    name: 'Cyber Punk',
    description: 'Neon-styled futuristic intro',
    effects: [
      { type: 'starfield', overrides: { starColor: '#FF00FF', speed: 5 } },
      { type: 'rasterbars', overrides: { colors: CRACKTRO_PALETTES.cyber } },
      { type: 'logo', overrides: { text: 'CYBER', colors: CRACKTRO_PALETTES.neon, glowEnabled: true, glowColor: '#00FFFF' } },
    ],
    backgroundColor: '#0D0221',
  },
  {
    id: 'vhs-retro',
    name: 'VHS Retro',
    description: 'Nostalgic VHS tape effect with static and tracking',
    effects: [
      { type: 'starfield', overrides: { starCount: 50, speed: 0.5 } },
      { type: 'logo', overrides: { text: 'REWIND', colors: ['#FF6B6B', '#4ECDC4'] } },
      { type: 'vhs', overrides: { noiseIntensity: 0.3, scanlineIntensity: 0.5, trackingLines: true } },
    ],
    backgroundColor: '#1a1a1a',
  },
  {
    id: 'bouncing-bobs',
    name: 'Bouncing Bobs',
    description: 'Classic Amiga bobs with trails',
    effects: [
      { type: 'plasma', overrides: { opacity: 0.3 } },
      { type: 'bobs', overrides: { bobCount: 12, pattern: 'lissajous', trailLength: 8 } },
      { type: 'scrolltext', overrides: { yPosition: 90, text: 'BOBS DEMO... CLASSIC AMIGA STYLE!' } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'vector-world',
    name: 'Vector World',
    description: '3D vector balls with wireframe',
    effects: [
      { type: 'vectorballs', overrides: { formation: 'sphere', ballCount: 32 } },
      { type: 'wireframe3d', overrides: { shape: 'cube', opacity: 0.3 } },
    ],
    backgroundColor: '#000022',
  },
  {
    id: 'moire-madness',
    name: 'Moiré Madness',
    description: 'Hypnotic moiré interference patterns',
    effects: [
      { type: 'moire', overrides: { pattern: 'circles', colors: ['#FF00FF', '#00FFFF'] } },
      { type: 'sinewave', overrides: { yPosition: 50, colors: ['#FFFFFF', '#FFFF00'] } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'lens-flare-cinema',
    name: 'Lens Flare Cinema',
    description: 'Cinematic lens flare with starfield',
    effects: [
      { type: 'starfield', overrides: { starCount: 300, speed: 1 } },
      { type: 'lensflare', overrides: { size: 150, anamorphic: true } },
      { type: 'logo', overrides: { text: 'CINEMA', fontSize: 72 } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'rotozoom-classic',
    name: 'RotoZoom Classic',
    description: 'Classic rotozoom effect with text overlay',
    effects: [
      { type: 'rotozoom', overrides: { pattern: 'checkerboard', rotationSpeed: 1, zoomSpeed: 0.5 } },
      { type: 'scrolltext', overrides: { yPosition: 85, useGradient: true } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'metaballs-glow',
    name: 'Metaballs Glow',
    description: 'Glowing metaballs with particle effects',
    effects: [
      { type: 'metaballs', overrides: { ballCount: 5, colors: CRACKTRO_PALETTES.neon } },
      { type: 'particles', overrides: { particleCount: 50, opacity: 0.5 } },
    ],
    backgroundColor: '#0a0a0a',
  },
  {
    id: 'dot-matrix-display',
    name: 'Dot Matrix Display',
    description: 'LED-style dot matrix scrolling display',
    effects: [
      { type: 'dotmatrix', overrides: { text: 'WELCOME TO THE SHOW...', color: '#FF0000' } },
      { type: 'starfield', overrides: { opacity: 0.3, starCount: 100 } },
    ],
    backgroundColor: '#111111',
  },
  {
    id: 'glitch-art',
    name: 'Glitch Art',
    description: 'Digital glitch effect with cyberpunk vibes',
    effects: [
      { type: 'plasma', overrides: { opacity: 0.5 } },
      { type: 'glitch', overrides: { intensity: 0.7, colorShift: true, scanlines: true } },
      { type: 'logo', overrides: { text: 'ERROR', colors: ['#FF0000', '#00FF00', '#0000FF'] } },
    ],
    backgroundColor: '#000000',
  },
  {
    id: 'twister-demo',
    name: 'Twister Demo',
    description: 'Classic twister effect with copper bars',
    effects: [
      { type: 'twister', overrides: { barCount: 16, amplitude: 100 } },
      { type: 'copperbars', overrides: { opacity: 0.4, barHeight: 2 } },
    ],
    backgroundColor: '#000000',
  },
];
