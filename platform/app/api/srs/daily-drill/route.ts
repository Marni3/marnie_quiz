import { auth } from "@/lib/auth";
import { assembleDailyRefresherDrill } from "@/lib/srs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  try {
    const attemptId = await assembleDailyRefresherDrill(userId);
    return NextResponse.json({ success: true, attemptId });
  } catch (err: unknown) {
    console.error("Daily drill generation error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to assemble daily refresher drill" },
      { status: 500 }
    );
  }
}
