import { auth } from "@/lib/auth";
import { getUserFolders, createFolder } from "@/lib/folders";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const list = await getUserFolders(session.user.id);
  return NextResponse.json({ folders: list });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, parentFolderId } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Folder name is required." },
        { status: 400 }
      );
    }

    const folder = await createFolder(session.user.id, name, parentFolderId);
    return NextResponse.json({ success: true, folder });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
