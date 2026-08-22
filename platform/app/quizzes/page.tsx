import { auth } from "@/lib/auth";
import { getLibraryQuizzes } from "@/lib/quizzes";
import { getUserFolders } from "@/lib/folders";
import { getUserTopicSrsOverview } from "@/lib/srs";
import { getUserAnalyticsOverview } from "@/lib/analytics";
import { getUserGamificationData } from "@/lib/gamification";
import { LibraryView } from "./library-view";

export default async function QuizzesPage() {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  const [quizzes, folders, srsOverview, analytics] = await Promise.all([
    getLibraryQuizzes({ userId }),
    getUserFolders(userId),
    getUserTopicSrsOverview(userId),
    getUserAnalyticsOverview(userId),
  ]);

  const gamification = await getUserGamificationData(userId, analytics);

  return (
    <LibraryView
      initialQuizzes={quizzes}
      initialFolders={folders}
      initialSrsOverview={srsOverview}
      gamificationData={gamification}
      currentUserId={userId}
    />
  );
}
