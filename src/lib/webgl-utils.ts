// WebGL utilities for high-performance effect rendering

export interface WebGLContext {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  positionBuffer: WebGLBuffer;
  uniforms: Record<string, WebGLUniformLocation>;
}

// Common vertex shader for fullscreen quad
export const FULLSCREEN_VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_texCoord;
  
  void main() {
    v_texCoord = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Checkerboard fragment shader - MUCH faster than pixel-by-pixel
export const CHECKERBOARD_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_tileSize;
  uniform float u_perspective;
  uniform float u_yOffset;
  uniform float u_scrollSpeed;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    
    float horizon = u_yOffset;
    
    if (uv.y < horizon) {
      discard;
    }
    
    float floorY = (uv.y - horizon) / (1.0 - horizon);
    float z = u_perspective / (floorY + 0.001) + u_time * u_scrollSpeed;
    float x = (uv.x - 0.5) * z;
    
    float tileX = floor(x / u_tileSize);
    float tileZ = floor(z / u_tileSize);
    
    float checker = mod(tileX + tileZ, 2.0);
    
    vec3 color = mix(u_color2, u_color1, checker);
    
    // Fog effect near horizon
    float fog = smoothstep(0.0, 0.1, floorY);
    color *= fog;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Plasma fragment shader
export const PLASMA_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_scale;
  uniform float u_intensity;
  uniform vec3 u_colors[8];
  uniform int u_colorCount;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 p = uv * u_scale * 10.0;
    
    float v = sin(p.x + u_time);
    v += sin(p.y + u_time);
    v += sin(p.x + p.y + u_time);
    v += sin(sqrt(p.x * p.x + p.y * p.y) + u_time);
    
    v = (v + 4.0) / 8.0;
    
    int idx = int(v * float(u_colorCount - 1));
    int nextIdx = min(idx + 1, u_colorCount - 1);
    float t = fract(v * float(u_colorCount - 1));
    
    vec3 color = mix(u_colors[idx], u_colors[nextIdx], t);
    
    gl_FragColor = vec4(color, u_intensity);
  }
`;

// Rotozoom fragment shader
export const ROTOZOOM_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_rotationSpeed;
  uniform float u_zoomSpeed;
  uniform float u_scale;
  uniform int u_pattern;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 center = vec2(0.5, 0.5);
    vec2 p = uv - center;
    
    float rotation = u_time * u_rotationSpeed;
    float zoom = 1.0 + sin(u_time * u_zoomSpeed) * 0.5;
    float scale = u_scale * zoom;
    
    float c = cos(rotation);
    float s = sin(rotation);
    vec2 rotated = vec2(
      p.x * c - p.y * s,
      p.x * s + p.y * c
    ) / scale * 100.0;
    
    float value = 0.0;
    
    if (u_pattern == 0) { // checkerboard
      value = mod(floor(rotated.x / 20.0) + floor(rotated.y / 20.0), 2.0);
    } else if (u_pattern == 1) { // stripes
      value = mod(floor(rotated.x / 15.0), 2.0);
    } else if (u_pattern == 2) { // dots
      vec2 dotP = mod(rotated, 30.0);
      value = (dotP.x * dotP.x + dotP.y * dotP.y < 100.0) ? 1.0 : 0.0;
    } else { // custom
      value = (sin(rotated.x / 10.0) * cos(rotated.y / 10.0) > 0.0) ? 1.0 : 0.0;
    }
    
    vec3 color = mix(u_color2, u_color1, value);
    gl_FragColor = vec4(color, 1.0);
  }
`;

// Metaballs fragment shader
export const METABALLS_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform vec2 u_balls[10];
  uniform float u_radii[10];
  uniform int u_ballCount;
  uniform float u_threshold;
  uniform vec3 u_colors[8];
  uniform int u_colorCount;
  
  void main() {
    vec2 uv = gl_FragCoord.xy;
    float sum = 0.0;
    
    for (int i = 0; i < 10; i++) {
      if (i >= u_ballCount) break;
      vec2 d = uv - u_balls[i];
      float dist = length(d);
      sum += (u_radii[i] * u_radii[i]) / (dist * dist + 1.0);
    }
    
    if (sum < u_threshold) {
      discard;
    }
    
    float intensity = (sum - u_threshold) / u_threshold;
    int idx = int(min(intensity, 1.0) * float(u_colorCount - 1));
    vec3 color = u_colors[min(idx, u_colorCount - 1)];
    float alpha = min(1.0, intensity);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

// Tunnel fragment shader
export const TUNNEL_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_speed;
  uniform float u_rotation;
  uniform int u_ringCount;
  uniform vec3 u_colors[8];
  uniform int u_colorCount;
  
  void main() {
    vec2 uv = (gl_FragCoord.xy - u_resolution * 0.5) / min(u_resolution.x, u_resolution.y);
    
    float angle = atan(uv.y, uv.x) + u_time * u_rotation * 0.01;
    float radius = length(uv);
    
    float tunnel = 1.0 / (radius + 0.1) + u_time * u_speed * 0.1;
    
    float ring = mod(tunnel, 1.0);
    float segment = mod(angle * 3.0 / 3.14159, 1.0);
    
    int colorIdx = int(mod(floor(tunnel), float(u_colorCount)));
    vec3 color = u_colors[colorIdx];
    
    float fade = 1.0 - smoothstep(0.0, 2.0, radius);
    
    gl_FragColor = vec4(color * fade, fade);
  }
`;

// Fire fragment shader
export const FIRE_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_intensity;
  uniform float u_speed;
  uniform float u_height;
  uniform vec3 u_colors[8];
  uniform int u_colorCount;
  
  // Simple noise function
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * smoothNoise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    
    float fireHeight = u_height / u_resolution.y;
    float fireStart = 1.0 - fireHeight;
    
    if (uv.y < fireStart) {
      discard;
    }
    
    vec2 p = uv;
    p.y = (uv.y - fireStart) / fireHeight;
    p.x *= u_resolution.x / u_resolution.y;
    
    float n = fbm(vec2(p.x * 4.0, p.y * 2.0 - u_time * u_speed));
    n += fbm(vec2(p.x * 8.0, p.y * 4.0 - u_time * u_speed * 1.5)) * 0.5;
    
    float fire = n * u_intensity * (1.0 - p.y);
    fire = clamp(fire, 0.0, 1.0);
    
    int idx = int(fire * float(u_colorCount - 1));
    vec3 color = u_colors[min(idx, u_colorCount - 1)];
    
    gl_FragColor = vec4(color, fire > 0.1 ? 1.0 : 0.0);
  }
`;

// VHS/CRT effect fragment shader (new effect)
export const VHS_FRAGMENT_SHADER = `
  precision highp float;
  
  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_scanlineIntensity;
  uniform float u_noiseIntensity;
  uniform float u_rgbShift;
  uniform float u_distortion;
  uniform sampler2D u_texture;
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    
    // CRT curvature
    vec2 curved = uv - 0.5;
    curved *= 1.0 + dot(curved, curved) * u_distortion * 0.1;
    curved += 0.5;
    
    // Scanlines
    float scanline = sin(curved.y * u_resolution.y * 2.0) * 0.5 + 0.5;
    scanline = pow(scanline, 0.5) * u_scanlineIntensity;
    
    // RGB shift
    float shift = u_rgbShift * 0.01;
    float r = texture2D(u_texture, curved + vec2(shift, 0.0)).r;
    float g = texture2D(u_texture, curved).g;
    float b = texture2D(u_texture, curved - vec2(shift, 0.0)).b;
    
    vec3 color = vec3(r, g, b);
    
    // Noise
    float n = noise(uv * u_time * 100.0) * u_noiseIntensity;
    color += vec3(n);
    
    // Apply scanlines
    color *= (1.0 - scanline * 0.3);
    
    // Vignette
    float vignette = 1.0 - dot(curved - 0.5, curved - 0.5) * 1.5;
    color *= vignette;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  return shader;
}

export function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  
  if (!vertexShader || !fragmentShader) return null;
  
  const program = gl.createProgram();
  if (!program) return null;
  
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  
  return program;
}

export function initWebGL(canvas: HTMLCanvasElement, fragmentShader: string): WebGLContext | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: false,
  });
  
  if (!gl) return null;
  
  const program = createProgram(gl, FULLSCREEN_VERTEX_SHADER, fragmentShader);
  if (!program) return null;
  
  // Create fullscreen quad
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) return null;
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,
    1, -1,
    -1, 1,
    1, 1,
  ]), gl.STATIC_DRAW);
  
  return { gl, program, positionBuffer, uniforms: {} };
}

export function getUniformLocation(ctx: WebGLContext, name: string): WebGLUniformLocation | null {
  if (!ctx.uniforms[name]) {
    const loc = ctx.gl.getUniformLocation(ctx.program, name);
    if (loc) ctx.uniforms[name] = loc;
  }
  return ctx.uniforms[name] || null;
}

export function renderWebGL(ctx: WebGLContext) {
  const { gl, program, positionBuffer } = ctx;
  
  gl.useProgram(program);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positionLoc = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLoc);
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
  
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export function hexToVec3(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
}
