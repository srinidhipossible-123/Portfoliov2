/**
 * LightRays — React Bits (WebGL Shader Edition using OGL)
 *
 * Casts atmospheric volumetric light rays with amber/solar tint across
 * the dark background of the section.
 */
import { Renderer, Program, Triangle, Mesh } from 'ogl';

const hexToRgb = hex => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 0.55, 0];
};

const getAnchorAndDir = (origin, w, h) => {
    const outside = 0.2;
    switch (origin) {
        case 'top-left':
            return { anchor: [0, -outside * h], dir: [0, 1] };
        case 'top-right':
            return { anchor: [w, -outside * h], dir: [0, 1] };
        case 'left':
            return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
        case 'right':
            return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
        case 'bottom-left':
            return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
        case 'bottom-center':
            return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
        case 'bottom-right':
            return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
        default: // "top-center"
            return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
    }
};

export class LightRays {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) return;

        this.raysOrigin = options.raysOrigin || 'top-center';
        this.raysColor = options.raysColor || '#ff8c00';
        this.raysSpeed = options.raysSpeed ?? 1.2;
        this.lightSpread = options.lightSpread ?? 0.85;
        this.rayLength = options.rayLength ?? 1.8;
        this.pulsating = options.pulsating ?? true;
        this.fadeDistance = options.fadeDistance ?? 1.0;
        this.saturation = options.saturation ?? 1.0;
        this.followMouse = options.followMouse ?? true;
        this.mouseInfluence = options.mouseInfluence ?? 0.15;
        this.noiseAmount = options.noiseAmount ?? 0.04;
        this.distortion = options.distortion ?? 0.04;

        this.mouse = { x: 0.5, y: 0.5 };
        this.smoothMouse = { x: 0.5, y: 0.5 };
        this.animationId = null;

        this.init();
    }

    init() {
        this.renderer = new Renderer({
            dpr: Math.min(window.devicePixelRatio || 1, 2),
            alpha: true
        });

        const gl = this.renderer.gl;
        gl.canvas.style.width = '100%';
        gl.canvas.style.height = '100%';
        gl.canvas.style.position = 'absolute';
        gl.canvas.style.top = '0';
        gl.canvas.style.left = '0';
        gl.canvas.style.pointerEvents = 'none';
        gl.canvas.style.zIndex = '1';

        this.container.appendChild(gl.canvas);

        const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

        const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.85 + 0.15 * sin(iTime * speed * 2.5)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.55 + rays2 * 0.45;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.15 + brightness * 0.85;
  fragColor.y *= 0.35 + brightness * 0.65;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}`;

        this.uniforms = {
            iTime: { value: 0 },
            iResolution: { value: [1, 1] },
            rayPos: { value: [0, 0] },
            rayDir: { value: [0, 1] },
            raysColor: { value: hexToRgb(this.raysColor) },
            raysSpeed: { value: this.raysSpeed },
            lightSpread: { value: this.lightSpread },
            rayLength: { value: this.rayLength },
            pulsating: { value: this.pulsating ? 1.0 : 0.0 },
            fadeDistance: { value: this.fadeDistance },
            saturation: { value: this.saturation },
            mousePos: { value: [0.5, 0.5] },
            mouseInfluence: { value: this.mouseInfluence },
            noiseAmount: { value: this.noiseAmount },
            distortion: { value: this.distortion }
        };

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex: vert,
            fragment: frag,
            uniforms: this.uniforms
        });
        this.mesh = new Mesh(gl, { geometry, program });

        this.updatePlacement = () => {
            if (!this.container || !this.renderer) return;

            const wCSS = this.container.clientWidth || window.innerWidth;
            const hCSS = this.container.clientHeight || window.innerHeight;
            this.renderer.setSize(wCSS, hCSS);

            const dpr = this.renderer.dpr;
            const w = wCSS * dpr;
            const h = hCSS * dpr;

            this.uniforms.iResolution.value = [w, h];
            const { anchor, dir } = getAnchorAndDir(this.raysOrigin, w, h);
            this.uniforms.rayPos.value = anchor;
            this.uniforms.rayDir.value = dir;
        };

        window.addEventListener('resize', this.updatePlacement);
        this.updatePlacement();

        if (this.followMouse) {
            window.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                this.mouse = { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
            });
        }

        const loop = t => {
            if (!this.renderer || !this.mesh) return;

            this.uniforms.iTime.value = t * 0.001;

            if (this.followMouse && this.mouseInfluence > 0.0) {
                const smoothing = 0.92;
                this.smoothMouse.x = this.smoothMouse.x * smoothing + this.mouse.x * (1 - smoothing);
                this.smoothMouse.y = this.smoothMouse.y * smoothing + this.mouse.y * (1 - smoothing);
                this.uniforms.mousePos.value = [this.smoothMouse.x, this.smoothMouse.y];
            }

            try {
                this.renderer.render({ scene: this.mesh });
                this.animationId = requestAnimationFrame(loop);
            } catch (error) {
                return;
            }
        };

        this.animationId = requestAnimationFrame(loop);
    }

    destroy() {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        window.removeEventListener('resize', this.updatePlacement);
    }
}

export function initLightRays(container, options) {
    return new LightRays(container, options);
}

export default LightRays;
