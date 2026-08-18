"use client";

import { useTheme } from "./providers";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
        isDark
          ? "bg-[#363230] border-[#4a4542] text-[#b0a898] hover:border-[#e8895a] hover:text-[#e8895a]"
          : "bg-[#f0ebe0] border-[#d4c9b4] text-[#5c4a36] hover:border-[#c2622a] hover:text-[#c2622a]"
      } ${className}`}
      title="Toggle Light / Dark mode"
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#e8895a]" />
          <span>Light mode</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#c2622a]" />
          <span>Dark mode</span>
        </>
      )}
    </button>
  );
}
