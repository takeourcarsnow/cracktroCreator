'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface DebouncedSliderProps {
  value: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (value: number[]) => void;
  debounceMs?: number;
  className?: string;
  disabled?: boolean;
}

export function DebouncedSlider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  debounceMs = 100,
  className,
  disabled,
}: DebouncedSliderProps) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInternalChange = useRef(false);

  // Sync local value when external value changes
  useEffect(() => {
    if (!isInternalChange.current) {
      setLocalValue(value);
    }
    isInternalChange.current = false;
  }, [value]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleValueChange = useCallback(
    (newValue: number[]) => {
      isInternalChange.current = true;
      setLocalValue(newValue);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced update
      timeoutRef.current = setTimeout(() => {
        onValueChange(newValue);
      }, debounceMs);
    },
    [onValueChange, debounceMs]
  );

  // Immediate update on commit (mouseup/touchend)
  const handleValueCommit = useCallback(
    (newValue: number[]) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      onValueChange(newValue);
    },
    [onValueChange]
  );

  return (
    <SliderPrimitive.Root
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className
      )}
      value={localValue}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      {localValue.map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className="block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}
