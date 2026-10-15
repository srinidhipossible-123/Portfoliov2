/**
 * MyWorksCarousel — 3D Semi-Circular Automatic Rotating Project Showcase
 *
 * Rotates project cards in an infinite semi-circular 3D loop with depth scaling,
 * perspective rotation, touch/mouse drag velocity, hover-deceleration,
 * and click-to-focus behavior. Includes IntersectionObserver RAF pausing.
 */

const PROJECTS = [
    {
        title: "G M School of Law — GM University",
        description: "Official academic web platform for the School of Law at GM University. The website acts as a central digital hub for law students, faculty, legal professionals, and prospective applicants.",
        tech: ["HTML5", "CSS3", "JavaScript", "University CMS", "Responsive UI"],
        image: "/projects/llb.webp",
        role: "Full-Stack Web Developer",
        year: "2024–2025",
        impact: "Live Production System",
        demo: "https://gmu.ac.in/LLb/",
        code: "",
        mode: "industry",
    },
    {
        title: "GMU DS & IoT Department Website",
        description: "Official institutional website for the Department of Data Science & IoT at GM University, hosted on the university domain and used by students, faculty, applicants, and industry partners.",
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive UI", "Accessibility"],
        image: "/projects/data.webp",
        role: "Full-Stack Web Developer (Team Project)",
        year: "2024–2025",
        impact: "Live on GM University official domain",
        demo: "https://gmu.ac.in/data_science/",
        code: "",
        mode: "industry",
    },
    {
        title: "GMU Biotechnology Department Website",
        description: "Official academic website for the Department of Biotechnology at GM University, providing programs, research, faculty, labs, student projects, and achievements on the university’s main portal.",
        tech: ["HTML5", "CSS3", "JavaScript", "Responsive UI", "Accessibility"],
        image: "/projects/bio.webp",
        role: "Full-Stack Web Developer (Industry Collaboration)",
        year: "2024–2025",
        impact: "Live production site on GM University portal",
        demo: "https://gmu.ac.in/biotech/",
        code: "",
        mode: "industry",
    },
    {
        title: "GMU Civil Engineering Department Website",
        description: "Official academic website for the Department of Civil Engineering at GM University, centralizing programs, labs, faculty, infrastructure, and student achievements for real-world academic use.",
        tech: ["HTML", "CSS", "JavaScript", "Responsive UI", "Accessibility"],
        image: "/projects/civil.webp",
        role: "Full-Stack Web Developer (Industry Collaboration)",
        year: "2024–2025",
        impact: "Live production portal for Civil Engineering",
        demo: "https://civil-dept.netlify.app/",
        code: "https://github.com/srinidhipossible-123/civil-department.git",
        mode: "industry",
    },
    {
        title: "Ignitron 2K25 – Championship Leaderboard",
        description: "Real-time, event-grade web application developed in collaboration with the IGNITRON 2K25 Tech Fest at GM University. Centralized score tracking platform.",
        tech: ["React", "Next.js", "Node.js", "MongoDB", "Vercel"],
        image: "/projects/lead.webp",
        role: "Full-Stack Developer",
        year: "2025",
        impact: "Used by Ignitron 2K25 organizers",
        demo: "https://ignitron-leaderboard.vercel.app/",
        code: "https://github.com/srinidhipossible-123/IgnitronLeaderboard.git",
        mode: "industry",
    },
    {
        title: "AI Resume Analyzer",
        description: "An NLP-powered web application that automatically evaluates resumes, extracts skills, and generates intelligent scoring and improvement recommendations for job seekers and recruiters.",
        tech: ["Python", "Flask", "NLP", "Scikit-Learn", "HTML5", "CSS3", "JavaScript"],
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
        role: "Sole Developer",
        year: "2024",
        impact: "Automated Resume Screening",
        demo: "#",
        code: "#",
        mode: "personal",
    },
];

export class MyWorksCarousel {
    constructor(containerId = 'myWorksCarousel') {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.cards = [];
        this.currentAngle = 0;
        this.targetAngle = null;
        this.baseSpeed = 0.00032; // radians per ms (~19s per full loop)
        this.currentSpeed = this.baseSpeed;
        this.isHovered = false;
        this.isDragging = false;
        this.dragStartX = 0;
        this.lastDragX = 0;
        this.dragVelocity = 0;
        this.lastTime = performance.now();
        this.animationId = null;
        this.inView = true;

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
        this.initObserver();

        // Start animation loop
        this.startLoop();
    }

    initObserver() {
        if (!window.IntersectionObserver) return;
        this.io = new IntersectionObserver((entries) => {
            const entry = entries[0];
            this.inView = entry ? entry.isIntersecting : true;
            if (this.inView && !this.animationId) {
                this.lastTime = performance.now();
                this.startLoop();
            }
        }, { threshold: 0.01 });

        this.io.observe(this.container);
    }

    createCardElement(project, index) {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-index', index);
        card.setAttribute('role', 'group');
        card.setAttribute('aria-label', project.title);

        const modeLabel = project.mode === 'industry' ? 'Industry' : 'Personal';
        const hasCode = project.code && project.code !== '#' && project.code.trim() !== '';
        const hasDemo = project.demo && project.demo !== '#' && project.demo.trim() !== '';

        card.innerHTML = `
            <img class="project-card-image" src="${project.image}" alt="${project.title}" loading="lazy" />
            <div class="project-card-overlay"></div>

            <div class="project-card-badge">
                <span class="project-badge-dot"></span>
                <span>${modeLabel} • ${project.year}</span>
            </div>

            <div class="project-card-impact" title="${project.impact}">
                <span class="impact-star">✦</span>
                <span class="impact-text">${project.impact}</span>
            </div>

            <div class="project-card-content">
                <div class="project-card-role">${project.role}</div>
                <h3 class="project-card-title">${project.title}</h3>
                <p class="project-card-desc">${project.description}</p>

                <div class="project-card-tags">
                    ${project.tech.map(tag => `<span class="tech-pill">${tag}</span>`).join('')}
                </div>

                <div class="project-card-actions">
                    <div class="project-links-group">
                        ${hasCode ? `
                            <a href="${project.code}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-secondary" title="View Source on GitHub">
                                <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                                <span>Code</span>
                            </a>
                        ` : `
                            <span class="project-btn project-btn-secondary project-btn-disabled" title="Proprietary / University Hosted">
                                <span>Production</span>
                            </span>
                        `}

                        ${hasDemo ? `
                            <a href="${project.demo}" target="_blank" rel="noopener noreferrer" class="project-btn project-btn-primary" title="View Live Project">
                                <span>Live Demo</span>
                                <svg viewBox="0 0 24 24"><path d="M5 19L19 5M19 5H9M19 5V15" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
                            </a>
                        ` : `
                            <span class="project-btn project-btn-primary project-btn-disabled" title="Internal Tooling">
                                <span>Offline</span>
                            </span>
                        `}
                    </div>
                </div>
            </div>
        `;

        // Click non-link card area to rotate to front
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;
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
        this.targetAngle = null;
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
        const targetCardAngle = -(index * ((2 * Math.PI) / N));
        const diff = (targetCardAngle - this.currentAngle) % (2 * Math.PI);
        const shortestDiff = Math.atan2(Math.sin(diff), Math.cos(diff));
        this.targetAngle = this.currentAngle + shortestDiff;
    }

    getRadii() {
        const w = window.innerWidth;
        if (w <= 480) {
            return { rx: 190, rz: 140 };
        } else if (w <= 768) {
            return { rx: 270, rz: 190 };
        } else if (w <= 1024) {
            return { rx: 360, rz: 240 };
        }
        return { rx: 450, rz: 290 };
    }

    startLoop() {
        const animate = (timestamp) => {
            if (!this.inView) {
                this.animationId = null;
                return;
            }

            const dt = Math.min(timestamp - this.lastTime, 64);
            this.lastTime = timestamp;

            if (!this.isDragging) {
                if (this.targetAngle !== null) {
                    const diff = this.targetAngle - this.currentAngle;
                    if (Math.abs(diff) < 0.001) {
                        this.currentAngle = this.targetAngle;
                        this.targetAngle = null;
                    } else {
                        this.currentAngle += diff * 0.08;
                    }
                } else {
                    if (Math.abs(this.dragVelocity) > 0.0001) {
                        this.currentAngle += this.dragVelocity;
                        this.dragVelocity *= 0.92;
                    } else {
                        const targetSpeed = this.isHovered ? 0.00006 : this.baseSpeed;
                        this.currentSpeed += (targetSpeed - this.currentSpeed) * 0.06;
                        this.currentAngle += this.currentSpeed * dt;
                    }
                }
            }

            this.updateCardPositions();
            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    updateCardPositions() {
        const N = PROJECTS.length;
        const { rx, rz } = this.getRadii();

        this.cards.forEach(({ element, index }) => {
            const phi = this.currentAngle + (index * (2 * Math.PI / N));
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            // Normalized depth: 1 = front, 0 = back
            const depth = (cosPhi + 1) / 2;

            const x = Math.round(rx * sinPhi);
            const z = Math.round(rz * (cosPhi - 1));

            const scale = (0.72 + 0.32 * depth).toFixed(3);
            const rotateY = (-sinPhi * 24).toFixed(2);
            const opacity = (0.35 + 0.65 * depth).toFixed(3);
            const zIndex = Math.round(depth * 100);
            const blur = Math.max(0, (1 - depth) * 3).toFixed(1);

            element.style.transform = `translate3d(${x}px, 0px, ${z}px) rotateY(${rotateY}deg) scale(${scale})`;
            element.style.opacity = opacity;
            element.style.zIndex = zIndex;
            element.style.filter = `blur(${blur}px)`;

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
        if (this.io) {
            this.io.disconnect();
        }
    }
}

export function initMyWorksCarousel(containerId) {
    return new MyWorksCarousel(containerId);
}

export default MyWorksCarousel;
