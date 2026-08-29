"use client";

import { useState } from "react";
import { LearningModule } from "@/lib/modules";
import { ModuleReader } from "@/app/learn/[moduleId]/module-reader";
import { CustomQuizModal } from "./custom-quiz-modal";
import { X, Sparkles, Download, Check, BookMarked, Target } from "lucide-react";
import { getStoredCustomModules, saveCustomModule, getCustomMasteryQuizForModule } from "@/lib/tutor/storage";
import { saveStoredNote } from "@/lib/notes";
import { recordStudyActivity } from "@/lib/streak";

interface CustomModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: LearningModule;
  onSaved?: () => void;
}

export function CustomModuleModal({
  isOpen,
  onClose,
  module,
  onSaved,
}: CustomModuleModalProps) {
  const [saved, setSaved] = useState(false);
  const [savedNote, setSavedNote] = useState(false);
  const [activeQuizModal, setActiveQuizModal] = useState<any | null>(null);
  const [formulaFitMode, setFormulaFitMode] = useState<"scroll" | "fit">("scroll");

  if (!isOpen || !module) return null;

  const handleSaveToLibrary = () => {
    try {
      saveCustomModule(module);
      recordStudyActivity("module");
      setSaved(true);
      if (onSaved) onSaved();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to save custom module to library:", err);
    }
  };

  const handleOpenMasteryQuiz = () => {
    const quiz = getCustomMasteryQuizForModule(module.id);
    if (quiz) {
      setActiveQuizModal(quiz);
    } else {
      // Fallback synthetic quiz placeholder if still generating
      setActiveQuizModal({
        moduleId: module.id,
        title: `Mastery Challenge: ${module.subtopicTitle}`,
        questions: [],
      });
    }
  };

  const handleSaveToNotes = () => {
    try {
      const theoryText = typeof module.theory === "string" ? module.theory : JSON.stringify(module.theory || "", null, 2);
      const noteContent = `# ${module.code || "CUSTOM"}: ${module.subtopicTitle}\n\n**Domain:** ${module.domain} | **Topic:** ${module.topicTitle}\n\n## Theory & Key Provisions\n${theoryText}\n\n## Key Formulas\n${JSON.stringify(module.formulas || [], null, 2)}`;

      saveStoredNote({
        id: `note_mod_${module.id || Date.now()}`,
        title: `${module.code || "Module"}: ${module.subtopicTitle}`,
        type: "custom_note",
        content: noteContent,
        tags: ["Custom Module", module.domain || "EST", "AI Study"],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      recordStudyActivity("note");
      setSavedNote(true);
      setTimeout(() => setSavedNote(false), 2500);
    } catch (err) {
      console.error("Failed to save module as note:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-5xl h-[92vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--surface2)] shrink-0 gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                  {module.code || "CUSTOM-AI"}
                </span>
                <h2 className="text-sm sm:text-base font-bold text-[var(--text)] truncate max-w-xs sm:max-w-md">
                  {module.subtopicTitle}
                </h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Formula Fit Mode Toggle */}
            <button
              type="button"
              onClick={() => setFormulaFitMode((prev) => (prev === "scroll" ? "fit" : "scroll"))}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                formulaFitMode === "fit"
                  ? "bg-primary/15 border-primary/40 text-primary font-bold"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text2)] hover:text-[var(--text)]"
              }`}
              title={formulaFitMode === "fit" ? "Switch to Scrollable Formulas" : "Fit Formulas to Screen Width"}
            >
              <span>{formulaFitMode === "fit" ? "📐 Fit Math" : "↔️ Scroll Math"}</span>
            </button>

            <button
              onClick={handleOpenMasteryQuiz}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-bold hover:brightness-110 shadow-xs transition-all cursor-pointer"
              title="Launch Paired Mastery Challenge"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Mastery Challenge</span>
            </button>

            <button
              onClick={handleSaveToNotes}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                savedNote
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-[var(--surface)] border-[var(--border)] text-[var(--text2)] hover:text-primary hover:border-primary/40"
              }`}
            >
              {savedNote ? <Check className="w-3.5 h-3.5" /> : <BookMarked className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{savedNote ? "Saved to Notes!" : "Save to Notes"}</span>
            </button>

            <button
              onClick={handleSaveToLibrary}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{saved ? "Saved to Library!" : "Save to My Modules"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Full Interactive Module Reader */}
        <div className="flex-1 overflow-y-auto">
          <ModuleReader
            module={module}
            isModal={true}
            externalFitMode={formulaFitMode}
            onOpenMastery={handleOpenMasteryQuiz}
          />
        </div>
      </div>

      {/* Paired Custom Mastery Quiz Modal */}
      {activeQuizModal && (
        <CustomQuizModal
          isOpen={!!activeQuizModal}
          onClose={() => setActiveQuizModal(null)}
          quiz={activeQuizModal}
          module={module}
        />
      )}
    </div>
  );
}
