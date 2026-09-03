"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AIProvider } from "@/lib/tutor/types";
import { DEFAULT_MODELS } from "@/lib/tutor/prompts";
import {
  getAllStoredApiKeys,
  setStoredApiKey,
  getStoredActiveProvider,
  setStoredActiveProvider,
  getStoredActiveModel,
  setStoredActiveModel,
  getStoredModelsForProvider,
  setStoredModelsForProvider,
  exportStudyVault,
  importStudyVault,
} from "@/lib/tutor/storage";
import { SetupGuide } from "./setup-guide";
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Download,
  Upload,
  ExternalLink,
  X,
  RefreshCw,
  ChevronDown,
  Sparkles,
  Loader2,
  BookOpen,
  ChevronRight,
} from "lucide-react";

interface ByokModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysUpdated?: () => void;
  initialTab?: "keys" | "guide";
}

interface ModelOption {
  id: string;
  name: string;
  recommended?: boolean;
}

interface ProviderDef {
  id: AIProvider;
  name: string;
  badge: string;
  portalUrl: string;
  freeTier: boolean;
  placeholder: string;
  supportsLiveModels: boolean;
}

const PROVIDERS: ProviderDef[] = [
  {
    id: "gemini",
    name: "Google Gemini",
    badge: "Free Tier · Live Models",
    portalUrl: "https://aistudio.google.com/app/apikey",
    freeTier: true,
    placeholder: "AIzaSy...",
    supportsLiveModels: true,
  },
  {
    id: "groq",
    name: "Groq",
    badge: "Free Tier · Fast Vision & Reasoning",
    portalUrl: "https://console.groq.com/keys",
    freeTier: true,
    placeholder: "gsk_...",
    supportsLiveModels: true,
  },
  {
    id: "openai",
    name: "OpenAI",
    badge: "GPT-4o · Live Models",
    portalUrl: "https://platform.openai.com/api-keys",
    freeTier: false,
    placeholder: "sk-proj-...",
    supportsLiveModels: true,
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    badge: "Claude 3.5 Sonnet",
    portalUrl: "https://console.anthropic.com/settings/keys",
    freeTier: false,
    placeholder: "sk-ant-...",
    supportsLiveModels: false,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    badge: "V3 / R1 Low Cost",
    portalUrl: "https://platform.deepseek.com/api_keys",
    freeTier: false,
    placeholder: "sk-...",
    supportsLiveModels: false,
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    badge: "Multi-Model Gateway",
    portalUrl: "https://openrouter.ai/keys",
    freeTier: false,
    placeholder: "sk-or-...",
    supportsLiveModels: true,
  },
];

export function ByokModal({ isOpen, onClose, onKeysUpdated, initialTab = "keys" }: ByokModalProps) {
  const [activeModalTab, setActiveModalTab] = useState<"keys" | "guide">(initialTab);
  const [activeProvider, setActiveProvider] = useState<AIProvider>("gemini");
  const [keys, setKeys] = useState<Partial<Record<AIProvider, string>>>({});
  const [models, setModels] = useState<Partial<Record<AIProvider, ModelOption[]>>>({});
  const [selectedModels, setSelectedModels] = useState<Partial<Record<AIProvider, string>>>({});
  const [fetchingModels, setFetchingModels] = useState(false);
  const [modelSource, setModelSource] = useState<"live" | "fallback" | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveModalTab(initialTab);
      const storedProvider = getStoredActiveProvider();
      const storedKeys = getAllStoredApiKeys();
      setActiveProvider(storedProvider);
      setKeys(storedKeys);
      setTestResult(null);
      setShowKey(false);

      // Load stored models & model selections per provider
      const storedSel: Partial<Record<AIProvider, string>> = {};
      const storedMod: Partial<Record<AIProvider, ModelOption[]>> = {};
      for (const p of PROVIDERS) {
        const sel = getStoredActiveModel(p.id);
        if (sel) storedSel[p.id] = sel;
        const cached = getStoredModelsForProvider(p.id);
        if (cached && cached.length > 0) storedMod[p.id] = cached;
      }
      setSelectedModels(storedSel);
      setModels(storedMod);

      // Auto-fetch models for active provider if key exists but models not cached
      const k = storedKeys[storedProvider];
      if (k && k.trim() && (!storedMod[storedProvider] || storedMod[storedProvider]!.length === 0)) {
        fetchModels(storedProvider, k);
      }
    }
  }, [isOpen, initialTab]);

  const fetchModels = useCallback(async (prov: AIProvider, key: string) => {
    if (!key.trim()) return;
    setFetchingModels(true);
    setModelSource(null);
    try {
      const res = await fetch("/api/tutor/models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: prov, apiKey: key.trim() }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.models) && data.models.length > 0) {
        setModels((prev) => ({ ...prev, [prov]: data.models }));
        setStoredModelsForProvider(prov, data.models);
        setModelSource(data.source === "live" ? "live" : "fallback");

        // If current selected model isn't in returned list, select first/recommended
        setSelectedModels((prev) => {
          const current = prev[prov];
          const exists = data.models.some((m: ModelOption) => m.id === current);
          if (!exists) {
            const rec = data.models.find((m: ModelOption) => m.recommended) || data.models[0];
            if (rec) {
              setStoredActiveModel(prov, rec.id);
              return { ...prev, [prov]: rec.id };
            }
          }
          return prev;
        });
      }
    } catch (err) {
      console.warn(`Failed to fetch models for ${prov}:`, err);
    } finally {
      setFetchingModels(false);
    }
  }, []);

  const handleProviderSelect = (p: AIProvider) => {
    setActiveProvider(p);
    setStoredActiveProvider(p);
    setTestResult(null);
    setShowKey(false);
    const k = keys[p];
    if (k && k.trim() && (!models[p] || models[p]!.length === 0)) {
      fetchModels(p, k);
    }
    if (onKeysUpdated) onKeysUpdated();
  };

  const handleKeyChange = (prov: AIProvider, val: string) => {
    const updated = { ...keys, [prov]: val };
    setKeys(updated);
    setStoredApiKey(prov, val);
    setTestResult(null);
  };

  const handleKeyBlur = () => {
    const k = keys[activeProvider];
    if (k && k.trim()) {
      fetchModels(activeProvider, k);
    }
    if (onKeysUpdated) onKeysUpdated();
  };

  const handleModelChange = (prov: AIProvider, modelId: string) => {
    setSelectedModels((prev) => ({ ...prev, [prov]: modelId }));
    setStoredActiveModel(prov, modelId);
    if (onKeysUpdated) onKeysUpdated();
  };

  const handleTestConnection = async () => {
    const k = keys[activeProvider]?.trim();
    if (!k) {
      setTestResult({ success: false, message: `Please enter an API key for ${activeProvider}.` });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/tutor/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: activeProvider,
          apiKey: k,
          model: selectedModels[activeProvider] || DEFAULT_MODELS[activeProvider],
          messages: [{ role: "user", content: "Reply with the single word: OK" }],
          functionMode: "chat",
        }),
      });
      if (res.ok) {
        setTestResult({ success: true, message: "Connection successful! Model is ready." });
      } else {
        const err = await res.json();
        setTestResult({ success: false, message: err.error || "Key validation failed." });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || "Network error." });
    } finally {
      setTesting(false);
    }
  };

  const handleExportVault = () => {
    const jsonStr = exportStudyVault();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marnie-study-vault-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportVault = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (content) {
        const success = importStudyVault(content);
        setTestResult({
          success,
          message: success ? "Study Vault imported successfully!" : "Invalid vault file.",
        });
        if (success) {
          setKeys(getAllStoredApiKeys());
          setActiveProvider(getStoredActiveProvider());
          if (onKeysUpdated) onKeysUpdated();
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Mobile-First Standard: Lock body scroll while modal is active
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cur = PROVIDERS.find((p) => p.id === activeProvider)!;
  const curKey = keys[activeProvider] || "";
  const curModels = models[activeProvider] || [];
  const curSelectedModel = selectedModels[activeProvider] || DEFAULT_MODELS[activeProvider] || "";
  const hasKey = !!curKey.trim();

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90dvh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface2)] rounded-t-2xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                AI BYOK Key Manager
                <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  $0 Host Cost
                </span>
              </h2>
              <p className="text-[11px] text-[var(--text2)]">Keys stay in your browser — never sent to our servers.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all shrink-0 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[var(--border)] bg-[var(--surface)] px-5 pt-2 shrink-0">
          <button
            onClick={() => setActiveModalTab("keys")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeModalTab === "keys"
                ? "border-primary text-primary"
                : "border-transparent text-[var(--text2)] hover:text-[var(--text)]"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API Key Settings</span>
          </button>

          <button
            onClick={() => setActiveModalTab("guide")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeModalTab === "guide"
                ? "border-primary text-primary"
                : "border-transparent text-[var(--text2)] hover:text-[var(--text)]"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>30-Sec Setup Guide (Free)</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
              $0
            </span>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">

          {activeModalTab === "guide" ? (
            <SetupGuide
              onSelectProvider={(p) => {
                setActiveProvider(p);
                setActiveModalTab("keys");
              }}
              onOpenKeysTab={() => setActiveModalTab("keys")}
            />
          ) : (
            <>
              {/* Quick Guide Callout Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                <div className="flex items-center gap-2 text-[var(--text)]">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <span>New to AI keys? Get a 100% free key in 30 seconds.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModalTab("guide")}
                  className="font-bold text-primary hover:underline cursor-pointer flex items-center gap-1 text-xs shrink-0"
                >
                  <span>Open Quick Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Provider grid */}
              <div>
                <label className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-widest block mb-2">
                  Active Provider
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PROVIDERS.map((p) => {
                    const isSelected = activeProvider === p.id;
                    const hasK = !!keys[p.id]?.trim();
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleProviderSelect(p.id)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 border-primary/40 shadow-sm"
                            : "bg-[var(--surface2)] border-[var(--border)] hover:border-primary/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[var(--text)]">{p.name}</span>
                          {hasK ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--text3)] shrink-0" />
                          )}
                        </div>
                        <span className="text-[10px] text-[var(--text2)] leading-tight">{p.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Key + Model section */}
              <div className="bg-[var(--surface2)] p-4 rounded-xl border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text)]">{cur.name} API Key</span>
                  <a href={cur.portalUrl} target="_blank" rel="noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium">
                    <span>Get {cur.freeTier ? "Free " : ""}Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Key input */}
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={curKey}
                    onChange={(e) => handleKeyChange(activeProvider, e.target.value)}
                    onBlur={handleKeyBlur}
                    placeholder={cur.placeholder}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text)] font-mono focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)] cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Model selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-wider">
                      Model
                    </label>
                    <div className="flex items-center gap-2">
                      {modelSource === "live" && (
                        <span className="text-[10px] text-emerald-500 font-mono font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Live
                        </span>
                      )}
                      {modelSource === "fallback" && (
                        <span className="text-[10px] text-amber-500 font-mono">Curated list</span>
                      )}
                      {hasKey && (
                        <button
                          type="button"
                          onClick={() => fetchModels(activeProvider, curKey)}
                          disabled={fetchingModels}
                          className="text-[10px] text-primary hover:underline flex items-center gap-1 disabled:opacity-50 cursor-pointer"
                        >
                          {fetchingModels
                            ? <Loader2 className="w-3 h-3 animate-spin" />
                            : <RefreshCw className="w-3 h-3" />}
                          <span>{fetchingModels ? "Fetching..." : "Refresh"}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {fetchingModels && curModels.length === 0 ? (
                    <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs text-[var(--text2)]">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span>Fetching available models...</span>
                    </div>
                  ) : curModels.length > 0 ? (
                    <div className="relative">
                      <select
                        value={curSelectedModel}
                        onChange={(e) => handleModelChange(activeProvider, e.target.value)}
                        className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text)] font-mono focus:outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
                      >
                        {curModels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}{m.recommended ? " ⭐" : ""}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--text3)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="px-3 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-xl text-xs text-[var(--text2)]">
                      {hasKey
                        ? "Enter your key and press Tab to load models."
                        : "Enter your API key above to see available models."}
                    </div>
                  )}
                </div>

                {/* Test connection */}
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleTestConnection}
                    disabled={testing || !hasKey}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all shadow-sm shrink-0 cursor-pointer"
                  >
                    {testing
                      ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{testing ? "Testing..." : "Test Connection"}</span>
                  </button>

                  {testResult && (
                    <div className={`text-xs flex items-center gap-1.5 font-medium min-w-0 ${testResult.success ? "text-emerald-500" : "text-rose-500"}`}>
                      {testResult.success
                        ? <CheckCircle2 className="w-4 h-4 shrink-0" />
                        : <XCircle className="w-4 h-4 shrink-0" />}
                      <span className="truncate">{testResult.message}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Study Vault */}
              <div className="border-t border-[var(--border)] pt-4 space-y-2">
                <h3 className="text-xs font-bold text-[var(--text)]">Study Vault Backup & Restore</h3>
                <p className="text-[11px] text-[var(--text2)]">
                  Export or import your keys, custom modules, and AI sessions as a single JSON file.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={handleExportVault}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] text-xs font-medium hover:bg-[var(--border)] transition-all cursor-pointer">
                    <Download className="w-3.5 h-3.5 text-primary" />
                    <span>Export Vault</span>
                  </button>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] text-xs font-medium hover:bg-[var(--border)] transition-all cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Import Vault</span>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImportVault} accept=".json,application/json" className="hidden" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface2)] rounded-b-2xl flex items-center justify-end shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:opacity-95 transition-all cursor-pointer">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
