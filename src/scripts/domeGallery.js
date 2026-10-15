/**
 * Beyond the Code — Single-Viewport 41-Image Kinetic Bento Grid
 *
 * Fits all 41 images from public/gallary/ (img1.jpeg .. img41.jpeg) inside
 * the single 100vh Beyond the Code section by scaling the 4 aspect-ratio-matched
 * Bento blocks into a compact 2x2 Bento Matrix (preserving the exact ~2.22
 * block aspect ratio so every image's length & breadth ratio is unchanged).
 *
 * Hovering any image smoothly expands its tier, quadrant, column, and slot
 * while surrounding cells across the grid dynamically adjust.
 */

const BENTO_QUADRANTS_CONFIG = [
    // =========================================================================
    // QUADRANT 1 (Top-Left, 9 Images) — Reference Bento Layout
    // =========================================================================
    {
        id: 'quad-1',
        tier: 0,
        side: 0,
        columns: [
            {
                colFlex: 1.15,
                blocks: [
                    {
                        type: 'single',
                        flex: 2.45,
                        src: '/gallary/img2.jpeg',
                        w: 1204,
                        h: 1600,
                        index: 2,
                    },
                    {
                        type: 'split',
                        flex: 1.0,
                        items: [
                            { src: '/gallary/img1.jpeg', w: 1600, h: 1200, index: 1, flex: 1 },
                            { src: '/gallary/img4.jpeg', w: 1600, h: 1200, index: 4, flex: 1 },
                        ],
                    },
                ],
            },
            {
                colFlex: 1.25,
                blocks: [
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img5.jpeg',
                        w: 1040,
                        h: 780,
                        index: 5,
                    },
                    {
                        type: 'single',
                        flex: 2.3,
                        src: '/gallary/img12.jpeg',
                        w: 720,
                        h: 1280,
                        index: 12,
                    },
                ],
            },
            {
                colFlex: 1.25,
                blocks: [
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img6.jpeg',
                        w: 4080,
                        h: 3060,
                        index: 6,
                    },
                    {
                        type: 'single',
                        flex: 2.3,
                        src: '/gallary/img14.jpeg',
                        w: 900,
                        h: 1600,
                        index: 14,
                    },
                ],
            },
            {
                colFlex: 2.12,
                blocks: [
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img7.jpeg',
                        w: 1280,
                        h: 576,
                        index: 7,
                    },
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img9.jpeg',
                        w: 1280,
                        h: 576,
                        index: 9,
                    },
                ],
            },
        ],
    },

    // =========================================================================
    // QUADRANT 2 (Top-Right, 11 Images) — Wide Landscapes & Ultra-Tall Twins
    // =========================================================================
    {
        id: 'quad-2',
        tier: 0,
        side: 1,
        columns: [
            {
                colFlex: 1.48,
                blocks: [
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img13.jpeg',
                        w: 1280,
                        h: 720,
                        index: 13,
                    },
                    {
                        type: 'split',
                        flex: 2.2,
                        items: [
                            { src: '/gallary/img3.jpeg', w: 577, h: 1280, index: 3, flex: 1 },
                            { src: '/gallary/img19.jpeg', w: 520, h: 1156, index: 19, flex: 1 },
                        ],
                    },
                ],
            },
            {
                colFlex: 1.25,
                blocks: [
                    {
                        type: 'single',
                        flex: 2.3,
                        src: '/gallary/img15.jpeg',
                        w: 900,
                        h: 1600,
                        index: 15,
                    },
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img8.jpeg',
                        w: 4080,
                        h: 3060,
                        index: 8,
                    },
                ],
            },
            {
                colFlex: 1.55,
                blocks: [
                    {
                        type: 'split',
                        flex: 2.2,
                        items: [
                            { src: '/gallary/img20.jpeg', w: 719, h: 1600, index: 20, flex: 1 },
                            { src: '/gallary/img26.jpeg', w: 1842, h: 4096, index: 26, flex: 1 },
                        ],
                    },
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img10.jpeg',
                        w: 1600,
                        h: 719,
                        index: 10,
                    },
                ],
            },
            {
                colFlex: 1.15,
                blocks: [
                    {
                        type: 'single',
                        flex: 2.45,
                        src: '/gallary/img36.jpeg',
                        w: 1179,
                        h: 1600,
                        index: 36,
                    },
                    {
                        type: 'split',
                        flex: 1.0,
                        items: [
                            { src: '/gallary/img11.jpeg', w: 1600, h: 1200, index: 11, flex: 1 },
                            { src: '/gallary/img29.jpeg', w: 1296, h: 972, index: 29, flex: 1 },
                        ],
                    },
                ],
            },
        ],
    },

    // =========================================================================
    // QUADRANT 3 (Bottom-Left, 10 Images) — Balanced Portrait & Panoramic
    // =========================================================================
    {
        id: 'quad-3',
        tier: 1,
        side: 0,
        columns: [
            {
                colFlex: 1.25,
                blocks: [
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img33.jpeg',
                        w: 1600,
                        h: 1200,
                        index: 33,
                    },
                    {
                        type: 'single',
                        flex: 2.3,
                        src: '/gallary/img17.jpeg',
                        w: 900,
                        h: 1600,
                        index: 17,
                    },
                ],
            },
            {
                colFlex: 1.55,
                blocks: [
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img21.jpeg',
                        w: 1600,
                        h: 720,
                        index: 21,
                    },
                    {
                        type: 'split',
                        flex: 2.2,
                        items: [
                            { src: '/gallary/img28.jpeg', w: 575, h: 1280, index: 28, flex: 1 },
                            { src: '/gallary/img32.jpeg', w: 719, h: 1600, index: 32, flex: 1 },
                        ],
                    },
                ],
            },
            {
                colFlex: 1.32,
                blocks: [
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img16.jpeg',
                        w: 1600,
                        h: 900,
                        index: 16,
                    },
                    {
                        type: 'single',
                        flex: 2.3,
                        src: '/gallary/img18.jpeg',
                        w: 900,
                        h: 1600,
                        index: 18,
                    },
                ],
            },
            {
                colFlex: 1.55,
                blocks: [
                    {
                        type: 'split',
                        flex: 2.2,
                        items: [
                            { src: '/gallary/img 35.jpeg', w: 721, h: 1600, index: 35, flex: 1 },
                            { src: '/gallary/img38.jpeg', w: 520, h: 1156, index: 38, flex: 1 },
                        ],
                    },
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img22.jpeg',
                        w: 1600,
                        h: 719,
                        index: 22,
                    },
                ],
            },
        ],
    },

    // =========================================================================
    // QUADRANT 4 (Bottom-Right, 11 Images) — Ultra-Wide Banners & Twin Portraits
    // =========================================================================
    {
        id: 'quad-4',
        tier: 1,
        side: 1,
        columns: [
            {
                colFlex: 1.55,
                blocks: [
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img23.jpeg',
                        w: 1600,
                        h: 720,
                        index: 23,
                    },
                    {
                        type: 'split',
                        flex: 2.2,
                        items: [
                            { src: '/gallary/img39.jpeg', w: 719, h: 1600, index: 39, flex: 1 },
                            { src: '/gallary/img41.jpeg', w: 520, h: 1156, index: 41, flex: 1 },
                        ],
                    },
                ],
            },
            {
                colFlex: 1.35,
                blocks: [
                    {
                        type: 'single',
                        flex: 2.3,
                        src: '/gallary/img25.jpeg',
                        w: 720,
                        h: 1280,
                        index: 25,
                    },
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img24.jpeg',
                        w: 1600,
                        h: 720,
                        index: 24,
                    },
                ],
            },
            {
                colFlex: 1.62,
                blocks: [
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img27.jpeg',
                        w: 4096,
                        h: 1842,
                        index: 27,
                    },
                    {
                        type: 'split',
                        flex: 2.1,
                        items: [
                            { src: '/gallary/img30.jpeg', w: 900, h: 1600, index: 30, flex: 1 },
                            { src: '/gallary/img34.jpeg', w: 720, h: 1280, index: 34, flex: 1 },
                        ],
                    },
                ],
            },
            {
                colFlex: 1.62,
                blocks: [
                    {
                        type: 'split',
                        flex: 2.1,
                        items: [
                            { src: '/gallary/img37.jpeg', w: 900, h: 1600, index: 37, flex: 1 },
                            { src: '/gallary/img40.jpeg', w: 900, h: 1600, index: 40, flex: 1 },
                        ],
                    },
                    {
                        type: 'single',
                        flex: 1.0,
                        src: '/gallary/img31.jpeg',
                        w: 4096,
                        h: 1844,
                        index: 31,
                    },
                ],
            },
        ],
    },
];

function randomBetween(min, max) {
    return +(min + Math.random() * (max - min)).toFixed(2);
}

export class DomeGallery {
    constructor(containerId = 'beyondCodeDomeStage', options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.quadsConfig = options.quadsConfig || BENTO_QUADRANTS_CONFIG;
        this.allImagesFlat = [];
        this.allCards = [];
        this.tierEls = [];
        this.quadControllers = [];
        this.currentLightboxIdx = 0;
        this.init();
    }

    createCardElement(itemData, onHoverCallback) {
        const flatIdx = this.allImagesFlat.length;
        this.allImagesFlat.push(itemData);

        const card = document.createElement('div');
        const ratio = itemData.w && itemData.h ? +(itemData.w / itemData.h).toFixed(2) : 1;
        const orientClass = ratio > 1.65 ? 'is-ultrawide' : ratio > 1.1 ? 'is-landscape' : ratio < 0.6 ? 'is-tall' : 'is-portrait';

        card.className = `bento-card ${orientClass}`;
        card.dataset.index = itemData.index;
        card.dataset.ratio = ratio;
        card.style.setProperty('--card-flex', itemData.flex ?? 1);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', `Moment ${itemData.index}`);

        const img = document.createElement('img');
        img.src = itemData.src;
        img.alt = `Moment ${itemData.index}`;
        img.loading = 'lazy';
        img.decoding = 'async';
        img.draggable = false;

        const placeholder = document.createElement('div');
        placeholder.className = 'bento-placeholder';
        placeholder.innerHTML = `
            <svg class="bento-placeholder-icon" viewBox="0 0 24 24">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
            </svg>
            <span class="bento-placeholder-text">${itemData.index}</span>
        `;

        img.addEventListener('error', () => {
            img.style.display = 'none';
            if (!placeholder.parentElement) {
                card.appendChild(placeholder);
            }
        });

        img.addEventListener('load', () => {
            img.style.display = 'block';
            if (placeholder.parentElement) {
                placeholder.remove();
            }
        });

        card.appendChild(img);

        card.addEventListener('mouseenter', () => {
            if (onHoverCallback) onHoverCallback(card);
        });

        card.addEventListener('click', () => this.openLightbox(flatIdx));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openLightbox(flatIdx);
            }
        });

        this.allCards.push(card);
        return card;
    }

    buildQuadrant(quadCfg, quadIdx) {
        const quadEl = document.createElement('div');
        quadEl.className = 'bento-quadrant';
        quadEl.style.setProperty('--quad-flex', 1);

        const colControllers = [];

        quadCfg.columns.forEach((colCfg, colIdx) => {
            const colEl = document.createElement('div');
            colEl.className = `bento-col bento-col--${colIdx + 1}`;
            colEl.style.setProperty('--col-flex', colCfg.colFlex);

            const blockControllers = [];

            colCfg.blocks.forEach((blockCfg, blockIdx) => {
                if (blockCfg.type === 'single') {
                    const cardEl = this.createCardElement(blockCfg, (hoveredCard) => {
                        this.handleMatrixHover(quadIdx, colIdx, blockIdx, null, hoveredCard);
                    });
                    colEl.appendChild(cardEl);
                    blockControllers.push({
                        type: 'single',
                        baseFlex: blockCfg.flex,
                        el: cardEl,
                    });
                } else if (blockCfg.type === 'split') {
                    const splitRowEl = document.createElement('div');
                    splitRowEl.className = 'bento-split-row';
                    splitRowEl.style.setProperty('--row-flex', blockCfg.flex);

                    const subCards = [];
                    blockCfg.items.forEach((subItem, subIdx) => {
                        const cardEl = this.createCardElement(subItem, (hoveredCard) => {
                            this.handleMatrixHover(quadIdx, colIdx, blockIdx, subIdx, hoveredCard);
                        });
                        splitRowEl.appendChild(cardEl);
                        subCards.push({
                            baseFlex: subItem.flex ?? 1,
                            el: cardEl,
                        });
                    });

                    colEl.appendChild(splitRowEl);
                    blockControllers.push({
                        type: 'split',
                        baseFlex: blockCfg.flex,
                        el: splitRowEl,
                        subCards,
                    });
                }
            });

            quadEl.appendChild(colEl);
            colControllers.push({
                baseColFlex: colCfg.colFlex,
                el: colEl,
                blocks: blockControllers,
            });
        });

        const ctrl = {
            quadIdx,
            tier: quadCfg.tier,
            side: quadCfg.side,
            el: quadEl,
            columns: colControllers,
        };
        this.quadControllers.push(ctrl);
        return quadEl;
    }

    handleMatrixHover(hoveredQuadIdx, hoveredColIdx, hoveredBlockIdx, hoveredSubIdx, hoveredCard) {
        this.wrapperEl.classList.add('is-interacting');
        const activeQuad = this.quadControllers[hoveredQuadIdx];
        const activeTier = activeQuad.tier;

        // 1. Expand the active horizontal tier (top or bottom half) slightly
        this.tierEls.forEach((tierEl, tIdx) => {
            tierEl.style.setProperty('--tier-flex', tIdx === activeTier ? 1.32 : 0.78);
        });

        // 2. Adjust all 4 quadrants and their internal columns/cards
        this.quadControllers.forEach((qCtrl, qIdx) => {
            const isHoveredQuad = qIdx === hoveredQuadIdx;
            const isSameTier = qCtrl.tier === activeTier;

            if (isHoveredQuad) {
                qCtrl.el.style.setProperty('--quad-flex', 1.35);
            } else if (isSameTier) {
                qCtrl.el.style.setProperty('--quad-flex', 0.75);
            } else {
                qCtrl.el.style.setProperty('--quad-flex', randomBetween(0.88, 1.14));
            }

            qCtrl.columns.forEach((colCtrl, cIdx) => {
                const isHoveredCol = isHoveredQuad && cIdx === hoveredColIdx;

                if (isHoveredCol) {
                    colCtrl.el.style.setProperty('--col-flex', +(colCtrl.baseColFlex * randomBetween(1.48, 1.72)).toFixed(2));
                } else if (isHoveredQuad) {
                    colCtrl.el.style.setProperty('--col-flex', +(colCtrl.baseColFlex * randomBetween(0.72, 0.96)).toFixed(2));
                } else {
                    colCtrl.el.style.setProperty('--col-flex', +(colCtrl.baseColFlex * randomBetween(0.82, 1.2)).toFixed(2));
                }

                colCtrl.blocks.forEach((blk, bIdx) => {
                    const isHoveredBlock = isHoveredCol && bIdx === hoveredBlockIdx;

                    if (blk.type === 'single') {
                        if (isHoveredBlock) {
                            blk.el.style.setProperty('--card-flex', +(blk.baseFlex * randomBetween(1.6, 2.1)).toFixed(2));
                        } else if (isHoveredCol) {
                            blk.el.style.setProperty('--card-flex', +(blk.baseFlex * randomBetween(0.55, 0.78)).toFixed(2));
                        } else {
                            blk.el.style.setProperty('--card-flex', +(blk.baseFlex * randomBetween(0.76, 1.35)).toFixed(2));
                        }
                    } else if (blk.type === 'split') {
                        if (isHoveredBlock) {
                            blk.el.style.setProperty('--row-flex', +(blk.baseFlex * randomBetween(1.5, 1.9)).toFixed(2));
                            blk.subCards.forEach((sc, sIdx) => {
                                sc.el.style.setProperty('--card-flex', sIdx === hoveredSubIdx ? randomBetween(1.75, 2.25) : randomBetween(0.68, 0.85));
                            });
                        } else if (isHoveredCol) {
                            blk.el.style.setProperty('--row-flex', +(blk.baseFlex * randomBetween(0.58, 0.8)).toFixed(2));
                            blk.subCards.forEach((sc) => {
                                sc.el.style.setProperty('--card-flex', randomBetween(0.85, 1.2));
                            });
                        } else {
                            blk.el.style.setProperty('--row-flex', +(blk.baseFlex * randomBetween(0.78, 1.3)).toFixed(2));
                            blk.subCards.forEach((sc) => {
                                sc.el.style.setProperty('--card-flex', randomBetween(0.8, 1.25));
                            });
                        }
                    }
                });
            });
        });

        this.allCards.forEach((cardEl) => {
            cardEl.classList.toggle('is-hovered', cardEl === hoveredCard);
        });
    }

    resetMatrixProportions() {
        this.wrapperEl.classList.remove('is-interacting');

        this.tierEls.forEach((tierEl) => {
            tierEl.style.setProperty('--tier-flex', 1);
        });

        this.quadControllers.forEach((qCtrl) => {
            qCtrl.el.style.setProperty('--quad-flex', 1);
            qCtrl.columns.forEach((colCtrl) => {
                colCtrl.el.style.setProperty('--col-flex', colCtrl.baseColFlex);
                colCtrl.blocks.forEach((blk) => {
                    if (blk.type === 'single') {
                        blk.el.style.setProperty('--card-flex', blk.baseFlex);
                    } else if (blk.type === 'split') {
                        blk.el.style.setProperty('--row-flex', blk.baseFlex);
                        blk.subCards.forEach((sc) => {
                            sc.el.style.setProperty('--card-flex', sc.baseFlex);
                        });
                    }
                });
            });
        });

        this.allCards.forEach((cardEl) => {
            cardEl.classList.remove('is-hovered');
        });
    }

    init() {
        this.container.innerHTML = '';
        this.allImagesFlat = [];
        this.allCards = [];
        this.tierEls = [];
        this.quadControllers = [];

        const wrapper = document.createElement('div');
        wrapper.className = 'bento-gallery-wrapper';
        this.wrapperEl = wrapper;

        // Build 2 horizontal tiers (each containing 2 Bento quadrants side-by-side)
        const topTier = document.createElement('div');
        topTier.className = 'bento-matrix-tier';
        topTier.style.setProperty('--tier-flex', 1);

        const bottomTier = document.createElement('div');
        bottomTier.className = 'bento-matrix-tier';
        bottomTier.style.setProperty('--tier-flex', 1);

        this.tierEls = [topTier, bottomTier];

        this.quadsConfig.forEach((quadCfg, qIdx) => {
            const quadEl = this.buildQuadrant(quadCfg, qIdx);
            if (quadCfg.tier === 0) {
                topTier.appendChild(quadEl);
            } else {
                bottomTier.appendChild(quadEl);
            }
        });

        wrapper.appendChild(topTier);
        wrapper.appendChild(bottomTier);

        wrapper.addEventListener('mouseleave', () => {
            this.resetMatrixProportions();
        });

        // Lightbox viewer for full-resolution inspection
        this.lightbox = document.createElement('div');
        this.lightbox.className = 'bento-lightbox';
        this.lightbox.innerHTML = `
            <div class="bento-lightbox-scrim"></div>
            <button class="bento-lightbox-nav bento-lightbox-prev" aria-label="Previous image">&#10094;</button>
            <div class="bento-lightbox-content">
                <img class="bento-lightbox-img" src="" alt="" />
                <button class="bento-lightbox-close" aria-label="Close preview">&times;</button>
            </div>
            <button class="bento-lightbox-nav bento-lightbox-next" aria-label="Next image">&#10095;</button>
        `;
        wrapper.appendChild(this.lightbox);

        this.container.appendChild(wrapper);

        const scrim = this.lightbox.querySelector('.bento-lightbox-scrim');
        const closeBtn = this.lightbox.querySelector('.bento-lightbox-close');
        const prevBtn = this.lightbox.querySelector('.bento-lightbox-prev');
        const nextBtn = this.lightbox.querySelector('.bento-lightbox-next');

        scrim.addEventListener('click', () => this.closeLightbox());
        closeBtn.addEventListener('click', () => this.closeLightbox());
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.stepLightbox(-1);
        });
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.stepLightbox(1);
        });

        this.onKeyDown = (e) => {
            if (!this.lightbox.classList.contains('is-open')) return;
            if (e.key === 'Escape') this.closeLightbox();
            if (e.key === 'ArrowLeft') this.stepLightbox(-1);
            if (e.key === 'ArrowRight') this.stepLightbox(1);
        };
        window.addEventListener('keydown', this.onKeyDown);
    }

    openLightbox(flatIdx) {
        if (!this.lightbox || !this.allImagesFlat[flatIdx]) return;
        this.currentLightboxIdx = flatIdx;
        const itemData = this.allImagesFlat[flatIdx];
        const img = this.lightbox.querySelector('.bento-lightbox-img');
        img.src = itemData.src;
        img.alt = `Moment ${itemData.index}`;
        this.lightbox.classList.add('is-open');
    }

    stepLightbox(delta) {
        const total = this.allImagesFlat.length;
        if (!total) return;
        this.currentLightboxIdx = (this.currentLightboxIdx + delta + total) % total;
        this.openLightbox(this.currentLightboxIdx);
    }

    closeLightbox() {
        if (!this.lightbox) return;
        this.lightbox.classList.remove('is-open');
    }

    destroy() {
        if (this.onKeyDown) {
            window.removeEventListener('keydown', this.onKeyDown);
        }
    }
}

export function initDomeGallery(containerId = 'beyondCodeDomeStage', options = {}) {
    return new DomeGallery(containerId, options);
}

export default DomeGallery;
