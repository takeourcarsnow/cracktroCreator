'use client';

import { Eye, EyeOff, Trash2, Copy, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { useEditorStore } from '@/store';
import { 
  Card, CardHeader, CardTitle, CardContent, Button,
  ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut, ContextMenuTrigger
} from '@/components/ui';
import { cn } from '@/lib/utils';

const EFFECT_ICONS: Record<string, string> = {
  scrolltext: '📜',
  sinewave: '🌊',
  starfield: '⭐',
  plasma: '🌈',
  rasterbars: '📊',
  copperbars: '🎚️',
  particles: '✨',
  checkerboard: '🏁',
  logo: '👑',
  fire: '🔥',
  matrix: '💻',
  tunnel: '🌀',
  glitch: '⚡',
  metaballs: '🫧',
  dotmatrix: '🔲',
  rotozoom: '🔄',
  twister: '🌪️',
  wireframe3d: '📦',
  sprite: '🖼️',
};

export function EffectsList() {
  const {
    project,
    selectedEffectId,
    selectEffect,
    toggleEffectEnabled,
    removeEffect,
    duplicateEffect,
    reorderEffects,
  } = useEditorStore();

  if (!project) {
    return null;
  }

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    if (fromIndex !== toIndex) {
      reorderEffects(fromIndex, toIndex);
    }
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      reorderEffects(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < project.effects.length - 1) {
      reorderEffects(index, index + 1);
    }
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-base">
          Layers ({project.effects.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pb-4">
        {project.effects.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm">No effects added yet</p>
            <p className="text-xs mt-1">Add effects from the library</p>
          </div>
        ) : (
          <div className="space-y-2">
            {project.effects.map((effect, index) => (
              <ContextMenu key={effect.id}>
                <ContextMenuTrigger asChild>
                  <div
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => selectEffect(effect.id)}
                    className={cn(
                      'flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all duration-200',
                      selectedEffectId === effect.id
                        ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500'
                        : 'bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
                      !effect.enabled && 'opacity-50'
                    )}
                  >
                    <GripVertical className="w-4 h-4 text-gray-400 cursor-grab flex-shrink-0" />
                    
                    <span className="text-lg flex-shrink-0">
                      {EFFECT_ICONS[effect.type] || '🎨'}
                    </span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {effect.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {effect.type}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleEffectEnabled(effect.id);
                        }}
                      >
                        {effect.enabled ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateEffect(effect.id);
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEffect(effect.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-48">
                  <ContextMenuItem onClick={() => duplicateEffect(effect.id)}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate
                    <ContextMenuShortcut>Ctrl+D</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => toggleEffectEnabled(effect.id)}>
                    {effect.enabled ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Show
                      </>
                    )}
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem 
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                  >
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Move Up
                  </ContextMenuItem>
                  <ContextMenuItem 
                    onClick={() => moveDown(index)}
                    disabled={index === project.effects.length - 1}
                  >
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Move Down
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem 
                    onClick={() => removeEffect(effect.id)}
                    className="text-red-500 focus:text-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                    <ContextMenuShortcut>Del</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
