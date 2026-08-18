"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderWithCount } from "@/lib/folders";
import {
  Upload,
  Sparkles,
  Lock,
  Globe,
  AlertCircle,
  Copy,
  Check,
  Folder as FolderIcon,
  ChevronDown,
} from "lucide-react";

export function UploadForm({ folders }: { folders: FolderWithCount[] }) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subjectTag, setSubjectTag] = useState("");
  const [folderId, setFolderId] = useState<string>("");
  const [visibility, setVisibility] = useState<"shared" | "private">("shared");
  const [csvContent, setCsvContent] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvContent(text || "");
      setErrors([]);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors(["Quiz title is required."]);
      return;
    }
    if (!csvContent.trim()) {
      setErrors(["Please choose or drop a CSV file."]);
      return;
    }

    setLoading(true);
    setErrors([]);

    try {
      const res = await fetch("/api/quizzes/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          subjectTag: subjectTag.trim() || null,
          folderId: folderId || null,
          visibility,
          csvContent,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.errors) {
        setErrors(data.errors || [data.error || "Failed to upload quiz."]);
      } else if (data.set) {
        router.push(`/quizzes/${data.set.id}`);
      }
    } catch (err: unknown) {
      setErrors([(err as Error).message || "An unexpected error occurred."]);
    } finally {
      setLoading(false);
    }
  };

  const copyPromptText = () => {
    const text = `You are an expert question writer. Generate a set of high-quality multiple-choice study questions based on the topic or material I provide. Output ONLY a valid CSV — no explanation, no markdown fences, no preamble, no commentary before or after. The file must be ready to save and import as-is.

REQUIRED CSV COLUMNS (exact header row, comma-separated):
question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag

COLUMN RULES:
- question: A clear, unambiguous question or scenario stem. Do not number it or add a label.
- choice_a through choice_d: Four answer options. Make distractors plausible and of similar length and style. Do not include A., B., C., D. labels inside the cell — just the option text.
- correct_answer: Lowercase single letter — exactly one of: a, b, c, or d.
- explanation: A thorough explanation (3–6 sentences) of WHY the correct answer is right, and briefly why each key distractor is wrong. To add a line break inside the explanation, write the two characters \\n as a literal separator — do NOT use an actual newline.
- image_url: Leave completely blank (empty cell) unless you have a real, publicly reachable image URL.
- subject_tag: A short topic label using consistent title casing (e.g., Cardiology, Constitutional Law, Organic Chemistry).

LATEX AND MATH FORMATTING RULES:
- Use LaTeX for ALL mathematical expressions, formulas, chemical notation, units, and Greek letters.
- Inline math: wrap in single dollar signs → $E = mc^2$, $\\alpha$-blocker, $K^+$
- Display (block) math: wrap in double dollar signs → $$PV = nRT$$
- Do NOT use Unicode math symbols (α, β, →, ×) — use LaTeX instead ($\alpha$, $\beta$, $\rightarrow$, $\times$).

CSV FORMATTING RULES:
- Wrap EVERY cell in double quotes.
- If a cell's content contains a double-quote character, escape it by doubling it: ""like this""
- Do NOT use actual newlines inside any cell — use \\n literal token instead.
- Use comma (,) as delimiter.`;

    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-[var(--shadow-lg)] space-y-6"
      >
        <div className="border-b border-[var(--border)] pb-4">
          <h2 className="text-xl font-bold font-serif text-[var(--text)]">
            Upload Question Set
          </h2>
          <p className="text-xs text-[var(--text2)] mt-1">
            Import a multiple-choice question set from a standard CSV file.
          </p>
        </div>

        {/* Dropzone */}
        <div>
          <label className="block text-xs font-bold text-[var(--text3)] uppercase tracking-wider font-mono mb-2">
            CSV File
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all relative ${
              dragOver
                ? "border-[var(--accent)] bg-[rgba(217,119,87,0.06)]"
                : "border-[var(--border2)] hover:border-[var(--accent)] bg-[var(--surface2)]"
            }`}
          >
            <input
              type="file"
              accept=".csv,.txt"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="text-3xl mb-2">📄</div>
            <div className="text-sm font-semibold text-[var(--text)]">
              {fileName ? (
                <span className="text-[var(--accent)]">{fileName}</span>
              ) : (
                <>
                  Click or drag &amp; drop a <strong>.csv</strong> file here
                </>
              )}
            </div>
            <div className="text-xs text-[var(--text3)] mt-1">
              Supports standard 9-column question format
            </div>
          </div>
        </div>

        {/* Error Box */}
        {errors.length > 0 && (
          <div className="p-4 rounded-xl bg-[rgba(184,50,40,0.08)] border border-[rgba(184,50,40,0.3)] text-xs text-[var(--red)] space-y-1 max-h-48 overflow-y-auto">
            <div className="font-bold flex items-center gap-1.5 mb-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Import Validation Errors ({errors.length})</span>
            </div>
            <ul className="list-disc pl-4 space-y-1">
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Title & Subject Tag */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text3)] uppercase tracking-wider font-mono mb-1.5">
              Set Title <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cardiology Board Review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text3)] uppercase tracking-wider font-mono mb-1.5">
              Subject Tag (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Pharmacology"
              value={subjectTag}
              onChange={(e) => setSubjectTag(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
          </div>
        </div>

        {/* Folder & Privacy (Phase 2) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[var(--border)]">
          {/* Folder */}
          <div>
            <label className="block text-xs font-bold text-[var(--text3)] uppercase tracking-wider font-mono mb-1.5">
              Assign to Folder
            </label>
            <div className="relative">
              <select
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] appearance-none transition-colors"
              >
                <option value="">(No folder — Unfiled)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
              <FolderIcon className="w-4 h-4 text-[var(--text3)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-xs font-bold text-[var(--text3)] uppercase tracking-wider font-mono mb-1.5">
              Visibility
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setVisibility("shared")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  visibility === "shared"
                    ? "bg-[var(--surface2)] border-[var(--accent)] text-[var(--accent)] shadow-sm"
                    : "border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)]"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Shared</span>
              </button>
              <button
                type="button"
                onClick={() => setVisibility("private")}
                className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  visibility === "private"
                    ? "bg-[var(--surface2)] border-[var(--accent)] text-[var(--accent)] shadow-sm"
                    : "border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)]"
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Private</span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !csvContent}
          className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:brightness-110 shadow-sm transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>{loading ? "Parsing and Validating..." : "Create & Launch Quiz →"}</span>
        </button>
      </form>

      {/* AI Prompt Helper Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-[var(--shadow)]">
        <button
          type="button"
          onClick={() => setPromptOpen(!promptOpen)}
          className="w-full p-5 flex items-center justify-between hover:bg-[var(--surface2)] transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text)]">
                Generate question sets with AI
              </div>
              <div className="text-xs text-[var(--text2)]">
                Copy this prompt and paste into ChatGPT, Claude, or Gemini
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-[var(--text3)] transition-transform ${
              promptOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {promptOpen && (
          <div className="p-5 border-t border-[var(--border)] bg-[var(--surface2)] space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-[var(--text3)] uppercase">
                Ready-to-use Prompt Template
              </span>
              <button
                type="button"
                onClick={copyPromptText}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--green)]" />
                    <span className="text-[var(--green)]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3.5 rounded-lg bg-[var(--bg2)] border border-[var(--border)] text-xs text-[var(--text2)] font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {`You are an expert question writer. Generate a set of high-quality multiple-choice study questions based on the topic or material I provide. Output ONLY a valid CSV — no explanation, no markdown fences, no preamble, no commentary before or after. The file must be ready to save and import as-is.

REQUIRED CSV COLUMNS (exact header row, comma-separated):
question,choice_a,choice_b,choice_c,choice_d,correct_answer,explanation,image_url,subject_tag

COLUMN RULES:
- question: A clear, unambiguous question or scenario stem.
- choice_a through choice_d: Four answer options.
- correct_answer: Lowercase single letter: a, b, c, or d.
- explanation: A thorough explanation (3–6 sentences) of WHY the correct answer is right and key distractors are wrong. To add line breaks, write \\n as a literal sequence.
- image_url: Leave blank unless you have a real public URL.
- subject_tag: A short topic label (e.g., Cardiology, Law, Biochemistry).`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
