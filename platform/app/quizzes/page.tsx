import { auth } from "@/lib/auth";
import { getLibraryQuizzes } from "@/lib/quizzes";
import { getUserFolders } from "@/lib/folders";
import { LibraryView } from "./library-view";

export default async function QuizzesPage() {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  const [quizzes, folders] = await Promise.all([
    getLibraryQuizzes({ userId }),
    getUserFolders(userId),
  ]);

  return (
    <LibraryView
      initialQuizzes={quizzes}
      initialFolders={folders}
      currentUserId={userId}
    />
  );
}
