"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ByokModal } from "./byok-modal";
import { QuickActions } from "./quick-actions";
import { ChatMessageItem } from "./chat-message";
import {
  AIProvider,
  ChatMessage,
  ChatSession,
  TutorFunctionMode,
} from "@/lib/tutor/types";
import {
  getStoredActiveProvider,
  getStoredActiveModel,
  setStoredActiveModel,
  getStoredApiKey,
  getStoredSessions,
  saveStoredSession,
  deleteStoredSession,
  getActiveSessionId,
  setActiveSessionId,
  getAndClearPendingReviewContext,
  getStoredModelsForProvider,
  setStoredModelsForProvider,
  StoredModelOption,
} from "@/lib/tutor/storage";
import { MODEL_CATALOG, DEFAULT_MODELS } from "@/lib/tutor/prompts";
import { recordStudyActivity } from "@/lib/streak";
import {
  Sparkles,
  Send,
  Key,
  PlusCircle,
  MessageSquare,
  BookOpen,
  Target,
  FileSpreadsheet,
  CheckSquare,
  ChevronDown,
  Paperclip,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Check,
  AlertCircle,
  Menu,
  Settings2,
  X,
  Bot,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function TutorView() {
  const searchParams = useSearchParams();
  const [isByokOpen, setIsByokOpen] = useState(false);
  const [byokInitialTab, setByokInitialTab] = useState<"keys" | "guide">("keys");
  const [isContextPickerOpen, setIsContextPickerOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Active configuration
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [model, setModel] = useState<string>("gemini-3.7-flash");
  const [hasKey, setHasKey] = useState(false);
  const [availableModels, setAvailableModels] = useState<StoredModelOption[]>([]);

  // Chat sessions
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);

  // Composer
  const [inputPrompt, setInputPrompt] = useState("");
  const [functionMode, setFunctionMode] = useState<TutorFunctionMode>("chat");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const [attachedContext, setAttachedContext] = useState<any | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadModelsForProvider = (prov: AIProvider, key?: string) => {
    const cached = getStoredModelsForProvider(prov);
    if (cached && cached.length > 0) {
      setAvailableModels(cached);
      return;
    }
    const catalogList = MODEL_CATALOG.filter((m) => m.provider === prov).map((m) => ({
      id: m.id,
      name: m.name,
      recommended: m.isRecommended,
    }));
    setAvailableModels(catalogList);

    const apiKey = key !== undefined ? key : getStoredApiKey(prov);
    if (apiKey && apiKey.trim()) {
      fetch("/api/tutor/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: prov, apiKey: apiKey.trim() }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.models && Array.isArray(data.models) && data.models.length > 0) {
            setAvailableModels(data.models);
            setStoredModelsForProvider(prov, data.models);
          }
        })
        .catch(() => {});
    }
  };

  // Initialize BYOK configs & sessions on mount
  useEffect(() => {
    const activeProv = getStoredActiveProvider();
    const activeMod = getStoredActiveModel(activeProv);
    const key = getStoredApiKey(activeProv);

    setProvider(activeProv);
    setModel(activeMod);
    setHasKey(!!key && key.trim().length > 0);
    loadModelsForProvider(activeProv, key);

    const storedSessions = getStoredSessions();
    setSessions(storedSessions);

    const setupReviewSession = (
      reviewPayload: any,
      prov: AIProvider,
      mod: string,
      apiKey?: string
    ) => {
      setAttachedContext({
        type: "attempt",
        title: reviewPayload?.examTitle || "Recent Exam Attempt",
        payload: reviewPayload,
      });
      setFunctionMode("review_exam");

      const newSession: ChatSession = {
        id: `session_${Date.now()}`,
        title: `Exam Review: ${reviewPayload?.examTitle || "Latest Quiz"}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        provider: prov,
        model: mod,
        messages: [],
        attachedContext: {
          type: "attempt",
          id: reviewPayload?.attemptId || "attempt",
          title: reviewPayload?.examTitle || "Recent Exam",
          payload: reviewPayload,
        },
      };

      setActiveSession(newSession);
      setActiveSessionId(newSession.id);
      saveStoredSession(newSession);

      if (apiKey && apiKey.trim()) {
        setTimeout(() => {
          handleSendMessage(
            "Please review my exam attempt step-by-step, deconstruct my missed questions, and teach me how to solve them correctly.",
            "review_exam",
            reviewPayload,
            newSession
          );
        }, 300);
      }
    };

    // Check if there is a pending review exam context from a quiz/mastery completion or URL param
    const pendingReview = getAndClearPendingReviewContext();
    const modeParam = searchParams.get("mode");
    const attemptIdParam = searchParams.get("attemptId");

    if (pendingReview || modeParam === "review_exam") {
      if (pendingReview) {
        setupReviewSession(pendingReview, activeProv, activeMod, key);
      } else if (attemptIdParam) {
        fetch(`/api/attempts/${attemptIdParam}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              const reviewPayload = {
                attemptId: data.attempt.id,
                examTitle: data.questionSet?.title || "Quiz Attempt",
                subjectTag: data.questionSet?.subjectTag,
                score: data.score,
                total: data.total,
                percentage: data.percentage,
                questions: data.questions?.map((q: any) => ({
                  id: q.id,
                  promptText: q.promptText,
                  selectedChoice: q.selectedChoice,
                  correctChoice: q.correctChoice,
                  isCorrect: q.isCorrect,
                  explanation: q.explanation || "",
                })),
              };
              setupReviewSession(reviewPayload, activeProv, activeMod, key);
            }
          })
          .catch((err) => console.warn("Failed to fetch attempt for AI debrief:", err));
      } else {
        setupReviewSession(null, activeProv, activeMod, key);
      }
    } else {
      const activeId = getActiveSessionId();
      const current = storedSessions.find((s) => s.id === activeId) || storedSessions[0];
      if (current) {
        setActiveSession(current);
        if (current.attachedContext) {
          setAttachedContext(current.attachedContext);
        }
      } else {
        createNewSession(activeProv, activeMod);
      }
    }
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, streamingContent]);

  const handleKeysUpdated = () => {
    const activeProv = getStoredActiveProvider();
    const activeMod = getStoredActiveModel(activeProv);
    const key = getStoredApiKey(activeProv);

    setProvider(activeProv);
    setModel(activeMod);
    setHasKey(!!key && key.trim().length > 0);
    loadModelsForProvider(activeProv, key);
  };

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
    setStoredActiveModel(provider, newModel);
    if (activeSession) {
      const updated = { ...activeSession, model: newModel, updatedAt: Date.now() };
      setActiveSession(updated);
      saveStoredSession(updated);
    }
  };

  const createNewSession = (prov: AIProvider = provider, mod: string = model) => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: "New AI Study Chat",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      provider: prov,
      model: mod,
      messages: [],
    };
    setActiveSession(newSession);
    setActiveSessionId(newSession.id);
    setSessions((prev) => [newSession, ...prev]);
    saveStoredSession(newSession);
    setAttachedContext(null);
    setFunctionMode("chat");
    setIsSidebarOpen(false);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteStoredSession(sessionId);
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    if (activeSession?.id === sessionId) {
      if (updated.length > 0) {
        setActiveSession(updated[0]);
        setActiveSessionId(updated[0].id);
      } else {
        createNewSession();
      }
    }
  };

  const handleSelectSession = (s: ChatSession) => {
    setActiveSession(s);
    setActiveSessionId(s.id);
    setAttachedContext(s.attachedContext || null);
    setIsSidebarOpen(false);
  };

  const handleQuickAction = (mode: TutorFunctionMode, defaultPrompt: string) => {
    setFunctionMode(mode);
    setInputPrompt(defaultPrompt);
    textareaRef.current?.focus();
  };

  const handleSendMessage = async (
    promptToSend?: string,
    overrideMode?: TutorFunctionMode,
    overrideContext?: any,
    targetSessionOverride?: ChatSession
  ) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isStreaming) return;

    const apiKey = getStoredApiKey(provider);
    if (!apiKey || !apiKey.trim()) {
      setIsByokOpen(true);
      return;
    }

    const currentSession = targetSessionOverride || activeSession;
    if (!currentSession) return;

    const currentMode = overrideMode || functionMode;
    const currentContext = overrideContext || attachedContext?.payload;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
      functionMode: currentMode,
    };

    const updatedMessages = [...currentSession.messages, userMsg];
    const sessionTitle =
      currentSession.messages.length === 0
        ? text.slice(0, 40) + (text.length > 40 ? "..." : "")
        : currentSession.title;

    const updatedSession: ChatSession = {
      ...currentSession,
      title: sessionTitle,
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    setActiveSession(updatedSession);
    saveStoredSession(updatedSession);
    recordStudyActivity("tutor");
    setInputPrompt("");
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/tutor/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider,
          apiKey: apiKey.trim(),
          model,
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          functionMode: currentMode,
          contextPayload: currentContext,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Status ${res.status}` }));
        throw new Error(err.error || "Streaming request failed.");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body.");

      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingContent(accumulated);
      }

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: "assistant",
        content: accumulated,
        timestamp: Date.now(),
        functionMode: currentMode,
      };

      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, assistantMsg],
        updatedAt: Date.now(),
      };

      setActiveSession(finalSession);
      saveStoredSession(finalSession);
      setSessions((prev) =>
        prev.map((s) => (s.id === finalSession.id ? finalSession : s))
      );
    } catch (err: any) {
      console.error("AI stream error:", err);
      const errorMsg: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: "assistant",
        content: `⚠️ **Error**: ${err.message || "Failed to stream response."}\n\nPlease verify your API key in **BYOK Settings**.`,
        timestamp: Date.now(),
        functionMode: currentMode,
      };
      const finalSession: ChatSession = {
        ...updatedSession,
        messages: [...updatedMessages, errorMsg],
        updatedAt: Date.now(),
      };
      setActiveSession(finalSession);
      saveStoredSession(finalSession);
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
    }
  };

  const hasCurrentModel = availableModels.some((m) => m.id === model);
  const displayModels = hasCurrentModel
    ? availableModels
    : model
    ? [{ id: model, name: model }, ...availableModels]
    : availableModels;

  return (
    <div className="h-[100dvh] bg-[var(--background)] flex flex-col overflow-hidden pb-16 md:pb-0">
      <Navbar />

      <main className="flex-1 flex overflow-hidden relative max-w-7xl w-full mx-auto p-2 sm:p-4 gap-4 min-h-0">
        {/* SIDEBAR (Desktop Left Pane & Mobile Slide-Over) */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 sm:w-80 bg-[var(--surface)] border-r border-[var(--border)] p-4 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 lg:rounded-2xl lg:border lg:z-auto ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Top Session Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--text)]">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Conversations</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 text-[var(--text2)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => {
                createNewSession();
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New AI Study Chat</span>
            </button>
          </div>

          {/* Chat History List */}
          <div className="flex-1 overflow-y-auto py-4 space-y-1.5 -mx-2 px-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text3)] px-2 mb-1">
              Recent Chats
            </div>
            {sessions.length === 0 ? (
              <div className="text-xs text-[var(--text3)] px-2 py-4 text-center">
                No past chat sessions yet.
              </div>
            ) : (
              sessions.map((s) => {
                const isActive = activeSession?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      handleSelectSession(s);
                      setIsSidebarOpen(false);
                    }}
                    className={`group/session w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                        : "text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] border border-transparent"
                    }`}
                  >
                    <span className="truncate flex-1 mr-2">{s.title || "Untitled Session"}</span>
                    <button
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="opacity-70 sm:opacity-0 sm:group-hover/session:opacity-100 p-1 text-[var(--text3)] hover:text-rose-500 transition-opacity"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* BYOK Status & Settings Trigger */}
          <div className="pt-3 border-t border-[var(--border)] space-y-2">
            <button
              onClick={() => {
                setIsByokOpen(true);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] hover:border-primary/40 text-xs transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <div className="font-bold text-[var(--text)] group-hover:text-primary transition-colors">
                    AI Settings & BYOK
                  </div>
                  <div className="text-[10px] text-[var(--text2)] uppercase font-mono truncate max-w-[120px]">
                    {provider.toUpperCase()} • {model}
                  </div>
                </div>
              </div>
              {hasKey ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20">
                  Set Key
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* MAIN CHAT STREAM & COMPOSER */}
        <section className="flex-1 flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs relative min-h-0">
          {/* Sleek Top Chat Header */}
          <div className="px-3 sm:px-4 py-2 sm:py-2.5 border-b border-[var(--border)] bg-[var(--surface2)]/80 backdrop-blur-xs flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface)] shrink-0 transition-colors cursor-pointer"
                title="Open Chat Sessions Menu"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <h1 className="text-xs sm:text-sm font-bold text-[var(--text)] truncate max-w-[180px] sm:max-w-md">
                  {activeSession?.title || "AI Study Chat"}
                </h1>
              </div>
            </div>

            {/* Model Badge & Setup Guide Trigger */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  setByokInitialTab("guide");
                  setIsByokOpen(true);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary/10 border border-primary/25 hover:bg-primary/15 text-[11px] font-bold text-primary transition-all cursor-pointer shadow-2xs"
                title="View 30-Second Free AI Key Setup Guide"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Setup Guide ($0)</span>
              </button>

              <button
                onClick={() => {
                  setByokInitialTab("keys");
                  setIsByokOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-primary/50 text-[11px] font-mono text-[var(--text2)] hover:text-primary transition-all cursor-pointer shadow-2xs"
                title="Open AI Model & Key Settings"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="truncate max-w-[110px] sm:max-w-[160px] font-semibold">{model}</span>
              </button>
            </div>
          </div>

          {/* Attached Context Banner */}
          {attachedContext && (
            <div className="px-4 py-2 bg-primary/5 border-b border-primary/20 flex items-center justify-between text-xs text-[var(--text)] shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Paperclip className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="font-semibold text-primary shrink-0">Attached Context:</span>
                <span className="truncate">{attachedContext.title}</span>
              </div>
              <button
                onClick={() => setAttachedContext(null)}
                className="text-[var(--text3)] hover:text-[var(--text)] p-0.5 ml-2"
                title="Remove attached context"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Missing Key Banner (when user has messages but key was removed) */}
          {!hasKey && activeSession && activeSession.messages.length > 0 && (
            <div className="m-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 text-xs shrink-0">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">
                    No API Key Configured
                  </div>
                  <div className="text-[var(--text2)] text-[11px] mt-0.5">
                    Please provide your free Google Gemini or Groq key to start AI tutoring.
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setByokInitialTab("keys");
                  setIsByokOpen(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs hover:opacity-95 shrink-0 cursor-pointer"
              >
                Set Key
              </button>
            </div>
          )}

          {/* Message Stream (THE ONLY SCROLLING CONTAINER) */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 min-h-0">
            {activeSession?.messages.length === 0 ? (
              !hasKey ? (
                /* First-Time Onboarding Welcome Card */
                <div className="max-w-xl mx-auto py-6 sm:py-10 space-y-6 text-center animate-in fade-in duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center mx-auto shadow-md">
                    <Sparkles className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--text)]">
                      Welcome to Marnie AI Tutor
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text2)] max-w-md mx-auto leading-relaxed">
                      Your personal PRC ECE board exam mentor. Powered by your own free AI key with <strong>$0 subscription fees</strong> and zero server markups.
                    </p>
                  </div>

                  {/* 3 Quick Value Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left text-xs">
                    <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                      <div className="font-bold text-primary flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>100% Free Forever</span>
                      </div>
                      <div className="text-[11px] text-[var(--text2)]">Use generous daily free tiers from Google & Groq. No credit card needed.</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Client-Side Privacy</span>
                      </div>
                      <div className="text-[11px] text-[var(--text2)]">Keys stay exclusively in your browser's encrypted storage.</div>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-1">
                      <div className="font-bold text-accent flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>30-Sec Setup</span>
                      </div>
                      <div className="text-[11px] text-[var(--text2)]">Generate a key in 3 quick clicks and start learning immediately.</div>
                    </div>
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setByokInitialTab("guide");
                        setIsByokOpen(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>View 30-Sec Setup Guide</span>
                    </button>

                    <button
                      onClick={() => {
                        setByokInitialTab("keys");
                        setIsByokOpen(true);
                      }}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] hover:border-primary/40 text-xs font-bold hover:bg-[var(--surface)] transition-all cursor-pointer"
                    >
                      <Key className="w-4 h-4 text-primary" />
                      <span>Enter API Key</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--text)]">
                      Marnie AI Board Exam Tutor
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--text2)] max-w-md mx-auto">
                      Bring-Your-Own-Key AI tutor trained on PRC ECE board exam questions, speed shortcuts, and formula derivations.
                    </p>
                  </div>

                  {/* Accessible Functions Quick Ribbon */}
                  <QuickActions
                    onSelectAction={handleQuickAction}
                    hasAttachedExam={attachedContext?.type === "attempt"}
                  />
                </div>
              )
            ) : (
              <>
                {activeSession?.messages.map((m) => (
                  <ChatMessageItem
                    key={m.id}
                    message={m}
                    onTriggerAction={(mMode, prompt) => handleSendMessage(prompt, mMode)}
                  />
                ))}

                {/* Live Streaming Content Bubble */}
                {isStreaming && streamingContent && (
                  <ChatMessageItem
                    message={{
                      id: "streaming_active",
                      role: "assistant",
                      content: streamingContent,
                      timestamp: Date.now(),
                      functionMode,
                    }}
                  />
                )}

                {isStreaming && !streamingContent && (
                  <div className="flex items-center gap-2 text-xs text-[var(--text2)] p-4 bg-[var(--surface2)] rounded-2xl w-fit animate-pulse border border-[var(--border)]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>Marnie AI is thinking and formulating explanation...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Bottom Composer Bar */}
          <div className="p-2.5 sm:p-3 border-t border-[var(--border)] bg-[var(--surface)] shrink-0 space-y-2 relative">
            {/* Popover Action / Context Drawer triggered by [+] */}
            {isContextPickerOpen && (
              <div className="absolute bottom-full left-3 right-3 mb-2 p-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl space-y-2 animate-in slide-in-from-bottom-2 fade-in z-30 max-w-md">
                <div className="flex items-center justify-between pb-1 border-b border-[var(--border)] text-xs font-bold text-[var(--text)]">
                  <span>Quick Context & Prompts</span>
                  <button
                    onClick={() => setIsContextPickerOpen(false)}
                    className="p-1 text-[var(--text3)] hover:text-[var(--text)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setInputPrompt("What are my weakest topics according to FSRS, and what should I practice today?");
                      setIsContextPickerOpen(false);
                    }}
                    className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-primary/10 hover:text-primary text-left transition-colors flex items-center gap-2 text-[11px]"
                  >
                    <span>🧠</span>
                    <span>Weak Topics (FSRS)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInputPrompt("What are the most common exam traps and calculator shortcuts for my weakest subjects?");
                      setIsContextPickerOpen(false);
                    }}
                    className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-primary/10 hover:text-primary text-left transition-colors flex items-center gap-2 text-[11px]"
                  >
                    <span>⚡</span>
                    <span>Traps & Shortcuts</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFunctionMode("custom_module");
                      setInputPrompt("Please generate an interactive learning module with formulas, worked examples, and concept checks on my lowest-retention topic.");
                      setIsContextPickerOpen(false);
                    }}
                    className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-primary/10 hover:text-primary text-left transition-colors flex items-center gap-2 text-[11px]"
                  >
                    <span>📘</span>
                    <span>Custom Module</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFunctionMode("tricky_questions");
                      setInputPrompt("Generate a 5-question tricky practice drill targeting distractor traps on my weakest topic.");
                      setIsContextPickerOpen(false);
                    }}
                    className="p-2 rounded-xl bg-[var(--surface2)] hover:bg-primary/10 hover:text-primary text-left transition-colors flex items-center gap-2 text-[11px]"
                  >
                    <span>🎯</span>
                    <span>Tricky Drill</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFunctionMode("low_friction");
                      setInputPrompt("I'm really not feeling like studying today. Give me something super low friction and fast to keep my momentum and study streak going!");
                      setIsContextPickerOpen(false);
                    }}
                    className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-left transition-colors flex items-center gap-2 text-[11px] font-semibold sm:col-span-2"
                  >
                    <span>☕</span>
                    <span>Low-Energy Study (5 Mins) — Keep Streak Alive!</span>
                  </button>
                </div>
              </div>
            )}

            {/* Input Composer Field */}
            <div className="flex items-end gap-1.5 sm:gap-2 bg-[var(--surface2)] border border-[var(--border)] rounded-2xl p-1.5 focus-within:border-primary transition-all">
              {/* [+] Context / Action Picker Button */}
              <button
                type="button"
                onClick={() => setIsContextPickerOpen((prev) => !prev)}
                className={`p-2 rounded-xl border transition-all cursor-pointer shrink-0 ${
                  isContextPickerOpen
                    ? "bg-primary text-white border-primary"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--text2)] hover:text-primary hover:border-primary/50"
                }`}
                title="Add Context or Quick Action"
              >
                <PlusCircle className="w-4 h-4" />
              </button>

              {/* [⚙️] Settings & Model Selector Cog Button */}
              <button
                type="button"
                onClick={() => setIsByokOpen(true)}
                className="p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text2)] hover:text-primary hover:border-primary/50 transition-all cursor-pointer shrink-0"
                title="AI Settings & Model Configuration"
              >
                <Key className="w-4 h-4" />
              </button>

              {/* Auto-Expanding Textarea */}
              <textarea
                ref={textareaRef}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask Marnie AI anything..."
                rows={1}
                className="flex-1 bg-transparent text-xs sm:text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none resize-none px-2 py-1.5 max-h-32 min-h-[34px] leading-relaxed"
              />

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isStreaming || !inputPrompt.trim()}
                className="p-2 sm:p-2.5 rounded-xl bg-primary text-white hover:opacity-95 disabled:opacity-40 transition-all shadow-sm shrink-0 cursor-pointer"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* BYOK Settings Modal */}
      <ByokModal
        isOpen={isByokOpen}
        initialTab={byokInitialTab}
        onClose={() => setIsByokOpen(false)}
        onKeysUpdated={handleKeysUpdated}
      />
    </div>
  );
}
