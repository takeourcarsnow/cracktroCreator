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
];
