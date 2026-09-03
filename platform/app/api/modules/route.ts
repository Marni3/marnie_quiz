import { NextResponse } from "next/server";
import { getAllLearningModules } from "@/lib/modules";

export async function GET() {
  try {
    const modules = await getAllLearningModules();
    return NextResponse.json({ success: true, modules });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch modules catalog" },
      { status: 500 }
    );
  }
}
