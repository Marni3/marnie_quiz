"use client";

import { useState } from "react";
import { Sparkles, ExternalLink, ShieldCheck, Zap, Key, CheckCircle2, ChevronRight, HelpCircle, ArrowRight } from "lucide-react";
import { AIProvider } from "@/lib/tutor/types";

interface SetupGuideProps {
  onSelectProvider?: (provider: AIProvider) => void;
  onOpenKeysTab?: () => void;
}

export function SetupGuide({ onSelectProvider, onOpenKeysTab }: SetupGuideProps) {
  const [activeTab, setActiveTab] = useState<"gemini" | "groq" | "other">("gemini");

  return (
    <div className="space-y-5 text-left">
      {/* Top Value Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20 space-y-2">
        <div className="flex items-center gap-2 text-primary font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>100% Free · Permanent Tier · No Credit Card Required</span>
        </div>
        <p className="text-xs text-[var(--text2)] leading-relaxed">
          Marnie AI uses a <strong>Bring-Your-Own-Key (BYOK)</strong> architecture. You get direct access to cutting-edge models (Gemini 3.7 Flash, Qwen 3.8 27B, GPT OSS 120B) without subscription fees or server markups.
        </p>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Keys are stored 100% locally in your browser's encrypted storage.</span>
        </div>
      </div>

      {/* Provider Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--surface2)] rounded-xl border border-[var(--border)]">
        <button
          onClick={() => setActiveTab("gemini")}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
            activeTab === "gemini"
              ? "bg-primary text-white shadow-xs"
              : "text-[var(--text2)] hover:text-[var(--text)]"
          }`}
        >
          Google Gemini ⭐
        </button>
        <button
          onClick={() => setActiveTab("groq")}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
            activeTab === "groq"
              ? "bg-primary text-white shadow-xs"
              : "text-[var(--text2)] hover:text-[var(--text)]"
          }`}
        >
          Groq LPU ⚡
        </button>
        <button
          onClick={() => setActiveTab("other")}
          className={`px-3 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer ${
            activeTab === "other"
              ? "bg-primary text-white shadow-xs"
              : "text-[var(--text2)] hover:text-[var(--text)]"
          }`}
        >
          Other Providers
        </button>
      </div>

      {/* Tab 1: Google Gemini (Recommended) */}
      {activeTab === "gemini" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                Google AI Studio (Gemini)
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20">
                  Recommended
                </span>
              </h3>
              <p className="text-xs text-[var(--text2)]">Flagship multimodal vision & STEM reasoning with Gemini 3.7 Flash.</p>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:brightness-110 transition-all shrink-0 cursor-pointer"
            >
              <span>Open AI Studio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs text-[var(--text)] space-y-1">
                <div className="font-bold">Sign in with your Google Account</div>
                <div className="text-[var(--text2)]">Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-primary hover:underline font-mono">aistudio.google.com/app/apikey</a> and log in with any personal Gmail or Google account.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs text-[var(--text)] space-y-1">
                <div className="font-bold">Click "Create API Key"</div>
                <div className="text-[var(--text2)]">Click the blue <strong>"Create API key"</strong> button, select any default Google Cloud project (or create one in 1 click), and copy your generated key (starts with <code className="px-1 py-0.5 rounded bg-[var(--surface)] text-[var(--text)]">AIzaSy...</code>).</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs text-[var(--text)] space-y-1">
                <div className="font-bold">Paste & Start Studying</div>
                <div className="text-[var(--text2)]">Paste the key in the <strong>API Keys</strong> tab. Marnie will automatically discover and load the latest Gemini 3.7 Flash models for you!</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
            <span>✨ Generous free tier: Up to 15 Requests Per Minute (RPM) & 1,500 daily requests.</span>
            {onOpenKeysTab && (
              <button
                onClick={onOpenKeysTab}
                className="inline-flex items-center gap-1 font-bold hover:underline cursor-pointer ml-2 shrink-0"
              >
                <span>Enter Key Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Groq LPU */}
      {activeTab === "groq" && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                Groq Console
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Ultra Fast
                </span>
              </h3>
              <p className="text-xs text-[var(--text2)]">Sub-second generation speed powered by LPU Inference Engines.</p>
            </div>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:brightness-110 transition-all shrink-0 cursor-pointer"
            >
              <span>Open Groq Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs text-[var(--text)] space-y-1">
                <div className="font-bold">Sign in to Groq Console</div>
                <div className="text-[var(--text2)]">Go to <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-primary hover:underline font-mono">console.groq.com/keys</a> and log in with Google, GitHub, or Email.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs text-[var(--text)] space-y-1">
                <div className="font-bold">Generate API Key</div>
                <div className="text-[var(--text2)]">Click <strong>"Create API Key"</strong>, give it any friendly name (e.g. "Marnie Quiz"), and copy the key (starts with <code className="px-1 py-0.5 rounded bg-[var(--surface)] text-[var(--text)]">gsk_...</code>).</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)]">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs text-[var(--text)] space-y-1">
                <div className="font-bold">Paste & Enjoy Ultra-Speed Tutoring</div>
                <div className="text-[var(--text2)]">Select <strong>Groq</strong> in API Keys tab and paste. You will have access to <strong>Qwen 3.8 27B Vision</strong> and <strong>GPT OSS 120B Reasoning</strong>!</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
            <span>⚡ Blazing fast 300+ tokens/sec response speeds with 100% free daily tier.</span>
            {onOpenKeysTab && (
              <button
                onClick={onOpenKeysTab}
                className="inline-flex items-center gap-1 font-bold hover:underline cursor-pointer ml-2 shrink-0"
              >
                <span>Enter Key Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Other Providers */}
      {activeTab === "other" && (
        <div className="space-y-3 animate-in fade-in duration-150 text-xs">
          <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
            <div className="font-bold text-[var(--text)] flex items-center justify-between">
              <span>DeepSeek (V3 / R1)</span>
              <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                <span>platform.deepseek.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[var(--text2)]">Affordable deep mathematical reasoning. Create a key at the DeepSeek Developer Portal.</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
            <div className="font-bold text-[var(--text)] flex items-center justify-between">
              <span>OpenAI (GPT-4o)</span>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                <span>platform.openai.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[var(--text2)]">Industry standard for structured formatting and high-precision STEM evaluation.</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
            <div className="font-bold text-[var(--text)] flex items-center justify-between">
              <span>Anthropic (Claude 3.5 Sonnet)</span>
              <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                <span>console.anthropic.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[var(--text2)]">World-class pedagogical tone and detailed engineering explanations.</p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--border)] space-y-2">
            <div className="font-bold text-[var(--text)] flex items-center justify-between">
              <span>OpenRouter (Unified Gateway)</span>
              <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
                <span>openrouter.ai</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[var(--text2)]">Access 200+ models with a single unified API key.</p>
          </div>
        </div>
      )}

      {/* Frequently Asked Questions */}
      <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] space-y-2 text-xs">
        <div className="font-bold text-[var(--text)] flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-primary" />
          <span>Frequently Asked Questions</span>
        </div>
        <div className="text-[11px] text-[var(--text2)] space-y-1.5 leading-relaxed">
          <p>
            <strong>Will I ever get billed?</strong> No. If you use Google AI Studio or Groq free tier, you do not even need to add a credit card.
          </p>
          <p>
            <strong>Can I switch devices?</strong> Yes! Use the <strong>"Export Study Vault"</strong> button in settings to save your keys and chat history to a JSON file, then import it on any device.
          </p>
        </div>
      </div>
    </div>
  );
}
