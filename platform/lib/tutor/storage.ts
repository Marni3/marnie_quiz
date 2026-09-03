import { AIProvider, ChatSession, StudyVaultBackup } from "./types";
import { DEFAULT_MODELS } from "./prompts";

const STORAGE_KEYS = {
  ACTIVE_PROVIDER: "marnie_byok_active_provider",
  ACTIVE_MODEL: "marnie_byok_active_model",
  API_KEYS: "marnie_byok_api_keys",
  CHAT_SESSIONS: "marnie_tutor_sessions",
  ACTIVE_SESSION_ID: "marnie_tutor_active_session_id",
  PENDING_REVIEW_CONTEXT: "marnie_tutor_pending_review_context",
  SAVED_FORMULAS: "marnie_tutor_saved_formulas",
  CUSTOM_MODULES: "marnie_tutor_custom_modules",
  CUSTOM_QUIZZES: "marnie_tutor_custom_quizzes",
  CACHED_MODELS: "marnie_cached_models",
};

export function getStoredActiveProvider(): AIProvider {
  if (typeof window === "undefined") return "gemini";
  return (localStorage.getItem(STORAGE_KEYS.ACTIVE_PROVIDER) as AIProvider) || "gemini";
}

export function setStoredActiveProvider(provider: AIProvider): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACTIVE_PROVIDER, provider);
}

export function getStoredActiveModel(provider: AIProvider): string {
  if (typeof window === "undefined") return DEFAULT_MODELS[provider] || "gemini-2.0-flash";
  const model = localStorage.getItem(`${STORAGE_KEYS.ACTIVE_MODEL}_${provider}`);
  return model || DEFAULT_MODELS[provider] || "gemini-2.0-flash";
}

export function setStoredActiveModel(provider: AIProvider, model: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEYS.ACTIVE_MODEL}_${provider}`, model);
}

export interface StoredModelOption {
  id: string;
  name: string;
  recommended?: boolean;
}

export function getStoredModelsForProvider(provider: AIProvider): StoredModelOption[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CACHED_MODELS}_${provider}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function setStoredModelsForProvider(provider: AIProvider, models: StoredModelOption[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEYS.CACHED_MODELS}_${provider}`, JSON.stringify(models));
  } catch {}
}

export function getStoredApiKey(provider: AIProvider): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return parsed[provider] || "";
  } catch {
    return "";
  }
}

export function setStoredApiKey(provider: AIProvider, key: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[provider] = key.trim();
    localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(parsed));
  } catch (err) {
    console.error("Failed to save API key:", err);
  }
}

export function getAllStoredApiKeys(): Partial<Record<AIProvider, string>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.API_KEYS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ==========================================
// CHAT SESSIONS LOCAL STORAGE
// ==========================================

export function getStoredSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_SESSIONS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredSession(session: ChatSession): void {
  if (typeof window === "undefined") return;
  try {
    const sessions = getStoredSessions();
    const idx = sessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      sessions[idx] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions.slice(0, 50)));
  } catch (err) {
    console.error("Failed to save chat session:", err);
  }
}

export function deleteStoredSession(sessionId: string): void {
  if (typeof window === "undefined") return;
  try {
    const sessions = getStoredSessions().filter((s) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error("Failed to delete session:", err);
  }
}

export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
}

export function setActiveSessionId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION_ID, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION_ID);
  }
}

// ==========================================
// PENDING TUTOR CONTEXT (Modules, Highlights, Quizzes, Exam Reviews)
// ==========================================

export interface TutorPendingContext {
  type: "module_highlight" | "question" | "exam_review" | "chat";
  title: string;
  prompt?: string;
  moduleCode?: string;
  subtopicTitle?: string;
  domain?: string;
  highlightText?: string;
  questionData?: {
    promptText: string;
    choices?: { a: string; b: string; c: string; d: string };
    selectedChoice?: string;
    correctChoice?: string;
    explanation?: string;
  };
  examData?: any;
}

export function setPendingTutorContext(payload: TutorPendingContext): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEYS.PENDING_REVIEW_CONTEXT, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to set pending tutor context:", err);
  }
}

export function getAndClearPendingTutorContext(): TutorPendingContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.PENDING_REVIEW_CONTEXT);
    if (!raw) return null;
    sessionStorage.removeItem(STORAGE_KEYS.PENDING_REVIEW_CONTEXT);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setPendingReviewContext(payload: any): void {
  setPendingTutorContext(payload);
}

export function getAndClearPendingReviewContext(): any | null {
  return getAndClearPendingTutorContext();
}

// ==========================================
// 1-CLICK STUDY VAULT BACKUP & RESTORE ($0 Sync)
// ==========================================

export function exportStudyVault(): string {
  const backup: StudyVaultBackup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    configs: {
      activeProvider: getStoredActiveProvider(),
      activeModel: getStoredActiveModel(getStoredActiveProvider()),
      apiKeys: getAllStoredApiKeys(),
    },
    sessions: getStoredSessions(),
    customModules: getStoredCustomModules(),
    savedFormulas: getStoredSavedFormulas(),
  };

  return JSON.stringify(backup, null, 2);
}

export function importStudyVault(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString) as StudyVaultBackup;
    if (!data || data.version !== 1) {
      throw new Error("Invalid Study Vault backup format.");
    }

    if (data.configs) {
      if (data.configs.activeProvider) setStoredActiveProvider(data.configs.activeProvider);
      if (data.configs.apiKeys) {
        localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(data.configs.apiKeys));
      }
    }

    if (Array.isArray(data.sessions)) {
      const existing = getStoredSessions();
      const existingIds = new Set(existing.map((s) => s.id));
      const merged = [...existing];
      for (const s of data.sessions) {
        if (!existingIds.has(s.id)) {
          merged.push(s);
        }
      }
      localStorage.setItem(STORAGE_KEYS.CHAT_SESSIONS, JSON.stringify(merged.slice(0, 50)));
    }

    if (Array.isArray(data.customModules)) {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_MODULES, JSON.stringify(data.customModules));
    }

    if (Array.isArray(data.savedFormulas)) {
      localStorage.setItem(STORAGE_KEYS.SAVED_FORMULAS, JSON.stringify(data.savedFormulas));
    }

    return true;
  } catch (err) {
    console.error("Failed to import study vault:", err);
    return false;
  }
}

export function getStoredCustomModules(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_MODULES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves or updates a custom module in local storage with strict ID deduplication
 */
export function saveCustomModule(mod: any): { isNew: boolean; totalCount: number } {
  if (typeof window === "undefined" || !mod) return { isNew: false, totalCount: 0 };
  try {
    const existing = getStoredCustomModules();
    const id = mod.id || `custom-${Date.now()}`;
    const normalizedMod = { ...mod, id, isCustom: true };

    const idx = existing.findIndex((m: any) => m.id === id);
    let isNew = false;

    if (idx >= 0) {
      existing[idx] = normalizedMod; // Update in place
    } else {
      existing.unshift(normalizedMod); // Add to front
      isNew = true;
    }

    localStorage.setItem(STORAGE_KEYS.CUSTOM_MODULES, JSON.stringify(existing.slice(0, 100)));
    return { isNew, totalCount: existing.length };
  } catch (err) {
    console.error("Failed to save custom module:", err);
    return { isNew: false, totalCount: 0 };
  }
}

export function getStoredCustomQuizzes(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_QUIZZES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Saves or updates a custom practice quiz in local storage with strict ID deduplication
 */
export function saveCustomQuiz(quiz: any): { isNew: boolean; totalCount: number } {
  if (typeof window === "undefined" || !quiz) return { isNew: false, totalCount: 0 };
  try {
    const existing = getStoredCustomQuizzes();
    const id = quiz.id || (quiz.moduleId ? `${quiz.moduleId}-mastery` : `custom-quiz-${Date.now()}`);
    const normalizedQuiz = { ...quiz, id, isCustom: true };

    const idx = existing.findIndex((q: any) => q.id === id || (quiz.moduleId && q.moduleId === quiz.moduleId));
    let isNew = false;

    if (idx >= 0) {
      existing[idx] = normalizedQuiz; // Update in place
    } else {
      existing.unshift(normalizedQuiz); // Add to front
      isNew = true;
    }

    localStorage.setItem(STORAGE_KEYS.CUSTOM_QUIZZES, JSON.stringify(existing.slice(0, 100)));

    // Cross-link with custom modules in local storage if moduleId is present
    if (quiz.moduleId) {
      try {
        const modules = getStoredCustomModules();
        const mIdx = modules.findIndex((m: any) => m.id === quiz.moduleId || m.code === quiz.moduleCode);
        if (mIdx >= 0) {
          modules[mIdx].masteryChallenge = normalizedQuiz;
          modules[mIdx].pairedQuizSetId = id;
          localStorage.setItem(STORAGE_KEYS.CUSTOM_MODULES, JSON.stringify(modules));
        }
      } catch {}
    }

    return { isNew, totalCount: existing.length };
  } catch (err) {
    console.error("Failed to save custom quiz:", err);
    return { isNew: false, totalCount: 0 };
  }
}

/**
 * Retrieves a custom mastery challenge quiz linked to a specific module ID
 */
export function getCustomMasteryQuizForModule(moduleId: string): any | null {
  if (typeof window === "undefined" || !moduleId) return null;
  try {
    // 1. Direct query in custom quizzes
    const quizzes = getStoredCustomQuizzes();
    const found = quizzes.find(
      (q: any) =>
        q.moduleId === moduleId ||
        q.id === `${moduleId}-mastery` ||
        q.id === moduleId
    );
    if (found) return found;

    // 2. Query custom modules for embedded masteryChallenge
    const modules = getStoredCustomModules();
    const mod = modules.find((m: any) => m.id === moduleId);
    if (mod?.masteryChallenge) return mod.masteryChallenge;

    // 3. Fallback to latest quiz if only 1 exists
    if (quizzes.length > 0) {
      return quizzes[0];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Clears and resets all local user progress (FSRS intervals, attempts, streaks, recall, notes, custom modules)
 */
export function resetAllProgressData(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const exactKeysToRemove = [
      STORAGE_KEYS.CHAT_SESSIONS,
      STORAGE_KEYS.ACTIVE_SESSION_ID,
      STORAGE_KEYS.PENDING_REVIEW_CONTEXT,
      STORAGE_KEYS.SAVED_FORMULAS,
      STORAGE_KEYS.CUSTOM_MODULES,
      STORAGE_KEYS.CUSTOM_QUIZZES,
      "marnie_stored_notes",
      "marnie_study_streak_v1",
      "marnie_study_activities_v1",
      "marnie_fsrs_cards_v1",
      "marnie_last_active_module",
      "marnie_local_feedbacks",
      "has_seen_onboarding_tour",
    ];
    exactKeysToRemove.forEach((key) => localStorage.removeItem(key));

    // Dynamic prefix sweep for any written recall or attempt cache keys
    const keysToPurge: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("mq_written_recall_") || key.startsWith("mq_attempt_") || key.startsWith("mq_custom_"))) {
        keysToPurge.push(key);
      }
    }
    keysToPurge.forEach((key) => localStorage.removeItem(key));

    return true;
  } catch (err) {
    console.error("Failed to reset progress data:", err);
    return false;
  }
}

export function getStoredSavedFormulas(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_FORMULAS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export interface LastActiveModuleInfo {
  id: string;
  code: string;
  subtopicTitle: string;
  topicTitle?: string;
  domain?: string;
  isCustom?: boolean;
  timestamp: number;
}

export function getLastActiveModule(): LastActiveModuleInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("marnie_last_active_module");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLastActiveModule(info: LastActiveModuleInfo) {
  if (typeof window === "undefined" || !info) return;
  try {
    localStorage.setItem("marnie_last_active_module", JSON.stringify(info));
  } catch {}
}
