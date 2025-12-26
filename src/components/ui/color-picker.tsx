'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({ value, onChange, label, className }: ColorPickerProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent p-0 appearance-none"
            style={{ backgroundColor: value }}
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-sm font-mono uppercase"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

interface ColorPalettePickerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  label?: string;
  maxColors?: number;
  className?: string;
}

export function ColorPalettePicker({
  colors,
  onChange,
  label,
  maxColors = 8,
  className,
}: ColorPalettePickerProps) {
  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    onChange(newColors);
  };

  const addColor = () => {
    if (colors.length < maxColors) {
      onChange([...colors, '#FF00FF']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      const newColors = colors.filter((_, i) => i !== index);
      onChange(newColors);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => (
          <div key={index} className="relative group">
            <input
              type="color"
              value={color}
              onChange={(e) => handleColorChange(index, e.target.value)}
              className="h-9 w-9 cursor-pointer rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-transparent p-0 appearance-none transition-transform hover:scale-110"
              style={{ backgroundColor: color }}
            />
            {colors.length > 1 && (
              <button
                onClick={() => removeColor(index)}
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
        ))}
        {colors.length < maxColors && (
          <button
            onClick={addColor}
            className="h-9 w-9 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-colors flex items-center justify-center"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
