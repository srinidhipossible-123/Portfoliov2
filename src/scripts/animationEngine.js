/**
 * Animation Engine — High-Performance Image Sequence Streamer
 * Handles full-screen image sequence rendering with canvas cover math,
 * progressive chunked WebP loading, memory-safe frame cache,
 * and viewport-based RAF pausing via IntersectionObserver.
 */

export class AnimationEngine {
    constructor(canvasId, frameCount = 240) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d', { alpha: false });
        this.frameCount = frameCount;
        this.images = new Array(frameCount);
        this.loadedCount = 0;
        this.currentFrame = 1;
        this.targetFrame = 1;
        this.lastRenderedFrame = -1;
        this.inView = true;
        this.animating = false;
        this.rafId = null;

        this.resize();
        this.initObserver();
        this.init();
    }

    getFrameSrc(i) {
        const paddedIndex = i.toString().padStart(3, '0');
        return `/frames/frame-${paddedIndex}.webp`;
    }

    loadFrame(i, highPriority = false) {
        if (i < 1 || i > this.frameCount) return null;
        const idx = i - 1;
        if (this.images[idx]) return this.images[idx];

        const img = new Image();
        if (highPriority) {
            img.fetchPriority = 'high';
        }
        img.src = this.getFrameSrc(i);
        this.images[idx] = img;

        img.onload = () => {
            this.loadedCount++;
            if (this.loadedCount === 1) {
                this.resize();
                this.renderFrame(1);
            } else if (Math.round(this.currentFrame) === i) {
                this.renderFrame(i);
            }
        };

        return img;
    }

    initObserver() {
        const hero = document.getElementById('heroContainer') || this.canvas;
        if (!window.IntersectionObserver) return;

        this.io = new IntersectionObserver((entries) => {
            const entry = entries[0];
            this.inView = entry ? entry.isIntersecting : true;
            if (this.inView) {
                this.startLoop();
            } else {
                this.stopLoop();
            }
        }, { threshold: 0.01 });

        this.io.observe(hero);
    }

    init() {
        // 1. Immediately load frame 1 for instant first paint
        this.loadFrame(1, true);

        // 2. Preload the first critical interactive cluster (frames 2 to 25)
        for (let i = 2; i <= Math.min(25, this.frameCount); i++) {
            this.loadFrame(i);
        }

        // 3. Progressively load subsequent frames in idle batches
        this.startProgressivePreload(26);

        window.addEventListener('resize', () => this.resize(), { passive: true });
        this.startLoop();
    }

    startProgressivePreload(startIdx) {
        let currentIdx = startIdx;
        const batchSize = 12;

        const scheduleBatch = () => {
            if (currentIdx > this.frameCount) return;

            const end = Math.min(currentIdx + batchSize, this.frameCount + 1);
            for (let i = currentIdx; i < end; i++) {
                this.loadFrame(i);
            }
            currentIdx = end;

            if (currentIdx <= this.frameCount) {
                if ('requestIdleCallback' in window) {
                    window.requestIdleCallback(scheduleBatch, { timeout: 120 });
                } else {
                    setTimeout(scheduleBatch, 60);
                }
            }
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(scheduleBatch, { timeout: 150 });
        } else {
            setTimeout(scheduleBatch, 100);
        }
    }

    resize() {
        if (!this.canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = Math.round(window.innerWidth * dpr);
        this.canvas.height = Math.round(window.innerHeight * dpr);
        this.renderFrame(Math.round(this.currentFrame));
    }

    renderFrame(idx) {
        if (!this.ctx || !this.canvas) return;
        idx = Math.max(1, Math.min(this.frameCount, idx));

        // Find nearest loaded frame if current target isn't loaded yet
        let img = this.images[idx - 1];
        if (!img || !img.complete || img.naturalWidth === 0) {
            this.loadFrame(idx, true);
            // Scan backwards and forwards for nearest loaded fallback
            for (let offset = 1; offset <= 20; offset++) {
                const prev = this.images[idx - 1 - offset];
                if (prev && prev.complete && prev.naturalWidth > 0) {
                    img = prev;
                    break;
                }
                const next = this.images[idx - 1 + offset];
                if (next && next.complete && next.naturalWidth > 0) {
                    img = next;
                    break;
                }
            }
        }

        if (!img || !img.complete || img.naturalWidth === 0) return;

        const cw = this.canvas.width;
        const ch = this.canvas.height;
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const nw = img.naturalWidth * scale;
        const nh = img.naturalHeight * scale;
        const x = (cw - nw) * 0.5;
        const y = (ch - nh) * 0.5;

        this.ctx.drawImage(img, x, y, nw, nh);
        this.lastRenderedFrame = idx;
    }

    setTargetFrame(frameIndex) {
        const clamped = Math.max(1, Math.min(this.frameCount, frameIndex));
        if (this.targetFrame !== clamped) {
            this.targetFrame = clamped;
            // Eagerly ensure this frame and adjacent neighbors are loading
            this.loadFrame(this.targetFrame, true);
            this.loadFrame(this.targetFrame + 1);
            this.loadFrame(this.targetFrame - 1);
            this.startLoop();
        }
    }

    startLoop() {
        if (this.animating || !this.inView) return;
        this.animating = true;

        const animate = () => {
            if (!this.inView) {
                this.animating = false;
                return;
            }

            const diff = this.targetFrame - this.currentFrame;
            if (Math.abs(diff) > 0.05) {
                this.currentFrame += diff * 0.28;
                if (Math.abs(this.targetFrame - this.currentFrame) < 0.2) {
                    this.currentFrame = this.targetFrame;
                }
                const rounded = Math.round(this.currentFrame);
                if (rounded !== this.lastRenderedFrame) {
                    this.renderFrame(rounded);
                }
                this.rafId = requestAnimationFrame(animate);
            } else {
                this.currentFrame = this.targetFrame;
                this.renderFrame(Math.round(this.currentFrame));
                this.animating = false;
            }
        };

        this.rafId = requestAnimationFrame(animate);
    }

    stopLoop() {
        this.animating = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }
}
