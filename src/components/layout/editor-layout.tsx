'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { EffectsLibrary, EffectsList, PropertiesPanel, AudioPanel, PresetsPanel, TimelineEditor } from '@/components/editor';
import { PreviewCanvas, FullscreenPreview } from '@/components/canvas';
import { WelcomeScreen } from '@/components/welcome';
import { KeyboardShortcuts } from '@/hooks';
import { useEditorStore } from '@/store';
import { cn } from '@/lib/utils';

export function EditorLayout() {
  const { project } = useEditorStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'effects' | 'layers' | 'properties'>('effects');
  const [showTimeline, setShowTimeline] = useState(false);

  // Show welcome screen when no project is open
  if (!project) {
    return <WelcomeScreen />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Keyboard shortcuts handler */}
      <KeyboardShortcuts />
      
      {/* Fullscreen preview overlay */}
      <FullscreenPreview />

      <Header
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
        showTimeline={showTimeline}
        onToggleTimeline={() => setShowTimeline(!showTimeline)}
      />

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Desktop */}
          <Sidebar side="left" isOpen={isMobileMenuOpen} className="hidden lg:block">
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex-1 min-h-0">
                <EffectsLibrary />
              </div>
              <div className="flex-1 min-h-0">
                <EffectsList />
              </div>
            </div>
          </Sidebar>

          {/* Mobile Sidebar with Tabs */}
          <Sidebar side="left" isOpen={isMobileMenuOpen} className="lg:hidden">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="effects">Effects</TabsTrigger>
                <TabsTrigger value="layers">Layers</TabsTrigger>
                <TabsTrigger value="properties">Properties</TabsTrigger>
              </TabsList>
              <TabsContent value="effects" className="h-[calc(100vh-200px)]">
                <EffectsLibrary />
              </TabsContent>
              <TabsContent value="layers" className="h-[calc(100vh-200px)]">
                <EffectsList />
              </TabsContent>
              <TabsContent value="properties" className="h-[calc(100vh-200px)]">
                <PropertiesPanel />
              </TabsContent>
            </Tabs>
          </Sidebar>

          {/* Main Canvas Area */}
          <main className="flex-1 overflow-hidden bg-gray-100 dark:bg-gray-900">
            <PreviewCanvas className="h-full" />
          </main>

          {/* Right Sidebar - Desktop only */}
          <Sidebar side="right" isOpen={false} className="hidden lg:block">
            <div className="space-y-4 h-full overflow-y-auto">
              <PropertiesPanel />
              <PresetsPanel />
              <AudioPanel />
            </div>
          </Sidebar>
        </div>

        {/* Timeline Editor */}
        {showTimeline && (
          <TimelineEditor className="h-48 flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
