import { NextRequest, NextResponse } from "next/server";
import { AIProvider } from "@/lib/tutor/types";
import { DEFAULT_MODELS } from "@/lib/tutor/prompts";
import { MODEL_REGISTRY, findModelMetadata } from "@/lib/tutor/model-registry";

export const runtime = "nodejs";

// Terms to exclude from the Gemini model list (embeddings, AQA, etc.)
const GEMINI_EXCLUDE = ["embedding", "aqa", "retrieval", "text-bison", "chat-bison", "code-bison", "gecko", "imagen"];

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
      const meta = findModelMetadata("gemini", id);
      const displayName = meta?.name || m.displayName || id;
      const rank = meta?.rank ?? 99;
      return {
        id,
        name: displayName,
        rank,
        isMultimodal: meta?.isMultimodal ?? true,
        recommended: id === "gemini-3.7-flash" || id === "gemini-3.6-flash" ? true : undefined,
      };
    })
    // Sort by capability rank
    .sort((a: any, b: any) => a.rank - b.rank);

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
          models = raw.map((m: any) => {
            const meta = findModelMetadata("openai", m.id);
            return {
              id: m.id,
              name: meta?.name || m.id,
              rank: meta?.rank ?? 99,
              recommended: m.id === "gpt-4o" ? true : undefined,
            };
          }).sort((a: any, b: any) => a.rank - b.rank);
        }
      } else if (provider === "groq") {
        const raw = await fetchOpenAICompatibleModels(apiKey.trim(), "https://api.groq.com/openai/v1");
        if (raw) {
          models = raw
            .filter((m: any) =>
              !m.id.includes("whisper") &&
              !m.id.includes("guard") &&
              !m.id.includes("canopylabs") &&
              !m.id.includes("allam")
            )
            .map((m: any) => {
              const meta = findModelMetadata("groq", m.id);
              return {
                id: m.id,
                name: meta?.name || m.id,
                rank: meta?.rank ?? 99,
                recommended: m.id === "qwen/qwen3.8-27b" || m.id === "openai/gpt-oss-120b" ? true : undefined,
              };
            })
            .sort((a: any, b: any) => a.rank - b.rank);
        }
      } else if (provider === "openrouter") {
        models = await fetchOpenRouterModels(apiKey.trim());
      }
    } catch (fetchErr) {
      console.warn(`Model fetch failed for ${provider}:`, fetchErr);
    }

    // Fall back to curated list from MODEL_REGISTRY if live fetch failed or isn't supported
    const fallbackList = MODEL_REGISTRY[provider]?.map((m) => ({
      id: m.id,
      name: m.name,
      recommended: m.isRecommended,
    })) || [];

    const finalModels = models && models.length > 0 ? models : fallbackList;

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
