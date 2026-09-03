"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Brain,
  BookMarked,
  Clock,
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  // If inside active quiz runner session, hide bottom nav to maximize focus
  const isQuizRunner = pathname.startsWith("/quizzes/") && pathname !== "/quizzes/upload" && pathname.split("/").length > 2;

  if (isQuizRunner) return null;

  const navItems = [
    {
      id: "library",
      label: "Library",
      href: "/quizzes",
      icon: BookOpen,
      isActive:
        pathname === "/quizzes" ||
        (pathname.startsWith("/quizzes/") && pathname !== "/quizzes/upload"),
    },
    {
      id: "learn",
      label: "Learn",
      href: "/learn",
      icon: GraduationCap,
      isActive: pathname === "/learn" || pathname.startsWith("/learn/"),
    },
    {
      id: "tutor",
      label: "Tutor",
      href: "/tutor",
      icon: Sparkles,
      isActive: pathname === "/tutor" || pathname.startsWith("/tutor/"),
    },
    {
      id: "retention",
      label: "Retention",
      href: "/analytics",
      icon: Brain,
      isActive: pathname === "/analytics",
    },
    {
      id: "history",
      label: "History",
      href: "/history",
      icon: Clock,
      isActive: pathname === "/history" || pathname.startsWith("/history/"),
    },
    {
      id: "notes",
      label: "Notes",
      href: "/notes",
      icon: BookMarked,
      isActive: pathname === "/notes" || pathname.startsWith("/notes/"),
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-lg border-t border-[var(--border)] h-16 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom,0px)] shadow-lg"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-label={item.label}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-all ${
              item.isActive
                ? "text-[var(--accent)] font-bold scale-105"
                : "text-[var(--text3)] hover:text-[var(--text2)]"
            }`}
          >
            <div
              className={`p-1 rounded-xl transition-colors ${
                item.isActive ? "bg-[var(--accent)]/10 text-[var(--accent)]" : ""
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
