'use client';

import { Play, Pause, ZoomIn, ZoomOut, Grid, RotateCcw, Maximize, Undo, Redo } from 'lucide-react';
import { useEditorStore, useTemporalStore } from '@/store';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useStore } from 'zustand';

export function Toolbar() {
  const { isPlaying, togglePlaying, zoom, setZoom, showGrid, toggleGrid, toggleFullscreen } = useEditorStore();
  
  // Access temporal store for undo/redo
  const temporalStore = useEditorStore.temporal;
  const { undo, redo } = useTemporalStore();
  const pastStates = useStore(temporalStore, (state) => state.pastStates);
  const futureStates = useStore(temporalStore, (state) => state.futureStates);

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  return (
    <div className="flex items-center gap-2">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => undo()}
        disabled={!canUndo}
        title="Undo (Ctrl+Z)"
      >
        <Undo className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => redo()}
        disabled={!canRedo}
        title="Redo (Ctrl+Y)"
      >
        <Redo className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Playback controls */}
      <Button
        variant={isPlaying ? 'default' : 'secondary'}
        size="icon"
        onClick={togglePlaying}
        title="Play/Pause (Space)"
        className={cn(
          'transition-all duration-200',
          isPlaying && 'bg-green-500 hover:bg-green-600'
        )}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Zoom controls */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setZoom(zoom - 0.25)}
        disabled={zoom <= 0.25}
        title="Zoom Out (Ctrl+-)"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>

      <span className="text-sm font-medium w-14 text-center tabular-nums">
        {Math.round(zoom * 100)}%
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setZoom(zoom + 0.25)}
        disabled={zoom >= 2}
        title="Zoom In (Ctrl++)"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setZoom(1)}
        disabled={zoom === 1}
        title="Reset Zoom (Ctrl+0)"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />

      {/* Grid toggle */}
      <Button
        variant={showGrid ? 'secondary' : 'ghost'}
        size="icon"
        onClick={toggleGrid}
        title="Toggle Grid (G)"
      >
        <Grid className="w-4 h-4" />
      </Button>

      {/* Fullscreen */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleFullscreen}
        title="Fullscreen (F)"
      >
        <Maximize className="w-4 h-4" />
      </Button>
    </div>
  );
}
