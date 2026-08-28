import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { userFeedbacks } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || null;
    const body = await req.json();
    const { url, moduleId, category = "formatting", comment, metadata } = body;

    if (!comment || !comment.trim()) {
      return NextResponse.json({ error: "Comment is required." }, { status: 400 });
    }

    const [record] = await db
      .insert(userFeedbacks)
      .values({
        userId: userId || null,
        url: url || "/",
        moduleId: moduleId || null,
        category: category || "formatting",
        comment: comment.trim(),
        metadata: metadata || null,
        resolved: false,
      })
      .returning();

    return NextResponse.json({ success: true, feedback: record });
  } catch (err: any) {
    console.error("Failed to save feedback:", err);
    return NextResponse.json(
      { error: err.message || "Failed to record feedback." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const records = await db
      .select()
      .from(userFeedbacks)
      .orderBy(desc(userFeedbacks.createdAt))
      .limit(100);

    return NextResponse.json({ success: true, count: records.length, feedbacks: records });
  } catch (err: any) {
    console.error("Failed to fetch feedbacks:", err);
    return NextResponse.json(
      { error: err.message || "Failed to fetch feedbacks." },
      { status: 500 }
    );
  }
}
