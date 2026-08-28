import { getAllLearningModules } from "@/lib/modules";
import { Navbar } from "@/components/navbar";
import { LearnCatalog } from "./learn-catalog";
import { auth } from "@/lib/auth";
import { getAllUserModuleProgress } from "@/lib/srs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Modules — ECE Board Exam Review",
  description: "Interactive learning modules for Philippine PRC Electronics Engineering Board Exam review. Dual-method derivations, calculator shortcuts, and simulations.",
};

export default async function LearnPage() {
  const session = await auth();
  const userId = session?.user?.id || "00000000-0000-0000-0000-000000000001";

  const [modules, progressList] = await Promise.all([
    getAllLearningModules(),
    getAllUserModuleProgress(userId),
  ]);

  return (
    <>
      <Navbar breadcrumb="Learning Modules" />
      <LearnCatalog initialModules={modules} initialProgress={progressList} />
    </>
  );
}

