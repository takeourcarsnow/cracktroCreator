'use client';

import { useState } from 'react';
import { Save, Trash2, Download, Star, Folder } from 'lucide-react';
import { useEditorStore } from '@/store';
import { Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui';
import type { EffectPreset, EffectType } from '@/types';

const EFFECT_LABELS: Record<EffectType, string> = {
  scrolltext: 'Scroll Text',
  sinewave: 'Sine Wave',
  starfield: 'Starfield',
  plasma: 'Plasma',
  rasterbars: 'Raster Bars',
  copperbars: 'Copper Bars',
  particles: 'Particles',
  checkerboard: 'Checkerboard',
  logo: 'Logo',
  fire: 'Fire',
  matrix: 'Matrix',
  tunnel: 'Tunnel',
  glitch: 'Glitch',
  metaballs: 'Metaballs',
  dotmatrix: 'Dot Matrix',
  rotozoom: 'Rotozoom',
  twister: 'Twister',
  wireframe3d: '3D Wireframe',
  sprite: 'Sprite',
};

export function PresetsPanel() {
  const { project, selectedEffectId, presets, savePreset, loadPreset, deletePreset } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const selectedEffect = project?.effects.find((e) => e.id === selectedEffectId);

  // Group presets by effect type
  const presetsByType = presets.reduce((acc, preset) => {
    if (!acc[preset.effectType]) {
      acc[preset.effectType] = [];
    }
    acc[preset.effectType].push(preset);
    return acc;
  }, {} as Record<EffectType, EffectPreset[]>);

  // Filter presets that match the selected effect type
  const matchingPresets = selectedEffect
    ? presets.filter((p) => p.effectType === selectedEffect.type)
    : [];

  const handleSavePreset = () => {
    if (!selectedEffectId || !newPresetName.trim()) return;
    savePreset(newPresetName.trim(), selectedEffectId);
    setNewPresetName('');
    setShowSaveDialog(false);
  };

  const handleLoadPreset = (presetId: string) => {
    loadPreset(presetId);
  };

  const handleDeletePreset = (presetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deletePreset(presetId);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">Presets</span>
          {presets.length > 0 && (
            <span className="text-xs text-gray-400">({presets.length})</span>
          )}
        </div>
        <span className="text-gray-400 text-sm">{isExpanded ? '−' : '+'}</span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Save Preset Button */}
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!selectedEffect}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Current as Preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Effect Preset</DialogTitle>
                <DialogDescription>
                  Save the current effect settings as a reusable preset.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {selectedEffect && (
                  <div className="text-sm text-gray-500">
                    Effect Type: <span className="text-foreground">{EFFECT_LABELS[selectedEffect.type]}</span>
                  </div>
                )}
                <Input
                  placeholder="Preset name..."
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSavePreset()}
                />
                <Button onClick={handleSavePreset} className="w-full" disabled={!newPresetName.trim()}>
                  Save Preset
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Matching Presets for Selected Effect */}
          {selectedEffect && matchingPresets.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {EFFECT_LABELS[selectedEffect.type]} Presets
              </h4>
              <div className="space-y-1">
                {matchingPresets.map((preset) => (
                  <div
                    key={preset.id}
                    onClick={() => handleLoadPreset(preset.id)}
                    className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Download className="w-4 h-4 text-gray-400" />
                      <span className="text-sm truncate">{preset.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDeletePreset(preset.id, e)}
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Presets by Type */}
          {presets.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                All Presets
              </h4>
              {Object.entries(presetsByType).map(([type, typePresets]) => (
                <div key={type} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Folder className="w-3 h-3" />
                    {EFFECT_LABELS[type as EffectType]}
                  </div>
                  {typePresets.map((preset) => (
                    <div
                      key={preset.id}
                      onClick={() => {
                        // Can only load if selected effect matches type
                        if (selectedEffect?.type === preset.effectType) {
                          handleLoadPreset(preset.id);
                        }
                      }}
                      className={`flex items-center justify-between p-2 pl-6 rounded group ${
                        selectedEffect?.type === preset.effectType
                          ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-sm truncate">{preset.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeletePreset(preset.id, e)}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-gray-500">
              <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>No presets saved yet</p>
              <p className="text-xs mt-1">Select an effect and save its settings</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
