'use client';

import { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '@/store';
import { EffectRenderer } from './effect-renderer';
import { cn } from '@/lib/utils';

interface PreviewCanvasProps {
  className?: string;
}

export function PreviewCanvas({ className }: PreviewCanvasProps) {
  const { project, isPlaying, zoom, showGrid } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Maintain aspect ratio
        const aspectRatio = (project?.width || 800) / (project?.height || 600);
        let width = rect.width;
        let height = width / aspectRatio;
        
        if (height > rect.height) {
          height = rect.height;
          width = height * aspectRatio;
        }
        
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [project?.width, project?.height]);

  if (!project) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            No Project Open
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Create or open a project to start designing
          </p>
        </div>
      </div>
    );
  }

  const sortedEffects = [...project.effects].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      ref={containerRef}
      className={cn('flex items-center justify-center h-full p-4 overflow-hidden', className)}
    >
      <div
        className="relative overflow-hidden rounded-xl shadow-2xl"
        style={{
          width: dimensions.width * zoom,
          height: dimensions.height * zoom,
          backgroundColor: project.backgroundColor,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Grid overlay */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none z-50"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        )}

        {/* Render all effects */}
        {sortedEffects.map((effect) => (
          <EffectRenderer
            key={effect.id}
            effect={effect}
            width={project.width}
            height={project.height}
            isPlaying={isPlaying}
          />
        ))}

        {/* Scanlines overlay for retro effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.1),
              rgba(0, 0, 0, 0.1) 1px,
              transparent 1px,
              transparent 2px
            )`,
            zIndex: 100,
          }}
        />
      </div>
    </div>
  );
}
