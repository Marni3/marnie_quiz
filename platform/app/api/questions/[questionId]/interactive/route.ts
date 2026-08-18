import { auth } from "@/lib/auth";
import { attachInteractiveModule } from "@/lib/quizzes";
import { NextResponse } from "next/server";

const MAX_HTML_BYTES = 300 * 1024; // 300 KB size limit per Section 8

export async function POST(
  req: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { questionId } = await params;
    const body = await req.json();
    const { interactiveHtml, interactiveUrl } = body;

    if (interactiveHtml && typeof interactiveHtml === "string") {
      const bytes = new TextEncoder().encode(interactiveHtml).length;
      if (bytes > MAX_HTML_BYTES) {
        return NextResponse.json(
          { error: `Interactive module HTML exceeds the 300 KB size limit (${Math.round(bytes / 1024)} KB).` },
          { status: 400 }
        );
      }
    }

    const updated = await attachInteractiveModule(questionId, session.user.id, {
      interactiveHtml: interactiveHtml || null,
      interactiveUrl: interactiveUrl || null,
    });

    return NextResponse.json({ success: true, question: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
