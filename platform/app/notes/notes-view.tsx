"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { MathText } from "@/components/math-text";
import {
  UserNote,
  NoteDomain,
  NoteType,
  getStoredNotes,
  saveStoredNote,
  deleteStoredNote,
  exportStudyVault,
  importStudyVault,
} from "@/lib/notes";
import {
  BookMarked,
  Search,
  Plus,
  Download,
  Upload,
  Trash2,
  Edit3,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  Tag,
  Clock,
  Layers,
  Filter,
  X,
  FileText,
  Zap,
  Bookmark,
  ChevronRight,
} from "lucide-react";

export function NotesView() {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Note editor modal state
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Form fields for Editor
  const [formTitle, setFormTitle] = useState("");
  const [formDomain, setFormDomain] = useState<NoteDomain>("GENERAL");
  const [formTopicCode, setFormTopicCode] = useState("");
  const [formType, setFormType] = useState<NoteType>("custom_note");
  const [formContent, setFormContent] = useState("");

  useEffect(() => {
    setNotes(getStoredNotes());
  }, []);

  const handleOpenEditor = (note?: UserNote) => {
    if (note) {
      setEditingNote(note);
      setFormTitle(note.title);
      setFormDomain(note.domain || "GENERAL");
      setFormTopicCode(note.topicCode || "");
      setFormType(note.type);
      setFormContent(note.content);
    } else {
      setEditingNote(null);
      setFormTitle("");
      setFormDomain("GENERAL");
      setFormTopicCode("");
      setFormType("custom_note");
      setFormContent("");
    }
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingNote(null);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const noteToSave: UserNote = {
      id: editingNote ? editingNote.id : `note_${Date.now()}`,
      title: formTitle.trim(),
      domain: formDomain,
      topicCode: formTopicCode.trim() || undefined,
      type: formType,
      content: formContent.trim(),
      sourceModuleId: editingNote?.sourceModuleId,
      sourceSubtopicTitle: editingNote?.sourceSubtopicTitle,
      createdAt: editingNote ? editingNote.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    const updated = saveStoredNote(noteToSave);
    setNotes(updated);
    handleCloseEditor();
  };

  const handleDeleteNote = (id: string) => {
    const updated = deleteStoredNote(id);
    setNotes(updated);
  };

  const handleCopyContent = (note: UserNote) => {
    navigator.clipboard.writeText(`${note.title}\n\n${note.content}`);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        const res = importStudyVault(result);
        if (res.success) {
          setNotes(getStoredNotes());
          setImportStatus(`Successfully imported ${res.notesCount} notes and ${res.modulesCount} custom modules!`);
        } else {
          setImportStatus(`Import failed: ${res.error || "Invalid file"}`);
        }
        setTimeout(() => setImportStatus(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedDomain !== "all" && n.domain !== selectedDomain) return false;
      if (selectedType !== "all" && n.type !== selectedType) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(query);
        const matchContent = n.content.toLowerCase().includes(query);
        const matchTopic = (n.topicCode || "").toLowerCase().includes(query);
        const matchSubtopic = (n.sourceSubtopicTitle || "").toLowerCase().includes(query);
        return matchTitle || matchContent || matchTopic || matchSubtopic;
      }
      return true;
    });
  }, [notes, selectedDomain, selectedType, search]);

  const domainBadges: Record<string, string> = {
    MATH: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    ELECS: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    GEAS: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    EST: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    GENERAL: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  };

  const typeLabels: Record<NoteType, { label: string; icon: any; color: string }> = {
    formula_card: { label: "Formula Card", icon: Zap, color: "text-purple-500" },
    module_highlight: { label: "Module Highlight", icon: Bookmark, color: "text-blue-500" },
    mnemonic_trap: { label: "Exam Mnemonic", icon: Sparkles, color: "text-amber-500" },
    custom_note: { label: "Custom Note", icon: FileText, color: "text-emerald-500" },
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] flex flex-col">
      <Navbar breadcrumb="Personal Notebook" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Top Header Card */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <BookMarked className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-[var(--text)]">
                Personal Study Notebook & Vault
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[var(--text2)] max-w-2xl">
              Your private collection of formula cheat-sheets, text highlights, board mnemonics, and custom notes. 100% saved locally on your device.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleOpenEditor()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>

            <button
              onClick={exportStudyVault}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] hover:border-primary/30 text-[var(--text)] text-xs font-semibold transition-all cursor-pointer"
              title="Export all notes and custom modules to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Vault</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] hover:border-primary/30 text-[var(--text)] text-xs font-semibold transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-xs font-semibold text-primary flex items-center justify-between">
            <span>{importStatus}</span>
            <button onClick={() => setImportStatus(null)} className="p-1 hover:opacity-80">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
            <input
              type="text"
              placeholder="Search your notes, formula cards, or highlights..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1 border-t border-[var(--border)]">
            {/* Domain Filters */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-mono text-[var(--text3)] uppercase mr-1">Subject:</span>
              {[
                { id: "all", label: "All" },
                { id: "MATH", label: "MATH" },
                { id: "ELECS", label: "ELECS" },
                { id: "GEAS", label: "GEAS" },
                { id: "EST", label: "EST" },
                { id: "GENERAL", label: "General" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDomain(d.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedDomain === d.id
                      ? "bg-primary text-white shadow-xs font-semibold"
                      : "bg-[var(--surface2)] text-[var(--text2)] hover:text-[var(--text)] border border-[var(--border)]"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-mono text-[var(--text3)] uppercase mr-1">Type:</span>
              {[
                { id: "all", label: "All Types" },
                { id: "formula_card", label: "Formulas" },
                { id: "module_highlight", label: "Highlights" },
                { id: "mnemonic_trap", label: "Mnemonics" },
                { id: "custom_note", label: "Custom" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedType === t.id
                      ? "bg-[var(--surface2)] text-primary border border-primary/40 font-semibold shadow-xs"
                      : "text-[var(--text3)] hover:text-[var(--text)]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="p-12 text-center bg-[var(--surface)] border border-[var(--border)] rounded-2xl space-y-4">
            <BookMarked className="w-10 h-10 mx-auto text-[var(--text3)] opacity-40" />
            <div className="space-y-1">
              <h3 className="font-bold text-base text-[var(--text)]">
                {notes.length === 0 ? "Your Personal Notebook is Empty" : "No matching notes found"}
              </h3>
              <p className="text-xs text-[var(--text3)] max-w-md mx-auto">
                {notes.length === 0
                  ? "Highlight any formula or derivation in learning modules to save snippets, or create custom formula cards and mnemonics here!"
                  : "Try adjusting your search query or subject filters."}
              </p>
            </div>

            {notes.length === 0 && (
              <div className="pt-2">
                <button
                  onClick={() => handleOpenEditor()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Note</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => {
              const TypeIcon = typeLabels[note.type]?.icon || FileText;
              return (
                <div
                  key={note.id}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-xs hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Card Top Metadata Bar */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                            domainBadges[note.domain || "GENERAL"] || domainBadges.GENERAL
                          }`}
                        >
                          {note.domain || "GENERAL"}
                          {note.topicCode ? ` • ${note.topicCode}` : ""}
                        </span>

                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--text3)]">
                          <TypeIcon className={`w-3 h-3 ${typeLabels[note.type]?.color || ""}`} />
                          <span>{typeLabels[note.type]?.label || "Note"}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopyContent(note)}
                          className="p-1 rounded-lg text-[var(--text3)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-colors cursor-pointer"
                          title="Copy note text"
                        >
                          {copiedId === note.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEditor(note)}
                          className="p-1 rounded-lg text-[var(--text3)] hover:text-primary hover:bg-[var(--surface2)] transition-colors cursor-pointer"
                          title="Edit note"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="p-1 rounded-lg text-[var(--text3)] hover:text-rose-500 hover:bg-[var(--surface2)] transition-colors cursor-pointer"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Note Title */}
                    <h2 className="font-bold text-sm sm:text-base text-[var(--text)] leading-snug">
                      {note.title}
                    </h2>

                    {/* Note Body (with KaTeX rendering) */}
                    <div className="text-xs text-[var(--text2)] leading-relaxed overflow-x-auto max-h-56 overflow-y-auto pr-1 space-y-2">
                      <MathText text={note.content} splitParagraphs={true} />
                    </div>
                  </div>

                  {/* Card Footer: Source Module Jump Link */}
                  {note.sourceModuleId && (
                    <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text3)]">
                      <span className="truncate max-w-[200px]">
                        From: {note.sourceSubtopicTitle || note.sourceModuleId}
                      </span>
                      <Link
                        href={`/learn/${note.sourceModuleId}`}
                        className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5 shrink-0"
                      >
                        <span>Open Lesson</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Note Creator / Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--surface2)] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[var(--text)]">
                  {editingNote ? "Edit Study Note" : "Create New Study Note"}
                </h2>
              </div>

              <button
                onClick={handleCloseEditor}
                className="p-1 rounded-lg text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maxima & Minima 1st Derivative Test / Laplace Table"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider">
                    Subject Domain
                  </label>
                  <select
                    value={formDomain}
                    onChange={(e) => setFormDomain(e.target.value as NoteDomain)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="GENERAL">General</option>
                    <option value="MATH">Mathematics (MATH)</option>
                    <option value="ELECS">Electronics (ELECS)</option>
                    <option value="GEAS">GEAS & Laws</option>
                    <option value="EST">EST Telecom</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider">
                    Topic Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. MATH-06"
                    value={formTopicCode}
                    onChange={(e) => setFormTopicCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider">
                    Note Type
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as NoteType)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="custom_note">Custom Note</option>
                    <option value="formula_card">Formula Card</option>
                    <option value="mnemonic_trap">Exam Mnemonic</option>
                    <option value="module_highlight">Module Highlight</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider">
                    Content (Markdown + KaTeX Math $...$ / $$...$$)
                  </label>
                  <span className="text-[11px] text-[var(--text3)]">Supports KaTeX</span>
                </div>
                <textarea
                  required
                  rows={6}
                  placeholder="Write your note here... Use $...$ for inline math and $$...$$ for display formulas."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] font-mono leading-relaxed focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Live KaTeX Preview */}
              {formContent.trim() && (
                <div className="p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                  <div className="text-[10px] font-mono font-bold text-[var(--text3)] uppercase">
                    Live KaTeX Preview:
                  </div>
                  <div className="text-xs text-[var(--text)] overflow-x-auto leading-relaxed">
                    <MathText text={formContent} splitParagraphs={true} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={handleCloseEditor}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface2)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-all cursor-pointer"
                >
                  {editingNote ? "Save Changes" : "Create Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
