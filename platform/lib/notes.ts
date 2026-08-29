export type NoteDomain = "MATH" | "ELECS" | "GEAS" | "EST" | "GENERAL";
export type NoteType = "formula_card" | "module_highlight" | "mnemonic_trap" | "custom_note";

export interface UserNote {
  id: string;
  title: string;
  domain?: NoteDomain;
  topicCode?: string;
  type: NoteType;
  content: string; // Markdown + KaTeX math ($...$ / $$...$$)
  sourceModuleId?: string;
  sourceSubtopicTitle?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

export const NOTES_STORAGE_KEY = "marnie_user_notes";
export const CUSTOM_MODULES_STORAGE_KEY = "marnie_tutor_custom_modules";

/**
 * Retrieve all stored notes from browser localStorage
 */
export function getStoredNotes(): UserNote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read user notes from localStorage:", err);
    return [];
  }
}

/**
 * Save or update a note in localStorage
 */
export function saveStoredNote(note: UserNote): UserNote[] {
  if (typeof window === "undefined") return [];
  try {
    const notes = getStoredNotes();
    const existingIndex = notes.findIndex((n) => n.id === note.id);
    if (existingIndex >= 0) {
      notes[existingIndex] = { ...note, updatedAt: Date.now() };
    } else {
      notes.unshift({ ...note, updatedAt: Date.now() });
    }
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    return notes;
  } catch (err) {
    console.error("Failed to save note to localStorage:", err);
    return [];
  }
}

/**
 * Delete a note by ID
 */
export function deleteStoredNote(id: string): UserNote[] {
  if (typeof window === "undefined") return [];
  try {
    const notes = getStoredNotes().filter((n) => n.id !== id);
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    return notes;
  } catch (err) {
    console.error("Failed to delete note from localStorage:", err);
    return [];
  }
}

/**
 * Export Study Vault (.json bundle of notes, custom modules, and study data)
 */
export function exportStudyVault(): void {
  if (typeof window === "undefined") return;
  try {
    const notes = getStoredNotes();
    const rawCustomModules = localStorage.getItem(CUSTOM_MODULES_STORAGE_KEY);
    const customModules = rawCustomModules ? JSON.parse(rawCustomModules) : [];

    const vaultPayload = {
      version: 1,
      appName: "Marnie Quiz Board Exam Review Platform",
      exportedAt: new Date().toISOString(),
      notes,
      customModules,
    };

    const blob = new Blob([JSON.stringify(vaultPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marnie-study-vault-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Failed to export study vault:", err);
  }
}

/**
 * Import Study Vault from JSON string
 */
export function importStudyVault(jsonString: string): {
  success: boolean;
  notesCount: number;
  modulesCount: number;
  error?: string;
} {
  if (typeof window === "undefined") {
    return { success: false, notesCount: 0, modulesCount: 0, error: "Window undefined" };
  }

  try {
    const parsed = JSON.parse(jsonString);

    let importedNotes: UserNote[] = [];
    if (Array.isArray(parsed.notes)) {
      importedNotes = parsed.notes;
      const existingNotes = getStoredNotes();
      // Merge unique by ID
      const noteMap = new Map<string, UserNote>();
      existingNotes.forEach((n) => noteMap.set(n.id, n));
      importedNotes.forEach((n) => noteMap.set(n.id, n));
      const merged = Array.from(noteMap.values()).sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(merged));
    }

    let importedModules: any[] = [];
    if (Array.isArray(parsed.customModules)) {
      importedModules = parsed.customModules;
      const rawExisting = localStorage.getItem(CUSTOM_MODULES_STORAGE_KEY);
      const existingMods = rawExisting ? JSON.parse(rawExisting) : [];
      const modMap = new Map<string, any>();
      existingMods.forEach((m: any) => modMap.set(m.id, m));
      importedModules.forEach((m: any) => modMap.set(m.id, m));
      const mergedMods = Array.from(modMap.values());
      localStorage.setItem(CUSTOM_MODULES_STORAGE_KEY, JSON.stringify(mergedMods));
    }

    return {
      success: true,
      notesCount: importedNotes.length,
      modulesCount: importedModules.length,
    };
  } catch (err: any) {
    console.error("Failed to import study vault:", err);
    return {
      success: false,
      notesCount: 0,
      modulesCount: 0,
      error: err.message || "Invalid JSON file",
    };
  }
}
