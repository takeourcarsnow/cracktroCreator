'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useEditorStore } from '@/store';
import { Button, Slider } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { Effect, Keyframe, EffectAnimation } from '@/types';

interface TimelineEditorProps {
  className?: string;
}

export function TimelineEditor({ className }: TimelineEditorProps) {
  const { project, isPlaying, togglePlaying, selectedEffectId, selectEffect } = useEditorStore();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(10); // 10 seconds default
  const [expandedEffects, setExpandedEffects] = useState<Set<string>>(new Set());
  const [animations, setAnimations] = useState<Map<string, EffectAnimation>>(new Map());
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Animation loop for playback
  useEffect(() => {
    if (isPlaying) {
      const startTime = performance.now() - currentTime * 1000;
      
      const animate = (timestamp: number) => {
        const elapsed = (timestamp - startTime) / 1000;
        const newTime = elapsed % duration;
        setCurrentTime(newTime);
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, duration]);

  const toggleEffectExpanded = (effectId: string) => {
    setExpandedEffects((prev) => {
      const next = new Set(prev);
      if (next.has(effectId)) {
        next.delete(effectId);
      } else {
        next.add(effectId);
      }
      return next;
    });
  };

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(percentage * duration);
  }, [duration]);

  const addKeyframe = (effectId: string, propertyName: string) => {
    // Placeholder for adding keyframes
    console.log('Add keyframe for', effectId, propertyName, 'at', currentTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  // Generate time markers
  const timeMarkers = [];
  const markerInterval = duration <= 10 ? 1 : duration <= 30 ? 5 : 10;
  for (let i = 0; i <= duration; i += markerInterval) {
    timeMarkers.push(i);
  }

  if (!project?.effects.length) {
    return (
      <div className={cn('bg-gray-900 border-t border-gray-700 p-4', className)}>
        <div className="text-center text-gray-500 text-sm">
          Add effects to start animating
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-gray-900 border-t border-gray-700 flex flex-col', className)}>
      {/* Timeline Controls */}
      <div className="flex items-center gap-4 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentTime(0)}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button
            variant={isPlaying ? 'default' : 'ghost'}
            size="icon"
            className="h-8 w-8"
            onClick={togglePlaying}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCurrentTime(duration)}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-sm font-mono text-gray-400">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-gray-500">Duration:</span>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="bg-gray-800 text-sm rounded px-2 py-1 border border-gray-700"
          >
            <option value={5}>5s</option>
            <option value={10}>10s</option>
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
          </select>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Effect Labels */}
        <div className="w-48 flex-shrink-0 border-r border-gray-700 overflow-y-auto">
          <div className="h-8 border-b border-gray-700 px-2 flex items-center text-xs text-gray-500">
            Effects
          </div>
          {project.effects.map((effect) => (
            <div key={effect.id}>
              <div
                onClick={() => {
                  selectEffect(effect.id);
                  toggleEffectExpanded(effect.id);
                }}
                className={cn(
                  'h-8 border-b border-gray-800 px-2 flex items-center gap-1 cursor-pointer hover:bg-gray-800 text-sm',
                  selectedEffectId === effect.id && 'bg-gray-800'
                )}
              >
                {expandedEffects.has(effect.id) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                <span className="truncate">{effect.name}</span>
              </div>
              {expandedEffects.has(effect.id) && (
                <div className="bg-gray-800/50">
                  <div className="h-6 border-b border-gray-800 px-6 flex items-center text-xs text-gray-500">
                    Opacity
                  </div>
                  <div className="h-6 border-b border-gray-800 px-6 flex items-center text-xs text-gray-500">
                    Position
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Timeline Tracks */}
        <div className="flex-1 overflow-auto">
          {/* Time Ruler */}
          <div
            ref={timelineRef}
            onClick={handleTimelineClick}
            className="h-8 border-b border-gray-700 relative cursor-crosshair"
          >
            {/* Time markers */}
            {timeMarkers.map((time) => (
              <div
                key={time}
                className="absolute top-0 h-full border-l border-gray-700"
                style={{ left: `${(time / duration) * 100}%` }}
              >
                <span className="text-xs text-gray-500 ml-1">{time}s</span>
              </div>
            ))}
            
            {/* Playhead */}
            <div
              className="absolute top-0 h-full w-0.5 bg-red-500 z-10"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            >
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45" />
            </div>
          </div>

          {/* Effect Tracks */}
          {project.effects.map((effect) => (
            <div key={effect.id}>
              <div
                className={cn(
                  'h-8 border-b border-gray-800 relative',
                  selectedEffectId === effect.id && 'bg-gray-800/30'
                )}
              >
                {/* Effect bar showing the effect is active */}
                <div
                  className="absolute top-1 bottom-1 left-0 right-0 mx-1 rounded"
                  style={{
                    background: `linear-gradient(90deg, hsl(${effect.zIndex * 40}, 70%, 40%), hsl(${effect.zIndex * 40 + 20}, 70%, 50%))`,
                  }}
                />
                
                {/* Playhead line */}
                <div
                  className="absolute top-0 h-full w-0.5 bg-red-500/50"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
              
              {expandedEffects.has(effect.id) && (
                <div className="bg-gray-800/30">
                  {/* Opacity track */}
                  <div className="h-6 border-b border-gray-800 relative">
                    <div
                      className="absolute top-0 h-full w-0.5 bg-red-500/30"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                    {/* Keyframes would render here */}
                  </div>
                  {/* Position track */}
                  <div className="h-6 border-b border-gray-800 relative">
                    <div
                      className="absolute top-0 h-full w-0.5 bg-red-500/30"
                      style={{ left: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline hint */}
      <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500">
        Click on the timeline to set playhead position. Expand effects to see property tracks.
        <span className="ml-2 text-gray-600">(Full keyframe editing coming soon)</span>
      </div>
    </div>
  );
}
