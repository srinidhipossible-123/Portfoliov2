/**
 * MyJourney — Orchestrator for My Journey Section
 *
 * Coordinates:
 * 1. <LightRays /> WebGL shader background (amber solar glow)
 * 2. <OptionWheel /> manual click-driven 4-year wheel
 * 3. Dynamic interactive Journey Showcase Card
 */
import { LightRays } from './lightRays.js';
import { OptionWheel } from './optionWheel.js';

const JOURNEY_DATA = [
    {
        year: '1st Year',
        period: '2022 – 2023',
        tagline: 'Foundation & National Benchmark',
        headline: 'BIS Second Prize Winner',
        summary: 'Achieved Second Prize in the prestigious national competition conducted by the Bureau of Indian Standards (BIS), establishing a benchmark of technical discipline and analytical logic.',
        highlights: [
            {
                badge: 'National Honor',
                title: 'Bureau of Indian Standards (BIS)',
                desc: 'Awarded 2nd prize at the national level for engineering analysis and standardization excellence.'
            },
            {
                badge: 'Core Exploration',
                title: 'Data Structures & Logic',
                desc: 'Built rigorous foundations in algorithmic problem solving, computational logic, and modular software architecture.'
            }
        ],
        tags: ['BIS Second Prize', 'Algorithms', 'Logic & Systems', 'National Contest']
    },
    {
        year: '2nd Year',
        period: '2023 – 2024',
        tagline: 'Innovation & National Recognition',
        headline: 'SIH 2024 Grand Finalist',
        summary: 'Selected as a Grand Finalist at Smart India Hackathon (SIH) 2024, competing against thousands of teams nationwide to engineer high-impact solutions.',
        highlights: [
            {
                badge: 'Smart India Hackathon',
                title: 'SIH 2024 Grand Finalist',
                desc: 'Architected and presented scalable software solutions addressing critical government and industry problem statements.'
            },
            {
                badge: 'Full-Stack Mastery',
                title: 'Collaborative Rapid Prototyping',
                desc: 'Mastered high-velocity development cycles, distributed databases, and real-time backend pipelines.'
            }
        ],
        tags: ['SIH 2024 Grand Finalist', 'Full Stack', 'System Architecture', 'Rapid Prototyping']
    },
    {
        year: '3rd Year',
        period: '2024 – 2025',
        tagline: 'Global Stage, Cyber Defense & Google Tokyo',
        headline: 'E-Raksha, Cyber Summit & Google Japan',
        summary: 'A landmark year of international recognition, representing India on national summit stages and competing in-person at Google Japan in Tokyo.',
        highlights: [
            {
                badge: 'Cyber Defense',
                title: '2nd Runner-up — E-Raksha Hackathon 2026',
                desc: 'Awarded 2nd Runner-up for innovative cyber-threat mitigation, defense architecture, and security tooling.'
            },
            {
                badge: 'National Summit',
                title: 'Invitation: AI Summit 2026 Pre-event Cybersummit',
                desc: 'Official invitation to attend the prestigious Cybersummit at Bharat Mandapam, New Delhi.'
            },
            {
                badge: 'Global Stage',
                title: 'Google Gemini AI Hackathon (Google Japan, Tokyo)',
                desc: 'Shortlisted and participated in-person at Google Japan headquarters in Tokyo, building multimodal Gemini AI solutions.'
            }
        ],
        tags: ['E-Raksha 2nd Runner-up', 'Bharat Mandapam, New Delhi', 'Google Japan, Tokyo', 'Gemini AI']
    },
    {
        year: '4th Year',
        period: '2025 – Present',
        tagline: 'Enterprise AI & Industry Leadership',
        headline: 'AI Intern @ Altimetrik (Flex Team)',
        summary: 'Currently driving production generative AI systems as an AI Intern at Altimetrik, contributing to high-impact enterprise solutions as part of the elite Flex engineering team.',
        highlights: [
            {
                badge: 'Current Role',
                title: 'AI Intern — Flex Engineering Team',
                desc: 'Engineering enterprise LLM pipelines, autonomous multi-agent workflows, and scalable AI infrastructure.'
            },
            {
                badge: 'Production Impact',
                title: 'Enterprise AI Implementation',
                desc: 'Shipping resilient production-ready machine learning solutions bridging research algorithms with commercial scale.'
            }
        ],
        tags: ['Altimetrik', 'AI Intern', 'Flex Team', 'Generative AI', 'Active Role']
    }
];

export class MyJourneySection {
    constructor() {
        this.section = document.getElementById('myJourneySection');
        if (!this.section) return;

        this.cardContainer = document.getElementById('myJourneyCard');
        this.wheelContainer = document.getElementById('myJourneyWheel');
        this.raysContainer = document.getElementById('myJourneyRays');

        this.currentIndex = 0;
        this.init();
    }

    init() {
        // 1. Initialize LightRays WebGL shader background (solar amber glow)
        if (this.raysContainer) {
            try {
                this.lightRays = new LightRays(this.raysContainer, {
                    raysOrigin: 'top-center',
                    raysColor: '#ff8c00',
                    raysSpeed: 1.1,
                    lightSpread: 0.82,
                    rayLength: 1.7,
                    pulsating: true,
                    followMouse: true,
                    mouseInfluence: 0.12,
                    noiseAmount: 0.03,
                    distortion: 0.03
                });
            } catch (err) {
                console.warn('[MyJourney] WebGL LightRays skipped:', err);
            }
        }

        // 2. Initialize OptionWheel (Manual click selection, zero scroll hijack)
        if (this.wheelContainer) {
            this.optionWheel = new OptionWheel(this.wheelContainer, {
                items: ['1st Year', '2nd Year', '3rd Year', '4th Year'],
                defaultSelected: 0,
                side: 'left',
                fontSize: 2.2,
                spacing: 1.55,
                curve: 0.95,
                tilt: 8.5,
                blur: 1.5,
                fade: 0.28,
                minOpacity: 0.2,
                smoothing: 180,
                inset: 30,
                textColor: '#666670',
                activeColor: '#ffffff',
                onChange: (idx) => this.renderCard(idx)
            });
        }

        // 3. Render initial card content
        this.renderCard(0);
    }

    renderCard(index) {
        this.currentIndex = index;
        const data = JOURNEY_DATA[index];
        if (!data || !this.cardContainer) return;

        // Smooth transition
        this.cardContainer.classList.add('transitioning');

        setTimeout(() => {
            this.cardContainer.innerHTML = `
                <div class="journey-card-header">
                    <div class="journey-period-badge">
                        <span class="journey-badge-dot"></span>
                        <span>${data.period}</span>
                    </div>
                    <span class="journey-tagline">${data.tagline}</span>
                </div>

                <h3 class="journey-headline">${data.headline}</h3>
                <p class="journey-summary">${data.summary}</p>

                <div class="journey-milestones">
                    ${data.highlights.map(h => `
                        <div class="journey-milestone-item">
                            <div class="milestone-badge">${h.badge}</div>
                            <h4 class="milestone-title">${h.title}</h4>
                            <p class="milestone-desc">${h.desc}</p>
                        </div>
                    `).join('')}
                </div>

                <div class="journey-tags">
                    ${data.tags.map(t => `<span class="journey-pill">${t}</span>`).join('')}
                </div>
            `;

            requestAnimationFrame(() => {
                this.cardContainer.classList.remove('transitioning');
            });
        }, 120);
    }
}

export function initMyJourneySection() {
    return new MyJourneySection();
}

export default MyJourneySection;
