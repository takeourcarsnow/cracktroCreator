'use client';

import { useEffect, useRef } from 'react';
import { X, Play, Pause } from 'lucide-react';
import { useEditorStore } from '@/store';
import { EffectRenderer } from '@/components/canvas/effect-renderer';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

export function FullscreenPreview() {
  const { project, isPlaying, isFullscreen, toggleFullscreen, togglePlaying } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.().catch(() => {
        // Fullscreen not supported or denied
      });
    } else if (!isFullscreen && document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {
        // Not in fullscreen
      });
    }
  }, [isFullscreen]);

  // Handle escape key and fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        toggleFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen, toggleFullscreen]);

  if (!isFullscreen || !project) return null;

  const sortedEffects = [...project.effects].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-black"
      style={{ backgroundColor: project.backgroundColor }}
    >
      {/* Effects container */}
      <div className="relative w-full h-full overflow-hidden">
        {sortedEffects.map((effect) => (
          <EffectRenderer
            key={effect.id}
            effect={effect}
            width={window.innerWidth}
            height={window.innerHeight}
            isPlaying={isPlaying}
          />
        ))}
      </div>

      {/* Floating controls */}
      <div
        className={cn(
          'absolute top-4 right-4 flex items-center gap-2',
          'opacity-0 hover:opacity-100 transition-opacity duration-300'
        )}
      >
        <Button
          variant="secondary"
          size="icon"
          onClick={togglePlaying}
          className="bg-black/50 hover:bg-black/70 text-white border-0"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={toggleFullscreen}
          className="bg-black/50 hover:bg-black/70 text-white border-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Hint text */}
      <div
        className={cn(
          'absolute bottom-4 left-1/2 -translate-x-1/2',
          'text-white/50 text-sm',
          'opacity-0 hover:opacity-100 transition-opacity duration-300'
        )}
      >
        Press ESC or F to exit fullscreen
      </div>
    </div>
  );
}
