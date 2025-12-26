// Audio analyzer for beat detection and reactive effects

export interface AudioAnalysis {
  volume: number;
  bass: number;
  mid: number;
  high: number;
  beat: boolean;
  beatIntensity: number;
  frequencies: Uint8Array;
  waveform: Uint8Array;
}

export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private frequencyData: Uint8Array<ArrayBuffer> | null = null;
  private waveformData: Uint8Array<ArrayBuffer> | null = null;
  private lastBeatTime = 0;
  private beatThreshold = 0.6;
  private beatCooldown = 100; // ms
  private energyHistory: number[] = [];
  private historyLength = 43; // ~1 second at 60fps

  async initialize(audioElement: HTMLAudioElement): Promise<boolean> {
    try {
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.8;
      
      this.source = this.audioContext.createMediaElementSource(audioElement);
      this.source.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
      
      const bufferLength = this.analyser.frequencyBinCount;
      this.frequencyData = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;
      this.waveformData = new Uint8Array(bufferLength) as Uint8Array<ArrayBuffer>;
      
      return true;
    } catch (error) {
      console.error('Failed to initialize audio analyzer:', error);
      return false;
    }
  }

  analyze(): AudioAnalysis {
    if (!this.analyser || !this.frequencyData || !this.waveformData) {
      return {
        volume: 0,
        bass: 0,
        mid: 0,
        high: 0,
        beat: false,
        beatIntensity: 0,
        frequencies: new Uint8Array(0),
        waveform: new Uint8Array(0),
      };
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.analyser.getByteTimeDomainData(this.waveformData);

    // Calculate frequency bands
    const bufferLength = this.frequencyData.length;
    const bassEnd = Math.floor(bufferLength * 0.1);
    const midEnd = Math.floor(bufferLength * 0.5);

    let bassSum = 0;
    let midSum = 0;
    let highSum = 0;
    let totalSum = 0;

    for (let i = 0; i < bufferLength; i++) {
      const value = this.frequencyData[i] / 255;
      totalSum += value;
      
      if (i < bassEnd) {
        bassSum += value;
      } else if (i < midEnd) {
        midSum += value;
      } else {
        highSum += value;
      }
    }

    const bass = bassSum / bassEnd;
    const mid = midSum / (midEnd - bassEnd);
    const high = highSum / (bufferLength - midEnd);
    const volume = totalSum / bufferLength;

    // Beat detection using energy comparison
    const currentEnergy = bass * 2 + mid; // Weight bass more heavily
    this.energyHistory.push(currentEnergy);
    if (this.energyHistory.length > this.historyLength) {
      this.energyHistory.shift();
    }

    const averageEnergy = this.energyHistory.reduce((a, b) => a + b, 0) / this.energyHistory.length;
    const now = performance.now();
    const beat = currentEnergy > averageEnergy * (1 + this.beatThreshold) && 
                 now - this.lastBeatTime > this.beatCooldown;

    if (beat) {
      this.lastBeatTime = now;
    }

    const beatIntensity = Math.min(1, (currentEnergy / averageEnergy - 1) / this.beatThreshold);

    return {
      volume,
      bass,
      mid,
      high,
      beat,
      beatIntensity: Math.max(0, beatIntensity),
      frequencies: this.frequencyData,
      waveform: this.waveformData,
    };
  }

  setBeatSensitivity(sensitivity: number) {
    // sensitivity: 0-1, where higher = more sensitive
    this.beatThreshold = 1 - sensitivity * 0.5;
    this.beatCooldown = 50 + (1 - sensitivity) * 150;
  }

  resume() {
    if (this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  disconnect() {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Global audio analyzer instance
let globalAnalyzer: AudioAnalyzer | null = null;
let lastAnalysis: AudioAnalysis = {
  volume: 0,
  bass: 0,
  mid: 0,
  high: 0,
  beat: false,
  beatIntensity: 0,
  frequencies: new Uint8Array(0),
  waveform: new Uint8Array(0),
};

export function getGlobalAnalyzer(): AudioAnalyzer {
  if (!globalAnalyzer) {
    globalAnalyzer = new AudioAnalyzer();
  }
  return globalAnalyzer;
}

export function getLastAudioAnalysis(): AudioAnalysis {
  return lastAnalysis;
}

export function updateAudioAnalysis(): AudioAnalysis {
  if (globalAnalyzer) {
    lastAnalysis = globalAnalyzer.analyze();
  }
  return lastAnalysis;
}
