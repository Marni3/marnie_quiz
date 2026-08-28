import { notFound } from "next/navigation";
import { getLearningModuleById, getMasteryChallenge } from "@/lib/modules";
import { Navbar } from "@/components/navbar";
import { MasteryRunner } from "./mastery-runner";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}): Promise<Metadata> {
  const { moduleId } = await params;
  const module = await getLearningModuleById(moduleId);

  if (!module) {
    return {
      title: "Mastery Challenge Not Found — Marnie Quiz",
    };
  }

  return {
    title: `${module.code} Mastery Challenge — ${module.subtopicTitle}`,
    description: `Exclusive companion mastery exam for ${module.code}: ${module.subtopicTitle}. Test shortcuts and exam retention under timed board exam conditions.`,
  };
}

export default async function MasteryChallengePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const module = await getLearningModuleById(moduleId);
  const mastery = await getMasteryChallenge(moduleId);

  if (!module || !mastery) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <MasteryRunner module={module} mastery={mastery} />
    </>
  );
}
