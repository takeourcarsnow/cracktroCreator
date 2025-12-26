'use client';

import { useState } from 'react';
import { Plus, FolderOpen, Settings, Download, Upload } from 'lucide-react';
import { useEditorStore } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  Button,
  Input,
  Slider,
} from '@/components/ui';
import { ColorPicker } from '@/components/ui/color-picker';

export function ProjectManager() {
  const {
    project,
    projects,
    createProject,
    loadProject,
    deleteProject,
    updateProjectSettings,
  } = useEditorStore();

  const [newProjectName, setNewProjectName] = useState('New Cracktro');
  const [newProjectWidth, setNewProjectWidth] = useState(800);
  const [newProjectHeight, setNewProjectHeight] = useState(600);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showOpenDialog, setShowOpenDialog] = useState(false);

  const handleCreateProject = () => {
    createProject(newProjectName, newProjectWidth, newProjectHeight);
    setShowNewDialog(false);
    setNewProjectName('New Cracktro');
  };

  const handleExport = () => {
    if (!project) return;
    const data = JSON.stringify(project, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        loadProject(data);
      } catch (err) {
        console.error('Failed to import project:', err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center gap-2">
      {/* New Project */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up your new cracktro project
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name</label>
              <Input
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Width</label>
                <Input
                  type="number"
                  value={newProjectWidth}
                  onChange={(e) => setNewProjectWidth(parseInt(e.target.value) || 800)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Height</label>
                <Input
                  type="number"
                  value={newProjectHeight}
                  onChange={(e) => setNewProjectHeight(parseInt(e.target.value) || 600)}
                />
              </div>
            </div>
            <Button onClick={handleCreateProject} className="w-full">
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Open Project */}
      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Open</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open Project</DialogTitle>
            <DialogDescription>
              Select a saved project to open
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 pt-4 max-h-[300px] overflow-y-auto">
            {projects.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No saved projects yet
              </p>
            ) : (
              projects.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      {p.width}x{p.height} • {p.effects.length} effects
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        loadProject(p);
                        setShowOpenDialog(false);
                      }}
                    >
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => deleteProject(p.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <label className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 transition-colors">
                <Upload className="w-4 h-4" />
                <span>Import from file</span>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </DialogContent>
      </Dialog>

      {/* Project Settings */}
      {project && (
        <>
          <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Project Settings</DialogTitle>
                <DialogDescription>
                  Configure your project settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    value={project.name}
                    onChange={(e) => updateProjectSettings({ name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Width</label>
                    <Input
                      type="number"
                      value={project.width}
                      onChange={(e) =>
                        updateProjectSettings({ width: parseInt(e.target.value) || 800 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Height</label>
                    <Input
                      type="number"
                      value={project.height}
                      onChange={(e) =>
                        updateProjectSettings({ height: parseInt(e.target.value) || 600 })
                      }
                    />
                  </div>
                </div>
                <ColorPicker
                  label="Background Color"
                  value={project.backgroundColor}
                  onChange={(color) => updateProjectSettings({ backgroundColor: color })}
                />
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="secondary" size="sm" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </>
      )}
    </div>
  );
}
