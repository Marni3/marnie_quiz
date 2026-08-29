# Antigravity Agent Handover & Takeover Guide

> **Project**: Philippine PRC Electronics Engineering (ECE) Board Exam Review Platform (Marnie Quiz & Learning Modules)  
> **Source of Truth**: [`implementation-plan.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/implementation-plan.md) & [`AGENTS.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/AGENTS.md)  
> **Status**: **V1.0 Feature Complete & Feature Frozen** (August 29, 2026)

---

## 1. Quick Orientation: What We Have Built

A high-performance, $0-infrastructure personal review platform and licensure companion for the Philippine PRC Electronics Engineering Board Exam, built on Next.js 16 (App Router), Neon Serverless PostgreSQL, Drizzle ORM, KaTeX Markdown rendering, and Client-Side BYOK AI.

### The 6 Core Pillars in V1:
1. **The Quiz Engine & Question Library (`/quizzes`)**: 202 authentic question sets across 50 continuous syllabus topics with Diagnostic (30Q), Review (25Q), Drill (10–20Q), and Simulation (50Q) tiers, subtopic range filters, and customizable test generators.
2. **Spaced Repetition & Retention Engine (`/analytics` & Daily SRS)**: Exponential retrievability curve modeling ($R(t) = \exp(-\Delta t / S)$), Per-Subject Recovery Drills, 1d/3d/7d snooze controls, and calibrated Board Readiness Index ($BRI$).
3. **Interactive Learning Modules (`/learn` and `/learn/[moduleId]`)**: Rich, full-page lessons with atomic definitions, declarative visualizers, dual-method derivations (Textbook vs. $\le 20\text{s}$ Board Shortcut), Karce/Canon calculator keystrokes, in-line concept checks, and companion 20–25 question Mastery Challenges (`/mastery`).
4. **BYOK AI Tutor & Post-Exam Debriefing (`/tutor` & `/attempts/[id]/results`)**: Multi-provider AI mentor (Google Gemini 3.7 Flash, Groq Qwen 3.8 / GPT OSS 120B, OpenAI, DeepSeek, Anthropic, OpenRouter) with real-time streaming, intra-provider demand fallbacks, and 30-Second Setup Guide.
5. **Unified Personal Notebook (`/notes`)**: Full Markdown/KaTeX editor, highlight-to-note captures from modules and quiz attempts, topic tagging, and AI formula cheat-sheet condensation.
6. **Study Streak Tracking & Gamification (`StreakBadge`)**: Database-backed streak engine (`/api/streak`) computing active review days directly from PostgreSQL `attempts` and `userModuleProgress`, merged with offline `localStorage`.

---

## 2. Post-V1 Roadmap: Future Sessions Backlog (V2 & Beyond)

The following initiatives are formally documented in Section 16 of [`implementation-plan.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/implementation-plan.md) and saved for post-exam / V2 sessions:

### 1. Google Drive Cloud Sync (`Save Progress to Google Drive`)
- 1-click cloud backup and multi-device sync utilizing Google Drive REST API (`appDataFolder` or root).
- Encrypts and backs up the **Study Vault** (custom AI modules, user notes, SRS retrievability vectors, quiz attempt logs, and settings) as a single portable JSON file without recurring database costs.
- 1-click **"Restore from Google Drive"** to migrate seamlessly between phones, tablets, and computers.

### 2. Dedicated Settings Center & Legal Compliance (`/settings`)
- A dedicated page consolidating:
  - **Account & Multi-Device Auth**: Profile, active sessions, and tokens.
  - **AI BYOK Management**: Default model selector, API keys, temperature/creativity sliders.
  - **Display Preferences**: Default formula fitting mode (`Fit Math` vs `Scroll Math`), KaTeX font size, theme presets.
  - **Legal & Compliance**:
    - *Terms of Service (TOS)*: User responsibilities and BYOK liability disclaimers.
    - *Privacy Policy*: Complete disclosure that keys and personal notes remain client-side only.
    - *Non-Affiliation Disclaimer*: Explicit notice affirming independence from commercial review centers and the PRC.

### 3. Granular User Data Control & Privacy Suite
- **Selective Data Reset**:
  - *Reset Quiz Attempt Records* (clears attempts while preserving custom notes and learning module progress).
  - *Recalibrate SRS Memory Engine* (resets stability curves to day 0).
  - *Wipe Personal Notes Vault* (`marnie_user_notes`).
  - *Wipe Custom AI Modules* (`marnie_tutor_custom_modules`).
- **Full Data Export (GDPR / Portability)**: 1-click zip export containing all study logs, attempt CSVs, Markdown notes, and custom module JSONs.
- **Account Termination**: 1-click permanent deletion of PostgreSQL user rows and cascading data.

### 4. Canonical TOS-Compliant PRC Taxonomy & Clean De-identification
- Re-architect course numbering from review center proprietary sequences (`MATH 01–13`, `ELEC 01–15`, `GEAS 01–14`, `EST 01–10`) into an independent, canonical, 100% TOS-compliant PRC Board Exam Taxonomy (`MATH-ALG-01`, `ELECS-SEMI-01`, `GEAS-THERMO-01`, `EST-TXLINE-01`, etc.).
- Decouples all proprietary review center labels to ensure zero copyright traces for public release, open-source sharing, or future commercialization.
- Includes a safe database migration script to preserve existing progress records.

### 5. Module Content Authoring Backlog
- **GEAS Modules**: `geas-10-02.json` (Board of ECE, Powers & Scope), `geas-10-03.json` (Examination, Registration & Licensure), followed by Chemistry, Physics, and Thermodynamics.
- **EST & ELECS Modules**: Transmission lines, Antennas, BJTs, Op-Amps, and Digital Logic per [`modules-authoring-plan.md`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/test-sets/Reference%20Documents/modules-authoring-plan.md).

---

## 3. Directory Layout

```
marnie_quiz/
├── implementation-plan.md          # Architecture & non-negotiables single source of truth
├── AGENTS.md                       # Agent working rules & constraints
├── SESSION_HANDOVER.md             # This takeover document
├── platform/                       # Next.js 16 web application
│   ├── app/
│   │   ├── api/                    # Attempts, SRS, feedback, streaks, tutor streaming/models
│   │   ├── attempts/               # Quiz runner & post-exam results review
│   │   ├── history/                # Historical attempt logs & review
│   │   ├── learn/                  # Learning module catalog & full-page interactive reader
│   │   ├── notes/                  # Personal study notebook & AI formula cheat sheet
│   │   ├── quizzes/                # Question library, custom quiz generator & CSV upload
│   │   └── tutor/                  # AI Study Chat, BYOK modal, and 30-Sec Setup Guide
│   ├── components/                 # Navbar, MathText, StreakBadge, FeedbackModal, etc.
│   └── lib/                        # constants, modules, notes, srs, streak, tutor engine
└── test-sets/                      # Curriculum assets & authoring tools
    ├── .agents/skills/             # Authoring skill definitions
    ├── learning-modules/           # Master JSON Learning Modules (MATH, ELECS, GEAS, EST)
    └── Reference Documents/        # Syllabus notes, review center PDFs & authoring guides
```

---

## 4. Daily Changelog Rule

Remember to maintain daily development changelogs in [`changelog/`](file:///c:/Users/reyna/OneDrive/Documents/marnie_quiz/changelog/). Always check if a file for the current date (`YYYY-MM-DD.md`) exists before starting; if it exists, append your progress; if not, create a new one.
