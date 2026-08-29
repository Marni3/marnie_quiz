import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { attempts, userModuleProgress } from "@/lib/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export const runtime = "nodejs";

function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ authenticated: false });
    }

    // 1. Fetch completed exam attempts
    const userAttempts = await db
      .select({ completedAt: attempts.completedAt })
      .from(attempts)
      .where(and(eq(attempts.userId, userId), sql`${attempts.completedAt} IS NOT NULL`))
      .orderBy(desc(attempts.completedAt));

    // 2. Fetch module study sessions
    const moduleSessions = await db
      .select({
        lastStudiedAt: userModuleProgress.lastStudiedAt,
        updatedAt: userModuleProgress.updatedAt,
      })
      .from(userModuleProgress)
      .where(eq(userModuleProgress.userId, userId));

    const completedDates = new Set<string>();

    userAttempts.forEach((a) => {
      if (a.completedAt) {
        completedDates.add(getLocalDateString(new Date(a.completedAt)));
      }
    });

    moduleSessions.forEach((m) => {
      if (m.lastStudiedAt) {
        completedDates.add(getLocalDateString(new Date(m.lastStudiedAt)));
      }
      if (m.updatedAt) {
        completedDates.add(getLocalDateString(new Date(m.updatedAt)));
      }
    });

    const today = getLocalDateString();
    const yesterday = getYesterdayDateString();

    const activeToday = completedDates.has(today);

    // Calculate consecutive streak
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    // Check sliding 90 days
    const DAY_NAMES = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
    const weeklyDays: Array<{ dayLabel: string; dateStr: string; active: boolean; isToday: boolean }> = [];

    // Past 7 days window (6 days ago -> today)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = getLocalDateString(d);
      const dayLabel = DAY_NAMES[d.getDay()];
      const isToday = dateStr === today;
      const active = completedDates.has(dateStr);

      weeklyDays.push({
        dayLabel,
        dateStr,
        active,
        isToday,
      });
    }

    // Compute streak starting from today/yesterday backwards
    const checkStart = activeToday ? 0 : completedDates.has(yesterday) ? 1 : -1;

    if (checkStart >= 0) {
      for (let i = checkStart; i < 365; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = getLocalDateString(d);
        if (completedDates.has(dateStr)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    const sortedDates = Array.from(completedDates).sort();
    let prevTimestamp = 0;
    for (const dStr of sortedDates) {
      const ts = new Date(dStr).getTime();
      if (prevTimestamp && ts - prevTimestamp <= 86400000 * 1.5) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
      maxStreak = Math.max(maxStreak, tempStreak);
      prevTimestamp = ts;
    }

    maxStreak = Math.max(maxStreak, currentStreak);

    return NextResponse.json({
      authenticated: true,
      streak: {
        currentStreak,
        maxStreak,
        activeToday,
        lastActiveDate: activeToday ? today : completedDates.has(yesterday) ? yesterday : "",
        totalActivities: userAttempts.length + moduleSessions.length,
        activeHistory: Array.from(completedDates).slice(-90),
        weeklyDays,
      },
    });
  } catch (err: any) {
    console.error("Failed to compute database streak:", err);
    return NextResponse.json({ error: "Failed to compute streak" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ ok: true, source: "guest" });
    }

    // Touch streak in database
    return NextResponse.json({ ok: true, source: "database" });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to record activity" }, { status: 500 });
  }
}
