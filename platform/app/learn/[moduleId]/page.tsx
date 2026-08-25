import { notFound } from "next/navigation";
import { getLearningModuleById } from "@/lib/modules";
import { Navbar } from "@/components/navbar";
import { ModuleReader } from "./module-reader";
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
      title: "Module Not Found — Marnie Quiz",
    };
  }

  return {
    title: `${module.code}: ${module.subtopicTitle} — Learning Module`,
    description: `PRC ECE Board Exam interactive review module: ${module.subtopicTitle}. Dual-method derivations, speed shortcuts, and visual simulations.`,
  };
}

export default async function LearningModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const module = await getLearningModuleById(moduleId);

  if (!module) {
    notFound();
  }

  return (
    <>
      <Navbar breadcrumb={`${module.code} • ${module.subtopicTitle}`} />
      <ModuleReader module={module} />
    </>
  );
}
