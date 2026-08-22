"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { FolderWithCount } from "@/lib/folders";
import { inferQuestionMetadata } from "@/lib/heuristic-classifier";
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
  Download,
  CheckCircle2,
  Sliders,
  Tag
} from "lucide-react";

interface ParsedQuestionPreview {
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string;
  explanation: string;
  image_url: string;
  subject_tag: string;
  archetype: string;
  micro_cluster: string;
  is_anchor: boolean;
}

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

  // 3-Layer Ingestion Pre-Upload Preview State
  const [previewRows, setPreviewRows] = useState<ParsedQuestionPreview[]>([]);

  const parseAndAutoTag = (text: string, currentTitle: string, currentSubject: string) => {
    try {
      const parsed = Papa.parse<Record<string, string>>(text, {
        header: true,
        skipEmptyLines: "greedy",
      });

      if (parsed.data && parsed.data.length > 0) {
        const enriched: ParsedQuestionPreview[] = parsed.data.map((row) => {
          const prompt = row.question || "";
          const expl = row.explanation || "";
          const subj = row.subject_tag || currentSubject || "";

          // If archetype was not explicitly in the CSV, run heuristic classifier
          let arc = row.archetype ? row.archetype.toLowerCase().trim() : "";
          let anchor = row.is_anchor === "true" || row.is_anchor === "1";
          let micro = row.micro_cluster || subj;

          if (!arc || arc === "standard") {
            const inferred = inferQuestionMetadata({
              promptText: prompt,
              explanation: expl,
              subjectTag: subj,
              title: currentTitle,
            });
            arc = inferred.archetype;
            if (!row.is_anchor) anchor = inferred.isAnchor;
            if (!row.micro_cluster) micro = inferred.microCluster || subj;
          }

          return {
            question: prompt,
            choice_a: row.choice_a || "",
            choice_b: row.choice_b || "",
            choice_c: row.choice_c || "",
            choice_d: row.choice_d || "",
            correct_answer: (row.correct_answer || "a").toLowerCase().trim(),
            explanation: expl,
            image_url: row.image_url || "",
            subject_tag: subj,
            archetype: arc || "standard",
            micro_cluster: micro,
            is_anchor: anchor,
          };
        });

        setPreviewRows(enriched);
      }
    } catch {
      // fallback
    }
  };

  const handleFile = (file: File) => {
    if (!file) return;
    setFileName(file.name);
    const inferredTitle = title || file.name.replace(/\.[^/.]+$/, "");
    if (!title) setTitle(inferredTitle);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      setCsvContent(text);
      setErrors([]);
      parseAndAutoTag(text, inferredTitle, subjectTag);
    };
    reader.readAsText(file);
  };

  const updatePreviewRow = (idx: number, field: keyof ParsedQuestionPreview, val: any) => {
    setPreviewRows((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrors(["Quiz title is required."]);
      return;
    }
    if (!csvContent.trim() && previewRows.length === 0) {
      setErrors(["Please choose or drop a CSV file."]);
      return;
    }

    setLoading(true);
    setErrors([]);

    // Reconstruct CSV from verified preview rows if edited
    let finalCsv = csvContent;
    if (previewRows.length > 0) {
      finalCsv = Papa.unparse(previewRows, { quotes: true });
    }

    try {
      const res = await fetch("/api/quizzes/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          subjectTag: subjectTag.trim() || null,
          folderId: folderId || null,
          visibility,
          csvText: finalCsv,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        if (data.errors && Array.isArray(data.errors)) {
          setErrors(data.errors);
        } else {
          setErrors([data.error || "Failed to upload quiz set."]);
        }
        setLoading(false);
      } else {
        router.push(`/quizzes/${data.questionSet.id}`);
      }
    } catch {
      setErrors(["A network error occurred while uploading. Please try again."]);
      setLoading(false);
    }
  };

  const samplePrompt = `Generate a 25-question multiple choice test on the following topic: [INSERT TOPIC].
Format requirements:
- Output ONLY a valid CSV with headers: "question","choice_a","choice_b","choice_c","choice_d","correct_answer","explanation","image_url","subject_tag","archetype","micro_cluster","is_anchor"
- Wrap all cells in double quotes.
- correct_answer must be lowercase single letter (a, b, c, or d).
- Include detailed explanations with calculator speed tips.`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Download Template Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--text)]">Official CSV Template</div>
            <div className="text-[11px] text-[var(--text3)]">Pre-formatted with LaTeX math and 12-column archetypes.</div>
          </div>
        </div>

        <a
          href="/api/quizzes/template"
          download="marnie_quiz_template.csv"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-semibold text-[var(--accent)] hover:border-[var(--accent)] transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download CSV Template</span>
        </a>
      </div>

      {errors.length > 0 && (
        <div className="p-4 rounded-xl bg-[var(--red-light)] border border-[var(--red)]/20 space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--red)]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Upload validation errors:</span>
          </div>
          <ul className="list-disc list-inside text-xs text-[var(--red)]/90 space-y-0.5 pl-5 font-mono">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Metadata Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text3)] uppercase tracking-wider mb-1.5 font-mono">
            Quiz Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. ELEC 03 - DC Circuits • Diagnostic (Set 01)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-[var(--accent)] transition-colors font-medium"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text3)] uppercase tracking-wider mb-1.5 font-mono">
            Subject / Topic Tag
          </label>
          <input
            type="text"
            placeholder="e.g. DC Circuits, Analytic Geometry, Antennas"
            value={subjectTag}
            onChange={(e) => setSubjectTag(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>
      </div>

      {/* Visibility & Folder Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[var(--text3)] uppercase tracking-wider mb-1.5 font-mono">
            Visibility
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setVisibility("shared")}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                visibility === "shared"
                  ? "bg-[var(--surface2)] border-[var(--accent)] text-[var(--accent)] shadow-sm"
                  : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)]"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Shared with Friends</span>
            </button>

            <button
              type="button"
              onClick={() => setVisibility("private")}
              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                visibility === "private"
                  ? "bg-[var(--surface2)] border-[var(--accent)] text-[var(--accent)] shadow-sm"
                  : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)]"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Private to Me</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--text3)] uppercase tracking-wider mb-1.5 font-mono">
            Organize in Folder (Optional)
          </label>
          <select
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors cursor-pointer"
          >
            <option value="">No folder (Root library)</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                📁 {f.name} ({f.quizCount} sets)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CSV File Upload Drop Zone */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text3)] uppercase tracking-wider mb-1.5 font-mono">
          CSV File Upload
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
            if (e.dataTransfer.files?.[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            dragOver
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-[var(--border2)] hover:border-[var(--accent)]/50 bg-[var(--surface2)]/50"
          }`}
        >
          <input
            type="file"
            id="csv-file"
            accept=".csv"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
            className="hidden"
          />

          <label htmlFor="csv-file" className="cursor-pointer block">
            <div className="w-12 h-12 rounded-2xl bg-[var(--surface3)] border border-[var(--border)] text-[var(--accent)] flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>

            {fileName ? (
              <div>
                <p className="text-sm font-bold text-[var(--text)] flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span>{fileName}</span>
                </p>
                <p className="text-xs text-[var(--text3)] mt-1 font-mono">
                  {previewRows.length} questions parsed and auto-tagged
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">
                  Click to select CSV or drag and drop file here
                </p>
                <p className="text-xs text-[var(--text3)] mt-1">
                  Accepts standard 9-column or extended 12-column CSV formats
                </p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* 3-Layer Pre-Upload Interactive Review Table */}
      {previewRows.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 shadow-[var(--shadow)] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold font-serif text-[var(--text)]">
                Pre-Upload Auto-Tagging Preview ({previewRows.length} Questions)
              </h3>
            </div>
            <span className="text-xs text-[var(--text3)]">
              Verify or adjust archetype &amp; anchor badges before publishing
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)] text-xs">
            {previewRows.slice(0, 15).map((q, idx) => (
              <div key={idx} className="py-2.5 flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <span className="font-mono text-[var(--text3)] mr-2">#{idx + 1}</span>
                  <span className="text-[var(--text)] font-medium line-clamp-1">{q.question}</span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Archetype Dropdown */}
                  <select
                    value={q.archetype}
                    onChange={(e) => updatePreviewRow(idx, "archetype", e.target.value)}
                    className="px-2 py-1 rounded bg-[var(--surface2)] border border-[var(--border)] text-[11px] font-mono text-[var(--text)] focus:border-[var(--accent)]"
                  >
                    <option value="standard">Standard Solves</option>
                    <option value="scaling">Scaling / Proportions</option>
                    <option value="boundary">Boundary / Limits</option>
                    <option value="phase">Phase / Polarities</option>
                    <option value="fault">Fault / Diagnostics</option>
                    <option value="material">Solid-State / Material</option>
                    <option value="theorem">Theorem / Invariants</option>
                    <option value="trap">Common Pitfall</option>
                  </select>

                  {/* Anchor Toggle */}
                  <button
                    type="button"
                    onClick={() => updatePreviewRow(idx, "is_anchor", !q.is_anchor)}
                    className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer ${
                      q.is_anchor
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                        : "bg-[var(--surface2)] text-[var(--text3)] border border-[var(--border)]"
                    }`}
                  >
                    {q.is_anchor ? "★ Anchor" : "Regular"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {previewRows.length > 15 && (
            <div className="text-center text-xs text-[var(--text3)] font-mono pt-2 border-t border-[var(--border)]">
              + {previewRows.length - 15} more questions ready for ingestion
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border)]">
        <button
          type="button"
          onClick={() => router.push("/quizzes")}
          className="px-4 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-xs font-semibold text-[var(--text2)] hover:text-[var(--text)] transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading || (!csvContent && previewRows.length === 0)}
          className="px-6 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          <span>{loading ? "Validating & Publishing..." : "Publish to Library"}</span>
        </button>
      </div>
    </form>
  );
}
