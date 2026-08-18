import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { questions } from "@/lib/db/schema";
import { getMockStore } from "@/lib/store";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export default async function ModuleViewerPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    notFound();
  }

  const { questionId } = await params;

  let questionHtml: string | null = null;
  let promptText = "Interactive Module";

  try {
    const [q] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (q) {
      questionHtml = q.interactiveHtml;
      promptText = q.promptText;
    }
  } catch {
    const store = getMockStore();
    const q = store.questions.get(questionId);
    if (q) {
      questionHtml = q.interactiveHtml;
      promptText = q.promptText;
    }
  }

  if (!questionHtml) {
    notFound();
  }

  return (
    <html lang="en" className="h-full">
      <head>
        <title>{promptText.slice(0, 40)} — Interactive Module</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="h-full m-0 p-0 overflow-hidden bg-neutral-900">
        <iframe
          title="Interactive Question Module"
          srcDoc={questionHtml}
          sandbox="allow-scripts"
          className="w-full h-full border-0 block"
        />
      </body>
    </html>
  );
}
