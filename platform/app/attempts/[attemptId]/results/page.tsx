import { auth } from "@/lib/auth";
import { getAttemptResults } from "@/lib/grading";
import { ResultsView } from "./results-view";
import { notFound } from "next/navigation";

export default async function AttemptResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";
  const { attemptId } = await params;

  const data = await getAttemptResults(attemptId, userId);

  if (!data) {
    notFound();
  }

  return (
    <ResultsView
      attempt={data.attempt}
      questionSet={data.questionSet}
      questions={data.questions}
      score={data.score}
      total={data.total}
      percentage={data.percentage}
    />
  );
}
