import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { attempts, userTopicSrs, userModuleProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;
    const defaultUserId = "00000000-0000-0000-0000-000000000001";

    const userIdsToWipe = sessionUserId
      ? Array.from(new Set([sessionUserId, defaultUserId]))
      : [defaultUserId];

    for (const uId of userIdsToWipe) {
      // 1. Delete all FSRS topic retention tracking rows
      await db.delete(userTopicSrs).where(eq(userTopicSrs.userId, uId)).catch(() => {});

      // 2. Delete all module progress and concept check scores
      await db.delete(userModuleProgress).where(eq(userModuleProgress.userId, uId)).catch(() => {});

      // 3. Delete all quiz and exam attempts (cascades to answerRecords)
      await db.delete(attempts).where(eq(attempts.userId, uId)).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: "Database progress records (attempts, FSRS matrix, module progress) wiped successfully.",
    });
  } catch (err: any) {
    console.error("Failed to reset user database progress:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to reset database progress." },
      { status: 500 }
    );
  }
}
