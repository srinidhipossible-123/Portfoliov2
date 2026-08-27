// Import modular stylesheets
import '../styles/main.css';
import '../styles/hero.css';
import '../styles/about.css';
import '../styles/skills.css';
import '../styles/myworks.css';
import '../styles/domeGallery.css';
import '../styles/myjourney.css';
import '../styles/footer.css';

// Import modular scripts
import { AnimationEngine } from './animationEngine.js';
import { ScrollManager } from './scrollManager.js';
import { buildHoneycomb } from './skillsHoneycomb.js';
import { ClickSpark } from './clickSpark.js';
import { initMyWorksCarousel } from './myWorksCarousel.js';
import { initDomeGallery } from './domeGallery.js';
import { initMyJourneySection } from './myJourney.js';
import { initLaserFlow } from './laserFlow.js';

// Initialize application
function initApp() {
    try {
        const engine = new AnimationEngine('animation-canvas', 240);
        new ScrollManager(engine, { heroContainerId: 'heroContainer' });
    } catch (e) {
        console.warn('Hero canvas error:', e);
    }

    try { buildHoneycomb(); } catch (e) { console.warn('Honeycomb error:', e); }
    try { initMyWorksCarousel(); } catch (e) { console.warn('MyWorks error:', e); }
    try { initDomeGallery('beyondCodeDomeStage'); } catch (e) { console.warn('DomeGallery error:', e); }
    try { initMyJourneySection(); } catch (e) { console.warn('MyJourney error:', e); }

    // React Bits <LaserFlow /> component for About Section
    try {
        initLaserFlow('#aboutLaserFlow', {
            color: '#ff6200', // Rich radiant sunlight amber streak
            horizontalBeamOffset: 0.1,
            verticalBeamOffset: 0.0,
            flowSpeed: 0.35,
            fogIntensity: 0.55,
            wispDensity: 1.2,
            wispIntensity: 5.0
        });
    } catch (e) {
        console.error('LaserFlow error:', e);
    }

    // React Bits <ClickSpark /> component integration
    try {
        new ClickSpark({
            sparkColor: '#fff',
            sparkSize: 10,
            sparkRadius: 15,
            sparkCount: 8,
            duration: 400,
            easing: 'ease-out',
            extraScale: 1.0,
        });
    } catch (e) {
        console.warn('ClickSpark error:', e);
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
