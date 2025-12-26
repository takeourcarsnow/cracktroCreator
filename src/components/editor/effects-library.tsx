'use client';

import { useState } from 'react';
import { 
  Type, 
  Waves, 
  Stars, 
  Palette, 
  BarChart3,
  Flame,
  Sparkles,
  Grid3X3,
  Crown,
  Binary,
  Circle,
  Zap,
  CircleDot,
  LayoutGrid,
  RotateCw,
  Disc,
  Box,
  Image,
  Tv,
  Aperture,
  Target,
  Sun,
  Atom,
  Search,
} from 'lucide-react';
import { useEditorStore } from '@/store';
import type { EffectType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface EffectOption {
  type: EffectType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'classic' | 'text' | '3d' | 'overlay' | 'new';
}

const EFFECT_OPTIONS: EffectOption[] = [
  // Text effects
  {
    type: 'scrolltext',
    name: 'Scroll Text',
    description: 'Classic horizontal scrolling text',
    icon: <Type className="w-5 h-5" />,
    color: 'from-cyan-500 to-blue-500',
    category: 'text',
  },
  {
    type: 'sinewave',
    name: 'Sine Wave',
    description: 'Wavy text with rainbow colors',
    icon: <Waves className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500',
    category: 'text',
  },
  {
    type: 'logo',
    name: 'Logo',
    description: 'Bouncing logo with glow',
    icon: <Crown className="w-5 h-5" />,
    color: 'from-rose-500 to-pink-500',
    category: 'text',
  },
  {
    type: 'dotmatrix',
    name: 'Dot Matrix',
    description: 'LED-style display',
    icon: <LayoutGrid className="w-5 h-5" />,
    color: 'from-lime-500 to-green-500',
    category: 'text',
  },
  // Classic demoscene
  {
    type: 'starfield',
    name: 'Starfield',
    description: '3D flying through stars',
    icon: <Stars className="w-5 h-5" />,
    color: 'from-blue-500 to-indigo-500',
    category: 'classic',
  },
  {
    type: 'plasma',
    name: 'Plasma',
    description: 'Psychedelic color plasma',
    icon: <Palette className="w-5 h-5" />,
    color: 'from-pink-500 to-orange-500',
    category: 'classic',
  },
  {
    type: 'rasterbars',
    name: 'Raster Bars',
    description: 'Animated color bars',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'from-yellow-500 to-red-500',
    category: 'classic',
  },
  {
    type: 'copperbars',
    name: 'Copper Bars',
    description: 'Classic Amiga copper bars',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'from-amber-500 to-yellow-500',
    category: 'classic',
  },
  {
    type: 'checkerboard',
    name: 'Checkerboard',
    description: '3D scrolling floor',
    icon: <Grid3X3 className="w-5 h-5" />,
    color: 'from-violet-500 to-purple-500',
    category: 'classic',
  },
  {
    type: 'fire',
    name: 'Fire',
    description: 'Realistic fire effect',
    icon: <Flame className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500',
    category: 'classic',
  },
  {
    type: 'tunnel',
    name: 'Tunnel',
    description: 'Zooming tunnel effect',
    icon: <Circle className="w-5 h-5" />,
    color: 'from-cyan-500 to-teal-500',
    category: 'classic',
  },
  {
    type: 'rotozoom',
    name: 'Rotozoom',
    description: 'Rotating & zooming pattern',
    icon: <RotateCw className="w-5 h-5" />,
    color: 'from-indigo-500 to-blue-500',
    category: 'classic',
  },
  {
    type: 'twister',
    name: 'Twister',
    description: 'Classic twisting bars',
    icon: <Disc className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-500',
    category: 'classic',
  },
  // 3D effects
  {
    type: 'wireframe3d',
    name: '3D Wireframe',
    description: 'Rotating 3D shapes',
    icon: <Box className="w-5 h-5" />,
    color: 'from-cyan-500 to-blue-500',
    category: '3d',
  },
  {
    type: 'metaballs',
    name: 'Metaballs',
    description: 'Blobby organic shapes',
    icon: <CircleDot className="w-5 h-5" />,
    color: 'from-fuchsia-500 to-purple-500',
    category: '3d',
  },
  {
    type: 'vectorballs',
    name: 'Vector Balls',
    description: '3D rotating ball formations',
    icon: <Atom className="w-5 h-5" />,
    color: 'from-emerald-500 to-cyan-500',
    category: '3d',
  },
  {
    type: 'bobs',
    name: 'Bouncing Bobs',
    description: 'Amiga-style bouncing balls',
    icon: <Target className="w-5 h-5" />,
    color: 'from-pink-500 to-purple-500',
    category: '3d',
  },
  // Overlay effects
  {
    type: 'particles',
    name: 'Particles',
    description: 'Rising particle fountain',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500',
    category: 'overlay',
  },
  {
    type: 'matrix',
    name: 'Matrix Rain',
    description: 'Digital rain effect',
    icon: <Binary className="w-5 h-5" />,
    color: 'from-green-500 to-lime-500',
    category: 'overlay',
  },
  {
    type: 'glitch',
    name: 'Glitch',
    description: 'Digital glitch effect',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-red-500 to-pink-500',
    category: 'overlay',
  },
  {
    type: 'vhs',
    name: 'VHS Effect',
    description: 'Retro VHS/CRT overlay',
    icon: <Tv className="w-5 h-5" />,
    color: 'from-gray-500 to-slate-500',
    category: 'overlay',
  },
  {
    type: 'lensflare',
    name: 'Lens Flare',
    description: 'Cinematic light flares',
    icon: <Sun className="w-5 h-5" />,
    color: 'from-yellow-400 to-orange-500',
    category: 'overlay',
  },
  {
    type: 'moire',
    name: 'Moiré Pattern',
    description: 'Interference patterns',
    icon: <Aperture className="w-5 h-5" />,
    color: 'from-slate-400 to-gray-500',
    category: 'overlay',
  },
  // Misc
  {
    type: 'sprite',
    name: 'Sprite',
    description: 'Custom image/logo',
    icon: <Image className="w-5 h-5" />,
    color: 'from-pink-500 to-rose-500',
    category: 'classic',
  },
];

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'classic', name: 'Classic' },
  { id: 'text', name: 'Text' },
  { id: '3d', name: '3D' },
  { id: 'overlay', name: 'Overlay' },
] as const;

export function EffectsLibrary() {
  const { addEffect, project } = useEditorStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!project) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Effects Library</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create a project to add effects
          </p>
        </CardContent>
      </Card>
    );
  }

  const filteredEffects = EFFECT_OPTIONS.filter((option) => {
    const matchesSearch = option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         option.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || option.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="flex-shrink-0 pb-2">
        <CardTitle className="text-base">Effects Library</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search effects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-8 text-sm"
          />
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-2 py-1 text-xs rounded-md transition-colors',
                activeCategory === cat.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pb-4">
        <div className="grid gap-2">
          {filteredEffects.map((option) => (
            <button
              key={option.type}
              onClick={() => addEffect(option.type)}
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200',
                'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800',
                'border border-transparent hover:border-gray-200 dark:hover:border-gray-700',
                'active:scale-[0.98]'
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white',
                  'bg-gradient-to-br',
                  option.color
                )}
              >
                {option.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 dark:text-white">
                  {option.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {option.description}
                </div>
              </div>
            </button>
          ))}
          {filteredEffects.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p className="text-sm">No effects found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
