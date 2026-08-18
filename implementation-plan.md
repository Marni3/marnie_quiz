# Board Exam Review Platform — Implementation Plan

> Working title only — rename freely. This document consolidates every decision made during planning so an implementing agent (human or AI) doesn't need to re-derive or re-litigate them. Where a decision was a judgment call rather than a hard requirement, it's flagged as such in **Section 13, "Decisions made during planning."**

**Status:** Planning complete, ready to scaffold
**Last updated:** 2026-08-16

---

## Notes for building this in Google Antigravity

You mentioned Antigravity (the VS Code-based IDE with an agent manager, browser-driving agents, and its own Task List / Implementation Plan / Walkthrough artifacts) will be the main way this gets built. A few things worth setting up deliberately given that:

- **Point the agent at this file first.** Antigravity generates its own Implementation Plan and Task List artifacts when you hand it a goal — tell it to read `implementation-plan.md` before doing that, so its plan matches the architecture here instead of re-deriving one from scratch. Section 14 (Build order) is already written as a literal task sequence; hand it to the Manager view close to verbatim rather than asking the agent to invent its own ordering.
- **Use the browser-verification loop on purpose.** Antigravity's agents can drive an embedded browser alongside the editor and terminal, and produce screenshots/recordings as proof of work. Since Section 9 spells out exactly what each screen should contain, a good habit is asking the agent to navigate to the screen it just built and confirm it matches that section before marking a task done — that's a natural fit for what the tool already does, not extra work on top of it.
- **Sequential vs. parallel work.** Phase 1's steps are hard-sequential — schema before CSV upload, auth before protected routes — so don't dispatch those to parallel agents. Phase 2's two features (folder UI, interactive-module upload UI) are independent of each other and of Phase 1, so they're a reasonable pair to hand to two agents at once in the Manager view once Phase 1 ships.
- **Guardrails for a preview tool.** As of the sources I checked, Antigravity is still labeled a preview product, and early users have reported agents occasionally abandoning a task mid-way or deleting files without cleanup — worth checking current release notes before relying on it unsupervised. Practical defense: commit in small steps, review diffs before accepting, and use Antigravity's tool-approval gates specifically for anything destructive — database migrations that drop or alter columns, and anything touching git history.
- **Secrets never touch the agent.** Create the Google OAuth client and the Neon project yourself, by hand, in the browser (Section 12) — an agent shouldn't be the one holding or creating credentials for accounts tied to your identity. Drop the resulting values into a gitignored `.env.local`; the agent only ever needs the *names* of the env vars, never the values, and should never commit one.
- **MCP is available if you want it.** Antigravity supports MCP servers directly, and Neon publishes an official one — connecting it would let the agent run migrations and queries through Antigravity's own tool-approval flow instead of shelling out to the Drizzle CLI. Optional, not required; the plan works identically without it.

---

## 1. Project overview

A personal Next.js app, deployed on Vercel, for reviewing board exam material. The core loop:

1. A signed-in user uploads a CSV (question, four choices, correct answer, optional explanation, optional image link).
2. The app parses and validates it, then stores it as an interactive quiz visible to everyone using the app.
3. Any signed-in user can take that quiz — with navigation, an optional timer, and flag-for-review — and get graded results with explanations.
4. Performance is tracked over time per user, per quiz, and (later) per subject/folder.

This will be shared with a small group of friends, not the public. It is a personal/non-commercial project.

---

## 2. Hard constraints

- **$0 budget.** No paid tier, anywhere, ever, for the scale this needs to run at. Every service chosen below has a genuine permanent free tier (not a trial) that comfortably covers a small friend group's usage.
- **Non-commercial hosting terms.** Vercel's free Hobby plan requires the deployment not process payments or serve ads. This project does neither, so it's compliant by default — just don't add either later without revisiting the plan.
- **Small scale.** Design for tens of users and thousands of questions, not production SaaS scale. Don't over-engineer for traffic this app will never see.

---

## 3. Tech stack

| Layer | Choice | Cost | Why |
|---|---|---|---|
| Hosting | Vercel, Hobby plan | Free forever (non-commercial) | Native Next.js support, git-push deploys, generous free limits for this scale |
| Framework | Next.js 15+, App Router, TypeScript | Free | One codebase for client + server, fits Vercel natively |
| Database | Neon Postgres, via Vercel Marketplace | Free tier: 0.5 GB storage + 100 compute-hours/month, permanent, no card | Scales to zero when idle, real relational queries for metrics, no separate "database bill" to worry about |
| ORM | Drizzle | Free | Lightweight, fully typed, works well in serverless/edge runtimes |
| Auth | Auth.js v5 (`next-auth`), Google provider only, JWT sessions | Free | No password reset/hashing/security surface to build; Google OAuth app registration is free |
| CSV parsing | `papaparse` | Free | Standard, well-tested CSV parser |
| Validation | `zod` | Free | One schema reused for CSV row validation and API payload validation |
| Charts (Phase 3) | `recharts` | Free | React-native charting, no separate service |
| Styling | Tailwind CSS | Free | Fast to build with, default pairing for Next.js |
| PWA / offline (Phase 5) | Serwist (`@serwist/next`) | Free | Actively maintained successor to next-pwa; generates the service worker and web app manifest for an installable, offline-capable app |
| Offline storage (Phase 5) | `idb` (IndexedDB wrapper) | Free | Client-side storage for offline-cached quizzes and queued attempt writes |

No blob storage, no object storage, no third-party file host. Question images are external URLs supplied in the CSV and rendered directly with `<img>` — the app never stores image bytes.

---

## 4. Architecture

- **Client (Browser):** React UI — quiz-taking screen (navigation, timer, flag-for-review), upload form, history/results views. Talks to the server only through Next.js Server Actions / Route Handlers.
- **Server (Vercel Functions):** CSV parsing + validation, grading logic, auth callbacks, all database reads/writes via Drizzle.
- **Database (Neon Postgres):** Single source of truth for everything — users, quizzes, questions, attempts, scores. No secondary datastore, no files-in-a-repo, no Drive integration. Raw CSV text can optionally be kept in a `raw_csv` column if you want the original preserved; that's the entire "backup" story, no external service needed.

**Security-relevant data flow rule:** the server never sends `correct_choice` or `explanation` to the client while a quiz is in progress — only after an attempt is submitted and graded. Grading is always computed server-side from the database, never trusted from the client payload, so a tampered request can't fake a score.

**Interactive module rendering rule:** any `interactive_html` content is rendered inside a sandboxed iframe (`sandbox="allow-scripts"`, deliberately without `allow-same-origin`). Since any user can upload a question that every other user will view, the module must be able to run its own scripts but must not be able to read cookies, call the app's authenticated endpoints, or touch the parent page. This isn't optional — it's the one thing standing between "friend uploads a fun interactive diagram" and "friend's browser tab quietly does something to everyone else's session." "Open in a new tab" uses a dedicated route (`/modules/[questionId]`) that checks the viewer's session server-side and renders nothing but that same sandboxed iframe, full-page — never a direct navigation to the raw stored HTML (which would run it same-origin with the rest of the app) and never a client-side blob URL (inconsistent across browsers, and skips the server-side access check).

**API-shape rule, for future mobile clients:** Server Actions are the default for the web app's own forms and mutations — less boilerplate, nothing extra to maintain. But the actual business logic (CSV parsing/validation, grading, queries) lives in plain functions in `lib/`, called *by* the Server Action rather than written inside it. That's what keeps a future native or React Native client cheap to add later: wrap the same `lib/` functions in a handful of Route Handlers (plain JSON over HTTP, callable from anywhere) instead of rewriting the logic itself. Every table's primary key is already a client-generatable UUID rather than a database-assigned serial number, for the same reason — see Section 5.

---

## 5. Data model

Drizzle schema (`lib/db/schema.ts`). All seven tables are created on day one, even though folder UI and the private-visibility toggle aren't built until Phase 2 — this is deliberate, so later phases are additive (new UI + queries) rather than migrations that touch existing tables.

```ts
import {
  pgTable, uuid, text, integer, boolean, timestamp, pgEnum,
} from "drizzle-orm/pg-core";

export const choiceEnum = pgEnum("choice", ["a", "b", "c", "d"]);
export const visibilityEnum = pgEnum("visibility", ["shared", "private"]);
export const attemptModeEnum = pgEnum("attempt_mode", [
  "untimed", "timed_per_question", "timed_whole_exam",
]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const folders = pgTable("folders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  parentFolderId: uuid("parent_folder_id"),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionSets = pgTable("question_sets", {
  id: uuid("id").defaultRandom().primaryKey(),
  uploadedByUserId: uuid("uploaded_by_user_id").notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  folderId: uuid("folder_id").references(() => folders.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  subjectTag: text("subject_tag"),
  visibility: visibilityEnum("visibility").notNull().default("shared"),
  rawCsv: text("raw_csv"), // optional: original upload, for re-download
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceQuestionSetId: uuid("source_question_set_id")
    .references(() => questionSets.id, { onDelete: "set null" }), // provenance only — where it was first uploaded
  promptText: text("prompt_text").notNull(),
  choiceA: text("choice_a").notNull(),
  choiceB: text("choice_b").notNull(),
  choiceC: text("choice_c").notNull(),
  choiceD: text("choice_d").notNull(),
  correctChoice: choiceEnum("correct_choice").notNull(),
  explanation: text("explanation"),
  imageUrl: text("image_url"),
  interactiveHtml: text("interactive_html"), // optional self-contained HTML/JS/CSS module — sandboxed on render
  interactiveUrl: text("interactive_url"),   // optional link to an external tool (e.g. a Claude artifact) — opened in a new tab, never embedded
});

// A question's membership in any set — its original upload, a subset, or a
// hand-built superset — lives here, not on the question itself. This is what
// makes subsets/supersets free: creating one is just inserting rows here
// against existing question IDs, no duplication of question content.
export const questionSetItems = pgTable("question_set_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  questionSetId: uuid("question_set_id").notNull()
    .references(() => questionSets.id, { onDelete: "cascade" }),
  questionId: uuid("question_id").notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  orderIndex: integer("order_index").notNull(),
});

export const attempts = pgTable("attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionSetId: uuid("question_set_id").notNull()
    .references(() => questionSets.id, { onDelete: "cascade" }),
  mode: attemptModeEnum("mode").notNull().default("untimed"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  clientCreatedAt: timestamp("client_created_at"), // when it actually started on-device — distinct from server insert time once offline sync (Phase 5) exists
  completedAt: timestamp("completed_at"),
  durationSeconds: integer("duration_seconds"),
  score: integer("score"), // null until graded
  totalQuestions: integer("total_questions").notNull(),
});

export const answerRecords = pgTable("answer_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  attemptId: uuid("attempt_id").notNull()
    .references(() => attempts.id, { onDelete: "cascade" }),
  questionId: uuid("question_id").notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  selectedChoice: choiceEnum("selected_choice"), // null if skipped
  isCorrect: boolean("is_correct").notNull(),
  timeSpentSeconds: integer("time_spent_seconds"),
});
```

**Why this shape avoids refactors:**
- `folder_id` is nullable — MVP leaves it `null` for everything; Phase 2 lets users set it, no data migration.
- `visibility` defaults to `"shared"` — matches "anyone's upload appears on the platform." A private toggle in Phase 2 is just exposing a column that already exists.
- `answer_records` is the one table every metrics view in Phase 3 reads from — "score per quiz," "per folder," "per subject" are different `GROUP BY`s over the same rows, not new tables.
- `subject_tag` on `question_sets` lets subject-level rollups work across folders later, without needing a many-to-many tagging system now.
- Questions belong to sets via `question_set_items`, a many-to-many join table, not a direct column — a single question can live in its original upload *and* in any number of custom subsets/supersets at once, with no duplicated content.
- Every primary key is a client-generatable UUID (`defaultRandom()`), not a database-assigned serial number — this is what makes offline writes possible later: a device can create a valid `attempts.id` while offline and sync it whenever it reconnects, with no risk of colliding with another record.

---

## 6. Auth

- **Auth.js v5**, Google provider only. No password-based login — avoids building/securing hashing, reset flows, and email delivery.
- **JWT session strategy, no database adapter.** Auth.js's standard adapter setup requires its own `accounts` / `sessions` / `verification_tokens` tables — skip all of that. On sign-in, a callback upserts the user (matched by email) into our own `users` table and attaches our internal `users.id` to the JWT, so every other table's `user_id` foreign key references that same row.
- Middleware protects all routes except `/login` and static assets.
- `AUTH_SECRET` generated once with `npx auth secret` and stored as an env var — never committed.

---

## 7. CSV import format

| Column | Required | Type | Notes |
|---|---|---|---|
| `question` | Yes | text | The question prompt |
| `choice_a` | Yes | text | |
| `choice_b` | Yes | text | |
| `choice_c` | Yes | text | |
| `choice_d` | Yes | text | |
| `correct_answer` | Yes | `a`/`b`/`c`/`d` | Case-insensitive on import, normalized to lowercase |
| `explanation` | No | text | Shown on the results screen after grading |
| `image_url` | No | URL | Direct link to a hosted image; rendered as-is, never fetched/stored server-side |
| `interactive_url` | No | URL | Link to an external tool or visualization (e.g. a published Claude artifact); always opened in a new tab, never embedded |
| `subject_tag` | No | text | Free text; powers Phase 3 subject rollups |

Example row:

```csv
question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag
"What is the primary pacemaker of the heart?","SA node","AV node","Bundle of His","Purkinje fibers","a","The SA node initiates the electrical impulse that sets heart rate.",,Cardiology
```

`interactive_html` (a self-contained interactive module) is **not** a CSV column — raw HTML doesn't belong in a spreadsheet cell. It's attached per-question through the app's own UI (Phase 2, see Section 8), which stores the uploaded HTML directly and renders it sandboxed.

**Validation approach:** parse with `papaparse` (`header: true`), validate each row against a `zod` schema before any database write. On failure, reject the whole file and return row-numbered errors (e.g. "Row 14: `correct_answer` must be one of a/b/c/d") rather than partially importing — partial imports are confusing to debug and easy to avoid.

---

## 8. Feature specification by phase

### Phase 1 — MVP
- Google sign-in gates the entire app.
- CSV upload: parse, validate, insert a `question_set` (visibility = shared), its `questions`, and the `question_set_items` rows linking them together in order.
- "All quizzes" list: every shared quiz, filterable by `subject_tag` and uploader (folders don't exist in the UI yet).
- Quiz-taking screen: jump-to-question navigation, optional timer (untimed / per-question / whole-exam, chosen at quiz start — not baked into the CSV), flag-for-review, submit.
- Grading (server-side) → results screen: score, time taken, per-question review with the correct answer and explanation revealed.
- "My history": list of past attempts, re-takeable anytime. Retaking always creates a **new** `attempts` row — history is never overwritten.

### Phase 2 — Organization & privacy
- Folders: create/rename/delete, assign a quiz to a folder. Personal to each user (a user's folder view is their own organization of the shared library).
- Private-visibility toggle when uploading, or editable after the fact — flips `question_sets.visibility` to `"private"`, hiding it from everyone but the uploader.
- Interactive question modules: attach a self-contained HTML/JS visualization or tool to a question (upload control + size cap, e.g. 300 KB, enforced at upload time), stored in `interactive_html` and rendered in a sandboxed iframe on the results/review screen. Editing a question to add or replace `interactive_url` (a plain link, e.g. to a published Claude artifact) can ship even earlier since it's identical in shape to `image_url`.

### Phase 3 — Metrics & analytics
- Score trend over time, filterable by quiz / folder / subject tag.
- Weakest-question analysis: most-missed and slowest-to-answer questions, sourced entirely from `answer_records`.
- This-attempt-vs-last-attempt comparison.
- Charts via `recharts`.

### Phase 4 — Advanced / nice-to-have
- "Weak questions" drill mode: auto-generated quiz from previously missed questions across sets.
- Friend leaderboards per quiz.
- Export results (CSV/PDF).
- In-app question editing (skip re-uploading a CSV for a one-line fix).
- CSV template download + drag-and-drop bulk upload.
- Custom quiz builder: assemble a new set — a subset or a superset — from a filtered selection of questions across one or more existing sets or folders. The schema already supports this via `question_set_items`; this is UI-only work when you get to it.

### Phase 5 — Mobile & offline

Default to an installable Progressive Web App, not a separate native codebase. It reuses the exact same Next.js app, costs nothing, and gets a home-screen icon plus offline use on Android (and iOS, with some feature limitations) without maintaining a second project. A genuine native app (React Native/Expo, or Kotlin) is still possible later — nothing here blocks it — but only worth the extra maintenance surface if the PWA falls short of something you actually need. Worth knowing up front: Google Play listings carry a one-time $25 developer fee, which breaks the $0 constraint; sideloading an APK directly to friends avoids that fee if you do end up going native.

- Web app manifest (`app/manifest.ts`) + icons — installable on Android and iOS home screens, opens full-screen like an app.
- Service worker via Serwist — caches the app shell and previously-viewed quizzes, so anything already opened once stays readable with no connection.
- Offline quiz-taking: cache a quiz's questions to IndexedDB before going offline, queue `attempts` / `answer_records` writes locally using client-generated UUIDs (Section 5), and sync them to the server once back online.

---

## 9. Screens & UI

### MVP screens

- **Login** — Google sign-in only. App name, one-line description, "Sign in with Google" button. Nothing else.
- **Library** (`/quizzes`, the home screen after login) — a card grid of every shared quiz: title, subject tag, uploader, question count, and the viewer's best score or "not attempted yet." Searchable/filterable by subject tag and uploader. A persistent "Upload CSV" entry point.
- **Upload** (`/quizzes/upload`) — file picker/drag-drop, title + subject tag fields, row-numbered validation errors on a bad file, success redirects into the new quiz's detail screen.
- **Quiz detail / start** (`/quizzes/[setId]`) — quiz metadata, the viewer's past attempts on this quiz, and start controls: pick a mode (untimed / per-question timer / whole-exam timer), then "Start."
- **Take quiz** (`/attempts/[attemptId]`) — the screen mocked up above: progress counter, subject tag, timer, flag-for-review, the question and four choices, a question-navigator grid (answered / current / flagged / unanswered), previous/next, and submit. `correct_choice`, `explanation`, and any interactive module are never sent to the client here — see the security note in Section 4.
- **Results** (`/attempts/[attemptId]/results`) — score summary (X/Y, percentage, time taken), then a per-question breakdown: the question, the viewer's answer, the correct answer, the explanation, and — once Phase 2 ships — the interactive module for that question (inline sandboxed view, plus "open in a new tab"). Retake button.
- **History** (`/history`) — every past attempt by the signed-in viewer, filterable, each row linking to its results screen.

### Navigation flow

Login is the only entry point; everything downstream assumes a signed-in user. Library is the hub: it's where Upload, every Quiz detail screen, and History are all one click away. The core loop is linear — Library → Quiz detail → Take quiz → Results — and Results loops back to Library rather than dead-ending, so retaking a quiz or picking a different one is always one click, not a back-button hunt.

### Phase 2 additions

- Folder management lives inside Library (a sidebar or filter panel), not a separate route — folders are a lens on the same shared quiz list, not a different dataset.
- The private-visibility toggle is a control on the Upload screen and on Quiz detail's edit state, not a screen of its own.
- Attaching an interactive module (`interactive_html` upload or `interactive_url` link) is a per-question control on Quiz detail's edit state.

### Phase 3 additions

- **Dashboard** — either a new `/dashboard` route or an expansion of History — charts for score trend, weakest questions, and per-subject performance, filterable by quiz, folder, or subject tag.

### Phase 4 additions

- A "top scores" section on Quiz detail (leaderboard).
- A drill-mode entry point on Library.
- An export control on Results and History.

### Phase 5 additions

- An "Add to home screen" prompt on Library once the manifest and service worker exist.
- A small offline indicator when a screen is serving cached content instead of live data.
- Every screen above is already built mobile-responsive from the MVP — that's just normal frontend practice given friends will likely use this on their phones long before Phase 5 ships. Phase 5 adds installability and offline use on top of a layout that already works on a phone; it isn't what makes the layout work on a phone in the first place.

## 10. Explicit non-goals for MVP

Guardrails to prevent scope creep — none of these should be built before Phase 1 is working end to end:

- No folder CRUD UI (table exists; not exposed)
- No private-visibility toggle in the UI (column exists, defaults to shared)
- No image upload/storage — links only
- No password-based auth
- No in-app question editing — re-upload to fix
- No interactive-module upload UI or sandboxed rendering — the columns exist, but attaching and rendering `interactive_html` is Phase 2, not MVP
- No PWA manifest, service worker, or offline caching in MVP — but every screen is still mobile-responsive from day one; that's ordinary frontend work, not something deferred to Phase 5
- No leaderboards, drill mode, or exports
- No mobile app — responsive web only

---

## 11. Suggested project structure

```
/
├── app/
│   ├── login/page.tsx
│   ├── quizzes/
│   │   ├── page.tsx                     # all shared quizzes
│   │   ├── upload/page.tsx              # CSV upload form
│   │   └── [setId]/
│   │       ├── page.tsx                 # quiz-taking screen
│   │       └── results/[attemptId]/page.tsx
│   ├── history/page.tsx                 # my past attempts
│   ├── api/auth/[...nextauth]/route.ts
│   └── layout.tsx
├── lib/
│   ├── db/
│   │   ├── schema.ts                    # Drizzle schema (Section 5)
│   │   ├── client.ts                    # Drizzle + Neon client
│   │   └── migrations/
│   ├── validations/
│   │   └── csv.ts                       # zod schema for CSV rows
│   ├── auth.ts                          # Auth.js config
│   └── grading.ts                       # server-side grading logic
├── components/
│   ├── quiz/
│   ├── upload/
│   └── ui/
├── drizzle.config.ts
├── middleware.ts                        # route protection
├── .env.local                           # real secrets — gitignored, never committed
├── .gitignore
└── package.json
```

---

## 12. Environment variables & external service setup

| Variable | Source |
|---|---|
| `DATABASE_URL` | Auto-injected by the Neon Vercel Marketplace integration |
| `AUTH_SECRET` | Generate with `npx auth secret` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google Cloud Console OAuth client |

**Setup steps:**
1. **Neon:** provision via the Vercel dashboard → Storage → Marketplace → Neon (or `vercel install neon` from the CLI). This auto-injects `DATABASE_URL` into the project.
2. **Google OAuth:** create a free Google Cloud project → configure the OAuth consent screen as **External**, in **Testing** mode (fine for an invite-only friend group — no Google app-verification review needed) → create an OAuth 2.0 Client ID (Web application) → add authorized redirect URI `https://<your-domain>/api/auth/callback/google` → copy the client ID/secret into env vars. Add each friend's Google account as a test user on the consent screen.
3. **Vercel:** connect the GitHub repo, deploy on the Hobby plan, set the env vars above in Project Settings (never commit them).

---

## 13. Decisions made during planning (so these aren't re-litigated)

- Sessions are JWT-based, no Auth.js adapter tables — fewer moving parts for this scale.
- All uploads are shared/visible by default; privacy is opt-in, added in Phase 2.
- Folders exist in the schema from day one; the UI for them waits until Phase 2.
- Retaking a quiz always creates a new `attempts` row.
- Timer mode is chosen at quiz start, not encoded in the CSV — same quiz can be taken untimed once and timed later.
- Images are link-only; the app never stores or proxies image bytes.
- Grading is always computed server-side from the database.
- Question-to-set membership is many-to-many (`question_set_items`), not a column on `questions` — this is what makes subsets and supersets possible later without duplicating question content. Trade-off: editing a question's text updates it everywhere it's referenced, which is intentional but worth knowing.
- Interactive modules split into two columns on purpose: `interactive_html` (self-contained, stored directly, durable, sandboxed) is the primary mechanism; `interactive_url` (a plain link, e.g. to a published Claude artifact) is a lighter-weight option that's only ever opened in a new tab, never embedded — Claude's artifact embedding requires per-artifact domain allow-listing and doesn't work for API-backed artifacts at all, so it isn't reliable enough to build inline embedding around.
- PWA over native Android for Phase 5 — same codebase, $0 cost, no Play Store dependency, and it covers the practical benefits (home-screen install, offline use) a personal quiz app actually needs. Native remains addable later without a rewrite if the PWA ever falls short.
- Business logic lives in plain `lib/` functions called by Server Actions, not written inside them — this is what keeps adding Route Handlers (for a future native or React Native client) additive rather than a rewrite, since Server Actions themselves can't be called from outside a Next.js app.
- Every primary key is a client-generatable UUID rather than a database serial — chosen partly because it's what makes offline-first writes possible later without changing the ID strategy.

---

## 14. Build order

1. Scaffold Next.js + TypeScript, deploy an empty shell to Vercel (confirm CI/CD works before writing features).
2. Provision Neon, write the full Drizzle schema (Section 5), run the first migration.
3. Wire up Auth.js v5 with Google as the only provider; protect routes with middleware.
4. Build CSV upload → parse (`papaparse`) → validate (`zod`) → insert as a shared `question_set`.
5. Build the quiz-taking flow (navigation, timer, flag-for-review).
6. Build grading + results, writing to `attempts` / `answer_records`.
7. Build "all quizzes" list and "my history" view.
8. Ship it, use it yourself, get friends signed in.
9. Phase 2: folders + privacy toggle.
10. Phase 3: metrics dashboard.
11. Phase 4: advanced features, as time allows.
12. Phase 5: PWA manifest + service worker for offline viewing, then IndexedDB-backed offline quiz-taking with sync if you still want the harder half of it.

---

## 15. Future considerations (not blocking)

- If Neon's 0.5 GB free storage or 100 compute-hours ever becomes a real constraint (unlikely at this scale), the Launch plan is pay-per-use with no monthly minimum — a few dollars a month, not a step-change in cost.
- If the friend group grows well beyond "a handful of people," revisit Vercel's Hobby bandwidth/function limits — still very unlikely to bind for this use case, but worth a glance.
