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
        year: 'Year 01',
        period: 'Year 01 — Foundation',
        tagline: 'Academic Excellence & First Exposure',
        headline: 'YEAR 01 — FOUNDATION',
        focus: 'Academic Excellence & First Exposure',
        points: [
            'Joined GM University through KCET seat allocation with a PCMB background and no prior Computer Science experience.',
            'Attended a GDSC event, discovering GitHub, LinkedIn, hackathons and ideathons.',
            '<strong>2nd Prize</strong> — Standard Essay Writing Competition, BIS Club.',
            'Built foundational knowledge of programming and backend concepts.',
            'Completed the year with a strong academic performance.'
        ],
        milestone: 'Transitioned from a non-CS background to actively exploring software development.',
        tags: ['PCMB to CS', 'GDSC Discovery', 'BIS Club 2nd Prize', 'Backend Basics', 'Academic Excellence']
    },
    {
        year: 'Year 02',
        period: 'Year 02 — National Recognition',
        tagline: 'Teamwork & Competitive Innovation',
        headline: 'YEAR 02 — NATIONAL RECOGNITION',
        focus: 'Teamwork & Competitive Innovation',
        points: [
            '<strong>SIH 2024 — Grand Finale Qualifier</strong>, Smart India Hackathon.',
            'Worked in a six-member team on research, solution design, calculations and presentations.',
            'Represented GM University at the Grand Finale hosted at KIET, Ghaziabad.',
            'Gained five days of technical exposure, mentorship and collaboration with teams from across India.',
            '<strong>8.91 CGPA</strong> — Academic milestone.'
        ],
        milestone: 'Became part of the first team from GM University to reach the SIH Grand Finale, as documented in my journey presentation.',
        tags: ['SIH 2024 Finalist', 'Smart India Hackathon', 'KIET Ghaziabad', '8.91 CGPA', 'Team Research & Design']
    },
    {
        year: 'Year 03',
        period: 'Year 03 — Building & Global Exposure',
        tagline: 'Real-World Development, Hackathons & International Experience',
        headline: 'YEAR 03 — BUILDING & GLOBAL EXPOSURE',
        focus: 'Real-World Development, Hackathons & International Experience',
        points: [
            '<strong>4 Department Websites</strong> — Built and deployed with junior teammate Prasanna.',
            'Received recognition associated with the university\'s Vice Chancellor for the department website work.',
            '<strong>eRaksha Hackathon 2026 — 2nd Runner-Up</strong>, following qualification for the Grand Finale at IIT Delhi.',
            'Participated in the AI summit at Bharat Mandapam, gaining exposure to the AI and cybersecurity ecosystem.',
            '<strong>Google Gemini AI Hackathon — Selected Participant, Tokyo, Japan.</strong>',
            'Interacted with experienced developers and gained international hackathon exposure.'
        ],
        milestone: 'Progressed from learning and competing to deploying real-world websites and representing my technical interests on national and international platforms.',
        tags: ['4 Dept Websites', 'VC Recognition', 'eRaksha 2nd Runner-Up', 'IIT Delhi', 'Bharat Mandapam', 'Google Tokyo, Japan']
    },
    {
        year: 'Year 04',
        period: 'Year 04 — AI Engineering & Professional Growth',
        tagline: 'Internship, Applied AI & Intelligent Systems',
        headline: 'YEAR 04 — AI ENGINEERING & PROFESSIONAL GROWTH',
        focus: 'Internship, Applied AI & Intelligent Systems',
        points: [
            '<strong>Two-Month Internship — Altimetrik SLK.</strong>',
            'Completed training in Python, RAG, LLMs, LangChain, AI agents and agentic AI workflows.',
            'Developed projects using a structured, specification-driven development approach with GitHub Copilot.',
            'Explored Hugging Face, Ollama, open-source models and agent communication protocols.',
            'Worked on a Persistent Memory Manager concept for agentic systems.'
        ],
        milestone: 'Expanded from full-stack development into applied AI and agent-based system development.',
        tags: ['Altimetrik SLK Internship', 'RAG & LLMs', 'LangChain & AI Agents', 'Agentic Workflows', 'Persistent Memory Manager']
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
                items: ['Year 01', 'Year 02', 'Year 03', 'Year 04'],
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
                    <span class="journey-tagline">Focus: ${data.focus}</span>
                </div>

                <h3 class="journey-headline">${data.headline}</h3>

                <ul class="journey-points-list">
                    ${data.points.map(pt => `
                        <li class="journey-point-item">
                            <span class="point-bullet-icon">✦</span>
                            <span class="point-text">${pt}</span>
                        </li>
                    `).join('')}
                </ul>

                <div class="journey-milestone-callout">
                    <span class="milestone-callout-badge">Milestone</span>
                    <p class="milestone-callout-text">${data.milestone}</p>
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
