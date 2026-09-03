# Implementation Plan 04: AI Tutor Dynamic Auto-Router & Transparency Suite

**Target Issue**: AI Tutor latency (10–25s delays), sequential ghost model waterfall round-trips, lack of multi-provider failover despite having multiple keys, and interface black box with zero generation diagnostics.  
**Governing Standards**:  
* [Software Standards SKILL.md §1](file:///.agents/skills/software-standards/SKILL.md) (Threat Modeling: SSRF Prevention, AbortController Quota Defense)  
* [Software Standards SKILL.md §2](file:///.agents/skills/software-standards/SKILL.md) (Indirect Prompt Injection: Delimited `<exam_context>` blocks)  
* [Software Standards SKILL.md §4](file:///.agents/skills/software-standards/SKILL.md) (Zero-Hardcoding Hygiene & BYOK Privacy)  
* [Software Standards SKILL.md §6](file:///.agents/skills/software-standards/SKILL.md) (Streaming Resilience & Recovery)

---

## 1. Root-Cause Summary

1. **Waterfall of Ghost Models**: [`platform/app/api/tutor/stream/route.ts`](file:///platform/app/api/tutor/stream/route.ts#L45-L56) hardcodes non-existent model strings (`gemini-3.6-flash`, `gemini-3.5-flash`), incurring multiple consecutive 404 network round-trips and 5–15s of artificial latency.
2. **Model Alias Corruption**: [`platform/lib/tutor/storage.ts`](file:///platform/lib/tutor/storage.ts#L28) remaps valid models (`gemini-2.0-flash`) to `"gemini-3.6-flash"`, ensuring initial failures.
3. **Isolated Single-Key Storage**: Storing keys as a single string per provider without cross-provider fallback or latency monitoring.
4. **Complete Lack of Transparency**: Messages omit provider, model, latency, and speed diagnostics; streaming state is a static text spinner; injected system context is uninspectable.

---

## 2. Technical Solution & Changes

### A. Dynamic Model Discovery Engine (Zero Hardcoding)
* **File**: [`platform/app/api/tutor/models/route.ts`](file:///platform/app/api/tutor/models/route.ts)
* **Implementation**:
  1. Query live upstream endpoints with user key: Google `/v1beta/models`, Groq `/openai/v1/models`, OpenRouter `/api/v1/models`.
  2. **Polymorphic Context Window**:
     ```ts
     const contextWindow = m.inputTokenLimit || m.context_window || m.context_length || 16384;
     ```
  3. **Zero-Drop Output Policy**: Do NOT filter by `outputTokenLimit >= 4096`. Only clamp request `max_tokens` to `Math.min(m.outputTokenLimit || 4096, 4096)`.
  4. **Vision Heuristics**: Infer multimodality via model ID patterns (`gemini`, `vision`, `4o`, `claude-3`).
  5. Delete `GEMINI_MODEL_ALIASES` from [`platform/lib/tutor/storage.ts`](file:///platform/lib/tutor/storage.ts).

### B. Dynamic Quality-to-Speed Auto-Router with AbortController
* **File**: [`platform/app/api/tutor/stream/route.ts`](file:///platform/app/api/tutor/stream/route.ts)
* **Implementation**:
  1. **Primary Provider (Quality)**: Route to the top-ranked model from the user's quality provider (Google Gemini live flagship).
  2. **Speed Failover Trigger**:
     * If Time to First Token (TTFT) exceeds 3.5s, or if upstream returns 429/503:
     * Immediately abort the pending Google socket via `abortController.abort()` to prevent quota burn.
     * Cut over to Groq (`llama-3.3-70b-versatile` or `qwen-2.5-32b`) at 300+ tokens/sec.
  3. **Groq TPM Context Budget Adapter**:
     * When routing to Groq, compress the injected exam review payload to the top 5 missed questions ($<1,800$ tokens) to prevent exceeding Groq's free-tier 6,000 TPM limit.

### C. Interface Transparency & Diagnostics Suite
* **File**: [`platform/app/tutor/tutor-view.tsx`](file:///platform/app/tutor/tutor-view.tsx)
* **File**: [`platform/app/tutor/chat-message.tsx`](file:///platform/app/tutor/chat-message.tsx)
* **Implementation**:
  1. **Streaming Phase Status**: Replace generic spinner with live badges:
     `[ 🟡 Connecting to Google Gemini... ]` $\to$ if cutover: `[ ⚡ Failover: Routing via Groq (LLaMA 3.3 70B)... ]` $\to$ `[ Streaming at 280 t/s ]`.
  2. **Message Status Pill**: On every assistant message footer, display:
     `⚡ Groq · llama-3.3-70b · 1.4s (312 tokens · 222 t/s) · Fallback from Gemini (High Demand)`
  3. **Collapsible Context Inspector ("View What the AI Saw")**:
     Expandable accordion showing the exact prompt text, exam scorecard, and formulas fed to the model.

---

## 3. Step-by-Step Implementation Steps

1. Purge `GEMINI_MODEL_ALIASES` in `storage.ts`.
2. Refactor `models/route.ts` to implement polymorphic discovery and spec detection.
3. Rewrite `stream/route.ts` with the dynamic auto-router, `AbortController` cancellation, and Groq TPM budgeting.
4. Update `chat-message.tsx` to render the diagnostic status pill and collapsible context drawer.
5. Update `tutor-view.tsx` streaming indicator with real-time connection phases.

---

## 4. Verification & Walkthrough Steps

1. Configure a Google Gemini key and Groq key in BYOK Settings.
2. Send a prompt in AI Tutor $\to$ Verify the request routes to Google Gemini live model.
3. Simulate high latency on Google ($>3.5\text{s}$) $\to$ Verify the UI displays cutover notice, aborts the Google socket, and completes via Groq in $<2\text{s}$.
4. Verify the message footer displays the diagnostic status pill.
5. Click **"🔍 View Injected Context"** $\to$ Verify the prompt and exam payload are inspectable.
