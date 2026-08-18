# Marnie Quiz — Board Exam Review Platform

A full-stack Next.js 15+ board-exam quiz platform for study groups and friends, built for 100% $0 permanent hosting on Vercel with Neon PostgreSQL and Auth.js.

## Tech Stack
- **Framework:** Next.js 15+ (App Router, TypeScript, React 19)
- **Database & ORM:** PostgreSQL (Neon Serverless) + Drizzle ORM
- **Auth:** Auth.js v5 (Google OAuth + JWT sessions)
- **Styling:** Vanilla CSS design tokens + Tailwind CSS, Anthropic orange & warm charcoal dark mode
- **Math:** KaTeX LaTeX typesetting (`$...$` inline, `$$...$$` display)
- **Parsing & Validation:** PapaParse + Zod

## Getting Started

### 1. Install dependencies
```bash
cd platform
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your database URL (or use default local memory fallback) and Auth credentials.

### 3. Generate & Push Database Schema
```bash
npm run db:generate
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Implemented

### Phase 0 & Phase 1 (MVP)
- **Google Sign-In:** Gated authentication with JWT sessions.
- **CSV Ingestion:** 9-column schema validation with row-numbered error reporting.
- **Library (`/quizzes`):** Shared study sets, search, subject filtering, question counts, and uploader avatars.
- **Quiz Detail (`/quizzes/[setId]`):** Mode selector (untimed / per-question / whole-exam), feedback mode (instant vs deferred).
- **Quiz Taking (`/attempts/[attemptId]`):** Sidebar navigator, flag for review, LaTeX rendering, secure client payload (server never sends correct answer during active exam).
- **Server-Side Grading & Results (`/attempts/[attemptId]/results`):** Server computed scoring, percentage, stat counters, and multi-paragraph solution review.
- **History (`/history`):** Complete user attempt tracking with retake and results actions.

### Phase 2 (Organization & Interactive Modules)
- **Folders:** Create, rename, delete folders and assign quizzes.
- **Privacy Controls:** Shared vs Private visibility toggle on uploads and edits.
- **Interactive Question Modules:** Attach self-contained HTML/JS visualizations or external tool links per question.
- **Sandboxed Rendering:** All modules render inside `sandbox="allow-scripts"` (no `allow-same-origin`) both inline and via dedicated full-page routes (`/modules/[questionId]`).
