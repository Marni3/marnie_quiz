import { NextRequest, NextResponse } from "next/server";
import { AIProvider } from "@/lib/tutor/types";
import { DEFAULT_MODELS } from "@/lib/tutor/prompts";

export const runtime = "nodejs";

// Curated fallback lists when a provider has no models endpoint or the fetch fails
const FALLBACK_MODELS: Record<AIProvider, Array<{ id: string; name: string; recommended?: boolean }>> = {
  gemini: [
    { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash", recommended: true },
    { id: "gemini-3.0-ultra", name: "Gemini 3.0 Ultra" },
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  ],
  openai: [
    { id: "gpt-4o", name: "GPT-4o", recommended: true },
    { id: "gpt-4o-mini", name: "GPT-4o Mini" },
    { id: "gpt-4-turbo", name: "GPT-4 Turbo" },
    { id: "gpt-4", name: "GPT-4" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  ],
  anthropic: [
    { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet", recommended: true },
    { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku" },
    { id: "claude-3-opus-20240229", name: "Claude 3 Opus" },
    { id: "claude-3-sonnet-20240229", name: "Claude 3 Sonnet" },
    { id: "claude-3-haiku-20240307", name: "Claude 3 Haiku" },
  ],
  deepseek: [
    { id: "deepseek-chat", name: "DeepSeek V3 (Chat)", recommended: true },
    { id: "deepseek-reasoner", name: "DeepSeek R1 (Reasoner)" },
  ],
  openrouter: [
    { id: "google/gemini-3.6-flash-001", name: "Gemini 3.6 Flash", recommended: true },
    { id: "anthropic/claude-3.5-sonnet", name: "Claude 3.5 Sonnet" },
    { id: "openai/gpt-4o", name: "GPT-4o" },
    { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B" },
    { id: "mistralai/mixtral-8x7b-instruct", name: "Mixtral 8x7B" },
    { id: "deepseek/deepseek-chat", name: "DeepSeek V3" },
  ],
  groq: [
    { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Versatile", recommended: true },
    { id: "llama-3.1-8b-instant", name: "Llama 3.1 8B Instant" },
    { id: "llama3-8b-8192", name: "Llama 3 8B" },
    { id: "llama3-70b-8192", name: "Llama 3 70B" },
    { id: "mixtral-8x7b-32768", name: "Mixtral 8x7B (32K ctx)" },
    { id: "gemma2-9b-it", name: "Gemma 2 9B Instruct" },
    { id: "gemma-7b-it", name: "Gemma 7B Instruct" },
  ],
};

// Terms to exclude from the Gemini model list (embeddings, AQA, etc.)
const GEMINI_EXCLUDE = ["embedding", "aqa", "retrieval", "text-bison", "chat-bison", "code-bison", "gecko"];

async function fetchGeminiModels(apiKey: string) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}&pageSize=50`;
  const res = await fetch(url, { headers: { "Content-Type": "application/json" } });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.models) return null;

  // Only keep models that support generateContent
  const models = data.models
    .filter((m: any) =>
      Array.isArray(m.supportedGenerationMethods) &&
      m.supportedGenerationMethods.includes("generateContent") &&
      !GEMINI_EXCLUDE.some((ex) => m.name?.toLowerCase().includes(ex))
    )
    .map((m: any) => {
      const id = m.name.replace("models/", "");
      // Build human-readable name from displayName or id
      const displayName = m.displayName || id;
      return {
        id,
        name: displayName,
        recommended: id === "gemini-3.6-flash" || id.includes("flash") ? true : undefined,
      };
    })
    // Sort: flash first, then pro, then others
    .sort((a: any, b: any) => {
      const order = (id: string) => (id.includes("flash") ? 0 : id.includes("pro") ? 1 : 2);
      return order(a.id) - order(b.id);
    });

  return models.length > 0 ? models : null;
}

async function fetchOpenAICompatibleModels(
  apiKey: string,
  baseUrl: string,
  filterFn?: (m: any) => boolean
) {
  const res = await fetch(`${baseUrl}/models`, {
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const items: any[] = data.data || data.models || [];
  const filtered = filterFn ? items.filter(filterFn) : items;
  return filtered.map((m: any) => ({ id: m.id, name: m.id }));
}

async function fetchOpenRouterModels(apiKey: string) {
  const res = await fetch("https://openrouter.ai/api/v1/models", {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://marniequiz.vercel.app",
      "X-Title": "Marnie Quiz",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const items: any[] = data.data || [];
  // Keep top free/popular models only — cap at 30
  return items
    .sort((a: any, b: any) => {
      // Prefer free models and popular ones
      const aFree = a.pricing?.prompt === "0" || a.pricing?.prompt === 0 ? -1 : 0;
      const bFree = b.pricing?.prompt === "0" || b.pricing?.prompt === 0 ? -1 : 0;
      return aFree - bFree;
    })
    .slice(0, 30)
    .map((m: any) => ({
      id: m.id,
      name: m.name || m.id,
    }));
}

export async function POST(req: NextRequest) {
  try {
    const { provider, apiKey } = await req.json() as { provider: AIProvider; apiKey: string };

    if (!provider || !apiKey?.trim()) {
      return NextResponse.json({ error: "provider and apiKey are required" }, { status: 400 });
    }

    let models: Array<{ id: string; name: string; recommended?: boolean }> | null = null;

    try {
      if (provider === "gemini") {
        models = await fetchGeminiModels(apiKey.trim());
      } else if (provider === "openai") {
        const raw = await fetchOpenAICompatibleModels(
          apiKey.trim(),
          "https://api.openai.com/v1",
          (m) => m.id.startsWith("gpt-") || m.id.startsWith("o1") || m.id.startsWith("o3")
        );
        if (raw) {
          // Sort: gpt-4o first, then others
          models = raw.sort((a: any, b: any) => {
            const order = (id: string) =>
              id === "gpt-4o" ? 0 : id.startsWith("gpt-4") ? 1 : id.startsWith("gpt-3") ? 2 : 3;
            return order(a.id) - order(b.id);
          }).map((m: any) => ({
            ...m,
            recommended: m.id === "gpt-4o" ? true : undefined,
          }));
        }
      } else if (provider === "groq") {
        const raw = await fetchOpenAICompatibleModels(apiKey.trim(), "https://api.groq.com/openai/v1");
        if (raw) {
          models = raw
            .filter((m: any) => !m.id.includes("whisper") && !m.id.includes("guard"))
            .sort((a: any, b: any) => a.id.localeCompare(b.id))
            .map((m: any) => ({
              ...m,
              recommended: m.id === "llama-3.3-70b-versatile" ? true : undefined,
            }));
        }
      } else if (provider === "openrouter") {
        models = await fetchOpenRouterModels(apiKey.trim());
      }
      // Anthropic and DeepSeek have no public model list endpoints — fall through to fallback
    } catch (fetchErr) {
      console.warn(`Model fetch failed for ${provider}:`, fetchErr);
    }

    // Fall back to curated list if live fetch failed or isn't supported
    const finalModels = models && models.length > 0 ? models : FALLBACK_MODELS[provider] || [];

    return NextResponse.json({
      provider,
      models: finalModels,
      source: models && models.length > 0 ? "live" : "fallback",
      defaultModel: DEFAULT_MODELS[provider],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch models" }, { status: 500 });
  }
}
