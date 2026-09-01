---
name: software-standards
description: Production security, code quality, and functional stability standards for the Marnie Quiz platform (Next.js App Router, Neon Postgres, Drizzle ORM, NextAuth.js, Vercel, BYOK AI Tutor).
---

# Production Directives — Marnie Quiz

These standards govern all production code in this repository. They are loaded on-demand when implementing features that touch API routes, database writes, authentication, LLM integration, or deployment configuration.

---

## 1. Agentic Threat Modeling

* **Objective**: Perform a structured, scenario-driven threat analysis prior to outputting code or system architecture for features that touch **auth, API routes, database writes, or LLM integration**.
* **Scope Lens (The 5 Threat Zones)**:
  * **Input Surfaces**: Prompts, untrusted user uploads (CSV question sets, file attachments to AI Tutor), external API payloads.
  * **Planning & Reasoning**: Prompt injection via BYOK AI Tutor context payloads, system instruction bypass, tool routing hijacking.
  * **Tool Execution**: Privilege escalation via API route handlers, SSRF through AI provider proxy endpoints, dynamic code execution risks in `interactive_html` modules.
  * **Memory & State**: Postgres/Drizzle state persistence, NextAuth session hijacking, cross-user data leaks through missing `userId` filtering, localStorage credential exposure (BYOK API keys).
  * **Inter-System Communication**: BYOK LLM provider API calls (OpenAI, Google, Anthropic), Vercel deployment environment, OAuth provider callbacks, token leakage.
* **Trigger Criteria**: When implementing or substantially revising a feature that touches any of the 5 Threat Zones, generate a **Threat Summary Table** mapping identified risks to countermeasures before writing implementation code. Cosmetic changes, content authoring, and documentation do not require a threat table.
* **Threat Summary Table Format**:

  | Threat Zone | Risk | Severity | Countermeasure |
  |---|---|---|---|
  | Input Surfaces | Malformed CSV upload crashes parser | Medium | Validate CSV structure server-side before DB insert |
  | Memory & State | BYOK API key stored in localStorage readable by XSS | High | Keys never leave client; AI Tutor proxy never logs keys |

---

## 2. Secure Coding Standard

* **Objective**: Support mitigations corresponding with the OWASP Top 10 (Web) and OWASP Top 10 for LLM Applications.
* **Core Principles Implemented**:
  * **Input Validation & Sanitization (OWASP A03 / LLM02)**: Strict schema validation for all incoming inputs; explicit parameterization via Drizzle ORM to prevent SQL injection. Never construct raw SQL strings with interpolated user input.
  * **Indirect Prompt Injection Defense (OWASP LLM01)**: Treat data retrieved from untrusted sources (user uploads, external content, exam review payloads) as plain data, never as executable instructions. The AI Tutor's `contextPayload` is always injected as a clearly delimited data block, never spliced into system instructions.
  * **Broken Access Control Mitigation (OWASP A01)**: Validate `session.user.id` from NextAuth at every API route boundary. Never trust client-supplied `userId` values for data access — always derive from the server-side session.
  * **Output Handling (OWASP A03 / LLM05)**: Encode all dynamic LLM outputs prior to rendering in React components. The `interactive_html` field renders inside a sandboxed iframe (`sandbox="allow-scripts"`, no `allow-same-origin`) — no exceptions. AI Tutor responses are rendered through `MathText` (KaTeX) and React's built-in XSS-safe JSX escaping.

---

## 3. Secure Database & Auth Configuration

* **Objective**: Limit data exposure and unauthorized database reads/writes in the Neon Postgres / Drizzle ORM / NextAuth.js architecture.
* **Core Security Rules**:
  * **Parameterized Queries Only**: All database access goes through Drizzle ORM's query builder. Never use `sql.raw()` or `db.execute()` with string-interpolated user input. Drizzle's `eq()`, `and()`, `where()` operators handle parameterization automatically.
  * **User Data Isolation**: Every query that returns user-scoped data (attempts, progress, SRS records, notes) MUST include a `.where(eq(table.userId, session.user.id))` filter. Never rely on client-supplied `userId` parameters alone.
  * **Auth State Integrity**: Use `await auth()` (NextAuth server-side helper) at the top of every API route handler. If no session exists, return `401 Unauthorized` — never fall through to a default/anonymous user in production paths. The current fallback UUID (`"00000000-0000-0000-0000-000000000001"`) is a development convenience that must be gated behind `NODE_ENV === "development"`.
  * **Federated Auth Only**: Authentication uses Google OAuth via NextAuth.js. No email/password login forms, no custom credential storage. Credential management is fully outsourced to the OAuth provider.
  * **Server-Side Grading**: Grading and score calculations are strictly computed server-side in API routes (`/api/attempts/[attemptId]/submit`). Client payloads are validated but never trusted for score computation.
  * **Sandboxed Interactive Content**: Any `interactive_html` field renders inside a sandboxed iframe (`sandbox="allow-scripts"`, no `allow-same-origin`). No exceptions, not even for testing.

---

## 4. Secret Management & Zero-Hardcoding Hygiene

* **Objective**: Eliminate hardcoded credentials, API keys, and tokens from the codebase.
* **Mandatory Code Patterns**:
  * **Prohibit Hardcoded Strings**: Flag any pattern resembling `const API_KEY = "sk-..."`, `const DATABASE_URL = "postgres://..."`, or `const AUTH_SECRET = "..."` as a critical flaw. This includes test files and comments containing real key prefixes.
  * **Environment Variable Injection**: All secrets are stored in:
    - **Local development**: `.env.local` (git-ignored, never committed)
    - **Production**: Vercel project environment variables (set via dashboard or `vercel env`)
  * **Access Pattern**: Always retrieve credentials via `process.env.VARIABLE_NAME` in server-side code (API routes, server components). Never expose secrets to client-side bundles — only variables prefixed with `NEXT_PUBLIC_` are client-accessible, and secrets must never use this prefix.
  * **BYOK API Keys**: User-supplied AI provider API keys are stored exclusively in the user's browser `localStorage`. They are sent per-request to the AI Tutor proxy endpoint and are never logged, persisted server-side, or included in error reports.

  ```typescript
  // ✅ Correct: server-side access via process.env
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL not configured");

  // ❌ Critical flaw: hardcoded credential
  const dbUrl = "postgres://user:pass@host/db";

  // ❌ Critical flaw: secret exposed to client bundle
  const secret = process.env.NEXT_PUBLIC_AUTH_SECRET;
  ```

---

## 5. Security Reviewer Persona

* **Objective**: Review any code for common security issues, based on the threat model and best practices.
* **Review Methodology**:
  * Inspect for hardcoded credentials and unsafe default settings.
  * Map data flow from untrusted entry point to storage/execution sink.
  * Validate access control checks (`auth()` + `userId` filtering) at every API route handler.
  * Check that Drizzle queries use parameterized operators, not raw SQL interpolation.
  * Verify `interactive_html` iframe sandboxing is intact.
  * Provide a severity-ranked vulnerability list with concrete code diffs for remediation.

---

## 6. Functional Stability & Walkthroughs

* **Objective**: For every new feature, revision, or refactor, produce walkthrough test steps that a user can follow manually, broken down into specific pieces of functionality. These walkthroughs serve as living documentation of expected behavior and as specifications that can later be converted into automated test scripts (TDD infrastructure is a planned future addition).

* **Trigger**: Required for every new feature, UI revision, or refactor. Not required retroactively for existing stable features unless they are being modified.

* **Interactive Functionality**: Any buttons, forms, or controls that submit input — whether to an API route, AI Tutor provider, database, or localStorage — must actually work end-to-end. Dead buttons and non-functional UI elements are treated as bugs, not incomplete features.

* **BYOK AI Tutor Resilience & Provider Handling**: Whenever implementing or modifying AI Tutor features (`/api/tutor/stream`, `/api/tutor/models`):
  1. **Multi-Provider Architecture**: The AI Tutor supports multiple providers (Google, OpenAI, Anthropic). Never hardcode a single provider or model string. The provider and model are always user-selected via the BYOK settings UI and passed per-request.
  2. **Error Recovery**: Catch recoverable HTTP status codes (`503`, `429`, `404`, `500`) from upstream AI providers and return clear, actionable error messages to the user (e.g., "API key invalid", "Rate limit exceeded", "Model unavailable"). Never expose raw provider error payloads to the client.
  3. **Streaming Resilience**: The streaming endpoint (`/api/tutor/stream`) must handle partial stream failures gracefully. If the stream is interrupted mid-response, the client must not freeze or lose the partial content already received.

* **Server-Side Robustness & Payload Ingestion Standards**: Across all API route handlers:
  1. **Request Validation**: Always validate and parse the request body before processing. Use defensive destructuring with fallback defaults:
     ```typescript
     // ✅ Defensive: validate before destructuring
     const body = await req.json().catch(() => ({}));
     const { questionSetId, mode } = body;
     if (!questionSetId) {
       return NextResponse.json({ error: "Missing questionSetId" }, { status: 400 });
     }
     ```
  2. **Auth-First Handler Pattern**: Every API route handler follows the pattern: authenticate → validate input → execute logic → return response. Auth check is always the first operation.

* **Database Persistence, Clean Payloads, & Transaction Integrity**: Whenever handling user input, document creation, or AI generation workflows:
  1. **Strict Undefined-Stripping (Zero-Crash Payload Hygiene)**:
     - Before passing any object to Drizzle's `db.insert()` or `db.update()`, sanitize the payload to strip all `undefined` values. Drizzle does not tolerate `undefined` in value objects — use explicit `null` for optional columns or omit the key entirely. Never allow `undefined` properties to reach the database driver.
  2. **Guaranteed Transaction Verification (Input-to-Save Completeness)**:
     - Whenever a user submits an input (exam attempt, quiz answer, progress update, note, or AI tutor message), the application MUST ensure both the user input AND any generated output are successfully persisted.
     - If user input is received but the save operation or downstream generation fails, the system MUST NOT fail silently.
  3. **Explicit Error Escalation & User Feedback**:
     - Always catch database write rejections and display a clear, accessible error in the UI (toast, banner, or inline message) with context on what failed.
     - Never clear the user's input buffer or reset UI state if the persistence operation has not settled with a confirmed successful write.
