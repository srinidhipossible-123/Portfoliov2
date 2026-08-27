/**
 * Skills Honeycomb — 3D Mechanical Keyboard Grid
 * Perfectly Symmetrical 17-Hexagon Honeycomb Rosette
 *
 * Coordinates centered at (0, 0) for Skills:
 * - Row -2 (Y = -2): (-1, -2), (0, -2), (+1, -2)       [3 hexes]
 * - Row -1 (Y = -1): (-1.5, -1), (-0.5, -1), (+0.5, -1), (+1.5, -1) [4 hexes]
 * - Row  0 (Y =  0): (-2, 0), (-1, 0), (0, 0 [Skills]), (+1, 0), (+2, 0) [5 hexes]
 * - Row +1 (Y = +1): (-1.5, +1), (-0.5, +1), (+0.5, +1), (+1.5, +1) [4 hexes]
 * - Row +2 (Y = +2): (0, +2)                          [1 hex touching arc]
 *
 * Total: 3 + 4 + 5 + 4 + 1 = 17 hexagons
 */

const HEX_WIDTH = 98;
const HEX_HEIGHT = 113;
const DELTA_X = 104; // Hex width + uniform 6px gap
const DELTA_Y = 90;  // Exact vertical row step

// Center anchor so coordinate (0, 0) is the center "Skills" key
const ORIGIN_X = 231; // Center of 560px container
const ORIGIN_Y = 190; // Center row Y

const SKILLS = [
    // Row -2 (Top: 3 hexes, mirror-symmetric)
    { id: 'top_left',    row: -2, col: -1.0, isCenter: false },
    { id: 'top_mid',     row: -2, col:  0.0, isCenter: false },
    { id: 'top_right',   row: -2, col:  1.0, isCenter: false },

    // Row -1 (Upper: 4 hexes, mirror-symmetric)
    { id: 'r1_left',     row: -1, col: -1.5, isCenter: false },
    { id: 'r1_midleft',  row: -1, col: -0.5, isCenter: false },
    { id: 'r1_midright', row: -1, col:  0.5, isCenter: false },
    { id: 'r1_right',    row: -1, col:  1.5, isCenter: false },

    // Row 0 (Middle: 5 hexes, with Skills dead center at 0,0)
    { id: 'r0_farleft',  row:  0, col: -2.0, isCenter: false },
    { id: 'r0_left',     row:  0, col: -1.0, isCenter: false },
    { id: 'center',      row:  0, col:  0.0, isCenter: true, label: 'Skills' },
    { id: 'r0_right',    row:  0, col:  1.0, isCenter: false },
    { id: 'r0_farright', row:  0, col:  2.0, isCenter: false },

    // Row +1 (Lower: 4 hexes, mirror-symmetric)
    { id: 'r2_left',     row:  1, col: -1.5, isCenter: false },
    { id: 'r2_midleft',  row:  1, col: -0.5, isCenter: false },
    { id: 'r2_midright', row:  1, col:  0.5, isCenter: false },
    { id: 'r2_right',    row:  1, col:  1.5, isCenter: false },

    // Row +2 (Bottom: 1 hex, touching the glowing planet arc)
    { id: 'bottom_mid',  row:  2, col:  0.0, isCenter: false },
];

// Helper: Check if two hexes are spatial neighbors
function areAdjacent(a, b) {
    const dr = Math.abs(a.row - b.row);
    const dc = Math.abs(a.col - b.col);
    if (dr === 0 && Math.abs(dc - 1.0) < 0.05) return true;
    if (dr === 1 && Math.abs(dc - 0.5) < 0.05) return true;
    return false;
}

// Build dynamic adjacency map
const ADJACENCY = {};
SKILLS.forEach(a => {
    ADJACENCY[a.id] = SKILLS.filter(b => a.id !== b.id && areAdjacent(a, b)).map(b => b.id);
});

// Web Audio API tactile mechanical click synthesizer
let audioCtx = null;

function playMechanicalClick() {
    try {
        if (!audioCtx) {
            const AudioClass = window.AudioContext || window.webkitAudioContext;
            if (AudioClass) audioCtx = new AudioClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        if (!audioCtx) return;

        const now = audioCtx.currentTime;

        // Bottom thock
        const oscThock = audioCtx.createOscillator();
        const gainThock = audioCtx.createGain();

        oscThock.type = 'triangle';
        oscThock.frequency.setValueAtTime(160, now);
        oscThock.frequency.exponentialRampToValueAtTime(35, now + 0.035);

        gainThock.gain.setValueAtTime(0.2, now);
        gainThock.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        oscThock.connect(gainThock);
        gainThock.connect(audioCtx.destination);

        oscThock.start(now);
        oscThock.stop(now + 0.04);

        // Crisp snap
        const oscSnap = audioCtx.createOscillator();
        const gainSnap = audioCtx.createGain();

        oscSnap.type = 'sine';
        oscSnap.frequency.setValueAtTime(1400, now);
        oscSnap.frequency.exponentialRampToValueAtTime(400, now + 0.012);

        gainSnap.gain.setValueAtTime(0.08, now);
        gainSnap.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

        oscSnap.connect(gainSnap);
        gainSnap.connect(audioCtx.destination);

        oscSnap.start(now);
        oscSnap.stop(now + 0.015);
    } catch (e) {
        // Audio optional
    }
}

// BFS distance calculator
function getBfsDistances(startId) {
    const distances = new Map([[startId, 0]]);
    const queue = [startId];
    while (queue.length) {
        const cur = queue.shift();
        const dist = distances.get(cur);
        const neighbors = ADJACENCY[cur] || [];
        for (const nb of neighbors) {
            if (!distances.has(nb)) {
                distances.set(nb, dist + 1);
                queue.push(nb);
            }
        }
    }
    return distances;
}

// Build 3D Keycap element
function createHexKey(skill) {
    const x = ORIGIN_X + skill.col * DELTA_X;
    const y = ORIGIN_Y + skill.row * DELTA_Y;

    const btn = document.createElement('button');
    btn.className = 'hex-key' + (skill.isCenter ? ' center-key' : '');
    btn.setAttribute('data-id', skill.id);
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-label', skill.isCenter ? 'Skills' : skill.id);
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    // Layer 1: Perimeter seam backlight (sparks on click)
    const backlight = document.createElement('div');
    backlight.className = 'hex-backlight';

    // Layer 2: 3D extruded base (depth)
    const base = document.createElement('div');
    base.className = 'hex-base';

    // Layer 3: 3D bevel & perimeter chamfer
    const border = document.createElement('div');
    border.className = 'hex-border';

    // Layer 4: Dark solid keycap top surface
    const top = document.createElement('div');
    top.className = 'hex-top';

    if (skill.isCenter) {
        const centerLabel = document.createElement('span');
        centerLabel.className = 'hex-center-label';
        centerLabel.textContent = 'Skills';
        top.appendChild(centerLabel);
    } else {
        // Empty slot ready for custom SVG logos
        const slot = document.createElement('div');
        slot.className = 'hex-svg-slot';
        slot.setAttribute('data-skill-id', skill.id);
        top.appendChild(slot);
    }

    btn.appendChild(backlight);
    btn.appendChild(base);
    btn.appendChild(border);
    btn.appendChild(top);

    return btn;
}

// Build and inject the Honeycomb board
function buildHoneycomb() {
    const section = document.getElementById('skillsSection');
    if (!section) return;

    // Clear previous contents
    section.innerHTML = '';

    const stage = document.createElement('div');
    stage.className = 'honeycomb-stage';

    const wrapper = document.createElement('div');
    wrapper.className = 'honeycomb-wrapper';
    stage.appendChild(wrapper);
    section.appendChild(stage);

    const keyMap = {};

    SKILLS.forEach(skill => {
        const btn = createHexKey(skill);
        wrapper.appendChild(btn);
        keyMap[skill.id] = btn;

        btn.addEventListener('click', () => handleKeyClick(skill.id, keyMap));
    });

    return keyMap;
}

let activeTimeouts = [];

function clearAnimation(keyMap) {
    activeTimeouts.forEach(t => clearTimeout(t));
    activeTimeouts = [];
    Object.values(keyMap).forEach(el => {
        el.classList.remove('pressing', 'spark', 'glow-1', 'glow-2', 'grid-breathing', 'returning');
    });
}

function handleKeyClick(clickedId, keyMap) {
    clearAnimation(keyMap);

    const clickedEl = keyMap[clickedId];
    if (!clickedEl) return;

    // ==========================================
    // STAGE 1: ON CLICK (Keypress & Seam Ignition)
    // ==========================================
    playMechanicalClick();

    clickedEl.classList.add('pressing');
    const tPress = setTimeout(() => {
        clickedEl.classList.remove('pressing');
    }, 110);
    activeTimeouts.push(tPress);

    // Instant spark on the clicked keycap
    clickedEl.classList.add('spark');

    // ==========================================
    // STAGE 2: WAVE PROPAGATION (BFS Ripple)
    // ==========================================
    const distances = getBfsDistances(clickedId);

    distances.forEach((dist, id) => {
        if (id === clickedId) return; // already sparked

        const el = keyMap[id];
        if (!el) return;

        let sparkClass, delay;
        if (dist === 1) {
            sparkClass = 'glow-1';
            delay = 140; // Ring 1 neighbors
        } else {
            sparkClass = 'glow-2';
            delay = 140 + dist * 90; // Outer rings
        }

        const tWave = setTimeout(() => {
            el.classList.add(sparkClass);
        }, delay);

        activeTimeouts.push(tWave);
    });

    // ==========================================
    // STAGE 3: UNIFIED GRID BREATHING EFFECT
    // ==========================================
    const tBreathing = setTimeout(() => {
        Object.values(keyMap).forEach(el => {
            el.classList.remove('spark', 'glow-1', 'glow-2');
            el.classList.add('grid-breathing');
        });
    }, 700);
    activeTimeouts.push(tBreathing);

    // ==========================================
    // STAGE 4: RETURN TO IDLE
    // ==========================================
    const tReturn = setTimeout(() => {
        Object.values(keyMap).forEach(el => {
            el.classList.remove('grid-breathing');
            el.classList.add('returning');
        });

        const tCleanup = setTimeout(() => {
            Object.values(keyMap).forEach(el => {
                el.classList.remove('returning');
            });
        }, 900);
        activeTimeouts.push(tCleanup);
    }, 2850);
    activeTimeouts.push(tReturn);
}

export { buildHoneycomb };
