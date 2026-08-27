/**
 * DomeGallery — React Bits (Vanilla JavaScript + CSS 3D Edition)
 *
 * 3D Spherical Dome Photo & Moment Experience.
 * Uses public/gallary/ paths (/gallary/img1.jpg, /gallary/img2.jpg, etc.)
 */

const DEFAULT_GALLARY_IMAGES = Array.from({ length: 16 }, (_, i) => ({
    src: `/gallary/img${i + 1}.jpg`,
    alt: `Moment ${i + 1}`,
    index: i + 1,
}));

const DEFAULTS = {
    maxVerticalRotationDeg: 6,
    dragSensitivity: 20,
    enlargeTransitionMs: 350,
    segments: 35,
    fit: 0.62,
    minRadius: 580,
    maxRadius: 880,
    padFactor: 0.25,
    overlayBlurColor: '#000000',
    dragDampening: 2,
    openedImageWidth: '420px',
    openedImageHeight: '420px',
    imageBorderRadius: '28px',
    openedImageBorderRadius: '30px',
};

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeAngle = d => ((d % 360) + 360) % 360;
const wrapAngleSigned = deg => {
    const a = (((deg + 180) % 360) + 360) % 360;
    return a - 180;
};
const getDataNumber = (el, name, fallback) => {
    const attr = el.dataset[name] ?? el.getAttribute(`data-${name}`);
    const n = attr == null ? NaN : parseFloat(attr);
    return Number.isFinite(n) ? n : fallback;
};

function buildItems(pool, seg) {
    const xCols = Array.from({ length: seg }, (_, i) => -37 + i * 2);
    const evenYs = [-4, -2, 0, 2, 4];
    const oddYs = [-3, -1, 1, 3, 5];

    const coords = xCols.flatMap((x, c) => {
        const ys = c % 2 === 0 ? evenYs : oddYs;
        return ys.map(y => ({ x, y, sizeX: 2, sizeY: 2 }));
    });

    const totalSlots = coords.length;
    if (pool.length === 0) {
        return coords.map(c => ({ ...c, src: '', alt: '' }));
    }

    const normalizedImages = pool.map(image => {
        if (typeof image === 'string') {
            return { src: image, alt: '' };
        }
        return { src: image.src || '', alt: image.alt || '', index: image.index || 1 };
    });

    const usedImages = Array.from({ length: totalSlots }, (_, i) => normalizedImages[i % normalizedImages.length]);

    for (let i = 1; i < usedImages.length; i++) {
        if (usedImages[i].src === usedImages[i - 1].src) {
            for (let j = i + 1; j < usedImages.length; j++) {
                if (usedImages[j].src !== usedImages[i].src) {
                    const tmp = usedImages[i];
                    usedImages[i] = usedImages[j];
                    usedImages[j] = tmp;
                    break;
                }
            }
        }
    }

    return coords.map((c, i) => ({
        ...c,
        src: usedImages[i].src,
        alt: usedImages[i].alt,
        index: usedImages[i].index,
    }));
}

function computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, segments) {
    const unit = 360 / segments / 2;
    const rotateY = unit * (offsetX + (sizeX - 1) / 2);
    const rotateX = unit * (offsetY - (sizeY - 1) / 2);
    return { rotateX, rotateY };
}

export class DomeGallery {
    constructor(containerId = 'beyondCodeDomeStage', options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.images = options.images || DEFAULT_GALLARY_IMAGES;
        this.fit = options.fit ?? DEFAULTS.fit;
        this.minRadius = options.minRadius ?? DEFAULTS.minRadius;
        this.maxRadius = options.maxRadius ?? DEFAULTS.maxRadius;
        this.padFactor = options.padFactor ?? DEFAULTS.padFactor;
        this.overlayBlurColor = options.overlayBlurColor || DEFAULTS.overlayBlurColor;
        this.maxVerticalRotationDeg = options.maxVerticalRotationDeg ?? DEFAULTS.maxVerticalRotationDeg;
        this.dragSensitivity = options.dragSensitivity ?? DEFAULTS.dragSensitivity;
        this.enlargeTransitionMs = options.enlargeTransitionMs ?? DEFAULTS.enlargeTransitionMs;
        this.segments = options.segments ?? DEFAULTS.segments;
        this.dragDampening = options.dragDampening ?? DEFAULTS.dragDampening;
        this.openedImageWidth = options.openedImageWidth || DEFAULTS.openedImageWidth;
        this.openedImageHeight = options.openedImageHeight || DEFAULTS.openedImageHeight;
        this.imageBorderRadius = options.imageBorderRadius || DEFAULTS.imageBorderRadius;
        this.openedImageBorderRadius = options.openedImageBorderRadius || DEFAULTS.openedImageBorderRadius;

        this.rotation = { x: 0, y: 0 };
        this.startRot = { x: 0, y: 0 };
        this.startPos = null;
        this.isDragging = false;
        this.hasMoved = false;
        this.inertiaRAF = null;
        this.autoDriftRAF = null;
        this.isOpening = false;
        this.openStartedAt = 0;
        this.lastDragEndAt = 0;
        this.focusedEl = null;
        this.originalTilePosition = null;

        this.init();
    }

    init() {
        this.container.innerHTML = '';

        // Root Sphere Element
        this.root = document.createElement('div');
        this.root.className = 'sphere-root';
        this.root.style.setProperty('--segments-x', this.segments);
        this.root.style.setProperty('--segments-y', this.segments);
        this.root.style.setProperty('--overlay-blur-color', this.overlayBlurColor);
        this.root.style.setProperty('--tile-radius', this.imageBorderRadius);
        this.root.style.setProperty('--enlarge-radius', this.openedImageBorderRadius);
        this.container.appendChild(this.root);

        // Main & Stage
        this.main = document.createElement('main');
        this.main.className = 'sphere-main';
        this.root.appendChild(this.main);

        this.stage = document.createElement('div');
        this.stage.className = 'stage';
        this.main.appendChild(this.stage);

        this.sphere = document.createElement('div');
        this.sphere.className = 'sphere';
        this.stage.appendChild(this.sphere);

        // Build items
        const items = buildItems(this.images, this.segments);
        items.forEach((it, i) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'item';
            itemEl.dataset.src = it.src;
            itemEl.dataset.offsetX = it.x;
            itemEl.dataset.offsetY = it.y;
            itemEl.dataset.sizeX = it.sizeX;
            itemEl.dataset.sizeY = it.sizeY;
            itemEl.style.setProperty('--offset-x', it.x);
            itemEl.style.setProperty('--offset-y', it.y);
            itemEl.style.setProperty('--item-size-x', it.sizeX);
            itemEl.style.setProperty('--item-size-y', it.sizeY);

            const imgWrapper = document.createElement('div');
            imgWrapper.className = 'item__image';
            imgWrapper.setAttribute('role', 'button');
            imgWrapper.setAttribute('tabindex', '0');
            imgWrapper.setAttribute('aria-label', it.alt || 'Open moment');

            // Image tag
            const img = document.createElement('img');
            img.src = it.src;
            img.alt = it.alt;
            img.draggable = false;
            img.loading = 'lazy';

            // Placeholder fallback when image file hasn't been uploaded yet
            const placeholder = document.createElement('div');
            placeholder.className = 'item-placeholder';
            placeholder.innerHTML = `
                <svg class="item-placeholder-icon" viewBox="0 0 24 24">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                </svg>
                <span class="item-placeholder-text">Moment ${it.index}</span>
            `;

            img.addEventListener('error', () => {
                img.style.display = 'none';
                imgWrapper.appendChild(placeholder);
            });

            img.addEventListener('load', () => {
                img.style.display = 'block';
                if (placeholder.parentElement) {
                    placeholder.remove();
                }
            });

            imgWrapper.appendChild(img);
            itemEl.appendChild(imgWrapper);
            this.sphere.appendChild(itemEl);

            // Click listener
            imgWrapper.addEventListener('click', (e) => this.onTileClick(e));
        });

        // Overlays & Vignettes
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        this.main.appendChild(overlay);

        const overlayBlur = document.createElement('div');
        overlayBlur.className = 'overlay overlay--blur';
        this.main.appendChild(overlayBlur);

        const edgeTop = document.createElement('div');
        edgeTop.className = 'edge-fade edge-fade--top';
        this.main.appendChild(edgeTop);

        const edgeBottom = document.createElement('div');
        edgeBottom.className = 'edge-fade edge-fade--bottom';
        this.main.appendChild(edgeBottom);

        // Viewer / Enlarge Frame
        this.viewer = document.createElement('div');
        this.viewer.className = 'viewer';
        this.main.appendChild(this.viewer);

        this.scrim = document.createElement('div');
        this.scrim.className = 'scrim';
        this.viewer.appendChild(this.scrim);

        this.frame = document.createElement('div');
        this.frame.className = 'frame';
        this.viewer.appendChild(this.frame);

        // Setup resize handling
        this.setupResize();

        // Setup gestures
        this.setupGestures();

        // Setup modal close
        this.setupClose();

        // Start subtle idle auto-drift
        this.startAutoDrift();
    }

    setupResize() {
        const resize = () => {
            const rect = this.root.getBoundingClientRect();
            const w = Math.max(1, rect.width);
            const h = Math.max(1, rect.height);
            const minDim = Math.min(w, h);
            const aspect = w / h;
            const basis = aspect >= 1.3 ? w : minDim;

            let radius = basis * this.fit;
            const heightGuard = h * 1.35;
            radius = Math.min(radius, heightGuard);
            radius = clamp(radius, this.minRadius, this.maxRadius);
            this.lockedRadius = Math.round(radius);

            const viewerPad = Math.max(8, Math.round(minDim * this.padFactor));
            this.root.style.setProperty('--radius', `${this.lockedRadius}px`);
            this.root.style.setProperty('--viewer-pad', `${viewerPad}px`);

            this.applyTransform(this.rotation.x, this.rotation.y);
        };

        if (window.ResizeObserver) {
            this.ro = new ResizeObserver(() => resize());
            this.ro.observe(this.root);
        } else {
            window.addEventListener('resize', resize);
        }

        resize();
    }

    applyTransform(xDeg, yDeg) {
        if (this.sphere) {
            this.sphere.style.transform = `translateZ(calc(var(--radius) * -1)) rotateX(${xDeg}deg) rotateY(${yDeg}deg)`;
        }
    }

    startAutoDrift() {
        const drift = () => {
            if (!this.isDragging && !this.inertiaRAF && !this.isOpening && !this.focusedEl) {
                this.rotation.y = wrapAngleSigned(this.rotation.y + 0.04);
                this.applyTransform(this.rotation.x, this.rotation.y);
            }
            this.autoDriftRAF = requestAnimationFrame(drift);
        };
        this.autoDriftRAF = requestAnimationFrame(drift);
    }

    setupGestures() {
        let lastMoveTime = performance.now();
        let lastPos = { x: 0, y: 0 };
        let velocity = { x: 0, y: 0 };

        const onDown = (clientX, clientY) => {
            if (this.focusedEl) return;
            this.stopInertia();
            this.isDragging = true;
            this.hasMoved = false;
            this.startRot = { ...this.rotation };
            this.startPos = { x: clientX, y: clientY };
            lastPos = { x: clientX, y: clientY };
            lastMoveTime = performance.now();
            velocity = { x: 0, y: 0 };
        };

        const onMove = (clientX, clientY) => {
            if (this.focusedEl || !this.isDragging || !this.startPos) return;
            const dxTotal = clientX - this.startPos.x;
            const dyTotal = clientY - this.startPos.y;

            if (!this.hasMoved) {
                const dist2 = dxTotal * dxTotal + dyTotal * dyTotal;
                if (dist2 > 16) this.hasMoved = true;
            }

            const now = performance.now();
            const dt = Math.max(1, now - lastMoveTime);
            velocity.x = (clientX - lastPos.x) / dt;
            velocity.y = (clientY - lastPos.y) / dt;
            lastPos = { x: clientX, y: clientY };
            lastMoveTime = now;

            const nextX = clamp(
                this.startRot.x - dyTotal / this.dragSensitivity,
                -this.maxVerticalRotationDeg,
                this.maxVerticalRotationDeg
            );
            const nextY = wrapAngleSigned(this.startRot.y + dxTotal / this.dragSensitivity);

            this.rotation = { x: nextX, y: nextY };
            this.applyTransform(nextX, nextY);
        };

        const onUp = () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            if (this.hasMoved) {
                this.lastDragEndAt = performance.now();
                if (Math.abs(velocity.x) > 0.05 || Math.abs(velocity.y) > 0.05) {
                    this.startInertia(velocity.x, velocity.y);
                }
            }
            this.hasMoved = false;
        };

        // Mouse Events
        this.main.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => {
            if (this.isDragging) onMove(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', () => onUp());

        // Touch Events
        this.main.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1) {
                onMove(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => onUp());
    }

    stopInertia() {
        if (this.inertiaRAF) {
            cancelAnimationFrame(this.inertiaRAF);
            this.inertiaRAF = null;
        }
    }

    startInertia(vx, vy) {
        const MAX_V = 1.4;
        let vX = clamp(vx, -MAX_V, MAX_V) * 80;
        let vY = clamp(vy, -MAX_V, MAX_V) * 80;
        let frames = 0;
        const d = clamp(this.dragDampening ?? 2, 0, 3);
        const frictionMul = 0.94 + 0.02 * (3 - d);
        const stopThreshold = 0.015;
        const maxFrames = 180;

        const step = () => {
            vX *= frictionMul;
            vY *= frictionMul;
            if (Math.abs(vX) < stopThreshold && Math.abs(vY) < stopThreshold) {
                this.inertiaRAF = null;
                return;
            }
            if (++frames > maxFrames) {
                this.inertiaRAF = null;
                return;
            }
            const nextX = clamp(this.rotation.x - vY / 200, -this.maxVerticalRotationDeg, this.maxVerticalRotationDeg);
            const nextY = wrapAngleSigned(this.rotation.y + vX / 200);
            this.rotation = { x: nextX, y: nextY };
            this.applyTransform(nextX, nextY);
            this.inertiaRAF = requestAnimationFrame(step);
        };
        this.stopInertia();
        this.inertiaRAF = requestAnimationFrame(step);
    }

    onTileClick(e) {
        if (this.isDragging || this.hasMoved) return;
        if (performance.now() - this.lastDragEndAt < 80) return;
        if (this.isOpening) return;
        this.openItem(e.currentTarget);
    }

    openItem(el) {
        if (this.isOpening) return;
        this.isOpening = true;
        this.openStartedAt = performance.now();
        const parent = el.parentElement;
        this.focusedEl = el;

        const offsetX = getDataNumber(parent, 'offsetX', 0);
        const offsetY = getDataNumber(parent, 'offsetY', 0);
        const sizeX = getDataNumber(parent, 'sizeX', 2);
        const sizeY = getDataNumber(parent, 'sizeY', 2);
        const parentRot = computeItemBaseRotation(offsetX, offsetY, sizeX, sizeY, this.segments);
        const parentY = normalizeAngle(parentRot.rotateY);
        const globalY = normalizeAngle(this.rotation.y);

        let rotY = -(parentY + globalY) % 360;
        if (rotY < -180) rotY += 360;
        const rotX = -parentRot.rotateX - this.rotation.x;

        parent.style.setProperty('--rot-y-delta', `${rotY}deg`);
        parent.style.setProperty('--rot-x-delta', `${rotX}deg`);

        const refDiv = document.createElement('div');
        refDiv.className = 'item__image item__image--reference';
        refDiv.style.opacity = '0';
        refDiv.style.transform = `rotateX(${-parentRot.rotateX}deg) rotateY(${-parentRot.rotateY}deg)`;
        parent.appendChild(refDiv);

        void refDiv.offsetHeight;

        const tileR = refDiv.getBoundingClientRect();
        const mainR = this.main.getBoundingClientRect();
        const frameR = this.frame.getBoundingClientRect();

        if (tileR.width <= 0 || tileR.height <= 0) {
            this.isOpening = false;
            this.focusedEl = null;
            parent.removeChild(refDiv);
            return;
        }

        this.originalTilePosition = { left: tileR.left, top: tileR.top, width: tileR.width, height: tileR.height };
        el.style.visibility = 'hidden';

        const overlay = document.createElement('div');
        overlay.className = 'enlarge';
        overlay.style.position = 'absolute';
        overlay.style.left = `${frameR.left - mainR.left}px`;
        overlay.style.top = `${frameR.top - mainR.top}px`;
        overlay.style.width = `${frameR.width}px`;
        overlay.style.height = `${frameR.height}px`;
        overlay.style.opacity = '0';

        const rawSrc = parent.dataset.src || el.querySelector('img')?.src || '';
        const img = document.createElement('img');
        img.src = rawSrc;

        // If source image errored, display placeholder inside enlarged modal
        img.addEventListener('error', () => {
            img.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'item-placeholder';
            placeholder.innerHTML = `
                <svg class="item-placeholder-icon" viewBox="0 0 24 24" style="width:48px;height:48px;">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                </svg>
                <span class="item-placeholder-text" style="font-size:1rem;margin-top:8px;">${rawSrc.split('/').pop()}</span>
                <span style="font-size:0.75rem;color:rgba(255,255,255,0.5);">Place photo in public/gallary/ to display</span>
            `;
            overlay.appendChild(placeholder);
        });

        overlay.appendChild(img);

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'enlarge-close-hint';
        closeBtn.innerHTML = `&times;`;
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            this.closeEnlarge();
        });
        overlay.appendChild(closeBtn);

        this.viewer.appendChild(overlay);

        const tx0 = tileR.left - frameR.left;
        const ty0 = tileR.top - frameR.top;
        const sx0 = tileR.width / frameR.width || 1;
        const sy0 = tileR.height / frameR.height || 1;

        overlay.style.transform = `translate(${tx0}px, ${ty0}px) scale(${sx0}, ${sy0})`;

        setTimeout(() => {
            if (!overlay.parentElement) return;
            overlay.style.opacity = '1';
            overlay.style.transform = 'translate(0px, 0px) scale(1, 1)';
            this.root.setAttribute('data-enlarging', 'true');
        }, 16);
    }

    setupClose() {
        this.scrim.addEventListener('click', () => this.closeEnlarge());
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeEnlarge();
        });
    }

    closeEnlarge() {
        if (performance.now() - this.openStartedAt < 250) return;
        const el = this.focusedEl;
        if (!el) return;

        const parent = el.parentElement;
        const overlay = this.viewer.querySelector('.enlarge');
        if (!overlay) return;

        const refDiv = parent.querySelector('.item__image--reference');
        const originalPos = this.originalTilePosition;

        if (!originalPos) {
            overlay.remove();
            if (refDiv) refDiv.remove();
            parent.style.setProperty('--rot-y-delta', '0deg');
            parent.style.setProperty('--rot-x-delta', '0deg');
            el.style.visibility = '';
            this.focusedEl = null;
            this.root.removeAttribute('data-enlarging');
            this.isOpening = false;
            return;
        }

        const currentRect = overlay.getBoundingClientRect();
        const rootRect = this.root.getBoundingClientRect();

        const animatingOverlay = document.createElement('div');
        animatingOverlay.className = 'enlarge-closing';
        animatingOverlay.style.cssText = `
            position: absolute;
            left: ${currentRect.left - rootRect.left}px;
            top: ${currentRect.top - rootRect.top}px;
            width: ${currentRect.width}px;
            height: ${currentRect.height}px;
            z-index: 9999;
            border-radius: var(--enlarge-radius, 28px);
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.35);
            transition: all ${this.enlargeTransitionMs}ms ease-out;
            pointer-events: none;
        `;

        const originalImg = overlay.querySelector('img');
        if (originalImg) {
            const img = originalImg.cloneNode();
            img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
            animatingOverlay.appendChild(img);
        }

        overlay.remove();
        this.root.appendChild(animatingOverlay);
        void animatingOverlay.getBoundingClientRect();

        requestAnimationFrame(() => {
            animatingOverlay.style.left = `${originalPos.left - rootRect.left}px`;
            animatingOverlay.style.top = `${originalPos.top - rootRect.top}px`;
            animatingOverlay.style.width = `${originalPos.width}px`;
            animatingOverlay.style.height = `${originalPos.height}px`;
            animatingOverlay.style.opacity = '0';
        });

        const cleanup = () => {
            animatingOverlay.remove();
            this.originalTilePosition = null;
            if (refDiv) refDiv.remove();
            parent.style.setProperty('--rot-y-delta', '0deg');
            parent.style.setProperty('--rot-x-delta', '0deg');
            el.style.visibility = '';
            this.focusedEl = null;
            this.root.removeAttribute('data-enlarging');
            this.isOpening = false;
        };

        animatingOverlay.addEventListener('transitionend', cleanup, { once: true });
    }

    destroy() {
        if (this.autoDriftRAF) cancelAnimationFrame(this.autoDriftRAF);
        if (this.inertiaRAF) cancelAnimationFrame(this.inertiaRAF);
        if (this.ro) this.ro.disconnect();
    }
}

export function initDomeGallery(containerId = 'beyondCodeDomeStage', options = {}) {
    return new DomeGallery(containerId, options);
}

export default DomeGallery;
