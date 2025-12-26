import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { v4 as uuidv4 } from 'uuid';
import type { Project, Effect, EffectType, EffectPreset } from '@/types';
import { createDefaultEffect, duplicateEffect } from '@/lib/effects-factory';

interface EditorStore {
  // Project state
  project: Project | null;
  projects: Project[];
  
  // Editor state
  selectedEffectId: string | null;
  isPlaying: boolean;
  zoom: number;
  showGrid: boolean;
  isFullscreen: boolean;
  
  // Effect presets
  presets: EffectPreset[];
  
  // Project actions
  createProject: (name: string, width?: number, height?: number) => void;
  loadProject: (project: Project) => void;
  saveProject: () => void;
  deleteProject: (id: string) => void;
  updateProjectSettings: (updates: Partial<Pick<Project, 'name' | 'width' | 'height' | 'backgroundColor'>>) => void;
  
  // Effect actions
  addEffect: (type: EffectType) => void;
  removeEffect: (id: string) => void;
  updateEffect: (id: string, updates: Partial<Effect>) => void;
  duplicateEffect: (id: string) => void;
  reorderEffects: (fromIndex: number, toIndex: number) => void;
  toggleEffectEnabled: (id: string) => void;
  
  // Selection actions
  selectEffect: (id: string | null) => void;
  
  // Playback actions
  togglePlaying: () => void;
  setPlaying: (playing: boolean) => void;
  
  // View actions
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  toggleFullscreen: () => void;
  
  // Preset actions
  savePreset: (name: string, effectId: string) => void;
  loadPreset: (presetId: string) => void;
  deletePreset: (presetId: string) => void;
  
  // Import/Export
  exportProject: () => string;
  importProject: (json: string) => boolean;
}

const DEFAULT_PROJECT: Project = {
  id: uuidv4(),
  name: 'Untitled Project',
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  effects: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useEditorStore = create<EditorStore>()(
  temporal(
    persist(
      (set, get) => ({
        project: null,
        projects: [],
        selectedEffectId: null,
        isPlaying: true,
        zoom: 1,
        showGrid: false,
        isFullscreen: false,
        presets: [],

        createProject: (name, width = 800, height = 600) => {
          const newProject: Project = {
            id: uuidv4(),
            name,
            width,
            height,
            backgroundColor: '#000000',
            effects: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set((state) => ({
            project: newProject,
            projects: [...state.projects, newProject],
            selectedEffectId: null,
          }));
        },

        loadProject: (project) => {
          set({
            project,
            selectedEffectId: null,
          });
        },

        saveProject: () => {
          const { project, projects } = get();
          if (!project) return;
          
          const updatedProject = {
            ...project,
            updatedAt: new Date(),
          };
          
          set({
            project: updatedProject,
            projects: projects.map((p) =>
              p.id === updatedProject.id ? updatedProject : p
            ),
          });
        },

        deleteProject: (id) => {
          set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
            project: state.project?.id === id ? null : state.project,
          }));
        },

        updateProjectSettings: (updates) => {
          set((state) => {
            if (!state.project) return state;
            return {
              project: {
                ...state.project,
                ...updates,
                updatedAt: new Date(),
              },
            };
          });
        },

        addEffect: (type) => {
          const effect = createDefaultEffect(type);
          set((state) => {
            if (!state.project) return state;
            const maxZIndex = Math.max(...state.project.effects.map((e) => e.zIndex), -1);
            return {
              project: {
                ...state.project,
                effects: [...state.project.effects, { ...effect, zIndex: maxZIndex + 1 }],
                updatedAt: new Date(),
              },
              selectedEffectId: effect.id,
            };
          });
        },

        removeEffect: (id) => {
          set((state) => {
            if (!state.project) return state;
            return {
              project: {
                ...state.project,
                effects: state.project.effects.filter((e) => e.id !== id),
                updatedAt: new Date(),
              },
              selectedEffectId: state.selectedEffectId === id ? null : state.selectedEffectId,
            };
          });
        },

        updateEffect: (id, updates) => {
          set((state) => {
            if (!state.project) return state;
            return {
              project: {
                ...state.project,
                effects: state.project.effects.map((e) =>
                  e.id === id ? { ...e, ...updates } as Effect : e
                ),
                updatedAt: new Date(),
              },
            };
          });
        },

        duplicateEffect: (id) => {
          set((state) => {
            if (!state.project) return state;
            const effectToDuplicate = state.project.effects.find((e) => e.id === id);
            if (!effectToDuplicate) return state;
            
            const newEffect = duplicateEffect(effectToDuplicate);
            return {
              project: {
                ...state.project,
                effects: [...state.project.effects, newEffect],
                updatedAt: new Date(),
              },
              selectedEffectId: newEffect.id,
            };
          });
        },

        reorderEffects: (fromIndex, toIndex) => {
          set((state) => {
            if (!state.project) return state;
            const effects = [...state.project.effects];
            const [removed] = effects.splice(fromIndex, 1);
            effects.splice(toIndex, 0, removed);
            
            // Update z-indices
            const updatedEffects = effects.map((effect, index) => ({
              ...effect,
              zIndex: index,
            }));
            
            return {
              project: {
                ...state.project,
                effects: updatedEffects,
                updatedAt: new Date(),
              },
            };
          });
        },

        toggleEffectEnabled: (id) => {
          set((state) => {
            if (!state.project) return state;
            return {
              project: {
                ...state.project,
                effects: state.project.effects.map((e) =>
                  e.id === id ? { ...e, enabled: !e.enabled } : e
                ),
                updatedAt: new Date(),
              },
            };
          });
        },

        selectEffect: (id) => {
          set({ selectedEffectId: id });
        },

        togglePlaying: () => {
          set((state) => ({ isPlaying: !state.isPlaying }));
        },

        setPlaying: (playing) => {
          set({ isPlaying: playing });
        },

        setZoom: (zoom) => {
          set({ zoom: Math.max(0.25, Math.min(2, zoom)) });
        },

        toggleGrid: () => {
          set((state) => ({ showGrid: !state.showGrid }));
        },

        toggleFullscreen: () => {
          set((state) => ({ isFullscreen: !state.isFullscreen }));
        },

        savePreset: (name, effectId) => {
          const { project, presets } = get();
          const effect = project?.effects.find((e) => e.id === effectId);
          if (!effect) return;

          const preset: EffectPreset = {
            id: uuidv4(),
            name,
            effectType: effect.type,
            properties: { ...effect },
            createdAt: new Date(),
          };

          set({ presets: [...presets, preset] });
        },

        loadPreset: (presetId) => {
          const { presets, selectedEffectId, project } = get();
          const preset = presets.find((p) => p.id === presetId);
          if (!preset || !selectedEffectId || !project) return;

          const effect = project.effects.find((e) => e.id === selectedEffectId);
          if (!effect || effect.type !== preset.effectType) return;

          set((state) => {
            if (!state.project) return state;
            return {
              project: {
                ...state.project,
                effects: state.project.effects.map((e) =>
                  e.id === selectedEffectId
                    ? ({ ...e, ...preset.properties, id: e.id, name: e.name } as Effect)
                    : e
                ),
                updatedAt: new Date(),
              },
            };
          });
        },

        deletePreset: (presetId) => {
          set((state) => ({
            presets: state.presets.filter((p) => p.id !== presetId),
          }));
        },

        exportProject: () => {
          const { project } = get();
          if (!project) return '';
          return JSON.stringify(project, null, 2);
        },

        importProject: (json) => {
          try {
            const project = JSON.parse(json) as Project;
            project.id = uuidv4();
            project.createdAt = new Date();
            project.updatedAt = new Date();
            
            set((state) => ({
              project,
              projects: [...state.projects, project],
              selectedEffectId: null,
            }));
            return true;
          } catch {
            return false;
          }
        },
      }),
      {
        name: 'cracktro-editor-storage',
        partialize: (state) => ({
          projects: state.projects,
          zoom: state.zoom,
          showGrid: state.showGrid,
          presets: state.presets,
        }),
      }
    ),
    {
      limit: 50,
      partialize: (state) => {
        // Only track changes to project for undo/redo
        const { project } = state;
        return { project };
      },
    }
  )
);

// Export temporal store for undo/redo hooks
export const useTemporalStore = () => useEditorStore.temporal.getState();
