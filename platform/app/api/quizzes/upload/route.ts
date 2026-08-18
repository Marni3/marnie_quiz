import { auth } from "@/lib/auth";
import { parseAndValidateCsv } from "@/lib/validations/csv";
import { createQuestionSetFromCsv } from "@/lib/quizzes";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, subjectTag, visibility, folderId, csvContent } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Quiz title is required." },
        { status: 400 }
      );
    }

    if (!csvContent || typeof csvContent !== "string") {
      return NextResponse.json(
        { error: "CSV content is required." },
        { status: 400 }
      );
    }

    // Parse and validate rows against schema
    const validation = parseAndValidateCsv(csvContent);
    if (!validation.success || !validation.rows) {
      return NextResponse.json(
        { errors: validation.errors || ["Validation failed."] },
        { status: 422 }
      );
    }

    const set = await createQuestionSetFromCsv({
      userId: session.user.id,
      title: title.trim(),
      subjectTag: subjectTag ? subjectTag.trim() : null,
      visibility: visibility === "private" ? "private" : "shared",
      folderId: folderId || null,
      rawCsv: csvContent,
      rows: validation.rows,
    });

    return NextResponse.json({ success: true, set });
  } catch (err: unknown) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
