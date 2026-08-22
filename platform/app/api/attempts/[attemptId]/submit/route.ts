import { auth } from "@/lib/auth";
import { gradeAndSubmitAttempt } from "@/lib/grading";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  try {
    const { attemptId } = await params;
    const body = await req.json();
    const { answers, durationSeconds } = body;

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: "answers array is required." },
        { status: 400 }
      );
    }

    const graded = await gradeAndSubmitAttempt({
      attemptId,
      userId,
      answers,
      durationSeconds: Number(durationSeconds) || 0,
    });

    return NextResponse.json({ success: true, attempt: graded });
  } catch (err: unknown) {
    console.error("Grading submit error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
