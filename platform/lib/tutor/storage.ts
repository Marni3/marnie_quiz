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
  if (typeof window === "undefined") return DEFAULT_MODELS[provider] || "gemini-3.6-flash";
  const model = localStorage.getItem(`${STORAGE_KEYS.ACTIVE_MODEL}_${provider}`);
  return model || DEFAULT_MODELS[provider] || "gemini-3.6-flash";
}

export function setStoredActiveModel(provider: AIProvider, model: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STORAGE_KEYS.ACTIVE_MODEL}_${provider}`, model);
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
// PENDING EXAM REVIEW CONTEXT
// ==========================================

export function setPendingReviewContext(payload: any): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEYS.PENDING_REVIEW_CONTEXT, JSON.stringify(payload));
  } catch (err) {
    console.error("Failed to set pending review context:", err);
  }
}

export function getAndClearPendingReviewContext(): any | null {
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

export function getStoredSavedFormulas(): any[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_FORMULAS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
