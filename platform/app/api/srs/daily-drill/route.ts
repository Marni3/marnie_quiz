import { auth } from "@/lib/auth";
import { assembleDailyRefresherDrill, RefresherDrillOptions } from "@/lib/srs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  try {
    let options: RefresherDrillOptions = {};

    const url = new URL(req.url);
    const queryDomain = url.searchParams.get("domain");
    if (queryDomain) {
      options.domain = queryDomain;
    }

    try {
      const body = await req.json();
      if (body) {
        options = { ...options, ...body };
      }
    } catch {}

    const attemptId = await assembleDailyRefresherDrill(userId, options);
    return NextResponse.json({
      success: true,
      attemptId,
      domain: options.domain || "GLOBAL",
      count: options.count || 20,
    });
  } catch (err: unknown) {
    console.error("Daily drill generation error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to assemble daily refresher drill" },
      { status: 500 }
    );
  }
}
