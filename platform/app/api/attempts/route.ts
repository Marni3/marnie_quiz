import { auth } from "@/lib/auth";
import { createAttempt } from "@/lib/attempts";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { questionSetId, mode } = body;

    if (!questionSetId) {
      return NextResponse.json(
        { error: "questionSetId is required." },
        { status: 400 }
      );
    }

    const validModes = ["untimed", "timed_per_question", "timed_whole_exam"];
    const chosenMode = validModes.includes(mode) ? mode : "untimed";

    const attempt = await createAttempt({
      userId: session.user.id,
      questionSetId,
      mode: chosenMode,
    });

    return NextResponse.json({ success: true, attempt });
  } catch (err: unknown) {
    console.error("Create attempt error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
