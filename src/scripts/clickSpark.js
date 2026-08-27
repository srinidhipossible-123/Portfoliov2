/**
 * ClickSpark — React Bits (JavaScript + Canvas Edition)
 *
 * Emits radial spark lines upon user click with configurable easing, radius,
 * count, color, and duration.
 */

export class ClickSpark {
    constructor(options = {}) {
        this.sparkColor = options.sparkColor ?? '#fff';
        this.sparkSize = options.sparkSize ?? 10;
        this.sparkRadius = options.sparkRadius ?? 15;
        this.sparkCount = options.sparkCount ?? 8;
        this.duration = options.duration ?? 400;
        this.easing = options.easing ?? 'ease-out';
        this.extraScale = options.extraScale ?? 1.0;
        this.target = options.target ?? 'global';

        this.sparks = [];
        this.animationId = null;
        this.canvas = null;
        this.ctx = null;
        this.container = null;

        this.init();
    }

    getEaseFunc(easing) {
        switch (easing) {
            case 'linear':
                return t => t;
            case 'ease-in':
                return t => t * t;
            case 'ease-in-out':
                return t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
            case 'ease-out':
            default:
                return t => t * (2 - t);
        }
    }

    init() {
        this.easeFunc = this.getEaseFunc(this.easing);

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'click-spark-canvas';

        if (this.target === 'global' || !this.target || this.target === document.body) {
            this.container = document.body;
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
            this.canvas.style.zIndex = '99999';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.userSelect = 'none';
            document.body.appendChild(this.canvas);

            window.addEventListener('resize', () => this.resize());
            window.addEventListener('click', e => this.handleClick(e));
        } else {
            this.container = typeof this.target === 'string'
                ? document.querySelector(this.target)
                : this.target;

            if (!this.container) return;

            const computedPos = window.getComputedStyle(this.container).position;
            if (computedPos === 'static') {
                this.container.style.position = 'relative';
            }

            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.userSelect = 'none';
            this.container.appendChild(this.canvas);

            if (window.ResizeObserver) {
                const ro = new ResizeObserver(() => this.resize());
                ro.observe(this.container);
            } else {
                window.addEventListener('resize', () => this.resize());
            }

            this.container.addEventListener('click', e => this.handleClick(e));
        }

        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = Math.round(rect.width * dpr);
        this.canvas.height = Math.round(rect.height * dpr);
        this.dpr = dpr;
    }

    handleClick(e) {
        if (!this.canvas) return;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const now = performance.now();
        const newSparks = Array.from({ length: this.sparkCount }, (_, i) => ({
            x,
            y,
            angle: (2 * Math.PI * i) / this.sparkCount,
            startTime: now,
        }));

        this.sparks.push(...newSparks);

        if (!this.animationId) {
            this.animationId = requestAnimationFrame(timestamp => this.draw(timestamp));
        }
    }

    draw(timestamp) {
        if (!this.ctx || !this.canvas) return;

        const dpr = this.dpr || 1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.sparks = this.sparks.filter(spark => {
            const elapsed = timestamp - spark.startTime;
            if (elapsed >= this.duration) {
                return false;
            }

            const progress = elapsed / this.duration;
            const eased = this.easeFunc(progress);

            const distance = eased * this.sparkRadius * this.extraScale;
            const lineLength = this.sparkSize * (1 - eased);

            const x1 = (spark.x + distance * Math.cos(spark.angle)) * dpr;
            const y1 = (spark.y + distance * Math.sin(spark.angle)) * dpr;
            const x2 = (spark.x + (distance + lineLength) * Math.cos(spark.angle)) * dpr;
            const y2 = (spark.y + (distance + lineLength) * Math.sin(spark.angle)) * dpr;

            this.ctx.strokeStyle = this.sparkColor;
            this.ctx.lineWidth = 2 * dpr;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();

            return true;
        });

        if (this.sparks.length > 0) {
            this.animationId = requestAnimationFrame(ts => this.draw(ts));
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.animationId = null;
        }
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
    }
}

export default ClickSpark;
