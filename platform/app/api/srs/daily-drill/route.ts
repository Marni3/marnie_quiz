import { auth } from "@/lib/auth";
import { assembleDailyRefresherDrill } from "@/lib/srs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  try {
    let domain: string | undefined = undefined;
    
    // Check URL search params first
    const url = new URL(req.url);
    const queryDomain = url.searchParams.get("domain");
    if (queryDomain) {
      domain = queryDomain;
    } else {
      // Check JSON body
      try {
        const body = await req.json();
        if (body?.domain) {
          domain = body.domain;
        }
      } catch (e) {
        // Body was empty, proceed with global drill
      }
    }

    const attemptId = await assembleDailyRefresherDrill(userId, domain);
    return NextResponse.json({ success: true, attemptId, domain: domain || "GLOBAL" });
  } catch (err: unknown) {
    console.error("Daily drill generation error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to assemble daily refresher drill" },
      { status: 500 }
    );
  }
}
