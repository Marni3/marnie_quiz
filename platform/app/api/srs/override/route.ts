import { auth } from "@/lib/auth";
import { setManualConfidence, snoozeTopic, toggleSuspendTopic } from "@/lib/srs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  try {
    const body = await req.json();
    const { action, topicCode, confidence, days } = body;

    if (!topicCode) {
      return NextResponse.json({ error: "topicCode is required" }, { status: 400 });
    }

    if (action === "confidence" && confidence) {
      await setManualConfidence(userId, topicCode, confidence);
      return NextResponse.json({ success: true, message: `Confidence set to ${confidence}` });
    }

    if (action === "snooze") {
      const snoozeDays = Number(days) || 7;
      await snoozeTopic(userId, topicCode, snoozeDays);
      return NextResponse.json({ success: true, message: `Snoozed for ${snoozeDays} days` });
    }

    if (action === "suspend") {
      const newStatus = await toggleSuspendTopic(userId, topicCode);
      return NextResponse.json({ success: true, status: newStatus });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    console.error("SRS override error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
