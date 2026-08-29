export interface StreakState {
  currentStreak: number;
  maxStreak: number;
  lastActiveDate: string; // "YYYY-MM-DD"
  activeHistory: string[]; // List of unique "YYYY-MM-DD" active dates
  totalActivities: number;
}

export const STREAK_STORAGE_KEY = "marnie_study_streak_v1";

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

/**
 * Retrieve raw streak state from browser localStorage
 */
export function getRawStreakState(): StreakState {
  if (typeof window === "undefined") {
    return {
      currentStreak: 0,
      maxStreak: 0,
      lastActiveDate: "",
      activeHistory: [],
      totalActivities: 0,
    };
  }

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) {
      return {
        currentStreak: 0,
        maxStreak: 0,
        lastActiveDate: "",
        activeHistory: [],
        totalActivities: 0,
      };
    }
    const parsed = JSON.parse(raw);
    return {
      currentStreak: typeof parsed.currentStreak === "number" ? parsed.currentStreak : 0,
      maxStreak: typeof parsed.maxStreak === "number" ? parsed.maxStreak : 0,
      lastActiveDate: typeof parsed.lastActiveDate === "string" ? parsed.lastActiveDate : "",
      activeHistory: Array.isArray(parsed.activeHistory) ? parsed.activeHistory : [],
      totalActivities: typeof parsed.totalActivities === "number" ? parsed.totalActivities : 0,
    };
  } catch (err) {
    console.error("Failed to read streak state:", err);
    return {
      currentStreak: 0,
      maxStreak: 0,
      lastActiveDate: "",
      activeHistory: [],
      totalActivities: 0,
    };
  }
}

export interface DayStreakStatus {
  dayLabel: string; // "M", "T", "W", "T", "F", "S", "S"
  dateStr: string;  // "YYYY-MM-DD"
  active: boolean;
  isToday: boolean;
}

export interface StudyStreakInfo {
  currentStreak: number;
  maxStreak: number;
  activeToday: boolean;
  lastActiveDate: string;
  totalActivities: number;
  weeklyDays: DayStreakStatus[];
}

/**
 * Get comprehensive streak calculation and weekly 7-day progress
 */
export function getStudyStreak(): StudyStreakInfo {
  const raw = getRawStreakState();
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  const activeToday = raw.lastActiveDate === today;

  // If last activity was earlier than yesterday and not today, streak has lapsed
  let effectiveStreak = raw.currentStreak;
  if (!activeToday && raw.lastActiveDate !== yesterday && raw.lastActiveDate !== "") {
    effectiveStreak = 0;
  }

  // Generate 7-day sliding window (6 days ago -> today)
  const weeklyDays: DayStreakStatus[] = [];
  const DAY_NAMES = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d);
    const dayLabel = DAY_NAMES[d.getDay()];
    const isToday = dateStr === today;
    const active = raw.activeHistory.includes(dateStr);

    weeklyDays.push({
      dayLabel,
      dateStr,
      active,
      isToday,
    });
  }

  return {
    currentStreak: effectiveStreak,
    maxStreak: Math.max(raw.maxStreak, effectiveStreak),
    activeToday,
    lastActiveDate: raw.lastActiveDate,
    totalActivities: raw.totalActivities,
    weeklyDays,
  };
}

export type StudyActivityType = "quiz" | "module" | "drill" | "tutor" | "note";

/**
 * Record a study activity and update streak state
 */
export function recordStudyActivity(type: StudyActivityType): StudyStreakInfo {
  if (typeof window === "undefined") {
    return getStudyStreak();
  }

  try {
    const raw = getRawStreakState();
    const today = getLocalDateString();
    const yesterday = getYesterdayDateString();

    let newStreak = raw.currentStreak;

    if (raw.lastActiveDate === today) {
      // Already active today: maintain current streak
      newStreak = Math.max(1, raw.currentStreak);
    } else if (raw.lastActiveDate === yesterday) {
      // Studied yesterday: increment streak
      newStreak = raw.currentStreak + 1;
    } else {
      // First time or lapsed: start streak at 1
      newStreak = 1;
    }

    const historySet = new Set(raw.activeHistory);
    historySet.add(today);

    // Keep history capped at 90 days
    const updatedHistory = Array.from(historySet).slice(-90);
    const updatedMaxStreak = Math.max(raw.maxStreak, newStreak);

    const newState: StreakState = {
      currentStreak: newStreak,
      maxStreak: updatedMaxStreak,
      lastActiveDate: today,
      activeHistory: updatedHistory,
      totalActivities: raw.totalActivities + 1,
    };

    localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newState));

    // Dispatch global event for instant UI re-renders across all tabs & components
    window.dispatchEvent(
      new CustomEvent("marnie-streak-updated", {
        detail: { activityType: type, state: newState },
      })
    );

    // Non-blocking background sync to database
    fetch("/api/streak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityType: type }),
    }).catch(() => {});

    return getStudyStreak();
  } catch (err) {
    console.error("Failed to record study activity:", err);
    return getStudyStreak();
  }
}

/**
 * Syncs the local study streak with the database if the user is authenticated.
 */
export async function syncStreakWithServer(): Promise<StudyStreakInfo> {
  if (typeof window === "undefined") return getStudyStreak();
  try {
    const res = await fetch("/api/streak");
    if (res.ok) {
      const data = await res.json();
      if (data.authenticated && data.streak) {
        const localRaw = getRawStreakState();
        // Merge history sets
        const combinedHistory = Array.from(
          new Set([...localRaw.activeHistory, ...(data.streak.activeHistory || [])])
        ).slice(-90);

        const mergedMaxStreak = Math.max(localRaw.maxStreak, data.streak.maxStreak || 0);
        const mergedCurrentStreak = Math.max(localRaw.currentStreak, data.streak.currentStreak || 0);

        const newState: StreakState = {
          currentStreak: mergedCurrentStreak,
          maxStreak: mergedMaxStreak,
          lastActiveDate: data.streak.activeToday ? getLocalDateString() : (data.streak.lastActiveDate || localRaw.lastActiveDate),
          activeHistory: combinedHistory,
          totalActivities: Math.max(localRaw.totalActivities, data.streak.totalActivities || 0),
        };

        localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(newState));
        window.dispatchEvent(new CustomEvent("marnie-streak-updated", { detail: { state: newState } }));
        return getStudyStreak();
      }
    }
  } catch (err) {
    console.warn("Streak sync with server skipped:", err);
  }
  return getStudyStreak();
}
