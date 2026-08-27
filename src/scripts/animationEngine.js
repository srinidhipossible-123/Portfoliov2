/**
 * Animation Engine
 * Handles full-screen image sequence rendering with canvas cover math and smooth linear interpolation.
 */

export class AnimationEngine {
    constructor(canvasId, frameCount = 240) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.frameCount = frameCount;
        this.images = [];
        this.loadedCount = 0;
        this.currentFrame = 1;
        this.targetFrame = 1;

        this.resize();
        this.init();
    }

    getFrameSrc(i) {
        const paddedIndex = i.toString().padStart(3, '0');
        return `/ezgif-47aecf931165e490-png-split/ezgif-frame-${paddedIndex}.png`;
    }

    init() {
        // Preload frames
        for (let i = 1; i <= this.frameCount; i++) {
            const img = new Image();
            img.src = this.getFrameSrc(i);
            this.images.push(img);
            img.onload = () => {
                this.loadedCount++;
                if (this.loadedCount === 1) {
                    this.resize();
                    this.renderFrame(1);
                }
            };
        }

        window.addEventListener('resize', () => this.resize());
        this.startLoop();
    }

    resize() {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.renderFrame(Math.round(this.currentFrame));
    }

    renderFrame(idx) {
        const img = this.images[idx - 1];
        if (!img || !img.complete) return;

        const scale = Math.max(this.canvas.width / img.width, this.canvas.height / img.height);
        const x = (this.canvas.width - img.width * scale) / 2;
        const y = (this.canvas.height - img.height * scale) / 2;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    setTargetFrame(frameIndex) {
        this.targetFrame = Math.max(1, Math.min(this.frameCount, frameIndex));
    }

    startLoop() {
        const animate = () => {
            if (Math.abs(this.currentFrame - this.targetFrame) > 0.1) {
                this.currentFrame += (this.targetFrame - this.currentFrame) * 0.1;
                if (Math.abs(this.targetFrame - this.currentFrame) < 0.5) {
                    this.currentFrame = this.targetFrame;
                }
                this.renderFrame(Math.round(this.currentFrame));
            }
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }
}
