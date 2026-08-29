"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MathText } from "@/components/math-text";
import {
  UserNote,
  NoteDomain,
  NoteType,
  getStoredNotes,
  saveStoredNote,
} from "@/lib/notes";
import {
  ArrowLeft,
  Save,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Zap,
  Sparkles,
  Eye,
  Edit3,
  Check,
  Tag,
  BookMarked,
  Info,
} from "lucide-react";

interface NoteEditorProps {
  noteId?: string;
}

export function NoteEditor({ noteId }: NoteEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState<NoteDomain>("GENERAL");
  const [topicCode, setTopicCode] = useState("");
  const [type, setType] = useState<NoteType>("custom_note");
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [sourceInfo, setSourceInfo] = useState<{ id?: string; title?: string } | null>(null);

  // Load existing note if editing
  useEffect(() => {
    if (noteId) {
      const all = getStoredNotes();
      const existing = all.find((n) => n.id === noteId);
      if (existing) {
        setTitle(existing.title);
        setDomain(existing.domain || "GENERAL");
        setTopicCode(existing.topicCode || "");
        setType(existing.type);
        setContent(existing.content);
        if (existing.sourceModuleId) {
          setSourceInfo({
            id: existing.sourceModuleId,
            title: existing.sourceSubtopicTitle,
          });
        }
      }
    }
  }, [noteId]);

  // Insert markdown syntax helper
  const insertSyntax = (before: string, after: string = "", defaultPlaceholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || defaultPlaceholder;

    const updated = content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 10);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Please provide both a title and content for your note.");
      return;
    }

    const noteToSave: UserNote = {
      id: noteId || `note_${Date.now()}`,
      title: title.trim(),
      domain,
      topicCode: topicCode.trim() || undefined,
      type,
      content: content.trim(),
      sourceModuleId: sourceInfo?.id,
      sourceSubtopicTitle: sourceInfo?.title,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    saveStoredNote(noteToSave);
    setIsSavedToast(true);
    setTimeout(() => {
      router.push("/notes");
    }, 600);
  };

  // Keyboard shortcut: Cmd+S / Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, domain, topicCode, type, content]);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col">
      <Navbar breadcrumb={noteId ? "Edit Note" : "New Note"} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col space-y-4">
        {/* Top Header & Save Bar */}
        <div className="flex items-center justify-between gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 sm:p-4 shadow-xs">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/notes"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--text2)] hover:text-primary transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Notebook</span>
            </Link>
            <span className="text-[var(--text3)]">/</span>
            <h1 className="text-sm sm:text-base font-bold font-serif text-[var(--text)] truncate">
              {noteId ? "Edit Study Note" : "Create New Study Note"}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile Tab Switcher */}
            <div className="lg:hidden flex items-center p-1 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "edit"
                    ? "bg-primary text-white shadow-xs"
                    : "text-[var(--text3)] hover:text-[var(--text)]"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "preview"
                    ? "bg-primary text-white shadow-xs"
                    : "text-[var(--text3)] hover:text-[var(--text)]"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSave()}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              {isSavedToast ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Note</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Note Metadata Fields */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div>
            <input
              type="text"
              placeholder="Note Title (e.g. Maxima & Minima 1st Derivative Test / RA 9292 Penalties)..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-base sm:text-lg font-bold font-serif bg-transparent text-[var(--text)] placeholder-[var(--text3)] border-b border-[var(--border)] pb-2 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-[var(--text3)] uppercase">
                Subject
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as NoteDomain)}
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-primary font-mono transition-colors"
              >
                <option value="GENERAL">General</option>
                <option value="MATH">MATH (Mathematics)</option>
                <option value="ELECS">ELECS (Electronics)</option>
                <option value="GEAS">GEAS & Laws</option>
                <option value="EST">EST Telecom</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-[var(--text3)] uppercase">
                Topic Code
              </label>
              <input
                type="text"
                placeholder="e.g. MATH-06, ELEC-07"
                value={topicCode}
                onChange={(e) => setTopicCode(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-primary font-mono transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono font-bold text-[var(--text3)] uppercase">
                Note Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as NoteType)}
                className="w-full px-3 py-1.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
              >
                <option value="custom_note">📝 Custom Note</option>
                <option value="formula_card">⚡ Formula Card</option>
                <option value="mnemonic_trap">💡 Exam Mnemonic</option>
                <option value="module_highlight">🔖 Module Highlight</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lightweight Markdown & KaTeX Formatting Toolbar */}
        <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => insertSyntax("**", "**", "bold text")}
            className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text2)] hover:text-primary transition-colors"
            title="Bold (**text**)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertSyntax("*", "*", "italic text")}
            className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text2)] hover:text-primary transition-colors"
            title="Italic (*text*)"
          >
            <Italic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertSyntax("### ", "", "Heading 3")}
            className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text2)] hover:text-primary transition-colors"
            title="Heading (### )"
          >
            <Heading className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[var(--border)] mx-1"></div>

          <button
            type="button"
            onClick={() => insertSyntax("- ", "", "List item")}
            className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text2)] hover:text-primary transition-colors"
            title="Bullet List (- )"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => insertSyntax("1. ", "", "First item")}
            className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-[var(--text2)] hover:text-primary transition-colors"
            title="Numbered List (1. )"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-[var(--border)] mx-1"></div>

          <button
            type="button"
            onClick={() => insertSyntax("$", "$", "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}")}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--surface)] text-xs font-mono font-bold text-[var(--text2)] hover:text-primary transition-colors"
            title="Inline Math ($...$)"
          >
            <span>$ Inline</span>
          </button>

          <button
            type="button"
            onClick={() => insertSyntax("$$\n", "\n$$", "\\int_{a}^{b} f(x) \\, dx")}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--surface)] text-xs font-mono font-bold text-[var(--text2)] hover:text-primary transition-colors"
            title="Display Formula ($$...$$)"
          >
            <span>$$ Block</span>
          </button>

          <button
            type="button"
            onClick={() =>
              insertSyntax(
                "> [!TIP]\n> **Karce Speed Technique**:\n> Key Sequence: `[MODE]` `[5]` `[1]`\n",
                "",
                ""
              )
            }
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--surface)] text-xs font-mono font-bold text-amber-500 hover:text-amber-600 transition-colors"
            title="Insert Calculator Speed Trick Callout"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Speed Trick</span>
          </button>
        </div>

        {/* Dual Canvas: Left Editor <-> Right KaTeX Live Preview */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[420px]">
          {/* Editor Pane */}
          <div
            className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-xs flex flex-col ${
              activeTab === "edit" ? "flex" : "hidden lg:flex"
            }`}
          >
            <div className="text-[10px] font-mono font-bold text-[var(--text3)] uppercase mb-2 flex items-center justify-between">
              <span>Markdown & LaTeX Input</span>
              <span>Supports KaTeX $...$ / $$...$$</span>
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your study note, derivation, or formula summary here... Use $...$ for math."
              className="flex-1 w-full bg-transparent text-sm text-[var(--text)] font-mono leading-relaxed focus:outline-none resize-none min-h-[350px]"
            />
          </div>

          {/* Live KaTeX Preview Pane */}
          <div
            className={`bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs flex flex-col overflow-y-auto ${
              activeTab === "preview" ? "flex" : "hidden lg:flex"
            }`}
          >
            <div className="text-[10px] font-mono font-bold text-[var(--text3)] uppercase mb-3 pb-2 border-b border-[var(--border)] flex items-center justify-between">
              <span>Live KaTeX Preview</span>
              {domain && (
                <span className="px-2 py-0.5 rounded text-[9px] bg-primary/10 text-primary font-bold">
                  {domain}
                </span>
              )}
            </div>

            {content.trim() ? (
              <div className="text-sm text-[var(--text)] leading-relaxed space-y-3">
                <MathText text={content} splitParagraphs={true} />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-xs text-[var(--text3)] p-6 space-y-2">
                <Sparkles className="w-8 h-8 opacity-30 text-primary" />
                <p>Type in markdown and math formulas on the left to see live KaTeX rendering here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
