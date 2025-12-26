'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Upload, X, Repeat, Activity } from 'lucide-react';
import { useEditorStore } from '@/store';
import { Button, Input, Slider, Switch } from '@/components/ui';
import type { AudioSettings } from '@/types';

const DEFAULT_AUDIO: AudioSettings = {
  enabled: false,
  url: '',
  volume: 0.7,
  loop: true,
  beatDetection: false,
  beatSensitivity: 0.7,
};

export function AudioPanel() {
  const { project, updateProjectSettings } = useEditorStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying } = useEditorStore();

  const audio = project?.audio || DEFAULT_AUDIO;

  // Handle audio playback when project is playing
  useEffect(() => {
    if (!audioRef.current || !audio.enabled || !audio.url) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, audio.enabled, audio.url]);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audio.volume;
    }
  }, [audio.volume]);

  // Update loop
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = audio.loop;
    }
  }, [audio.loop]);

  const handleAudioChange = (updates: Partial<AudioSettings>) => {
    const newAudio = { ...audio, ...updates };
    // Note: In real implementation, we'd add audio to Project type
    // For now, we'll store in a custom way
    (project as any).audio = newAudio;
    // Force re-render by updating project
    updateProjectSettings({ name: project?.name || '' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    handleAudioChange({ url, enabled: true });
  };

  const handleUrlSubmit = () => {
    if (audioUrl) {
      handleAudioChange({ url: audioUrl, enabled: true });
    }
  };

  const clearAudio = () => {
    setAudioUrl('');
    handleAudioChange({ url: '', enabled: false });
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-sm">Audio</span>
          {audio.enabled && audio.url && (
            <span className="text-xs text-green-500">● Active</span>
          )}
        </div>
        <span className="text-gray-400 text-sm">{isExpanded ? '−' : '+'}</span>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
          {/* Audio Source */}
          {!audio.url ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Audio URL..."
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={handleUrlSubmit}>
                  Load
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-500">or</div>
              
              <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-4 h-4" />
                <span className="text-sm">Upload Audio File</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Audio Element */}
              <audio
                ref={audioRef}
                src={audio.url}
                loop={audio.loop}
                preload="metadata"
              />

              {/* Track Info */}
              <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded">
                <div className="flex items-center gap-2 min-w-0">
                  <Music className="w-4 h-4 flex-shrink-0 text-gray-500" />
                  <span className="text-sm truncate">
                    {audio.url.split('/').pop() || 'Audio Track'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearAudio}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Enabled</span>
                <Switch
                  checked={audio.enabled}
                  onCheckedChange={(enabled) => handleAudioChange({ enabled })}
                />
              </div>

              {/* Volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm flex items-center gap-2">
                    {audio.volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    Volume
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round(audio.volume * 100)}%
                  </span>
                </div>
                <Slider
                  value={[audio.volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={([value]) => handleAudioChange({ volume: value })}
                />
              </div>

              {/* Loop */}
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center gap-2">
                  <Repeat className="w-4 h-4" />
                  Loop
                </span>
                <Switch
                  checked={audio.loop}
                  onCheckedChange={(loop) => handleAudioChange({ loop })}
                />
              </div>

              {/* Beat Detection (placeholder) */}
              <div className="flex items-center justify-between opacity-50">
                <span className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Beat Detection
                  <span className="text-xs text-gray-400">(coming soon)</span>
                </span>
                <Switch
                  checked={false}
                  disabled
                  onCheckedChange={() => {}}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
