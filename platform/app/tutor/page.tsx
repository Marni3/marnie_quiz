import { Suspense } from "react";
import { TutorView } from "./tutor-view";

export const metadata = {
  title: "AI Tutor Workspace | Marnie Quiz",
  description: "Personalized BYOK AI Tutor for Philippine PRC Electronics Engineering Board Exam prep.",
};

export default function TutorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-xs text-[var(--text3)]">Loading AI Tutor Workspace...</div>}>
      <TutorView />
    </Suspense>
  );
}
