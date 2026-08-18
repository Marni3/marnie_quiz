"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import {
  Search,
  Folder as FolderIcon,
  Plus,
  Lock,
  Globe,
  Upload,
  Sparkles,
  Layers,
  ChevronRight,
  FolderPlus,
  Trash2,
} from "lucide-react";
import { QuizListItem } from "@/lib/quizzes";
import { FolderWithCount } from "@/lib/folders";

interface LibraryViewProps {
  initialQuizzes: QuizListItem[];
  initialFolders: FolderWithCount[];
  currentUserId: string;
}

export function LibraryView({
  initialQuizzes,
  initialFolders,
  currentUserId,
}: LibraryViewProps) {
  const [quizzes] = useState<QuizListItem[]>(initialQuizzes);
  const [folders, setFolders] = useState<FolderWithCount[]>(initialFolders);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);

  // Extract all unique subject tags
  const allTags = Array.from(
    new Set(
      quizzes
        .map((q) => q.subjectTag)
        .filter((t): t is string => Boolean(t && t.trim()))
    )
  ).sort();

  // Filter quizzes
  const filteredQuizzes = quizzes.filter((q) => {
    if (selectedFolderId === "unfiled") {
      if (q.folderId) return false;
    } else if (selectedFolderId) {
      if (q.folderId !== selectedFolderId) return false;
    }

    if (selectedTag && q.subjectTag !== selectedTag) return false;

    if (search.trim()) {
      const query = search.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(query);
      const matchSubject = q.subjectTag?.toLowerCase().includes(query);
      const matchUploader = q.uploader.name?.toLowerCase().includes(query);
      if (!matchTitle && !matchSubject && !matchUploader) return false;
    }

    return true;
  });

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName.trim() }),
      });
      const data = await res.json();
      if (data.success && data.folder) {
        setFolders([{ ...data.folder, quizCount: 0 }, ...folders]);
        setNewFolderName("");
        setShowNewFolder(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder? The quizzes inside will remain unfiled.")) {
      return;
    }
    try {
      const res = await fetch(`/api/folders/${folderId}`, { method: "DELETE" });
      if (res.ok) {
        setFolders(folders.filter((f) => f.id !== folderId));
        if (selectedFolderId === folderId) setSelectedFolderId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar breadcrumb="Library" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[var(--text)] tracking-tight">
              Study <em>Library</em>
            </h1>
            <p className="text-sm text-[var(--text2)] mt-1">
              Browse shared board exam questions, filter by subject, or organize into folders.
            </p>
          </div>

          <Link
            href="/quizzes/upload"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white font-semibold text-sm hover:brightness-110 shadow-sm transition-all cursor-pointer self-start sm:self-auto shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New CSV</span>
          </Link>
        </div>

        {/* Layout: Folder Sidebar + Main Quiz Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Folders & Filters */}
          <aside className="lg:col-span-1 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[var(--text3)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search quizzes & topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            {/* Folders Section (Phase 2) */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-[var(--shadow)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[var(--text3)] uppercase tracking-wider font-mono">
                  Folders
                </span>
                <button
                  type="button"
                  onClick={() => setShowNewFolder(!showNewFolder)}
                  className="p-1 rounded-md text-[var(--text3)] hover:text-[var(--accent)] hover:bg-[var(--surface2)] transition-colors"
                  title="Create folder"
                >
                  <FolderPlus className="w-4 h-4" />
                </button>
              </div>

              {showNewFolder && (
                <form onSubmit={handleCreateFolder} className="mb-3 space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="New folder name..."
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-[var(--surface2)] border border-[var(--border)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={creatingFolder || !newFolderName.trim()}
                      className="flex-1 px-2 py-1 bg-[var(--accent)] text-white text-xs font-semibold rounded-md hover:brightness-110"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewFolder(false)}
                      className="px-2 py-1 bg-[var(--surface2)] text-[var(--text2)] text-xs rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setSelectedFolderId(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedFolderId === null
                      ? "bg-[var(--surface2)] text-[var(--accent)] font-semibold"
                      : "text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5" />
                    All Quizzes
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text3)]">
                    {quizzes.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFolderId("unfiled")}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedFolderId === "unfiled"
                      ? "bg-[var(--surface2)] text-[var(--accent)] font-semibold"
                      : "text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FolderIcon className="w-3.5 h-3.5 opacity-60" />
                    Unfiled
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text3)]">
                    {quizzes.filter((q) => !q.folderId).length}
                  </span>
                </button>

                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      selectedFolderId === folder.id
                        ? "bg-[var(--surface2)] text-[var(--accent)] font-semibold"
                        : "text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedFolderId(folder.id)}
                      className="flex items-center gap-2 min-w-0 flex-1 text-left"
                    >
                      <FolderIcon className="w-3.5 h-3.5 shrink-0 text-[var(--accent)]" />
                      <span className="truncate">{folder.name}</span>
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-mono text-[var(--text3)]">
                        {quizzes.filter((q) => q.folderId === folder.id).length}
                      </span>
                      {folder.userId === currentUserId && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(folder.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 text-[var(--text3)] hover:text-[var(--red)] transition-opacity"
                          title="Delete folder"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Tags Filter */}
            {allTags.length > 0 && (
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 shadow-[var(--shadow)]">
                <span className="block text-xs font-bold text-[var(--text3)] uppercase tracking-wider font-mono mb-3">
                  Subjects
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedTag(null)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      selectedTag === null
                        ? "bg-[var(--accent)] text-white"
                        : "bg-[var(--surface2)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--accent)]"
                    }`}
                  >
                    All
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                        selectedTag === tag
                          ? "bg-[var(--accent)] text-white"
                          : "bg-[var(--surface2)] text-[var(--text2)] border border-[var(--border)] hover:border-[var(--accent)]"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main: Quizzes Grid */}
          <div className="lg:col-span-3">
            {filteredQuizzes.length === 0 ? (
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-12 text-center shadow-[var(--shadow)]">
                <div className="w-12 h-12 rounded-2xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text3)] flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-serif text-[var(--text)]">
                  No question sets found
                </h3>
                <p className="text-sm text-[var(--text2)] mt-1.5 max-w-sm mx-auto">
                  {search || selectedTag || selectedFolderId
                    ? "Try clearing your search filters or selecting a different folder."
                    : "Get started by uploading your first CSV question set."}
                </p>
                <Link
                  href="/quizzes/upload"
                  className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Upload First Quiz
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredQuizzes.map((quiz) => (
                  <Link
                    key={quiz.id}
                    href={`/quizzes/${quiz.id}`}
                    className="group bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] rounded-2xl p-5 shadow-[var(--shadow)] hover:shadow-[var(--shadow-lg)] transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {quiz.subjectTag ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[rgba(217,119,87,0.12)] text-[var(--accent)] border border-[rgba(217,119,87,0.25)]">
                              {quiz.subjectTag}
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[var(--surface2)] text-[var(--text3)] border border-[var(--border)]">
                              General
                            </span>
                          )}

                          {quiz.folderName && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--surface2)] text-[var(--text2)] flex items-center gap-1">
                              <FolderIcon className="w-2.5 h-2.5" />
                              {quiz.folderName}
                            </span>
                          )}
                        </div>

                        {quiz.visibility === "private" ? (
                          <span
                            className="text-[var(--yellow)] p-1"
                            title="Private to you"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span
                            className="text-[var(--text3)] p-1 opacity-40 group-hover:opacity-100 transition-opacity"
                            title="Shared with study group"
                          >
                            <Globe className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>

                      {/* Quiz Title */}
                      <h3 className="text-lg font-bold font-serif text-[var(--text)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {quiz.title}
                      </h3>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text3)]">
                      <div className="flex items-center gap-2">
                        {quiz.uploader.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={quiz.uploader.image}
                            alt=""
                            className="w-5 h-5 rounded-full border border-[var(--border)] object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-[var(--surface3)] flex items-center justify-center text-[10px] font-bold text-[var(--accent)]">
                            {quiz.uploader.name?.[0]?.toUpperCase() || "U"}
                          </div>
                        )}
                        <span className="truncate max-w-[100px]">
                          {quiz.uploader.name || "Anonymous"}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono font-semibold text-[var(--text2)]">
                          {quiz.questionCount} {quiz.questionCount === 1 ? "Q" : "Qs"}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[var(--text3)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
