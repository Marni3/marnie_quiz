import { auth } from "@/lib/auth";
import { getAttemptForTaking } from "@/lib/attempts";
import { QuizRunner } from "./quiz-runner";
import { notFound, redirect } from "next/navigation";

export default async function AttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";
  const { attemptId } = await params;

  const data = await getAttemptForTaking(attemptId, userId);

  if (!data) {
    notFound();
  }

  // If already completed, redirect to results
  if (data.attempt.completedAt) {
    redirect(`/attempts/${attemptId}/results`);
  }

  return (
    <QuizRunner
      attempt={data.attempt}
      questionSet={data.questionSet}
      questions={data.questions}
    />
  );
}
