'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  label?: string;
  showValue?: boolean;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, label, showValue, value, ...props }, ref) => (
  <div className="space-y-2">
    {(label || showValue) && (
      <div className="flex items-center justify-between">
        {label && (
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
        )}
        {showValue && (
          <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
            {value?.[0] ?? props.defaultValue?.[0]}
          </span>
        )}
      </div>
    )}
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
        <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-purple-500 bg-white shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 active:scale-110 disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  </div>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
