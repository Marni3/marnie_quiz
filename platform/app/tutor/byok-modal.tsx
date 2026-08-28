"use client";

import { useState, useEffect, useRef } from "react";
import { AIProvider } from "@/lib/tutor/types";
import {
  getAllStoredApiKeys,
  setStoredApiKey,
  getStoredActiveProvider,
  setStoredActiveProvider,
  exportStudyVault,
  importStudyVault,
} from "@/lib/tutor/storage";
import {
  Key,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Download,
  Upload,
  Sparkles,
  ExternalLink,
  X,
  RefreshCw,
} from "lucide-react";

interface ByokModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeysUpdated?: () => void;
}

const PROVIDERS: Array<{
  id: AIProvider;
  name: string;
  badge: string;
  portalUrl: string;
  freeTier: boolean;
  placeholder: string;
}> = [
    {
      id: "gemini",
      name: "Google Gemini",
      badge: "Recommended (Free Tier)",
      portalUrl: "https://aistudio.google.com/app/apikey",
      freeTier: true,
      placeholder: "AIzaSy...",
    },
    {
      id: "openai",
      name: "OpenAI",
      badge: "GPT-4o / GPT-4o-mini",
      portalUrl: "https://platform.openai.com/api-keys",
      freeTier: false,
      placeholder: "sk-proj-...",
    },
    {
      id: "anthropic",
      name: "Anthropic Claude",
      badge: "Claude 3.5 Sonnet",
      portalUrl: "https://console.anthropic.com/settings/keys",
      freeTier: false,
      placeholder: "sk-ant-...",
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      badge: "V3 / R1 Low Cost",
      portalUrl: "https://platform.deepseek.com/api_keys",
      freeTier: false,
      placeholder: "sk-...",
    },
    {
      id: "openrouter",
      name: "OpenRouter",
      badge: "Multi-Model Gateway",
      portalUrl: "https://openrouter.ai/keys",
      freeTier: false,
      placeholder: "sk-or-...",
    },
  ];

export function ByokModal({ isOpen, onClose, onKeysUpdated }: ByokModalProps) {
  const [activeProvider, setActiveProvider] = useState<AIProvider>("gemini");
  const [keys, setKeys] = useState<Partial<Record<AIProvider, string>>>({});
  const [showKeys, setShowKeys] = useState<Partial<Record<AIProvider, boolean>>>({});
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveProvider(getStoredActiveProvider());
      setKeys(getAllStoredApiKeys());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleKeyChange = (provider: AIProvider, value: string) => {
    setKeys((prev) => ({ ...prev, [provider]: value }));
    setStoredApiKey(provider, value);
    if (onKeysUpdated) onKeysUpdated();
  };

  const handleProviderSelect = (provider: AIProvider) => {
    setActiveProvider(provider);
    setStoredActiveProvider(provider);
    setTestResult(null);
    if (onKeysUpdated) onKeysUpdated();
  };

  const handleTestConnection = async () => {
    const key = keys[activeProvider];
    if (!key || !key.trim()) {
      setTestResult({ success: false, message: `Please enter an API key for ${activeProvider.toUpperCase()}.` });
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
          apiKey: key.trim(),
          model: activeProvider === "gemini" ? "gemini-3.6-flash" : undefined,
          messages: [{ role: "user", content: "Reply with 'OK'." }],
          functionMode: "chat",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `Status ${res.status}` }));
        setTestResult({
          success: false,
          message: err.error || "Connection failed. Please check your API key.",
        });
      } else {
        setTestResult({
          success: true,
          message: `Connected successfully to ${activeProvider.toUpperCase()}!`,
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Network error while connecting.",
      });
    } finally {
      setTesting(false);
    }
  };

  const handleExportVault = () => {
    const jsonStr = exportStudyVault();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `marnie-study-vault-${today}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportVault = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importStudyVault(content);
        if (success) {
          setKeys(getAllStoredApiKeys());
          setActiveProvider(getStoredActiveProvider());
          setTestResult({
            success: true,
            message: "Study Vault successfully imported and merged!",
          });
          if (onKeysUpdated) onKeysUpdated();
        } else {
          setTestResult({
            success: false,
            message: "Failed to import Study Vault. Invalid file format.",
          });
        }
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--surface2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                AI BYOK Key Manager
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  $0 Host Cost
                </span>
              </h2>
              <p className="text-xs text-[var(--text2)]">
                Keys are stored locally in your browser and never saved on our servers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text2)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Provider Selection Tabs */}
          <div>
            <label className="text-xs font-semibold text-[var(--text2)] uppercase tracking-wider block mb-2">
              Active Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROVIDERS.map((p) => {
                const isSelected = activeProvider === p.id;
                const hasKey = !!keys[p.id]?.trim();
                return (
                  <button
                    key={p.id}
                    onClick={() => handleProviderSelect(p.id)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${isSelected
                        ? "bg-primary/10 border-primary/40 shadow-sm"
                        : "bg-[var(--surface2)] border-[var(--border)] hover:border-primary/20"
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[var(--text)]">{p.name}</span>
                      {hasKey ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--text3)]" />
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--text2)] leading-tight">{p.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Input Section */}
          {(() => {
            const cur = PROVIDERS.find((p) => p.id === activeProvider)!;
            const isVisible = !!showKeys[activeProvider];
            return (
              <div className="bg-[var(--surface2)] p-4 rounded-xl border border-[var(--border)] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--text)]">{cur.name} API Key</span>
                  <a
                    href={cur.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Get {cur.freeTier ? "Free" : ""} Key</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={isVisible ? "text" : "password"}
                    value={keys[activeProvider] || ""}
                    onChange={(e) => handleKeyChange(activeProvider, e.target.value)}
                    placeholder={cur.placeholder}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--text)] font-mono focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowKeys((prev) => ({ ...prev, [activeProvider]: !prev[activeProvider] }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text)]"
                  >
                    {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Connection Test */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleTestConnection}
                    disabled={testing || !keys[activeProvider]?.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    <span>{testing ? "Testing..." : "Test Connection"}</span>
                  </button>

                  {testResult && (
                    <div
                      className={`text-xs flex items-center gap-1.5 font-medium ${testResult.success ? "text-emerald-500" : "text-rose-500"
                        }`}
                    >
                      {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span className="truncate max-w-[240px]">{testResult.message}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 1-Click Study Vault Sync ($0 Cross-Device) */}
          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-[var(--text)]">Study Vault Backup & Restore</h3>
                <p className="text-[11px] text-[var(--text2)]">
                  Export or import your keys, custom modules, and AI sessions as a single JSON file.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleExportVault}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] text-xs font-medium hover:bg-[var(--border)] transition-all"
              >
                <Download className="w-3.5 h-3.5 text-primary" />
                <span>Export Vault</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface2)] border border-[var(--border)] text-[var(--text)] text-xs font-medium hover:bg-[var(--border)] transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-500" />
                <span>Import Vault</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportVault}
                accept=".json,application/json"
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-[var(--surface2)] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:opacity-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
