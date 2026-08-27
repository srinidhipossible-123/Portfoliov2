/**
 * MyWorksCarousel — 3D Semi-Circular Automatic Rotating Project Showcase
 *
 * Rotates cards in an infinite semi-circular 3D loop with depth scaling,
 * perspective rotation, touch/mouse drag velocity, hover-deceleration,
 * and click-to-focus behavior.
 */

const PROJECTS = [
    {
        id: 'dancing-dunes',
        title: 'Dancing Dunes AI',
        category: 'AI / Deep Learning',
        desc: 'Autonomous neural landscape generator synthesizing multi-spectral terrain topologies in real-time.',
        tags: ['PyTorch', 'Python', 'FastAPI', 'CUDA'],
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
        github: 'https://github.com/srinidhisjoshi',
        demo: 'https://srinidhisjoshi.dev/works/dancing-dunes',
    },
    {
        id: 'ocean-depth',
        title: 'OceanDepth Analytics',
        category: 'Computer Vision',
        desc: 'Subsea acoustic telemetry and marine object detection system operating with sub-40ms edge inference.',
        tags: ['OpenCV', 'Docker', 'TensorRT', 'AWS'],
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80',
        github: 'https://github.com/srinidhisjoshi',
        demo: 'https://srinidhisjoshi.dev/works/ocean-depth',
    },
    {
        id: 'cortex-mesh',
        title: 'CortexMesh Studio',
        category: 'Generative AI',
        desc: 'Visual node canvas for fine-tuning open-weights models and orchestrating multi-agent collaboration.',
        tags: ['React', 'Next.js', 'HuggingFace', 'Ollama'],
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        github: 'https://github.com/srinidhisjoshi',
        demo: 'https://srinidhisjoshi.dev/works/cortex-mesh',
    },
    {
        id: 'alpine-stream',
        title: 'AlpineStream Engine',
        category: 'Distributed Systems',
        desc: 'High-throughput fault-tolerant streaming architecture handling 150k+ event messages per second.',
        tags: ['Django', 'PostgreSQL', 'Redis', 'Kafka'],
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
        github: 'https://github.com/srinidhisjoshi',
        demo: 'https://srinidhisjoshi.dev/works/alpine-stream',
    },
    {
        id: 'aether-flow',
        title: 'AetherFlow Next',
        category: 'Full Stack & Cloud',
        desc: 'Cloud-native microservices platform orchestrating dynamic serverless workloads with zero cold-starts.',
        tags: ['TypeScript', 'Node.js', 'Tailwind', 'Docker'],
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        github: 'https://github.com/srinidhisjoshi',
        demo: 'https://srinidhisjoshi.dev/works/aether-flow',
    },
];

export class MyWorksCarousel {
    constructor(containerId = 'myWorksCarousel') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.cards = [];
        this.currentAngle = 0;
        this.targetAngle = null;
        this.baseSpeed = 0.00038; // radians per ms (~16.5s per full loop)
        this.currentSpeed = this.baseSpeed;
        this.isHovered = false;
        this.isDragging = false;
        this.dragStartX = 0;
        this.lastDragX = 0;
        this.dragVelocity = 0;
        this.lastTime = performance.now();
        this.animationId = null;

        this.init();
    }

    init() {
        this.container.innerHTML = '';
        this.stage = document.createElement('div');
        this.stage.className = 'myworks-stage';
        this.container.appendChild(this.stage);

        this.carousel = document.createElement('div');
        this.carousel.className = 'myworks-carousel';
        this.stage.appendChild(this.carousel);

        // Build DOM for each project card
        PROJECTS.forEach((project, index) => {
            const card = this.createCardElement(project, index);
            this.carousel.appendChild(card);
            this.cards.push({
                element: card,
                index,
                data: project,
            });
        });

        // Event listeners
        this.attachEventListeners();

        // Start animation loop
        this.animationId = requestAnimationFrame(timestamp => this.animate(timestamp));
    }

    createCardElement(project, index) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-index', index);
        card.setAttribute('role', 'group');
        card.setAttribute('aria-label', project.title);

        card.innerHTML = `
            <img class="project-card-image" src="${project.image}" alt="${project.title}" loading="lazy" />
            <div class="project-card-overlay"></div>

            <div class="project-card-badge">
                <span class="project-badge-dot"></span>
                <span>${project.category}</span>
            </div>

            <div class="project-card-content">
                <h3 class="project-card-title">${project.title}</h3>
                <p class="project-card-desc">${project.desc}</p>

                <div class="project-card-tags">
                    ${project.tags.map(tag => `<span class="tech-pill">${tag}</span>`).join('')}
                </div>

                <div class="project-card-actions">
                    <div class="project-links-group">
                        <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-secondary" title="View Source on GitHub">
                            <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                            <span>Code</span>
                        </a>
                        <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-primary" title="View Live Project">
                            <span>Live Demo</span>
                            <svg viewBox="0 0 24 24"><path d="M5 19L19 5M19 5H9M19 5V15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Click non-link card area to rotate to front
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // let link handle click
            this.focusCard(index);
        });

        return card;
    }

    attachEventListeners() {
        // Hover pause / deceleration
        this.stage.addEventListener('mouseenter', () => {
            this.isHovered = true;
        });

        this.stage.addEventListener('mouseleave', () => {
            this.isHovered = false;
        });

        // Mouse Drag
        this.stage.addEventListener('mousedown', (e) => this.onDragStart(e.clientX));
        window.addEventListener('mousemove', (e) => this.onDragMove(e.clientX));
        window.addEventListener('mouseup', () => this.onDragEnd());

        // Touch Drag
        this.stage.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) this.onDragStart(e.touches[0].clientX);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (this.isDragging && e.touches.length === 1) {
                this.onDragMove(e.touches[0].clientX);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => this.onDragEnd());
    }

    onDragStart(x) {
        this.isDragging = true;
        this.dragStartX = x;
        this.lastDragX = x;
        this.dragVelocity = 0;
        this.targetAngle = null; // cancel click-to-focus animation
    }

    onDragMove(x) {
        if (!this.isDragging) return;
        const deltaX = x - this.lastDragX;
        this.lastDragX = x;
        this.dragVelocity = deltaX * 0.0035;
        this.currentAngle += this.dragVelocity;
    }

    onDragEnd() {
        this.isDragging = false;
    }

    focusCard(index) {
        const N = PROJECTS.length;
        // Calculate shortest angular distance to bring card to front (angle = 0 mod 2*PI)
        const targetCardAngle = -(index * ((2 * Math.PI) / N));
        const diff = (targetCardAngle - this.currentAngle) % (2 * Math.PI);
        const shortestDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
        this.targetAngle = this.currentAngle + shortestDiff;
    }

    getRadii() {
        const w = window.innerWidth;
        if (w <= 480) {
            return { rx: 180, rz: 130 };
        } else if (w <= 768) {
            return { rx: 250, rz: 180 };
        } else if (w <= 1024) {
            return { rx: 320, rz: 220 };
        }
        return { rx: 390, rz: 260 };
    }

    animate(timestamp) {
        const dt = Math.min(timestamp - this.lastTime, 64);
        this.lastTime = timestamp;

        if (!this.isDragging) {
            if (this.targetAngle !== null) {
                // Lerp towards target angle
                const diff = this.targetAngle - this.currentAngle;
                if (Math.abs(diff) < 0.001) {
                    this.currentAngle = this.targetAngle;
                    this.targetAngle = null;
                } else {
                    this.currentAngle += diff * 0.08;
                }
            } else {
                // Decelerate drag velocity
                if (Math.abs(this.dragVelocity) > 0.0001) {
                    this.currentAngle += this.dragVelocity;
                    this.dragVelocity *= 0.92;
                } else {
                    // Smooth automatic rotation
                    const targetSpeed = this.isHovered ? 0.00008 : this.baseSpeed;
                    this.currentSpeed += (targetSpeed - this.currentSpeed) * 0.06;
                    this.currentAngle += this.currentSpeed * dt;
                }
            }
        }

        // Render card positions
        this.updateCardPositions();

        this.animationId = requestAnimationFrame(ts => this.animate(ts));
    }

    updateCardPositions() {
        const N = PROJECTS.length;
        const { rx, rz } = this.getRadii();

        this.cards.forEach(({ element, index }) => {
            const phi = this.currentAngle + (index * (2 * Math.PI / N));

            // Semi-circular orbit: front card is at cos(phi) = 1 (z = 0)
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            // Normalized depth: 1 = closest/front, 0 = farthest/back
            const depth = (cosPhi + 1) / 2;

            const x = Math.round(rx * sinPhi);
            const z = Math.round(rz * (cosPhi - 1));

            // Visual dynamics based on depth
            const scale = (0.72 + 0.32 * depth).toFixed(3);
            const rotateY = (-sinPhi * 26).toFixed(2);
            const opacity = (0.35 + 0.65 * depth).toFixed(3);
            const zIndex = Math.round(depth * 100);
            const blur = Math.max(0, (1 - depth) * 3).toFixed(1);

            element.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`;
            element.style.opacity = opacity;
            element.style.zIndex = zIndex;
            element.style.filter = `blur(${blur}px)`;

            // Highlight front card
            if (depth > 0.94) {
                element.classList.add('is-front');
            } else {
                element.classList.remove('is-front');
            }
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

export function initMyWorksCarousel(containerId) {
    return new MyWorksCarousel(containerId);
}

export default MyWorksCarousel;
