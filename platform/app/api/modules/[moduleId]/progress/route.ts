import { auth } from "@/lib/auth";
import { getModuleProgress, updateModuleProgress } from "@/lib/srs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";
  const { moduleId } = await params;

  try {
    const progress = await getModuleProgress(userId, moduleId);
    return NextResponse.json({ progress });
  } catch (err: unknown) {
    console.error("Module progress GET error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";
  const { moduleId } = await params;

  try {
    const body = await req.json();
    const updated = await updateModuleProgress({
      userId,
      moduleId,
      topicCode: body.topicCode,
      domain: body.domain,
      isCompleted: body.isCompleted,
      isBookmarked: body.isBookmarked,
      conceptChecksCompleted: body.conceptChecksCompleted,
      conceptChecksTotal: body.conceptChecksTotal,
      conceptChecksAccuracy: body.conceptChecksAccuracy,
      masteryScorePercent: body.masteryScorePercent,
      confidence: body.confidence,
    });

    return NextResponse.json({ success: true, progress: updated });
  } catch (err: unknown) {
    console.error("Module progress POST error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
