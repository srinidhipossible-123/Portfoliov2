/**
 * OptionWheel — React Bits (Vanilla JavaScript + CSS 3D Edition)
 *
 * Configured for MyJourney:
 * - Items: ['1st Year', '2nd Year', '3rd Year', '4th Year']
 * - Manual click-based selection (no scroll hijacking!)
 * - 3D cylindrical arc layout with depth blur, fade, and active color blending.
 */

export class OptionWheel {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) return;

        this.items = options.items || ['1st Year', '2nd Year', '3rd Year', '4th Year'];
        this.defaultSelected = options.defaultSelected ?? 0;
        this.onChange = options.onChange || (() => {});
        this.textColor = options.textColor || '#777777';
        this.activeColor = options.activeColor || '#ffffff';
        this.side = options.side || 'left';
        this.fontSize = options.fontSize ?? 2.5; // rem
        this.spacing = options.spacing ?? 1.6;
        this.curve = options.curve ?? 1;
        this.tilt = options.tilt ?? 9; // degrees
        this.blur = options.blur ?? 2;
        this.fade = options.fade ?? 0.3;
        this.minOpacity = options.minOpacity ?? 0.15;
        this.smoothing = options.smoothing ?? 180; // ms
        this.inset = options.inset ?? 40;
        this.loop = options.loop ?? false;
        this.draggable = options.draggable ?? true;

        this.pos = this.defaultSelected;
        this.target = this.defaultSelected;
        this.selectedIndex = this.defaultSelected;
        this.rafId = null;
        this.lastTime = performance.now();
        this.itemEls = [];
        this.isDragging = false;
        this.dragStartY = 0;
        this.dragStartTarget = 0;
        this.dragMoved = false;

        this.init();
    }

    init() {
        this.container.innerHTML = '';

        this.wheelEl = document.createElement('div');
        this.wheelEl.className = `option-wheel${this.side === 'right' ? ' option-wheel--right' : ''}`;
        this.wheelEl.setAttribute('role', 'listbox');
        this.wheelEl.setAttribute('tabindex', '0');
        this.wheelEl.style.setProperty('--ow-text-color', this.textColor);
        this.wheelEl.style.setProperty('--ow-active-color', this.activeColor);
        this.wheelEl.style.setProperty('--ow-font-size', `${this.fontSize}rem`);
        this.wheelEl.style.setProperty('--ow-inset', `${this.inset}px`);
        this.container.appendChild(this.wheelEl);

        this.items.forEach((label, i) => {
            const itemEl = document.createElement('div');
            itemEl.className = `option-wheel__item${this.selectedIndex === i ? ' option-wheel__item--selected' : ''}`;
            itemEl.setAttribute('role', 'option');
            itemEl.setAttribute('aria-selected', this.selectedIndex === i ? 'true' : 'false');
            itemEl.textContent = label;

            itemEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.dragMoved) return;
                this.selectIndex(i);
            });

            this.wheelEl.appendChild(itemEl);
            this.itemEls.push(itemEl);
        });

        // Pointer Drag Events
        if (this.draggable) {
            this.wheelEl.addEventListener('pointerdown', (e) => this.onPointerDown(e));
            window.addEventListener('pointermove', (e) => this.onPointerMove(e));
            window.addEventListener('pointerup', () => this.onPointerUp());
            window.addEventListener('pointercancel', () => this.onPointerUp());
        }

        // NOTE: As requested by the user, we do NOT register a "wheel" scroll listener
        // that calls e.preventDefault(), so the page scroll continues naturally across the section!

        this.applyTarget(this.defaultSelected, true);
    }

    selectIndex(i) {
        this.applyTarget(i, true);
    }

    onPointerDown(e) {
        this.isDragging = true;
        this.dragMoved = false;
        this.dragStartY = e.clientY;
        this.dragStartTarget = this.target;
        this.wheelEl.classList.add('option-wheel--dragging');
    }

    onPointerMove(e) {
        if (!this.isDragging) return;
        const dy = e.clientY - this.dragStartY;
        if (!this.dragMoved && Math.abs(dy) > 4) {
            this.dragMoved = true;
        }
        if (this.dragMoved) {
            const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
            const rowH = Math.max(this.fontSize * this.spacing * remPx, 1);
            this.applyTarget(this.dragStartTarget - dy / rowH, false);
        }
    }

    onPointerUp() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.wheelEl.classList.remove('option-wheel--dragging');
        if (this.dragMoved) {
            this.applyTarget(this.target, true);
        }
    }

    applyTarget(value, snap) {
        const count = this.items.length;
        let v = value;
        if (!this.loop) v = Math.min(Math.max(v, 0), Math.max(count - 1, 0));
        if (snap) v = Math.round(v);
        this.target = v;

        const idx = ((Math.round(v) % count) + count) % count;
        if (idx !== this.selectedIndex) {
            this.selectedIndex = idx;
            this.itemEls.forEach((el, i) => {
                const isSelected = i === idx;
                el.classList.toggle('option-wheel__item--selected', isSelected);
                el.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            });
            this.onChange(idx, this.items[idx]);
        }

        this.startLoop();
    }

    startLoop() {
        if (this.rafId != null) cancelAnimationFrame(this.rafId);
        this.lastTime = performance.now();
        this.rafId = requestAnimationFrame((now) => this.runFrame(now));
    }

    runFrame(now) {
        const dt = Math.min((now - this.lastTime) / 1000, 0.05);
        this.lastTime = now;

        const tau = Math.max(this.smoothing, 1) / 1000;
        const k = 1 - Math.exp(-dt / tau);

        let next = this.pos + (this.target - this.pos) * k;
        const settled = Math.abs(this.target - next) < 0.001;
        if (settled) next = this.target;
        this.pos = next;

        const remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const rowH = Math.max(this.fontSize * this.spacing * remPx, 1);
        const count = this.items.length;
        const mirror = this.side === 'right' ? -1 : 1;
        const tiltRad = (this.tilt * Math.PI) / 180;
        const R = tiltRad > 0.0005 ? rowH / tiltRad : 0;

        for (let i = 0; i < count; i++) {
            const el = this.itemEls[i];
            if (!el) continue;

            let d = i - next;
            if (this.loop && count > 1) {
                d = ((d % count) + count) % count;
                if (d > count / 2) d -= count;
            }

            const dist = Math.abs(d);
            let x = 0;
            let y = d * rowH;
            let rot = 0;

            if (R > 0) {
                const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
                y = R * Math.sin(ang);
                x = -mirror * R * (1 - Math.cos(ang)) * this.curve;
                rot = (mirror * ang * 180) / Math.PI;
            }

            el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
            el.style.opacity = String(Math.max(this.minOpacity, 1 - dist * this.fade));
            el.style.filter = this.blur > 0 ? `blur(${(dist * this.blur).toFixed(2)}px)` : 'none';
            el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
        }

        if (!settled) {
            this.rafId = requestAnimationFrame((n) => this.runFrame(n));
        } else {
            this.rafId = null;
        }
    }

    destroy() {
        if (this.rafId != null) cancelAnimationFrame(this.rafId);
    }
}

export function initOptionWheel(container, options) {
    return new OptionWheel(container, options);
}

export default OptionWheel;
