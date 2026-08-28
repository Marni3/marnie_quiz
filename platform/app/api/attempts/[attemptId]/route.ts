import { auth } from "@/lib/auth";
import { getAttemptResults } from "@/lib/grading";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ attemptId: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  try {
    const { attemptId } = await params;
    const data = await getAttemptResults(attemptId, userId);
    if (!data) {
      return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, ...data });
  } catch (err: unknown) {
    console.error("Fetch attempt error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
