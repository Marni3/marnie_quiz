import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getLibraryQuizzes } from "@/lib/quizzes";
import { getUserFolders } from "@/lib/folders";
import { getUserTopicSrsOverview } from "@/lib/srs";
import { getUserAnalyticsOverview } from "@/lib/analytics";
import { getUserGamificationData } from "@/lib/gamification";
import { getAllLearningModules } from "@/lib/modules";
import { LibraryView } from "./library-view";

export default async function QuizzesPage() {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  const [quizzes, folders, srsOverview, analytics, learningModules] = await Promise.all([
    getLibraryQuizzes({ userId }),
    getUserFolders(userId),
    getUserTopicSrsOverview(userId),
    getUserAnalyticsOverview(userId),
    getAllLearningModules(),
  ]);

  const gamification = await getUserGamificationData(userId, analytics);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-4 sm:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-10 bg-[var(--surface)] rounded-2xl w-48" />
          <div className="h-12 bg-[var(--surface)] rounded-2xl" />
          <div className="h-64 bg-[var(--surface)] rounded-2xl" />
        </div>
      }
    >
      <LibraryView
        initialQuizzes={quizzes}
        initialFolders={folders}
        initialSrsOverview={srsOverview}
        gamificationData={gamification}
        initialLearningModules={learningModules}
        currentUserId={userId}
      />
    </Suspense>
  );
}
