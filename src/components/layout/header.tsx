'use client';

import { useState } from 'react';
import { Menu, X, Sun, Moon, Sparkles, Timer } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui';
import { ProjectManager, Toolbar, ExportDialog, ImportDialog } from '@/components/editor';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  showTimeline?: boolean;
  onToggleTimeline?: () => void;
}

export function Header({ onMenuToggle, isMobileMenuOpen, showTimeline, onToggleTimeline }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useState(() => {
    setMounted(true);
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Logo & Menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuToggle}
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                CracktroPro
              </h1>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                Demoscene Designer
              </p>
            </div>
          </div>
        </div>

        {/* Center - Toolbar */}
        <div className="hidden md:flex items-center gap-2">
          <Toolbar />
          
          {onToggleTimeline && (
            <>
              <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
              <Button
                variant={showTimeline ? 'secondary' : 'ghost'}
                size="sm"
                onClick={onToggleTimeline}
                title="Toggle Timeline (T)"
                className="gap-2"
              >
                <Timer className="w-4 h-4" />
                <span className="hidden lg:inline">Timeline</span>
              </Button>
            </>
          )}
        </div>

        {/* Right side - Import/Export, Project Manager & Theme */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <ImportDialog />
            <ExportDialog />
          </div>
          
          <ProjectManager />

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Toolbar */}
      <div className="md:hidden px-4 pb-3 flex justify-center">
        <Toolbar />
      </div>
    </header>
  );
}
