// Cracktro color palettes and presets

export const CRACKTRO_PALETTES = {
  amiga: ['#000000', '#FF0000', '#00FF00', '#FFFF00', '#0000FF', '#FF00FF', '#00FFFF', '#FFFFFF'],
  c64: ['#000000', '#FFFFFF', '#880000', '#AAFFEE', '#CC44CC', '#00CC55', '#0000AA', '#EEEE77'],
  atari: ['#000000', '#444444', '#888888', '#BBBBBB', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
  neon: ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0080', '#80FF00', '#0080FF', '#FF8000', '#8000FF'],
  sunset: ['#FF6B6B', '#FFE66D', '#FF8E53', '#FF6B9D', '#C44569', '#F8B500', '#FF6347', '#FFD700'],
  ocean: ['#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8', '#023E8A', '#0096C7', '#48CAE4', '#ADE8F4'],
  retro: ['#2E294E', '#541388', '#F72585', '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0', '#F72585'],
  matrix: ['#003B00', '#008F11', '#00FF41', '#00FF00', '#33FF33', '#66FF66', '#99FF99', '#CCFFCC'],
  fire: ['#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00', '#FFFF00', '#FFFF33', '#FFFFFF'],
  cyber: ['#0D0221', '#0F084B', '#26408B', '#3D6CB9', '#86BBD8', '#FF00FF', '#00FFFF', '#FFFF00'],
};

export const BLEND_MODES = [
  { name: 'Normal', value: 'normal' },
  { name: 'Multiply', value: 'multiply' },
  { name: 'Screen', value: 'screen' },
  { name: 'Overlay', value: 'overlay' },
  { name: 'Darken', value: 'darken' },
  { name: 'Lighten', value: 'lighten' },
  { name: 'Color Dodge', value: 'color-dodge' },
  { name: 'Color Burn', value: 'color-burn' },
  { name: 'Hard Light', value: 'hard-light' },
  { name: 'Soft Light', value: 'soft-light' },
  { name: 'Difference', value: 'difference' },
  { name: 'Exclusion', value: 'exclusion' },
  { name: 'Hue', value: 'hue' },
  { name: 'Saturation', value: 'saturation' },
  { name: 'Color', value: 'color' },
  { name: 'Luminosity', value: 'luminosity' },
] as const;

export const FONT_FAMILIES = [
  { name: 'Press Start 2P', value: '"Press Start 2P", monospace' },
  { name: 'VT323', value: '"VT323", monospace' },
  { name: 'Silkscreen', value: '"Silkscreen", monospace' },
  { name: 'Pixelify Sans', value: '"Pixelify Sans", sans-serif' },
  { name: 'Orbitron', value: '"Orbitron", sans-serif' },
  { name: 'Share Tech Mono', value: '"Share Tech Mono", monospace' },
  { name: 'Courier New', value: '"Courier New", monospace' },
  { name: 'System', value: 'system-ui, sans-serif' },
];

export const DEFAULT_SCROLL_TEXT = 
  'WELCOME TO THE CRACKTRO DESIGNER! CREATE AMAZING RETRO EFFECTS AND ANIMATIONS... ' +
  'GREETINGS TO ALL DEMOSCENE ENTHUSIASTS AROUND THE WORLD! ' +
  'THIS APP WAS MADE WITH LOVE FOR THE OLDSCHOOL VIBES... ' +
  'PRESS PLAY TO SEE YOUR CREATION COME TO LIFE!   ';

export const DEFAULT_SINEWAVE_TEXT = 'HELLO WORLD FROM THE DEMOSCENE!';

export const MATRIX_CHARACTERS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
