'use client';

import { useState, useCallback } from 'react';
import { Upload, FileJson, AlertCircle } from 'lucide-react';
import { useEditorStore } from '@/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button, Textarea } from '@/components/ui';

export function ImportDialog() {
  const { importProject } = useEditorStore();
  const [json, setJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleImport = useCallback(() => {
    setError(null);
    const success = importProject(json);
    if (success) {
      setJson('');
      setOpen(false);
    } else {
      setError('Invalid project JSON. Please check the format and try again.');
    }
  }, [json, importProject]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJson(content);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="w-4 h-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Import Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* File upload */}
          <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <FileJson className="w-10 h-10 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Drop a JSON file here or click to browse
            </p>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" size="sm" asChild>
                <span>Choose File</span>
              </Button>
            </label>
          </div>

          {/* Or paste JSON */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                Or paste JSON
              </span>
            </div>
          </div>

          <Textarea
            value={json}
            onChange={(e) => {
              setJson(e.target.value);
              setError(null);
            }}
            placeholder='{"id": "...", "name": "My Project", ...}'
            className="min-h-[150px] font-mono text-xs"
          />

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!json.trim()}>
              Import Project
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
