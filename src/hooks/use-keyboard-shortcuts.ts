'use client';

import { useEffect, useCallback } from 'react';
import { useStore } from 'zustand';
import { useEditorStore, useTemporalStore } from '@/store';

export function useKeyboardShortcuts() {
  const {
    project,
    selectedEffectId,
    isPlaying,
    togglePlaying,
    removeEffect,
    duplicateEffect,
    selectEffect,
    toggleGrid,
    toggleFullscreen,
    setZoom,
    zoom,
  } = useEditorStore();

  // Access temporal store for undo/redo
  const temporalStore = useEditorStore.temporal;
  const { undo, redo } = useTemporalStore();
  const pastStates = useStore(temporalStore, (state) => state.pastStates);
  const futureStates = useStore(temporalStore, (state) => state.futureStates);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdKey = isMac ? e.metaKey : e.ctrlKey;

      // Space - Toggle play/pause
      if (e.code === 'Space' && !cmdKey) {
        e.preventDefault();
        togglePlaying();
        return;
      }

      // Delete/Backspace - Remove selected effect
      if ((e.code === 'Delete' || e.code === 'Backspace') && selectedEffectId) {
        e.preventDefault();
        removeEffect(selectedEffectId);
        return;
      }

      // Ctrl/Cmd + D - Duplicate selected effect
      if (cmdKey && e.code === 'KeyD' && selectedEffectId) {
        e.preventDefault();
        duplicateEffect(selectedEffectId);
        return;
      }

      // Ctrl/Cmd + Z - Undo
      if (cmdKey && e.code === 'KeyZ' && !e.shiftKey) {
        e.preventDefault();
        if (pastStates.length > 0) {
          undo();
        }
        return;
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if ((cmdKey && e.shiftKey && e.code === 'KeyZ') || (cmdKey && e.code === 'KeyY')) {
        e.preventDefault();
        if (futureStates.length > 0) {
          redo();
        }
        return;
      }

      // Escape - Deselect effect
      if (e.code === 'Escape') {
        e.preventDefault();
        selectEffect(null);
        return;
      }

      // G - Toggle grid
      if (e.code === 'KeyG' && !cmdKey) {
        e.preventDefault();
        toggleGrid();
        return;
      }

      // F - Toggle fullscreen
      if (e.code === 'KeyF' && !cmdKey) {
        e.preventDefault();
        toggleFullscreen();
        return;
      }

      // Ctrl/Cmd + 0 - Reset zoom
      if (cmdKey && e.code === 'Digit0') {
        e.preventDefault();
        setZoom(1);
        return;
      }

      // Ctrl/Cmd + Plus - Zoom in
      if (cmdKey && (e.code === 'Equal' || e.code === 'NumpadAdd')) {
        e.preventDefault();
        setZoom(Math.min(2, zoom + 0.25));
        return;
      }

      // Ctrl/Cmd + Minus - Zoom out
      if (cmdKey && (e.code === 'Minus' || e.code === 'NumpadSubtract')) {
        e.preventDefault();
        setZoom(Math.max(0.25, zoom - 0.25));
        return;
      }

      // Arrow up/down - Navigate effects
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        if (!project?.effects.length) return;
        e.preventDefault();

        const currentIndex = selectedEffectId
          ? project.effects.findIndex((e) => e.id === selectedEffectId)
          : -1;

        let newIndex: number;
        if (e.code === 'ArrowUp') {
          newIndex = currentIndex <= 0 ? project.effects.length - 1 : currentIndex - 1;
        } else {
          newIndex = currentIndex >= project.effects.length - 1 ? 0 : currentIndex + 1;
        }

        selectEffect(project.effects[newIndex].id);
        return;
      }
    },
    [
      project,
      selectedEffectId,
      isPlaying,
      togglePlaying,
      removeEffect,
      duplicateEffect,
      selectEffect,
      toggleGrid,
      toggleFullscreen,
      setZoom,
      zoom,
      undo,
      redo,
      pastStates,
      futureStates,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Component version for use in layout
export function KeyboardShortcuts() {
  useKeyboardShortcuts();
  return null;
}
