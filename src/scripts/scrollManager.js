/**
 * Scroll Manager
 * Handles normalized scroll calculations and threshold triggers for text and section reveals.
 */

export class ScrollManager {
    constructor(engine, options = {}) {
        this.engine = engine;
        this.heroContainer = document.getElementById(options.heroContainerId || 'heroContainer');

        // Scroll thresholds matching the design flow
        this.FRAME_END   = 0.45;                      // Frame sequence completes over 0 -> 0.45
        this.DECODE_AT   = (138 / 240) * this.FRAME_END; // Exact frame 138 (~0.25875)
        this.SANSKRIT_AT = (180 / 240) * this.FRAME_END; // Frame ~180 (~0.3375)
        this.NAME_AT     = (220 / 240) * this.FRAME_END; // Frame ~220 (~0.4125)
        this.JOSHI_AT    = 0.55;
        this.INFO_AT     = 0.70;
        this.QUOTE_AT    = 0.85;

        // Element references
        this.elements = {
            introGlass: document.getElementById('heroIntroGlass'),
            cursiveText: document.getElementById('heroCursiveText'),
            typingCursor: document.getElementById('heroTypingCursor'),
            scrollNav: document.getElementById('heroScrollNav'),
            decode: document.getElementById('decode'),
            sanskrit: document.getElementById('sanskrit'),
            nameLeft: document.getElementById('nameLeft'),
            nameRight: document.getElementById('nameRight'),
            joshiText: document.getElementById('joshiText'),
            info: document.getElementById('info'),
            quote: document.getElementById('quote')
        };

        this.ticking = false;
        this.init();
    }

    init() {
        this.initIntroTyping();

        if (this.elements.scrollNav) {
            this.elements.scrollNav.addEventListener('click', () => {
                window.scrollTo({
                    top: Math.round(window.innerHeight * 0.85),
                    behavior: 'smooth'
                });
            });
        }

        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
        this.handleScroll(); // Initial evaluation
    }

    initIntroTyping() {
        const textEl = this.elements.cursiveText;
        const cursorEl = this.elements.typingCursor;
        const navEl = this.elements.scrollNav;
        if (!textEl) return;

        const message = 'Hi folks, welcome to my portfolio!';
        textEl.textContent = '';
        let idx = 0;

        const typeNext = () => {
            if (idx < message.length) {
                const ch = message.charAt(idx);
                textEl.textContent += ch;
                idx++;
                // Slight natural pause after comma
                const delay = ch === ',' ? 240 : 62;
                setTimeout(typeNext, delay);
            } else {
                // Typing finished: fade out cursor and reveal scroll-down cue
                if (cursorEl) {
                    setTimeout(() => cursorEl.classList.add('done'), 400);
                }
                if (navEl) {
                    setTimeout(() => navEl.classList.add('visible'), 180);
                }
            }
        };

        setTimeout(typeNext, 350);
    }

    getHeroProgress() {
        if (!this.heroContainer) return 0;
        const heroScrollDistance = this.heroContainer.offsetHeight - window.innerHeight;
        if (heroScrollDistance <= 0) return 0;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return Math.max(0, Math.min(1, scrollTop / heroScrollDistance));
    }

    handleScroll() {
        const p = this.getHeroProgress();

        // 0. Dissolve initial blur glass overlay once user starts scrolling down
        if (this.elements.introGlass) {
            this.elements.introGlass.classList.toggle('scrolled-out', p > 0.015);
        }

        // 1. Frame sequence animation progress
        if (this.engine) {
            if (p <= this.FRAME_END) {
                const fp = p / this.FRAME_END;
                const target = Math.ceil(fp * this.engine.frameCount);
                this.engine.setTargetFrame(target);
            } else {
                this.engine.setTargetFrame(this.engine.frameCount);
            }
        }

        // 2. Sequential element visibility reveals
        if (this.elements.decode) {
            this.elements.decode.classList.toggle('visible', p >= this.DECODE_AT);
        }
        if (this.elements.sanskrit) {
            this.elements.sanskrit.classList.toggle('visible', p >= this.SANSKRIT_AT);
        }
        if (this.elements.nameLeft) {
            this.elements.nameLeft.classList.toggle('visible', p >= this.NAME_AT);
        }
        if (this.elements.nameRight) {
            this.elements.nameRight.classList.toggle('visible', p >= this.NAME_AT);
        }
        if (this.elements.joshiText) {
            this.elements.joshiText.classList.toggle('visible', p >= this.JOSHI_AT);
        }
        if (this.elements.info) {
            this.elements.info.classList.toggle('visible', p >= this.INFO_AT);
        }
        if (this.elements.quote) {
            this.elements.quote.classList.toggle('visible', p >= this.QUOTE_AT);
        }
    }
}
