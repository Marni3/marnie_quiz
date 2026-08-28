"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, RefreshCw } from "lucide-react";

interface LaunchDrillButtonProps {
  className?: string;
  label?: string;
  domain?: string;
}

export function LaunchDrillButton({
  className,
  label = "Launch 20-Q Refresher Drill",
  domain,
}: LaunchDrillButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLaunch = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/srs/daily-drill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await res.json();
      if (data.success && data.attemptId) {
        router.push(`/attempts/${data.attemptId}`);
      } else {
        router.push("/quizzes");
      }
    } catch (err) {
      console.error("Failed to launch daily drill:", err);
      router.push("/quizzes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLaunch}
      disabled={loading}
      className={
        className ||
        "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white text-xs sm:text-sm font-bold shadow-md hover:brightness-110 active:scale-95 transition-all self-start cursor-pointer disabled:opacity-50"
      }
    >
      {loading ? (
        <RefreshCw className="w-4 h-4 animate-spin" />
      ) : (
        <Zap className="w-4 h-4 fill-current" />
      )}
      <span>{loading ? "Generating Drill..." : label}</span>
    </button>
  );
}
