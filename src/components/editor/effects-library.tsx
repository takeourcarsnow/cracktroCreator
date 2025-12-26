'use client';

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
} from 'lucide-react';
import { useEditorStore } from '@/store';
import type { EffectType } from '@/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

interface EffectOption {
  type: EffectType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const EFFECT_OPTIONS: EffectOption[] = [
  {
    type: 'scrolltext',
    name: 'Scroll Text',
    description: 'Classic horizontal scrolling text',
    icon: <Type className="w-5 h-5" />,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    type: 'sinewave',
    name: 'Sine Wave',
    description: 'Wavy text with rainbow colors',
    icon: <Waves className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500',
  },
  {
    type: 'starfield',
    name: 'Starfield',
    description: '3D flying through stars',
    icon: <Stars className="w-5 h-5" />,
    color: 'from-blue-500 to-indigo-500',
  },
  {
    type: 'plasma',
    name: 'Plasma',
    description: 'Psychedelic color plasma',
    icon: <Palette className="w-5 h-5" />,
    color: 'from-pink-500 to-orange-500',
  },
  {
    type: 'rasterbars',
    name: 'Raster Bars',
    description: 'Animated color bars',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'from-yellow-500 to-red-500',
  },
  {
    type: 'copperbars',
    name: 'Copper Bars',
    description: 'Classic Amiga copper bars',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'from-amber-500 to-yellow-500',
  },
  {
    type: 'particles',
    name: 'Particles',
    description: 'Rising particle fountain',
    icon: <Sparkles className="w-5 h-5" />,
    color: 'from-green-500 to-emerald-500',
  },
  {
    type: 'checkerboard',
    name: 'Checkerboard',
    description: '3D scrolling floor',
    icon: <Grid3X3 className="w-5 h-5" />,
    color: 'from-violet-500 to-purple-500',
  },
  {
    type: 'logo',
    name: 'Logo',
    description: 'Bouncing logo with glow',
    icon: <Crown className="w-5 h-5" />,
    color: 'from-rose-500 to-pink-500',
  },
  {
    type: 'fire',
    name: 'Fire',
    description: 'Realistic fire effect',
    icon: <Flame className="w-5 h-5" />,
    color: 'from-orange-500 to-red-500',
  },
  {
    type: 'matrix',
    name: 'Matrix Rain',
    description: 'Digital rain effect',
    icon: <Binary className="w-5 h-5" />,
    color: 'from-green-500 to-lime-500',
  },
  {
    type: 'tunnel',
    name: 'Tunnel',
    description: 'Zooming tunnel effect',
    icon: <Circle className="w-5 h-5" />,
    color: 'from-cyan-500 to-teal-500',
  },
  {
    type: 'glitch',
    name: 'Glitch',
    description: 'VHS/digital glitch effect',
    icon: <Zap className="w-5 h-5" />,
    color: 'from-red-500 to-pink-500',
  },
  {
    type: 'metaballs',
    name: 'Metaballs',
    description: 'Blobby organic shapes',
    icon: <CircleDot className="w-5 h-5" />,
    color: 'from-fuchsia-500 to-purple-500',
  },
  {
    type: 'dotmatrix',
    name: 'Dot Matrix',
    description: 'LED-style display',
    icon: <LayoutGrid className="w-5 h-5" />,
    color: 'from-lime-500 to-green-500',
  },
  {
    type: 'rotozoom',
    name: 'Rotozoom',
    description: 'Rotating & zooming pattern',
    icon: <RotateCw className="w-5 h-5" />,
    color: 'from-indigo-500 to-blue-500',
  },
  {
    type: 'twister',
    name: 'Twister',
    description: 'Classic twisting bars',
    icon: <Disc className="w-5 h-5" />,
    color: 'from-amber-500 to-orange-500',
  },
  {
    type: 'wireframe3d',
    name: '3D Wireframe',
    description: 'Rotating 3D shapes',
    icon: <Box className="w-5 h-5" />,
    color: 'from-cyan-500 to-blue-500',
  },
  {
    type: 'sprite',
    name: 'Sprite',
    description: 'Custom image/logo',
    icon: <Image className="w-5 h-5" />,
    color: 'from-pink-500 to-rose-500',
  },
];

export function EffectsLibrary() {
  const { addEffect, project } = useEditorStore();

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

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-base">Effects Library</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pb-4">
        <div className="grid gap-2">
          {EFFECT_OPTIONS.map((option) => (
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
        </div>
      </CardContent>
    </Card>
  );
}
