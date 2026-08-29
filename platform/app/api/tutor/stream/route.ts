import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getSystemPrompt } from "@/lib/tutor/prompts";
import { getUserStudyProfileContext } from "@/lib/tutor/user-context";
import { TutorFunctionMode, AIProvider } from "@/lib/tutor/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;

    const body = await req.json();
    const {
      provider,
      apiKey,
      model,
      messages,
      functionMode = "chat",
      contextPayload,
    }: {
      provider: AIProvider;
      apiKey: string;
      model: string;
      messages: Array<{ role: string; content: string }>;
      functionMode?: TutorFunctionMode;
      contextPayload?: any;
    } = body;

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        { error: `Missing API Key for provider "${provider}". Please configure your BYOK key in Settings.` },
        { status: 400 }
      );
    }

    // Fetch live FSRS profile, recent scores & active modules for this user
    const userProfileContext = await getUserStudyProfileContext(userId);
    const systemPrompt = getSystemPrompt(functionMode, contextPayload, userProfileContext);

    // 1. GOOGLE GEMINI STREAMING
    if (provider === "gemini") {
      // Remap deprecated/renamed model IDs transparently
      const GEMINI_MODEL_ALIASES: Record<string, string> = {
        "gemini-2.0-flash": "gemini-3.6-flash",
        "gemini-2.0-flash-exp": "gemini-3.6-flash",
        "gemini-2.0-flash-001": "gemini-3.6-flash",
        "gemini-1.5-flash": "gemini-3.6-flash",
        "gemini-1.5-flash-latest": "gemini-3.6-flash",
        "gemini-pro": "gemini-3.6-flash",
        "models/gemini-2.0-flash": "gemini-3.6-flash",
      };
      const rawModel = model || "gemini-3.6-flash";
      const geminiModel = GEMINI_MODEL_ALIASES[rawModel] ?? rawModel;
      const cleanGeminiModel = geminiModel.startsWith("models/")
        ? geminiModel.replace("models/", "")
        : geminiModel;
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${cleanGeminiModel}:streamGenerateContent?alt=sse&key=${encodeURIComponent(
        apiKey.trim()
      )}`;

      // Convert standard messages to Gemini contents format
      const contents = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        }));

      const geminiPayload = {
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
      };

      const upstreamRes = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiPayload),
      });

      if (!upstreamRes.ok) {
        const errText = await upstreamRes.text();
        console.error("Gemini upstream error:", upstreamRes.status, errText);
        let userFriendly = `Gemini API error (${upstreamRes.status}): ${errText}`;
        if (
          upstreamRes.status === 429 ||
          upstreamRes.status === 503 ||
          errText.toLowerCase().includes("resource_exhausted") ||
          errText.toLowerCase().includes("high demand")
        ) {
          userFriendly = `Google Gemini is currently experiencing peak demand or rate limits (HTTP ${upstreamRes.status}).\n\n💡 **Tip**: To bypass rate limits and continue studying without interruptions, add a free Groq (ultra-low latency Llama 3.3) or OpenRouter backup key in your AI Tutor settings.`;
        }
        return NextResponse.json(
          { error: userFriendly, isRateLimit: true },
          { status: upstreamRes.status }
        );
      }

      const stream = new ReadableStream({
        async start(controller) {
          const reader = upstreamRes.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }
          const decoder = new TextDecoder();
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });

              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith(":")) continue;
                if (trimmed.startsWith("data:")) {
                  const jsonStr = trimmed.replace(/^data:\s*/, "");
                  if (jsonStr === "[DONE]") continue;
                  try {
                    const parsed = JSON.parse(jsonStr);
                    const parts = parsed.candidates?.[0]?.content?.parts;
                    if (Array.isArray(parts)) {
                      for (const part of parts) {
                        if (part?.text) {
                          controller.enqueue(new TextEncoder().encode(part.text));
                        }
                      }
                    }
                  } catch { }
                }
              }
            }

            if (buffer.trim().startsWith("data:")) {
              try {
                const jsonStr = buffer.trim().replace(/^data:\s*/, "");
                const parsed = JSON.parse(jsonStr);
                const parts = parsed.candidates?.[0]?.content?.parts;
                if (Array.isArray(parts)) {
                  for (const part of parts) {
                    if (part?.text) {
                      controller.enqueue(new TextEncoder().encode(part.text));
                    }
                  }
                }
              } catch { }
            }
          } catch (err: any) {
            controller.error(err);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // 2. OPENAI / DEEPSEEK / OPENROUTER / GROQ STREAMING (OpenAI-compatible)
    if (provider === "openai" || provider === "deepseek" || provider === "openrouter" || provider === "groq") {
      let endpoint = "https://api.openai.com/v1/chat/completions";
      if (provider === "deepseek") endpoint = "https://api.deepseek.com/chat/completions";
      if (provider === "openrouter") endpoint = "https://openrouter.ai/api/v1/chat/completions";
      if (provider === "groq") endpoint = "https://api.groq.com/openai/v1/chat/completions";

      const openAiMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ];

      const upstreamRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
          ...(provider === "openrouter"
            ? {
              "HTTP-Referer": "https://marniequiz.app",
              "X-Title": "Marnie Quiz ECE Platform",
            }
            : {}),
        },
        body: JSON.stringify({
          model: model || (provider === "deepseek" ? "deepseek-chat" : provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o"),
          messages: openAiMessages,
          stream: true,
          temperature: 0.7,
        }),
      });

      if (!upstreamRes.ok) {
        const errText = await upstreamRes.text();
        console.error(`${provider} upstream error:`, upstreamRes.status, errText);
        let userFriendly = `${provider.toUpperCase()} API error (${upstreamRes.status}): ${errText}`;
        if (upstreamRes.status === 429 || upstreamRes.status === 503) {
          userFriendly = `The ${provider.toUpperCase()} API is experiencing high demand or rate limits (HTTP ${upstreamRes.status}).\n\n💡 **Tip**: Check your API key quotas or switch to a Google Gemini or OpenRouter backup key in Settings.`;
        }
        return NextResponse.json(
          { error: userFriendly, isRateLimit: true },
          { status: upstreamRes.status }
        );
      }

      const stream = new ReadableStream({
        async start(controller) {
          const reader = upstreamRes.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }
          const decoder = new TextDecoder();
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });

              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data:")) continue;
                const jsonStr = trimmed.replace(/^data:\s*/, "");
                if (jsonStr === "[DONE]") continue;

                try {
                  const parsed = JSON.parse(jsonStr);
                  const delta = parsed.choices?.[0]?.delta;
                  const content = delta?.content || delta?.reasoning_content || parsed.choices?.[0]?.text || "";
                  if (content) {
                    controller.enqueue(new TextEncoder().encode(content));
                  }
                } catch { }
              }
            }
          } catch (err: any) {
            controller.error(err);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // 3. ANTHROPIC CLAUDE STREAMING
    if (provider === "anthropic") {
      const endpoint = "https://api.anthropic.com/v1/messages";
      const claudeMessages = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({ role: m.role, content: m.content }));

      const upstreamRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey.trim(),
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: model || "claude-3-5-sonnet-20241022",
          max_tokens: 4096,
          system: systemPrompt,
          messages: claudeMessages,
          stream: true,
          temperature: 0.7,
        }),
      });

      if (!upstreamRes.ok) {
        const errText = await upstreamRes.text();
        return NextResponse.json(
          { error: `Anthropic API error (${upstreamRes.status}): ${errText}` },
          { status: upstreamRes.status }
        );
      }

      const stream = new ReadableStream({
        async start(controller) {
          const reader = upstreamRes.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }
          const decoder = new TextDecoder();
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });

              const lines = buffer.split("\n");
              buffer = lines.pop() || "";

              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || !trimmed.startsWith("data:")) continue;
                const jsonStr = trimmed.replace(/^data:\s*/, "");

                try {
                  const parsed = JSON.parse(jsonStr);
                  if (
                    parsed.type === "content_block_delta" &&
                    parsed.delta?.text
                  ) {
                    controller.enqueue(
                      new TextEncoder().encode(parsed.delta.text)
                    );
                  }
                } catch { }
              }
            }
          } catch (err: any) {
            controller.error(err);
          } finally {
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    return NextResponse.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
  } catch (err: any) {
    console.error("Tutor streaming route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal streaming error" },
      { status: 500 }
    );
  }
}
