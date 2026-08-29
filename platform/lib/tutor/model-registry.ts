import { AIProvider } from "./types";

export interface ModelCapability {
  id: string;
  name: string;
  provider: AIProvider;
  rank: number; // 1 (Highest priority / Flagship) to 5
  isMultimodal: boolean; // Vision / diagram / image support
  isRecommended?: boolean;
  isFreeTier?: boolean;
  description: string;
}

export const MODEL_REGISTRY: Record<AIProvider, ModelCapability[]> = {
  gemini: [
    {
      id: "gemini-3.7-flash",
      name: "Gemini 3.7 Flash",
      provider: "gemini",
      rank: 1,
      isMultimodal: true,
      isRecommended: true,
      isFreeTier: true,
      description: "Latest & most capable Flash model for complex STEM, agentic reasoning, and KaTeX derivations.",
    },
    {
      id: "gemini-3.6-flash",
      name: "Gemini 3.6 Flash",
      provider: "gemini",
      rank: 2,
      isMultimodal: true,
      isFreeTier: true,
      description: "Balanced speed & multimodal capabilities for routine tutoring and derivations.",
    },
    {
      id: "gemini-3.5-flash",
      name: "Gemini 3.5 Flash",
      provider: "gemini",
      rank: 3,
      isMultimodal: true,
      isFreeTier: true,
      description: "High-throughput baseline model for fast Socratic review.",
    },
    {
      id: "gemini-3.5-flash-lite",
      name: "Gemini 3.5 Flash-Lite",
      provider: "gemini",
      rank: 4,
      isMultimodal: false,
      isFreeTier: true,
      description: "Fastest cost-effective model for high-throughput execution.",
    },
    {
      id: "gemini-3.1-flash-lite",
      name: "Gemini 3.1 Flash-Lite",
      provider: "gemini",
      rank: 5,
      isMultimodal: false,
      isFreeTier: true,
      description: "Frontier-class lightweight performance.",
    },
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      provider: "gemini",
      rank: 2,
      isMultimodal: true,
      isFreeTier: true,
      description: "Deep reasoning and extensive context.",
    },
    {
      id: "gemini-2.0-flash",
      name: "Gemini 2.0 Flash",
      provider: "gemini",
      rank: 3,
      isMultimodal: true,
      isFreeTier: true,
      description: "High-speed multimodal generation.",
    },
    {
      id: "gemini-1.5-pro",
      name: "Gemini 1.5 Pro",
      provider: "gemini",
      rank: 3,
      isMultimodal: true,
      isFreeTier: true,
      description: "Long-context reasoning workhorse.",
    },
    {
      id: "gemini-1.5-flash",
      name: "Gemini 1.5 Flash",
      provider: "gemini",
      rank: 4,
      isMultimodal: true,
      isFreeTier: true,
      description: "Lightweight fallback tier.",
    },
  ],

  groq: [
    {
      id: "qwen/qwen3.8-27b",
      name: "Qwen 3.8 27B (Multimodal Vision)",
      provider: "groq",
      rank: 1,
      isMultimodal: true,
      isRecommended: true,
      isFreeTier: true,
      description: "State-of-the-art multimodal vision model on Groq LPU with deep reasoning for circuit diagrams.",
    },
    {
      id: "openai/gpt-oss-120b",
      name: "GPT OSS 120B (Deep Reasoning)",
      provider: "groq",
      rank: 1,
      isMultimodal: false,
      isRecommended: true,
      isFreeTier: true,
      description: "120B parameter reasoning model with native structured outputs and JSON mode for tests.",
    },
    {
      id: "openai/gpt-oss-20b",
      name: "GPT OSS 20B (Ultra-Fast)",
      provider: "groq",
      rank: 2,
      isMultimodal: false,
      isFreeTier: true,
      description: "Sub-second response speed with full reasoning and structured outputs.",
    },
    {
      id: "qwen/qwen3.6-27b",
      name: "Qwen 3.6 27B (Vision)",
      provider: "groq",
      rank: 2,
      isMultimodal: true,
      isFreeTier: true,
      description: "High-throughput 27B multimodal vision model with 131k context window.",
    },
    {
      id: "groq/compound",
      name: "Groq Compound (131k)",
      provider: "groq",
      rank: 3,
      isMultimodal: false,
      isFreeTier: true,
      description: "Native Groq compound reasoning system with 131k context window.",
    },
    {
      id: "groq/compound-mini",
      name: "Groq Compound Mini",
      provider: "groq",
      rank: 3,
      isMultimodal: false,
      isFreeTier: true,
      description: "Fast native Groq compound reasoning model.",
    },
    {
      id: "llama-3.3-70b-versatile",
      name: "Llama 3.3 70B Versatile",
      provider: "groq",
      rank: 4,
      isMultimodal: false,
      isFreeTier: true,
      description: "Legacy 70B parameter open-weights model.",
    },
  ],

  openai: [
    {
      id: "gpt-4o",
      name: "GPT-4o (Omni)",
      provider: "openai",
      rank: 1,
      isMultimodal: true,
      isRecommended: true,
      isFreeTier: false,
      description: "State-of-the-art multimodal precision for math, circuit diagrams, and exam rules.",
    },
    {
      id: "o3-mini",
      name: "o3-mini (Reasoning)",
      provider: "openai",
      rank: 1,
      isMultimodal: false,
      isFreeTier: false,
      description: "Specialized deep step-by-step mathematical reasoning.",
    },
    {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
      provider: "openai",
      rank: 2,
      isMultimodal: true,
      isFreeTier: false,
      description: "Fast, cost-effective multimodal model.",
    },
    {
      id: "o1",
      name: "o1",
      provider: "openai",
      rank: 1,
      isMultimodal: true,
      isFreeTier: false,
      description: "Deep chain-of-thought frontier reasoning.",
    },
    {
      id: "gpt-4-turbo",
      name: "GPT-4 Turbo",
      provider: "openai",
      rank: 3,
      isMultimodal: true,
      isFreeTier: false,
      description: "Legacy 128k context flagship.",
    },
  ],

  anthropic: [
    {
      id: "claude-3-5-sonnet-20241022",
      name: "Claude 3.5 Sonnet",
      provider: "anthropic",
      rank: 1,
      isMultimodal: true,
      isRecommended: true,
      isFreeTier: false,
      description: "Master pedagogical tutor with nuanced mathematical and conceptual clarity.",
    },
    {
      id: "claude-3-5-haiku-20241022",
      name: "Claude 3.5 Haiku",
      provider: "anthropic",
      rank: 1,
      isMultimodal: true,
      isFreeTier: false,
      description: "Ultra-fast response with high-fidelity reasoning.",
    },
    {
      id: "claude-3-opus-20240229",
      name: "Claude 3 Opus",
      provider: "anthropic",
      rank: 2,
      isMultimodal: true,
      isFreeTier: false,
      description: "Deep analytical synthesis.",
    },
  ],

  deepseek: [
    {
      id: "deepseek-chat",
      name: "DeepSeek V3 (Chat)",
      provider: "deepseek",
      rank: 1,
      isMultimodal: false,
      isRecommended: true,
      isFreeTier: false,
      description: "Frontier open-architecture model with exceptional cost efficiency.",
    },
    {
      id: "deepseek-reasoner",
      name: "DeepSeek R1 (Reasoner)",
      provider: "deepseek",
      rank: 1,
      isMultimodal: false,
      isFreeTier: false,
      description: "Pure chain-of-thought mathematical proof solver.",
    },
  ],

  openrouter: [
    {
      id: "google/gemini-3.7-flash",
      name: "Gemini 3.7 Flash (OpenRouter)",
      provider: "openrouter",
      rank: 1,
      isMultimodal: true,
      isRecommended: true,
      description: "Latest Flash flagship via OpenRouter gateway.",
    },
    {
      id: "google/gemini-3.6-flash-001",
      name: "Gemini 3.6 Flash (OpenRouter)",
      provider: "openrouter",
      rank: 2,
      isMultimodal: true,
      description: "Fast multimodal gateway.",
    },
    {
      id: "meta-llama/llama-3.3-70b-instruct",
      name: "Llama 3.3 70B (OpenRouter)",
      provider: "openrouter",
      rank: 1,
      isMultimodal: false,
      description: "70B STEM open weights.",
    },
    {
      id: "anthropic/claude-3.5-sonnet",
      name: "Claude 3.5 Sonnet (OpenRouter)",
      provider: "openrouter",
      rank: 1,
      isMultimodal: true,
      description: "Pedagogical master via OpenRouter.",
    },
    {
      id: "deepseek/deepseek-chat",
      name: "DeepSeek V3 (OpenRouter)",
      provider: "openrouter",
      rank: 2,
      isMultimodal: false,
      description: "High-value cost efficient.",
    },
  ],
};

/**
 * Get prioritized fallback models within the SAME provider
 */
export function getIntraProviderFallbacks(provider: AIProvider, currentModel: string): string[] {
  const list = MODEL_REGISTRY[provider] || [];
  return list
    .map((m) => m.id)
    .filter((id) => id !== currentModel);
}

/**
 * Find model metadata from registry
 */
export function findModelMetadata(provider: AIProvider, modelId: string): ModelCapability | undefined {
  const clean = modelId.replace("models/", "");
  const list = MODEL_REGISTRY[provider] || [];
  return list.find((m) => m.id === clean || m.id.toLowerCase() === clean.toLowerCase());
}
