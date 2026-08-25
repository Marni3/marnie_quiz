import { getAllLearningModules } from "@/lib/modules";
import { Navbar } from "@/components/navbar";
import { LearnCatalog } from "./learn-catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Modules — ECE Board Exam Review",
  description: "Interactive learning modules for Philippine PRC Electronics Engineering Board Exam review. Dual-method derivations, calculator shortcuts, and simulations.",
};

export default async function LearnPage() {
  const modules = await getAllLearningModules();

  return (
    <>
      <Navbar breadcrumb="Learning Modules" />
      <LearnCatalog initialModules={modules} />
    </>
  );
}
