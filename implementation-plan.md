# Board Exam Review Platform — Unified Master Implementation Plan & Architecture

> **Single Source of Truth** for architecture, data schema, spaced repetition engine, board exam taxonomy, UI design, and development roadmap.
> **Guiding Principle:** A reliable, high-performance, $0-cost personal and peer review platform for the PRC Electronics Engineering (ECE) Board Examination.

---

## 1. Project Overview & Core Philosophy

The platform is designed to provide an optimal study experience for PRC ECE board examinees through three interlocking systems:
1. **Curriculum Engine:** Comprehensive coverage of all 4 PRC Board Subjects across 46 distinct, continuous topic codes (MATH 01–13, ELEC 01–15, GEAS 01–14, EST 01–10) with 5,435 official reference questions structured into four standardized tiers: *Diagnostic (30Q)*, *Review (25Q)*, *Drill (10–20Q)*, and *Simulation (50Q)*.
2. **Spaced Repetition & Retention Engine (SRS):** An empirical memory stability and retrievability model ($S = S_0 \cdot e^{\Delta t / S}$) providing personalized Daily Retention Radars, Per-Subject Recovery Drills, 1d/3d/7d snooze controls, and honest, calibrated Board Readiness Indices ($BRI$).
3. **Dual-Mode Visual Interface:** A flexible experience allowing students to switch between a structured, subtopic-filterable **Library List View** and a gamified, winding **Duolingo-Style Skill Tree** featuring true fractional SVG progress arcs and accuracy-driven chromatic rings.

---

## 2. Hard Constraints ($0 Forever & Security)

- **$0 Permanent Free Tier:** Hosted on Vercel Edge with Neon PostgreSQL Serverless ($0 hobby tier) and Drizzle ORM. Zero paid dependencies, zero converting free trials.
- **Server-Side Grading:** Grading and score calculations are strictly computed server-side in API routes; client payloads are never trusted for grading.
- **Sandboxed Interactive Modules:** Any standalone interactive HTML learning module or question rendering `interactive_html` is delivered inside an isolated iframe (`sandbox="allow-scripts"`, strictly no `allow-same-origin`).
- **Secret Hygiene:** Database credentials and auth secrets live strictly in `.env.local` and Vercel project environment settings—never in git commits.

---

## 3. PRC Board Exam Master Syllabus & Course Code Taxonomy

The platform enforces an unbroken, 1-to-1 course code taxonomy across all four subjects, resolving all legacy numbering gaps:

```
========================================================================================
1. MATHEMATICS (MATH) — 1,170 Questions | 13 Continuous Course Codes
========================================================================================
• MATH 01 - College Algebra (19 Subtopics: 01-01 to 01-19)
• MATH 02 - Probability & Counting Techniques (13 Subtopics: 02-01 to 02-13)
• MATH 03 - Statistics (Measures of Central Tendency, Dispersion, Regression) [Decoupled]
• MATH 04 - Discrete Mathematics (Sets, Propositional Logic, Graph Theory) [Decoupled]
• MATH 05 - Plane & Spherical Trigonometry (Identities, Oblique, Napier's Rules)
• MATH 06 - Plane Geometry (Polygons, Circles, Chords, Power of a Point) [New Dedicated Set]
• MATH 07 - Solid Geometry (Prisms, Pyramids, Cylinders, Cones, Spheres) [Decoupled]
• MATH 08 - Solid Mensuration (Prismoidal Formula, Revolution Solids) [Decoupled]
• MATH 09 - Analytic Geometry (Lines, Conics, Polar Curves, 3D Quadrics)
• MATH 10 - Differential Calculus (Limits, Derivatives, Optimization, Rates)
• MATH 11 - Integral Calculus (Techniques, Areas, Volumes, Pappus Theorems)
• MATH 12 - Differential Equations (Separable, Exact, Linear, Bernoulli, Laplace) [Renumbered]
• MATH 13 - Advanced Engineering Mathematics (Complex Numbers, Vectors, Matrices, Fourier)

========================================================================================
2. ELECTRONICS ENGINEERING (ELECS) — 1,725 Questions | 15 Continuous Codes (No Gaps)
========================================================================================
• ELEC 01 - Electricity & Magnetism          • ELEC 09 - Operational Amplifiers (Op-Amps)
• ELEC 02 - Electrical Elements & Circuits    • ELEC 10 - Industrial Electronics & Thyristors
• ELEC 03 - DC Circuits & Network Theorems   • ELEC 11 - Power Supplies & Voltage Regulators
• ELEC 04 - AC Circuits, Phasors & Power     • ELEC 12 - Microelectronics & IC Fabrication
• ELEC 05 - Transients & Resonant Circuits   • ELEC 13 - Electronic Test & Measurement
• ELEC 06 - Semiconductor Physics & Diodes   • ELEC 14 - Feedback & Oscillators
• ELEC 07 - Bipolar Junction Transistors     • ELEC 15 - Digital Electronics & Logic Circuits
• ELEC 08 - Field Effect Transistors (FET)

========================================================================================
3. GENERAL ENGINEERING & APPLIED SCIENCES (GEAS) — 1,380 Questions | 12 Distinct Codes
========================================================================================
• GEAS 01 - Chemistry for Engineers          • GEAS 09 - Electromagnetics
• GEAS 02 - Physics 1 (Mechanics, Sound)     • GEAS 10 - ECE Laws, Ethics & Contracts (RA 9292)
• GEAS 03 - Physics 2 (EM, Optics, Modern)   • GEAS 11 - Material Science & Engineering
• GEAS 04 - Mechanics & Strength of Materials• GEAS 12 - Computer Programming & IT
• GEAS 05 - Thermodynamics & Heat Transfer   • GEAS 13 - Environmental Science & Engineering
• GEAS 06 - Engineering Economics            • GEAS 14 - Technopreneurship 101

========================================================================================
4. ELECTRONICS SYSTEMS & TECHNOLOGIES (EST) — 1,160 Questions | 10 Continuous Codes
========================================================================================
• EST 01 - Fundamentals of Comms & Noise     • EST 06 - Microwave Communications & Radar
• EST 02 - Radiowave Propagation             • EST 07 - Optical Fiber Communications
• EST 03 - Analog Modulation (AM, FM, PM)    • EST 08 - Telephony & Switching Systems
• EST 04 - Transmission Lines & Smith Charts • EST 09 - Digital Communications (PCM, PSK, QAM)
• EST 05 - Antennas & Radiation Systems      • EST 10 - Data Communications & Networks (OSI)
========================================================================================
TOTAL SYLLABUS BENCHMARK: 46 TOPICS • 190 QUESTION SETS • 5,435 QUESTIONS
========================================================================================
```

---

## 4. Spaced Repetition (SRS) & Diagnostic Architecture

### 4.1. Memory Engine & Retrievability Formula
The SRS engine tracks topic-level memory stability using an exponential forgetting curve:
$$R(t) = \exp\left( - rac{\Delta t}{S} 
ight)$$
- **Stability Update on Attempt ($S'$):**
  $$S' = S \cdot \left( 1 + c \cdot 	ext{Score} \cdot e^{-R} 
ight)$$
- **Retrievability Categories:**
  - 🟢 **Fresh ($R \ge 85\%$):** Memory intact; review not yet urgent.
  - 🟡 **Review Due ($R < 85\%$ or $\Delta t \ge S$):** Optimal retrieval window.
  - 🔴 **Struggling ($R < 60\%$ or $	ext{Score} < 70\%$):** Requires immediate active recall recovery.

### 4.2. Per-Subject & Overall Daily Recovery Drills
To prevent cognitive overload as students advance across multiple board areas:
1. **Global Daily Recovery Drill:** Aggregates 15–20 high-yield questions from all due topics across all 4 subjects.
2. **Per-Subject Recovery Drills:** Individual 10–15 question targeted refresher drills for each specific board subject (`Start Math Refresher`, `Start Elecs Refresher`, `Start GEAS Refresher`, `Start EST Refresher`).
3. **Student Agency Controls:**
   - **Granular Snooze:** Defer review for **1 Day (Default)**, **3 Days**, or **7 Days**.
   - **Confidence Presets:** Manually set memory intervals (Struggling: 1d, Moderate: 4d, Confident: 10d, Mastered: 30d).
   - **Topic Suspension:** Ignore non-relevant or already mastered areas.

### 4.3. Calibrated Board Readiness Index ($BRI$)
$$BRI = 	ext{Accuracy} 	imes 	ext{Average Retention} 	imes \sqrt{rac{	ext{Completed Topics}}{46}}$$
- **Calibration Safeguard:** Displays `"Calibrating Baseline (X / 3 sets)"` until $\ge 3$ sets ($50+$ Qs) are completed, preventing inflated initial estimates.

---

## 5. UI Architecture & Gamified Progression

### 5.1. Dual-View Interface (`/quizzes`)
- **List View:** Systematic accordion hierarchy grouped by subject and topic with subtopic range filters (`01-01 to 01-07`, `01-08 to 01-19`), set count badges, and sleek segmented context menus.
- **Duolingo-Style Skill Tree Map:**
  - **Compact Vertical Rhythm:** Optimized vertical stepping-stone spacing to eliminate excessive scrolling while maintaining a natural winding snake flow.
  - **Fractional SVG Progress Arcs:** Progress circles are not binary. The outer ring renders an SVG stroke arc matching the exact completion ratio ($	ext{Answered Sets} / 	ext{Total Sets}$).
  - **Chromatic Performance Rings:**
    - 🟢 Green: High Retention ($R \ge 85\%$) & High Accuracy ($\ge 80\%$)
    - 🟡 Amber: Moderate / Due for Review ($R < 85\%$)
    - 🔴 Red: Struggling / Low Score ($R < 60\%$ or $< 70\%$)
    - ⚪ Dark Slate: Unstudied ($0\%$ completion arc)
  - **Standardized Visual Hierarchy:** Removed arbitrary crowns and hardcoded colors; all nodes follow consistent, data-driven styling.

---

## 6. Native Interactive Learning Modules & Pedagogical Architecture

### 6.1. Pedagogical Tone & Accessible Standard English
- **Accessible, Clear & Direct:** Professional textbook clarity without archaic jargon, calibrated for high readability by Filipino examinees and ESL learners.
- **Intuitive Dual-Anchor Framing:**
  1. **Direct Intuition & Mental Models:** Plain-English conceptual explanations (e.g., water pipes for electrical potential, rate of turning for derivatives).
  2. **Engineering Context:** Practical board exam applications (e.g., transmission line impedance matching on cell towers).

### 6.2. "Long Academic Method vs. Board Exam Shortcut" Technique Catalog
- Every module contrasts classical textbook derivations with high-speed PRC board exam shortcuts:
  - *"This is the typical solution or long method. When in the boards, the following technique or solution would be faster."*
  - **Examples:**
    - *Parallel Lines:* Skip slope-intercept algebra; inspect matching ratio of $x$ and $y$ coefficients.
    - *Roots & Factorization:* Skip manual factoring; use Casio `CALC` mode or `EQN` mode.
    - *Limits with Indeterminate Forms:* Skip trigonometric factoring; apply L'Hôpital's Rule or test values near the limit with `CALC 0.9999`.
- **End-of-Module Strategy Catalog:** A comprehensive summary table indexing all common question archetypes for that topic and their matching speed shortcuts.

### 6.3. Puzzle-Game Progression & Paired 1-to-1 Mastery Sets
Following puzzle-game design principles (*Introduce in Isolation $	o$ Practice Isolated Mechanic $	o$ Apply with Creative Complexity*):
1. **In-Module Micro-Checkpoints (8–15+):** Introduce techniques one-by-one with immediate, low-friction checks.
2. **Paired 1-to-1 Mastery Challenge Test Set:**
   - Each module links directly to a partnered 20–30 question **Mastery Challenge Set**.
   - Tests every single shortcut and concept taught in the module with realistic, challenging board exam numbers, tricky distractor options, and multi-concept combinations.

## 7. AI Tutor Architecture, BYOK Integration & Standardized Prompts

### 7.1. BYOK Provider Candidates & Failover Routing
Users can connect their own free API keys in Settings (`/settings` or stored in browser `localStorage`), ensuring **$0 host infrastructure cost**:

| Provider | Recommended Model | Free Tier Allocation | Key Strengths |
|---|---|---|---|
| **Google AI Studio** *(Primary)* | `gemini-1.5-flash` / `gemini-2.0-flash` | **15 RPM • 1M TPM • 1,500 RPD** | Massive context window, superior math/diagram reasoning, generous permanent free quota. |
| **Groq Cloud** *(Secondary)* | `llama-3.3-70b-versatile` | **30 RPM • 14,400 RPD** | Ultra-low latency (>300 tokens/sec), instant streaming feedback. |
| **OpenRouter** *(Fallback)* | `meta-llama/llama-3.3-70b:free` | **Variable free models** | Universal OpenAI-compatible gateway; single key accesses multiple open-source models. |

#### Client-Side Automatic Failover Routing
Is multi-provider failover difficult? **No.** A lightweight, 25-line TypeScript client router attempts the primary provider (e.g., Google AI Studio); on HTTP 429 (rate limit) or network error, it automatically falls back to Groq or OpenRouter with zero user disruption:
```typescript
async function fetchAITutor(prompt: string, keys: UserApiKeys): Promise<ReadableStream> {
  const providers = [
    { name: "gemini", fn: () => callGemini(prompt, keys.google) },
    { name: "groq", fn: () => callGroq(prompt, keys.groq) },
    { name: "openrouter", fn: () => callOpenRouter(prompt, keys.openrouter) },
  ].filter(p => !!keys[p.name]);

  for (const provider of providers) {
    try {
      return await provider.fn();
    } catch (err) {
      console.warn(`Provider ${provider.name} failed, falling back...`, err);
    }
  }
  throw new Error("All configured AI providers exceeded quota or failed.");
}
```

---

### 7.2. Standardized AI System Prompts & Structured Response Schema

#### System Prompt Persona: Pragmatic Board Exam Topnotcher Mentor
```
You are an expert PRC Electronics Engineering (ECE) Board Examination Topnotcher Mentor. 
Your goal is to provide crisp, intuitive, high-speed explanations for engineering examinees.

CRITICAL GUIDELINES:
1. Avoid verbose academic fluff or robotic textbook preamble.
2. Ground every mathematical concept in intuitive, accessible standard English.
3. Always contrast the typical long academic solution with the fastest board exam technique or Casio fx-991ES calculator trick.
4. Structure your response EXACTLY according to the standardized Note-Card format so the student can save it directly to their personal Notes.
```

#### Standardized Output Format (1-Click "Save to Notes" Schema)
Every AI Tutor response outputs structured markdown conforming to a standardized card format:
```markdown
### 💡 Concept Breakdown: [Topic / Question Title]

**1. Misconception / Trap Identified:**
> [1-2 sentences explaining why the wrong choice was enticing or where the sign/formula error occurred]

**2. Core Principle & Formula:**
$$	ext{Formula in KaTeX}$$
*Plain-English intuition of what the variables actually represent.*

**3. Board Exam Speed Shortcut / Calculator Technique:**
- *Typical Long Method:* [Brief 1-sentence description of the tedious derivation]
- *Board Exam Shortcut:* [Step-by-step 15-second shortcut, ratio trick, or Casio fx-991ES mode setup]

**4. 📝 High-Yield Takeaway Note:**
> [A self-contained 2-sentence mnemonic or rule-of-thumb ready for revision]
```

---

### 7.3. Compute & Storage Impact Evaluation ($0 Cost Assessment)

- **Compute Impact:** **$0.** All LLM API calls are executed client-to-provider directly or streamed via stateless Next.js edge API routes. The host platform incurs zero GPU/LLM inference costs.
- **Storage Impact on Neon PostgreSQL:**
  - The `notes` table stores lightweight Markdown text:
    ```sql
    CREATE TABLE notes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      topic_code TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      tags TEXT[],
      created_at TIMESTAMP DEFAULT now() NOT NULL
    );
    ```
  - An average note card is $pprox 350	ext{ bytes}$.
  - **10,000 saved notes** consume only **$pprox 3.5	ext{ MB}$**, which is less than $1\%$ of Neon's permanent $500	ext{ MB}$ free tier!

---

### 7.4. Phased AI Roadmap

```
[➔] Phase 4.7: BYOK API Key Infrastructure & Client-Side Failover Router
    • Secure localStorage key vault with support for Google AI Studio, Groq, OpenRouter
    • Automatic 3-tier failover handling (Gemini -> Groq -> OpenRouter)

[➔] Phase 4.8: Post-Exam Debrief & In-Module Context AI Tutor
    • Post-Exam Results Screen ("🤖 Start Personal AI Debrief") analyzing missed questions
    • Inline text highlight prompt ("Ask AI Tutor about this formula")

[➔] Phase 4.9: Personal Study Notebook Knowledge Base (/notes)
    • 1-Click "Save AI Note" persistence to Neon DB with topic tags and search/filter
```

## 8. Implementation Phasing & Status

```
[✓] PHASE 1: Full-Stack Core Platform & Live Database Migration
    • Next.js 16 App Router + Tailwind CSS + Drizzle ORM + Neon PostgreSQL Serverless
    • 190 question sets (5,435 questions) across 4 subjects
    • Server-side grading, guest-mode access, Vercel edge deployment

[✓] PHASE 2: Spaced Repetition Engine & Memory Analytics
    • FSRS Stability & Retrievability engine with Daily Retention Radar
    • 15–20 question daily recovery drill with 1d/3d/7d snooze and confidence overrides
    • Board Readiness Index with calibration thresholds and true syllabus benchmarks

[✓] PHASE 3: Gamified Skill Tree & Intelligent Ingestion
    • Duolingo-style winding stepping stone pathway with interactive practice drawers
    • 3-Layer CSV ingestion with heuristic NLP auto-tagging into 8 cognitive archetypes
    • Sleek segmented context popovers and gamification streaks/badges

[➔] PHASE 4: Subtopic Granularity, Decoupled Math Syllabus & Learning Modules (NEXT SESSION)
    • Task 4.1: Decouple Math Syllabus (Split MATH 03/04, 07/08, generate MATH 06, renumber 12/13)
    • Task 4.2: Subtopic Range Grouping UI Toggle (Filter sets by range e.g. 01-01 to 01-07)
    • Task 4.3: Per-Subject Daily Recovery Refresher Drills (Math, Elecs, GEAS, EST)
    • Task 4.4: Fractional SVG Progress Arcs & Performance Color Rings on Skill Tree
    • Task 4.5: Standardized Learning Module Generator & Dedicated /learn Tab
    • Task 4.6: Comprehensive UI Clutter & Visual Hierarchy Audit

[ ] PHASE 5: Mobile PWA & Offline Access (FUTURE)
    • Service Worker caching for offline practice and PWA install manifest
```
