import { auth } from "@/lib/auth";
import { getAllUserModuleProgress } from "@/lib/srs";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  try {
    const progressList = await getAllUserModuleProgress(userId);
    return NextResponse.json({ progressList });
  } catch (err: unknown) {
    console.error("All module progress GET error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
