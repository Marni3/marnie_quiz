import { auth } from "@/lib/auth";
import { getQuestionSetDetail } from "@/lib/quizzes";
import { getUserFolders } from "@/lib/folders";
import { Navbar } from "@/components/navbar";
import { QuizDetail } from "./quiz-detail";
import { notFound } from "next/navigation";

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ setId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";
  const { setId } = await params;

  const [quiz, folders] = await Promise.all([
    getQuestionSetDetail(setId, userId),
    getUserFolders(userId),
  ]);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      <Navbar breadcrumb={quiz.title} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <QuizDetail
          quiz={quiz}
          folders={folders}
          currentUserId={userId}
        />
      </main>
    </div>
  );
}
