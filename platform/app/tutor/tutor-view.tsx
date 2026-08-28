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
} from "@/lib/tutor/storage";
import { MODEL_CATALOG, DEFAULT_MODELS } from "@/lib/tutor/prompts";
import {
  Sparkles,
  Send,
  Key,
  PlusCircle,
  Trash2,
  Menu,
  X,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  CheckSquare,
  RefreshCw,
} from "lucide-react";

export function TutorView() {
  const searchParams = useSearchParams();
  const [isByokOpen, setIsByokOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Active configuration
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [model, setModel] = useState<string>("gemini-2.0-flash");
  const [hasKey, setHasKey] = useState(false);

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

  // Initialize BYOK configs & sessions on mount
  useEffect(() => {
    const activeProv = getStoredActiveProvider();
    const activeMod = getStoredActiveModel(activeProv);
    const key = getStoredApiKey(activeProv);

    setProvider(activeProv);
    setModel(activeMod);
    setHasKey(!!key && key.trim().length > 0);

    const storedSessions = getStoredSessions();
    setSessions(storedSessions);

    // Check if there is a pending review exam context from a quiz/mastery completion
    const pendingReview = getAndClearPendingReviewContext();
    const modeParam = searchParams.get("mode");

    if (pendingReview || modeParam === "review_exam") {
      const reviewPayload = pendingReview;
      setAttachedContext({
        type: "attempt",
        title: reviewPayload?.examTitle || "Recent Exam Attempt",
        payload: reviewPayload,
      });
      setFunctionMode("review_exam");

      // Auto-create a specialized review session
      const newSession: ChatSession = {
        id: `session_${Date.now()}`,
        title: `Exam Review: ${reviewPayload?.examTitle || "Latest Quiz"}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        provider: activeProv,
        model: activeMod,
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

      // Auto-trigger review if key exists
      if (key && key.trim()) {
        setTimeout(() => {
          handleSendMessage(
            "Please review my exam attempt step-by-step, deconstruct my missed questions, and teach me how to solve them correctly.",
            "review_exam",
            reviewPayload,
            newSession
          );
        }, 300);
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

  const availableModels = MODEL_CATALOG.filter((m) => m.provider === provider);

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <Navbar />

      <main className="flex-1 flex overflow-hidden relative max-w-7xl w-full mx-auto p-2 sm:p-4 gap-4">
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
                <span>AI Tutor Workspace</span>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-1 text-[var(--text2)] hover:text-[var(--text)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => createNewSession()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:opacity-95 transition-all"
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
                    onClick={() => handleSelectSession(s)}
                    className={`group/session w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                        : "text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] border border-transparent"
                    }`}
                  >
                    <span className="truncate flex-1 mr-2">{s.title || "Untitled Session"}</span>
                    <button
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="opacity-0 group-hover/session:opacity-100 p-1 hover:text-rose-500 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* BYOK Status & Key Manager Trigger */}
          <div className="pt-3 border-t border-[var(--border)] space-y-2">
            <button
              onClick={() => setIsByokOpen(true)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface2)] border border-[var(--border)] hover:border-primary/40 text-xs transition-all group"
            >
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                <div className="text-left">
                  <div className="font-bold text-[var(--text)] group-hover:text-primary transition-colors">
                    BYOK Settings
                  </div>
                  <div className="text-[10px] text-[var(--text2)] uppercase font-mono">
                    {provider.toUpperCase()}
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
        <section className="flex-1 flex flex-col bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-xs relative">
          {/* Top Chat Header Ribbon */}
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--surface2)]/80 backdrop-blur-xs flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface)]"
              >
                <Menu className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xs sm:text-sm font-bold text-[var(--text)] truncate max-w-[200px] sm:max-w-md">
                  {activeSession?.title || "AI Study Chat"}
                </h1>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text3)]">
                  <span>Provider: {provider.toUpperCase()}</span>
                  <span>•</span>
                  <span>Model: {model}</span>
                </div>
              </div>
            </div>

            {/* Model Selector & BYOK Trigger */}
            <div className="flex items-center gap-2">
              <select
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-primary font-mono"
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsByokOpen(true)}
                className="p-1.5 rounded-xl border border-[var(--border)] text-[var(--text2)] hover:text-primary hover:bg-[var(--surface)] transition-all"
                title="Configure BYOK Key"
              >
                <Key className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Attached Context Banner */}
          {attachedContext && (
            <div className="px-4 py-2 bg-primary/5 border-b border-primary/20 flex items-center justify-between text-xs text-[var(--text)]">
              <div className="flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-primary">Attached Context:</span>
                <span className="truncate max-w-xs">{attachedContext.title}</span>
              </div>
              <button
                onClick={() => setAttachedContext(null)}
                className="text-[var(--text3)] hover:text-[var(--text)] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Missing Key Banner */}
          {!hasKey && (
            <div className="m-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-600 dark:text-amber-400">
                    No API Key Configured
                  </div>
                  <div className="text-[var(--text2)] text-[11px] mt-0.5">
                    Please provide your free Google Gemini or OpenAI key to start AI tutoring.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsByokOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs hover:opacity-95 shrink-0"
              >
                Set Key
              </button>
            </div>
          )}

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeSession?.messages.length === 0 ? (
              <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--text)]">
                    Marnie AI Board Exam Tutor
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--text2)] max-w-md mx-auto">
                    Bring-Your-Own-Key Socratic tutor trained on PRC ECE board exam questions, speed shortcuts, and formula derivations.
                  </p>
                </div>

                {/* 5 Accessible Functions Quick Ribbon */}
                <QuickActions
                  onSelectAction={handleQuickAction}
                  hasAttachedExam={attachedContext?.type === "attempt"}
                />
              </div>
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

          {/* Bottom Composer */}
          <div className="p-3 sm:p-4 border-t border-[var(--border)] bg-[var(--surface2)]/60 space-y-2">
            <div className="flex items-end gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-2 focus-within:border-primary transition-all">
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
                placeholder="Ask any Math, ELECS, GEAS, or EST question..."
                rows={1}
                className="flex-1 bg-transparent text-xs sm:text-sm text-[var(--text)] placeholder-[var(--text3)] focus:outline-none resize-none px-2 py-1 max-h-32 min-h-[28px]"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={isStreaming || !inputPrompt.trim()}
                className="p-2.5 rounded-xl bg-primary text-white hover:opacity-95 disabled:opacity-40 transition-all shadow-sm shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[var(--text3)] px-1">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span className="font-mono text-[10px]">{provider.toUpperCase()} • {model}</span>
            </div>
          </div>
        </section>
      </main>

      {/* BYOK Settings Modal */}
      <ByokModal
        isOpen={isByokOpen}
        onClose={() => setIsByokOpen(false)}
        onKeysUpdated={handleKeysUpdated}
      />
    </div>
  );
}
