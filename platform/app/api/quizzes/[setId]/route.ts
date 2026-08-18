import { auth } from "@/lib/auth";
import { updateQuestionSet, deleteQuestionSet } from "@/lib/quizzes";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ setId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { setId } = await params;
    const body = await req.json();
    const { title, subjectTag, visibility, folderId } = body;

    const updated = await updateQuestionSet(setId, session.user.id, {
      title,
      subjectTag,
      visibility,
      folderId,
    });

    return NextResponse.json({ success: !!updated, set: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ setId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { setId } = await params;
    const deleted = await deleteQuestionSet(setId, session.user.id);
    return NextResponse.json({ success: deleted });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
