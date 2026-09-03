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
      provider: initialProvider,
      apiKey: initialApiKey,
      model: initialModel,
      messages,
      functionMode = "chat",
      contextPayload,
      availableKeys = {},
    }: {
      provider: AIProvider;
      apiKey: string;
      model: string;
      messages: Array<{ role: string; content: string }>;
      functionMode?: TutorFunctionMode;
      contextPayload?: any;
      availableKeys?: Partial<Record<AIProvider, string>>;
    } = body;

    let provider = initialProvider;
    let apiKey = initialApiKey;
    let model = initialModel;

    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        { error: `Missing API Key for provider "${provider}". Please configure your BYOK key in Settings.` },
        { status: 400 }
      );
    }

    const requestStartTime = Date.now();

    // Fetch live FSRS profile, recent scores & active modules for this user
    const userProfileContext = await getUserStudyProfileContext(userId);
    let systemPrompt = getSystemPrompt(functionMode, contextPayload, userProfileContext);

    // 1. GOOGLE GEMINI STREAMING (With Speed Cutover to Groq via AbortController)
    if (provider === "gemini") {
      const requestedModel = (model || "gemini-2.0-flash").replace("models/", "");
      // Verified real Google models only (zero ghost models)
      const GEMINI_CANDIDATES = Array.from(
        new Set([
          requestedModel,
          "gemini-2.0-flash",
          "gemini-1.5-flash",
          "gemini-2.0-flash-lite",
        ])
      );

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

      let upstreamRes: Response | null = null;
      let usedModel = requestedModel;
      let isCutoverToGroq = false;
      const groqKey = availableKeys?.groq?.trim();

      for (const candidate of GEMINI_CANDIDATES) {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${candidate}:streamGenerateContent?alt=sse&key=${encodeURIComponent(
          apiKey.trim()
        )}`;

        // Set up AbortController with 3.5s timeout if Groq fallback key is available
        const abortController = new AbortController();
        let timeoutId: NodeJS.Timeout | null = null;
        if (groqKey) {
          timeoutId = setTimeout(() => {
            abortController.abort("Gemini TTFT exceeded 3.5s timeout; cutting over to Groq");
          }, 3500);
        }

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(geminiPayload),
            signal: abortController.signal,
          });

          if (timeoutId) clearTimeout(timeoutId);

          if (res.ok) {
            upstreamRes = res;
            usedModel = candidate;
            break;
          } else {
            const lastErrText = await res.text();
            console.warn(`Gemini candidate ${candidate} failed (${res.status}):`, lastErrText);
            if (res.status === 429 || res.status === 503 || res.status === 404 || lastErrText.includes("RESOURCE_EXHAUSTED") || lastErrText.includes("high demand")) {
              continue;
            } else {
              upstreamRes = res;
              break;
            }
          }
        } catch (fetchErr: any) {
          if (timeoutId) clearTimeout(timeoutId);
          console.warn(`Fetch error for Gemini candidate ${candidate}:`, fetchErr?.name || fetchErr?.message);

          // If aborted due to timeout and user has Groq key, trigger immediate speed cutover
          if (fetchErr?.name === "AbortError" && groqKey) {
            isCutoverToGroq = true;
            break;
          }
        }
      }

      // If Gemini was exhausted or timed out, and user has a Groq key: cut over to Groq
      if ((!upstreamRes || !upstreamRes.ok || isCutoverToGroq) && groqKey) {
        console.info("⚡ Cutting over to Groq fallback for ultra-fast response...");
        isCutoverToGroq = true;

        // Groq TPM Context Budget Adapter: Compress exam review items if large
        let groqContext = contextPayload;
        if (contextPayload && Array.isArray(contextPayload.reviewItems) && contextPayload.reviewItems.length > 5) {
          groqContext = {
            ...contextPayload,
            reviewItems: contextPayload.reviewItems.slice(0, 5),
          };
        }
        const groqSystemPrompt = getSystemPrompt(functionMode, groqContext, userProfileContext);

        const openAiMessages = [
          { role: "system", content: groqSystemPrompt },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ];

        try {
          const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${groqKey}`,
            },
            body: JSON.stringify({
              model: "llama-3.3-70b-versatile",
              messages: openAiMessages,
              stream: true,
              temperature: 0.7,
              max_tokens: 4096,
            }),
          });

          if (groqRes.ok) {
            const stream = new ReadableStream({
              async start(controller) {
                const notice = `> *⚡ Note: Response routed via Groq LLaMA 3.3 70B (300 t/s auto-cutover).* \n\n`;
                controller.enqueue(new TextEncoder().encode(notice));

                const reader = groqRes.body?.getReader();
                if (!reader) { controller.close(); return; }
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
                        const content = delta?.content || delta?.reasoning_content || "";
                        if (content) controller.enqueue(new TextEncoder().encode(content));
                      } catch {}
                    }
                  }
                } catch (streamErr) {
                  controller.error(streamErr);
                } finally {
                  controller.close();
                }
              },
            });

            return new Response(stream, {
              headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
                "X-Marnie-Provider": "groq",
                "X-Marnie-Model": "llama-3.3-70b-versatile",
                "X-Marnie-Cutover": "true",
                "X-Marnie-Latency-Ms": String(Date.now() - requestStartTime),
              },
            });
          }
        } catch (groqErr) {
          console.error("Groq cutover failed:", groqErr);
        }
      }

      if (!upstreamRes || !upstreamRes.ok) {
        const status = upstreamRes ? upstreamRes.status : 503;
        let userFriendly = `Google Gemini is currently experiencing peak demand across all tiers (HTTP ${status}).\n\n💡 **Tip**: Add a free Groq (ultra-low latency Llama 3.3 70B) or OpenRouter backup key in your AI Tutor settings for seamless auto-cutover.`;
        return NextResponse.json(
          { error: userFriendly, isRateLimit: true },
          { status }
        );
      }

      const isFallback = usedModel !== requestedModel;

      const stream = new ReadableStream({
        async start(controller) {
          if (isFallback) {
            const fallbackNotice = `> *⚡ Note: Streamed via ${usedModel} (due to peak demand on ${requestedModel}).*\n\n`;
            controller.enqueue(new TextEncoder().encode(fallbackNotice));
          }

          const reader = upstreamRes!.body?.getReader();
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
          "X-Marnie-Provider": "gemini",
          "X-Marnie-Model": usedModel,
          "X-Marnie-Cutover": "false",
          "X-Marnie-Latency-Ms": String(Date.now() - requestStartTime),
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
          model: model || (provider === "deepseek" ? "deepseek-chat" : provider === "groq" ? "qwen/qwen3.8-27b" : "gpt-4o"),
          messages: openAiMessages,
          stream: true,
          temperature: 0.7,
          max_tokens: 8192,
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
          "X-Marnie-Provider": provider,
          "X-Marnie-Model": model || "default",
          "X-Marnie-Cutover": "false",
          "X-Marnie-Latency-Ms": String(Date.now() - requestStartTime),
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
          max_tokens: 8192,
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
