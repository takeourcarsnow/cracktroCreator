'use client';

import { useEditorStore } from '@/store';
import { Card, CardHeader, CardTitle, CardContent, Input, Slider, Switch, Textarea } from '@/components/ui';
import { ColorPicker, ColorPalettePicker } from '@/components/ui/color-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FONT_FAMILIES, BLEND_MODES } from '@/lib/constants';
import type { Effect, BlendMode, ScrollTextEffect, SineWaveEffect, StarfieldEffect, PlasmaEffect, RasterBarsEffect, ParticlesEffect, CheckerboardEffect, LogoEffect, FireEffect, MatrixEffect, TunnelEffect, CopperBarsEffect, GlitchEffect, MetaballsEffect, DotMatrixEffect, RotoZoomEffect, TwisterEffect, Wireframe3DEffect, SpriteEffect, VHSEffect, BobsEffect, MoireEffect, LensFlareEffect, VectorBallsEffect } from '@/types';

export function PropertiesPanel() {
  const { project, selectedEffectId, updateEffect } = useEditorStore();

  const selectedEffect = project?.effects.find((e) => e.id === selectedEffectId);

  if (!selectedEffect) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <div className="text-4xl mb-2">🎛️</div>
            <p className="text-sm">Select an effect to edit its properties</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleUpdate = (updates: Partial<Effect>) => {
    updateEffect(selectedEffect.id, updates);
  };

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <CardHeader className="flex-shrink-0 pb-3">
        <CardTitle className="text-base">{selectedEffect.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pb-4 space-y-4">
        {/* Common properties */}
        <div className="space-y-4">
          <Input
            value={selectedEffect.name}
            onChange={(e) => handleUpdate({ name: e.target.value })}
            placeholder="Effect name"
          />
          
          <Slider
            label="Opacity"
            value={[selectedEffect.opacity * 100]}
            onValueChange={([value]) => handleUpdate({ opacity: value / 100 })}
            min={0}
            max={100}
            step={1}
            showValue
          />
          
          <Slider
            label="Z-Index"
            value={[selectedEffect.zIndex]}
            onValueChange={([value]) => handleUpdate({ zIndex: value })}
            min={0}
            max={100}
            step={1}
            showValue
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Blend Mode
            </label>
            <Select
              value={selectedEffect.blendMode || 'normal'}
              onValueChange={(value: BlendMode) => handleUpdate({ blendMode: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLEND_MODES.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Effect-specific properties */}
        {renderEffectProperties(selectedEffect, handleUpdate)}
      </CardContent>
    </Card>
  );
}

function renderEffectProperties(
  effect: Effect,
  onUpdate: (updates: Partial<Effect>) => void
) {
  switch (effect.type) {
    case 'scrolltext':
      return <ScrollTextProperties effect={effect} onUpdate={onUpdate} />;
    case 'sinewave':
      return <SineWaveProperties effect={effect} onUpdate={onUpdate} />;
    case 'starfield':
      return <StarfieldProperties effect={effect} onUpdate={onUpdate} />;
    case 'plasma':
      return <PlasmaProperties effect={effect} onUpdate={onUpdate} />;
    case 'rasterbars':
      return <RasterBarsProperties effect={effect} onUpdate={onUpdate} />;
    case 'copperbars':
      return <CopperBarsProperties effect={effect} onUpdate={onUpdate} />;
    case 'particles':
      return <ParticlesProperties effect={effect} onUpdate={onUpdate} />;
    case 'checkerboard':
      return <CheckerboardProperties effect={effect} onUpdate={onUpdate} />;
    case 'logo':
      return <LogoProperties effect={effect} onUpdate={onUpdate} />;
    case 'fire':
      return <FireProperties effect={effect} onUpdate={onUpdate} />;
    case 'matrix':
      return <MatrixProperties effect={effect} onUpdate={onUpdate} />;
    case 'tunnel':
      return <TunnelProperties effect={effect} onUpdate={onUpdate} />;
    case 'glitch':
      return <GlitchProperties effect={effect} onUpdate={onUpdate} />;
    case 'metaballs':
      return <MetaballsProperties effect={effect} onUpdate={onUpdate} />;
    case 'dotmatrix':
      return <DotMatrixProperties effect={effect} onUpdate={onUpdate} />;
    case 'rotozoom':
      return <RotoZoomProperties effect={effect} onUpdate={onUpdate} />;
    case 'twister':
      return <TwisterProperties effect={effect} onUpdate={onUpdate} />;
    case 'wireframe3d':
      return <Wireframe3DProperties effect={effect} onUpdate={onUpdate} />;
    case 'sprite':
      return <SpriteProperties effect={effect} onUpdate={onUpdate} />;
    case 'vhs':
      return <VHSProperties effect={effect} onUpdate={onUpdate} />;
    case 'bobs':
      return <BobsProperties effect={effect} onUpdate={onUpdate} />;
    case 'moire':
      return <MoireProperties effect={effect} onUpdate={onUpdate} />;
    case 'lensflare':
      return <LensFlareProperties effect={effect} onUpdate={onUpdate} />;
    case 'vectorballs':
      return <VectorBallsProperties effect={effect} onUpdate={onUpdate} />;
    default:
      return null;
  }
}

function ScrollTextProperties({
  effect,
  onUpdate,
}: {
  effect: ScrollTextEffect;
  onUpdate: (updates: Partial<ScrollTextEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Textarea
        value={effect.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Enter scroll text..."
        className="min-h-[80px]"
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={10}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Font Size"
        value={[effect.fontSize]}
        onValueChange={([value]) => onUpdate({ fontSize: value })}
        min={12}
        max={72}
        step={2}
        showValue
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Font Family
        </label>
        <Select
          value={effect.fontFamily}
          onValueChange={(value) => onUpdate({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Direction
        </label>
        <Select
          value={effect.direction}
          onValueChange={(value: 'left' | 'right') => onUpdate({ direction: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Slider
        label="Y Position (%)"
        value={[effect.yPosition]}
        onValueChange={([value]) => onUpdate({ yPosition: value })}
        min={10}
        max={90}
        step={5}
        showValue
      />
      
      <Switch
        label="Use Gradient"
        checked={effect.useGradient}
        onCheckedChange={(checked) => onUpdate({ useGradient: checked })}
      />
      
      {effect.useGradient ? (
        <ColorPalettePicker
          label="Gradient Colors"
          colors={effect.gradientColors}
          onChange={(colors) => onUpdate({ gradientColors: colors })}
        />
      ) : (
        <ColorPicker
          label="Text Color"
          value={effect.color}
          onChange={(color) => onUpdate({ color })}
        />
      )}
    </div>
  );
}

function SineWaveProperties({
  effect,
  onUpdate,
}: {
  effect: SineWaveEffect;
  onUpdate: (updates: Partial<SineWaveEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Input
        value={effect.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Enter text..."
      />
      
      <Slider
        label="Amplitude"
        value={[effect.amplitude]}
        onValueChange={([value]) => onUpdate({ amplitude: value })}
        min={10}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="Frequency"
        value={[effect.frequency * 100]}
        onValueChange={([value]) => onUpdate({ frequency: value / 100 })}
        min={5}
        max={50}
        step={1}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={10}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Font Size"
        value={[effect.fontSize]}
        onValueChange={([value]) => onUpdate({ fontSize: value })}
        min={12}
        max={72}
        step={2}
        showValue
      />
      
      <Slider
        label="Y Position (%)"
        value={[effect.yPosition]}
        onValueChange={([value]) => onUpdate({ yPosition: value })}
        min={10}
        max={90}
        step={5}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function StarfieldProperties({
  effect,
  onUpdate,
}: {
  effect: StarfieldEffect;
  onUpdate: (updates: Partial<StarfieldEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Star Count"
        value={[effect.starCount]}
        onValueChange={([value]) => onUpdate({ starCount: value })}
        min={50}
        max={500}
        step={10}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={10}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Max Size"
        value={[effect.maxSize]}
        onValueChange={([value]) => onUpdate({ maxSize: value })}
        min={1}
        max={10}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Depth"
        value={[effect.depth]}
        onValueChange={([value]) => onUpdate({ depth: value })}
        min={1}
        max={5}
        step={0.5}
        showValue
      />
      
      <ColorPicker
        label="Star Color"
        value={effect.starColor}
        onChange={(color) => onUpdate({ starColor: color })}
      />
    </div>
  );
}

function PlasmaProperties({
  effect,
  onUpdate,
}: {
  effect: PlasmaEffect;
  onUpdate: (updates: Partial<PlasmaEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Scale"
        value={[effect.scale]}
        onValueChange={([value]) => onUpdate({ scale: value })}
        min={1}
        max={10}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Intensity"
        value={[effect.intensity * 100]}
        onValueChange={([value]) => onUpdate({ intensity: value / 100 })}
        min={10}
        max={100}
        step={5}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function RasterBarsProperties({
  effect,
  onUpdate,
}: {
  effect: RasterBarsEffect;
  onUpdate: (updates: Partial<RasterBarsEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Bar Count"
        value={[effect.barCount]}
        onValueChange={([value]) => onUpdate({ barCount: value })}
        min={3}
        max={20}
        step={1}
        showValue
      />
      
      <Slider
        label="Bar Height"
        value={[effect.barHeight]}
        onValueChange={([value]) => onUpdate({ barHeight: value })}
        min={5}
        max={50}
        step={5}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Amplitude"
        value={[effect.amplitude]}
        onValueChange={([value]) => onUpdate({ amplitude: value })}
        min={20}
        max={200}
        step={10}
        showValue
      />
      
      <Slider
        label="Spacing"
        value={[effect.spacing]}
        onValueChange={([value]) => onUpdate({ spacing: value })}
        min={10}
        max={100}
        step={5}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function CopperBarsProperties({
  effect,
  onUpdate,
}: {
  effect: CopperBarsEffect;
  onUpdate: (updates: Partial<CopperBarsEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Bar Height"
        value={[effect.barHeight]}
        onValueChange={([value]) => onUpdate({ barHeight: value })}
        min={1}
        max={20}
        step={1}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Wave Amplitude"
        value={[effect.waveAmplitude]}
        onValueChange={([value]) => onUpdate({ waveAmplitude: value })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function ParticlesProperties({
  effect,
  onUpdate,
}: {
  effect: ParticlesEffect;
  onUpdate: (updates: Partial<ParticlesEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Particle Count"
        value={[effect.particleCount]}
        onValueChange={([value]) => onUpdate({ particleCount: value })}
        min={20}
        max={300}
        step={10}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Max Size"
        value={[effect.maxSize]}
        onValueChange={([value]) => onUpdate({ maxSize: value })}
        min={1}
        max={10}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Gravity"
        value={[effect.gravity * 10]}
        onValueChange={([value]) => onUpdate({ gravity: value / 10 })}
        min={-10}
        max={10}
        step={1}
        showValue
      />
      
      <Slider
        label="Spread"
        value={[effect.spread]}
        onValueChange={([value]) => onUpdate({ spread: value })}
        min={10}
        max={300}
        step={10}
        showValue
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Shape
        </label>
        <Select
          value={effect.shape}
          onValueChange={(value: 'circle' | 'square' | 'star') => onUpdate({ shape: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="square">Square</SelectItem>
            <SelectItem value="star">Star</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function CheckerboardProperties({
  effect,
  onUpdate,
}: {
  effect: CheckerboardEffect;
  onUpdate: (updates: Partial<CheckerboardEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <ColorPicker
        label="Color 1"
        value={effect.color1}
        onChange={(color) => onUpdate({ color1: color })}
      />
      
      <ColorPicker
        label="Color 2"
        value={effect.color2}
        onChange={(color) => onUpdate({ color2: color })}
      />
      
      <Slider
        label="Tile Size"
        value={[effect.tileSize]}
        onValueChange={([value]) => onUpdate({ tileSize: value })}
        min={20}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="Perspective"
        value={[effect.perspective]}
        onValueChange={([value]) => onUpdate({ perspective: value })}
        min={100}
        max={1000}
        step={50}
        showValue
      />
      
      <Slider
        label="Scroll Speed"
        value={[effect.scrollSpeed]}
        onValueChange={([value]) => onUpdate({ scrollSpeed: value })}
        min={0.5}
        max={10}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Y Offset (%)"
        value={[effect.yOffset]}
        onValueChange={([value]) => onUpdate({ yOffset: value })}
        min={30}
        max={90}
        step={5}
        showValue
      />
    </div>
  );
}

function LogoProperties({
  effect,
  onUpdate,
}: {
  effect: LogoEffect;
  onUpdate: (updates: Partial<LogoEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Input
        value={effect.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Logo text..."
      />
      
      <Slider
        label="Font Size"
        value={[effect.fontSize]}
        onValueChange={([value]) => onUpdate({ fontSize: value })}
        min={24}
        max={120}
        step={4}
        showValue
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Font Family
        </label>
        <Select
          value={effect.fontFamily}
          onValueChange={(value) => onUpdate({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONT_FAMILIES.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                {font.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Slider
        label="Bounce Amplitude"
        value={[effect.bounceAmplitude]}
        onValueChange={([value]) => onUpdate({ bounceAmplitude: value })}
        min={0}
        max={50}
        step={5}
        showValue
      />
      
      <Slider
        label="Bounce Speed"
        value={[effect.bounceSpeed]}
        onValueChange={([value]) => onUpdate({ bounceSpeed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Switch
        label="Scale Effect"
        checked={effect.scaleEffect}
        onCheckedChange={(checked) => onUpdate({ scaleEffect: checked })}
      />
      
      <Switch
        label="Rotation"
        checked={effect.rotationEnabled}
        onCheckedChange={(checked) => onUpdate({ rotationEnabled: checked })}
      />
      
      {effect.rotationEnabled && (
        <Slider
          label="Rotation Speed"
          value={[effect.rotationSpeed]}
          onValueChange={([value]) => onUpdate({ rotationSpeed: value })}
          min={0.5}
          max={5}
          step={0.5}
          showValue
        />
      )}
      
      <Switch
        label="Glow Effect"
        checked={effect.glowEnabled}
        onCheckedChange={(checked) => onUpdate({ glowEnabled: checked })}
      />
      
      {effect.glowEnabled && (
        <ColorPicker
          label="Glow Color"
          value={effect.glowColor}
          onChange={(color) => onUpdate({ glowColor: color })}
        />
      )}
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function FireProperties({
  effect,
  onUpdate,
}: {
  effect: FireEffect;
  onUpdate: (updates: Partial<FireEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Intensity"
        value={[effect.intensity * 100]}
        onValueChange={([value]) => onUpdate({ intensity: value / 100 })}
        min={50}
        max={150}
        step={10}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={1}
        max={10}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Height"
        value={[effect.height]}
        onValueChange={([value]) => onUpdate({ height: value })}
        min={50}
        max={400}
        step={10}
        showValue
      />
      
      <Slider
        label="Spread"
        value={[effect.spread]}
        onValueChange={([value]) => onUpdate({ spread: value })}
        min={1}
        max={5}
        step={0.5}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function MatrixProperties({
  effect,
  onUpdate,
}: {
  effect: MatrixEffect;
  onUpdate: (updates: Partial<MatrixEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Font Size"
        value={[effect.fontSize]}
        onValueChange={([value]) => onUpdate({ fontSize: value })}
        min={10}
        max={30}
        step={2}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Density"
        value={[effect.density * 100]}
        onValueChange={([value]) => onUpdate({ density: value / 100 })}
        min={80}
        max={99}
        step={1}
        showValue
      />
      
      <ColorPicker
        label="Color"
        value={effect.color}
        onChange={(color) => onUpdate({ color })}
      />
    </div>
  );
}

function TunnelProperties({
  effect,
  onUpdate,
}: {
  effect: TunnelEffect;
  onUpdate: (updates: Partial<TunnelEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Ring Count"
        value={[effect.ringCount]}
        onValueChange={([value]) => onUpdate({ ringCount: value })}
        min={5}
        max={50}
        step={5}
        showValue
      />
      
      <Slider
        label="Rotation"
        value={[effect.rotation]}
        onValueChange={([value]) => onUpdate({ rotation: value })}
        min={0}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Perspective"
        value={[effect.perspective]}
        onValueChange={([value]) => onUpdate({ perspective: value })}
        min={100}
        max={1000}
        step={50}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function GlitchProperties({
  effect,
  onUpdate,
}: {
  effect: GlitchEffect;
  onUpdate: (updates: Partial<GlitchEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Intensity"
        value={[effect.intensity * 100]}
        onValueChange={([value]) => onUpdate({ intensity: value / 100 })}
        min={10}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Noise"
        value={[effect.noise * 100]}
        onValueChange={([value]) => onUpdate({ noise: value / 100 })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="Slice Count"
        value={[effect.sliceCount]}
        onValueChange={([value]) => onUpdate({ sliceCount: value })}
        min={5}
        max={30}
        step={1}
        showValue
      />
      
      <Switch
        label="Color Shift"
        checked={effect.colorShift}
        onCheckedChange={(checked) => onUpdate({ colorShift: checked })}
      />
      
      <Switch
        label="Scanlines"
        checked={effect.scanlines}
        onCheckedChange={(checked) => onUpdate({ scanlines: checked })}
      />
    </div>
  );
}

function MetaballsProperties({
  effect,
  onUpdate,
}: {
  effect: MetaballsEffect;
  onUpdate: (updates: Partial<MetaballsEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Ball Count"
        value={[effect.ballCount]}
        onValueChange={([value]) => onUpdate({ ballCount: value })}
        min={2}
        max={10}
        step={1}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Size"
        value={[effect.size]}
        onValueChange={([value]) => onUpdate({ size: value })}
        min={30}
        max={150}
        step={10}
        showValue
      />
      
      <Slider
        label="Threshold"
        value={[effect.threshold * 100]}
        onValueChange={([value]) => onUpdate({ threshold: value / 100 })}
        min={50}
        max={200}
        step={10}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function DotMatrixProperties({
  effect,
  onUpdate,
}: {
  effect: DotMatrixEffect;
  onUpdate: (updates: Partial<DotMatrixEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Input
        value={effect.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Enter text..."
      />
      
      <Slider
        label="Dot Size"
        value={[effect.dotSize]}
        onValueChange={([value]) => onUpdate({ dotSize: value })}
        min={2}
        max={10}
        step={1}
        showValue
      />
      
      <Slider
        label="Gap"
        value={[effect.gap]}
        onValueChange={([value]) => onUpdate({ gap: value })}
        min={1}
        max={5}
        step={1}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Direction
        </label>
        <Select
          value={effect.scrollDirection}
          onValueChange={(value: 'left' | 'right' | 'up' | 'down') => onUpdate({ scrollDirection: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
            <SelectItem value="up">Up</SelectItem>
            <SelectItem value="down">Down</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ColorPicker
        label="Dot Color"
        value={effect.color}
        onChange={(color) => onUpdate({ color })}
      />
      
      <ColorPicker
        label="Background"
        value={effect.backgroundColor}
        onChange={(color) => onUpdate({ backgroundColor: color })}
      />
    </div>
  );
}

function RotoZoomProperties({
  effect,
  onUpdate,
}: {
  effect: RotoZoomEffect;
  onUpdate: (updates: Partial<RotoZoomEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Pattern
        </label>
        <Select
          value={effect.pattern}
          onValueChange={(value: 'checkerboard' | 'stripes' | 'dots' | 'custom') => onUpdate({ pattern: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checkerboard">Checkerboard</SelectItem>
            <SelectItem value="stripes">Stripes</SelectItem>
            <SelectItem value="dots">Dots</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Slider
        label="Rotation Speed"
        value={[effect.rotationSpeed * 100]}
        onValueChange={([value]) => onUpdate({ rotationSpeed: value / 100 })}
        min={0}
        max={300}
        step={10}
        showValue
      />
      
      <Slider
        label="Zoom Speed"
        value={[effect.zoomSpeed * 100]}
        onValueChange={([value]) => onUpdate({ zoomSpeed: value / 100 })}
        min={0}
        max={200}
        step={10}
        showValue
      />
      
      <Slider
        label="Scale"
        value={[effect.scale * 100]}
        onValueChange={([value]) => onUpdate({ scale: value / 100 })}
        min={50}
        max={500}
        step={25}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function TwisterProperties({
  effect,
  onUpdate,
}: {
  effect: TwisterEffect;
  onUpdate: (updates: Partial<TwisterEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Bar Count"
        value={[effect.barCount]}
        onValueChange={([value]) => onUpdate({ barCount: value })}
        min={4}
        max={32}
        step={2}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Amplitude"
        value={[effect.amplitude]}
        onValueChange={([value]) => onUpdate({ amplitude: value })}
        min={20}
        max={200}
        step={10}
        showValue
      />
      
      <Slider
        label="Segments"
        value={[effect.segments]}
        onValueChange={([value]) => onUpdate({ segments: value })}
        min={8}
        max={64}
        step={4}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function Wireframe3DProperties({
  effect,
  onUpdate,
}: {
  effect: Wireframe3DEffect;
  onUpdate: (updates: Partial<Wireframe3DEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Shape
        </label>
        <Select
          value={effect.shape}
          onValueChange={(value: 'cube' | 'torus' | 'sphere' | 'pyramid') => onUpdate({ shape: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cube">Cube</SelectItem>
            <SelectItem value="pyramid">Pyramid</SelectItem>
            <SelectItem value="sphere">Sphere</SelectItem>
            <SelectItem value="torus">Torus</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Slider
        label="Rotation X"
        value={[effect.rotationSpeedX * 100]}
        onValueChange={([value]) => onUpdate({ rotationSpeedX: value / 100 })}
        min={0}
        max={500}
        step={25}
        showValue
      />
      
      <Slider
        label="Rotation Y"
        value={[effect.rotationSpeedY * 100]}
        onValueChange={([value]) => onUpdate({ rotationSpeedY: value / 100 })}
        min={0}
        max={500}
        step={25}
        showValue
      />
      
      <Slider
        label="Rotation Z"
        value={[effect.rotationSpeedZ * 100]}
        onValueChange={([value]) => onUpdate({ rotationSpeedZ: value / 100 })}
        min={0}
        max={500}
        step={25}
        showValue
      />
      
      <Slider
        label="Scale"
        value={[effect.scale]}
        onValueChange={([value]) => onUpdate({ scale: value })}
        min={50}
        max={200}
        step={10}
        showValue
      />
      
      <Slider
        label="Line Width"
        value={[effect.lineWidth]}
        onValueChange={([value]) => onUpdate({ lineWidth: value })}
        min={1}
        max={5}
        step={0.5}
        showValue
      />
      
      <ColorPicker
        label="Color"
        value={effect.color}
        onChange={(color) => onUpdate({ color })}
      />
    </div>
  );
}

function SpriteProperties({
  effect,
  onUpdate,
}: {
  effect: SpriteEffect;
  onUpdate: (updates: Partial<SpriteEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Input
        value={effect.imageUrl}
        onChange={(e) => onUpdate({ imageUrl: e.target.value })}
        placeholder="Image URL (or data URL)"
      />
      
      <Slider
        label="Width"
        value={[effect.width]}
        onValueChange={([value]) => onUpdate({ width: value })}
        min={20}
        max={400}
        step={10}
        showValue
      />
      
      <Slider
        label="Height"
        value={[effect.height]}
        onValueChange={([value]) => onUpdate({ height: value })}
        min={20}
        max={400}
        step={10}
        showValue
      />
      
      <Slider
        label="X Position (%)"
        value={[effect.x]}
        onValueChange={([value]) => onUpdate({ x: value })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="Y Position (%)"
        value={[effect.y]}
        onValueChange={([value]) => onUpdate({ y: value })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Animation
        </label>
        <Select
          value={effect.animationType}
          onValueChange={(value: 'none' | 'bounce' | 'float' | 'rotate' | 'pulse') => onUpdate({ animationType: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="bounce">Bounce</SelectItem>
            <SelectItem value="float">Float</SelectItem>
            <SelectItem value="rotate">Rotate</SelectItem>
            <SelectItem value="pulse">Pulse</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {effect.animationType !== 'none' && (
        <>
          <Slider
            label="Animation Speed"
            value={[effect.animationSpeed * 100]}
            onValueChange={([value]) => onUpdate({ animationSpeed: value / 100 })}
            min={10}
            max={300}
            step={10}
            showValue
          />
          
          <Slider
            label="Animation Amplitude"
            value={[effect.animationAmplitude]}
            onValueChange={([value]) => onUpdate({ animationAmplitude: value })}
            min={5}
            max={100}
            step={5}
            showValue
          />
        </>
      )}
    </div>
  );
}

function VHSProperties({
  effect,
  onUpdate,
}: {
  effect: VHSEffect;
  onUpdate: (updates: Partial<VHSEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Noise Intensity"
        value={[effect.noiseIntensity * 100]}
        onValueChange={([value]) => onUpdate({ noiseIntensity: value / 100 })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="Scanline Intensity"
        value={[effect.scanlineIntensity * 100]}
        onValueChange={([value]) => onUpdate({ scanlineIntensity: value / 100 })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="RGB Shift"
        value={[effect.rgbShift]}
        onValueChange={([value]) => onUpdate({ rgbShift: value })}
        min={0}
        max={20}
        step={1}
        showValue
      />
      
      <Slider
        label="Distortion"
        value={[effect.distortion * 100]}
        onValueChange={([value]) => onUpdate({ distortion: value / 100 })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <Switch
        label="Flickering"
        checked={effect.flickering}
        onCheckedChange={(checked) => onUpdate({ flickering: checked })}
      />
      
      <Switch
        label="Tracking Lines"
        checked={effect.trackingLines}
        onCheckedChange={(checked) => onUpdate({ trackingLines: checked })}
      />
    </div>
  );
}

function BobsProperties({
  effect,
  onUpdate,
}: {
  effect: BobsEffect;
  onUpdate: (updates: Partial<BobsEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Bob Count"
        value={[effect.bobCount]}
        onValueChange={([value]) => onUpdate({ bobCount: value })}
        min={3}
        max={30}
        step={1}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Size"
        value={[effect.size]}
        onValueChange={([value]) => onUpdate({ size: value })}
        min={10}
        max={80}
        step={5}
        showValue
      />
      
      <Slider
        label="Trail Length"
        value={[effect.trailLength]}
        onValueChange={([value]) => onUpdate({ trailLength: value })}
        min={0}
        max={20}
        step={1}
        showValue
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Pattern
        </label>
        <Select
          value={effect.pattern}
          onValueChange={(value: 'circle' | 'wave' | 'lissajous' | 'spiral') => onUpdate({ pattern: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circle">Circle</SelectItem>
            <SelectItem value="wave">Wave</SelectItem>
            <SelectItem value="lissajous">Lissajous</SelectItem>
            <SelectItem value="spiral">Spiral</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Switch
        label="Glow Effect"
        checked={effect.glowEnabled}
        onCheckedChange={(checked) => onUpdate({ glowEnabled: checked })}
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function MoireProperties({
  effect,
  onUpdate,
}: {
  effect: MoireEffect;
  onUpdate: (updates: Partial<MoireEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Pattern Type
        </label>
        <Select
          value={effect.pattern}
          onValueChange={(value: 'circles' | 'lines' | 'grid') => onUpdate({ pattern: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="circles">Circles</SelectItem>
            <SelectItem value="lines">Lines</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Spacing"
        value={[effect.spacing]}
        onValueChange={([value]) => onUpdate({ spacing: value })}
        min={5}
        max={50}
        step={5}
        showValue
      />
      
      <Slider
        label="Offset X"
        value={[effect.offsetX]}
        onValueChange={([value]) => onUpdate({ offsetX: value })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="Offset Y"
        value={[effect.offsetY]}
        onValueChange={([value]) => onUpdate({ offsetY: value })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function LensFlareProperties({
  effect,
  onUpdate,
}: {
  effect: LensFlareEffect;
  onUpdate: (updates: Partial<LensFlareEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="X Position (%)"
        value={[effect.x]}
        onValueChange={([value]) => onUpdate({ x: value })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="Y Position (%)"
        value={[effect.y]}
        onValueChange={([value]) => onUpdate({ y: value })}
        min={0}
        max={100}
        step={5}
        showValue
      />
      
      <Slider
        label="Size"
        value={[effect.size]}
        onValueChange={([value]) => onUpdate({ size: value })}
        min={50}
        max={300}
        step={10}
        showValue
      />
      
      <Slider
        label="Intensity"
        value={[effect.intensity * 100]}
        onValueChange={([value]) => onUpdate({ intensity: value / 100 })}
        min={10}
        max={200}
        step={10}
        showValue
      />
      
      <Slider
        label="Ghost Count"
        value={[effect.ghostCount]}
        onValueChange={([value]) => onUpdate({ ghostCount: value })}
        min={0}
        max={10}
        step={1}
        showValue
      />
      
      <Switch
        label="Anamorphic Streak"
        checked={effect.anamorphic}
        onCheckedChange={(checked) => onUpdate({ anamorphic: checked })}
      />
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}

function VectorBallsProperties({
  effect,
  onUpdate,
}: {
  effect: VectorBallsEffect;
  onUpdate: (updates: Partial<VectorBallsEffect>) => void;
}) {
  return (
    <div className="space-y-4">
      <Slider
        label="Ball Count"
        value={[effect.ballCount]}
        onValueChange={([value]) => onUpdate({ ballCount: value })}
        min={8}
        max={64}
        step={4}
        showValue
      />
      
      <Slider
        label="Ball Size"
        value={[effect.size]}
        onValueChange={([value]) => onUpdate({ size: value })}
        min={5}
        max={30}
        step={2}
        showValue
      />
      
      <Slider
        label="Speed"
        value={[effect.speed]}
        onValueChange={([value]) => onUpdate({ speed: value })}
        min={0.5}
        max={5}
        step={0.5}
        showValue
      />
      
      <Slider
        label="Perspective"
        value={[effect.perspective]}
        onValueChange={([value]) => onUpdate({ perspective: value })}
        min={100}
        max={1000}
        step={50}
        showValue
      />
      
      <Slider
        label="Rotation X"
        value={[effect.rotationX * 100]}
        onValueChange={([value]) => onUpdate({ rotationX: value / 100 })}
        min={0}
        max={500}
        step={25}
        showValue
      />
      
      <Slider
        label="Rotation Y"
        value={[effect.rotationY * 100]}
        onValueChange={([value]) => onUpdate({ rotationY: value / 100 })}
        min={0}
        max={500}
        step={25}
        showValue
      />
      
      <Slider
        label="Rotation Z"
        value={[effect.rotationZ * 100]}
        onValueChange={([value]) => onUpdate({ rotationZ: value / 100 })}
        min={0}
        max={500}
        step={25}
        showValue
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Formation
        </label>
        <Select
          value={effect.formation}
          onValueChange={(value: 'cube' | 'sphere' | 'torus' | 'wave') => onUpdate({ formation: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cube">Cube</SelectItem>
            <SelectItem value="sphere">Sphere</SelectItem>
            <SelectItem value="torus">Torus</SelectItem>
            <SelectItem value="wave">Wave</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <ColorPalettePicker
        label="Colors"
        colors={effect.colors}
        onChange={(colors) => onUpdate({ colors })}
      />
    </div>
  );
}
