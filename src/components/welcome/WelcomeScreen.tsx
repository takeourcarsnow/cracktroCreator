'use client';

import { useState } from 'react';
import { Sparkles, Play, Zap, Layers, Palette, Download } from 'lucide-react';
import { useEditorStore } from '@/store';
import { Button, Card, Input } from '@/components/ui';
import { TEMPLATES } from '@/lib/templates';
import { createDefaultEffect } from '@/lib/effects-factory';
import { cn } from '@/lib/utils';
import type { Project, Effect } from '@/types';

const FEATURES = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: '12 Effects',
    description: 'Plasma, starfield, fire, matrix & more',
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: 'Layer System',
    description: 'Stack and blend multiple effects',
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Full Customization',
    description: 'Colors, speeds, and parameters',
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: 'Export & Share',
    description: 'Save and share your creations',
  },
];

export function WelcomeScreen() {
  const { createProject, loadProject } = useEditorStore();
  const [projectName, setProjectName] = useState('My Cracktro');

  const handleCreateNew = () => {
    createProject(projectName || 'My Cracktro');
  };

  const handleUseTemplate = (templateIndex: number) => {
    const template = TEMPLATES[templateIndex];
    if (template) {
      // Create actual Effect objects from template
      const effects: Effect[] = template.effects.map((templateEffect, index) => {
        const defaultEffect = createDefaultEffect(templateEffect.type);
        return {
          ...defaultEffect,
          ...templateEffect.overrides,
          zIndex: index,
        } as Effect;
      });

      const newProject: Project = {
        id: crypto.randomUUID(),
        name: template.name,
        width: 800,
        height: 600,
        backgroundColor: template.backgroundColor,
        effects,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      loadProject(newProject);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 dark:from-purple-500/5 dark:to-cyan-500/5" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-4xl w-full space-y-8">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/25 animate-pulse-glow">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 text-transparent bg-clip-text" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Cracktro Designer
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Create stunning retro demo effects with a modern, intuitive editor
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map((feature, index) => (
            <Card 
              key={index} 
              className="p-4 text-center glass border-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-500 mb-2">
                {feature.icon}
              </div>
              <h3 className="font-medium text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Create Project */}
        <Card className="p-6 glass border-white/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-purple-500" />
            Start Creating
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleCreateNew()}
            />
            <Button onClick={handleCreateNew} className="shrink-0">
              Create New Project
            </Button>
          </div>
        </Card>

        {/* Templates */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Quick Start Templates</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TEMPLATES.slice(0, 6).map((template, index) => (
              <button
                key={template.id}
                onClick={() => handleUseTemplate(index)}
                className={cn(
                  "p-4 rounded-xl text-left transition-all duration-300",
                  "bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900",
                  "border border-gray-200 dark:border-gray-700",
                  "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10",
                  "active:scale-[0.98]"
                )}
              >
                <div 
                  className="w-full aspect-video rounded-lg mb-3"
                  style={{ 
                    background: `linear-gradient(135deg, ${template.backgroundColor} 0%, #2a2a2a 100%)` 
                  }}
                />
                <h3 className="font-medium text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {template.effects.length} effects
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-400 dark:text-gray-500">
          Made with ❤️ for the demoscene community
        </p>
      </div>
    </div>
  );
}
