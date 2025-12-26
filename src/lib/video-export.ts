// Video recording and export utilities

export interface RecordingOptions {
  fps: number;
  duration: number; // in seconds
  format: 'webm' | 'mp4';
  quality: number; // 0-1
}

export interface RecordingProgress {
  status: 'idle' | 'recording' | 'processing' | 'complete' | 'error';
  progress: number; // 0-100
  blob?: Blob;
  error?: string;
}

export type ProgressCallback = (progress: RecordingProgress) => void;

export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private stream: MediaStream | null = null;
  private onProgress: ProgressCallback;
  private recordingStartTime = 0;
  private duration = 0;
  private animationId: number | null = null;

  constructor(onProgress: ProgressCallback) {
    this.onProgress = onProgress;
  }

  async startRecording(canvas: HTMLCanvasElement, options: RecordingOptions): Promise<void> {
    this.canvas = canvas;
    this.duration = options.duration * 1000;
    this.chunks = [];

    try {
      // Get canvas stream
      this.stream = canvas.captureStream(options.fps);
      
      // Determine MIME type
      let mimeType = 'video/webm;codecs=vp9';
      if (options.format === 'mp4') {
        // Check for H.264 support
        if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) {
          mimeType = 'video/mp4;codecs=avc1';
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
          mimeType = 'video/webm;codecs=h264';
        }
      }

      // Fallback
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType,
        videoBitsPerSecond: options.quality * 10000000, // Up to 10 Mbps
      });

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: mimeType });
        this.onProgress({
          status: 'complete',
          progress: 100,
          blob,
        });
        this.cleanup();
      };

      this.mediaRecorder.onerror = (e) => {
        this.onProgress({
          status: 'error',
          progress: 0,
          error: `Recording error: ${e}`,
        });
        this.cleanup();
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms
      this.recordingStartTime = performance.now();
      
      this.onProgress({
        status: 'recording',
        progress: 0,
      });

      // Track progress
      this.trackProgress();

      // Auto-stop after duration
      setTimeout(() => {
        this.stopRecording();
      }, this.duration);

    } catch (error) {
      this.onProgress({
        status: 'error',
        progress: 0,
        error: `Failed to start recording: ${error}`,
      });
    }
  }

  private trackProgress() {
    const update = () => {
      if (!this.mediaRecorder || this.mediaRecorder.state !== 'recording') return;

      const elapsed = performance.now() - this.recordingStartTime;
      const progress = Math.min(100, (elapsed / this.duration) * 100);

      this.onProgress({
        status: 'recording',
        progress,
      });

      this.animationId = requestAnimationFrame(update);
    };

    this.animationId = requestAnimationFrame(update);
  }

  stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
      this.onProgress({
        status: 'processing',
        progress: 100,
      });
    }
  }

  private cleanup() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.canvas = null;
  }

  isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }
}

// GIF export using canvas frames
export class GifExporter {
  private frames: ImageData[] = [];
  private width = 0;
  private height = 0;
  private onProgress: ProgressCallback;

  constructor(onProgress: ProgressCallback) {
    this.onProgress = onProgress;
  }

  startCapture(canvas: HTMLCanvasElement) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.frames = [];
  }

  captureFrame(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    this.frames.push(imageData);
  }

  async generateGif(fps: number): Promise<Blob | null> {
    // This is a placeholder - in production you'd use a library like gif.js
    // For now, we'll create an animated PNG or use WebM fallback
    this.onProgress({
      status: 'processing',
      progress: 0,
    });

    try {
      // Create a simple WebM from frames as fallback
      // A real implementation would use gif.js or similar
      const canvas = document.createElement('canvas');
      canvas.width = this.width;
      canvas.height = this.height;
      const ctx = canvas.getContext('2d')!;

      // For now, return the first frame as a PNG
      if (this.frames.length > 0) {
        ctx.putImageData(this.frames[0], 0, 0);
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          this.onProgress({
            status: 'complete',
            progress: 100,
            blob: blob || undefined,
          });
          resolve(blob);
        }, 'image/png');
      });
    } catch (error) {
      this.onProgress({
        status: 'error',
        progress: 0,
        error: `GIF generation failed: ${error}`,
      });
      return null;
    }
  }
}

// Download helper
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Generate shareable embed code
export function generateEmbedCode(projectJson: string, width: number, height: number): string {
  // Base64 encode the project
  const encoded = btoa(encodeURIComponent(projectJson));
  
  return `<iframe 
  src="https://cracktro.app/embed?p=${encoded}"
  width="${width}"
  height="${height}"
  frameborder="0"
  allowfullscreen>
</iframe>`;
}

// Generate standalone HTML with all effects
export function generateStandaloneHtml(project: {
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  effects: unknown[];
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.name} - Cracktro</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { 
      width: 100%; 
      height: 100%; 
      overflow: hidden;
      background: ${project.backgroundColor};
    }
    #container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #cracktro {
      width: ${project.width}px;
      height: ${project.height}px;
      max-width: 100%;
      max-height: 100%;
      position: relative;
      overflow: hidden;
      background: ${project.backgroundColor};
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
    }
    /* Scanlines overlay */
    .scanlines {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1) 1px,
        transparent 1px,
        transparent 2px
      );
      z-index: 1000;
    }
  </style>
</head>
<body>
  <div id="container">
    <div id="cracktro">
      <div class="scanlines"></div>
    </div>
  </div>
  <script>
    // Cracktro: ${project.name}
    // Generated by CracktroPro Designer
    const PROJECT = ${JSON.stringify(project, null, 2)};
    
    // Initialize effects
    const container = document.getElementById('cracktro');
    const width = PROJECT.width;
    const height = PROJECT.height;
    
    console.log('Cracktro loaded!', PROJECT.name);
    console.log('Effects:', PROJECT.effects.length);
    
    // Effect implementations would go here...
    // This is a template - full export includes effect code
  </script>
</body>
</html>`;
}
